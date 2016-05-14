//This JQuery mechanism runs when the entire document is loaded:
$(document).ready(function(){
	//All manner of cool effects can be animated very easily with JQuery:
	$('#myDiv').fadeToggle(0).fadeToggle(300).fadeToggle(1000);
	$('#myBody').css({ //We can change/override the CSS properties:
		color:	 			'blue',
		fontWeight: 		'bold',
		backgroundColor: 	'grey',
	});
});