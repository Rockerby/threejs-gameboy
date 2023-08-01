import * as THREE from 'three'

import Experience from '../Experience.js'
import GameBoyEmulator from './GameBoyEmulator.js'

export default class GameBoy
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.world = this.experience.world

        // Resource
        this.resource = this.resources.items.gameboyModel


        this.raycaster = this.experience.world.raycaster;

        this.gameBoyEmulator = new GameBoyEmulator();

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('gameboy')
            this.debugFolder
                .add(this.gameBoyEmulator.mesh.position, 'x')
                .name('gameBoyEmulatorX')
                .min(- 5)
                .max(5)
                .step(0.001)
                this.debugFolder
                    .add(this.gameBoyEmulator.mesh.position, 'y')
                    .name('gameBoyEmulatorY')
                    .min(- 5)
                    .max(5)
                    .step(0.001)
                    this.debugFolder
                        .add(this.gameBoyEmulator.mesh.position, 'z')
                        .name('gameBoyEmulatorZ')
                        .min(- 5)
                        .max(5)
                        .step(0.001)
        }

        this.setModel()
        this.setAnimation();
        this.setCartClick();


        this.gameBoyEmulator.on('cartLoad', ()=>{
            this.animation.playLoading();
        });
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(40, 40, 40)

        this.model.position.set(0, -4, 0)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
            if(child.name == "Cartridge"){

                this.cartridge = child;
            }
        })

        this.gameBoyEmulator.mesh.position.set(
            this.model.position.x + 0.015,
            this.model.position.y + 4.223,
            this.model.position.z + 0.702);//0.698)
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        console.log(this.resource.animations);
        this.animation.actions.loading = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.loading.setLoop(THREE.LoopOnce);
        this.animation.actions.loading.clampWhenFinished = true;

        this.animation.actions.cartloading = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.cartloading.setLoop(THREE.LoopOnce);
        this.animation.actions.cartloading.clampWhenFinished = true;

        // this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        // this.animation.actions.current = this.animation.actions.loading
        // this.animation.actions.current.play()
        // this.animation.actions.current = this.animation.actions.cartloading
        // this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }
        this.animation.playLoading = () =>
        {
            const oldAction = this.animation.actions.current

            this.animation.actions.cartloading.reset()
            this.animation.actions.loading.reset()
            this.animation.actions.cartloading.play()
            this.animation.actions.loading.play()
            if(oldAction){
                this.animation.actions.cartloading.crossFadeFrom(oldAction, 1)
                this.animation.actions.loading.crossFadeFrom(oldAction, 1)
            }
            this.animation.actions.current = this.animation.actions.loading
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playLoading: () => { this.animation.playLoading() },
            }
            this.debugFolder.add(debugObject, 'playLoading')
        }
    }
    setCartClick(){
        this.deboucer = -1;
        window.addEventListener('click', () =>
        {
            if(this.currentIntersect)
            {
                switch(this.currentIntersect)
                {
                    case this.cartridge:
                        console.log('click on object 1')
                        document.getElementById('nanafin').click();


                        break
                }
            }
        })
    }
    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        if(this.gameBoyEmulator)
            this.gameBoyEmulator.update();


        if(this.raycaster) {

            const intersects = this.raycaster.intersectObjects([this.model, this.cartridge])
            if(intersects.length)
            {
                if(intersects[0].object.name == "Cartridge")
                    this.currentIntersect = this.cartridge;
                    else{
                        this.currentIntersect = null;
                    }
            } else{
                this.currentIntersect = null;
            }

        }

    
    }
}