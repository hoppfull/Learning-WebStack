$(document).ready(function(){
	// Execute passed function on click:
	$('#button_1').on('click', myFunc1);
	$('#button_2').on('mouseover', myFunc2);
	$('#button_3').on('mouseout', myFunc3);
});

function myFunc1(){
	$('#myDiv1').fadeToggle(200);
}

function myFunc2(){
	$('#myDiv2').fadeToggle(200);
}

function myFunc3(){
	$('#myDiv3').fadeToggle(200);
}

/*
	This is ugly code. Check next example for cleaner code!
*/