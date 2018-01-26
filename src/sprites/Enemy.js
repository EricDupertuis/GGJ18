import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, enemyBullets }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5);
        this.enableBody = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;

        this.bullets = enemyBullets;
        this.bulletTime = 0;
        this.fired = false;
        this.alive = true;
    }

    update() {
        if (this.alive) {
            if (this.game.time.now > this.bulletTime) {
                this.bulletTime = this.game.time.now + 500;
                this.fired = true;

                let bullet = this.bullets.getFirstExists(false);

                if (bullet) {
                    bullet.reset(this.x, this.y);
                    bullet.body.velocity.y = 500;
                }
            }
        }
    }
}
