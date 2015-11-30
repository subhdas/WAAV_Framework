//declare global variables
year = "1992";
years = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
var counter = 0;
var brushCounter = 0;


formatDate = d3.time.format("%b %d");

// parameters
var margin = {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25
    },
    width = 560 - margin.left - margin.right,
    height = 100 - margin.bottom - margin.top;


// scale function
var timeScale = d3.time.scale()
    .domain([new Date('1992-01-02'), new Date('2012-01-01')])
    .range([0, width])
    .clamp(true);


// initial value
var startValue = timeScale(new Date('2011-01-10'));
//startingValue = new Date('1996-03-20');
startingValue = new Date(year + '-01-10');

//////////
$(document).ready(function () {
    $(".clMenuHead").text(year);
});

// defines brush
var brush = d3.svg.brush()
    .x(timeScale)
    .extent([startingValue, startingValue])
    .on("brush", brushed);

var svg = d3.select("#sliderPanel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "clsliderBar")
    .attr("id", "sliderBar")
    .append("g")
    // classic transform to position g
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.append("g")
    .attr("class", "x axis")
    // put in middle of screen
    .attr("transform", "translate(0," + height / 2 + ")")
    // inroduce axis
    .call(d3.svg.axis()
        .scale(timeScale)
        .orient("bottom")
        .tickFormat(function (d) {
            var val = d.toString().substring(11, 15);
            console.log("Slider.js: End Values are : " + val);
            //return formatDate(d);
            return val;
        })
        .tickSize(5)
        .tickPadding(5)
        .tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
    .select(".domain")
    .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("g")
    .attr("class", "handle")

handle.append("path")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("d", "M 0 -20 V 80")

handle.append('text')
    .text(startingValue) //
    .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

slider
    .call(brush.event)

placeSlider();


function brushed() {


    console.log("Slider.js: Brushed is called : " + brushCounter);


    var value = brush.extent()[0];
    //year = "";

    if (d3.event.sourceEvent) { // not a programmatic event
        value = timeScale.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
    }

    //console.log(String(value).substring(10,15));
    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(function () {

        year = String(value).substring(11, 15);

        //return formatDate(value)
        return year;
    });

    $(".clMenuHead").text(year);

    //--------------------------------
    if (brushCounter % 2 != 0) {
        clean();
        init();
        $(document).ready(function () {

        });

    }
    brushCounter += 1;

}
//--------------------------------
/*
$(document).ready(function () {
    // Your code here
    $("#chart").empty();
    console.log("Slider.js: Year: " + year);
    //array = new Array(10); 
    //array.push("United States of America"); array.push("Germany"); array.push("France");
    //array.push("United Kingdom"); array.push("Mexico"); array.push("Canada"); 
    //array.push("India"); array.push("China");
    loadChordDiagram([], year); 
    if(window.counter > 1){
       $('#chart').empty();
       $('#heatMapPanel').remove();
       init();
       console.log("Slider.js: Called Init()");
    }
    window.counter += 1;
    console.log("Slider.js: Counter is :" + window.counter)
});
*/




function clean() {
    if ($("#heatMapPanel").length > 0) {
        console.log("Slider.js: cleaned chart");
        $("#chart").empty();
    }
}