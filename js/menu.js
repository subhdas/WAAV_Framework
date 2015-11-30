var widA = $("#contentPanel").width();
var widB = $("#infoPanel").width() / 2;
var pos = widA + widB;
window.togStory = 0;



//local variables
var formContent = "<div class = 'clFormDiv'><p class = 'clFormHead'>Filter Menu</p><form class ='clFilterForm id = 'filterForm'> Country Name:<br><input type='text' name='countryName' value=''><br>Continent Name:<br><input type='text' name='YearRangeFrom' value=''><br><input type='text' name='YearRangeTo' value=''><br><input type='checkbox' name='importCheckBox'/>Import<br /><input type='checkbox' name='exportCheckBox' checked='checked'/>Export<br /><br><select name='weapons'><option>Missiles</option><option>SubMarines</option><option>Aircrafts</option><option selected='selected'>Ships</option></select><br><br><br><br><br><input type = 'submit' value ='Go'/><br></form></div>";


var countrySelectionList = "<select id='countrySelection' multiple size = 10></select><input id = 'searchBtn2' type='button' onclick='onSelectCountries()' value='Search'>";

var searchContent = "<div class = 'clFormDiv'><p class = 'clFormHead'>Search Menu</p><div id='tfheader'><form id='tfnewsearch' method='get' action=''><input type='text'  value ='Search Countries, Continents' id='searchBar' class='tftextinput' name='q' size='21' maxlength='120' onclick = 'clearSearchBar()'></form><button class='tfbutton' id='searchBtn' onclick='searchFunc()'>Search</button>" + countrySelectionList + "<div class = 'tfclear'></div></div> </div>";

// get the list of countries each year
cAll = [];

function parseCountries() {
    d3.csv("data/TopExportersByYear.csv", function (data) {

        for (var i = 0; i < data.length; i++) {
            cList = []
            for (var key in data[i]) {
                if (data[i].hasOwnProperty(key)) {
                    var obj = data[i][key];
                    cList.push(obj);
                }
            }
            cAll.push(cList);

        }
        addContent(cAll)
    });

}

function addContent(cAll) {
    index = year - 1992;
    console.log("Menu.js: year is : " + year + " index is : " + index);
    for (var i = 1; i < cAll[index].length; i++) {
        var item = cAll[index];

        var optionValue = "<option>" + item[i] + "</option>";
        $("#countrySelection").append(optionValue);
    }
}

function makeDropList(selectionList) {
    $(".columnleft").remove();
    var listMaker1 = "<div class = 'columnleft' id='columnleftId'><ul class = 'sortable-list'></ul></div>"
    $("#menuHidden").append(listMaker1);
    $(".columnanother").remove();
    var listMaker2 = "<div class = 'columnanother' id='columnAnotherId'><ul class = 'another-sortable-list' id ='secondlist'></ul></div>";
    $("#menuHidden").append(listMaker2);
    for (i = 0; i < selectionList.length; i++) {
        var id = "drag" + i;
        var listValue = "<li class='sortable-item' id =" + id + ">" + selectionList[i] + "</li>";
        $(".sortable-list").append(listValue);
    }

}

function dragDrop() {
    $('.sortable-item').draggable();
    $('ul.another-sortable-list').droppable({
        over: function (event, ui) {
            ui.draggable.remove();
            getCountryList();
        }

    });


}

function getCountryList() {
    var countryNamesList = []
    for (var i = 0; i < sizeArray; i++) {
        var id = "#drag" + i;
        countryNamesList.push($(id).text())
    }
    console.log("Menu.js: Country Names List : " + countryNamesList);
    countryNamesList = countryNamesList.filter(function (v) {
        return v !== ''
    });

    var clickedCells = [];
    var clickedVals = $('.cell-click');
    for (var i = 0; i < clickedVals.length; i++) {
        var tempC1 = clickedVals[i]["__data__"]["Country1"];
        var tempC2 = clickedVals[i]["__data__"]["Country2"];
        clickedCells.push({
            c1: tempC1,
            c2: tempC2
        });
    }

    updateHeatMap(countryNamesList, countryNamesList, yearValues, clickedCells);
    sizeArray = countryNamesList.length;

    console.log("Menu.js: Country Names List Size is : " + countryNamesList.length + ", Size Array is : " + sizeArray);

}


