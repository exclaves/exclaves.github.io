---
layout: post
title: Making a map of 11,145 birds
date: 2024-11-22 00:00:00 +0000
images:
  [
    /2024/11/22/making-a-map-of-11145-birds/map_final_hu7fba9da1679ce4a56c592454604cb9c1_487783_1800x1800_fit_q75_box.jpg,
  ]
---

[What percentage of the bird species in the Netherlands do I recognize? What percentage of the world would _they_ "recognize"?](https://subject.space/projects-static/ebird/)

{{< img "map_final.jpg" "A map of the percentage of bird species at each place in the world that I've seen" >}}

I can stare for hours at the range maps in bird guides. A single species with habitat spanning arid steppes to frigid wetlands. Another species restricted to a (sky) island. These maps tell a story not only of bird adaptability and sensitivity but also, as the rustling of leaves in the wind, the diversity of landscapes and natural geographic barriers in the environment.

<video controls style="display: block; max-width: 800px; margin-left: auto; margin-right: auto; filter: invert(100%); mix-blend-mode: screen;" autoplay muted>
<source src="ranges.mp4" />
</video>

I scraped range data from [eBird maps](https://ebird.org/map/comgol?env.minX=-179.99999999291&env.minY=20.7575836593022&env.maxX=179.326113654898&env.maxY=79.0324681419765), and rendered new maps that showed the overlaid ranges of all the birds possible at an individual location. These maps show pelagic and littoral biomes, mountain ranges, deserts, landscapes with relative uniformity (Europe) and the [biases of citizen science](https://exclav.es/2023/03/22/inaturalist-observations-locals-and-tourists/).

Making this interactive range map experiment at 1/4 the resolution of the map needed around 128 x 128 maps — or around 16,000 total. This was a doable amount to pre-generate.

But the map which shows the percentage of bird species at each location that are ticked off on an arbitrary lifelist cannot be pregenerated. Creating this map requires taking a specific selection of bird species from among 11,145 total and rendering a bespoke map of the scaled ranges for that subset. I first tried building this as a Python service accessed via a REST API.

<div class="multi" style="filter: invert(100%);">
{{< img "1.jpg" >}}
{{< img "2.jpg" >}}
</div>

However, the latency in this version was pretty high (5-10 seconds) and while it could probably be improved with less `scipy`, I thought it would be more fun to build it client side in WebGL shaders. The rest of this blog post is about that process.

## Making a map with WebGL

The goal is to count some number of birds for each pixel, then scale that to a colormap. To do this for an arbitrary subset of the birds, as we would for an arbitrary lifelist, requires a range map for each of 11,145 birds.

Is this feasible? At 512 x 512 px, that's almost 3 GB if each pixel gets a full byte — but a binary threshold is okay, so I can pack 8 birds in a byte. I just need 1394 1-byte per pixel 512 x 512 textures — or 365 MB of textures. Kind of a lot, but maybe it will work?

### Packing the data

To do this, I made an NRRD file that's 512 x 512 x 1394 bytes. Then this is loaded into ThreeJS as a UInt8 texture. It's important to set interpolation to nearest neighbor, as interpolation between packed values doesn't work.

```
function createTexture(volume) {
    // Texture to hold the volume. We have scalars, so we put our data in the red channel.
    // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    const texture = new THREE.DataArrayTexture(
        volume.data,
        volume.xLength,
        volume.yLength,
        volume.zLength
    );

    texture.format = THREE.RedFormat;
    texture.type = THREE.UnsignedByteType;
    texture.internalFormat = "R8";
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    material.uniforms[name].value = texture;

    if (sizename) {
        material.uniforms[sizename].value = new THREE.Vector3(
        volume.xLength,
        volume.yLength,
        volume.zLength
        );
    }

    render();
};
```

The `THREE.DataArrayTexture` object is just an array of 2D textures, which seemed well suited for this usecase. Inside the fragment shader, that's a `sampler2DArray` that's accessed with `texture`. (Before I tried this, I loaded a three-dimensional texture, which supported the same `texture` access. I think the only difference is the normalization of the third coordinate, but I'm not sure!)

With all the bits packed into this texture, the core of the fragment shader is the reduction of a weighted sum across all of these species at the current pixel position.

Adjusting the map mode changes the weight value:

- In the default mode (`0`) the weight is the number of species at that mouse position, creating the species range maps that captivated me.
- The other modes use the life lists as a weight, where a bird is only counted if it is seen/recognized; or alternatively only if it hasn't.

```
// Loop over each layer of the packed data. We want to color each pixel based on the number of species
// (packed bits) that are present at that pixel and also at the mouse position. We do this with a weighted
// sum of the unpacked values.
for(i = 0; i < packed_size; i += 1) {
    // Read the data from the texture for this u,v position and convert to int (it should be uint8)
    raw = int(255.0 * texture(u_data, vec3(1.0 - uv.y, uv.x, i)).r);

    // Mode 3 (recognized birds)
    if(u_mode < -2) {
        // Read the weight from the recognized birds texture
        raw_w = int(255.0 * texelFetch(u_recognizedbirds, ivec2(i, 0), 0).r);

    // Mode 2 (birds yet to see)
    } else if(u_mode < -1) {
        // Read the weight from the seen birds texture
        raw_w = 0xFF - int(255.0 * texelFetch(u_seenbirds, ivec2(i, 0), 0).r);

    // Mode 1 (birds seen)
    } else if(u_mode < 0) {
        // Read the weight from the seen birds texture
        raw_w = int(255.0 * texelFetch(u_seenbirds, ivec2(i, 0), 0).r);

    // Mode 0 (birds at the mouse position)
    } else {
        // Read the data from the texture for the mouse uniform position and convert to int
        raw_w = int(255.0 * texture(u_data, vec3(ms.y, ms.x, i)).r);
    }

    // Each byte contains 8 packed species, so we accumulate each one
    for(ii = 0; ii < 8; ii += 1) {
        // Extract the relevant bits
        extracted = float((raw >> ii) & 1);
        extracted_w = float((raw_w >> ii) & 1);

        // Accumulate the color. Only if a species is present at the u,v, position and at
        // the mouse position will it be accumulated
        count += extracted * extracted_w;
    }
}
```

#### (texelFetch vs texture?)

Halfway through building this I learned about `texelFetch`. It uses integer pixel coordinates for lookup instead of the normalized float values that `texture` uses. This is perfect for getting values out of the seen/recognized birds arrays. `texture` is more convenient when working with normalized coordinates, like the mouse and pixel position.

### Normalization

Now the working value is a raw count of birds. Before this can be applied to a colormap, it needs to be scaled/normalized in some way.

This can either be a global factor, or a per-pixel count to compute the percentage of possible birds at that location.

The first case is more complicated as I can't necessarily compute the maximum number of species over the whole map -- the computation of each pixel in the shader has only its local view. Since I didn't want to come up with some javascript two-pass solution, I had to make some guesses. For the seen birds, this is half the total number of seen birds in that list -- though this obviously fails in the extrema. For someone who has seen 10,000 birds, this would map counts from 0-5000 -- despite the fact the global maximum of birds seen in one spot is much less than this.

<video controls style="display: block; max-width: 800px; margin-left: auto; margin-right: auto;" autoplay muted>
<source src="modes.mp4" />
</video>

```
if(u_normalize > 0) {
    maxvec = texture2D(u_maxdata, vec2(uv.x, uv.y));
} else {
    maxvec = texture2D(u_maxdata, vec2(ms.x, 1.0 - ms.y));
}

int maxr = int(255.0 * maxvec.r);
int maxg = int(255.0 * maxvec.g);
float maxcountraw = float((maxr << 8) + maxg);

float maxcount = max(10.0, maxcountraw);

if(u_mode < 0 && u_normalize == 0) {
    if(u_mode < -2) {
        // Since we can't compute the real maximum over the whole map, we take the total birds seen times a factor
        maxcount = maxcountraw = float(u_recognizedbirdscount) * 0.6;
    } else if(u_mode < -1) {
        // a random guess
        maxcount = maxcountraw = 900.0;
    } else {
        // Since we can't compute the real maximum over the whole map, we take the total birds seen times a factor
        maxcount = maxcountraw = float(u_seenbirdscount) * 0.5;
    }
}

float ratio = count * (1.0 / maxcount);
```

### Colormap lookup

In the last step, a simple colormap lookup, and transparency for locations with little data.

```
// Lookup in colormap
color0 = texture2D(u_cmdata, vec2(pow(ratio, 0.7), 0.5));
color0.a = max(0.0, min(1.0, maxcountraw / 5.0));
```

### Geographic projections

The scraped eBird data is in Web Mercator. It would be better to present this data in an equal area projection that does not understate the size of equatorial parts of the globe -- especially considering the goals of these maps and the species diversity of these regions.

With everything generated on-the-fly in WebGL, it was pretty easy to experiment with projections. Equal Earth is relatively simple to implement (especially compared to the multiple splines of something like Robinson) and worked well for this dataset.

The `equalEarthInverse` function interprets a uv coordinate in projected Equal Earth space and converts it to a latitude and longitude. Then `convert_to_uv` takes a latitude and longitude and returns the uv coordinate in a projected Web Mercator space, which can be used for texture lookup.

The basemap is rendered with D3 in an entirely separate process. Annoyingly, despite using the same constants for the projections as far as I can tell, I had to hand tweak some magic constants in order to get the layers perfectly aligned.

```
vec2 equalEarthInverse(vec2 xy) {
    // Constants for the Equal Earth inverse projection function
    const float A1 = 1.340264;
    const float A2 = -0.081106;
    const float A3 = 0.000893;
    const float A4 = 0.003796;
    const float M = sqrt(3.0) / 2.0;
    const float PI = 3.1415926535897932384626433832795;

    // Scale from 0-1 to actual projection coordinates
    // These are hand-tweaked magic numbers for lining up the projection to D3
    xy = xy * 2.0 - 1.0;
    float x = xy.x * M * 0.995 * PI;
    float y = -0.42 * xy.y * PI;

    // Calculate theta using Newton's method
    float theta = y;
    float delta;
    for(int i = 0; i < 12; i++) {
        float theta2 = theta * theta;
        float theta4 = theta2 * theta2;
        float theta6 = theta4 * theta2;

        float delta = (theta * (A1 + A2 * theta2 + A3 * theta6 + A4 * theta4 * theta4) - y) / (A1 + 3.0 * A2 * theta2 + 7.0 * A3 * theta6 + 9.0 * A4 * theta4 * theta4);

        theta = theta - delta;

        if(abs(delta) < 1e-6)
            break;
    }

    // Calculate longitude and latitude
    float theta2 = theta * theta;
    float theta4 = theta2 * theta2;
    float theta6 = theta4 * theta2;

    float beta = asin(2.0 * sin(theta) / sqrt(3.0));
    float lambda = x * sqrt(3.0) * (A1 + 3.0 * A2 * theta2 + 7.0 * A3 * theta6 + 9.0 * A4 * theta4 * theta4) / (2.0 * cos(theta));

    // Convert to degrees and normalize
    float lon = degrees(lambda);
    float lat = degrees(beta);

    // Normalize longitude to [-180, 180]
    lon = mod(lon + 180.0, 360.0) - 180.0;

    return vec2(lon, lat);
}

vec2 convert_to_uv(vec2 lng_lat) {
    float x = (lng_lat.x + 180.0) / 360.0;
    float y = 1.0 - (log(tan(3.1415926535897932384626433832795 / 4.0 + radians(lng_lat.y) / 2.0)) / 3.1415926535897932384626433832795 + 1.0) / 2.0;
    return vec2(x, y);
}
```

### Memory limitations on mobile

Working with WebGL on mobile, especially on iOS, was a bit frustrating. Safari seems to limit maximum WebGL memory of around 256MB. Unfortunately teh 512 x 512 texture array described is 365 MB.

This resolution is unnecessary near the poles because of the Web Mercartor projection. I tried splitting it a high resolution equator and low resolution polar areas in 240 MB total. However, even this was not completely reliable, and Safari would sometimes crash after a few interactions. These WebGL memory kills aren't nice crashes either — it not only silently breaks the WebGL rendering, even refreshing the page doesn't restart it, only restarting Safari entirely is sufficient.

So in the end I just made a lower resolution version (256 x 256) that is loaded when a mobile browser is detected.

## Other features I like

When testing the early, non-WebGL version, a feature I really enjoyed was mousing over the bird list and seeing the geographic distribution for one bird at a time in rapid succession.

Unfortunately, when I tested this out on the internet, it wasn't nearly as satisfying. Each range image is small, but the request and time to download it ruined the effect.

WebGL has a solution though! The map uses the 1-bit value to display a map quickly while the more detailed eBird image is loaded.

<video controls style="display: block; max-width: 800px; margin-left: auto; margin-right: auto;" autoplay muted>
<source src="species_mouseover2-sm.mp4" />
</video>

```
if(u_mode > 0) {
    // Display a single species, index is u_mode - 1
    int layer = (u_mode - 1) / 8;
    int ii = (u_mode - 1) - layer * 8;

    raw = int(255.0 * texture(u_data, vec3(1.0 - uv.y, uv.x, layer)).r);
    shifted = (raw >> ii) & 0x01;

    if(shifted == 0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    gl_FragColor = vec4(float(shifted) * 0.9, float(shifted) * 0.58, float(shifted) * 0.9, 1.0);
    return;
}
```

## Lingering issues

- In order to render the shader, I used ThreeJS and made a scene with a camera pointing at a plane. There must be an easier way, right?

- I really can't figure out what is causing the extraneous bird data along the edge of the map, in places where there are no eBird observations and the shader output should be blank. Have a guess? Let me know.

- I could make the data look better by creating my own maps from eBird's raw data instead of scraping their generated maps. There are probably some nuances to get right with matching their percentage-of-complete-checklists data, but this would allow for higher resolution and more spatially consistent range data.

## visual appearance

I have no justification or apology for the user interface, which came to me in a skeumorphic fever dream.
