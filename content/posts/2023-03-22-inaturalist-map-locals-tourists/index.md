---
layout: post
title: 'iNaturalist observations: "locals" and "tourists"'
date: 2023-03-22 00:00:00 +0000
images: [/2023/03/22/inaturalist-observations-locals-and-tourists/assets/sf_hu7fba9da1679ce4a56c592454604cb9c1_692694_1800x1800_fit_q75_box.jpg]
---

In 2010, cartographer <a href="https://twitter.com/enf/" target="_blank">Erica Fischer</a> made some simple and spectacular <a href="https://www.flickr.com/photos/walkingsf/albums/72157624209158632/" target="_blank">maps of images added to Flickr</a>. She classified photos as either from "locals" or "tourists", based on how far their profile location was from the photo's geotag. These maps revealed fascinating psycogeographic patterns of urban exploration and photographic worthiness.

Last summer, Dario Taraborelli suggested extending this to iNaturalist observations.

<div style="display: flex; justify-content: center">
{{< tweet user="ReaderMeter" id="1536038627213398016" >}}
</div>

It's taken a while, but here it is:

<figure>
<iframe src="https://subject.space/projects-static/inaturalist" width="100%" height="700px"></iframe>
</figure>

<a href="https://subject.space/projects-static/inaturalist" target="_blank">
<h3 style="text-align: center; margin-top: -0.5em; margin-bottom: 0em; border: 1px solid black; border-radius: 2px; padding: 8px; display: inline-block;">⛶ View in a new tab</h2></a>


## Observations and thoughts

### San Francisco

It's nice to look at places that you know well to get bearings for how the map represents data. Here's San Francisco and Marin:

<div style="width: 80%; margin-left: auto; margin-right: auto;">

{{< img "assets/sf.jpg" "A map of San Francisco highlighting observations by 'tourists' and 'locals'" >}}

</div>

Expectedly, we see that the Embarcadero and Fisherman's Wharf are bright orange, indicating many observations from "tourists". Muir Woods also stands out as a visitor hotspot, and in contrast the surrounding trails around Mt. Tamalpais contain primarily local observations.

Where are people finding access to nature within urban centers? Clearly in San Francisco, the Embarcadero (and Alcatraz) are places where visitors notice and interact with urban wildlife. What are these locations in your city? Are there opportunities to enhance the natural aspects of these destinations, or to make urban ecosystems more legible to visitors?

### How it works

Each dot on the map is an observation on iNaturalist (or, if you are zoomed out, a cluster of observations.) If a user has more than 3 months of observation history in the local area (difference between the earliest and latest observation), that point is tagged as "local". Otherwise, it is tagged as "tourist". Users with very little observation history are rendered in gray, since it is not possible to tell.

Of course, this methodology has some substantial limitations. The "tourist" and "local" labels are not really accurate, just memorable monikers for the two groups (and an allusion to Erica Fischer's earlier maps, mentioned above.) Notably, it is not possible to know if a user is really local to an area or has just visited it multiple times, as on an annual holiday. Similarly, a user's observations might be classified as "tourist" in their hometown if they have only used iNaturalist previously while traveling.

### Holiday destinations

Still, there are compelling patterns. Low population density areas that are popular vacation destinations, like the American Southwest and the Alps, clearly have more "tourist" observations.

<div class="multi">
{{< img "assets/ut.jpg" "A map of the American southwest, including national parks, showing a high percentage of 'tourist' observations" >}}

{{< img "assets/alps.jpg" "A map of the Alps, including national parks, showing a high percentage of 'tourist' observations" >}}

</div>

### Central America

Another geographic region that stands out globally is Central America, especially Costa Rica. The majority of iNaturalist observations in Costa Rica are by users that do not have extensive history in the region.

<div style="width: 80%; margin-left: auto; margin-right: auto;">

{{< img "assets/centralamerica.jpg" "A map of Central America highlighting observations by 'tourists' and 'locals'. Costa Rica has many tourist observations." >}}

</div>

This is unsurprising given Costa Rica's popularity for tourism and iNaturalist's userbase, which still tilts towards the Global North.

This could indicate that despite the large number of observations in the region, the local iNaturalist community has room to grow, reach more local residents, and become more robust.

## Technical details

I downloaded iNaturalist observations in <a href="https://www.gbif.org/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7" target="_blank">bulk from GBIF</a>, which means that this only includes "research-grade" observations. The data is from November 2022, but I am working on updating it with a more recent extract.

I initially tried to calculate the number of observations by the same user within a radius of each of their observations. However, even with a Postgres/PostGIS query that seemed to be taking advantage of every indexing opportunity it had, this would take months.

<div style="width: 80%; margin-left: auto; margin-right: auto;">

```
SELECT * FROM observations
CROSS JOIN LATERAL (
    SELECT COUNT(*) AS n, MIN("eventDate") AS first, MAX("eventDate") AS last
    FROM observations o
    WHERE o."inaturalistLogin" = observations."inaturalistLogin"
    AND ST_DWithin(o.geom_merc, observations.geom_merc, 25000)
) near
LEFT JOIN posts_by_user
ON posts_by_user.username = observations."inaturalistLogin"
```

</div>

Though `CROSS JOIN LATERAL` was pretty cool, I needed a different approach and used <a href="https://wolf-h3-viewer.glitch.me/" target="_blank">H3 tiles</a> at size 3. I was a little worried that this would result in some visible boundary effects, but it seems to be a good approximation.

It took some work with `tippecanoe` in order to tile the data in a way that looked nice at low zooms. Clustering points worked well once I tuned the parameters.

To serve the data for webmaps, <a href="https://bdon.org/" target="_blank">Brandon Liu's</a> <a href="https://github.com/protomaps/PMTiles" target="_blank">PMTiles</a>. It's really amazing work, and HTTP Range Requests are magical. Mapbox would have charged me somewhere between $120 and $3750 per month for tileset hosting, but instead, I have put a single file in an S3 bucket and PMTiles requests what it needs.

{{< img "assets/ca.jpg" "A map of iNaturalist observations in California highlighting observations by 'tourists' and 'locals'" >}}
