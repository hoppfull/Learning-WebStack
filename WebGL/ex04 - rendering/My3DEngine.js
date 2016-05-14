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
	
	this.getRenderer = function(gl){
		/*
			This function sets som initial render properties then returns an object
			containing functions for clearing canvas and drawing models with shaders.
			I've purposely set a single background color becouse in a proper scene,
			background is not set with clearColor. However this could be changed if
			need be.
		*/
		// Set render output offset (offset start in lower left corner) and size:
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		//Lower alpha value and webpage background will blend additively with render background:
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
		// enable render to test if an object lies behind or not of other objects:
		gl.enable(gl.DEPTH_TEST);
		
		/*
			These next three functions need a little bit of explaining. This tells OpenGL
			to not bother with triangles facing away from the viewer. The reason this is
			useful is becouse a properly modeled mesh will obscure any triangle facing
			away from the viewer. But the renderer will render them anyway
			and later cover them up. But this is inefficient so we tell the render not to
			render them at all.
		*/
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW); // Front face is determined by right hand rule (counter clock-wise)
		gl.cullFace(gl.BACK); // The back of triangles will be culled
		
		return {
			clear : function(){ // Clear canvas:
				/*
					This function is expected to be called every frame before rendering new content
					onto canvas. It basically clears everything and prepares it for another drawing.
				*/
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			},
			
			draw : function(model, shader){
				/*
					This function is expected to be called every frame after a frame has been cleared
					and is ready to be redrawn. This function takes a buffer pointer, associate it's
					adress with an attribute on a shader and renders. This can be improved with
					try-catch statements and with capability of dealing with more attributes for a single
					model.
				*/
				gl.useProgram(shader); //Select a shader to use
				gl.bindBuffer(gl.ARRAY_BUFFER, model); //Select a buffer
				
				gl.enableVertexAttribArray(shader.attributes.vertex_pos); //'Open' attribute on shader
				
				gl.vertexAttribPointer( //Associate selected buffer with attribute on shader
					shader.attributes.vertex_pos, //Attribute on shader to associate buffer with
					model.itemSize, //How many pieces of data goes into one element
					gl.FLOAT, //Data type of values in buffer
					false, //Normalize values (ie. set them to values between 0 and 1)
					0, //Bits per row. I think if this is set to zero, OpenGL automatically choose for you
					0 //Where in each row does this attribute start?
				);
				gl.drawArrays(gl.TRIANGLES, 0, model.numItems); //Temporary function until replaced with drawElements
				
				gl.disableVertexAttribArray(shader.attributes.vertex_pos); //'Close' attribute on shader
					
				gl.bindBuffer(gl.ARRAY_BUFFER, null); //Deselect all buffers
				gl.useProgram(null); //Deselect all shaders
			}
		};
	};
	
	this.loadModel = function(gl, mesh){
		/*
			This function sends data to the GPU. Right now all it can send is vectors
			of size 3. Lack support for an index buffer as well. 
		*/
		// Get a pointer to a buffer on GPU:
		buffer_p = gl.createBuffer();
		
		gl.bindBuffer( // Select buffer a buffer
			gl.ARRAY_BUFFER, // Buffer type
			buffer_p // Location of buffer
		);
		
		gl.bufferData( // Send information to selected buffer
			gl.ARRAY_BUFFER, // Buffer type
			new Float32Array(mesh), // Data to be sent
			gl.STATIC_DRAW /** Not exactly sure about this one. I think it has to do with optimization, wether we'll update the buffer from main program a lot or not **/
		);
		
		// gl.bindBuffer(gl.ARRAY_BUFFER, null); // Deselect all buffers
		buffer_p.itemSize = 3; // Constant to keep track of buffer size. This might be revisited later on.
		buffer_p.numItems = mesh.length / 3; // Number of elements (vertices in this case)
		
		return buffer_p; //Return buffer
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