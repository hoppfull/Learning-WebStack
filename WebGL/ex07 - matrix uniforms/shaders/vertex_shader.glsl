attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vUVMap;

uniform mat4 ModelMatrix;
uniform mat4 ViewMatrix;
uniform mat4 ProjectionMatrix;

void main(void){
	vec4 v = vec4(0.5 * vPosition, 1.0);
	
	
	gl_Position = ProjectionMatrix * ViewMatrix * ModelMatrix * v;
}