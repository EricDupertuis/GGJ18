import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, bullets, lives = 5 }) {
        super(game, x, y, asset, bullets);

        this.anchor.setTo(0.5);
        this.enableBody = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;

        this.moving = false;
        this.maxSpeed = config.speeds.maxSpeed;
        this.currentGear = config.speeds.startGear;
        this.shiftCooldown = 0;

        this.bullets = bullets;
        this.bulletTime = 0;
        this.hitCooldown = 0;

        this.alive = true;
        this.lives = lives;

        // TODO remove scaling when we have a proper sprite
        this.scale.setTo(0.5, 0.5);

        this.pad = this.game.input.gamepad.pad1;
        this.game.input.gamepad.start();

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.mainGunButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.shiftUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.shiftDown = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    }

    update() {
        this.bullets.forEachAlive(function (bullet) {
            if (bullet.bulletUpdate) {
                bullet.bulletUpdate(bullet);
            }
        }, this);

        if (this.alive) {
            this.handleControls();
        }

        /* Apply tint if we recently got hit. */
        if (this.game.time.now < this.hitCooldown) {
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }
    }

    fireBullet(update, angle = 0, animation = null) {
        if (this.game.time.now > this.bulletTime) {
            angle = angle * Math.PI / 180;

            let bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.scale.setTo(2, 2);
                bullet.angle = -90;

                bullet.animations.add('redBullet', null, 10, true, true);
                bullet.animations.play('redBullet');

                //  And fire it
                bullet.reset(this.x, this.y + 8);
                bullet.body.velocity.y -= Math.cos(angle) * 500;
                bullet.body.velocity.x += Math.sin(angle) * 100;
                bullet.fireTime = this.game.time.now;
                bullet.bulletUpdate = update;
            }

            this.bulletTime = this.game.time.now + 100;
        }
    }

    handleControls() {
        //  Reset the player, then check for movement keys
        this.body.velocity.setTo(0, 0);
        this.moving = false;

        // use gamepad input if disabled, defautls to cursors otherwise
        if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected) {
            if (this.pad.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)) {
                this.fireBullet(null, 0, 'bullet');
            }

            var rightStickX = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            var rightStickY = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

            if (rightStickX) {
                this.x += rightStickX * 10;
            }

            if (rightStickY) {
                this.y += rightStickY * 10;
            }
        } else {
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

            if (this.mainGunButton.isDown) {
                this.fireBullet(null, 0, 'bullet');
            }

            if (this.shiftUp.justDown) {
                if (this.currentGear < config.speeds.numberOfGears) {
                    this.currentGear++;
                }
            } else if (this.shiftDown.justDown) {
                if (this.currentGear > 1) {
                    this.currentGear--;
                }
            }
        }
    }
}
