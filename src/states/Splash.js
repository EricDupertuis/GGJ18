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
        this.game.load.image('credits', 'assets/images/credits.jpg');
        this.game.load.image('cloud', 'assets/images/cloud.png');

        this.load.image('gearBullet', 'assets/bullets/small-gear.png');

        this.game.load.atlas('player', 'assets/spritesheets/player.png', 'assets/spritesheets/player.json');
        this.game.load.atlas('redBullet', 'assets/spritesheets/redBullet.png', 'assets/spritesheets/redBullet.json');
        this.game.load.atlas('blueExplosion1', 'assets/spritesheets/blueExplosion1.png', 'assets/spritesheets/blueExplosion1.json');
        this.game.load.atlas('redExplosion1', 'assets/spritesheets/redExplosion1.png', 'assets/spritesheets/redExplosion1.json');
        this.game.load.atlas('background', 'assets/spritesheets/background.png', 'assets/spritesheets/background.json');

        this.game.load.audio('beam1', 'assets/audio/soundEffects/Beam1.ogg');
        this.game.load.audio('beam2', 'assets/audio/soundEffects/Beam2.ogg');
        this.game.load.audio('explosion1', 'assets/audio/soundEffects/Explosion1.ogg');
        this.game.load.audio('explosion2', 'assets/audio/soundEffects/Explosion2.ogg');
        this.game.load.audio('hit1', 'assets/audio/soundEffects/Hit1.ogg');
        this.game.load.audio('Laser1', 'assets/audio/soundEffects/Laser1.ogg');
        this.game.load.audio('Laser2', 'assets/audio/soundEffects/Laser2.ogg');
        this.game.load.audio('lastExplosion1', 'assets/audio/soundEffects/LastExplosion1.ogg');
        this.game.load.audio('load1', 'assets/audio/soundEffects/Load1.ogg');
        this.game.load.audio('missile1', 'assets/audio/soundEffects/Missile1.ogg');

        this.game.load.audio('mainMusic', 'assets/audio/music/mainMusic.ogg');
    }

    create() {
        if (config.showMenu) {
            this.state.start('Menu');
        } else {
            this.state.start('Game');
        }
    }
}
