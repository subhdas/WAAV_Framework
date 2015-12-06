var lc_margin = {
    top: 20,
    right: 2, 
    bottom: 75,
    left: 130
};
var lc_width = 900 - lc_margin.left - lc_margin.right;
var lc_height = 780 - lc_margin.top - lc_margin.bottom;
var lc_smWidth = 1150 - lc_margin.left - lc_margin.right - 200;
var lc_smHeight = 800 - lc_margin.top - lc_margin.bottom - 200;
var lc_bigWidth = 900 - lc_margin.left - lc_margin.right;
var lc_bigHeight = 780 - lc_margin.top - lc_margin.bottom;
var lc_colors = ["#4262A4", "#E69900"];
var lc_data;
var lc_c1Data;
var lc_c2Data;
var lc_country1;
var lc_country2;
var lc_x;
var lc_y;
var lc_xAxis;
var lc_yAxis;
var lc_svg;
var lc_line;
var lc_min = Number.MAX_VALUE;
var lc_max = Number.MIN_VALUE;
var legendCellSize = 50;
var lc_initialized = false;
var lc_hoverLineGroup;
var lc_hoverLineHorizontal;
var lc_hoverLineVertical;

//load the line chart
function loadLineChart(c1, c2, lc_newWidth, lc_newHeight) {
    d3.select("#vizPanel").empty();
    $("#chordSvg").remove();
    lc_country1 = c1;
    lc_country2 = c2;
    readLineChartData(true, lc_newWidth, lc_newHeight);
}

//read in the line chart data
function readLineChartData(loadLCVisBool, lc_newWidth, lc_newHeight) {
    console.log("LineChart.js: Reading Line Chart Data");
    d3.csv("data/AggregatedArmsData.csv", function (lc_dataset) {
        lc_data = lc_dataset.filter(function (d) {
            return ((d["Country1"] == lc_country1 && d["Country2"] == lc_country2) || (d["Country2"] == lc_country1 && d["Country1"] == lc_country2));
        });

        lc_c1Data = lc_data.filter(function (d) {
            return d["Country1"] == lc_country1;
        });

        for (var i = 1992; i < 2012; i++) { // pad the data with 0s
            var found = false;
            for (var j = 0; j < lc_c1Data.length; j++) {
                if (lc_c1Data[j]["Year"] == i) {
                    found = true;
                }
            }
            if (!found) {
                // add an entry
                lc_c1Data.push({
                    Country1: lc_country1,
                    Continent1: "placeholder",
                    Country2: lc_country1,
                    Continent2: "placeholder",
                    Year: i,
                    Value: "0"
                });
            }
        }

        lc_c2Data = lc_data.filter(function (d) {
            return d["Country1"] == lc_country2;
        });

        for (var i = 1992; i < 2012; i++) { // pad the data with 0s
            var found = false;
            for (var j = 0; j < lc_c2Data.length; j++) {
                if (lc_c2Data[j]["Year"] == i) {
                    found = true;
                }
            }
            if (!found) {
                // add an entry
                lc_c2Data.push({
                    Country1: lc_country2,
                    Continent1: "placeholder",
                    Country2: lc_country1,
                    Continent2: "placeholder",
                    Year: i,
                    Value: "0"
                });
            }
        }

        lc_sortByYear();

        for (var i = 0; i < lc_data.length; i++) {
            if (Number(lc_data[i]["Value"]) < Number(lc_min)) {
                lc_min = Number(lc_data[i]["Value"]);
            }
            if (Number(lc_data[i]["Value"]) > Number(lc_max)) {
                lc_max = Number(lc_data[i]["Value"]);
            }
        }
        if (0 < Number(lc_min)) {
            lc_min = 0;
        }

        if (loadLCVisBool) {
            loadLineChartVis(lc_newWidth, lc_newHeight);
        }
    });
}

