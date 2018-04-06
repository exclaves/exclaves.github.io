---
layout: post
title: Adjustable FOV webmaps with Mapbox
date: 2018-04-06 00:00:00 +0000
---
I remember when it was a big deal when web maps started allowed arbitrary slipping and sliding, instead of moving in fixed increments. Then, it was super cool once we could rotate a map an arbitrary direction -- north didn't have to be up anymore! Then GPS navigation made everyone familiar with the _pitch_ of a map as an adjustable quantity too. But there are more ways of adjusting a projection!

Since Mapbox GL renders everything using WebGL on a canvas natively, it is straightforward to let every camera parameter be editable too. I recently [forked the repository](github.com/loganwilliams/mapbox-gl-js) to add support for editable field of view (FOV).

The field of view property is so named because it represents an action similar to changing the angular FOV of a camera lens. However, unlike what we're used to with long focal length lenses, in computer rendering we can easily change this parameter without also adjusting zoom. This allows the relative _perspective_ of the render to be adjusted -- the angles of converging lines and the relationship in spatial scale of the foreground and background.