/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';
import Player from '../sprites/Player';
import Enemy from '../sprites/Enemy';

export default class extends Phaser.State {
    init() {
        this.player = null;
        this.ennemies = null;
        this.bullets = null;
        this.bulletTime = 0;
        this.cursors = null; // cursors for command
        this.explosions = null;
        this.background = null;
        this.score = 0;
        this.scoreString = '';
        this.scoreText = null;
        this.lives = null;
        this.backgroundTween = null;
    }

    preload() {

    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.backgroundGroup = this.game.add.group();

        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.createMultiple(300, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);

        // The enemy's bullets
        let enemyBullets = this.game.add.group();
        this.enemyBullets = this.backgroundGroup.add(enemyBullets);
        this.enemyBullets.createMultiple(300, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);

        this.player = new Player({
            game: this.game,
            x: this.world.centerX,
            y: 600,
            asset: 'player'
        });

        this.enemy = new Enemy({
            game: this.game,
            x: this.world.centerX,
            y: 300,
            asset: 'enemy'
        });

        //  Add basic controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.mainButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.secondButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

        this.game.add.existing(this.player);
        this.game.add.existing(this.enemy);
    }

    render() {
        /*
        if (__DEV__) {
            this.game.debug.spriteInfo()
        }
        */
    }

    update() {
        this.bullets.forEachAlive(function (bullet) {
            if (bullet.bulletUpdate) {
                bullet.bulletUpdate(bullet);
            }
        }, this);

        let max_speed = 10;

        if (this.cursors.left.isDown) {
            this.player.x -= max_speed;
        } else if (this.cursors.right.isDown) {
            this.player.moving = true;
            this.player.x += max_speed;
        }       

        if (this.cursors.up.isDown) {
            this.player.y -= max_speed;
        } else if (this.cursors.down.isDown) {
            this.player.y += max_speed;
        }
    }
}
