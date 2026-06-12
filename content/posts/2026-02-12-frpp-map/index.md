---
layout: post
title: "What the United States owns: a federal real property profile map"
date: 2026-02-22 00:00:00 +0000
images: [/2026/02/22/what-the-united-states-owns-a-federal-real-property-profile-map/image.jpg]
---

The federal government of the United States has a vast footprint. Real property -- that is, land, buildings and other fixed structures that can't be easily moved -- possessed by the United States includes military bases and border checkpoints, scenic highways and historic bridges, court houses, post offices, warehouses for schools, warehouses for spaceflight, warehouses on Pacific islands, propagation buildings and the Reptile Discover Center, buoys and gunranges, laboratories for nuclear research and laboratories for tree fruit, schools and childcare centers and airport control towers, barracks and datacenters, ranger stations and weather radar systems and greenhouses in Panama and hospitals and farm field offices and so on.

A map of this footprint shows the cities and rivers and mountains of the United States as much as it shows the political history of the United States. We all interact with the federal government, but so often with a _different_ federal government.

<iframe src="https://subject.space/projects-static/frpp/" width="100%" style="height: calc(100vh - 80px); max-height: 1000px"></iframe>

Click the fullscreen button in the upper right to go fullscreen, or <a href="https://subject.space/projects-static/frpp" target="_blank">click here to open in a new tab</a>.

### FOIA exemptions

One of the columns in the FRPP dataset is "FOIA Exemption". There is just one property in the dataset with an exemption of "Geological Information". Under the Department of Homeland Security. I wonder what its deal is.

{{< img "af3f44bc0b1a7cf1.jpg" >}}

### Highlighted places

[Department of Agriculture](https://subject.space/projects-static/frpp/?agency=AGRICULTURE&owned=1&leased=1&lng=-100.27708&lat=32.51491&zoom=4.26). In the West, the Department of Agriculture means forests. In the East, the agency serves a different role and follow a different pattern.

{{< img "agriculture.jpeg" >}}

Someone told me it's all happening at the [zoo](https://subject.space/projects-static/frpp/?agency=SMITHSONIAN&owned=1&leased=1&lng=-77.02258&lat=38.91093&zoom=13.17).

{{< img "smithsonianzoo.jpeg" >}}

[Government data centers](https://subject.space/projects-static/frpp/?category=Building%257CData%2520Centers&owned=1&leased=1&lng=-102.21041&lat=38.83439&zoom=4.30)

{{< img "datacenters.jpeg" >}}

The [global diplomatic footprint](https://subject.space/projects-static/frpp/?agency=STATE&owned=1&leased=1&lng=5.64922&lat=-21.30009&zoom=1.85) of the US State Department.

{{< img "state.jpeg" >}}

[The Bureau of Reclamation](https://subject.space/projects-static/frpp/?agency=INTERIOR&bureau=BUREAU%2520OF%2520RECLAMATION&owned=1&leased=1&lng=-97.57463&lat=32.97502&zoom=4.11) built the West.

{{< img "reclamation.jpeg" >}}

[Navigation aids](https://subject.space/projects-static/frpp/?category=Structure%257CNavigation%2520and%2520Traffic%2520Aids%2520%28other%2520than%2520buildings%29&owned=1&leased=1&lng=-85.95060&lat=35.93923&zoom=5.12). It's so <a href="https://www.filmcomment.com/wp-content/uploads/sites/2/2020/04/Screen-Shot-2020-04-07-at-3.28.19-PM_INLINE-e1587663087876-960x0-c-default.jpg" target="_blank">geographical</a>.

{{< img "navigation.jpeg" >}}

[Old properties](https://subject.space/projects-static/frpp/?owned=1&leased=1&yearMin=1400&yearMax=1750&lng=-76.40989&lat=37.97694&zoom=5.91) are mostly under the National Parks Service, but there are a few elsewhere, for example at Veteran's Affairs.

{{< img "old.jpeg" >}}

[The oldest property](https://subject.space/projects-static/frpp/?owned=1&leased=1&yearMin=1400&yearMax=1750&lng=-83.60464&lat=32.84046&zoom=16.18&satellite=1) is at the Ocmulgee Mounds in present Georgia. 

<div class="multi">
{{< img "ocmulgee.jpeg" >}}
{{< img "ocmulgee_im.jpg" >}}
</div>

### Data sources

Data is from [Federal Real Property Profile data](https://www.gsa.gov/policy-regulations/policy/real-property-policy-division-overview/asset-management/federal-real-property-profile/federal-real-property-public-data-set), [National Map data](https://www.usgs.gov/programs/national-geospatial-program/national-map) and [USPS FOIA data](https://about.usps.com/who/legal/foia/owned-facilities.htm). The quality of geocoding varies in these public datasets, please assume locations are approximate. Some of the locations did not contain geolocation info, or were geolocated to [Null Island](https://en.wikipedia.org/wiki/Null_Island). For these I used the Mapbox geocoder with the data available, which was often only to a city/town name.