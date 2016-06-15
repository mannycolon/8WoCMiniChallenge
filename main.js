$(document).ready(function() {

//Assuming we want to start at Chapter 1 this global is important
var chapterNumber = 1;
//Global variable book is assigned by getScripture
var book;

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
		$.each(data.Ephesians, function(chap, verses) {
      $.each(verses, function(verse, text) {
        var newVerse = "<span verse='" + verse + "'>" + text.replace(/ [A-Z0-9-]{2,}| G[0-9]{1,5}|[\[\]]|{.*}/g, "") + '</span>';
        data.Ephesians[chap][verse] = newVerse;
      });
    });
		book = data;
		displayScripture(data, chapterNumber);
	}
})
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

//TODO: Add a parser function to strip and meta each word in our chapter

});
