import Phaser from 'phaser';
import PatternsLibrary from './PatternsLibrary';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor({ game, player, x, y, asset, enemyBullets, explosions, audio }) {
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
        this.audio = audio;
        this.tauntCooldown = 0;

        this.patterns = new PatternsLibrary(this, this.game, this.bullets, this.player, this.audio);

        this.health = config.enemyConfig.health;
        this.state = config.enemyConfig.startingState;
    }

    changeState(state) {
        this.state = state;
        this.lastStateChange = this.game.time.now;
    }

    update() {
        const movementPeriod = config.enemyConfig.phase2.movementPeriod;

        if (this.lastStateChange === undefined) {
            this.lastStateChange = this.game.time.now;
        }

        if (this.alive) {
            // TODO: Maybe move based on remaining life ?
            let targetX, targetY;

            if (this.state === 'enter') {
                const duration = config.enemyConfig.enterDuration * 1000;

                if (this.game.time.now > this.lastStateChange + duration) {
                    this.changeState('taunt');
                }

                targetY = 100 * ((this.game.time.now - this.lastStateChange) / duration);
            } else if (this.state === 'taunt') {
                const tauntDuration = config.enemyConfig.tauntDuration;
                if (this.game.time.now > this.lastStateChange + tauntDuration * 1000) {
                    this.changeState('left');
                }
                this.body.velocity.y = 0;
                this.body.velocity.x = 0;
            } else if (this.state === 'left') {
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

            if (this.state !== 'taunt') {
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
}
