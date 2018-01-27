import BulletPattern from './bulletPattern';

export default class PatternsLibrary {
  constructor(game) {
      this.bulletPatterns = [];
      this.game = game;
      this.loadPatterns();
  }

  loadPatterns() {
      let bulletPatternsArray = [];

      /*Waves pattern*/
      let patternName = 'waves';
      let salveTime = 100;
      let frequency = 0.4;
      let amplitude = 200;
      let xVelocity = -Math.sin((this.game.time.now / 1000) * 2 * Math.PI * frequency) * amplitude;
      let yVelocity = Math.abs(Math.cos((this.game.time.now / 1000) * 2 * Math.PI * frequency) * amplitude);

      bulletPatternsArray.push(new BulletPattern(patternName, salveTime, frequency, amplitude, xVelocity, yVelocity ));

      /*Straight line pattern*/
      patternName = 'straightLine';
      salveTime = 100;
      frequency = 0.4;
      amplitude = 400;
      xVelocity = 0;
      yVelocity = 250;

      bulletPatternsArray.push(new BulletPattern(patternName, salveTime, frequency, amplitude, xVelocity, yVelocity ));

      this.bulletPatterns = bulletPatternsArray;
  }

  updatePatterns(){
      let nowTime = this.game.time.now
      this.bulletPatterns.forEach(function(bulletPattern){
          if (bulletPattern.name == 'waves'){
              bulletPattern.xVelocity = -Math.sin((nowTime / 1000) * 2 * Math.PI * bulletPattern.frequency) * bulletPattern.amplitude;
              bulletPattern.yVelocity = Math.abs(Math.cos((nowTime / 1000) * 2 * Math.PI * bulletPattern.frequency) * bulletPattern.amplitude);
          }
      });

  }

  getPatternAtRandom(){
      let randomNumber = Math.round(Math.random());

      return this.bulletPatterns[randomNumber];
  }
}
