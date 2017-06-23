const BALL_RADIUS = 10;
const WALL_SIZE = 400;

const canvasWidth = window.innerWidth - 100;
const canvasHeight = window.innerHeight - 100;



// SET UP SCENE, CAMERA, RENDERER

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );
camera.position.set(0,20,-200);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer( {
  canvas: document.getElementById('three')
});
renderer.setSize( canvasWidth, canvasHeight );

var axisHelper = new THREE.AxisHelper( 100 );
scene.add( axisHelper );


// ********************** //

// CUBE
// const geometry = new THREE.BoxGeometry( 50, 50, 50 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.set(0,40,40);
// scene.add( cube );



let goingRight = true;
function ballToRight(ball) {
  if (goingRight && ball.position.x < 100) {
    ball.position.x += 1
  } else {
    goingRight = false;
    ball.position.x -= 1
    if (ball.position.x < 0.5) {
      goingRight = true;
    }
  }
}


// var floorTexture = new THREE.ImageUtils.loadTexture( 'img/checkerboard.png' );
// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
// floorTexture.repeat.set( 10, 10 );
// DoubleSide: render texture on both sides of mesh


// MAKE FLOOR AND WALL
let floorTexture = new THREE.TextureLoader().load('../img/checkerboard.png');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 1, 1 );
var floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
  side: THREE.DoubleSide
});
var floorGeometry = new THREE.PlaneGeometry(WALL_SIZE, WALL_SIZE, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
var wall = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0,0,0);
wall.position.set(0,0,0);
wall.rotation.x = Math.PI / 2;
// floor.rotation.x = Math.PI / 2;
scene.add(floor);
scene.add(wall);






// let floorTexture2 = new THREE.TextureLoader().load('../img/checkerboard.png');
// floorTexture2.wrapS = floorTexture2.wrapT = THREE.RepeatWrapping;
// floorTexture2.repeat.set( 2, 2 );
// var floorMaterial2 = new THREE.MeshBasicMaterial({
//   map: floorTexture2,
//   side: THREE.DoubleSide
// });
// var floorGeometry2 = new THREE.PlaneGeometry(200, 200, 1, 1);
// var floor2 = new THREE.Mesh(floorGeometry2, floorMaterial2);
// floor2.position.set(0,0,0);
// floor2.rotation.x = 1.5;
// scene.add(floor2);


// MAKE SPHERE
var sphereGeometry = new THREE.SphereGeometry(BALL_RADIUS, 30, 30);
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphere2 = new THREE.Mesh(sphereGeometry, new THREE.MeshLambertMaterial({color: 0x00ff00}));
sphere1.position.set(-20,30,-30);
sphere2.position.set(20,30,-30);
scene.add(sphere1);
scene.add(sphere2);




// var light = new THREE.AmbientLight(0xffffff, 0.5);
var light1 = new THREE.PointLight(0xffffff, 1, 0);
light1.position.set(0,50,-100);
scene.add(light1);
// scene.add(light);


// RENDER ANIMATION
let rotate = true;

function animate() {
  if (rotate) {
    floor.rotation.x += 0.01;
    wall.rotation.x += 0.01;
    // cube.rotation.x += 0.01;
    // cube2.rotation.x += 0.01;
  }
  if (floor.rotation.x > Math.PI/2) {
    rotate = false;
  }
  // cube.rotation.y += 0.01;
  ballToRight(sphere1);
	renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();




var cubeMaterialArray = [];
// order to add materials: x+,x-,y+,y-,z+,z-
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333, transparent: true,
  wireframe: true } ) );
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333, transparent: true,
  wireframe: true } ) );
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
// var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
// Cube parameters: width (x), height (y), depth (z),
//        (optional) segments along x, segments along y, segments along z
var cubeGeometry = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1 );
// using THREE.MeshFaceMaterial() in the constructor below
//   causes the mesh to use the materials stored in the geometry
const cube2 = new THREE.Mesh( cubeGeometry, cubeMaterialArray );
// cube2.position.set(-100, 50, -50);
// scene.add( cube2 );

controls = new THREE.OrbitControls(camera);

cube2.rotation.x = 0;


// window.addEventListener('keydown', (event) => {
//   console.log('KEYDOWN', event)
//   switch (event.key) {
//     case 'ArrowUp':
//       if (event.shiftKey) {
//         camera.position.z += 10;
//       } else {
//         camera.rotation.x += .1;
//       }
//       break;
//     case 'ArrowDown':
//     if (event.shiftKey) {
//       camera.position.z -= 10;
//     } else {
//       camera.rotation.x -= .1;
//     }
//       break;
//     case 'ArrowRight':
//       if (event.shiftKey) {
//         camera.position.x += 1;
//       } else {
//         camera.rotation.y += .1;
//       }
//       break;
//     case 'ArrowLeft':
//       if (event.shiftKey) {
//         camera.position.x -= 1;
//       } else {
//         camera.rotation.y -= .1;
//       }
//       break;
//   }
// })
