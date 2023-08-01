import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from './Utils/OrbitControls-NoPan.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.setInstance()
        this.setControls()
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder
                .add(this.instance.position, 'x')
                .name('camX')
                .min(- 50)
                .max(50)
                .step(0.001)
                this.debugFolder
                    .add(this.instance.position, 'y')
                    .name('camY')
                    .min(- 50)
                    .max(50)
                    .step(0.001)
                    this.debugFolder
                        .add(this.instance.position, 'z')
                        .name('camZ')
                        .min(- 50)
                        .max(50)
                        .step(0.001)
        }
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 19)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}