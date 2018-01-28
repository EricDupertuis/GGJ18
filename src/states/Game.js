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

    createGroundSprite(x, y = 0) {
        let s = this.groundGroup.getFirstExists(false);
        if (s === undefined) {
            return;
        }

        s.reset(x, y - 128);

        // Normal tiles
        const normal = [0, 7, 11, 13, 18, 19, 22];
        // All other tiles
        let special = [];
        for (let i = 0; i < 25; i++) {
            if (normal.indexOf(i) < 0) {
                special.push(i);
            }
        }

        if (Math.random() < config.background.specialTileProbability) {
            s.frame = special[Math.floor(Math.random() * special.length)];
        } else {
            s.frame = normal[Math.floor(Math.random() * normal.length)];
        }

        s.body.velocity.y = config.background.scrollSpeed;
    }

    createBackGround() {
        let groundGroup = this.game.add.group();
        this.groundGroup = this.backgroundGroup.add(groundGroup);

        this.groundGroup.enableBody = true;
        this.groundGroup.createMultiple(200, 'background');
        this.groundGroup.setAll('anchor.x', 0);
        this.groundGroup.setAll('anchor.y', 0);
        this.groundGroup.setAll('scale.x', config.background.scale);
        this.groundGroup.setAll('scale.y', config.background.scale);
        this.groundGroup.setAll('alpha', config.background.alpha);

        this.groundGroup.forEach((s) => {
            s.events.onKilled.add((s) => {
                this.createGroundSprite(s.body.x, -1);
            }, this);
        }, this);

        let w = this.groundGroup.getFirstExists(false).width;

        for (let y = -2 * w; y <= config.worldBoundY; y += w) {
            for (let x = 0; x < config.worldBoundX; x += w) {
                this.createGroundSprite(x, y);
            }
        }

        this.cloudGroup = this.backgroundGroup.add(this.game.add.group());
        this.cloudGroup.enableBody = true;
        this.cloudGroup.createMultiple(10, 'cloud');
        this.cloudGroup.setAll('scale.x', config.background.clouds.scale.x);
        this.cloudGroup.setAll('scale.y', config.background.clouds.scale.y);
        this.cloudGroup.setAll('anchor.x', 0.5);
        this.cloudGroup.setAll('anchor.y', 1);
        this.cloudGroup.setAll('alpha', config.background.clouds.alpha);
        this.cloudGroup.setAll('outOfBoundsKill', true);
        this.cloudGroup.setAll('checkWorldBounds', true);
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, config.worldBoundX, config.worldBoundY);
        this.stage.backgroundColor = '#000000';

        this.backgroundGroup = this.game.add.group();
        this.createBackGround();

        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.createMultiple(300, 'redBullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        let enemyBullets = this.game.add.group();
        this.enemyBullets = this.backgroundGroup.add(enemyBullets);
        this.enemyBullets.enableBody = true;
        this.enemyBullets.createMultiple(300, 'gearBullet');
        this.enemyBullets.setAll('scale.x', 0.25);
        this.enemyBullets.setAll('scale.y', 0.25);
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
        if (this.previousTime === undefined) {
            this.previousTime = this.game.time.now;
        }

        /* Poisson distribution so that it is random but still interesting to
         * see. */
        let dt = (this.game.time.now - this.previousTime) / 1000;
        this.previousTime = this.game.time.now;

        let p = Math.random();
        if (p < (1 - Math.exp(-config.background.clouds.rate * dt))) {
            console.log('cloud');
            let cloud = this.cloudGroup.getFirstExists(false);

            if (cloud) {
                let x = Math.random() * config.worldBoundX;
                cloud.reset(x, 0);
                cloud.body.velocity.y = config.background.clouds.speed;

                let sx = Math.random() + 0.5;
                let sy = Math.random() + 0.5;

                cloud.scale.setTo(sx, sy);
            }
        }

        this.groundGroup.forEachAlive((s) => {
            if (s.body.y > config.worldBoundY + 128) {
                s.kill();
            }
        });

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

            // Delete all bullets
            this.fadeExit = this.game.add.tween(this.enemyBullets)
                .to({ alpha: 0 }, 200, 'Linear', true)
                .onComplete.add(() => {
                    this.enemyBullets.forEach((b) => { b.kill(); });
                    this.enemyBullets.alpha = 1;
                });
        }, this);

        this.game.physics.arcade.overlap(this.enemy, this.player, handleEnemyPlayerCollision, null, this);
    }
}