//create the line chart vis
function loadLineChartVis(lc_newWidth, lc_newHeight) {
    console.log("LineChart.js: Loading Line Chart Vis");
    lc_width = lc_newWidth;
    lc_height = lc_newHeight;

    // create the x and y scales
    lc_x = d3.scale.linear()
        .range([lc_margin.left, lc_width])
        .domain([1992, 2011]);
    lc_y = d3.scale.linear()
        .range([lc_height - 10, lc_margin.bottom])
        .domain([lc_min, lc_max]).nice();

    // create the x and y axes
    lc_xAxis = d3.svg.axis()
        .scale(lc_x)
        .orient("bottom")
        .tickFormat(d3.format("d"));
    lc_yAxis = d3.svg.axis()
        .scale(lc_y)
        .orient("left");

    // fn to create a line based on a given row of data 
    lc_line = d3.svg.line()
        .x(function (d) {
            return Math.abs(lc_x(d.Year));
        }).y(function (d) {
            return Math.abs(lc_y(d.Value));
        }).interpolate("basis");

    // create the svg
    lc_svg = d3.select("#vizPanel").append("svg")
        .attr("width", lc_width + lc_margin.left + lc_margin.right)
        .attr("height", lc_height + lc_margin.top + lc_margin.bottom)
        .attr("class", "clLineSvg")
        .attr("id", "lineSvg")
        .attr("transform", "translate(" + lc_margin.left + "," + lc_margin.top + ")");

    // add the x axis to the svg
    lc_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (lc_height) + ")")
        .call(lc_xAxis);

    // add the y axis to the svg
    lc_svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (lc_margin.left) + ",0)")
        .call(lc_yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -115)
        .attr("dy", ".71em")
        .attr("x", -1*(lc_height / 2))
        .style("text-anchor", "end")
        .text("Exports ($USD)");

    // Hover lines 
    lc_hoverLineGroup = lc_svg.append("g")
        .attr("class", "hover-line");
    lc_hoverLineVertical = lc_hoverLineGroup
        .append("line")
        .attr("x1", 10).attr("x2", 10)
        .attr("y1", 0).attr("y2", lc_height + 10);
    lc_hoverLineHorizontal = lc_hoverLineGroup
        .append("line")
        .attr("x1", 0).attr("x2", lc_width + 10)
        .attr("y1", 10).attr("y2", 10);

    // add hover lines to a rectangle over the chart
    var lc_invisibleRectangle = lc_svg.append("rect")
        .attr("class", "lc-selector")
        .attr("width", lc_width - lc_margin.left)
        .attr("height", lc_height - lc_margin.top - lc_margin.bottom + 20)
        .attr("x", lc_margin.left)
        .attr("y", lc_margin.top + 54)
        .on("mouseover", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mousemove", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            lc_hoverLineVertical.style("opacity", 1e-6);
            lc_hoverLineHorizontal.style("opacity", 1e-6);
        });

    // Hide hover lines by default
    lc_hoverLineVertical.style("opacity", 1e-6);
    lc_hoverLineHorizontal.style("opacity", 1e-6);

    // add the path representing country 1 exports to country 2
    var lc_c1Path = lc_svg.selectAll(".country1")
        .data(lc_c1Data)
        .enter()
        .append("path")
        .attr("class", "country1 line")
        .attr("d", lc_line(lc_c1Data))
        .style("stroke", lc_colors[0])
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", "7px");
            lc_brush(lc_country1);
        })
        .on("mousemove", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", "1.5px");
            lc_unBrush();
        });

    // add the path representing country 2 exports to country 1
    var lc_c2Path = lc_svg.selectAll(".country2")
        .data(lc_c2Data)
        .enter()
        .append("path")
        .attr("class", "country2 line")
        .attr("d", lc_line(lc_c2Data))
        .style("stroke", lc_colors[1])
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", "7px");
            lc_brush(lc_country2);
        })
        .on("mousemove", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", "1.5px");
            lc_unBrush();
        });

    var lc_legendKeys = [lc_country1, lc_country2];

    // create rectangle cells of legend
    var lc_legendRects = lc_svg.selectAll(".lc-legend-rect")
        .data(lc_legendKeys)
        .enter()
        .append("rect")
        .attr("class", "lc-legend-rect")
        .attr("x", lc_width / 2)
        .attr("y", function (d, i) {
            return lc_margin.top + (i * legendCellSize);
        })
        .attr("width", legendCellSize)
        .attr("height", legendCellSize)
        .style("fill", function (d, i) {
            return lc_colors[i];
        })
        .style("stroke-width", "0.5px")
        .style("stroke", "#eee")
        .on("mouseover", function (d, i) {
            d3.select("#lc-tooltip")
                .style("visibility", "visible")
                .html(lc_legendTip(i + 1))
                .style("top", function () {
                    return (d3.event.pageY - 50) + "px";
                })
                .style("left", function () {
                    return (d3.event.pageX - 200) + "px";
                });

            var lc_tempBrushCountry;
            if (i == 0) {
                lc_tempBrushCountry = lc_country1;
            } else if (i == 1) {
                lc_tempBrushCountry = lc_country2;
            }
            lc_brush(lc_tempBrushCountry);
        })
        .on("mouseout", function (d) {
            d3.select("#lc-tooltip").style("visibility", "hidden");
            lc_unBrush();
        });

    // add legend text
    var lc_legendText = lc_svg.selectAll(".lc-legend-text")
        .data(lc_legendKeys)
        .enter()
        .append("text")
        .attr("class", "lc-legend-text")
        .text(function (d) {
            if (d == lc_country1) {
                return d + " exports to " + lc_country2;
            } else {
                return d + " exports to " + lc_country1;
            }
        })
        .attr("width", legendCellSize)
        .attr("x", ((lc_width / 2) + legendCellSize + 10))
        .attr("y", function (d, i) {
            return lc_margin.top + (legendCellSize / 2) + (i * legendCellSize);
        })
        .style("text-anchor", "start")
        .on("mouseover", function (d, i) {
            d3.select("#lc-tooltip")
                .style("visibility", "visible")
                .html(lc_legendTip(i + 1))
                .style("top", function () {
                    return (d3.event.pageY - 50) + "px";
                })
                .style("left", function () {
                    return (d3.event.pageX - 200) + "px";
                });

            var lc_tempBrushCountry;
            if (i == 0) {
                lc_tempBrushCountry = lc_country1;
            } else if (i == 1) {
                lc_tempBrushCountry = lc_country2;
            }
            lc_brush(lc_tempBrushCountry);
        })
        .on("mouseout", function (d) {
            d3.select("#lc-tooltip").style("visibility", "hidden");
            lc_unBrush();
        });

    lc_initialized = true;
}

