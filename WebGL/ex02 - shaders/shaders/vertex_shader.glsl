attribute vec4 vertex_pos;

uniform mat4 ModelMatrix;
uniform mat4 ViewMatrix;
uniform mat4 ProjectionMatrix;
uniform float whatever;

void main(void){
	gl_Position = whatever * ModelMatrix * ViewMatrix * ProjectionMatrix * vertex_pos;
}