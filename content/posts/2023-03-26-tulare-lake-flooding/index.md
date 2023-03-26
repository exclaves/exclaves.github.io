---
title: Flooding in Tulare Lake basin
date: 2023-03-26
images: [/2023/03/26/flooding-in-tulare-lake-basin/assets/preview.jpg]
---

<link href="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js"></script>

A quick map from Sentinel-1 SAR (satellite radar) imagery that shows recent flooding in the San Joaquin Valley around the Tulare Lake Basin and the towns of Corcoran, Alpaugh and Allensworth. Inundated areas can be distinguished in dark black.

<div id="map" style="width: 100%; max-height: 100vh; height: 800px;"></div>
<script>
mapboxgl.accessToken = 'pk.eyJ1IjoibG9nYW53IiwiYSI6IlQzWHJqc3cifQ.KY3j-syHXeYmI69JmLqGqQ';
const map = new mapboxgl.Map({
container: 'map', 
style: 'mapbox://styles/loganw/clfpc845t00fe01qitdnrfs44', // style URL
center: [-119.60212, 36], 
zoom: 10.4,
maxBounds: [[-120.026794, 35.627178], [-119.325475, 36.218539]]
});
map.addControl(new mapboxgl.NavigationControl());
</script>

Imagery is from Sentinel-1 pass on March 26th, 2023 at 01:59 UTC.