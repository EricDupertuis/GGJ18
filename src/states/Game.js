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

        this.scoreString = config.ui.texts.scoreText.text;
        this.livesString = config.ui.texts.livesText.text;
        this.currentGearText = config.ui.texts.gearsText.text;
        this.scoreText = null;
        this.livesText = null;
        this.ui = null;
        this.gearTexts = [];

        this.backgroundTween = null;

        this.backgroundMusic = this.game.add.audio('mainMusic');
        this.audioHit = this.game.add.audio('hit1');
        this.audioPlayerHit = this.game.add.audio('explosion2');
        this.audioLoad = this.game.add.audio('beam2');
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
        this.enemyBullets.setAll('anchor.y', 0.5);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        this.enemyBullets.forEach((b) => {
            b.body.setSize(70, 70, 30, 30);
        });

        //  That's one explosive group you got there sir
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(50, 'blueExplosion1');

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
            bullets: this.bullets,
            explosions: this.explosions
        });

        this.enemy = new Enemy({
            game: this.game,
            player: this.player,
            x: this.world.centerX,
            y: -200,
            asset: 'enemy',
            enemyBullets: this.enemyBullets,
            explosions: this.explosions,
            audio: this.audioLoad
        });

        // TODO: Change when we get a real asset
        this.enemy.scale.setTo(0.5, 0.5);

        this.game.add.existing(this.player);
        this.game.add.existing(this.enemy);

        this.ui = this.game.add.sprite(config.worldBoundX, 0, 'ui');

        this.scoreText = this.game.add.text(
            config.worldBoundX + config.ui.padding,
            config.ui.texts.scoreText.y,
            this.scoreString + this.score,
            config.ui.textConfig
        );

        this.livesText = this.game.add.text(
            config.worldBoundX + config.ui.padding,
            config.ui.texts.livesText.y,
            this.livesString + this.player.lives,
            config.ui.textConfig
        );

        this.currentGearText = this.game.add.text(
            config.worldBoundX + config.ui.padding,
            config.ui.texts.gearsText.y,
            config.ui.texts.gearsText.text,
            config.ui.textConfig
        );

        for (let i = 0; i < config.speeds.numberOfGears; i++) {
            this.gearTexts[i] = this.game.add.text(
                config.worldBoundX + config.ui.padding + (config.ui.texts.gearsText.spacing * i),
                config.ui.texts.gearsText.y + 55,
                i + 1,
                config.ui.textConfig
            );
        }

        this.backgroundMusic.play('', 0, 0.3, true, true);
    }

    render() {
        if (__DEV__) {
            this.game.debug.body(this.player);
            this.enemyBullets.forEach((b) => {
                this.game.debug.body(b);
            }, this);
        }

        this.world.bringToTop(this.explosions);
    }

    update() {
        this.gearTexts.forEach(function (entry, i) {
            entry.alpha = 1;
            if (i !== this.player.currentGear - 1) {
                entry.alpha = 0.6;
            }
        }, this);

        this.game.physics.arcade.overlap(this.bullets, this.enemy, handleEnemyHit, () => {
            this.audioHit.play();

            this.score += config.speeds.scoreMultipliers[this.player.currentGear - 1];
            this.scoreText.text = this.scoreString + this.score;

            let explosion = this.enemy.explosions.getFirstExists(false);
            explosion.scale.setTo(1, 1);
            explosion.animations.add('blueExplosion1');

            explosion.reset(
                this.enemy.body.x + (Math.floor(Math.random() * this.enemy.width) + 1),
                this.enemy.body.y + (Math.floor(Math.random() * this.enemy.height) + 1)
            );
            explosion.play('blueExplosion1', 30, false, true);
        }, this);

        this.game.physics.arcade.overlap(this.enemyBullets, this.player, handlePlayerHit, () => {
            this.livesText.text = this.livesString + (this.player.lives - 1);

            if (this.player.game.time.now > this.player.hitCooldown) {
                this.audioPlayerHit.play();

                let explosion = this.player.explosions.getFirstExists(false);
                explosion.animations.add('blueExplosion1');

                explosion.reset(
                    this.player.body.x,
                    this.player.body.y
                );
                explosion.play('blueExplosion1', 30, false, true);
            }
        }, this);

        this.game.physics.arcade.overlap(this.enemy, this.player, handleEnemyPlayerCollision, null, this);
    }
}
