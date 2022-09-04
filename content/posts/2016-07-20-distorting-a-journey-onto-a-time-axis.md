---
title: Distorting a journey onto a time axis
date: 2016-07-20
---

Yesterday, I talked about how to [build a custom map project in proj.4 and mapnik](/2016/07/19/beginning-to-make-a-custom-map-projection-with-mapnik-and-proj.4/). I started this project, because I wanted to "unfold" a geographic journey, so that one axis was temporal, and the other was spatial.

Before I started messing around with Proj.4, I created a quick demo of this by stretching a raster map image. However, this had legibility issues as it stretched the text, roadway widths, etc.

![](/images/2016-07-20/map5.png)

What am I actually trying to show with this distorted map? Imagine a series of visited places, such as the following:

![](/images/2016-07-20/map_comparison.png)

Now, relax the line connecting them so that it doesn't have sharp edges.

![](/images/2016-07-20/second_map_comparison.png)

Then, imagine unfolding the map, so that the line plotted above forms the horizontal axis, and the vertical axis is perpendicular to the line. Using a custom proj.4 projection, we can do this, while maintaining legibly rendered text!

![](/images/2016-07-20/map_demo.png)

However, it is clear that this is not a particularly interpretable or usable way of rendering a map.
