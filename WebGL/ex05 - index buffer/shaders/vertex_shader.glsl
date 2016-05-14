attribute vec3 vertex_pos1;
attribute vec3 vertex_pos2;
attribute vec2 vertex_pos3;

void main(void){
	vec4 v1 = vec4(0.5 * vertex_pos1, 1.0);
	vec4 v2 = vec4(0.5 * vertex_pos2, 1.0);
	vec4 v3 = vec4(0.5 * vertex_pos3, 0.0, 1.0);
	
	//Try different attributes:
	//gl_Position = v1;
	//gl_Position = v2;
	gl_Position = v3;
}