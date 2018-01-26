import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
    init() { }

    preload() {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([this.loaderBg, this.loaderBar]);

        this.load.setPreloadSprite(this.loaderBar);
        
        //
        // load your assets
        //
        this.load.image('enemyBullet', 'assets/placeholders/bullet.png');
        this.load.image('enemy', 'assets/placeholders/enemy.png');
        this.load.image('player', 'assets/placeholders/player.png');
        this.load.image('bullet', 'assets/placeholders/bullet.png');
    }

    create() {
        this.state.start('Game');
    }
}
