var hm_margin = {
    top: 200,
    right: 50,
    bottom: 100,
    left: 200
}
var hm_cellSize;
var hm_col_number;
var hm_row_number;
var hm_numCountries = 50;
var hm_width = 1400;
hm_width = $("#chart").width() - hm_margin.right - hm_margin.left;
var hm_height = 750;
var hm_legendElementWidth;
var hm_originalColors = ["#FFFFFF", "#E6EBF5", "#C8D3E9", "#A4B6DB", "#8099CC", "#6D8AC5", "#5B7CBD", "#496DB6", "#4262A4", "#3A5792", "#334D7f", "2C426D"];
var hm_colors = hm_originalColors;
var hm_colorBuckets = hm_originalColors.length;
var hm_colorScale;
var hm_rowLabel = [];
var hm_colLabel = [];
var hm_masterLabel = [];
var hm_allCountriesAlphabetical = [];
var hm_allCountriesByContinent = [];
var hm_allCountriesByExportVal = [];
var hm_africa = []; 
var hm_asia = []; 
var hm_europe = []; 
var hm_northAmerica = []; 
var hm_oceania = []; 
var hm_southAmerica = []; 
var hm_continents = [];
var hm_legendKeys = ["$0", "$1", "$10", "$100", "$1 k.", "$10 k.", "$100 k.", "$1 m.", "$10 m.", "$100 m.", "$1 b.", "$10 b."];
var hm_legendVals = [0, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
var hm_legendRects;
var hm_legendText;
var hm_continentData;
var hm_topExporterData;
var hm_data;
var hm_filteredData;
var hm_year;
var hm_format = d3.format(",3r");
var hm_sortOrderAlphabetical = "Alphabetically";
var hm_sortOrderHighestExporters = "Value";
var hm_sortOrderByContinent = "Continent";

// load the heat map
function loadHeatMap(hm_yearValue) {
    hm_year = hm_yearValue;
    readHeatMapData(hm_year, 0, true);
}

//read in the heat map data
function readHeatMapData(y, hm_fileInd, loadVisBool) {
    //console.log("HeatMap.js: Reading Heat Map Data for Year " + y[hm_fileInd] + ".");
    hm_data = null;
    d3.csv("data/" + y[hm_fileInd] + "AggregatedArmsData.csv", function (hm_dataset) {
        if (hm_fileInd < hm_year.length - 1) {
            readHeatMapData(hm_year, Number(hm_fileInd) + 1);
        }
        if (hm_data == null) {
            hm_data = hm_dataset;
            hm_filteredData = hm_data; 
        } else {
            // add each data item to the corresponding data item in the first data set
            for (var hm_j = 0; hm_j < hm_dataset.length; hm_j++) {
                var hm_index = hm_getIndex(hm_data, hm_dataset[hm_j]["Country1"], hm_dataset[hm_j]["Country2"]);
                hm_data[hm_index]["Value"] = Number(hm_data[hm_index]["Value"].trim()) + Number(hm_dataset[hm_j]["Value"].trim());
            }
        }

        if (hm_fileInd == 0) {
            sortAllData(y, loadVisBool);
        }
    });
}

// create the sorted versions of the data before rendering vis
function sortAllData(y, loadVisBool) {
    // add all country names from spreadsheet to an array, removing duplicates
    for (var hm_i = 0; hm_i < hm_data.length; hm_i++) {
        if ($.inArray(hm_data[hm_i]["Country1"].trim(), hm_masterLabel) < 0) {
            hm_masterLabel.push(hm_data[hm_i]["Country1"].trim());
        }

        if ($.inArray(hm_data[hm_i]["Country2"].trim(), hm_masterLabel) < 0) {
            hm_masterLabel.push(hm_data[hm_i]["Country2"].trim());
        }
    }

    //console.log("HeatMap.js: Number of countries: " + hm_masterLabel.length);

    // create the alphabetically sorted arrays
    hm_allCountriesAlphabetical = hm_masterLabel.sort();

    //    if (loadVisBool) { loadHeatMapVis(hm_allCountriesAlphabetical, hm_allCountriesAlphabetical); }

    // create the arrays sorted by continent
    d3.csv("data/FilteredContinents.csv", function (hm_continentDataSet) {
        hm_continentData = hm_continentDataSet;

        // sort the continents alphabetically
        for (var hm_i = 0; hm_i < hm_continentData.length; hm_i++) {
        	var tempContinent = hm_continentData[hm_i]["Continent"].trim(); 
        	if (tempContinent == "Africa") {
        		hm_africa.push(hm_continentData[hm_i]["Country"].trim());
        	} else if (tempContinent == "Asia") {
        		hm_asia.push(hm_continentData[hm_i]["Country"].trim());
        	} else if (tempContinent == "Europe") {
        		hm_europe.push(hm_continentData[hm_i]["Country"].trim());
        	} else if (tempContinent == "North America") {
        		hm_northAmerica.push(hm_continentData[hm_i]["Country"].trim());
        	} else if (tempContinent == "Oceania") {
        		hm_oceania.push(hm_continentData[hm_i]["Country"].trim());
        	} else if (tempContinent == "South America") {
        		hm_southAmerica.push(hm_continentData[hm_i]["Country"].trim());
        	} else {
        		console.log("Couldn't locate continent " + tempContinent);
        	}
        	
        	
            if ($.inArray(hm_continentData[hm_i]["Continent"].trim(), hm_continents) > -1) {
                // already in array
            } else {
                hm_continents.push(hm_continentData[hm_i]["Continent"].trim());
            }
        }

        hm_continents = hm_continents.sort();

        // sort the countries alphabetically by continent
        for (var hm_i = 0; hm_i < hm_continents.length; hm_i++) {
            var hm_c = hm_continents[hm_i];
            hm_filtered = hm_continentData.filter(function (hm_entry) {
                return hm_entry["Continent"] == hm_c;
            });
            hm_filtered = hm_filtered.sort(function (hm_a, hm_b) {
                if (hm_a["Country"] < hm_b["Country"]) {
                    return -1;
                }
                if (hm_a["Country"] > hm_b["Country"]) {
                    return 1;
                }

                return 0;
            });
            for (var hm_j = 0; hm_j < hm_filtered.length; hm_j++) {
            	hm_allCountriesByContinent.push(hm_filtered[hm_j]["Country"]);
            }
        }
        //        if (loadVisBool) { loadHeatMapVis(hm_allCountriesByContinent, hm_allCountriesByContinent); }
    });

    // create the arrays sorted by highest exporters
    d3.csv("data/TopExportersByYear.csv", function (hm_topExporterDataSet) {
        hm_topExporterData = hm_topExporterDataSet;
        var hm_r = [];
        var hm_c = [];

        for (var hm_i = 0; hm_i < hm_topExporterData.length; hm_i++) {
            var hm_y = hm_topExporterData[hm_i]["Year"];
            var hm_arr = [];
            for (var hm_j = 1; hm_j < (hm_numCountries + 1); hm_j++) {
                var hm_colName = "C" + hm_j;
                if (hm_topExporterData[hm_i][hm_colName] == "United States of America") {
                	hm_arr.push("United States");
                } else {
                	hm_arr.push(hm_topExporterData[hm_i][hm_colName]);
                }
            }

            if (y[y.length - 1] == hm_y) {
                hm_r = hm_arr;
                hm_c = hm_arr;
            }
            
            hm_allCountriesByExportVal.push({
                year: hm_y,
                array: hm_arr
            });
        }
        if (loadVisBool) {
            //made global var of country names
            window.rowCountries = hm_r;
            window.colCountries = hm_c;
            loadHeatMapVis(hm_r, hm_c);
        }
    });
} // end of sort data

// get the given array of heat map values sorted according to continent, alphabetical order, etc.
function getSortedArray(hm_inputArray, hm_sortOrder, hm_currentYear) {
	var hm_currentYearSelection; 
	if (hm_currentYear.constructor === Array) {
		hm_currentYearSelection = hm_currentYear[hm_currentYear.length - 1];
	} else { 
		hm_currentYearSelection = hm_currentYear; 
	}
	
	var hm_sortedArray = [];
	
	if (hm_sortOrder == hm_sortOrderAlphabetical) {
		hm_sortedArray = hm_inputArray.sort();
	} else if (hm_sortOrder == hm_sortOrderByContinent) {
		for (var i = 0; i < hm_allCountriesByContinent.length; i++) {
			if (hm_inputArray.indexOf(hm_allCountriesByContinent[i]) > -1) {
				hm_sortedArray.push(hm_allCountriesByContinent[i]);
			}
		}
	} else if (hm_sortOrder == hm_sortOrderHighestExporters) {
		for (var i = 0; i < hm_allCountriesByExportVal.length; i++) {
			if (hm_allCountriesByExportVal[i]["year"] == hm_currentYearSelection) {
				var hm_currentYearArray = hm_allCountriesByExportVal[i]["array"]; 
				for (var j = 0; j < hm_currentYearArray.length; j++) {
					if (hm_inputArray.indexOf(hm_currentYearArray[j]) > -1) {
						hm_sortedArray.push(hm_currentYearArray[j]);
					}
				}
			}
		}
	}
	
	return hm_sortedArray; 
}

// get countries with the given continent
function getCountriesByContinent(hm_continentList) {
	var hm_countriesByContinentList = [];
	
	if (hm_continentList.length > 0) {
		if (hm_continentList.length == 1 && hm_continentList[0] == "Oceania") {
			alert("Only one Oceanican country in the Arms and Ammunition data set. A minimum of two countries are required to visualize.");
			return hm_allCountriesByContinent; 
		} else {
			if (hm_continentList.indexOf("Africa") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_africa);
			}
			if (hm_continentList.indexOf("Asia") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_asia);
			}
			if (hm_continentList.indexOf("Europe") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_europe);
			}
			if (hm_continentList.indexOf("North America") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_northAmerica);
			}
			if (hm_continentList.indexOf("Oceania") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_oceania);
			}
			if (hm_continentList.indexOf("South America") > -1) {
				hm_countriesByContinentList = hm_countriesByContinentList.concat(hm_southAmerica);
			}
			
			return hm_countriesByContinentList;
		}
	} else {
		alert("No continents were selected. A minimum of two countries are required to visualize.");
		return hm_allCountriesByContinent; 
	}
}

