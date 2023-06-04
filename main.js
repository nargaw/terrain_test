import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js"

//link to canvas
const canvas = document.querySelector('#webgl')




//set sizes
const sizes= {
    width: window.innerWidth,
    height: window.innerHeight
}

//instace of scene
const scene = new THREE.Scene()

//add fog
const fog = new THREE.Fog('#000000', 1, 2.5)
scene.fog = fog

//instance of camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width/sizes.height,
    0.001,
    20
)
camera.position.x = 0;
camera.position.y = 0.06;
camera.position.z = 1.1;

//instance of renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//post processing
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.uniforms['amount'].value = 0.00015
effectComposer.addPass(rgbShiftPass)

//create mesh
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh( geometry, material )
// scene.add( cube )

//cubemap
const cubePath = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/MilkyWay/'
const cubeMapLoader = new THREE.CubeTextureLoader()
cubeMapLoader.setPath(cubePath)
cubeMapLoader.load(
    [
        'dark-s_nx.jpg',
        'dark-s_ny.jpg',
        'dark-s_nz.jpg',
        'dark-s_px.jpg',
        'dark-s_py.jpg',
        'dark-s_pz.jpg',
    ], (texture) => {
        scene.background = texture
    } 
)


//load textures
const TEXTURE_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657168/blog/vaporwave-threejs-textures/grid.png"
const DISPLACEMENT_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657200/blog/vaporwave-threejs-textures/displacement.png"
const METALNESS_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657200/blog/vaporwave-threejs-textures/metalness.png"
// Textures
const textureLoader = new THREE.TextureLoader()
const gridTexture = textureLoader.load(TEXTURE_PATH)
const terrainTexture = textureLoader.load(DISPLACEMENT_PATH)
const metalnessTexture = textureLoader.load(METALNESS_PATH)

//create plane
const planeGeometry = new THREE.PlaneGeometry(1, 2, 24, 24)
const planeMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    // color: 0xffffff
    map: gridTexture,
    displacementMap: terrainTexture,
    displacementScale: 0.4,
    metalnessMap: metalnessTexture,
    metalness: 0.9,
    roughness: 0.65

})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
const plane2 = new THREE.Mesh(planeGeometry, planeMaterial)
const plane3 = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI * 0.5
plane.position.z = 0.15
plane2.rotation.x = -Math.PI * 0.5
plane2.position.z = 0.15
plane3.rotation.x = -Math.PI * 0.5
plane3.position.z = 0.15
scene.add(plane, plane2, plane3)

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 20)
scene.add(ambientLight)
const spotLight = new THREE.SpotLight('#d53c3d', 20, 25, Math.PI * 0.1, 0.25)
spotLight.position.set(0.5, 0.75, 2.2)
spotLight.target.position.set(-0.25, 0.25, 0.25)
scene.add(spotLight, spotLight.target)

const spotLight2 = new THREE.SpotLight('#d53c3d', 20, 25, Math.PI * 0.1, 0.25)
spotLight2.position.set(-0.5, 0.75, 2.2)
spotLight2.target.position.set(0.25, 0.25, 0.25)
scene.add(spotLight2, spotLight2.target)


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

//clock
const clock = new THREE.Clock()

//animate
function animate()
{

    //get elapsed time
    const elapsedTime = clock.getElapsedTime()

    //recursive call
    requestAnimationFrame(animate)

    //render using scene and camera
    // renderer.render(scene, camera)

    //render with effect composer
    effectComposer.render()

    //update controls
    controls.update()

    //animate cube
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    //animate plane
    plane.position.z = (0.15 * elapsedTime) % 2
    plane2.position.z = ((elapsedTime * 0.15) %2) -2
    plane3.position.z = ((elapsedTime * 0.15) %2) +2
}

animate()

