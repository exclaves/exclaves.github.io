---
title: Solving 'the following layers were not correctly generated' in QGIS SAGA
date: 2023-08-22
---

I was working on a map recently and tried to use SAGA in QGIS to make a multilevel b-spline raster from some scattered vector points. (More to come tomorrow!) However, I kept getting the vague error "The following layers were not correctly generated."

{{< img "Screenshot 2023-08-24 at 2.47.21 PM.png" "a screenshot of the error" >}}

I found some [Stack Overflow](https://gis.stackexchange.com/questions/221924/the-following-layers-were-not-correctly-generated-grid) posts with the same error but my problem seemed unrelated to the filename/disk space issues mentioned. As I experimented with the data, I discovered two circumstances that produce this rather vague error:

- Attempting to interpolate a field with a space (or possibly other non-alphanumeric characters) in the name
- Attempting to interpolate a non-numeric field

So if you're encountering this, check that you're interpolating a numeric field with a short alphanumeric name.