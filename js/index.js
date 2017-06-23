const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {
  canvas: document.getElementById('three')
});
renderer.setSize( window.innerWidth, window.innerHeight );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
  cube.rotation.x += 1;
  cube.rotation.y += 0.01;
	renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();

// var floorTexture = new THREE.ImageUtils.loadTexture( 'img/checkerboard.png' );
// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
// floorTexture.repeat.set( 10, 10 );
// DoubleSide: render texture on both sides of mesh

var floorTexture = new THREE.TextureLoader().load('img/checkerboard.png');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 50, 50 );
var floorMaterial = new THREE.MeshPhongMaterial({
  map: floorTexture,
  side: THREE.DoubleSide
});
var floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0,0,-1000);
scene.add(floor);
