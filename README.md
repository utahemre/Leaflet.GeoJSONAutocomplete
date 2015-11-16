# Leaflet.GeoJSONAutocomplete
Leaflet Search Bar For Remote Searching with GeoJSON Services.

It requires Leafletjs and JQuery. It has beeen tested with Leaflet 0.7.3 and JQuery 1.11.3

<a href="https://utahemre.github.io/geojsonautocompletedemo.html" target="_blank">Demo</a>

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
    - **offset** starting index (If pagingActive parameter is true)
    - **limit** maximum result count
- **placeholderMessage:** Placeholder message for search box.  
- **searchButtonTitle:** Title of search button.  
- **clearButtonTitle:** Title of Clear button.  
- **foundRecordsMessage:** Found message  
- **limit:** Maksimum recourd count for every search  
- **notFoundMessage:** Not found message  
- **notFoundHint:** Nof found hint 
- **drawColor:** Color for Linestring and polygon geometries.    
- **pointGeometryZoomLevel:** Zoom level for point geometries. -1 means use leaflet default.
- **pagingActive:** If your geojson service supports paging (accepts offset parameter) change this to true.

#Paging Mode
If your geojson service supports paging (accepts offset paramter), you can activate paging with pagingActive parameter in options. 
When you type any text and press Enter(or click Search Button), Autocomplete runs with paging mode. In paging mode Autocomplete draw all geometries on map in a page.

#Test your service response

<a href="https://utahemre.github.io/geojsontest.html" target="_blank">Test it!</a>


Your geojson features must have 4 properties
- **title:** Main title seen in autocomplete results  
- **description:** More details seen in automplete results  
- **popupContent:** Content seen in popups.  
- **image:** Images seen in autocomplete results (read from image folder) 

#License

Leaflet.GeoJSONAutocomplete is free software, and may be redistributed under the MIT License. 

Please let me know your comments and usage. 

