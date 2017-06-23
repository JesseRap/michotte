const BALL_RADIUS = 20;
const WALL_SIZE = 1000;
const BALL_SPEED = 3;
const INITAL_LAUNCH_DELAY = 0;
let LAUNCH_DELAY = INITAL_LAUNCH_DELAY;
const BIG_ANIMATION_DURATION = 300;
const DELAY_SLIDER = document.getElementById('delaySlider');

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
camera.position.set(0,50,600);
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
const lightGroup = new THREE.Group();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xffffff, 1, 0.1)
const pointLight2 = new THREE.PointLight(0xffffff)
pointLight.position.set(0,50,100);
pointLight2.position.set(0,50,500);
lightGroup.add(ambientLight);
lightGroup.add(pointLight);
lightGroup.add(pointLight2);
scene.add(lightGroup);


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


sphere1.origin = { x: BALL_RADIUS, y: 30, z: 270 }
sphere2.origin = { x: -BALL_RADIUS, y: 60, z: 200 }

const Y_DIFFERENCE = Math.abs(sphere2.origin.y - sphere1.origin.y);
const Z_DIFFERENCE = Math.abs(sphere2.origin.z - sphere1.origin.z);


sphere1.position.set(sphere1.origin.x, sphere1.origin.y, sphere1.origin.z);
sphere2.position.set(sphere2.origin.x, sphere2.origin.y, sphere2.origin.z);

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
    LAUNCH_DELAY = DELAY_SLIDER.value * 60;
  } else {
    LAUNCH_DELAY -= 1;
  }
}


sphere1.isLeavingOrigin = true;
sphere1.destination = sphere1.origin.x + 200;
sphere2.isLeavingOrigin = true;
sphere2.destination = sphere2.origin.x - 200;

function moveBallAway(ball, speed) {
  ball.position.x = ball.position.x + (ball.destination > ball.origin.x ? speed : -speed)
}
function moveBallBack(ball, speed) {
  ball.position.x = ball.position.x + (ball.destination > ball.origin.x ? -speed : speed)
}


function moveBall(ball) {
  if (ball.isLeavingOrigin && Math.abs(ball.position.x - ball.destination) > 1) {
    moveBallAway(ball, BALL_SPEED);
  } else {
    ball.isLeavingOrigin = false;
    moveBallBack(ball, BALL_SPEED);
    if (Math.abs(ball.position.x - ball.origin.x) < 0.1) {
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

let doBigAnimation = true;
function bigAnimation(duration) {
  if (doBigAnimation) {
    // MOVE RED BALL BACK
    if (sphere1.position.z > sphere2.position.z) {
      sphere1.position.z -= Z_DIFFERENCE / BIG_ANIMATION_DURATION;
    }
    // MOVE RED BALL UP
    if (sphere1.position.y < sphere2.position.y) {
      sphere1.position.y += Y_DIFFERENCE / BIG_ANIMATION_DURATION;
    }

    //ROTATE CAMERA
    if (camera.rotation.x > -Math.PI / 2) {
      camera.rotation.x -= (Math.PI / 2) / BIG_ANIMATION_DURATION;
      lightGroup.rotation.x -= (Math.PI / 2) / BIG_ANIMATION_DURATION;
    }
    // PAN CAMERA
    if (camera.position.y < 500) {
      camera.position.y += 450 / BIG_ANIMATION_DURATION;
      lightGroup.position.y += 450 / BIG_ANIMATION_DURATION;
    }
    // DOLLY CAMERA
    if (camera.position.z > 200) {
      camera.position.z -= 400 / BIG_ANIMATION_DURATION;
      lightGroup.position.z -= 200 / BIG_ANIMATION_DURATION;
    }
    else {
      doBigAnimation = false;
    }
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
  setTimeout( ()=>{bigAnimation(BIG_ANIMATION_DURATION);}, 2000);
  // animateCamera();
	renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();

// CONTROLS
controls = new THREE.OrbitControls(camera, renderer.domElement);



DELAY_SLIDER.addEventListener('change', (event) => {
  LAUNCH_DELAY = event.target.value * 60;
})
