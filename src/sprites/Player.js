import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, bullets }) {
        super(game, x, y, asset, bullets);

        this.bullets = bullets;
        this.anchor.setTo(0.5);
        this.enableBody = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.isAlive = true;
        this.moving = false;
        this.maxSpeed = 500;
        this.bulletTime = 0;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.mainButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.secondButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    }

    update() {
        this.bullets.forEachAlive(function (bullet) {
            if (bullet.bulletUpdate) {
                bullet.bulletUpdate(bullet);
            }
        }, this);

        if (this.isAlive) {
            //  Reset the player, then check for movement keys
            this.body.velocity.setTo(0, 0);
            this.moving = false;

            if (this.cursors.left.isDown) {
                this.body.velocity.x = -this.maxSpeed;
            } else if (this.cursors.right.isDown) {
                this.moving = true;
                this.body.velocity.x = this.maxSpeed;
            }

            if (this.cursors.up.isDown) {
                this.body.velocity.y = -this.maxSpeed;
            } else if (this.cursors.down.isDown) {
                this.body.velocity.y = this.maxSpeed;
            }

            if (this.mainButton.isDown) {
                if (this.game.time.now > this.bulletTime) {
                    this.fireBullet(null, 0, 'bullet');
                    this.bulletTime = this.game.time.now + 100;
                }
            }
        }
    }

    fireBullet(update, angle = 0, animation = null) {
        angle = angle * Math.PI / 180;

        let bullet = this.bullets.getFirstExists(false);

        if (bullet) {
            bullet.scale.setTo(1, 1);

            //  And fire it
            bullet.reset(this.x, this.y + 8);
            bullet.body.velocity.y -= Math.cos(angle) * 500;
            bullet.body.velocity.x += Math.sin(angle) * 100;
            bullet.fireTime = this.game.time.now;
            bullet.bulletUpdate = update;
        }
    }
}
