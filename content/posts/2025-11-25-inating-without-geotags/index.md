---
layout: post
title: "Using iNaturalist with non-geotagged photos: approximate bulk geotagging"
date: 2025-11-25 00:00:00 +0000
images: [/2025/11/25/using-inaturalist-with-non-geotagged-photos-approximate-bulk-geotagging/images/3_hu7fba9da1679ce4a56c592454604cb9c1_667842_1800x1800_fit_q75_box.jpeg]
---

<style>
    .inaturalist img {
        filter: brightness(100%);
    }
</style>

While hiking, I like to [take photos](https://exclav.es/2024/08/21/dovrefjell/) [of nature things](https://exclav.es/2025/08/23/dinacon-2025-photos-and-observations/) to figure out later and post to [iNaturalist](https://www.inaturalist.org/people/1125610). But most non-phone cameras don't add geotags (geographic location info) to images, and uploading these to iNat is a pain.

One way to solve this is by logging your own position with a smartwatch or app, but my smartwatch was stolen and I often don't have the cellphone battery for Strava.

However, I do remember where I was, and have photos that tie those locations to times. I made a tool, [Linetime](https://subject.space/linetime/#/) ([source](https://github.com/loganwilliams/linetime)), for adding timestamps to a GPX file, which I can use for bulk geotagging photos in Lightroom.

## My iNaturalist geotagging method

Using a tool like [CalTopo](https://caltopo.com/), I trace out the route that I explored. In the case of a day hiking, I usually know exactly what trails I took, and they often exist in OpenStreetMap data.

{{< img "images/1.jpeg" "" >}}

Export the route from CalTopo and import into [Linetime](https://subject.space/linetime/#/).

{{< img "images/2.jpeg" "" >}}

Find images with known locations and grab the timestamps.

<div class="multi">
{{< img "images/3.jpeg" "" >}}
{{< img "images/4.jpeg" "" >}}
</div>

Set keypoints in [Linetime](https://subject.space/linetime/#/). After doing this, other points will have their time interpolated by distance along the line.

<div class="multi">
{{< img "images/5.jpeg" "" >}}
{{< img "images/6.jpeg" "" >}}
</div>

It's important to have a keypoint at the beginning and end.

<div class="multi" style="width: 100%; margin-left: auto;">
{{< img "images/7.jpeg" "" >}}
</div>

I normally add around 8 keypoints.

<div class="multi" style="width: 100%; margin-left: auto;">
{{< img "images/8.jpeg" "" >}}
</div>

The interpolation is often surprisingly accurate from a small number of points. This picture was taken on top of a ridge at 4:41 PM, and the interpolated time in the route is 4:39 PM.

<div class="multi">
{{< img "images/9.jpeg" "" >}}
{{< img "images/10.jpeg" "" >}}
</div>

Download the GPX trace from [Linetime](https://subject.space/linetime/#/), then import into Lightroom and geotag the photos.

<div class="multi">
{{< img "images/11.jpeg" "" >}}
{{< img "images/12.jpeg" "" >}}
</div>

The positions might not always be 100% accurate, but they will be within a few hundred meters. Arguably this is a better default for certain sensitive organisms.

<div class="multi">
{{< img "images/13.jpeg" "" >}}
{{< img "images/14.jpeg" "" >}}
</div>

<div class="multi" style="width: 100%; margin-left: auto;">
{{< img "images/15.jpeg" "" >}}
</div>

I usually flag all of the photos with organisms in Lightroom, export, and then use the web interface in iNaturalist to bulk upload. No more manually locating each image from memory!

{{< img "images/16.jpeg" "" >}}

## The observations from this hike

Using an [iNaturalist Hugo shortcode](https://exclav.es/2022/09/05/inaturalist-shortcode-for-hugo/) I wrote, including all of the observations below is just `{{</* inatday 16 11 2025 */>}}`.

{{< inatday 16 11 2025 >}}