class SinePattern {
    constructor(game, bullets, shooter, frequency, amplitude, salveInterval) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.frequency = frequency;
        this.salveInterval = salveInterval;
        this.amplitude = amplitude;
        this.bulletTime = 0;
    }

    update() {
        let nowTime = this.game.time.now;
        let vx = -Math.sin((nowTime / 1000) * 2 * Math.PI * this.frequency) * this.amplitude;
        let vy = Math.abs(Math.cos((nowTime / 1000) * 2 * Math.PI * this.frequency) * this.amplitude);

        if (this.game.time.now > this.bulletTime) {
            this.bulletTime = this.game.time.now + this.salveInterval;

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
    constructor(game, bullets, shooter, interval, speed, angle) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.speed = speed;
        this.interval = interval / this.speed;
        this.angle = angle*Math.PI/180
    }
    update() {
        if (this.bulletTime  == undefined) {
            this.bulletTime = this.game.time.now + this.interval;
        }

        if (this.game.time.now > this.bulletTime) {
            this.bulletTime = this.game.time.now + this.interval;
            let bullet = this.bullets.getFirstExists(false);

            let vx = Math.sin(this.angle)*this.speed;
            let vy = Math.cos(this.angle)*this.speed;

            if (bullet) {
                bullet.reset(this.shooter.x, this.shooter.y);
                bullet.body.velocity.x = vx;
                bullet.body.velocity.y = vy;
            }
        }
    }
}

class StarPattern {
    constructor(game, bullets, shooter, interval, speed) {
        this.straightPatterns = []
        this.angles = [-60,-40,-20,0,20,40,60]

        this.angles.forEach(function(angle) {
            this.straightPatterns.push(new StraightPattern(game, bullets, shooter, interval, speed, angle))
        },this);
    }

    update() {
        this.straightPatterns.forEach(function(pattern) {
            pattern.update()
        });
    }
}

class RandomBulletEmitter {
    constructor(game, bullets, shooter, speed, frequency) {
        this.game = game;
        this.bullets = bullets;
        this.shooter = shooter;
        this.frequency = frequency;
        this.speed = speed;
        this.previousTime = 0;
        this.ourBullets = [];

        /* Bullet speed half time in second.
         * e.g. 2 means that the bullet will half its speed in 2 seconds. */
        this.bulletSpeedHalftime = 0.8;

        /* Min bullet speed. */
        this.bulletSpeedMin = 75;
    }

    update() {
        let dt = (this.game.time.now - this.previousTime) / 1000;
        this.previousTime = this.game.time.now;

        /* Poisson distribution so that it is random but still interesting to
         * see. */
        let p = Math.random();
        if (p < (1 - Math.exp(-this.frequency * dt))) {
            let bullet = this.bullets.getFirstExists(false);

            let angle = (Math.random()) * Math.PI;

            let speed  = this.speed * (0.5 + 0.8 * Math.random());

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
                    if (index > -1 ) {
                        this.ourBullets.splice(index, 1);
                    }
                }
                );
            }
        }

        /* Decays the bullet speed */
        this.ourBullets.forEach((b) => {
            let decay = Math.exp(dt * Math.log(0.5) / this.bulletSpeedHalftime);
            b.body.velocity.x *= decay;
            b.body.velocity.y *= decay;

            let vx = b.body.velocity.x;
            let vy = b.body.velocity.y;
            let speed = Math.sqrt(vx*vx + vy*vy);
            if (speed < this.bulletSpeedMin) {
                b.body.velocity.x *= this.bulletSpeedMin / speed;
                b.body.velocity.y *= this.bulletSpeedMin / speed;
            }

        }, this);
    }
}

export default class PatternsLibrary {
    constructor(owner, game, bullets) {
        this.bulletPatterns = [];
        this.game = game;
        this.bullets = bullets;
        this.owner = owner;
        this.loadPatterns();
    }

    loadPatterns() {
        let bulletPatternsArray = [];

        /* Waves pattern */
        let interval = 100;
        let frequency = 0.4;
        let amplitude = 200;

        bulletPatternsArray.push(new RandomBulletEmitter(this.game, this.bullets,
                                                         this.owner,
                                                         500, 50));
        bulletPatternsArray.push(new SinePattern(this.game, this.bullets, this.owner, frequency, amplitude, interval));
        bulletPatternsArray.push(new StraightPattern(this.game, this.bullets, this.owner, 100000, 400,0));
        bulletPatternsArray.push(new StarPattern(this.game, this.bullets, this.owner, 100000, 400));

        this.bulletPatterns = bulletPatternsArray;
    }

    updatePatterns() {
        this.bulletPatterns.forEach(function (bulletPattern) {
            bulletPattern.update();
        });
    }

    getPatternAtRandom() {
        return this.bulletPatterns[2];
    }
}
