$(document).ready(function() {

var chapterNumber = 1;
var verseNumber = 1;

getScripture(chapterNumber, verseNumber);

$("#nextChapter").click(function(){
	chapterNumber++;
	verseNumber = 1;
	getScripture(chapterNumber,verseNumber);
})

$("#previousChapter").click(function(){
	chapterNumber--;
	verseNumber = 1;
	getScripture(chapterNumber,verseNumber);
})

$("#nextVerse").click(function(){
	verseNumber++;
	getScripture(chapterNumber,verseNumber);
})

$("#previousVerse").click(function(){
	verseNumber--;
	getScripture(chapterNumber,verseNumber);
})

function getScripture(chapter, verse){
	$.ajax({
	url: 'Ephesians.json',
	dataType: 'json',
	type: 'get',
	cache: false,
	success: function(data){
		$("#scripture").text(data["Ephesians"][chapterNumber][verseNumber]);
		$("#chapter").text("Chapter " + chapterNumber + ", Verse " + verseNumber);
	}
})
}

});