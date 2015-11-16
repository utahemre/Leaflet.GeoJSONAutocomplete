;
(function ($) {

    var options = {
        geojsonServiceAddress: "http://yourGeoJsonSearchAddress",
        placeholderMessage: "Search...",
        searchButtonTitle: "Search",
        clearButtonTitle: "Clear",
        foundRecordsMessage: "showing results.",
        limit: 10,
        notFoundMessage: "not found.",
        notFoundHint: "Make sure your search criteria is correct and try again.",
        drawColor: "blue",
        pointGeometryZoomLevel: -1 //Set zoom level for point geometries -1 means use leaflet default.
    };

    var activeResult = -1;
    var resultCount = 0;
    var lastSearch = "";
    var searchLayer;
    var focusLayer;
    var searchLayerType; // 0 --> One geometry, 1--> Multiple
    var features = [];
    var featureCollection = [];
    var offset = 0;
    var collapseOnBlur = true;

    $.fn.GeoJsonAutocomplete = function (userDefinedOptions) {

        var keys = Object.keys(userDefinedOptions);

        for (var i = 0; i < keys.length; i++) {
            options[keys[i]] = userDefinedOptions[keys[i]];
        }


        $(this).each(function () {
            var element = $(this);
            element.addClass("searchContainer");
            element.append('<input id="searchBox" class="searchBox" placeholder="' + options.placeholderMessage + '"/>');
            element.append('<input id="searchButton" class="searchButton" type="submit" value="" title="' + options.searchButtonTitle + '"/>');
            element.append('<span class="divider"></span>');
            element.append('<input id="clearButton" class="clearButton" type="submit"  value="" title="' + options.clearButtonTitle + '">');

            $("#searchBox")[0].value = "";
            $("#searchBox").delayKeyup(function (event) {
                switch (event.keyCode) {
                    case 13: // enter
                        searchButtonClick();
                        break;
                    case 38: // up arrow
                        prevResult();
                        break;
                    case 40: // down arrow
                        nextResult();
                        break;
                    case 37: //left arrow, Do Nothing
                    case 39: //right arrow, Do Nothing
                        break;
                    default:
                        if ($("#searchBox")[0].value.length > 0) {
                            offset = 0;
                            getValuesAsGeoJson(false);
                        }
                        else {
                            clearButtonClick();
                        }
                        break;
                }
            }, 300);

            $("#searchBox").focus(function () {
                if ($("#resultsDiv")[0] !== undefined) {
                    $("#resultsDiv")[0].style.visibility = "visible";
                }
            });

            $("#searchBox").blur(function () {
                if ($("#resultsDiv")[0] !== undefined) {
                    if (collapseOnBlur) {
                        $("#resultsDiv")[0].style.visibility = "collapse";
                    }
                    else {
                        collapseOnBlur = true;

                        window.setTimeout(function ()
                        {
                            $("#searchBox").focus();
                        }, 0);
                    }
                }

            });

            $("#searchButton").click(function () {
                searchButtonClick();
            });

            $("#clearButton").click(function () {
                clearButtonClick();
            });
        });
    };

    $.fn.delayKeyup = function (callback, ms) {
        var timer = 0;
        $(this).keyup(function (event) {

            if (event.keyCode !== 13 && event.keyCode !== 38 && event.keyCode !== 40) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback(event);
                }, ms);
            }
            else {
                callback(event);
            }
        });
        return $(this);
    };

    function getValuesAsGeoJson(withPaging) {

        activeResult = -1;
        features = [];
        featureCollection = [];
        var limitToSend = options.limit;
        if (withPaging) {
            limitToSend++;
        }
        lastSearch = $("#searchBox")[0].value;

        lastSearch = lastSearch.replace(/[^a-zA-Z0-9 ğüışöçÖÇŞĞÜİ]/g, '');

        if (lastSearch === "") {
            return;
        }

        $.ajax({
            url: options.geojsonServiceAddress,
            type: 'GET',
            data:
                    {
                        search: lastSearch,
                        offset: offset,
                        limit: limitToSend
                    },
            dataType: 'json',
            success: function (json) {

                if (json.type === "Feature") {
                    resultCount = 1;
                    features[0] = json;
                    featureCollection = json;
                }
                else {
                    resultCount = json.features.length;
                    features = json.features;
                    featureCollection = json.features.slice(0, json.features.length - 1);
                }
                createDropDown(withPaging);
                searchLayerType = (withPaging ? 1 : 0);
            },
            error: function () {
                processNoRecordsFoundOrError();
            }
        });

    }

    function createDropDown(withPaging) {
        var parent = $("#searchBox").parent();

        $("#resultsDiv").remove();
        parent.append("<div id='resultsDiv' class='result'><ul id='resultList' class='list'></ul><div>");

        $("#resultsDiv")[0].style.position = $("#searchBox")[0].style.position;
        $("#resultsDiv")[0].style.left = (parseInt($("#searchBox")[0].style.left) - 10) + "px";
        $("#resultsDiv")[0].style.bottom = $("#searchBox")[0].style.bottom;
        $("#resultsDiv")[0].style.right = $("#searchBox")[0].style.right;
        $("#resultsDiv")[0].style.top = (parseInt($("#searchBox")[0].style.top) + 25) + "px";
        $("#resultsDiv")[0].style.zIndex = $("#searchBox")[0].style.zIndex;

        var loopCount = features.length;
        var hasMorePages = false;
        if (withPaging && features.length === options.limit + 1) { //Has more pages
            loopCount--;
            hasMorePages = true;
            resultCount--;
        }

        for (var i = 0; i < loopCount; i++) {

            var html = "<li id='listElement" + i + "' class='listResult'>";
            html += "<span id='listElementContent" + i + "' class='content'><img src='./image/" + features[i].properties.image + "' class='iconStyle' align='middle'>";
            html += "<font size='2' color='#333' class='title'>" + features[i].properties.title + "</font><font size='1' color='#8c8c8c'> " + features[i].properties.description + "<font></span></li>";

            $("#resultList").append(html);

            $("#listElement" + i).mouseenter(function () {
                listElementMouseEnter(this);
            });

            $("#listElement" + i).mouseleave(function () {
                listElementMouseLeave(this);
            });

            $("#listElement" + i).mousedown(function () {
                listElementMouseDown(this);
            });
        }

        if (withPaging) {
            var prevPic = "prev.png";
            var nextPic = "next.png";
            var prevDisabled = "";
            var nextDisabled = "";

            if (offset === 0) {
                prevPic = "prev_dis.png";
                prevDisabled = "disabled";
            }

            if (!hasMorePages) {
                nextPic = "next_dis.png";
                nextDisabled = "disabled";
            }

            var htmlPaging = "<div align='right' class='pagingDiv'>" + (offset + 1) + " - " + (offset + loopCount) + " " + options.foundRecordsMessage + " ";
            htmlPaging += "<input id='pagingPrev' type='image' src='./image/" + prevPic + "' width='16' height='16' class='pagingArrow' " + prevDisabled + ">";
            htmlPaging += "<input id='pagingNext' type='image' src='./image/" + nextPic + "' width='16' height='16' class='pagingArrow' " + nextDisabled + "></div>";
            $("#resultsDiv").append(htmlPaging);

            $("#pagingPrev").mousedown(function () {
                prevPaging();
            });

            $("#pagingNext").mousedown(function () {
                nextPaging();
            });

            drawGeoJsonList();
        }

    }

    function listElementMouseEnter(listElement) {

        var index = parseInt(listElement.id.substr(11));

        if (index !== activeResult) {
            $('#listElement' + index).toggleClass('mouseover');
        }
    }

    function listElementMouseLeave(listElement) {
        var index = parseInt(listElement.id.substr(11));

        if (index !== activeResult) {
            $('#listElement' + index).removeClass('mouseover');
        }
    }

    function listElementMouseDown(listElement) {
        var index = parseInt(listElement.id.substr(11));

        if (index !== activeResult) {
            if (activeResult !== -1) {
                $('#listElement' + activeResult).removeClass('active');
            }

            $('#listElement' + index).removeClass('mouseover');
            $('#listElement' + index).addClass('active');

            activeResult = index;
            fillSearchBox();

            if (searchLayerType === 0) {
                drawGeoJson(activeResult);
            }
            else {
                focusGeoJson(activeResult);
            }
        }
    }


    function drawGeoJsonList() {
        if (searchLayer !== undefined) {
            map.removeLayer(searchLayer);
            searchLayer = undefined;
        }

        searchLayer = L.geoJson(featureCollection, {
            style: function (feature) {
                return {color: "#D0473B"};
            },
            pointToLayer: function (feature, latlng) {
                return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.popupContent);
            }
        });

        map.addLayer(searchLayer);

        map.fitBounds(searchLayer.getBounds());
    }

    function focusGeoJson(index) {

        if (features[index].geometry.type === "Point" && options.pointGeometryZoomLevel !== -1) {
            map.setView([features[index].geometry.coordinates[1], features[index].geometry.coordinates[0]], options.pointGeometryZoomLevel);
        }
        else {
            map.fitBounds(getBoundsOfGeoJsonObject(features[index].geometry));
        }
        drawGeoJsonOnFocusLayer(index);
    }

    function getBoundsOfGeoJsonObject(geometry) {

        var geojsonObject = L.geoJson(geometry, {
            onEachFeature: function (feature, layer) {
            }
        });

        return geojsonObject.getBounds();
    }

    function drawGeoJson(index) {

        if (searchLayer !== undefined) {
            map.removeLayer(searchLayer);
            searchLayer = undefined;
        }

        if (index === -1)
            return;

        var drawStyle = {
            color: options.drawColor,
            weight: 5,
            opacity: 0.65,
            fill: false
        };

        searchLayer = L.geoJson(features[index].geometry, {
            style: drawStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(features[index].properties.popupContent);
            }
        });

        map.addLayer(searchLayer);

        if (features[index].geometry.type === "Point" && options.pointGeometryZoomLevel !== -1) {
            map.setView([features[index].geometry.coordinates[1], features[index].geometry.coordinates[0]], options.pointGeometryZoomLevel);
        }
        else {
            map.fitBounds(searchLayer.getBounds());
        }
    }

    function drawGeoJsonOnFocusLayer(index) {

        if (focusLayer !== undefined) {
            map.removeLayer(focusLayer);
            focusLayer = undefined;
        }

        if (index === -1)
            return;

        var drawStyle = {
            color: options.color,
            weight: 5,
            opacity: 0.65,
            fill: false
        };

        focusLayer = L.geoJson(features[index].geometry, {
            style: drawStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(features[index].properties.popupContent);
            }
        });

        map.addLayer(focusLayer);

    }



    function fillSearchBox() {
        if (activeResult === -1) {
            $("#searchBox")[0].value = lastSearch;
        }
        else {
            $("#searchBox")[0].value = features[activeResult].properties.title;
        }
    }

    function nextResult() {

        if (resultCount > 0) {
            if (activeResult !== -1) {
                $('#listElement' + activeResult).toggleClass('active');
            }

            if (activeResult < resultCount - 1) {
                $('#listElement' + (activeResult + 1)).toggleClass('active');
                activeResult++;
            }
            else {
                activeResult = -1;
            }

            fillSearchBox();

            if (searchLayerType === 0) {
                drawGeoJson(activeResult);
            }
            else {
                focusGeoJson(activeResult);
            }
        }
    }

    function prevResult() {
        if (resultCount > 0) {
            if (activeResult !== -1) {
                $('#listElement' + activeResult).toggleClass('active');
            }

            if (activeResult === -1) {
                $('#listElement' + (resultCount - 1)).toggleClass('active');
                activeResult = resultCount - 1;
            }
            else if (activeResult === 0) {
                activeResult--;
            }
            else {
                $('#listElement' + (activeResult - 1)).toggleClass('active');
                activeResult--;
            }

            fillSearchBox();
            if (searchLayerType === 0) {
                drawGeoJson(activeResult);
            }
            else {
                focusGeoJson(activeResult);
            }
        }
    }

    function clearButtonClick() {
        $("#searchBox")[0].value = "";
        lastSearch = "";
        resultCount = 0;
        features = [];
        activeResult = -1;
        $("#resultsDiv").remove();
        if (searchLayer !== undefined) {
            map.removeLayer(searchLayer);
            searchLayer = undefined;
        }
        if (focusLayer !== undefined) {
            map.removeLayer(focusLayer);
            focusLayer = undefined;
        }
    }

    function searchButtonClick() {
        getValuesAsGeoJson(true);

    }

    function processNoRecordsFoundOrError() {
        resultCount = 0;
        features = [];
        activeResult = -1;
        $("#resultsDiv").remove();
        if (searchLayer !== undefined) {
            map.removeLayer(searchLayer);
            searchLayer = undefined;
        }

        var parent = $("#searchBox").parent();
        $("#resultsDiv").remove();
        parent.append("<div id='resultsDiv' class='result'><i>" + lastSearch + " " + options.notFoundMessage + " <p><small>" + options.notFoundHint + "</small></i><div>");
    }

    function prevPaging() {
        $("#searchBox")[0].value = lastSearch;
        offset = offset - options.limit;
        getValuesAsGeoJson(true);
        collapseOnBlur = false;
        activeResult = -1;
    }

    function nextPaging() {
        $("#searchBox")[0].value = lastSearch;
        offset = offset + options.limit;
        getValuesAsGeoJson(true);
        collapseOnBlur = false;
        activeResult = -1;
    }
})(jQuery);



