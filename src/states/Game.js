/* globals __DEV__ */
import config from '../config';

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

        this.scoreString = 'Score: ';
        this.livesString = 'Lives: ';
        this.scoreText = null;
        this.livesText = null;
        this.ui = null;
        this.gearTexts = [];

        this.backgroundTween = null;
    }

    preload() {

    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, config.worldBoundX, config.worldBoundY);

        this.backgroundGroup = this.game.add.group();

        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.createMultiple(300, 'redBullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        let enemyBullets = this.game.add.group();
        this.enemyBullets = this.backgroundGroup.add(enemyBullets);
        this.enemyBullets.enableBody = true;
        this.enemyBullets.createMultiple(300, 'gearBullet');
        this.enemyBullets.setAll('scale.x', 0.25);
        this.enemyBullets.setAll('scale.y', 0.25);
        this.enemyBullets.setAll('tint', config.colorPalette.avocadoGreen);
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        this.rightPanel = new Phaser.Graphics(
            this.game,
            config.worldBoundX,
            0
        );

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

        this.enemy.tint = config.colorPalette.neonGreen;
        this.game.add.existing(this.player);
        this.game.add.existing(this.enemy);

        this.ui = this.game.add.sprite(config.worldBoundX, 0, 'ui');

        this.scoreText = this.game.add.text(
            config.worldBoundX + 10,
            10,
            this.scoreString + this.score,
            {
                font: '34px Arial',
                fill: '#fff'
            }
        );

        this.livesText = this.game.add.text(
            config.worldBoundX + 10,
            44,
            this.livesString + this.player.lives,
            {
                font: '34px Arial',
                fill: '#fff'
            }
        );

        for (let i = 0; i < config.speeds.numberOfGears; i++) {
            this.gearTexts[i] = this.game.add.text(
                config.worldBoundX + 10,
                74 + (34 * i),
                i + 1,
                { font: '34px Arial', fill: '#fff' }
            );
        }
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo()
        }
    }

    update() {
        this.gearTexts.forEach(function (entry, i) {
            entry.alpha = 1;
            if (i !== this.player.currentGear - 1) {
                entry.alpha = 0.6;
            }
        }, this);

        this.game.physics.arcade.overlap(this.bullets, this.enemy, handleEnemyHit, () => {
            this.score++;
            this.scoreText.text = this.scoreString + this.score;
        }, this);
        this.game.physics.arcade.overlap(this.enemyBullets, this.player, handlePlayerHit, () => {
            this.livesText.text = this.livesString + (this.player.lives - 1);
        }, this);
        this.game.physics.arcade.overlap(this.enemy, this.player, handleEnemyPlayerCollision, null, this);
    }
}