function onSelectCountries() {
    var selectionList = [];
    var i;
    var count = 0;
    var sel = document.getElementById("countrySelection");
    //console.log($("#countrySelection"));
    for (i = 0; i < sel.options.length; i++) {
        if (sel.options[i].selected) {
            selectionList[count] = sel.options[i].value;
            count++;
        }
    }

    sizeArray = selectionList.length;
    console.log("Menu.js: Countries: " + selectionList)
    var clickedCells = [];
    var clickedVals = $('.cell-click');
    for (var i = 0; i < clickedVals.length; i++) {
        var tempC1 = clickedVals[i]["__data__"]["Country1"];
        var tempC2 = clickedVals[i]["__data__"]["Country2"];
        clickedCells.push({
            c1: tempC1,
            c2: tempC2
        });
    }
    updateHeatMap(selectionList, selectionList, yearValues, clickedCells);
    makeDropList(selectionList);
    dragDrop(sizeArray);
}






var valY = parseInt(yearValues[yearValues.length - 1]) + 1;
var xT = "Drag Handles to Update Year(s). Currently Selected: " + yearValues[0] + " - " + valY;
$("#sliderDouble").attr("title", xT);

var divBack = '<div class = "clMenuBack" id ="menuBack"></div>';
var divHidden = '<div class = "clMenuHidden" id ="menuHidden"></div>';
var divExtraPanel = '<div class = "clExtraPanel" id ="extraPanel"></div>';
var menuHeader = '<p class ="clMenuHead" id = "menuHead" title="Selected Years">' + yearValues + '< /p>';
var menuDescr = '<p class ="clMenuDesc" id = "menuDesc">Worldwide Arms and Ammunition Trade</p>';

var iconSearch = '<img src ="./img/menu/filterBtn.png" width = "30" height = "40" class ="clImgMenu" id = "imgSearch" title="Search & Filter">';
var iconHome = '<img src ="./img/menu/homeBtn.png" width = "30" height = "40" class ="clImgMenu" id = "imgHome" title="Home">';
var clearBtn = '<img src ="./img/menu/clearBtn.png" width = "40" height = "40" class ="clImgMenu" id = "imgClear" onclick = "clearSelections()" title="Clear Selections">';
var goBtn = '<img src ="./img/menu/goBtn.png" width = "40" height = "35" class ="clGoBtn" id = "goBtn" onclick = "menuFolded()" title="Click to Know More">';

var fullBtn = '<img src ="./img/menu/fullScreenBtn.png" width = "20" height = "25" class ="clFullBtn" id = "fullBtn" onclick = "menuClose()" title="Show / Hide Menu Panel">';
var clsBtn = '<img src ="./img/menu/clsBtn2.png" width = "40" height = "40" class ="clImgMenuFolded" id = "clsBtn" onclick = "closeViz()" title="Close Panel">';
var toggleStoryBtn = '<a href="#" class="toggler" id="tgStoryMode" title="Toggle Story Mode">&nbsp;</a>';
var nxtBtn = '<img src ="./img/menu/nxtBtn.png" width = "30" height = "30" class ="clImgMenu" id = "nxtBtnId" onclick = "nextCall(true)" title="Next Story Point">';
var prevBtn = '<img src ="./img/menu/prevBtn.png" width = "30" height = "30" class ="clImgMenu" id = "prevBtnId" onclick = "nextCall(false)" title="Previous Story Point">';
var storyTitle = '<p class ="clStoryTitle" id = "storyTitle">Story Mode On</p>';

var mapFiller = '<svg class="clMapSvg" id="mapSvg"><img src ="./img/map.png" width = "585" height = "400" class ="clImgMenu" id = "imgMap"></svg>';

//adding content to the menu panel
$(".clMenuPanel").append(divBack);
$(".clMenuPanel").append(divExtraPanel);
$("#titlePanel").append(fullBtn);
$("#titlePanel").append(menuHeader);
$(".clMenuBack").append(iconSearch);
$(".clMenuBack").append(iconHome);
$(".clMenuBack").append(clearBtn);
$(".clMenuBack").append(toggleStoryBtn);







