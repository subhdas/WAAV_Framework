var ch_data;
var ch_countries;
var ch_width = 960;
var ch_height = 500;
var ch_outerRadius = (Math.min(ch_width, ch_height) / 2) - 10;
var ch_innerRadius = ch_outerRadius - 70;
var ch_fill;
var ch_year;
var ch_rdr;
var chordPaths;
var wchord;
var hchord;
var ch_smWidth = 620; 
var ch_smHeight = 550; 
var ch_bigWidth = 980; 
var ch_bigHeight = 800; 
var ch_r1; 
var ch_r0;
var ch_fill; 
var chord;
var ch_arc;
var ch_initialized = false; 

var ch_colors = ["#E6EBF5", "#C8D3E9", "#FFAA00", "#A4B6DB", "#CC8800", "#8099CC", "#E69900", "#B37700", "#6D8AC5", "#5B7CBD", "#FFAA00", "#496DB6", "#FFBB33", "#4262A4", "#FFC34D", "#3A5792", "#FFCC66", "#334D7f", "#FFDD99", "2C426D", "#996600", "#FFEECC"];

// load the chord diagram
function loadChordDiagram(ch_countries, ch_yearValue, ch_chordWidth, ch_chordHeight) {
	console.log("Chord.js: Loading chord diagram with " + ch_countries);
	d3.select("#vizPanel").empty();
	$("chordSvg").remove(); 
	$("#lineSvg").remove(); 
    //console.log("Chord.js: Width of Chord Diagram is : " + ch_width);
    ch_year = ch_yearValue;
    ch_data = null; 
    readChordData(ch_countries, ch_yearValue, 0, true, ch_chordWidth, ch_chordHeight);
}

//read the chord diagram data
function readChordData(ch_countryList, ch_y, ch_fileInd, ch_loadVisBool, ch_chordWidth, ch_chordHeight) {
	//console.log("Chord.js: Reading Chord Diagram Data for Year " + ch_y[ch_fileInd] + ".");
	ch_countries = ch_countryList;
	d3.csv("data/" + ch_y[ch_fileInd] + "AggregatedArmsData.csv", function (ch_dataset) {
		ch_dataset = ch_dataset.filter(function (d) {
			if (ch_countryList.length > 0) {
				if (ch_countryList.indexOf(d["Country1"]) > -1 && ch_countryList.indexOf(d["Country2"]) > -1) {
					return true;
				}
			}
		});

		if (ch_fileInd < ch_year.length - 1) { readChordData(ch_countryList, ch_year, Number(ch_fileInd)+1, ch_chordWidth, ch_chordHeight); }
		if (ch_data == null) { 
			ch_data = ch_dataset; 
			
			// if country list was empty, populate it
			if (ch_countries.length == 0) {
				for (var ch_i = 0; ch_i < ch_data.length; ch_i++) {
					if (ch_countries.indexOf(ch_data[ch_i]["Country1"].trim()) < 0) {
						ch_countries.push(ch_data[ch_i]["Country1"].trim());
					}
					if (ch_countries.indexOf(ch_data[ch_i]["Country2"].trim()) < 0) {
						ch_countries.push(ch_data[ch_i]["Country2"].trim());
					}
				}
			}
		}
		else {
			// add each data item to the corresponding data item in the first data set
			for (var ch_j = 0; ch_j < ch_dataset.length; ch_j++) {
				var ch_index = ch_getIndex(ch_data, ch_dataset[ch_j]["Country1"], ch_dataset[ch_j]["Country2"]);
				if (ch_index > -1) {
					ch_data[ch_index]["Value"] = Number(ch_data[ch_index]["Value"]) + Number(ch_dataset[ch_j]["Value"]);
				} else { // if there wasn't a corresponding entry before, add one
					ch_data[ch_data.length] = ch_dataset[ch_j];
				}
			}
		}

		if (ch_fileInd == 0 && ch_loadVisBool) { 
			var ch_mpr = chordMpr(ch_data);
			ch_mpr.addValuesToMap("Country1")
				.setFilter(function (ch_row, ch_a, ch_b) {
					return (ch_row.Country1 === ch_a.name && ch_row.Country2 === ch_b.name)
				})
				.setAccessor(function (ch_recs, ch_a, ch_b) {
					if (!ch_recs[0]) {
						return 0;
					}
					return +ch_recs[0].Value;
				});
			loadChordVis(ch_mpr.getMatrix(), ch_mpr.getMap(), ch_chordWidth, ch_chordHeight); 
		}
	});
}

