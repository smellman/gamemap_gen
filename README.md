# Create game map (tile map without coordinates)

Create game map with [PhantomJS](http://phantomjs.org/).

## Example with leaflet.js

Use [L.CRS.Simple](http://leafletjs.com/reference-1.0.0.html#crs-l-crs-simple).

```
<script>
 var map;
 var init = function() {
   var zoom = 14;

   map = L.map('map', {
     maxZoom: 15,
     minZoom: 14,
     crs: L.CRS.Simple
   });
   map.setView(map.unproject([256, 256], zoom), zoom);
   var layer = L.tileLayer('tile/{z}/{x}_{y}.png').addTo(map);
 };
</script>
```

# How to use

```
phantomjs make_tiles.js <input file> <output directory>
```

## Checking

```
phantomjs make_tiles.js <input file> site_js/tile
open site_js/index.html
```

# Why {x}_{y} ?

- Game map's tile will be lower than normal map's tile in same zoom level.
- Easy to check tile images.

# License

MIT License.

# Original program

https://github.com/smellman/railstilemap