// create the heat map vis
function loadHeatMapVis(hm_rLabel, hm_cLabel) {

    console.log("HeatMap.js: Loading Heat Map Vis");
    hm_rowLabel = hm_rLabel;
    hm_colLabel = hm_cLabel;
    hm_row_number = hm_rowLabel.length;
    hm_col_number = hm_colLabel.length;
    hm_cellWidth = hm_width / hm_col_number;
    hm_cellHeight = hm_height / hm_row_number;
    hm_legendElementWidth = hm_width / hm_legendKeys.length;

    // create the color scale
    hm_colorScale = d3.scale.quantile()
        .domain(hm_legendVals)
        .range(hm_colors);

    // create the svg
    var hm_svg = d3.select("#chart").append("svg")
        .attr("width", hm_width + hm_margin.left + hm_margin.right)
        .attr("height", hm_height + hm_margin.top + hm_margin.bottom)
        .attr("id", "heatMapPanel")
        .attr("class", "clHeatMapPanel")
        .append("g")
        .attr("transform", "translate(" + hm_margin.left + "," + hm_margin.top + ")");

    // create the row labels
    var hm_rowLabels = hm_svg.append("g")
    	.attr("id", "rowLabelGroup")
        .selectAll(".rowLabelg")
        .data(hm_rowLabel)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", -6)
        .attr("y", function (d, i) {
        	return ((hm_rowLabel.indexOf(d) + 1) * hm_cellHeight + (0.75 * hm_cellHeight));
        })
        .style("text-anchor", "end")
        .style("vertical-align", "middle")
        .attr("class", function (d, i) {
            return "rowLabel mono r" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
            hm_brush([d]);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
            hm_unBrush(); 
        })
        .on("click", function (d) {
            var hm_element = d3.select(this);
            var hm_originalVal = hm_element.classed("text-click");
            d3.selectAll(".rowLabel").classed("text-click", false);
            d3.selectAll(".colLabel").classed("text-click", false);
            d3.selectAll(".cell").classed("cell-click", false);
            hm_element.classed("text-click", !hm_originalVal);
        });

    // create the column labels
    var hm_colLabels = hm_svg.append("g")
    	.attr("id", "colLabelGroup")
        .selectAll(".colLabelg")
        .data(hm_colLabel)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return (hm_colLabel.indexOf(d) + 1) * hm_cellWidth + (0.45 * hm_cellWidth);
        })
        .style("text-anchor", "left")
        .style("vertical-align", "middle")
        .attr("transform", "translate(" + hm_cellWidth / 2 + ",-6) rotate (-90)")
        .attr("class", function (d, i) {
            return "colLabel mono c" + i;
        })
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
            hm_brush([d]);
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
            hm_unBrush(); 
        })
        .on("click", function (d) {
            var hm_element = d3.select(this);
            var hm_originalVal = hm_element.classed("text-click");
            d3.selectAll(".rowLabel").classed("text-click", false);
            d3.selectAll(".colLabel").classed("text-click", false);
            d3.selectAll(".cell").classed("cell-click", false);
            hm_element.classed("text-click", !hm_originalVal);
        });

    // create the cells of the heat map
    hm_filteredData = hm_data.filter(function (hm_entry) {
        return ((hm_rowLabel.indexOf(hm_entry["Country1"]) > -1) && (hm_colLabel.indexOf(hm_entry["Country2"]) > -1));
    });
    var hm_heatMap = hm_svg.append("g")
    	.attr("class", "g3")
    	.attr("id", "hmCellGroup")
        .selectAll(".cellg")
        .data(hm_filteredData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return (hm_rowLabel.indexOf(d.Country2) + 1) * hm_cellWidth;
        })
        .attr("y", function (d) {
            return (hm_colLabel.indexOf(d.Country1) + 1) * hm_cellHeight;
        })
        .attr("class", function (d) {
            return "cell cell-border cr" + (hm_rowLabel.indexOf(d.Country1)) + " cc" + (hm_colLabel.indexOf(d.Country2));
        })
        .attr("width", hm_cellWidth)
        .attr("height", hm_cellHeight)
        .attr("fill", function (d) {
            return hm_colorScale(d.Value);
        })
        .on("click", function (d) {
            //add go button
            if (!document.getElementById('goBtn')) {
                $("#sliderPanel").append(goBtn);
            }
            d3.selectAll(".rowLabel").classed("text-click", false);
            d3.selectAll(".colLabel").classed("text-click", false);
            var hm_element = d3.select(this);
            hm_element.classed("cell-click", !hm_element.classed("cell-click"));
            d3.select(this).classed("cell-hover", false);
        })
        .on("mouseover", function (d) {
            //highlight text
            d3.select(this).classed("cell-hover", true);
            d3.selectAll(".rowLabel").classed("text-hover", function (r) {
                return r == d.Country1;
            });
            d3.selectAll(".colLabel").classed("text-hover", function (c) {
                return c == d.Country2;
            });

            //Update the tooltip position and value
            d3.select("#hm-tooltip")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 10) + "px")
                .select("#value")
                .text(hm_rowLabel[hm_rowLabel.indexOf(d.Country1)] + " exported $" + hm_format(d.Value) + " to " + hm_colLabel[hm_rowLabel.indexOf(d.Country2)] + ".");
            //Show the tooltip
            d3.select("#hm-tooltip").classed("hidden", false);
            hm_brush([d.Country1, d.Country2]); 
        })
        .on("mouseout", function () {
            d3.select(this).classed("cell-hover", false).classed("text-hover", false);
            d3.selectAll(".rowLabel").classed("text-hover", false);
            d3.selectAll(".colLabel").classed("text-hover", false);
            d3.select("#hm-tooltip").classed("hidden", true);
            hm_unBrush(); 
        });
    
    // create the legend rectangles
    hm_legendRects = hm_svg.selectAll(".hm-legend-rects")
    	.data(hm_legendVals)
    	.enter()
    	.append("rect")
    	.attr("class", "hm-legend-rects")
    	.attr("x", function (d, i) {
            return hm_legendElementWidth * i;
        })
        .attr("y", hm_height + (hm_cellHeight * 3))
        .attr("width", hm_legendElementWidth)
        .attr("height", hm_cellHeight)
        .style("fill", function (d, i) {
            return hm_colors[i];
        })
        .style("stroke-width", "0.5px")
        .style("stroke", "#d0d0d0");
    
    // add the legend text
    hm_legendText = hm_svg.selectAll(".hm-legend-text")
    	.data(hm_legendKeys)
    	.enter()
    	.append("text")
    	.attr("class", "hm-legend-text")
        .text(function (d) {
            return d;
        })
        .attr("width", hm_legendElementWidth)
        .attr("x", function (d, i) {
            return hm_legendElementWidth * i + (hm_legendElementWidth / 2);
        })
        .attr("y", hm_height + (hm_cellHeight * 1))
        .style("text-anchor", "middle")
        .attr("transform", "translate(0, 15)");
}

