$(document).ready(function() {

Opentip.styles.word = {
	delay:0,
	showOn: 'click',
	tipJoint: 'bottom',
	fixed: true,
	hideTrigger: "closeButton"
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
$(document).mouseup(function(ev) {
	var selObj = window.getSelection();
	var selection = selObj.toString();
	// return if no selection made
	if (selection == "") return;
	document.execCommand('copy');
	console.log(selection);
	// regex to test for multiple words
	var reg = /.+ .+/g;
	// multi word selection
	if (reg.test(selection) == true) {

	}
	else { // single word selection
		var word = selection.replace(/ /g, "");
		var strong = $(ev.target).attr('strong');
		var lex = lexicon[strong];
		console.log("Strong : " + strong);
		if (lex == undefined) {
			console.log("Lexicon entry not found");
			$(ev.target).opentip('definition unavailable', {style: "word"});
			return;
		}
		var shortDef = lex.brief;
		var morph = lex.morphology;
		$(ev.target).opentip("<b>" + word + "</b>" + " - "
			+ shortDef
			+ "<br></br><i>(" + morph + ")</i>" , {
			style: "word"});
	}
});


$("#previousChapter").click(function(){
	if(chapterNumber >= 2){
	chapterNumber--;
	displayScripture(book, chapterNumber);
	}
})


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
		var reg = /[^A-Za-z0-9 -]+ G[0-9]{2,6}/g;
		var result = [];
		$.each(data.Ephesians, function(chap, verses) {
	      $.each(verses, function(verse, text) {
	      	text = text.replace(/{.*}|[\[\]]/g, "");
	      	var newVerse = "<span verse='" + verse + "'>";
	      	while(result = reg.exec(text)){
	      		var a = result[0].split(" ");
	      		newVerse += "<span strong ='" + a[1].substring(1) + "'>" + a[0] + "</span> ";
	      	}
	      	newVerse += "</span>"
	        data.Ephesians[chap][verse] = newVerse;
	      });
	    });
		book = data;
		displayScripture(data, chapterNumber);
		$('#scripture span span').each(function(index, span){

			$(span).opentip(' ', {delay:0, showOn: 'click', tipJoint: 'bottom', fixed: true, hideTrigger: "closeButton"});
		});
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
