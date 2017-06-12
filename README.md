# OSSH
See http://lorenzostella.it/on/ossh for more details about the project.

## About
The Open Source Security Hub (OSSH) idea came up after the local OWASP chapter raised the need for a system aiming at bringing together security experts and projects in need. I quickly realized I could help out by building it as a project for my mobile- and web-programming course at the university.The ChallengeTaking the example of many platforms focused on crowdsourced security (Bugcrowd, HackerOne, Crowdcurity, Synack) I opted to develop a framework to make the process simple and intuitive.

I presented this personal project for my "Web and Mobile Developing" class.

## Screenshots
#### The homepage, call to action modal and registration
![homepage, call to action modal and registration](http://lorenzostella.it/on/ossh/1.png "homepage, call to action modal and registration")

#### The Researchers and the Project Managers dashboard
![Researcher dashboard and Project Manager dashboard](http://lorenzostella.it/on/ossh/2.png "Researcher dashboard and Project Manager dashboard")

## Technology
Server side, Drywall is built with the [Express](http://expressjs.com/)
framework, using [MongoDB](http://www.mongodb.org/) as a data store.

The front-end is built with [Backbone](http://backbonejs.org/), using [Grunt](http://gruntjs.com/) for the asset pipeline.

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    |             |
| Mongoose      | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |


## Requirements
You need [Node.js](http://nodejs.org/download/) and
[MongoDB](http://www.mongodb.org/downloads) installed and running.

The app use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing
secrets. If you have issues during installation related to `bcrypt` then [refer
to this wiki
page](https://github.com/jedireza/drywall/wiki/bcrypt-Installation-Trouble).

The app use [`emailjs`](https://github.com/eleith/emailjs) for email transport. If
you have issues sending email [refer to this wiki
page](https://github.com/jedireza/drywall/wiki/Trouble-sending-email).