// Update the width of the heat map
function updateHeatMapWidth() {
    var hm_transitionDuration = 1000;
    hm_row_number = hm_rowLabel.length;
    hm_col_number = hm_colLabel.length;
    hm_cellWidth = hm_width / hm_col_number;
    hm_cellHeight = hm_height / hm_row_number;
    hm_legendElementWidth = hm_width / hm_legendKeys.length;

    var hm_svg = d3.select("#chart");

    // col labels
    var hm_colLabels = hm_svg.select("#colLabelGroup")
    	.selectAll(".colLabel");
    
    // update col labels
    hm_colLabels.transition().duration(hm_transitionDuration)
		.attr("y", function (d, i) {
			return (hm_colLabel.indexOf(d)) * hm_cellWidth;
		})
		.attr("transform", "translate(" + hm_cellWidth / 2 + ",-6) rotate (-90)");
    
    // heat map cells
    var hm_heatMap = hm_svg.select("#hmCellGroup")
    	.selectAll(".cell");
    
    // update cells
    hm_heatMap.transition().duration(hm_transitionDuration)
		.attr("width", hm_cellWidth)
		.attr("x", function (d) {
			return (hm_rowLabel.indexOf(d.Country2)) * hm_cellWidth;
		});
    
    // update the legend rectangles
    hm_legendRects.transition().duration(hm_transitionDuration)
    	.attr("width", hm_legendElementWidth)
    	.attr("x", function (d, i) {
            return hm_legendElementWidth * i;
        });
    
    // update the legend text
    hm_legendText.transition().duration(hm_transitionDuration)
        .attr("width", hm_legendElementWidth)
        .attr("x", function (d, i) {
            return hm_legendElementWidth * i + (hm_legendElementWidth / 2);
        });
}

