---
layout: post
title: Recurse Center - Recently
date: 2018-03-17 00:00:00 +0000
---
Besides the [interactive art jam and Tidal Cycles live coding workshops](http://exclav.es/2018/03/15/recurse-center-workshops/), I've been up to a lot at Recurse Center recently.

On Wednesday, I launched [Conceptquest](https://subject.space/projects-static/conceptquest/), an interactive hypertext adventure game based on navigating Conceptnet, a dataset of real world relations between concepts that I've been fascinated by since I learned about it 18 months ago. Conceptquest is itself an evolution of a [Twitter poetry bot](https://twitter.com/ConceptNetPoet) that I also created at RC a few weeks back. Conceptquest is built in [React](github.com/loganwilliams/conceptquest).

I also put a [pre-release version of a map of the realtime train positions on the NYC Subway](http://fog.today/nyc) online. This is the first [Golang backend](github.com/loganwilliams/where-are-the-trains) I've written, and while it's simple, I've learned a lot. The front end is built with React and Mapbox. This is also the first Dockerized application I've built, but it certainly won't be the last — deployment on Digital Ocean was a breeze. I've been hearing good things about [dokku](https://github.com/dokku/dokku), and I might try that with my next project.

I'm reading [A Curious Moon](https://bigmachine.io/products/a-curious-moon) and learning a lot about Postgres and relational databases. This is helpful, as the next version of the realtime NYC Subway map is storing historic data in a Postgres database, so that I will be able to show historical and current statistics on subway train status.

Speaking of reading, I've been reading two important non-technical books as well. Rebecca Solnit's _Men Explain Things to Me_ is one I've meant to read for a while —  because it is an important work in the current moment, because I love Rebecca Solnit's writing, and because I know I have been guilty of explaining things to people that know the thing better than I do. The stand out essay in this collection was _Woolf's Darkness_, an unexpected celebration of the unknowable future and our unknowable, diverse, shapeshifting identities. Of course, all wrapped up in the limited opportunities that women have had for expressing this diversity of identity. (Had I not already been familiar with the titular essay, I likely would have found it to the stand out!)

The second book is _The Color of Law_. I have never read a book with an introduction as important, clear, and powerful as this book. I normally hate book introductions, but my jaw dropped reading this. Read this book.

I built a new version of [my portfolio website](http://subject.space/), using Hugo instead of some custom Python scripts like I was using before. I'm pretty happy with the Times New Roman 12pt aesthetic, but still trying to figure out if there's a way to better integrate my blog into it. At the same time, I don't want to sacrifice the freedom that I feel here to post and talk about half-baked projects and ideas.

I discovered a bunch of small, unexpectedly named parks around NYC, and this inspired me to train a recurrent neural network on park names. People had fun guessing which parks were real and which were generated, so I [made a game out of it](https://subject.space/projects-static/parks-game/). This was a 24 hour project that I had a lot of fun building, though the code quality isn't the greatest.

I've been reading _7 Languages in 7 Weeks_, and am spending the weekend on Prolog. It's been a great set of exercises for broadening my programming language familiarity. (Did you know Ruby as a True class and a False class, but no Boolean class?)

I applied to be a Toolmaker-in-Residence at [Signal Culture](http://signalculture.org/), and was accepted! So I'll be there in April, continuing to work on tools for generating [Isometric Spacelapses](http://subject.space/projects/isometric-spacelapse/).

I wrote a talk proposal for !!Con, because it seemed like fun. I don't expect it to get selected, but it was my first time thinking about what I might talk about in a conference environment, and was a fun design exercise. If my bluff is called on this, however, things could get interesting.

Speaking of fun design exercises, I participated in a hackathon on the topic of the L train mitigation last weekend. Our team was composed of a couple people with experience in marketing, and a couple open data and visualization enthusiasts. The hackathon itself was a bit confusing, as the transit and transportation parts of mitigating the shutdown seem pretty solidly figured out. But our team found a kind of clever way to re-interpret the shutdown as an opportunity for local economic development. Our unlikely idea won third place!

Alison, Leanne, Will and I applied to the Knight Foundation's Arts Prototyping Grant. \[exp\]

I [forked Mapbox GL](https://github.com/loganwilliams/mapbox-gl-js) to add real support for some of the FOV experimentation that I was doing. This still needs work into to avoid camera configurations that crash/severely slow the renderer.

I finally wrote up some of the [geographic exploration of property values, wealth, and wildfires in Southern California](http://exclav.es/2018/03/16/property-values-and-the-wildland-urban-interface/) that I was working on in December.

I've started working on figuring out jobs and such, and getting excited about what's coming up next. But this means that I might have to set down some of these projects in an unfinished state. At least loose ends make it easy to grab onto something when I come back!