// load the chord diagram vis
function loadChordVis(matrix, mmap, ch_chordWidth, ch_chordHeight) {
	// define the dimensions
	wchord = ch_chordWidth; 
	hchord = ch_chordHeight;

    // define the radii
    ch_r1 = hchord / 2;
    ch_r0 = ch_r1 - 100;

    // create the fill
    ch_fill = d3.scale.ordinal()
        .domain(d3.range(ch_countries.length))
        .range(ch_colors);

    // create the chord layout
    chord = d3.layout.chord()
        .padding(.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

    // create the arc
    ch_arc = d3.svg.arc()
        .innerRadius(ch_r0)
        .outerRadius(ch_r0 + 20);

    // create the svg
    var ch_svg = d3.select("#vizPanel").append("svg:svg") 
        .attr("width", wchord) 
        .attr("height", hchord)
        .attr("id", "chordSvg")
        .append("svg:g")
        .attr("id", "circle")
        .attr("transform", "translate(" + wchord / 2 + "," + hchord / 2 + ")");

    ch_svg.append("circle")
        .attr("r", ch_r0 + 20);

    ch_rdr = chordRdr(matrix, mmap);
    chord.matrix(matrix);

    // add the arcs
    var ch_arcs = ch_svg.selectAll("chord-arc")
    	.data(chord.groups())
    	.enter()
    	.append("svg:path")
    	.attr("class", "group chord-arc")
    	.style("stroke", "black")
        .style("fill", function (d) {
            return ch_fill(d.index);
        })
        .attr("d", ch_arc)
        .on("mouseover", function (d, i) {
        	ch_mouseover(d, i, true);
        })
        .on("mouseout", function (d) {
            d3.select("#chord-tooltip").style("visibility", "hidden");
            ch_unBrush();
        });

    // add the text
    var ch_text = ch_svg.selectAll("chord-text")
    	.data(chord.groups())
    	.enter()
    	.append("svg:text")
    	.attr("class", "group chord-text")
    	.each(function (d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr("dy", ".35em")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "12px")
        .attr("text-anchor", function (d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function (d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (ch_r0 + 26) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function (d) {
            return ch_rdr(d).gname;
        })
        .on("mouseover", function (d, i) {
        	ch_mouseover(d, i, true);
        })
        .on("mouseout", function (d) {
            d3.select("#chord-tooltip").style("visibility", "hidden");
            ch_unBrush();
        });
 
    // add the chords
    chordPaths = ch_svg.selectAll("path.chord")
        .data(chord.chords())
        .enter().append("svg:path")
        .attr("class", "chord")
        .style("stroke", function (d) {
            return d3.rgb(ch_fill(d.target.index)).darker();
        })
        .style("fill", function (d) {
            return ch_fill(d.target.index);
        })
        .attr("d", d3.svg.chord().radius(ch_r0))
        .on("mouseover", function (d) {
            d3.select("#chord-tooltip")
                .style("visibility", "visible")
                .html(chordTip(ch_rdr(d)))
                .style("top", function () {
                    return (d3.event.pageY - 100) + "px";
                })
                .style("left", function () {
                    return (d3.event.pageX - 320) + "px";
                });
        })
        .on("mouseout", function (d) {
            d3.select("#chord-tooltip").style("visibility", "hidden");
            chordPaths.classed("fade", false);
        });
    ch_initialized = true;
}

//chord mapper
function chordMpr(data) {
    var mpr = {},
        mmap = {},
        n = 0,
        matrix = [],
        filter, accessor;

    mpr.setFilter = function (fun) {
            filter = fun;
            return this;
        },
        mpr.setAccessor = function (fun) {
            accessor = fun;
            return this;
        },
        mpr.getMatrix = function () {
            matrix = [];
            _.each(mmap, function (a) {
                if (!matrix[a.id]) matrix[a.id] = [];
                _.each(mmap, function (b) {
                    var recs = _.filter(data, function (row) {
                        return filter(row, a, b);
                    })
                    matrix[a.id][b.id] = accessor(recs, a, b);
                });
            });
            return matrix;
        },
        mpr.getMap = function () {
            return mmap;
        },
        mpr.printMatrix = function () {
            _.each(matrix, function (elem) {
                console.log(elem);
            })
        },
        mpr.addToMap = function (value, info) {
            if (!mmap[value]) {
                mmap[value] = {
                    name: value,
                    id: n++,
                    data: info
                }
            }
        },
        mpr.addValuesToMap = function (varName, info) {
            var values = _.uniq(_.pluck(data, varName));
            _.map(values, function (v) {
                if (!mmap[v]) {
                    mmap[v] = {
                        name: v,
                        id: n++,
                        data: info
                    }
                }
            });
            return this;
        }
    return mpr;
}

// chord reader
function chordRdr(matrix, mmap) {
    return function (d) {
        var i, j, s, t, g, m = {};
        if (d.source) {
            i = d.source.index;
            j = d.target.index;
            s = _.where(mmap, {
                id: i
            });
            t = _.where(mmap, {
                id: j
            });
            m.sname = s[0].name;
            m.sdata = d.source.value;
            m.svalue = +d.source.value;
            m.stotal = _.reduce(matrix[i], function (k, n) {
                return k + n
            }, 0);
            m.tname = t[0].name;
            m.tdata = d.target.value;
            m.tvalue = +d.target.value;
            m.ttotal = _.reduce(matrix[j], function (k, n) {
                return k + n
            }, 0);
        } else {
            g = _.where(mmap, {
                id: d.index
            });
            m.gindex = d.index; // emily
            m.gname = g[0].name;
            m.gdata = g[0].data;
            m.gvalue = d.value;
        }
        m.mtotal = _.reduce(matrix, function (m1, n1) {
            return m1 + _.reduce(n1, function (m2, n2) {
                return m2 + n2
            }, 0);
        }, 0);
        return m;
    }
}

// update the chord diagram with the given list of countries and years
function updateChordDiagram(ch_newCountries, ch_newYears) {
	if (ch_newYears.length > 1) {
        console.log("Chord.js: Updating chord diagram (" + ch_newYears[0] + "-" + ch_newYears[ch_newYears.length - 1] + ")");
    } else if (ch_newYears.length == 1) {
        console.log("Chord.js: Updating chord diagram (" + ch_newYears[0] + ")");
    } else {
        console.log("Chord.js: ERROR: Invalid year array passed to updateChordDiagram function.");
        console.log("Chord.js: Years: " + ch_newYears);
    }
	console.log("Chord.js: Countries on diagram: " + ch_newCountries);
	
	var ch_yearChangeBool = false;
    if (ch_newYears.length != ch_year.length) {
    	ch_yearChangeBool = true;
    } else {
    	for (var ch_i = 0; ch_i < ch_newYears.length; ch_i++) {
    		if (ch_newYears[ch_i] != ch_year[ch_i]) {
    			ch_yearChangeBool = true;
    		}
    	}
    }
    ch_year = ch_newYears;
    ch_countries = ch_newCountries;
    
    ch_data = null;
    updateChordDiagramData(ch_newYears, 0);
}

// update the chord diagram data
function updateChordDiagramData(y, ch_fileInd) {
	d3.csv("data/" + y[ch_fileInd] + "AggregatedArmsData.csv", function (ch_dataset) {
        if (ch_fileInd < ch_year.length - 1) {
            updateChordDiagramData(ch_year, Number(ch_fileInd) + 1);
        }
        if (ch_data == null) {
        	ch_data = ch_dataset.filter(function (d) {
    			if (ch_countries.length > 0) {
    				if (Number(d["Value"].trim()) != 0 && ch_countries.indexOf(d["Country1"]) > -1 && ch_countries.indexOf(d["Country2"]) > -1) {
    					return true;
    				}
    			} else {
    				if (Number(d["Value"].trim()) != 0) {
    					return true;
    				}
    			}
    		});
            
            // if country list was empty, populate it
            if (ch_countries.length == 0) {
            	for (var ch_i = 0; ch_i < ch_data.length; ch_i++) {
            		if (ch_countries.indexOf(ch_data[ch_i]["Country1"].trim()) < 0) {
            			ch_countries.push(ch_data[ch_i]["Country1"].trim());
            		}
            		if (ch_countries.indexOf(ch_data[ch_i]["Country2"].trim()) < 0) {
            			ch_countries.push(ch_data[ch_i]["Country2"].trim());
            		}
            	}
            }
        } else {
            // add each data item to the corresponding data item in the first data set
        	for (var ch_j = 0; ch_j < ch_dataset.length; ch_j++) {
				var ch_index = ch_getIndex(ch_data, ch_dataset[ch_j]["Country1"], ch_dataset[ch_j]["Country2"]);
				if (ch_index > -1) {
					ch_data[ch_index]["Value"] = Number(ch_data[ch_index]["Value"]) + Number(ch_dataset[ch_j]["Value"]);
				} else { // if there wasn't a corresponding entry before, add one
					ch_data[ch_data.length] = ch_dataset[ch_j];
				}
			}
        }

        if (ch_fileInd == 0) {
        	var ch_mpr = chordMpr(ch_data);
			ch_mpr.addValuesToMap("Country1")
				.setFilter(function (ch_row, ch_a, ch_b) {
					return (ch_row.Country1 === ch_a.name && ch_row.Country2 === ch_b.name)
				})
				.setAccessor(function (ch_recs, ch_a, ch_b) {
					if (!ch_recs[0]) {
						return 0;
					}
					return +ch_recs[0].Value;
				});
			updateChordDiagramVis(ch_mpr.getMatrix(), ch_mpr.getMap());
        }
    });
}

// update the chord diagram vis
function updateChordDiagramVis(matrix, mmap) {
	var ch_transitionDuration = 1000;
	
	// update the fill
	ch_fill = d3.scale.ordinal()
        .domain(d3.range(ch_countries.length))
        .range(ch_colors);

	// the svg
    var ch_svg = d3.select("#vizPanel").select("#chordSvg").select("#circle");
    
    ch_rdr = chordRdr(matrix, mmap);
    chord.matrix(matrix);

    // remove all existing arcs -- these don't update correctly for some reason
    ch_svg.selectAll(".chord-arc").remove(); 
   
    var ch_arcs = ch_svg.selectAll(".chord-arc")
    	.data(chord.groups());
    
    // create new arcs
    ch_arcs.enter()
    	.append("svg:path")
    	.attr("class", "group chord-arc")
    	.style("stroke", "black")
        .on("mouseover", function (d, i) {
        	ch_mouseover(d, i, true);
        })
        .on("mouseout", function (d) {
            d3.select("#chord-tooltip").style("visibility", "hidden");
            ch_unBrush();
        });
    
    // update the arcs
    ch_arcs.transition().duration(ch_transitionDuration)
    	.style("fill", function (d) {
    		return ch_fill(d.index);
    	})
    	.attr("d", ch_arc); // this causes errors in the console -- ignore them
    
    // remove old arcs
    ch_arcs.exit().transition().duration(ch_transitionDuration).style("opacity", 0).remove();

    // text
    var ch_text = ch_svg.selectAll(".chord-text")
    	.data(chord.groups());
    
    // add new text
    ch_text.enter()
    	.append("svg:text")
    	.attr("class", "group chord-text")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "12px");
    
    // update text
    ch_text.transition().duration(ch_transitionDuration)
    	.each(function (d) {
    		d.angle = (d.startAngle + d.endAngle) / 2;
    	})
    	.attr("dy", ".35em")
    	.attr("text-anchor", function (d) {
    		return d.angle > Math.PI ? "end" : null;
    	})
    	.attr("transform", function (d) {
    		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (ch_r0 + 26) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
    	})
    	.text(function (d) {
    		return ch_rdr(d).gname;
    	});
    
    // update mouseover action for text
    ch_text.on("mouseover", function (d, i) {
    		ch_mouseover(d, i, true);
    	})
    	.on("mouseout", function (d) {
    		d3.select("#chord-tooltip").style("visibility", "hidden");
    		ch_unBrush();
    	});
    
    // remove old text
    ch_text.exit().transition().duration(ch_transitionDuration).style("opacity", 0).remove();

    // chords
    chordPaths = ch_svg.selectAll("path.chord")
        .data(chord.chords());
    
    // add new chords
    chordPaths.enter()
    	.append("svg:path")
        .attr("class", "chord");
    
    // update chords
    chordPaths.transition().duration(ch_transitionDuration)
    	.style("stroke", function (d) {
        	return d3.rgb(ch_fill(d.target.index)).darker();
    	})
    	.style("fill", function (d) {
    		return ch_fill(d.target.index);
    	})
    	.attr("d", d3.svg.chord().radius(ch_r0)); // this causes errors in the console -- ignore them
    
    // update the mouseover function for chords
    chordPaths.on("mouseover", function (d) {
        d3.select("#chord-tooltip")
        	.style("visibility", "visible")
        	.html(chordTip(ch_rdr(d)))
        	.style("top", function () {
        		return (d3.event.pageY - 100) + "px";
        	})
        	.style("left", function () {
        		return (d3.event.pageX - 320) + "px";
        	});
    	})
    	.on("mouseout", function (d) {
    		d3.select("#chord-tooltip").style("visibility", "hidden");
    		chordPaths.classed("fade", false);
    	});
    
    // remove old chord paths
    chordPaths.exit().transition().duration(ch_transitionDuration).style("opacity", 0).remove();
}

// return the text for the tooltip of a chord
function chordTip(d) {
    var p = d3.format(".2%"),
        q = d3.format(",3r");
    return d.sname + " exported $" + q(d.svalue) + " to " + d.tname + ". <br/>" + d.tname + " exported $" + q(d.tvalue) + " to " + d.sname + ".";
}

// return the text for the tooltip of a group
function ch_groupTip(d) {
    var p = d3.format(".1%"),
        q = d3.format(",.3r")
    return d.gname + " Exports: $" + q(d.gvalue) + "<br/>" + p(d.gvalue / d.mtotal) + " of Total Annual Global Exports ($" + q(d.mtotal) + ")"
}

// function for group mouseover
function ch_mouseover(d, i, ch_tooltipBool) {
	if (ch_tooltipBool) {
		d3.select("#chord-tooltip")
			.style("visibility", "visible")
			.html(ch_groupTip(ch_rdr(d)))
			.style("top", function () {
				return (d3.event.pageY - 100) + "px"
			})
			.style("left", function () {
				return (d3.event.pageX - 320) + "px";
			})
	}

    chordPaths.classed("fade", function (p) {
        return p.source.index != i && p.target.index != i;
    });
    
    var ch_brushCountryName = ch_rdr(d).gname; 
    
    // brush & link with heat map
    d3.select("#chart")
    	.select("#rowLabelGroup")
    	.selectAll(".rowLabel")
    	.style("font-weight", function(d) {
    		if (ch_brushCountryName == d) {
    			return "bold"; 
    		}
    	})
    	.style("font-size", function(d) {
    		if (ch_brushCountryName == d) {
    			return "11pt"; 
    		}
    	})
    	.style("fill", function(d) {
    		if (ch_brushCountryName == d) {
    			return "#000"; 
    		}
    	});
}

// remove brushed stylings
function ch_unBrush() {
	chordPaths.classed("fade", false);
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

// return the index of the data item with the given country1 and country2
function ch_getIndex(ch_array, ch_c1, ch_c2) {
    for (var i = 0; i < ch_array.length; i++) {
        if (ch_array[i]["Country1"] == ch_c1 && ch_array[i]["Country2"] == ch_c2) {
            return i;
        }
    }
    return -1;
}

// clear the viz panel
function ch_clearPanel() {
	console.log("Chord.js: Clearing viz panel");
	$('#vizPanel').empty();
	ch_initialized = false; 
}

// get the countries on the chord diagram
function getCountriesOnChordDiagram() {
	return ch_countries; 
}