// Update the heat map to display the given data
function updateHeatMap(hm_newRowLabels, hm_newColLabels, y, hm_clickedCells) {
    if (y.length > 1) {
        console.log("HeatMap.js: Updating heat map (" + y[0] + "-" + y[y.length - 1] + ")");
    } else if (y.length == 1) {
        console.log("HeatMap.js: Updating heat map (" + y[0] + ")");
    } else {
        console.log("HeatMap.js: ERROR: Invalid year array passed to updateHeatMap function.");
        console.log("HeatMap.js: Years: " + y);
    }

    var hm_yearChangeBool = false;
    if (y.length != hm_year.length) {
    	hm_yearChangeBool = true;
    } else {
    	for (var hm_i = 0; hm_i < y.length; hm_i++) {
    		if (y[hm_i] != hm_year[hm_i]) {
    			hm_yearChangeBool = true;
    		}
    	}
    }
    hm_year = y;
    hm_rowLabel = hm_newRowLabels; 
    hm_colLabel = hm_newColLabels;
    
    if (hm_yearChangeBool) { // the year has changed on the slider
    	console.log("HeatMap.js: Year change detected.");
    	hm_data = null;
        updateHeatMapData(y, 0, hm_clickedCells);
    } else {
        updateHeatMapVis(hm_clickedCells);
    }
} // end of updateheatmap()

