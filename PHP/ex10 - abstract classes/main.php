<?php
abstract class MyAbstractClass {
	/*
	An abstract class cannot be instantiated! All abstract functions must be
	defined by sublcass that extends it.
	An abstract class can however define functions inside it!
	*/
	
	abstract protected function functionOne();
	abstract protected function functionTwo();
	
	public function run(){
		$this->functionOne();
		$this->functionTwo();
		echo "<br />Alright!";
	}
}

class MyClass extends MyAbstractClass {
	protected function functionOne(){
		echo "Hello";
	}
	
	protected function functionTwo(){
		echo " Abstract Classes";
	}
}

$myObject = new MyClass();
?>