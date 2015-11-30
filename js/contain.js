//declare global variables
year = "1992";
years = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
var ax = 1998;
var ay = 2005;
var togC = true;

var storyYrs = [[1994, 1996], [1998, 2000], [2001, 2002, 2003, 2004], [2007, 2008, 2009], [2011]];




function toggleColors() {
    console.log("Slider value is : " + togC);

    if (togC) {
        console.log("Contain.js: Added Colors in the divs");
        $("#infoPanel").css("background-color", "grey");
        $("#menuPanel").css("background-color", "chartreuse");
        $("#vizPanel").css("background-color", "yellow");
        $("#titlePanel").css("background-color", "coral");
        $("#matrixPanel").css("background-color", "blue");
        $("#sliderPanel").css("background-color", "burlywood");
        $("#chart").css("background-color", "green");
        $("#sliderDouble").css("background-color", "cyan");
        $("#columnAnotherId").css("background-color", "pink");
        $("#columnleftId").css("background-color", "red");
        $("#lineSvg").css("background-color", "cyan");
        togC = false;
        //$("#sliderDouble").prop('disabled', true);
        //$("#sliderDouble").children().prop('disabled', true);

        /*
        $("#sliderDouble").slider("pips", {
            rest: ""
        });
        */
    } else {
        console.log("Contain.js: Removed Colors in the divs");
        $("#infoPanel").css("background-color", "");
        $("#menuPanel").css("background-color", "");
        $("#vizPanel").css("background-color", "");
        $("#titlePanel").css("background-color", "");
        $("#matrixPanel").css("background-color", "");
        $("#sliderPanel").css("background-color", "");
        $("#chart").css("background-color", "");
        $("#sliderDouble").css("background-color", "");
        $("#columnAnotherId").css("background-color", "");
        $("#columnleftId").css("background-color", "");
        $("#lineSvg").css("background-color", "");
        togC = true;
        //$("#sliderPanel").prop('disabled', false);
        //$("#sliderDouble").children().prop('disabled', false);
        //  $('#sliderPanel').fadeTo('slow', .6);
        //$('#sliderPanel').append('<div style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:1;filter: alpha(opacity = 100)"></div>');
        /*
        $("#sliderDouble").slider("pips", {
            rest: "label"
        });
        */

    }


}




//function declarations --------------------------
function clean() {
    if ($("#heatMapPanel").length > 0) {
        console.log("Contain.js: cleaned chart");
        $("#chart").empty();
    }
}




function placeSlider() {

    var a = $("#sliderPanel").width();
    var b = $("#sliderDouble").width();

    var x = $("#sliderPanel").height();
    var y = $("#sliderDouble").height();

    var mov1 = (a - b) / 2;
    var mov2 = (x - y) / 4;
    $("#sliderDouble").css("margin-left", "" + mov1 + "px");
    //$("#sliderDouble").css("margin-top", "" + mov2 + "px");

    console.log("Contain.js: Width is : " + mov1);



}