//Update the line chart to display the given data
function updateLineChart(c1, c2) {
    console.log("LineChart.js: Updating line chart (" + c1 + " and " + c2 + ")");

    if (lc_initialized) {

        var lc_countryChangeBool = false;
        if (lc_country1 != c1 || lc_country2 != c2) {
            lc_countryChangeBool = true;
        }

        lc_country1 = c1;
        lc_country2 = c2;
        if (lc_countryChangeBool) { // the year has changed on the slider
            console.log("LineChart.js: Country change detected.");
            lc_data = null;
            lc_c1Data = null;
            lc_c2Data = null;
            updateLineChartData();
        } else {
            updateLineChartVis();
        }
    } else {
        loadLineChart(c1, c2);
    }
}

// update the line chart data
function updateLineChartData() {
    d3.csv("data/AggregatedArmsData.csv", function (lc_dataset) {
        lc_data = lc_dataset.filter(function (d) {
            return ((d["Country1"] == lc_country1 && d["Country2"] == lc_country2) || (d["Country2"] == lc_country1 && d["Country1"] == lc_country2));
        });
        lc_c1Data = lc_data.filter(function (d) {
            return d["Country1"] == lc_country1;
        });
        for (var i = 1992; i < 2012; i++) { // pad the data with 0s
            var found = false;
            for (var j = 0; j < lc_c1Data.length; j++) {
                if (lc_c1Data[j]["Year"] == i) {
                    found = true;
                }
            }
            if (!found) {
                // add an entry
                lc_c1Data.push({
                    Country1: lc_country1,
                    Continent1: "placeholder",
                    Country2: lc_country2,
                    Continent2: "placeholder",
                    Year: i,
                    Value: "0"
                });
            }
        }
        lc_c2Data = lc_data.filter(function (d) {
            return d["Country1"] == lc_country2;
        });
        for (var i = 1992; i < 2012; i++) { // pad the data with 0s
            var found = false;
            for (var j = 0; j < lc_c2Data.length; j++) {
                if (lc_c2Data[j]["Year"] == i) {
                    found = true;
                }
            }
            if (!found) {
                // add an entry
                lc_c2Data.push({
                    Country1: lc_country2,
                    Continent1: "placeholder",
                    Country2: lc_country1,
                    Continent2: "placeholder",
                    Year: i,
                    Value: "0"
                });
            }
        }

        lc_sortByYear();

        lc_min = Number.MAX_VALUE;
        lc_max = Number.MIN_VALUE;
        for (var i = 0; i < lc_data.length; i++) {
            if (Number(lc_data[i]["Value"]) < Number(lc_min)) {
                lc_min = Number(lc_data[i]["Value"]);
            }
            if (Number(lc_data[i]["Value"]) > Number(lc_max)) {
                lc_max = Number(lc_data[i]["Value"]);
            }
        }
        if (0 < Number(lc_min)) {
            lc_min = 0;
        }
        updateLineChartVis();
    });
}

