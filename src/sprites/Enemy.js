import Phaser from 'phaser';
import PatternsLibrary from './PatternsLibrary';

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
    }

    update() {
        if (this.alive) {
            this.pattern.update();
        }
    }
}