//Interactions +++++++++++++++++++++++++++++++++++++++++++++++
var textContent = "" + ax + " - " + ay + "";
$(".clMenuHead").text(textContent);
//open the viz page
$("#goBtn").click(function () {
    menuFolded();
});

//reload from home from server, not cache
$("#imgHome").click(function () {
    location.reload(true);
});

$("#clearBtn").click(function () {
    clearSelections();
})


$("#imgSearch").click(function () {

    if (togStory % 2 == 0) {
        if ($("#menuHidden").is(":visible") == false) {
            showSearchMenu();
            var menuBackPos = $('.clMenuBack').offset();
            var menuHiddenWidth = $('#menuHidden').outerWidth();
            var value = menuBackPos.left - menuHiddenWidth;
            $('#menuHidden').css('width', menuHiddenWidth);
            $('#menuHidden').css('position', 'fixed');
            $("#menuHidden").css('left', value);
            $('#menuHidden').show();
            console.log("Menu.js: show it")
        } else {
            $('#menuHidden').hide();
            console.log("Menu.js: hide it")
        }
    }


});

$("#mainTitle").click(function () {
    console.log('Menu.js: Toggling Colors');
    toggleColors();
    return
})


$("#imgFilter").click(function () {

    if ($("#menuHidden").is(":visible") == false) {
        showFilterMenu();
        var menuBackPos = $('.clMenuBack').offset();
        var menuHiddenWidth = $('#menuHidden').outerWidth();
        var value = menuBackPos.left - menuHiddenWidth;
        $('#menuHidden').css('width', menuHiddenWidth);
        $('#menuHidden').css('position', 'fixed');
        $("#menuHidden").css('left', value);
        $('#menuHidden').show();
        console.log("Menu.js: show it")
    } else {
        $('#menuHidden').hide();
        console.log("Menu.js: hide it");
    }
});

//story mode toggler
$(document).ready(function () {
    $('a.toggler').click(function () {
        $(this).toggleClass('off');
        togStory += 1;
        togStoryMode(togStory);
    });
});
//End of Interactions ++++++++++++++++++++++++++++++++++++++++


// tooltips++++++++++++++++++++++++++++++++++++++
$(document).ready(function () {
    $(document).tooltip();

});

//end of tooltips ++++++++++++++++++++++++++++++++++++++++++++









// call functions here=========================================

var wid = 0;
var widC = 0;
var tick = false;
var initWidth = hm_width;
var indVal = -1;

function nextCall(tag) {
    if (tag) {
        indVal += 1;
    } else {
        indVal -= 1;
    }

    if (indVal > storyYrs.length - 1) {
        indVal = 0;
    }

    if (indVal < 0) {
        indVal = storyYrs.length - 1;
    }
    updateHeatMap(rowCountries, colCountries, storyYrs[indVal]);
    if (storyYrs[indVal].length == 1) {
        var valText = "" + storyYrs[indVal][0] + "";
    } else {
        var valText = "" + storyYrs[indVal][0] + " - " + storyYrs[indVal][(storyYrs[indVal].length - 1)] + "";

    }
    $(".clMenuHead").text("");
    $(".clMenuHead").text(valText);
    console.log("Story Milestone Button Pressed :" + indVal + "   " + storyYrs[indVal]);
    return
}


function togStoryMode(story) {
    if (story % 2 != 0) {
        $("#imgSearch").css("opacity", "0.2");
        $("#imgClear").css("opacity", "0.2");
        $(".clMenuBack").append(nxtBtn);
        $(".clMenuBack").append(prevBtn);
        $("#sliderDouble").addClass("disabledbutton");

        $("#sliderDouble").css("opacity", "0.25");
        $("#sliderPanel").append(storyTitle);
    } else {
        $("#imgSearch").css("opacity", "1");
        $("#imgClear").css("opacity", "1");
        $("#nxtBtnId").remove();
        $("#prevBtnId").remove();
        $(".disabledbutton").css("opacity", "1");
        $(".disabledbutton").removeClass("disabledbutton");
        $("#storyTitle").remove();
    }

}

