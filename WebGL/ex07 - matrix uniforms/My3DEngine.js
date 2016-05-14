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
			
			setUniformMat4 : function(uniformCPU, uniformGPU){
				// Check if uniform is used on CPU and GPU before sending:
				if(uniformCPU && uniformGPU)
					gl.uniformMatrix4fv(uniformGPU, false, uniformCPU);
			},
			
			draw : function(model, view, shader){
				try{
					gl.useProgram(shader); //Select shader to use
					gl.bindBuffer(gl.ARRAY_BUFFER, model.VBO); //Select buffer to use
					
					var offset = 0; //Where in row (in bits) is read
					for(var i = 0; i < shader.attributes.length; i++){
						/*
							For loop will go through all possible attributes in a shader and assign
							data from a buffer to them. This will only work if shader object is
							formated properly and model object has required information for this
							function to know what to do.
						*/
						if(shader.attributes[i] >= 0){
							gl.enableVertexAttribArray(shader.attributes[i]); //Enable an attribute on shader to be used with buffer
							gl.vertexAttribPointer(
								shader.attributes[i],	//Attribute on shader
								model.rowDist[i],		//Number of elements for this attribute
								gl.FLOAT,				//Type of data in buffer
								false,					//Normalize data?
								model.rowSize * 4,		//Bits per row (floats: 4bits)
								offset					//Position in row to start
								);
							offset += model.rowDist[i] * 4; //Increment position in row for next loop
						}
					}
					
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.IBO); //Select buffer
					
					this.setUniformMat4(model.ModelMatrix, shader.uniforms.ModelMatrix);
					this.setUniformMat4(view.ViewMatrix, shader.uniforms.ViewMatrix);
					this.setUniformMat4(view.ProjectionMatrix, shader.uniforms.ProjectionMatrix);
					
					gl.drawElements(gl.TRIANGLES, model.indexSize, gl.UNSIGNED_SHORT, 0); //Draw vertices in order based on indices
				}finally{
					for(var i = 0; i < shader.attributes.length; i++){ //Disable all attributes on shader after drawing
						if(shader.attributes[i] >= 0)
							gl.disableVertexAttribArray(shader.attributes[i]);
					}
					
					gl.bindBuffer(gl.ARRAY_BUFFER, null); //Deselect all buffers
					gl.useProgram(null); //Deselect all shaders
				}
			}
		};
	};
	
	this.loadModel = function(gl, model){
		/*
			This function sends mesh data to GPU and returns an object with relevant
			information needed to render mesh. Data should be formated thus:
			model = {
				vdata : [ //Vertex data:
					0.0, 0.0, 0.0,		0.0, 0.0, 0.0,		0.0, 0.0,		0.0, 0.0,
					0.0, 0.0, 0.0,		0.0, 0.0, 0.0,		0.0, 0.0,		0.0, 0.0,
					0.0, 0.0, 0.0,		0.0, 0.0, 0.0,		0.0, 0.0,		0.0, 0.0,
					0.0, 0.0, 0.0,		0.0, 0.0, 0.0,		0.0, 0.0,		0.0, 0.0,
					0.0, 0.0, 0.0,		0.0, 0.0, 0.0,		0.0, 0.0,		0.0, 0.0,
					],
				idata : [ //Index data:
					1, 2, 3,
					2, 3, 4,
					3, 4, 5
					],
				rowSize : 10, //Elements per vertex
				rowDist : [3, 3, 2, 2] //Distribution of data
				};
		*/
		var buffer = { //Prepare buffer object to keep track of relevant information
			VBO : gl.createBuffer(), //Vertex data (eg. position, normals, uv coords)
			IBO : gl.createBuffer(), //Index data (ie. which vertices makes up a triangle)
			rowSize : model.rowSize, //Elements per vertex
			rowDist : model.rowDist, //Distribution of elements per vertex property (eg. 3 elements for position)
			colSize : model.vdata.length / model.rowSize, //Number of vertices for model
			indexSize : model.idata.length, //Number of indices for model
			};
		
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer.VBO); //Select buffer on GPU at adress in buffer.VBO
		gl.bufferData(gl.ARRAY_BUFFER, //Type of information
			new Float32Array(model.vdata), //Data to be sent
			gl.STATIC_DRAW); //This is always static unless we want to reuppload data to GPU
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.IBO); //Select buffer on GPU at adress in buffer.IBO
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, //Type of information
			new Uint16Array(model.idata), //Data to be sent
			gl.STATIC_DRAW); //This is always static unless we want to reuppload data to GPU
		
		gl.bindBuffer(gl.ARRAY_BUFFER, null); // Deselect all buffers
		return buffer; //Return buffer
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