// update the line chart vis
function updateLineChartVis() {
    console.log("LineChart.js: Updating line chart with countries " + lc_country1 + " and " + lc_country2);
    var lc_transitionDuration = 1000;
    
    // update svg size
    lc_svg = d3.select("#lineSvg")
    	.attr("width", lc_width + lc_margin.left + lc_margin.right)
    	.attr("height", lc_height + lc_margin.top + lc_margin.bottom);

    // update the y scale
    lc_y = d3.scale.linear()
        .range([lc_height, lc_margin.bottom])
        .domain([lc_min, lc_max]).nice();

    // update the y axis
    lc_yAxis = d3.svg.axis()
        .scale(lc_y)
        .orient("left");

    // fn to create a line based on a given row of data 
    lc_line = d3.svg.line()
        .x(function (d) {
            return Math.abs(lc_x(d.Year));
        }).y(function (d) {
            return Math.abs(lc_y(d.Value));
        }).interpolate("basis");

    // get the svg
    lc_svg = d3.select("#vizPanel").select("#lineSvg");

    // add the y axis to the svg
    lc_svg.selectAll(".y.axis")
        .call(lc_yAxis);

    // country 1 exports to country 2 path
    var lc_c1Path = lc_svg.selectAll(".country1")
        .data(lc_c1Data);

    // add new components to path
    lc_c1Path.enter()
        .append("path")
        .attr("class", "country1 line");

    // update the path
    lc_c1Path.transition().duration(lc_transitionDuration)
        .attr("d", lc_line(lc_c1Data))
        .style("stroke", lc_colors[0]);

    lc_c1Path.on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", "7px");
            lc_brush(lc_country1);
        })
        .on("mousemove", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", "1.5px");
            lc_unBrush();
        });

    // remove old path components
    lc_c1Path.exit().transition().duration(lc_transitionDuration).style("opacity", 0).remove();

    // country 2 exports to country 1 path
    var lc_c2Path = lc_svg.selectAll(".country2")
        .data(lc_c2Data);

    // add new components to path
    lc_c2Path.enter()
        .append("path")
        .attr("class", "country2 line");

    // update the path
    lc_c2Path.transition().duration(lc_transitionDuration)
        .attr("d", lc_line(lc_c2Data))
        .style("stroke", lc_colors[1]);
    lc_c2Path.on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", "7px");
            lc_brush(lc_country2);
        })
        .on("mousemove", function () {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];
            lc_hoverLineVertical.attr("x1", mouse_x).attr("x2", mouse_x).attr("y1", lc_height).attr("y2", mouse_y);
            lc_hoverLineVertical.style("opacity", 1);
            lc_hoverLineHorizontal.attr("x1", lc_margin.left).attr("x2", mouse_x).attr("y1", mouse_y).attr("y2", mouse_y);
            lc_hoverLineHorizontal.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", "1.5px");
            lc_unBrush();
        });

    // remove old path components
    lc_c2Path.exit().transition().duration(lc_transitionDuration).style("opacity", 0).remove();

    // legend text
    var lc_legendKeys = [lc_country1, lc_country2];
    var lc_legendText = lc_svg.selectAll(".lc-legend-text")
        .data(lc_legendKeys);

    // create new legend text
    lc_legendText.append("text")
        .attr("class", "lc-legend")
        .attr("width", legendCellSize)
        .attr("x", ((lc_width / 2) + legendCellSize + 10))
        .attr("y", function (d, i) {
            return lc_margin.top + (legendCellSize / 2) + (i * legendCellSize);
        })
        .style("text-anchor", "start");

    // update legend text
    lc_legendText.transition().duration(lc_transitionDuration)
        .text(function (d) {
            if (d == lc_country1) {
                return d + " exports to " + lc_country2;
            } else {
                return d + " exports to " + lc_country1;
            }
        })
        .on("mouseover", function (d, i) {
            d3.select("#lc-tooltip")
                .style("visibility", "visible")
                .html(lc_legendTip(i + 1))
                .style("top", function () {
                    return (d3.event.pageY - 50) + "px";
                })
                .style("left", function () {
                    return (d3.event.pageX - 200) + "px";
                });

            var lc_tempBrushCountry;
            if (i == 0) {
                lc_tempBrushCountry = lc_country1;
            } else if (i == 1) {
                lc_tempBrushCountry = lc_country2;
            }
            lc_brush(lc_tempBrushCountry);
        })
        .on("mouseout", function (d) {
            d3.select("#lc-tooltip").style("visibility", "hidden");
            lc_unBrush();
        });

    // remove old legend text
    lc_legendText.exit().transition().duration(lc_transitionDuration).style("opacity", 0).remove();
}

