import Experience from '../Experience.js'
import Environment from './Environment.js'
import GameBoyEmulator from './GameBoyEmulator.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.gameboy = new GameBoyEmulator();

        })
    }

    update()
    {
        if(this.gameboy)
            this.gameboy.update();
    }
}