var widA = $("#contentPanel").width();
var widB = $("#infoPanel").width() / 2;
var pos = widA + widB;
window.togStory = 0;
var storyCountries = ["Iraq", "United States", "United Kingdom", "Australia", "Italy", "Poland", "Spain", "Denmark"];



//local variables
var formContent = "<div class = 'clFormDiv'><p class = 'clFormHead'>Filter Menu</p><form class ='clFilterForm id = 'filterForm'> Country Name:<br><input type='text' name='countryName' value=''><br>Continent Name:<br><input type='text' name='YearRangeFrom' value=''><br><input type='text' name='YearRangeTo' value=''><br><input type='checkbox' name='importCheckBox'/>Import<br /><input type='checkbox' name='exportCheckBox' checked='checked'/>Export<br /><br><select name='weapons'><option>Missiles</option><option>SubMarines</option><option>Aircrafts</option><option selected='selected'>Ships</option></select><br><br><br><br><br><input type = 'submit' value ='Go'/><br></form></div>";


var countrySelectionList = "<select id='countrySelection' multiple size = 10></select><input id = 'searchBtn2' type='button' onclick='onSelectCountries()' value='Search'>";

//radio buttons
var inpA = "<label class = 'clRadioLabel'><input type='radio' name='sortType' value='Alphabetically' checked='checked'/>Alphabetically</label>";
var inpB = "<br><label class = 'clRadioLabel'><input type='radio' name='sortType' value='Continent'/>By Continent</label>";
var inpC = "<br><label class = 'clRadioLabel'><input type='radio' name='sortType' value='Value'/>By Value</label><br>";
var sortBtn = "<br><button class='tfbutton' id='sortBtn' onclick='sortAction()'>Sort Data</button>"

//checkboxes
var inpCB1 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idAfrica' name='contName' value='Africa' checked=''/> Africa</label>";
var inpCB2 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idAsia' name='contName' value='Asia' checked='checked'/> Asia</label>";
var inpCB3 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idEurope' name='contName' value='Europe' checked=''/> Europe</label>";
var inpCB4 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idNorAmerica' name='contName' value='North America' checked=''/> North America</label>";
var inpCB5 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idOceania' name='contName' value='Oceania' checked=''/> Oceania</label>";
var inpCB6 = "<br><label class = 'clCheckBoxLabel'><input type='checkbox' id='idSouAmerica' name='contName' value='South America' checked='checked'/> South America</label>";
var continentBtn = "<br><br><button class='tfbutton' id='searchContBtn' onclick='filterContinent()'>Filter By Continent</button>"

//<label for="graphics"> <input type="checkbox" id="graphics" name="graphics" value="yes"> Graphic Design</label>



var searchContent = "<div class = 'clFormDiv'><br><br><br><br><br><p class = 'clFormHead'>Search & Filter</p><div id='tfheader'><form id='tfnewsearch' method='get' action=''><input type='text'  value ='Search Countries' id='searchBar' class='tftextinput' name='q' size='21' maxlength='120' onclick = 'clearSearchBar()'></form><button class='tfbutton' id='searchBtn' onclick='searchFunc()'>Search</button><br><br><br>" + countrySelectionList + "<div class = 'tfclear'></div></div><br><br>" + inpCB1 + inpCB2 + inpCB3 + inpCB4 + inpCB5 + inpCB6 + continentBtn + "<br><br><br><p class = 'clFormHead'>Sort</p><br>" + inpA + inpB + inpC + sortBtn + "</div>";









//CUSTOM FUNCTIONS FOR SORT-------------------------------------
function sortAction() {
    var sortMode = "";
    $('input[name="sortType"]:checked').map(function () {
        sortMode = ($(this).val());
        var sortedCountryArray = getSortedArray(getCountriesOnHeatMap(), sortMode, yearValues);
        
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
        
        updateHeatMap(sortedCountryArray, sortedCountryArray, yearValues, clickedCells);
    });
    console.log("Menu.js: Sort Mode Selected : " + sortMode);

}
//--------------------------------------------------------------

