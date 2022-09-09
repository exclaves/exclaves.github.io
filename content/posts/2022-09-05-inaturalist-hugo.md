---
title: iNaturalist shortcode for Hugo
date: 2022-09-05
images: [https://inaturalist-open-data.s3.amazonaws.com/photos/80478157/large.jpeg]
---

For my recent post about the [Alta Via 1](/2022/09/04/alta-via-n.-1/), I wanted to integrate iNaturalist observations. To make this easier, I made a Hugo shortcode that calls the iNaturalist API and renders an observation in detail automatically.

This turns

`{{</* inat "https://www.inaturalist.org/observations/50674264" */>}}`

into

{{< inat "https://www.inaturalist.org/observations/50674264" >}}

The source code for this shortcode is below. It can be placed in `/layouts/shortcodes/`.

{{< gist loganwilliams a79bb4b49e388e5cd4e5f2523901fcd0 "inat.html" >}}

To look nice, it will also require some CSS integration into the theme that is used. A sample set of CSS rules is here:

{{< gist loganwilliams a79bb4b49e388e5cd4e5f2523901fcd0 "inat.css" >}}