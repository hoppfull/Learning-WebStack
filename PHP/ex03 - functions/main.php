<?php
	function myFunc(){
		echo "whaddup!";
	}
	
	function myWhatevs($num){ # A simple for loop:
		for($i = 0; $i < $num; $i++){
			myFunc();
			echo "<br />";
		}
	}
?>