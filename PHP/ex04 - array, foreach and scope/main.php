<?php
	$arr = array("Katt", "Hund", "Apa", "Häst"); # This doesn't seem to have global scope
	
	function myFunc(){
		# In order for $arr's scope to reach in here, this line is needed:
		global $arr;
		foreach($arr as $value){
			echo $value;
		}
	}
?>