//clear the viz panel
function lc_clearPanel() {
    console.log("LineChart.js: Clearing viz panel");
    $('#vizPanel').empty();
    lc_initialized = false;
}

// get the text for the tooltip
function lc_pathTip(d, lc_whichCountry) {

    var q = d3.format(",3r");
    return "i+1: " + lc_whichCountry + " -- d: " + JSON.stringify(d);

    if (lc_whichCountry == 1) {
        return lc_country1 + " exported $" + q(Number(d["Value"])) + " to " + lc_country2 + " in  " + d["Year"] + ".";
    } else {
        return lc_country2 + " exported $" + q(Number(d["Value"])) + " to " + lc_country1 + " in  " + d["Year"] + ".";
    }
}

// get the text for the legend tooltip
function lc_legendTip(lc_whichCountry) {
    var q = d3.format(",3r");

    if (lc_whichCountry == 1) {
        var lc_totalExports = 0;
        for (var i = 0; i < lc_c1Data.length; i++) {
            lc_totalExports = lc_totalExports + Number(lc_c1Data[i]["Value"]);
        }
        return lc_country1 + " exported $" + q(Number(lc_totalExports)) + " to " + lc_country2 + " from 1992-2011.";
    } else {
        var lc_totalExports = 0;
        for (var i = 0; i < lc_c2Data.length; i++) {
            lc_totalExports = lc_totalExports + Number(lc_c2Data[i]["Value"]);
        }
        return lc_country2 + " exported $" + q(Number(lc_totalExports)) + " to " + lc_country1 + " from 1992-2011.";
    }
}

// sort the data by year
function lc_sortByYear() {
    lc_c1Data = lc_c1Data.sort(function (lc_a, lc_b) {
        if (Number(lc_a["Year"]) < Number(lc_b["Year"])) {
            return -1;
        }
        if (Number(lc_a["Year"]) > Number(lc_b["Year"])) {
            return 1;
        }

        return 0;
    });

    lc_c2Data = lc_c2Data.sort(function (lc_a, lc_b) {
        if (Number(lc_a["Year"]) < Number(lc_b["Year"])) {
            return -1;
        }
        if (Number(lc_a["Year"]) > Number(lc_b["Year"])) {
            return 1;
        }

        return 0;
    });
}

//locate the corresponding svg elements on the chord diagram or line chart and highlight
function lc_brush(lc_brushCountry) {
    // brush & link with heat map
    d3.select("#chart")
        .select("#rowLabelGroup")
        .selectAll(".rowLabel")
        .style("font-weight", function (d) {
            if (lc_brushCountry == d) {
                return "bold";
            }
        })
        .style("font-size", function (d) {
            if (lc_brushCountry == d) {
                return "11pt";
            }
        })
        .style("fill", function (d) {
            if (lc_brushCountry == d) {
                return "#000";
            }
        });
}

// un-highlight the brushed elements in the heat map
function lc_unBrush() {
    d3.select("#chart")
        .select("#rowLabelGroup")
        .selectAll(".rowLabel")
        .style("font-weight", "")
        .style("font-size", "8pt")
        .style("fill", "aaa");
    d3.select("#chart")
        .select("#colLabelGroup")
        .selectAll(".colLabel")
        .style("font-weight", "")
        .style("font-size", "8pt")
        .style("fill", "aaa");
}