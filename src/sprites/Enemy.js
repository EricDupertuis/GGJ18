import Phaser from 'phaser';
import PatternsLibrary from './PatternsLibrary';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, enemyBullets, health = 50 }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5);
        this.enableBody = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;

        this.bullets = enemyBullets;
        this.bulletTime = 0;
        this.fired = false;
        this.alive = true;

        this.patternsLibrary = new PatternsLibrary(this, this.game, this.bullets);
        this.pattern = this.patternsLibrary.getPatternAtRandom();

        this.health = health;

        this.state = 'left';
        this.lastStateChange = 0;
    }

    update() {
        if (this.alive) {
            // TODO: Maybe move based on remaining life ?
            let targetX, targetY;
            if (this.state === 'left') {
                if (this.game.time.now > this.lastStateChange + 5 * 1000) {
                    this.state = 'right';
                    this.lastStateChange = this.game.time.now;
                }
                targetX = config.worldBoundX * 0.2;
                targetY = this.body.y;
            } else if (this.state === 'right') {
                if (this.game.time.now > this.lastStateChange + 5 * 1000) {
                    this.state = 'left';
                    this.lastStateChange = this.game.time.now;
                }
                targetX = config.worldBoundX * 0.8;
                targetY = this.body.y;
            }

            let dx = targetX - this.body.x;
            let dy = targetY - this.body.y;

            // Physical model. Increase kp to make the enemy move faster and
            // increase kd to reduce the oscillations
            let kp = 20;
            let kd = 5;

            this.body.acceleration.x = kp * dx - kd * this.body.velocity.x;
            this.body.acceleration.y = kp * dy - kd * this.body.velocity.y;

            // Shoot da gunz
            this.pattern.update();
        }
    }
}
