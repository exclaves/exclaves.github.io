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

```
from flask import Flask, request
from twilio.twiml.voice_response import VoiceResponse
import random
from waitress import serve
app = Flask(__name__)

facts = [
    "A study conducted by a University of Florida researcher traces the existence of opossums as far back as the extinction of dinosaurs.",
    "Due to an opossum's low body temperature and successful immune system, it's very rare for one to carry rabies.",
    "In northern regions, opossums often have abnormally short tails - the ends are lost due to frostbite.",
    "The Virginia opossum has more teeth than any other North American Mammal - 50, to be exact.",
    "The Virginia opossum is the only marsupial that inhabits the U.S.",
    "Opossums move around a lot. They typically live in hollow logs, rock crevices, pipes, attics, and beneath buildings.",
    "Opossums are non-aggressive and non-destructive. They do not dig into the soil or destroy property. They will not harm people or pets.",
    "Persimmons are one of the opossum's favorite foods during the long night."
]

@app.route("/answer", methods=['GET', 'POST'])
def answer_call():
    """Respond to incoming phone calls with a brief message."""

    number = request.values.get('From')[2:]

    resp = VoiceResponse()

    if number == "2248777663":
        resp.say("Welcome to the Possum Facts administrator menu. Say",  voice='alice')
        resp.play('http://fog.today/possummenu1.mp3')
        resp.say("to add a fact. Say",  voice='alice')
        resp.play('http://fog.today/possummenu2.mp3')
        resp.say("to update the flag. The current flag is NGW19{POGO_POSSUM}",  voice='alice')

        resp.pause(length=1)

        resp.say("I'm sorry, I couldn't understand that. Please call back later.")
    else:
        resp.say("Thank you for calling Possum Facts! The number you are calling from, " + number + " is not associated with a Possum Facts account. Enjoy your free possum fact.", voice='alice')
    
        resp.play('http://fog.today/possumhello.mp3')

        fact = facts[random.randint(0, len(facts) - 1)]
        resp.say(fact, voice='alice')

    return str(resp)

if __name__ == "__main__":
    serve(app, port=5000)
```