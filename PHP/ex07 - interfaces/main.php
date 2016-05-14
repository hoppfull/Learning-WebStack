<?php

interface MyInterface {
	public function myFunction();
}

class MyClass implements MyInterface{
	function myFunction(){ //This function has to be defined since it's in the interface
		echo "Hejsan!";
	}
}

function run(MyInterface $object){
	// This function takes an object that implements MyInterface as an argument
	$object->myFunction();
	$object->myFunction();
	$object->myFunction();
}

$myObject = new MyClass();
?>