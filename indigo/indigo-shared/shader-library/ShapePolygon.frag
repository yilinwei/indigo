#version 300 es

precision mediump float;

vec2 UV;
vec4 COLOR;
float TAU;
float TIME;
vec2 SIZE;

//<indigo-fragment>
const int MAX_VERTICES = 3;

layout (std140) uniform CustomData {
  vec2 ASPECT_RATIO;
  float STROKE_WIDTH;
  float COUNT;
  vec4 STROKE_COLOR;
  vec4 FILL_COLOR;
  vec2[MAX_VERTICES] VERTICES;
};

// Borrowed with thanks! https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float sdfCalc(vec2 p, int count, vec2[MAX_VERTICES] v) {
    float d = dot(p - v[0], p - v[0]);
    float s = 1.0;
    for(int i = 0, j = count - 1; i < count; j = i, i++) {
        vec2 e = v[j] - v[i];
        vec2 w =    p - v[i];
        vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
        d = min(d, dot(b, b));
        bvec3 c = bvec3(p.y >= v[i].y, p.y < v[j].y, e.x * w.y > e.y * w.x);
        if(all(c) || all(not(c))) s *= -1.0;  
    }
    return s * sqrt(d);
}

void fragment() {

  vec2 v0 = VERTICES[0];
  // vec2 v0 = vec2(0.1, 0.1);
  vec2 v1 = VERTICES[2];
  // vec2 v1 = vec2(0.2, 0.7);
  vec2 v2 = vec2(0.9, 0.9);
  // vec2 v2 = VERTICES[2];
  vec2 ve = vec2(0.0, 0.0);
  vec2[MAX_VERTICES] polygon = vec2[MAX_VERTICES](v0, v1, v2);

  float strokeWidthHalf = max(0.0, STROKE_WIDTH / SIZE.x / 2.0);

  float sdf = sdfCalc(UV, int(COUNT), polygon);
  float annularSdf = abs(sdf) - strokeWidthHalf;

  float fillAmount = (1.0 - step(0.0, sdf)) * FILL_COLOR.a;
  float strokeAmount = (1.0 - step(0.0, annularSdf)) * STROKE_COLOR.a;

  vec4 fillColor = vec4(FILL_COLOR.rgb * fillAmount, fillAmount);
  vec4 strokeColor = vec4(STROKE_COLOR.rgb * strokeAmount, strokeAmount);

  COLOR = mix(fillColor, strokeColor, strokeAmount);

}
//</indigo-fragment>
