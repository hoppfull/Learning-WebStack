<?php
class MySuperClass {
	protected $variable;
	function __construct(){ //This is the constructor!
		$this->variable = 5;
	}
	
	/*
	public $x = 5; # Public data can be accessed by all code
	protected  $y = 3; # Protected data can only be accessed by this class or any subclass
	private  $z = 1; # Private data can only be accessed by this class
	
	public static $w = 0; # Static data is shared by all objects of this class
	
	const PI = 3.14; # Constant data cannot be changed
	*/
	
	function run(){
		echo $this->variable;
	}
	
	final function func(){ //A final function cannot be overridden in subclass
		echo "tjena";
	}
}

class MySubClass extends MySuperClass {
	//Overriding function in superclass:
	function run(){
		echo $this->variable * 2;
	}
}

$myObject1 = new MySuperClass();
$myObject2 = new MySubClass();

?>