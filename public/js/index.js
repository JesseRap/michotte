const BALL_RADIUS = 20;
const WALL_SIZE = 1000;
const BALL_SPEED = 3;
let LAUNCH_DELAY = INITAL_LAUNCH_DELAY = 60;

// const canvasWidth = window.innerWidth - 100;
// const canvasHeight = window.innerHeight - 100;
const canvasWidth = 500;
const canvasHeight = 500;


// ********************** //

// SET UP SCENE, CAMERA, RENDERER, LIGHTS

// SCENE
const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

// CAMERA
const camera = new THREE.PerspectiveCamera( 30, canvasWidth / canvasHeight, 0.1, 1000 );
camera.position.set(0,50,500);
// camera.lookAt(scene.position);

// RENDERER
const renderer = new THREE.WebGLRenderer( {
  canvas: document.getElementById('three')
});
renderer.setSize( canvasWidth, canvasHeight );

// AIXSHELPER - provides visible orientation axes
const axisHelper = new THREE.AxisHelper( 100 );
scene.add( axisHelper );

// LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
var pointLight = new THREE.PointLight(0xffffff, 1, 0.1)
var pointLight2 = new THREE.PointLight(0xffffff)
pointLight.position.set(0,50,100);
pointLight2.position.set(0,50,500);
scene.add(ambientLight);
scene.add(pointLight);
scene.add(pointLight2);


// ********************** //

// MAKE FLOOR AND WALL
const planeTexture = new THREE.TextureLoader().load('../img/checkerboard.png');
// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
// floorTexture.repeat.set( 1, 1 );
const planeMaterial = new THREE.MeshLambertMaterial({
  map: planeTexture,
  side: THREE.DoubleSide
});
const planeGeometry = new THREE.PlaneGeometry(WALL_SIZE, WALL_SIZE, 1, 1);

const floor = new THREE.Mesh(planeGeometry, planeMaterial);
const wall = new THREE.Mesh(planeGeometry, planeMaterial);
wall.rotation.x = Math.PI / 2; // rotate the wall so it's perpendicular to floor

group.add(floor);
group.add(wall);



// ********************** //


// MAKE SPHERES
var sphereGeometry = new THREE.SphereGeometry(BALL_RADIUS, 30, 30);
var sphere1Material = new THREE.MeshPhongMaterial({color: 'red'});
var sphere2Material = new THREE.MeshPhongMaterial({color: 'blue'});
const sphere1 = new THREE.Mesh(sphereGeometry, sphere1Material);
const sphere2 = new THREE.Mesh(sphereGeometry, sphere2Material);

const SPHERE2_X = -40;
const SPHERE2_Y = 60;
const SPHERE2_Z = 200;

const SPHERE1_X = 20;
const SPHERE1_Y = 30;
const SPHERE1_Z = 270;

sphere1.position.set(SPHERE1_X, SPHERE1_Y, SPHERE1_Z);
sphere1.INITIAL_X = SPHERE1_X;
sphere2.position.set(SPHERE2_X, SPHERE2_Y, SPHERE2_Z);
sphere2.INITIAL_X = SPHERE2_X;
group.add(sphere1);
group.add(sphere2);

// ********************** //

// HELPER FUNCTIONS



function animateCamera() {
  if (camera.rotation.x > -Math.PI / 2) {
    camera.rotation.x -= 0.01
  }
}


const animations = ['ball1', 'delay', 'ball2', 'delay'];
let currentAnimationIdx = 0;
let currentAnimation = animations[currentAnimationIdx];

function nextAnimation() {
  currentAnimationIdx = (currentAnimationIdx + 1) % animations.length;
  currentAnimation = animations[currentAnimationIdx];
}

function delay() {
  if (LAUNCH_DELAY === 0) {
    nextAnimation();
    LAUNCH_DELAY = INITAL_LAUNCH_DELAY;
  } else {
    LAUNCH_DELAY -= 1;
  }
}


sphere1.isLeavingOrigin = true;
sphere1.destination = sphere1.INITIAL_X + 200;
sphere2.isLeavingOrigin = true;
sphere2.destination = sphere2.INITIAL_X - 200;

function moveBallAway(ball, speed) {
  ball.position.x = ball.position.x + (ball.destination > ball.INITIAL_X ? speed : -speed)
}
function moveBallBack(ball, speed) {
  ball.position.x = ball.position.x + (ball.destination > ball.INITIAL_X ? -speed : speed)
}


function moveBall(ball) {
  if (ball.isLeavingOrigin && Math.abs(ball.position.x - ball.destination) > 1) {
    moveBallAway(ball, BALL_SPEED);
  } else {
    ball.isLeavingOrigin = false;
    moveBallBack(ball, BALL_SPEED);
    if (Math.abs(ball.position.x - ball.INITIAL_X) < 0.1) {
      ball.isLeavingOrigin = true;
      nextAnimation();
    }
  }
}

function doAnimation() {
  console.log(currentAnimation);
  switch (currentAnimation) {
    case 'ball1':
      moveBall(sphere1);
      break;
    case 'delay':
      delay();
      break;
    case 'ball2':
      moveBall(sphere2);
      break;
  }
}






// RENDER ANIMATION
let rotate = true;

function animate() {
  // if (rotate) {
  //   group.rotation.x += 0.005;
  // }
  // if (group.rotation.x > Math.PI/2) {
  //   rotate = false;
  // }
  // cube.rotation.y += 0.01;
  // ballToRight(sphere2);
  // moveBall1(sphere2);
  doAnimation();
  // animateCamera();
	renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();

// CONTROLS
controls = new THREE.OrbitControls(camera);
