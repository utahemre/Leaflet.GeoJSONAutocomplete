# Leaflet.GeoJSONAutocomplete
Leaflet Autocomplete For Remote Searching with GeoJSON Services. 

<a href="https://utahemre.github.io/geojsonautocompletedemo.html" target="_blank">Demo</a>

This plug-in runs with classical autocomplete logic. Users type in search box and plug-in sends ajax request to your geojson service. 

It requires Leafletjs and JQuery. It has beeen tested with Leaflet 0.7.3 and JQuery 1.11.3

#Example Request and Response

When users type 'Ankara' in search box. Plug-in sends a ajax request with 3 parameters like the following.

http://yourGeoJsonSearchAddress?search=Ankara&limit=10&offset=0 (Parameters is explained in Options Section)

Your response should be valid GeoJson like the following

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    32.84,
                    39.92
                ]
            },
            "properties": {
                "popupContent": "Content seen in Popup",
                "title": "Title seen in Autocomplete",
                "description": "Additional information seen in Autocomplete",
                "image": "example.png"
            }
        }
    ]
}
```
#Test your service response

<a href="https://utahemre.github.io/geojsontest.html" target="_blank">Test it!</a>

Your geojson features must have 4 properties
- **title:** Main title seen in autocomplete results  
- **description:** More details seen in autocomplete results  
- **popupContent:** Content seen in popups.  
- **image:** Images seen in autocomplete results (read from image folder) 

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
- **limit:** Maximum record count for every search  
- **notFoundMessage:** Not found message  
- **notFoundHint:** Nof found hint 
- **drawColor:** Color for Linestring and polygon geometries.    
- **pointGeometryZoomLevel:** Zoom level for point geometries. -1 means use leaflet default.
- **pagingActive:** If your geojson service supports paging (accepts offset parameter) change this to true.

#Paging Mode
If your geojson service supports paging (accepts offset parameter), you can activate paging with pagingActive parameter in options. 
When you type any text and press Enter(or click Search Button), Autocomplete runs with paging mode. In paging mode Autocomplete draw all geometries on map in a page.

#License

Leaflet.GeoJSONAutocomplete is free software, and may be redistributed under the MIT License. 

Please let me know your comments and usage. 

Thanks to <a href="http://www.citysurf.com.tr" target="_blank">CitySurf</a> to inspire and support this plugin.

