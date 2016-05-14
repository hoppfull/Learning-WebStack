function My3DEngine(){ //Define My3DEngine-class:
	//Without 'this', these function and variables are private:
	this.getContext = function(canvas){
		/*
			This is the first point of a WebGL application. This has analogies in other
			types of OpenGL applications. A context is basically a way of keeping track
			of where graphics are rendered onto. It would seem that WebGL can only
			render onto the 'canvas' DOM element on a webpage.
		*/
		var gl;
		try{ //Assign a context to variable gl:
			gl = canvas.getContext('experimental-webgl');
			gl.viewportWidth = canvas.width; //Save canvas width in pixels
			gl.viewportHeight = canvas.height; //Save canvas height in pixels
		}catch(e){ //Alert any error:
			alert(e.toString());
		}
		//Alert if initialization was not successfull:
		if(!gl) alert("Could not initialize WebGL!");
		
		return gl;
	};
}