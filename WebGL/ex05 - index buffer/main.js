$(document).ready(function(){
	my3DEngine = new My3DEngine();
	// Get a WebGL context:
	context = my3DEngine.getContext(document.getElementById('webgl_canvas'));
	
	// Get a WebGL shader program:
	myshader = my3DEngine.getShader(context, {
		vertex_source : loadTextFile('./shaders/vertex_shader.glsl'),
		fragment_source : loadTextFile('./shaders/fragment_shader.glsl')
		});
	
	// Create an array with addresses to all myshader attributes:
	myshader.attributes = [ //These must appear in proper order, each attribute on shader to each attribute on VBO
		context.getAttribLocation(myshader, 'vertex_pos1'),
		context.getAttribLocation(myshader, 'vertex_pos2'),
		context.getAttribLocation(myshader, 'vertex_pos3'),
		];
	
	mymodel = my3DEngine.loadModel(context, {
		vdata : [ //Vertex data:
			-1.0, 1.0, 0.0,  0.0, 1.0, 0.0, -1.0, 1.0,
			-1.0,-1.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
			 1.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0, 0.0,
			 1.0, 1.0, 0.0,  1.0, 0.0, 0.0,  0.0, 1.0,
			],
		idata : [ //Index data:
			0, 1, 2,
			2, 3, 0
			],
		rowSize : 8, //Elements per vertex
		rowDist : [3, 3, 2] //Distribution of data
		});
	
	renderer = my3DEngine.getRenderer(context);
	
	renderer.clear();
	renderer.draw(mymodel, myshader);
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