//CUSTOM FUNCTIONS FOR FILTER CONTINENT-------------------------
function filterContinent() {
    var continentSelected = [];
    $('input[name="contName"]:checked').map(function () {
        continentSelected.push($(this).val());
    });
    console.log("Menu.js: Continent Selected : " + continentSelected);
    
    var filteredCountryArray = getCountriesByContinent(continentSelected);
    
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
    
    updateHeatMap(filteredCountryArray, filteredCountryArray, yearValues, clickedCells);
}
//--------------------------------------------------------------

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

    console.log("Country List size is : " + selectionList.length)

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

//var nxtBtn = '<img src ="./img/menu/nxtBtn.png" width = "40" height = "40" class ="clImgMenu" id = "nxtBtnId" onclick = "nextCall(true)" title="Next Story Point">';
//var prevBtn = '<img src ="./img/menu/prevBtn.png" width = "40" height = "40" class ="clImgMenu" id = "prevBtnId" onclick = "nextCall(false)" title="Previous Story Point">';


var nxtBtn = '<img src ="./img/menu/nxtBtn.png" width = "40" height = "40" class ="clImgMenu" id = "nxtBtnId" onclick = "slideMaker(1, shift)" title="Next Chapter">';
var prevBtn = '<img src ="./img/menu/prevBtn.png" width = "40" height = "40" class ="clImgMenu" id = "prevBtnId" onclick = "slideMaker(0, shift)" title="Previous Chapter">';








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
        var contentWidth = $('#contentPanel').width();
        var windowWidth = $(window).outerWidth();
        var aspect = 100 * (contentWidth / windowWidth);

        if (aspect < 70) {
            $("#vizPanel").empty();
            milestoneMaker();
        }
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

function milestoneMaker() {
    //$("#vizPanel").empty();
    var menuHeight = $("#extraPanel").outerHeight() - 10;
    $("#menuPanel").css("height", menuHeight);

    var exHeight = $("#extraPanel").outerHeight() - 100;
    $("#extraPanel").css("height", exHeight);
    $("#extraPanel").empty();
    $(document).ready(function () {
        //$("#vizPanel").empty();
        //$("#chordSvg").remove();
    });

    var vizHeight = $("#vizPanel").outerHeight() - 300;
    $("#vizPanel").css("height", vizHeight);
    var divStory = "<div class='clStoryPanel' id ='storyPanel'></div>";
    $("#infoPanel").append(divStory);

    var infoHeight = $("#infoPanel").outerHeight();
    menuHeight = $("#menuPanel").outerHeight();
    vizHeight = $("#vizPanel").outerHeight();
    var storyHeight = infoHeight - (menuHeight + vizHeight);

    $("#storyPanel").css("height", storyHeight);

    var div1 = "<div class='clStoryContent' id ='storyContentId'></div>";
    var div2 = "<div class='clStoryControl' id ='storyControlId'></div>";
    $("#storyPanel").append(div1);
    $("#storyPanel").append(div2);
    $("#storyControlId").empty();
    var extraImg = '<img src ="./img/story/iraqHead.jpg" width = "100%" height = "100%" class ="clstoryImgHead" id = "iragImg" title="Iraq War">';
    var extraText = "<p class = 'clstoryTextHead' id ='storyHead'>Iraq War Story </p>"
    $("#extraPanel").append(extraText);
    $("#extraPanel").append(extraImg);

    var headText = "<p class ='clSummaryText' id = 'headId'> What Happened</p>";

    var summaryText = "<p class ='clSummaryText' id = 'summaryId'>      On March 20, 2003, citing Saddam Hussein’s failure to adhere to United Nations Security Council Resolution 1441, a US-led coalition of 49 countries (including the United Kingdom, Australia, Poland, Italy, Spain, and Denmark) launched a 'shock and awe' invasion of Iraq. Within three weeks, the Iraqi government was overthrown and its military disbanded. While the primary reason given for the invasion was to remove the threat of Saddam Hussein and his weapons of mass destruction (WMDs), no such weapons were found. In the absence of WMDs, supporters of the war argued that regime change, spreading democracy in the region, and making the United States safer were the primary objectives. Opponents of the war, before and after the invasion, argued that the US oil interests and a pre-existing motivation to topple Saddam were the real reasons for the attack. <br><br>     After six years in Iraq, with the coalition reduced to five countries, the US had spent billions of dollars on the conflict and had lost over 4,000 American lives in the war. The US-Iraq ProCon.org website investigates both sides of the ongoing discussions and controversies surrounding the war in Iraq.</p>";
    //var summaryText = "<p class ='clSummaryText' id = 'summaryId'>      On March 20, 2003, citing Saddam Hussein’s failure to adhere to United Nations Security Council Resolution 1441, a US-led coalition of 49 countries launched a 'shock and awe' invasion of Iraq. Within three weeks, the Iraqi government was overthrown and its military disbanded. While the primary reason given for the invasion was to remove the threat of Saddam Hussein and his weapons of mass destruction (WMDs), no such weapons were found. In the absence of WMDs, supporters of the war argued that regime change, spreading democracy in the region, and making the United States safer were the primary objectives. Opponents of the war, before and after the invasion, argued that the US oil interests and a pre-existing motivation to topple Saddam were the real reasons for the attack. <br>     After six years in Iraq, with the coalition reduced to five countries, the US has spent billions of dollars on the conflict and has lost over 4,000 American lives in the war. The US-Iraq ProCon.org website investigates both sides of the ongoing discussions and controversies surrounding the war in Iraq.</p>";


    $("#storyContentId").append(headText);
    $("#storyContentId").append(summaryText);
    console.log("Menu.js: Making Milestone");
    var storyYearSummary = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
    updateHeatMap(storyCountries, storyCountries, storyYearSummary);
    if ($('#chordSvg').length != 0) {
        updateChordDiagram(rowCountries, storyYearSummary);
    } else {
        $("#vizPanel").empty();
        $("#lineSvg").remove();
        clearSelections();
        // opening chord diagram taken care of by menuFolded function
        //loadChordDiagram(rowCountries, storyYearSummary, ch_smWidth, ch_smHeight);
    }
}


