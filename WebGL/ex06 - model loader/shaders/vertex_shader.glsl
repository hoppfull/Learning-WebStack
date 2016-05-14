attribute vec3 vertex_pos;
attribute vec2 vertex_uv;

void main(void){
	vec4 v = vec4(0.5 * vertex_pos, 1.0);
	
	
	gl_Position = v;
}