import config from '../config';

class SinePattern {
    constructor(game, bullets, shooter) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.bulletTime = 0;
    }

    update() {
        const f = config.patterns.sinePattern.frequency;
        const speed = config.patterns.sinePattern.bulletSpeed;
        const interval = config.patterns.sinePattern.interval;

        let nowTime = this.game.time.now;
        let vx = -Math.sin((nowTime / 1000) * 2 * Math.PI * f) * speed;
        let vy = Math.abs(Math.cos((nowTime / 1000) * 2 * Math.PI * f) * speed);

        if (this.game.time.now > this.bulletTime) {
            this.bulletTime = this.game.time.now + (1000 * interval / speed);

            let bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.shooter.x, this.shooter.y);
                bullet.body.velocity.x = vx;
                bullet.body.velocity.y = vy;
            }
        }
    }
}

class StraightPattern {
    constructor(game, bullets, shooter, speed, interval, angle) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.speed = speed;
        this.interval = 1000 * interval / this.speed;
        this.angle = angle * Math.PI / 180;
    }
    update() {
        if (this.bulletTime === undefined) {
            this.bulletTime = this.game.time.now + this.interval;
        }

        if (this.game.time.now > this.bulletTime) {
            this.bulletTime = this.game.time.now + (1000 * this.interval / this.speed);
            let bullet = this.bullets.getFirstExists(false);

            let vx = Math.sin(this.angle) * this.speed;
            let vy = Math.cos(this.angle) * this.speed;

            if (bullet) {
                bullet.reset(this.shooter.x, this.shooter.y);
                bullet.body.velocity.x = vx;
                bullet.body.velocity.y = vy;
            }
        }
    }
}

class StarPattern {
    constructor(game, bullets, shooter) {
        this.straightPatterns = [];

        const speed = config.patterns.starPattern.bulletSpeed;
        const interval = config.patterns.starPattern.interval;
        const angles = config.patterns.starPattern.angles;

        angles.forEach(function (angle) {
            this.straightPatterns.push(new StraightPattern(game, bullets, shooter, speed, interval, angle));
        }, this);
    }

    update() {
        this.straightPatterns.forEach(function (pattern) {
            pattern.update();
        });
    }
}

class RandomBulletEmitter {
    constructor(game, bullets, shooter) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.previousTime = 0;
        this.ourBullets = [];
    }

    update() {
        let dt = (this.game.time.now - this.previousTime) / 1000;
        this.previousTime = this.game.time.now;

        /* Poisson distribution so that it is random but still interesting to
         * see. */
        let p = Math.random();
        if (p < (1 - Math.exp(-config.patterns.randomBulletEmitter.rate * dt))) {
            let bullet = this.bullets.getFirstExists(false);

            let angle = (Math.random()) * Math.PI;

            let speed = config.patterns.randomBulletEmitter.bulletSpeed * (0.5 + 0.8 * Math.random());

            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;

            if (bullet) {
                bullet.reset(this.shooter.x, this.shooter.y);
                bullet.body.velocity.x = vx;
                bullet.body.velocity.y = vy;

                /* Store the bullet as part of our group, but free it on death.
                 * This is useful to apply behaviour to bullets (see below). */
                this.ourBullets.push(bullet);
                bullet.events.onKilled.add((b) => {
                    let index = this.ourBullets.indexOf(b);
                    if (index > -1) {
                        this.ourBullets.splice(index, 1);
                    }
                }
                );
            }
        }
    }

    updateBullets() {
        /* Decays the bullet speed */
        this.ourBullets.forEach((b) => {
            let lambda = config.patterns.randomBulletEmitter.bulletSpeedHalftime;
            const dt = 0.016;
            let decay = Math.exp(dt * Math.log(0.5) / lambda);
            b.body.velocity.x *= decay;
            b.body.velocity.y *= decay;

            let vx = b.body.velocity.x;
            let vy = b.body.velocity.y;
            let speed = Math.sqrt(vx * vx + vy * vy);
            if (speed < config.patterns.randomBulletEmitter.bulletSpeedMin) {
                b.body.velocity.x *= config.patterns.randomBulletEmitter.bulletSpeedMin / speed;
                b.body.velocity.y *= config.patterns.randomBulletEmitter.bulletSpeedMin / speed;
            }
        }, this);
    }
}

class CrossAimPattern {
    constructor(game, bullets, shooter, player) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.player = player;

        this.stateChangeTime = 0;