// update the heat map data
function updateHeatMapData(y, hm_fileInd, hm_clickedCells) {
    d3.csv("data/" + y[hm_fileInd] + "AggregatedArmsData.csv", function (hm_dataset) {
        if (hm_fileInd < hm_year.length - 1) {
            updateHeatMapData(hm_year, Number(hm_fileInd) + 1);
        }
        if (hm_data == null) {
            hm_data = hm_dataset;
            hm_filteredData = hm_data; 
        } else {
            // add each data item to the corresponding data item in the first data set
            for (var hm_j = 0; hm_j < hm_dataset.length; hm_j++) {
                var hm_index = hm_getIndex(hm_data, hm_dataset[hm_j]["Country1"], hm_dataset[hm_j]["Country2"]);
                hm_data[hm_index]["Value"] = Number(hm_data[hm_index]["Value"]) + Number(hm_dataset[hm_j]["Value"]);
            }
        }

        if (hm_fileInd == 0) {
            updateHeatMapVis(hm_clickedCells);
        }
    });
}

// update the heat map vis
function updateHeatMapVis(hm_clickedCells) {
    hm_filteredData = hm_data.filter(function (hm_entry) {
        return ((hm_rowLabel.indexOf(hm_entry["Country1"]) > -1) && (hm_colLabel.indexOf(hm_entry["Country2"]) > -1));
    }); 
    var hm_transitionDuration = 1000;
    hm_row_number = hm_rowLabel.length;
    hm_col_number = hm_colLabel.length;
    hm_cellWidth = hm_width / hm_col_number;
    hm_cellHeight = hm_height / hm_row_number;
    hm_legendElementWidth = hm_width / hm_legendKeys.length;

    var hm_svg = d3.select("#chart");

    // row labels
    var hm_rowLabels = hm_svg.select("#rowLabelGroup")
    	.selectAll(".rowLabel")
    	.data(hm_rowLabel);
    
    // create new row labels
    hm_rowLabels.enter()
		.append("text")
		.attr("class", function (d, i) {
            return "rowLabel mono r" + i;
        })
        .attr("x", -6)
        .style("text-anchor", "end")
        .style("vertical-align", "middle")
        .on("mouseover", function (d) {
            d3.select(this).classed("text-hover", true);
            hm_brush([d]); 
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("text-hover", false);
            hm_unBrush(); 
        })
        .on("click", function (d) {
            var hm_element = d3.select(this);
            var hm_originalVal = element.classed("text-click");
            d3.selectAll(".rowLabel").classed("text-click", false);
            d3.selectAll(".colLabel").classed("text-click", false);
            d3.selectAll(".cell").classed("cell-click", false);
            hm_element.classed("text-click", !hm_originalVal);
        });
    
    // update row labels
    hm_rowLabels.transition().duration(hm_transitionDuration)
		.text(function (d) {
			return d;
		})
		.attr("y", function (d, i) {
            return (hm_rowLabel.indexOf(d)) * hm_cellHeight + (0.50 * hm_cellHeight);
        });
    
    // remove old row labels
    hm_rowLabels.exit().transition().duration(hm_transitionDuration).style("opacity", 0).remove();
    
    // col labels
    var hm_colLabels = hm_svg.select("#colLabelGroup")
    	.selectAll(".colLabel")
    	.data(hm_colLabel);
    
    // create new col labels
    hm_colLabels.enter()
		.append("text")
		.attr("class", function (d, i) {
			return "colLabel mono c" + i;
		})
		.attr("x", 0)
		.style("text-anchor", "left")
		.style("vertical-align", "middle")
		.on("mouseover", function (d) {
			d3.select(this).classed("text-hover", true);
			hm_brush([d]);
		})
		.on("mouseout", function (d) {
			d3.select(this).classed("text-hover", false);
			hm_unBrush(); 
		})
		.on("click", function (d) {
			var hm_element = d3.select(this);
			var hm_originalVal = hm_element.classed("text-click");
			d3.selectAll(".rowLabel").classed("text-click", false);
			d3.selectAll(".colLabel").classed("text-click", false);
			d3.selectAll(".cell").classed("cell-click", false);
			hm_element.classed("text-click", !hm_originalVal);
		});
    
    // update col labels
    hm_colLabels.transition().duration(hm_transitionDuration)
		.text(function (d) {
			return d;
		})
		.attr("y", function (d, i) {
			return (hm_colLabel.indexOf(d)) * hm_cellWidth;
		})
		.attr("transform", "translate(" + hm_cellWidth / 2 + ",-6) rotate (-90)");
    
    // remove old col labels
    hm_colLabels.exit().transition().duration(hm_transitionDuration).style("opacity", 0).remove();
    
    // heat map cells
    var hm_heatMap = hm_svg.select("#hmCellGroup")
    	.selectAll(".cell")
    	.data(hm_filteredData);
    
    // create new cells
    hm_heatMap.enter()
    	.append("rect")
		.on("click", function (d) {
		    //add go button
		    if (!document.getElementById('goBtn')) {
		    	$("#sliderPanel").append(goBtn);
		   	}
		   	d3.selectAll(".rowLabel").classed("text-click", false);
		   	d3.selectAll(".colLabel").classed("text-click", false);
		   	var hm_element = d3.select(this);
	    	hm_element.classed("cell-click", !hm_element.classed("cell-click"));
	    	d3.select(this).classed("cell-hover", false);
		})
		.on("mouseover", function (d) {
		   	//highlight text
		   	d3.select(this).classed("cell-hover", true);
		   	d3.selectAll(".rowLabel").classed("text-hover", function (r) {
		   		return r == d.Country1;
	    	});
	    	d3.selectAll(".colLabel").classed("text-hover", function (c) {
		   		return c == d.Country2;
		   	});

		    //Update the tooltip position and value
		   	d3.select("#hm-tooltip")
		   		.style("left", (d3.event.pageX + 10) + "px")
		   		.style("top", (d3.event.pageY - 10) + "px")
		   		.select("#value")
	    		.text(hm_rowLabel[hm_rowLabel.indexOf(d.Country1)] + " exported $" + hm_format(d.Value) + " to " + hm_colLabel[hm_rowLabel.indexOf(d.Country2)] + ".");
	    	//Show the tooltip
		   	d3.select("#hm-tooltip").classed("hidden", false);
		   	hm_brush([d.Country1, d.Country2]); 
		})
		.on("mouseout", function () {
		    d3.select(this).classed("cell-hover", false).classed("text-hover", false);
		   	d3.selectAll(".rowLabel").classed("text-hover", false);
		   	d3.selectAll(".colLabel").classed("text-hover", false);
		   	d3.select("#hm-tooltip").classed("hidden", true);
		   	hm_unBrush(); 
		});
    
    // update cells
    hm_heatMap.transition().duration(hm_transitionDuration)
		.attr("width", hm_cellWidth)
		.attr("height", hm_cellHeight)
		.attr("x", function (d) {
			return (hm_rowLabel.indexOf(d.Country2)) * hm_cellWidth;
		})
		.attr("y", function (d) {
			return (hm_colLabel.indexOf(d.Country1)) * hm_cellHeight;
		})
    	.attr("class", function (d) {
		 	return "cell cell-border cr" + (hm_rowLabel.indexOf(d.Country1)) + " cc" + (hm_colLabel.indexOf(d.Country2));
		 })
		 .attr("fill", function (d) {
		  	return hm_colorScale(d.Value);
		 });
    
    // remove old cells
    hm_heatMap.exit().transition().duration(hm_transitionDuration).style("opacity", 0).remove();
   
    // update the legend rectangles
    hm_legendRects.transition().duration(hm_transitionDuration)
    	.attr("width", hm_legendElementWidth)
    	.attr("x", function (d, i) {
            return hm_legendElementWidth * i;
        });
    
    // update the legend text
    hm_legendText.transition().duration(hm_transitionDuration)
        .attr("width", hm_legendElementWidth)
        .attr("x", function (d, i) {
            return hm_legendElementWidth * i + (hm_legendElementWidth / 2);
        });
}

