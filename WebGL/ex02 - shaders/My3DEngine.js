function My3DEngine(){ //Define My3DEngine-class:
	//Without 'this', function and variables are private!
	this.getContext = function(canvas){
		/*
			This is the first point of a WebGL application. This has analogies in other
			types of OpenGL applications. A context is basically a way of keeping track
			of where graphics are rendered onto. It would seem that WebGL can only
			render onto the 'canvas' DOM element on a webpage.
		*/
		try{ //Assign a context to a variable 'gl':
			gl = canvas.getContext('experimental-webgl');
			gl.viewportWidth = canvas.width; //Save canvas width in pixels
			gl.viewportHeight = canvas.height; //Save canvas height in pixels
		}catch(e){ //Alert any error:
			alert(e.toString());
		}
		
		if(!gl){ //Alert if initialization was not successfull:
			alert("Could not initialize WebGL!");
			return null;
		}
		
		return gl; //Return context
	};
	
	this.getShader = function(gl, src){
		/*
			This compiles a shader program from source. The source are two strings
			for each shader, ie. the vertex shader and the fragment shader. There are
			no mechanisms for loading a separate file. The source doesn't need to be
			formated in any certain way (eg. without whitespaces, newlines, tabs...).
		*/
		function compileShader(type, source){
			/*
				This compiles a single shader component (eg. a vertex shader) and
				returns it to be used in creating the shader program.
			*/
			// Create an empty shader of given type:
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source); //Assign source to empty shader
			gl.compileShader(shader); //Compile shader source
			
			// Check if compile was successfull:
			if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
				// Alert errors if compile was unsuccessfull and return null:
				alert(gl.getShaderInfoLog(shader));
				return null;
			}
			
			return shader; //Return shader
		}
		//Create an empty shader program:
		shaderProgram = gl.createProgram();
		
		//Assign compiled vertex shader to empty program:
		gl.attachShader(shaderProgram, compileShader(gl.VERTEX_SHADER, src.vertex_source));
		 //Assign compiled fragment shader to empty program:
		gl.attachShader(shaderProgram, compileShader(gl.FRAGMENT_SHADER, src.fragment_source));
		gl.linkProgram(shaderProgram); /** I think this sends the compiled shader program to the GPU **/
		// Check if shader program linked(?) successfully:
		if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
			// Alert if link was unsuccessfull and return null:
			alert("Could not initialize shaders!");
			return null;
		}
		
		return shaderProgram; //Return shader program
	};
}