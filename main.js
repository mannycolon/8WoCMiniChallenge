$(document).ready(function() {

//Defining styles for our Opentips
Opentip.styles.word = {
	delay:0,
	showOn: 'click',
	tipJoint: 'bottom',
	fixed: true,
	hideTrigger: "closeButton",
	closeButtonRadius: 10,
	offset: [0, -10]
};

//INITIALIZATION
var chapterNumber = 1;
var book;
var lexicon = {};

getScripture('Ephesians.json');

//HANDLE CLICK EVENTS
$("#nextChapter").click(function(){
	if(chapterNumber < 6){
	chapterNumber++;
	displayScripture(book, chapterNumber);
	}
});

// Checks for new selection whenever the mouse is released
$("#scripture").mouseup(function(ev) {
	var selObj = window.getSelection();
	var selection = selObj.toString();
	// return if no selection made
	if (selection == "") return;
	document.execCommand('copy');
	// regex to test for multiple words
	var reg = /.+ .+/g;
	// multi word selection
	if (reg.test(selection) == true) {
		//we have yet to handle this!
	}
	else { // single word selection
		if ($(ev.target).data('opentips') != undefined) return;
		var word = selection.replace(/ /g, "");
		var strong = $(ev.target).attr('strong');
		var lex = lexicon[strong];
		//If the definition is not in our lexicon
		if (lex == undefined) {
			$(ev.target).opentip('definition unavailable', {style: "word"});
			return;
		}
		//If the definition is in our lexicon
		var shortDef = lex.brief;
		var morph = lex.morphology;
		//Formatting the text in our tooltip to be displayed
		$(ev.target).opentip("<b>" + word + "</b>" + " - "
			+ shortDef
			+ "<br></br><i>(" + morph + ")</i>" , {
			style: "word"});
	}
});

//Goes back a chapter when clicked
$("#previousChapter").click(function(){
	if(chapterNumber >= 2){
	chapterNumber--;
	displayScripture(book, chapterNumber);
	}
})

//Goes foward a chapter when clicked
$("#goToChapter").click(function(){
	var desiredChapter = parseInt($("#chapterBox").val());
	if(desiredChapter <= 6 && desiredChapter >= 1){
		chapterNumber = desiredChapter
		displayScripture(book, chapterNumber);
	}
	console.log(chapterNumber);
})

//AJAX CALLS FOR BOOK AND LEXICON
//First call gets and parses our JSON as well as adds metadata
function getScripture(url){
	$.ajax({
	url: url,
	dataType: 'json',
	type: 'get',
	cache: false,
	success: function(data){

		//This regex finds our strong numbers
		var reg = /[^A-Za-z0-9 -]+ G[0-9]{2,6}/g;
		var result = [];

		//Iteration goes through chapters then verses
		$.each(data.Ephesians, function(chap, verses) {
	      $.each(verses, function(verse, text) {

	      	//We remove all the text in {} and remove the []
	      	text = text.replace(/{.*}|[\[\]]/g, "");

	      	//Placing the verse number in our span so that we can add it to the users clip board later
	      	var newVerse = "<span verse='" + verse + "'>";

	      	//Adds the strong number to a strong container on the span and adds places the word in the wrapper
	      	while(result = reg.exec(text)){
	      		var a = result[0].split(" ");
	      		newVerse += "<span strong ='" + a[1].substring(1) + "'>" + a[0] + "</span> ";
	      	}

	      	//Closing our span tag for the verse
	      	newVerse += "</span>"
	        data.Ephesians[chap][verse] = newVerse;
	      });
	    });
		book = data;

		//Update the view with data we got from our AJAX call
		displayScripture(data, chapterNumber);
	},
	error: function(err) {
		alert("Could not get Epheisans JSON data");
	}
});


//This call gets and structures the lexicon
$.ajax({
	url: 'lexicon-eph-english.json',
	dataType: 'json',
	type: 'get',
	cache: false,

	//Here we read in our lexicon and place it into a new structure
	//TODO: EVAN could you maybe explain this better?
	success: function(data) {
		for (var i = 0; i < data.length; i++) {
			lexicon[data[i].strongs] = data[i];
		}
		console.log(lexicon);
	},
	error: function(err) {
		alert("Could not get lexicon!");
	}
});
}

//Displays scripture to the screen given data and a chapter
function displayScripture(data, chapter){
	var chapterString = "";
	for(verse in data["Ephesians"][chapter]){
		chapterString += data["Ephesians"][chapter][verse];
	}
	$("#chapter").html("Chapter " + chapterNumber);
	$("#scripture").html(chapterString);
}

});
