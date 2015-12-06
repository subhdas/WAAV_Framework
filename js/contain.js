//declare global variables
year = "1992";
years = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
var ax = 1998;
var ay = 2005;
var togC = true;

var storyTxt1 = "In 1990, the United Nations Security Council imposed an arms embargo on Iraq due to the country's involvement in Kuwait. The embargo wasn't lifted until 2003 when the regime of Saddam Hussein fell.";
var storyTxt2 = "On March 20, 2003, the United States and its allies, including the United Kingdom, Australia, Italy, Poland, Spain, and Denmark, invaded Iraq with a 'shock and awe' bombing campaign. Several months later in December, Saddam Hussein was captured.";
var storyTxt3 = "The insurgency in Iraq expanded through 2004 with increasing violence throughout the country. In April 2004, reports of prisoner abuse at Abu Ghraib surfaced. In November 2004, the Second Battle of Fallujah occurred. It became known as the bloodiest battle of the war.";
var storyTxt4 = "In 2005, Iraq established a transitional government. In 2006, Nouri al-Maliki became the Prime Minister. Despite the formation of Iraq's permanent government, the year was filled with civil war. Its embargo recently lifted, Iraq became one of the biggest importers of arms from the United States. Importing billions of dollars in small arms from 2005 - 2008 along with increased reports of illicit arms trade, the violence in Iraq continued until the United States sent a wave of troops in 2007 in attempts to reduce the violence.";
var storyTxt5 = "After the violence in Iraq was significantly reduced, the United States began withdrawing troops in 2007. President Obama officially withdrew all forces in December 2011. Arms trade, both legal and the unrecorded illicit trade, fueled the violence throughout the war. Death tolls are unclear. Some sources estimate approximately 500,000 Iraqi deaths. From 2003 - 2014, there were 4,491 United States service members killed."; 
var storyYrs = [[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002], [2003], [2003, 2004], [2005, 2006, 2007, 2008], [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011]];
var storyTxt = [storyTxt1, storyTxt2, storyTxt3, storyTxt4, storyTxt5];



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