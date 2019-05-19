---
layout: post
title: 'NGW 2019: a possum-based CTF puzzle'
date: 2019-05-17 00:00:00 +0000
---

I just returned from Recurse Center's Never Graduate Week 2019 -- an inspiring week of old and new friends and a familiar company. Like last year, I got roped into making a quick puzzle for this year's friendly Capture the Flag created by a friend of mine. It's about possums.

Give it a call! (224) 877-7663

Source code and spoilers below!

![A picture of a juvenile possum](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Baby_opossum.jpg/376px-Baby_opossum.jpg)

I really wanted to make something that involved phone spoofing and it worked out pretty well. Most participants eventually figured out that they needed to call back from a different number, as clued by the intro to the possum facts hotline.

Using Twilio was remarkbly easy! One consequence that I hadn't thought about was that the top few search results for phone spoofing services all banned dialing the number I had set up due to the volume of CTF participant calls.

{% gist https://gist.github.com/loganwilliams/a76dbed51fc3cdf8185dbaef9dc7e6f5 %}
