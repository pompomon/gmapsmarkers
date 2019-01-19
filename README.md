# gmapsmarkers
Init google maps and show markers on click

# Installation
`npm install`

# Running
`watch.cmd`
`node index.js`
0. Get Google Maps Javascript API key and insert it into `public/index.html` instead of `KEY` placeholder
1. Open http://127.0.0.1:3000/
2. Click needed markers
3. Click Export and copy latlong array
4. On popup close the markers would be removed automatically

## Polygons
To draw a polygon select "Polygon" from a dropdown and then click on the map
Export would return all vertices
To finish polygon with more than 2 vertices you can right-click anywhere on the map and it would automatically complete path from last vertex to the first one.