---
layout: post
title: "Ten simple steps"
date: 2026-01-16 00:00:00 +0000
description: "take another shot / cut off the head / drill out the holes / disturb the soil / spend how much money / rinse the hair / tack up your horse / move your thumb / remove the seeds / play the chords"
---

<style>
    .poem {
        margin-top: 2em;
        margin-bottom: 2em;
    }

    .poem div {
        font-family: 'Times New Roman', 'Times', serif;
        margin: 0;
        font-size: 16px;
    }
</style>

<div class="poem">
</div>

<hr>

<div class="poem">
</div>

<hr>

<div class="poem">
</div>

<hr>

Refresh for more.

<script>
fetch('phrases.json').then(d => d.json()).then(phrases => {
    let poems = document.getElementsByClassName('poem');

    Array.from(poems).forEach(poem => {
        for (let i = 0; i < 10; i++) {
            let line = document.createElement('div');
            poem.appendChild(line);

            if (Math.random() < 0.3) {
                line.textContent = phrases['three'][Math.floor(Math.random() * phrases['three'].length)];
            } else {
                line.textContent = phrases['four'][Math.floor(Math.random() * phrases['four'].length)];
            }
        }
    });
})
</script>