        this.state = 'shooting';
        this.shotsFired = 0;
    }

    update() {
        const interval = config.patterns.crossAimPattern.interval;
        const speed = config.patterns.crossAimPattern.bulletSpeed;
        const cooldown = config.patterns.crossAimPattern.cooldown;
        if (this.bulletTime === undefined) {
            this.bulletTime = this.game.time.now + 1000 * interval / speed;
        }

        if (this.state === 'shooting') {
            if (this.shotsFired >= 4) {
                this.shotsFired = 0;
                this.state = 'cooldown';
                // Parameter: time ?
                this.stateChangeTime = cooldown * 1000 + this.game.time.now;
            }
            if (this.game.time.now > this.bulletTime) {
                if (this.playerX === undefined) {
                    this.playerX = this.player.x;
                    this.playerY = this.player.Y;
                }

                this.bulletTime = this.game.time.now + 1000 * interval / speed;
                this.shotsFired++;

                // Compute a unit vector perpendicular to the enemy - player one
                let dx = this.shooter.y - this.player.y;
                let dy = -this.shooter.x + this.player.x;

                let norm = Math.sqrt(dx * dx + dy * dy);
                dx /= norm;
                dy /= norm;

                for (let i = -2; i <= 2; i++) {
                    let bullet = this.bullets.getFirstExists(false);
                    if (bullet) {
                        const spread = 75;
                        let bulletX = this.shooter.x + i * spread * dx;
                        let bulletY = this.shooter.y + i * spread * dy;

                        let vx = this.player.x - bulletX;
                        let vy = this.player.y - bulletY;

                        vx *= 1.1;

                        let norm = Math.sqrt(vx * vx + vy * vy);
                        vx *= speed / norm;
                        vy *= speed / norm;

                        bullet.reset(bulletX, bulletY);
                        bullet.body.velocity.x = vx;
                        bullet.body.velocity.y = vy;
                    }
                }
            }
        } else if (this.state === 'cooldown') {
            this.playerX = undefined;
            this.playerY = undefined;
            if (this.game.time.now > this.stateChangeTime) {
                this.state = 'shooting';
            }
        }
    }
}

class CrossEmitter {
    constructor(game, bullets, shooter) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.angle = 0;
    }

    update() {
        const rotationSpeed = config.patterns.crossEmitter.rotationSpeed * Math.PI / 180;
        const interval = config.patterns.crossEmitter.interval;
        const speed = config.patterns.crossEmitter.bulletSpeed;
        const N = config.patterns.crossEmitter.N;

        if (this.previousTime === undefined) {
            this.previousTime = this.game.time.now;
        }

        let dt = (this.game.time.now - this.previousTime) / 1000;
        this.previousTime = this.game.time.now;

        this.angle += dt * rotationSpeed;

        if (this.bulletTime === undefined) {
            this.bulletTime = this.game.time.now + 1000 * interval / speed;
        }

        if (this.game.time.now > this.bulletTime) {
            this.bulletTime = this.game.time.now + 1000 * interval / speed;
            for (let i = 0; i < N; i++) {
                let bullet = this.bullets.getFirstExists(false);

                if (bullet) {
                    let angle = this.angle + Math.PI * 2 * (i / N);
                    let vx = Math.cos(angle) * speed;
                    let vy = Math.sin(angle) * speed;
                    bullet.reset(this.shooter.x, this.shooter.y);
                    bullet.body.velocity.x = vx;
                    bullet.body.velocity.y = vy;
                }
            }
        }
    }
}

class PatternCombinator {
    constructor(patterns) {
        this.patterns = patterns;
    }

    update() {
        this.patterns.forEach((b) => {
            b.update();
        }, this);
    }
}

export default class PatternsLibrary {
    constructor(owner, game, bullets, player) {
        this.bulletPatterns = [];
        this.game = game;
        this.bullets = bullets;
        this.owner = owner;
        this.player = player;
        this.loadPatterns();
    }

    loadPatterns() {
        let bulletPatternsArray = [];

        bulletPatternsArray.push(new RandomBulletEmitter(this.game, this.bullets, this.owner));
        bulletPatternsArray.push(new SinePattern(this.game, this.bullets, this.owner));
        bulletPatternsArray.push(new StarPattern(this.game, this.bullets, this.owner));
        bulletPatternsArray.push(new CrossAimPattern(this.game, this.bullets, this.owner, this.player));
        bulletPatternsArray.push(new CrossEmitter(this.game, this.bullets, this.owner));

        let p1 = new CrossAimPattern(this.game, this.bullets, this.owner, this.player);
        let p2 = new CrossEmitter(this.game, this.bullets, this.owner);

        bulletPatternsArray.push(new PatternCombinator([p1, p2]));

        this.bulletPatterns = bulletPatternsArray;
    }

    update() {
        this.bulletPatterns.forEach((b) => {
            if (b.updateBullets !== undefined) {
                b.updateBullets();
            }
        });
    }

    getPatternAtRandom() {
        return this.bulletPatterns[config.patterns.selected];
    }
}
