---
layout: post
title: 'Updates to iNaturalist "locals" and "tourists"'
date: 2025-08-20 00:00:00 +0000
images: [/2025/08/20/updates-to-inaturalist-locals-and-tourists/Screenshot%202025-08-20%20at%205.00.20%E2%80%AFPM_hu5f80ce2f61b4c5965a1a1752bbf7bfe1_3885826_1800x1800_fit_box_3.png]
---

<style>
    figure, video, .multi {
        width: 100% !important;
        margin: auto !important;
    }

    figure img {
        max-width: 100% !important;
    }
</style>

Back in 2023, I downloaded every [research grade observation](https://www.gbif.org/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7) from iNaturalist and made a [map that classified each one as a "local" or a "tourist,"](https://exclav.es/2023/03/22/inaturalist-observations-locals-and-tourists/) depending on the length of the observer's history in that area.

iNaturalist has only grown since, and updating the data for 2025 was long overdue! Dario [shared it in the iNat forum](https://forum.inaturalist.org/t/locals-and-tourists-on-inaturalist-a-data-visualization-project/68982) earlier this week, and this wave of interest was good motivation.

As of this week, the data has been updated to use observations until August 5, 2025. Thank you to past me for taking detailed notes about the data processing and deployment steps.

Along the way I also added a new feature — statistics on observations over time to complement the map.

### Observations over time 

The data contains rich time detail that I never tried to represent in the map visualization directly. For this update, I added a synchronized stacked bar chart that shows the observations per month for your current view.

<div class="multi">
<video style="width: 100%" nocontrols autoplay muted loop playsinline src="inat-example.mp4" title="stats graph in inat locals and tourists"></video>
</div>

When zoomed out, observations accumulate into aggregate clusters that don't contain detailed time information. Because of this limitation, the stats view only works while quite zoomed in. Through careful [tippecanoe](https://github.com/felt/tippecanoe) massaging, zoom 11 and above contain exclusively raw points to enable this feature.

#### Some things to see in the time series

The growth of iNaturalist in the UK, and seasonal patterns in London. Note that the seasonal pattern is stronger for "tourists" than for "locals"!

{{< img "Screenshot 2025-08-20 at 5.00.20 PM.png" >}}

Palm Springs, California has the opposite seasonal variation.

{{< img "Screenshot 2025-08-20 at 5.02.41 PM.png" >}}

The overall growth of tourism in Colombia is apparent, especially in cities like Bogotá.

{{< img "Screenshot 2025-08-20 at 4.58.41 PM.png" >}}

As is the impact of COVID-19 on tourism in Costa Rica, here at Lake Arenal.

{{< img "Screenshot 2025-08-20 at 4.55.43 PM.png" >}}

## Observations on iNat forums

It's been great to see what other people notice about the map in their iNaturalist posts.

Vireya looked in Australia:

<div class="multi" style="width: 70% !important; margin: auto !important;">
{{< img "Screenshot 2025-08-20 at 8.48.50 PM.png" >}}
</div>

Tom Wainwright wondered about the tendency of rural observers to travel geographically farther, and if that could explain some of the urban/rural correlation with local/tourist he saw in Oregon.

<div class="multi" style="width: 70% !important; margin: auto !important;">
{{< img "Screenshot from 2025-08-17 15-24-23.png" >}}
</div>

User keirmorse noticed that the main official trails at Pinnacles National Park were mainly "tourist" observations, while the backcountry areas were almost exclusively "local."

<div class="multi" style="width: 70% !important; margin: auto !important;">
{{< img "image.jpg" >}}
</div>
Dario explored the difference between the old and udpated datasets and made a GIF of changes in Costa Rica while toggling between 2023 and 2025.

<div class="multi" style="width: 70% !important; margin: auto !important;">
{{< img "ezgif-3c0ea257a50169.gif" "GIF of Costa Rica between 2023 and 2025" >}}
</div>

Still other iNaturalist forum users discussed finding their own observations on the map, seeing where others in their community were exploring nature, and the map's utility as a biodiversity "hotspot" finder. I'm really grateful to folks in the iNat forum for sharing how they use the tool and what they noticed.

If you have any questions or thoughts, please reach out to me over <a href="mailto:logan.williams@alum.mit.edu">email</a>.