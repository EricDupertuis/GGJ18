import Phaser from 'phaser';
import PatternsLibrary from './PatternsLibrary';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor({ game, player, x, y, asset, enemyBullets, explosions }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5);
        this.enableBody = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;

        this.bullets = enemyBullets;
        this.bulletTime = 0;
        this.fired = false;
        this.alive = true;
        this.player = player;
        this.explosions = explosions;

        this.patterns = new PatternsLibrary(this, this.game, this.bullets, this.player);

        this.health = config.enemyConfig.health;

        this.state = config.enemyConfig.startingState;
    }

    update() {
        const movementPeriod = config.enemyConfig.phase2.movementPeriod;

        if (this.lastStateChange === undefined) {
            this.lastStateChange = this.game.time.now;
        }

        if (this.alive) {
            // TODO: Maybe move based on remaining life ?
            let targetX, targetY;

            if (this.state === 'left') {
                if (this.game.time.now > this.lastStateChange + movementPeriod * 1000) {
                    this.state = 'right';
                    this.lastStateChange = this.game.time.now;
                }
                targetX = config.worldBoundX * 0.2;
                targetY = this.body.y;
            } else if (this.state === 'right') {
                if (this.game.time.now > this.lastStateChange + movementPeriod * 1000) {
                    this.state = 'left';
                    this.lastStateChange = this.game.time.now;
                }
                targetX = config.worldBoundX * 0.8;
                targetY = this.body.y;
            }

            let dx = targetX - this.body.x;
            let dy = targetY - this.body.y;

            const kp = config.enemyConfig.kp;
            const kd = config.enemyConfig.kd;

            this.body.acceleration.x = kp * dx - kd * this.body.velocity.x;
            this.body.acceleration.y = kp * dy - kd * this.body.velocity.y;

            // Shoot da gunz with da correct patternz
            let pattern;
            if (this.state === 'left') {
                const name = config.enemyConfig.phase2.leftPattern;
                pattern = this.patterns.getPattern(name);
            } else if (this.state === 'right') {
                const name = config.enemyConfig.phase2.rightPattern;
                pattern = this.patterns.getPattern(name);
            }

            if (pattern !== undefined) {
                pattern.update();
            }
            this.patterns.update();
        }
    }
}
