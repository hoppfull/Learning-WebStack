$(document).ready(function(){
	//We target buttons by class and call myEvent on 'click' event:
	$('.myButtons').on('click', myMouseClick);
	$('.myButtons').on('mouseover', myMouseOver);
	$('.myButtons').on('mouseout', myMouseOut);
});

function myMouseClick(){
	//Retrieve value of attribute 'data-myTargetId':
	var targetId = '#' + $(this).attr('data-myTargetId'); //'this' refers to the function calling this function
	//Do stuff:
	$(targetId).fadeToggle(200);
	$(targetId).html('Goodbye!!');
}

function myMouseOver(){
	//Retrieve value if id:
	var targetId = '#' + $(this).attr('id');
	//Change css property 'color' to red:
	$(targetId).css('color', 'red');
}

function myMouseOut(){
	//Retrieve value if id:
	var targetId = '#' + $(this).attr('id');
	//Change css property 'color' to black:
	$(targetId).css('color', 'black');
}