// return the index of the data item with the given country1 and country2
function hm_getIndex(hm_array, hm_c1, hm_c2) {
    for (var i = 0; i < hm_array.length; i++) {
        if (hm_array[i]["Country1"] == hm_c1 && hm_array[i]["Country2"] == hm_c2) {
            return i;
        }
    }
    return -1;
}

// return true if the given values are located in the list
function arrayContains(hm_array, hm_c1, hm_c2) {
	for (var i = 0; i < hm_array.length; i++) {
		if (hm_array[i].c1 == hm_c1 && hm_array[i].c2 == hm_c2) {
			return true;
		}
	}
	return false; 
}

// return an array of the countries currently on the heat map
function getCountriesOnHeatMap() {
	return hm_rowLabel; 
}

// locate the corresponding svg elements on the chord diagram or line chart and highlight
function hm_brush(hm_brushCountries) {
	if ($("#chordSvg").length != 0) {
		var hm_tempIndex = []; 
		var hm_tempText = [];
		d3.select("#chordSvg")
			.select("#circle")
			.selectAll(".chord-arc")
			.each(function(d) {
				if (hm_brushCountries.indexOf(ch_rdr(d).gname) > -1) {
					hm_tempText.push(ch_rdr(d).gname);
					hm_tempIndex.push(ch_rdr(d).gindex);
				}
			});
		
		if (hm_tempIndex.length > 0) { // fade out other chords
			d3.select("#chordSvg")
				.select("#circle")
				.selectAll("path.chord")
				.classed("fade", function (p) {
					return hm_tempIndex.indexOf(p.source.index) < 0 && hm_tempIndex.indexOf(p.target.index) < 0;
				});
		}
		
		if (hm_tempText.length > 0) { // increase text size 
			d3.select("#chordSvg")
				.select("#circle")
				.selectAll(".chord-text")
				.style("font-weight", function(d) {
					if (hm_tempText.indexOf(ch_rdr(d).gname) > -1) {
						return "bold";
					}
				}); 
		}
	} 

	if ($("#lineSvg").length != 0) {
		d3.select("#lineSvg")
			.selectAll(".lc-legend-text")
			.style("font-weight", function(d) {
				if (hm_brushCountries.indexOf(d) > -1) {
					return "bold"; 
				}
		});
		
		if (hm_brushCountries.indexOf(lc_country1) > -1) {
			d3.select("#lineSvg")
				.selectAll("path.country1")
				.style("stroke-width", "7px"); 
		}
		
		if (hm_brushCountries.indexOf(lc_country2) > -1) {
			d3.select("#lineSvg")
				.selectAll("path.country2")
				.style("stroke-width", "7px"); 
		}
	}
}

// un-highlight the brushed elements in the other charts
function hm_unBrush() {
	if ($("#chordSvg").length != 0) {
		chordPaths.classed("fade", false);
		d3.select("#chordSvg")
			.select("#circle")
			.selectAll(".chord-text")
			.style("font-weight", "");
	} 
		
	if ($("#lineSvg").length != 0) {
		d3.select("#lineSvg")
			.selectAll(".lc-legend-text")
			.style("font-weight", "");
		d3.select("#lineSvg")
			.selectAll("path")
			.style("stroke-width", "1.4px"); 
	}
}