//to make it go full screen
function menuClose() {

    if ($("#imgSearch").is(":visible") && !tick) {
        wid = $("#infoPanel").width();
        widC = $("#contentPanel").width();
        $("#contentPanel").width(widC + wid - 10);
        $("#infoPanel").children().hide();
        $(".clMenuBack").children().hide();
        $(".clMenuPanel").show();
        $(".clMenuBack").show();
        $("#fullBtn").show();
        $("#infoPanel").width("5px");
        $("#infoPanel").hide();
        console.log("Menu.js: Full Screen Mode ON");
        tick = true;
        hm_width = $("#chart").width() - hm_margin.right - hm_margin.left;
        window.clickedCells = [];
        var clickedVals = $('.cell-click');
        for (var i = 0; i < clickedVals.length; i++) {
            var tempC1 = clickedVals[i]["__data__"]["Country1"];
            var tempC2 = clickedVals[i]["__data__"]["Country2"];
            clickedCells.push({
                c1: tempC1,
                c2: tempC2
            });
        }
        updateHeatMapWidth(); 
    } else {
        wid = wid - 5;
        widC = widC + 4;
        $("#contentPanel").width("" + widC + "px");
        $("#infoPanel").width("" + wid + "px");
        $("#infoPanel").children().show();
        $(".clMenuBack").children().show();
        $("#infoPanel").show();
        $("#infoPanel").css("float", "right");
        $("#contentPanel").css("float", "left");

        tick = false;
        console.log("Menu.js: Full Screen Mode OFF");

        if ($("#extraPanel").is(":visible") == true) { hm_width = $("#chart").width() - hm_margin.right - hm_margin.left - $("#menuHidden").width(); }
        else { hm_width = initWidth; }
        window.clickedCells = [];
        var clickedVals = $('.cell-click');
        for (var i = 0; i < clickedVals.length; i++) {
            var tempC1 = clickedVals[i]["__data__"]["Country1"];
            var tempC2 = clickedVals[i]["__data__"]["Country2"];
            clickedCells.push({
                c1: tempC1,
                c2: tempC2
            });
        }
        updateHeatMapWidth(); 
    }


}

function closeViz() {
    $('#vizPanel').empty();
    $('#clsBtn').hide();


    $('#tgStoryMode').show();
    $("#extraPanel").hide();
    $('#contentPanel').width('97%');
    $('#infoPanel').width('3%');
    $('#menuPanel').height('100%');
    $('#vizPanel').height('0%');
    $('#extraPanel').height('0%');
    $('#menuBack').height('100%');
    $(".clImgMenuFolded").switchClass("clImgMenuFolded", "clImgMenu", 0);
    $("#mainTitle").css("font-size", "50px");
    $("#menuHead").css("font-size", "50px");
    hm_width = firstWidthHM;
    updateHeatMapWidth(); 
    $('.clGoBtn').remove();

}


