# Leaflet.GeoJSONAutocomplete
Leaflet Search Bar For Remote Searching with GeoJSON Services.

#Usage

Just add   
```html
<div id="searchContainer"></div> 
```
tag to your html and  
```javascript
var options = {
  geojsonServiceAddress: "http://yourgeojsonsearchaddress"
};
$("#searchContainer").GeoJsonAutocomplete(options);
```
to your window.onload function.

#Options

- **geojsonServiceAddress:** Address of your geojson service. 
- **placeholderMessage:** Placeholder message for search box.  
- **searchButtonTitle:** Title of search button.  
- **clearButtonTitle:** Title of Clear button.  
- **foundRecordsMessage:** Found message  
- **limit:** Maksimum recourd count for evert search  
- **notFoundMessage:** Not found message  
- **notFoundHint:** Nof found hint 
- **drawColor:** Color for Linestring and polygon geometries.    
- **pointGeometryZoomLevel:** Zoom level for point geometries. -1 means use leaflet default.

#License

Leaflet.loading is free software, and may be redistributed under the MIT License.

