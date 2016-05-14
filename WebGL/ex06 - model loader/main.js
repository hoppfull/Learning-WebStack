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
		context.getAttribLocation(myshader, 'vertex_pos'),
		context.getAttribLocation(myshader, 'vertex_uv')
	];
	
	mymodel = my3DEngine.loadModel(context, loadFile('testmodel1.json', 'json'));
	
	renderer = my3DEngine.getRenderer(context);
	
	renderer.clear();
	renderer.draw(mymodel, myshader);
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