$(document).ready(function(){
	my3DEngine = new My3DEngine();
	// Get a WebGL context:
	context = my3DEngine.getContext(document.getElementById('webgl_canvas'));
	
	// Get a WebGL shader program:
	shader = my3DEngine.getShader(context, {
		vertex_source : loadTextFile('./shaders/vertex_shader.glsl'),
		fragment_source : loadTextFile('./shaders/fragment_shader.glsl')
	});
	
	// Create an object with addresses to all our shader attributes:
	shader.uniforms = {
		vertex_pos : context.getAttribLocation(shader, 'vertex_pos'),
		ModelMatrix : context.getUniformLocation(shader, 'ModelMatrix'),
		ViewMatrix : context.getUniformLocation(shader, 'ViewMatrix'),
		ProjectionMatrix : context.getUniformLocation(shader, 'ProjectionMatrix'),
	};
	
	model = my3DEngine.loadModel(context,
		[
			-1.0,-1.0, 0.0,
			 1.0,-1.0, 0.0,
			 0.0, 1.0, 0.0
		]);
});

function loadTextFile(file){
	var source;
	$.ajax({
		url : file,
		datatype : 'text',
		success : function(data){
			source = data;
		},
		async : false
	});
	return source;
}