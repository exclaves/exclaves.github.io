---
title: "Sunshine maps, revisited"
date: 2023-08-24
---

I've always thought [these sunshine maps](https://commons.wikimedia.org/wiki/File:Europe_sunshine_hours_map.png) were a little suspicious.

{{< img "assets/old_map.jpeg" "a map of the annual sunshine hours in the US and Europe." >}}

Not just the JPEG artifacts, but is Ohio really that much sunnier than France? Britain is dreary, but is it so dreary that Estonia is brighter?

Maybe it was the gloomy weather in Amsterdam but for some reason I tried to recreate this map the other day. A few hours messing around with a [dataset from the World Metereological Organization](https://data.un.org/Data.aspx?d=CLINO&f=ElementCode%3A15%3BCountryCode%3AKO) answered many of these questions.

<div class="multi">
{{< img "assets/europe.png" "a map of solar hours in europe" "(Same scale as first map.)">}}
{{< img "assets/us.png" "a map of solar hours in the us" "(Same scale as first map.)" >}}
</div>

Is the huge difference between the US and Europe real? Oh yes. Europe is not very sunny. Thermal clouds form less often over water than land, partially explaining the Baltic brightness.

There are many data choices that affect the output. WMO dataset is inconsistently distributed. Europe is fairly evenly sampled, however there isn't a single station in Turkey with data. Depending on the interpolation algorithm that you use to generate the raster, cities can generate pockmarks that don't seem logical with the local topography.

{{< img "assets/sampling.png" >}}

While the map on Wikimedia does not provide detailed information about the data source (citing only "national data"), I suspect that the WMO dataset shares many properties of the data used for the original maps.

This makes particularly absurd maps when applied to the entire globe.

{{< img "assets/planet.png" "a map of solar hours over the entire globe with some noticeably strange regions" "(Same scale as first map.)">}}

A better representation of this data is to look at solar power irradiance maps, like those from [Global Solar Atlas](https://globalsolaratlas.info/) which estimate the amount of power available for solar cells. This is different from sunshine hours in that it depends on the intensity of the radiation, so it emphasizes equatorial regions more than a map of sunshine hours.

<div class="multi">
{{< img "assets/europe_2.png" >}}
{{< img "assets/us_2.png" >}}
</div>

By the way, check this out if [SAGA's B-spline interpolation fails with "the following layers were not correctly generated."](https://exclav.es/2023/08/22/solving-the-following-layers-were-not-correctly-generated-in-qgis-saga/)