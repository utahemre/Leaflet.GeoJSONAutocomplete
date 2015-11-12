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
  - Ajax request sends 3 parameter to your service.
    - **search** query parameter
    - **offset** starting index (for paging)
    - **limit** maximum result count
- **placeholderMessage:** Placeholder message for search box.  
- **searchButtonTitle:** Title of search button.  
- **clearButtonTitle:** Title of Clear button.  
- **foundRecordsMessage:** Found message  
- **limit:** Maksimum recourd count for evert search  
- **notFoundMessage:** Not found message  
- **notFoundHint:** Nof found hint 
- **drawColor:** Color for Linestring and polygon geometries.    
- **pointGeometryZoomLevel:** Zoom level for point geometries. -1 means use leaflet default.

#Test your service response

[Test it!](https://utahemre.github.io/geojsontest.html)

Your geojson features must have 4 properties
- **title:** Main title seen in autocomplete results  
- **description:** More details seen in automplete results  
- **popupContent:** Content seen in popups.  
- **image:** Images seen in autocomplete results (read from image folder) 

#License

Leaflet.GeoJSONAutocomplete is free software, and may be redistributed under the MIT License. 

Please let me know your comments and usage. 

