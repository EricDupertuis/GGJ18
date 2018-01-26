/* globals __DEV__ */
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Enemy from '../sprites/Enemy';
import { handleEnemyHit, handlePlayerHit, handleEnemyPlayerCollision } from '../utils/CollisionHandler';

export default class extends Phaser.State {
    init() {
        this.player = null;
        this.ennemies = null;
        this.bullets = null;
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
        this.bullets.enableBody = true;
        this.bullets.createMultiple(300, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        let enemyBullets = this.game.add.group();
        this.enemyBullets = this.backgroundGroup.add(enemyBullets);
        this.enemyBullets.enableBody = true;
        this.enemyBullets.createMultiple(300, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        this.player = new Player({
            game: this.game,
            x: this.world.centerX,
            y: 600,
            asset: 'player',
            bullets: this.bullets
        });

        this.enemy = new Enemy({
            game: this.game,
            x: this.world.centerX,
            y: 100,
            asset: 'enemy',
            enemyBullets: this.enemyBullets
        });

        this.game.add.existing(this.player);
        this.game.add.existing(this.enemy);
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo()
        }
    }

    update() {
        this.game.physics.arcade.overlap(this.bullets, this.enemy, handleEnemyHit, null, this);
        this.game.physics.arcade.overlap(this.enemyBullets, this.player, handlePlayerHit, null, this);
        this.game.physics.arcade.overlap(this.enemy, this.player, handleEnemyPlayerCollision, null, this);
    }

    resetBullet(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    }
}
