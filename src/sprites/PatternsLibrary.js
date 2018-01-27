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
        console.log('update');
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

        console.log(this.game);
        bulletPatternsArray.push(new SinePattern(this.game, this.bullets, this.owner, frequency, amplitude, interval));

        this.bulletPatterns = bulletPatternsArray;
    }

    updatePatterns() {
        this.bulletPatterns.forEach(function (bulletPattern) {
            bulletPattern.update();
        });
    }

    getPatternAtRandom() {
        return this.bulletPatterns[0];
    }
}
