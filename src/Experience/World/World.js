import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import GameBoy from './GameBoy.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.renderer = this.experience.renderer.instance

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.gameboy = new GameBoy();
            
        })
        this.setRaycaster()

    }

    setRaycaster(){
        this.raycaster = new THREE.Raycaster()
        let currentIntersect = null
        const rayOrigin = new THREE.Vector3(-3, 0, 0)
        const rayDirection = new THREE.Vector3(10, 0, 0)
        rayDirection.normalize()


        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        window.addEventListener('resize', () =>
        {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
        
            // Update camera
            this.camera.aspect = sizes.width / sizes.height
            this.camera.updateProjectionMatrix()
        
            // Update renderer
            this.renderer.setSize(sizes.width, sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
        
        this.mouseVector = new THREE.Vector2()

        window.addEventListener('mousemove', (event) =>
        {
            this.mouseVector.x = event.clientX / sizes.width * 2 - 1
            this.mouseVector.y = - (event.clientY / sizes.height) * 2 + 1
        })
        
    }

    update()
    {
        if(this.gameboy)
            this.gameboy.update();

        //     console.log("Mouse:", this.mouseVector)
        // if(this.camera)
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
    }
}