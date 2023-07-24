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

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.gameboy = new GameBoy();

        })
    }

    update()
    {
        if(this.gameboy)
            this.gameboy.update();
    }
}