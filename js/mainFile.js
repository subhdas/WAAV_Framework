// main script file
year = "1992";
years = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
var counter = 0;

function init1() {
    // TODO: something...
    $(document).ready(function () {
        var heatMAP = $(".clHeatMapPanel");
        console.log("MainFile.js: Length is : " + heatMAP.length);

        if (heatMAP.length == 0) {
            console.log("MainFile.js: Double Entries");
            $('#heatMapPanel').remove();
            $('#chart').empty();

        }
        //loadHeatMap(year);
    });
}

function init() {
    // TODO: something...
    $(document).ready(function () {
        clean();
        loadHeatMap([1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005]);
        //loadChordDiagram([], [year, Number(year)+1, Number(year)+2]);
        //loadLineChart("United States of America", "France");
    });
}

//$("#sliderPanel").dateRangeSlider();



//------------------------------------------------------------