function menuFolded() {
    window.firstWidthHM = hm_width;

    // determine how many countries are represented by the clicked cells
    var clickedCountries = [];
    var clickedVals = $('.cell-click');
    var clickedCells = [];
    for (var i = 0; i < clickedVals.length; i++) {
        var tempC1 = clickedVals[i]["__data__"]["Country1"];
        var tempC2 = clickedVals[i]["__data__"]["Country2"];
        clickedCells.push({
            c1: tempC1,
            c2: tempC2
        });
        if (clickedCountries.indexOf(tempC1) < 0) {
            clickedCountries.push(tempC1);
        }
        if (clickedCountries.indexOf(tempC2) < 0) {
            clickedCountries.push(tempC2);
        }
    }

    console.log("Menu.js: Clicked countries: " + clickedCountries);

    $('.clMenuHidden').hide();
    $('#clsBtn').remove();
    $('.clMenuBack').append(clsBtn);
    $('#clsBtn').show();

    var extraBox = '<div class = "clExtraBox" id ="extraBox"></div>';
    extraBox += '<p id = "extraTitle">Germany</p>';
    extraBox += '<img src ="./img/menu/fillerImg.jpg" width = "450" height = "200" class ="clFillImg" id = "fillImg">';

    $("#extraPanel").empty();
    $("#extraPanel").append(extraBox);
    var val = parseInt(100 * $('#contentPanel').outerWidth() / $(window).outerWidth());

    $("#extraPanel").show();
    $('#contentPanel').width('65%');
    $('#infoPanel').width('35%');
    $('#menuPanel').height('35%');
    $('#vizPanel').height('65%');
    
    //make the menu back lesser height
    $('#menuBack').height('100px');
    $('#extraPanel').height('360px');
    $('#tgStoryMode').hide();
    $(".clImgMenu").switchClass("clImgMenu", "clImgMenuFolded", 0);
    
    $("#mainTitle").css("font-size", "30px");
    $("#menuHead").css("font-size", "30px");
    hm_width = $("#chart").width() - hm_margin.right - hm_margin.left;
    updateHeatMapWidth();

    placeSlider();
    console.log('Menu.js: menu is folded');

    if (clickedCountries.length == 2) {
    	d3.select("#vizPanel").style("background", "#f2f2f2");
    	if ($('#chordSvg').length != 0 || $('#mapSvg').length != 0) { // clear chord & map
    		ch_clearPanel();
    		lc_initialized = false; 
    	}
        lc_width = $('#vizPanel').width() - 150;
        lc_height = $('#vizPanel').height() - 100;
        lc_margin.left = 85;
        lc_margin.right = 40;
        console.log("Menu.js: Showing Line Chart");
        updateLineChart(clickedCountries[0], clickedCountries[1]);
    } else if (clickedCountries.length == 1) {
    	d3.select("#vizPanel").style("background", "#f2f2f2");
    	$('#vizPanel').empty(); 
    	$('#vizPanel').append(mapFiller);
    } else {
    	d3.select("#vizPanel").style("background", "#f2f2f2");
    	if ($('#lineSvg').length != 0 || $('#mapSvg').length != 0) { // clear line chart & map
    		lc_clearPanel();  
    		ch_initialized = false; 
    	}
        wchord = $('#vizPanel').width() - 20;
        hchord = $('#vizPanel').height() - 20;
        console.log("Menu.js: Showing Chord Diagram");
        console.log("Menu.js: " + clickedVals.length + " cells clicked, representing " + clickedCountries.length + " countries");
        loadChordDiagram(clickedCountries, yearValues);
    }
}





function clearSearchBar() {
    if ($("#searchBar").val() == "Search Countries, Continents") {
        $("#searchBar").val("");
    }
    console.log("Menu.js: Search Bar Cleared")
}

// clear all selected cells and labels
function clearSelections() {
    console.log("Menu.js: Clearing Selections");
    d3.selectAll(".cell").classed("cell-click", false);
    d3.selectAll(".rowLabel").classed("text-click", false);
    d3.selectAll(".colLabel").classed("text-click", false);
}

// when go button clicked
function searchFunc() {
    var value = $("#searchBar").val();
    console.log("Menu.js: Search Bar Value is : " + value);
    var array = value.split(',');
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    console.log(array);
    var clickedCells = [];
    var clickedVals = $('.cell-click');
    for (var i = 0; i < clickedVals.length; i++) {
        var tempC1 = clickedVals[i]["__data__"]["Country1"];
        var tempC2 = clickedVals[i]["__data__"]["Country2"];
        clickedCells.push({
            c1: tempC1,
            c2: tempC2
        });
    }
    updateHeatMap(array, array, yearValues, clickedCells);

}





function showFilterMenu() {
    $('.clMenuHidden').empty();
    $(".clMenuPanel").append(divHidden);
    console.log("Menu.js: adding the form");
    $('.clMenuHidden').append(formContent);
    $('.clMenuHidden').hide();
}

function showSearchMenu() {
    $('.clMenuHidden').empty();
    $(".clMenuPanel").append(divHidden);
    console.log("Menu.js: adding searchBox");
    parseCountries();
    $('.clMenuHidden').append(searchContent);
    $('.clMenuHidden').hide();
}

// end of functions here=========================================