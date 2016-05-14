$(document).ready(function(){
	$.ajax({
		url:		'myFile.txt',
		datatype:	'text',
		success: 	function(data){
			$('body').html(data);
		},
	});
});