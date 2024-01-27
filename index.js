import { initBuffers} from "./init-buffer.js";
import { drawScene } from "./draw-scene.js";

// VAriables which track the current rotation of the camera
let cubeRotation = 0.0;

let deltaTime=0;
main();

function main(){
    const canvas = document.querySelector("#glCanvas");
    const gl= canvas.getContext("webgl");
    if(gl===null){
        alert("Unable to initialise webgl ");
        return;
    }
      gl.clearColor(0.0,0.0,0.0,1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      //shader code vertex shader - determine vertices of drawing figure
      const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor=aVertexColor;
    }
  `;
  // fragment shader - determine pixel once vertex determined
  const fsSource = `
  varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
// for the vertices and so forth is established.
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

// Collect all the info needed to use the shader program.
// Look up which attribute our shader program is using
// for aVertexPosition and look up uniform locations.
const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor:gl.getAttribLocation(shaderProgram,"aVertexColor")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
// objects we'll be drawing.
const buffers = initBuffers(gl);

// Draw the scene
//drawScene(gl, programInfo, buffers);
let then=0;
//Draw the scene repeatedly
function render(now)
{
  now*=0.001 //convert into seconds
  deltaTime= now-then;
  then=now;
  drawScene(gl,programInfo,buffers,cubeRotation);
  cubeRotation+=deltaTime;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
}

//intialising shader program
function initShaderProgram(gl,vsSource,fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader= loadShader(gl,gl.FRAGMENT_SHADER,fsSource);
    // create shader  program
    const shaderProgram=gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
        alert(`Unable to initialise shader program:${gl.getProgramInfoLog(shaderProgram)}`,
       )
       return null;
    }
    return shaderProgram;
}

function loadShader(gl,type,source)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        alert(`An error occur compiling the shaders:${gl.getShaderInfoLog(shader)}`,)
        gl.deleteShader(shader);
        return null;
    }
  return shader;

}

let then=0;
//Draw the scene repeatedly
/*function render(now)
{
  now*=0.001 //convert into seconds
  deltaTime= now-then;
  then=now;
  drawScene(gl,programInfo,buffers,cameraRotation);
  cameraRotation+=deltaTime;
  requestAnimationFrame(render);
}*/