var shift = 0;


function slideMaker(direct, tick) {

    var link1 = "http://www.sipri.org/databases/embargoes/un_arms_embargoes/iraq";
    var link2 = "https://en.wikipedia.org/wiki/Iraq_War#2003:_Beginnings_of_insurgency";
    var link3 = "https://en.wikipedia.org/wiki/Iraq_War#2004:_Insurgency_expands";
    var link4 = "https://en.wikipedia.org/wiki/Iraq_War#2005:_Elections_and_transitional_government";
    var link5 = "https://en.wikipedia.org/wiki/Iraq_War#2011:_U.S._withdrawal";
    
    if (direct == 1) {
        shift += 1;
    } else {
        shift -= 1;
    }

    if (shift > 5) {
        shift = 1;
    }
    if (shift < 1) {
        shift = 5;
    }
    tick = shift;

    if (tick == 1) {
        $("#storyContentId").empty();
        //$("#extraPanel").empty();
        var link = "./img/story/iraq1.jpg";
        $("#iragImg").attr("src", link);
        $("#storyHead").text("Chapter 1");

        var header = "Iraq War Story: UN Arms Embargo";
        //var summary = "In August 1990 Security Council resolution 661 established comprehensive sanctions against Iraq, including an open-ended arms embargo. This was passed in reaction to the continued occupation of Kuwait by Iraq, following the invasion days earlier.Resolution 661 decided that states should prohibit ‘the sale or supply by their nationals or from their territories or using their flag vessels of any commodities or products, including weapons or any other military equipment, whether or not originating in their territories’. <br>In April 1991, following the restoration of sovereignty to Kuwait in February, the UN passed Security Council Resolution 687, asserting that it wished to remain ‘assured of Iraq’s peaceful intentions', especially with regards to its WMD programme. The Resolution continued the existing arms embargo and demanded that Iraq end its activities related to chemical, biological and nuclear weapons and ballistic missiles with a range greater than 150km. <br>In May 2003, following the fall of the Iraqi government, the UN Security Council modified the sanctions regime in UN Security Council resolution 1483. The arms embargo on Iraq was maintained, with a provision permitting transers required by a newly established authority to maintain security in Iraq and along its borders."
        var summary = "In 1990, the United Nations Security Council imposed an arms embargo on Iraq due to the country's involvement in Kuwait. The embargo wasn't lifted until 2003 when the regime of Saddam Hussein fell.";

        var headText = "<p class ='clSummaryText' id = 'headId'>" + header + "</p>";
        var summaryText = "<p class ='clSummaryText' id = 'summaryId'>" + summary + "</p>";
        $("#storyContentId").append(headText);
        $("#storyContentId").append(summaryText);

        var linktext = "<p class ='clLinkText'>Read More</p>";
        $("#storyContentId").append(linktext);
        $(".clLinkText").replaceWith(function () {
            url = link1;
            return $("<a class ='clLinkText' target='_blank'></a>").attr("href", url).append($(this).contents());
        });


        var yrArray = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
        yearValues = yrArray; 
        updateHeatMap(rowCountries, colCountries, yrArray);
        if ($('#chordSvg').length != 0) {
            updateChordDiagram(rowCountries, yrArray);
        } else {
            $("#vizPanel").empty();
            loadChordDiagram(rowCountries, yrArray, ch_smWidth, ch_smHeight);
        }

        if (yrArray.length == 1) {
            var valText = "" + yrArray[0] + "";
        } else {
            var valText = "" + yrArray[0] + " - " + yrArray[yrArray.length - 1] + "";

        }
        $(".clMenuHead").text("");
        $(".clMenuHead").text(valText);

    }

    if (tick == 2) {
        $("#storyContentId").empty();
        //$("#extraPanel").empty();
        var link = "./img/story/iraq2.jpg";
        $("#iragImg").attr("src", link);
        $("#storyHead").text("Chapter 2");

        var header = "Iraq War Story: Beginnings of Insurgency";
        //var summary = "On 1 May 2003, President Bush visited the aircraft carrier USS Abraham Lincoln operating a few miles west of San Diego, California. At sunset Bush held his nationally televised 'Mission Accomplished' speech, delivered before the sailors and airmen on the flight deck: Bush declared victory due to the defeat of Iraq's conventional forces. Nevertheless, Saddam remained at large and significant pockets of resistance remained. After President Bush's speech, coalition forces noticed a gradually increasing flurry of attacks on its troops in various regions, especially in the Sunni Triangle. The initial Iraqi insurgents were supplied by hundreds of weapons caches created before the invasion by the Iraqi army and Republican Guard.<br>Initially, Iraqi resistance (described by the coalition as Anti-Iraqi Forces) largely stemmed from fedayeen and Saddam/Ba'ath Party loyalists, but soon religious radicals and Iraqis, angered by the occupation, contributed to the insurgency. The three provinces with the highest number of attacks were Baghdad, Al Anbar, and Salah Ad Din. Those three provinces account for 35% of the population, but as of 5 December 2006, were responsible for 73% of U.S. military deaths and an even higher percentage of recent U.S. military deaths (about 80%.)<br>Insurgents used guerrilla tactics including: mortars, missiles, suicide attacks, snipers, improvised explosive devices (IEDs), car bombs, small arms fire (usually with assault rifles), and RPGs (rocket propelled grenades), as well as sabotage against the petroleum, water, and electrical infrastructure. Post-invasion Iraq coalition efforts commenced after the fall of Saddam's regime. The coalition nations, together with the United Nations, began to work to establish a stable, compliant democratic state capable of defending itself from non-coalition forces, as well as overcoming internal divisions.<br>Meanwhile, coalition military forces launched several operations around the Tigris River peninsula and in the Sunni Triangle. A series of similar operations were launched throughout the summer in the Sunni Triangle. Toward the end of 2003, the intensity and pace of insurgent attacks began to increase. A sharp surge in guerrilla attacks ushered in an insurgent effort that was termed the Ramadan Offensive, as it coincided with the beginning of the Muslim holy month of Ramadan. To counter this offensive, coalition forces begin to use air power and artillery again for the first time since the end of the invasion by striking suspected ambush sites and mortar launching positions. Surveillance of major routes, patrols, and raids on suspected insurgents were stepped up. In addition, two villages, including Saddam's birthplace of al-Auja and the small town of Abu Hishma were surrounded by barbed wire and carefully monitored."
        var summary = "On March 20, 2003, the United States and its allies, including the United Kingdom, Australia, Italy, Poland, Spain, and Denmark, invaded Iraq with a 'shock and awe' bombing campaign. Several months later in December, Saddam Hussein was captured.";

        var headText = "<p class ='clSummaryText' id = 'headId'>" + header + "</p>";
        var summaryText = "<p class ='clSummaryText' id = 'summaryId'>" + summary + "</p>";
        $("#storyContentId").append(headText);
        $("#storyContentId").append(summaryText);

        var linktext = "<p class ='clLinkText'>Read More</p>"
        $("#storyContentId").append(linktext);
        $(".clLinkText").replaceWith(function () {
            url = link2;
            return $("<a class ='clLinkText' target='_blank'></a>").attr("href", url).append($(this).contents());
        });
        var yrArray = [2003];
        yearValues = yrArray; 
        updateHeatMap(storyCountries, storyCountries, yrArray);
        updateChordDiagram(storyCountries, yrArray);
        if (yrArray.length == 1) {
            var valText = "" + yrArray[0] + "";
        } else {
            var valText = "" + yrArray[0] + " - " + yrArray[yrArray.length - 1] + "";

        }
        $(".clMenuHead").text("");
        $(".clMenuHead").text(valText);
    }

    if (tick == 3) {
        $("#storyContentId").empty();
        //$("#extraPanel").empty();
        var link = "./img/story/iraq3.jpg";
        $("#iragImg").attr("src", link);
        $("#storyHead").text("Chapter 3");

        var header = "Iraq War Story: Insurgency Expands";
        //var summary = "The start of 2004 was marked by a relative lull in violence. Insurgent forces reorganised during this time, studying the multinational forces' tactics and planning a renewed offensive. However, violence did increase during the Iraq Spring Fighting of 2004 with foreign fighters from around the Middle East as well as al-Qaeda in Iraq (an affiliated al-Qaeda group), led by Abu Musab al-Zarqawi helping to drive the insurgency.U.S. troops fire mortars As the insurgency grew there was a distinct change in targeting from the coalition forces towards the new Iraqi Security Forces, as hundreds of Iraqi civilians and police were killed over the next few months in a series of massive bombings. An organized Sunni insurgency, with deep roots and both nationalist and Islamist motivations, was becoming more powerful throughout Iraq. The Shia Mahdi Army also began launching attacks on coalition targets in an attempt to seize control from Iraqi security forces. The southern and central portions of Iraq were beginning to erupt in urban guerrilla combat as multinational forces attempted to keep control and prepared for a counteroffensive. A USMC M198 artillery piece firing outside Fallujah in October 2004.The most serious fighting of the war so far began on 31 March 2004, when Iraqi insurgents in Fallujah ambushed a Blackwater USA convoy led by four U.S. private military contractors who were providing security for food caterers Eurest Support Services. The four armed contractors, Scott Helvenston, Jerko Zovko, Wesley Batalona, and Michael Teague, were killed with grenades and small arms fire. Subsequently, their bodies were dragged from their vehicles by local people, beaten, set ablaze, and their burned corpses hung over a bridge crossing the Euphrates. Photos of the event were released to news agencies worldwide, causing a great deal of indignation and moral outrage in the United States, and prompting an unsuccessful pacification of the city: the First Battle of Fallujah in April 2004."
        var summary = "The insurgency in Iraq expanded through 2004 with increasing violence throughout the country. In April 2004, reports of prisoner abuse at Abu Ghraib surfaced. In November 2004, the Second Battle of Fallujah occurred. It became known as the bloodiest battle of the war.";

        var headText = "<p class ='clSummaryText' id = 'headId'>" + header + "</p>";
        var summaryText = "<p class ='clSummaryText' id = 'summaryId'>" + summary + "</p>";
        $("#storyContentId").append(headText);
        $("#storyContentId").append(summaryText);

        var linktext = "<p class ='clLinkText'>Read More</p>"
        $("#storyContentId").append(linktext);
        $(".clLinkText").replaceWith(function () {
            url = link3;
            return $("<a class ='clLinkText' target='_blank'></a>").attr("href", url).append($(this).contents());
        });
        var yrArray = [2003, 2004];
        yearValues = yrArray; 
        updateHeatMap(storyCountries, storyCountries, yrArray);
        updateChordDiagram(storyCountries, yrArray);
        if (yrArray.length == 1) {
            var valText = "" + yrArray[0] + "";
        } else {
            var valText = "" + yrArray[0] + " - " + yrArray[yrArray.length - 1] + "";

        }
        $(".clMenuHead").text("");
        $(".clMenuHead").text(valText);
    }

    if (tick == 4) {
        $("#storyContentId").empty();
        //$("#extraPanel").empty();
        var link = "./img/story/iraq4.jpg";
        $("#iragImg").attr("src", link);
        $("#storyHead").text("Chapter 4");

        var header = "Iraq War Story: Elections and Transitional Government";
        //var summary = "On 31 January, Iraqis elected the Iraqi Transitional Government in order to draft a permanent constitution. Although some violence and a widespread Sunni boycott marred the event, most of the eligible Kurd and Shia populace participated. On 4 February, Paul Wolfowitz announced that 15,000 U.S. troops whose tours of duty had been extended in order to provide election security would be pulled out of Iraq by the next month. February to April proved to be relatively peaceful months compared to the carnage of November and January, with insurgent attacks averaging 30 a day from the prior average of 70. The Battle of Abu Ghraib on 2 April 2005 was an attack on United States forces at Abu Ghraib prison, which consisted of heavy mortar and rocket fire, under which armed insurgents attacked with grenades, small arms, and two vehicle-borne improvised explosive devices (VBIED). <br> The U.S. force's munitions ran so low that orders to fix bayonets were given in preparation for hand-to-hand fighting. An estimated 80–120 armed insurgents launched a massive coordinated assault on the U.S. military facility and internment camp at Abu Ghraib, Iraq. It was considered to be the largest coordinated assault on a U.S. base since the Vietnam War. Hopes for a quick end to the insurgency and a withdrawal of U.S. troops were dashed in May, Iraq's bloodiest month since the invasion. Suicide bombers, believed to be mainly disheartened Iraqi Sunni Arabs, Syrians and Saudis, tore through Iraq. Their targets were often Shia gatherings or civilian concentrations of Shias. As a result, over 700 Iraqi civilians died in that month, as well as 79 U.S. soldiers."
        var summary = "In 2005, Iraq established a transitional government. In 2006, Nouri al-Maliki became the Prime Minister. Despite the formation of Iraq's permanent government, the year was filled with civil war. Its embargo recently lifted, Iraq became one of the biggest importers of arms from the United States. Importing billions of dollars in small arms from 2005 - 2008 along with increased reports of illicit arms trade, the violence in Iraq continued until the United States sent a wave of troops in 2007 in attempts to reduce the violence.";

        var headText = "<p class ='clSummaryText' id = 'headId'>" + header + "</p>";
        var summaryText = "<p class ='clSummaryText' id = 'summaryId'>" + summary + "</p>";
        $("#storyContentId").append(headText);
        $("#storyContentId").append(summaryText);

        var linktext = "<p class ='clLinkText'>Read More</p>"
        $("#storyContentId").append(linktext);
        $(".clLinkText").replaceWith(function () {
            url = link4;
            return $("<a class ='clLinkText' target='_blank'></a>").attr("href", url).append($(this).contents());
        });
        var yrArray = [2005, 2006, 2007, 2008];
        yearValues = yrArray; 
        updateHeatMap(storyCountries, storyCountries, yrArray);
        lc_clearPanel();
        loadLineChart("United States", "Iraq", lc_smWidth, lc_smHeight);
        if (yrArray.length == 1) {
            var valText = "" + yrArray[0] + "";
        } else {
            var valText = "" + yrArray[0] + " - " + yrArray[yrArray.length - 1] + "";

        }
        $(".clMenuHead").text("");
        $(".clMenuHead").text(valText);
    }

    if (tick == 5) {
        $("#storyContentId").empty();
        //$("#extraPanel").empty();
        var link = "./img/story/iraq5.jpg";
        $("#iragImg").attr("src", link);
        $("#storyHead").text("Chapter 5");

        var header = "Iraq War Story: US Troops Withdraw";
        //var summary = "Muqtada al-Sadr returned to Iraq in the holy city of Najaf to lead the Sadrist movement after being in exile since 2007.On 15 January 2011, three U.S. troops were killed in Iraq. One of the troops was killed on a military operation in central Iraq, while the other two troops were deliberately shot by one or two Iraqi soldiers during a training exercise.On 6 June, five U.S. troops were killed in an apparent rocket attack on JSS Loyalty. A sixth soldier, who was wounded in the attack, died 10 days later of his wounds.<br> On 29 June, three U.S. troops were killed in a rocket attack on a U.S. base located near the border with Iran. It was speculated that the militant group responsible for the attack was the same one which attacked JSS Loyalty just over three weeks before. With the three deaths, June 2011, became the bloodiest month in Iraq for the U.S. military since June 2009, with 15 U.S. soldiers killed, only one of them outside combat.In September, Iraq signed a contract to buy 18 Lockheed Martin F-16 warplanes, becoming the 26th nation to operate the F-16. Because of windfall profits from oil, the Iraqi government is planning to double this originally planned 18, to 36 F-16s. Iraq is relying on the U.S. military for air support as it rebuilds its forces and battles a stubborn Islamist insurgency. With the collapse of the discussions about extending the stay of any U.S. troops beyond 2011, where they would not be granted any immunity from the Iraqi government, on 21 October 2011, President Obama announced at a White House press conference that all remaining U.S. troops and trainers would leave Iraq by the end of the year as previously scheduled, bringing the U.S. mission in Iraq to an end.[302] The last American soldier to die in Iraq before the withdrawal was killed by a roadside bomb in Baghdad on 14 November. In November 2011, the U.S. Senate voted down a resolution to formally end the war by bringing its authorization by Congress to an end.<br>U.S. and Kuwaiti troops closing the gate between Kuwait and Iraq on 18 December 2011. The last U.S. troops withdrew from Iraq on 18 December, although the U.S. embassy and consulates continue to maintain a staff of more than 20,000 including U.S. Marine Embassy Guards and between 4,000 and 5,000 private military contractors. The next day, Iraqi officials issued an arrest warrant for the Sunni Vice-President Tariq al-Hashimi. He has been accused of involvement in assassinations and fled to the Kurdish part of Iraq."
        var summary = "After the violence in Iraq was significantly reduced, the United States began withdrawing troops in 2007. President Obama officially withdrew all forces in December 2011. Arms trade, both legal and the unrecorded illicit trade, fueled the violence throughout the war. Death tolls are unclear. Some sources estimate approximately 500,000 Iraqi deaths. From 2003 - 2014, there were 4,491 United States service members killed.";

        var headText = "<p class ='clSummaryText' id = 'headId'>" + header + "</p>";
        var summaryText = "<p class ='clSummaryText' id = 'summaryId'>" + summary + "</p>";
        $("#storyContentId").append(headText);
        $("#storyContentId").append(summaryText);

        var linktext = "<p class ='clLinkText'>Read More</p>"
        $("#storyContentId").append(linktext);
        $(".clLinkText").replaceWith(function () {
            url = link5;
            return $("<a class ='clLinkText' target='_blank'></a>").attr("href", url).append($(this).contents());
        });
        var yrArray = [2003, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
        yearValues = yrArray; 
        updateHeatMap(rowCountries, colCountries, yrArray);
        ch_clearPanel();
        loadChordDiagram(rowCountries, yrArray, ch_smWidth, ch_smHeight);
        if (yrArray.length == 1) {
            var valText = "" + yrArray[0] + "";
        } else {
            var valText = "" + yrArray[0] + " - " + yrArray[yrArray.length - 1] + "";

        }
        $(".clMenuHead").text("");
        $(".clMenuHead").text(valText);
    }
}

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
	clearSelections(); 
    if (story % 2 != 0) {
        $("#imgSearch").css("opacity", "0.2");
        $("#imgClear").css("opacity", "0.2");
        $(".clMenuBack").append(nxtBtn);
        $(".clMenuBack").append(prevBtn);
        $("#sliderDouble").addClass("disabledbutton");
        $("#sliderDouble").css("opacity", "0.25");
        $("#sliderPanel").append(storyTitle);
        menuFolded();

    } else {
        $("#imgSearch").css("opacity", "1");
        $("#imgClear").css("opacity", "1");
        $("#nxtBtnId").remove();
        $("#prevBtnId").remove();
        $(".disabledbutton").css("opacity", "1");
        $(".disabledbutton").removeClass("disabledbutton");
        $("#storyTitle").remove();
        //menuFolded();
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

        if ($("#extraPanel").is(":visible") == true) {
            hm_width = $("#chart").width() - hm_margin.right - hm_margin.left - $("#menuHidden").width();
        } else {
            hm_width = initWidth;
        }
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
    hm_width = $("#chart").width() - hm_margin.right - hm_margin.left;
    updateHeatMapWidth();
    $('.clGoBtn').remove();

}

var vizOpen = 0;

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

    //    console.log("Menu.js: Clicked countries: " + clickedCountries);

    $('.clMenuHidden').hide();
    $('#clsBtn').remove();
    $('.clMenuBack').append(clsBtn);
    $('#clsBtn').show();

    var extraBox = '<div class = "clExtraBox" id ="extraBox"></div>';
    extraBox += '<p id = "extraTitle">Germany</p>';
    extraBox += '<img src ="./img/menu/fillerImg.jpg" width = "450" height = "200" class ="clFillImg" id = "fillImg">';

    $("#extraPanel").empty();
    //$("#extraPanel").append(extraBox);
    var extraImg = '<img src ="./img/filler/arms4.jpg" width = "100%" height = "100%" class ="clstoryImgHead" id = "iragImg" title="Iraq War">';
    var extraText = "<p class = 'clstoryTextHead' id ='genHead'>Arms & Ammunition <br>Visualization</p>"
    $("#extraPanel").append(extraText);
    $("#extraPanel").append(extraImg);
    var val = parseInt(100 * $('#contentPanel').outerWidth() / $(window).outerWidth());

    $("#extraPanel").show();
    $('#contentPanel').width('65%');
    $('#infoPanel').width('35%');
    $('#menuPanel').height('35%');
    $('#vizPanel').height('65%');

    //make the menu back lesser height
    $('#menuBack').height('100px');
    $('#extraPanel').height('360px');

    $('#tgStoryMode').hide(); //MADE IT HIDDEN

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
        console.log("Menu.js: Showing Line Chart");
        if ($('#lineSvg').length != 0) {
            updateLineChart(clickedCountries[0], clickedCountries[1]);
        } else {
            if (togStory % 2 != 0) {
                loadLineChart(clickedCountries[0], clickedCountries[1], lc_smWidth, lc_smHeight);
            } else {
                loadLineChart(clickedCountries[0], clickedCountries[1], lc_bigWidth, lc_bigHeight)
            }
        }
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
        if (clickedCountries == undefined || clickedCountries.length == 0) {
            if (togStory % 2 != 0) {
                clickedCountries = storyCountries;
            } else {
                clickedCountries = getCountriesOnHeatMap();
            }
        }
        if ($('#chordSvg').length != 0) {
            updateChordDiagram(clickedCountries, yearValues);
        } else {
            if (togStory % 2 != 0) {
                loadChordDiagram(clickedCountries, yearValues, window.ch_smWidth, window.ch_smHeight);
            } else {
                loadChordDiagram(clickedCountries, yearValues, ch_bigWidth, ch_bigHeight);
            }
        }
    }
}





function clearSearchBar() {
    if ($("#searchBar").val() == "Search Countries") {
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

    var hm_upperMasterLabel = [];
    for (var i = 0; i < hm_masterLabel.length; i++) {
        hm_upperMasterLabel[i] = hm_masterLabel[i].toUpperCase();
    }

    var newArray = [];
    var invalidArray = [];
    for (var i = 0; i < array.length; i++) {
        var indexVal = hm_upperMasterLabel.indexOf(array[i].trim().toUpperCase());
        if (indexVal > -1) {
            newArray.push(hm_masterLabel[indexVal]);
        } else {
            invalidArray.push(array[i].trim());
        }
    }

    console.log("Menu.js: " + newArray);
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
    if (newArray != undefined && newArray.length > 1) {
        updateHeatMap(newArray, newArray, yearValues, clickedCells);
    } else if (invalidArray != undefined && invalidArray.length > 0) {
        var invalidArrayString = "";
        for (var i = 0; i < invalidArray.length; i++) {
            invalidArrayString += invalidArray[i];
            if (i < (invalidArray.length - 1)) {
                invalidArrayString += ", ";
            }
        }
        alert("Invalid country names: \n" + invalidArrayString);
    } else {
        alert("A minimum of two countries is required to display the data.");
    }

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