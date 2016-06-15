$(document).ready(function() {

//Assuming we want to start at Chapter 1 this global is important
var chapterNumber = 1;
//Global variable book is assigned by getScripture
var book;
var lexicon = {};

getScripture('Ephesians.json');

//These add functionality to our previous and next chapter buttons
//TODO: Take out the hardcoding on the 6 here so this funciton wou
//ld work for any book we have the properly formatted JSON for
$("#nextChapter").click(function(){
	if(chapterNumber < 6){
	chapterNumber++;
	displayScripture(book, chapterNumber);
	}
})

$(document).mouseup(function() {
	var selObj = window.getSelection();
	console.log(selObj);
});

$("#previousChapter").click(function(){
	if(chapterNumber >= 2){
	chapterNumber--;
	displayScripture(book, chapterNumber);
	}
})

//Makes the ajax call to the URL it is passed and displays the original scripture
//Important that this displays something so that ajax is done by the time the user
//clicks on the next chapter
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
	console.log(book);
	displayScripture(data, chapterNumber);
	},
	error: function(err) {
		alert("Could not get Epheisans JSON data");
	}
});
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
