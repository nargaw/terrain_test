import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//link to canvas
const canvas = document.querySelector('#webgl')




//set sizes
const sizes= {
    width: window.innerWidth,
    height: window.innerHeight
}

//instace of scene
const scene = new THREE.Scene()

//instance of camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width/sizes.height,
    0.1,
    1000
)
camera.position.z = 2
camera.position.y = 1

//instance of renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//create mesh
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh( geometry, material )
// scene.add( cube )

//load textures
const TEXTURE_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657168/blog/vaporwave-threejs-textures/grid.png"
// Textures
const textureLoader = new THREE.TextureLoader()
const gridTexture = textureLoader.load(TEXTURE_PATH)

//create plane
const planeGeometry = new THREE.PlaneGeometry(1, 2, 24, 24)
const planeMaterial = new THREE.MeshBasicMaterial({
    // wireframe: true,
    // color: 0xffffff
    map: gridTexture
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI * 0.5
plane.position.z = 0.15
scene.add(plane)



//update controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//update on resize
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer size
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//animate
function animate()
{
    //recursive call
    requestAnimationFrame(animate)

    //render using scene and camera
    renderer.render(scene, camera)

    //update controls
    controls.update()

    //animate cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

animate()

