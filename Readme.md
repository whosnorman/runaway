Runaway 
=========
####Let us make your escape plan.
#####Version 1.0

Runaway is a road-trip generator made to pair you up with local travelers for a weekend of affordable and time efficient fun.


--------------
Tech

Runaway uses a number of API's/Platforms to work properly:

- [Mail Jet] - Awesome e-mail delivery service. 
- [Google Maps] - Render maps on the fly client-side
- [Twitter Bootstrap] - Great UI for the website
- [Node.js] - Evented I/O for the backend
- [Express.js] - Framework used to build the REST-based backend
- [Meteor.js] - Build apps that use Node.js client-side and server-side
- [jQuery] - duh 
- [Digital Ocean] - Put this app on the Interwebz
- [Google Directions] - Calculates directions/distance between locations
- [Google Geocoding] - Reverse-geocode a bunch of lat/lon's


Prerequisites
--------------
* [Node.js] - Tested with version v0.10.29
* [Meteor.js] - Tested with v0.9.4

--------------
Installation
--------------

```sh
git clone https://github.com/mattohagan/runaway.git runaway
cd runaway/backend
npm install
```
--------------
Starting the server
--------------
#####The Backend
```sh
cd runaway/backend
node serve.js
```
#####The Frontend
```sh
cd runaway/frontend
meteor --port 3000
```
#####Point your favorite browser to http://localhost:3000 and Runaway!

--------------
License
--------------
MIT

[Mail Jet]:http://mailjet.com
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[jQuery]:http://jquery.com
[Node.js]:http://nodejs.org
[Express.js]:http://expressjs.com
[Meteor.js]:http://meteor.com
[Digital Ocean]:http://digitalocean.com
[Google Directions]:https://developers.google.com/maps/documentation/directions/
[Google Geocoding]:https://developers.google.com/maps/documentation/geocoding/
[Google Maps]:https://developers.google.com/maps/
