$(document).ready(function(){
	my3DEngine = new My3DEngine();
	// Get a WebGL context:
	context = my3DEngine.getContext(document.getElementById('webgl_canvas'));
	
	// Get a WebGL shader program:
	myshader = my3DEngine.getShader(context, {
		vertex_source : loadFile('./shaders/vertex_shader.glsl', 'text'),
		fragment_source : loadFile('./shaders/fragment_shader.glsl', 'text')
	});
	
	// Create an array with addresses to all myshader attributes:
	myshader.attributes = [ //These must appear in proper order, each attribute on shader to each attribute on VBO
		context.getAttribLocation(myshader, 'vPosition'),
		context.getAttribLocation(myshader, 'vNormal'),
		context.getAttribLocation(myshader, 'vUVMap')
	];
	
	
	
	myshader.uniforms = {
		ModelMatrix : context.getUniformLocation(myshader, 'ModelMatrix'),
		ViewMatrix : context.getUniformLocation(myshader, 'ViewMatrix'),
		ProjectionMatrix : context.getUniformLocation(myshader, 'ProjectionMatrix')
	};
	
	
	
	mymodel = my3DEngine.loadModel(context, loadFile('testmodel1.json', 'json'));
	mymodel.ModelMatrix = mat4.create();
	
	myview = {
		ViewMatrix : mat4.create(),
		ProjectionMatrix : mat4.create()
	};
	
	mat4.perspective(myview.ProjectionMatrix, 1.6, context.viewportWidth / context.viewportHeight, 0.1, 100);
	
	mat4.translate(mymodel.ModelMatrix, mymodel.ModelMatrix, [0.0, 0.0, 0.0]);
	mat4.lookAt(myview.ViewMatrix, [3.0, -2.0, 2.0], [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]);
	
	renderer = my3DEngine.getRenderer(context);
	
	renderer.clear();
	renderer.draw(mymodel, myview, myshader);
});

function loadFile(file, dtype){
	var source;
	$.ajax({
		url : file,
		dataType : dtype,
		success : function(data){
			source = data;
		},
		async : false
	});
	return source;
}