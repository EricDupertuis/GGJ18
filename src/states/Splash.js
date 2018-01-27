import Phaser from 'phaser';
import { centerGameObjects } from '../utils';
import config from '../config';

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
        this.load.image('bullet', 'assets/placeholders/bullet.png');
        this.load.image('ui', 'assets/placeholders/ui.png');

        this.load.image('gearBullet', 'assets/bullets/small-gear.png');

        this.game.load.atlas('player', 'assets/spritesheets/player.png', 'assets/spritesheets/player.json');
        this.game.load.atlas('redBullet', 'assets/spritesheets/redBullet.png', 'assets/spritesheets/redBullet.json');
        this.game.load.atlas('blueExplosion1', 'assets/spritesheets/blueExplosion1.png', 'assets/spritesheets/blueExplosion1.json');
        this.game.load.atlas('redExplosion1', 'assets/spritesheets/redExplosion1.png', 'assets/spritesheets/redExplosion1.json');
    }

    create() {
        if (config.showMenu) {
            this.state.start('Menu');
        } else {
            this.state.start('Game');
        }
    }
}
