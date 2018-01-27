import Phaser from 'phaser'
import BulletPattern from './bulletPattern';

export default class PatternsLibrary {
  constructor(sprite) {
      this.bulletPatterns = [];
      this.loadPatterns();
  }

  loadPatterns() {
      let bulletPatternsArray = [];

      /*Waves pattern*/
      let patternName = 'waves';
      let frequency = 0.4;
      let amplitude = 200;
      let xVelocity = 250;
      let yVelocity = 250;
      //let xVelocity = -Math.sin((Phaser.sprite.game.time.now / 1000) * 2 * Math.PI * frequency) * amplitude;
      //let yVelocity = Math.abs(Math.cos((Phaser.sprite.game.time.now / 1000) * 2 * Math.PI * frequency) * amplitude);

      bulletPatternsArray.push(new BulletPattern(patternName, frequency, amplitude, xVelocity, yVelocity ));

      /*Straight line pattern*/
      patternName = 'straightLine';
      frequency = 0.4;
      amplitude = 200;
      xVelocity = 0;
      yVelocity = 250;

      bulletPatternsArray.push(new BulletPattern(patternName, frequency, amplitude, xVelocity, yVelocity ));

      this.bulletPatterns = bulletPatternsArray;
  }

  getPatternAtRandom(){
      let randomNumber = Math.round(Math.random())

      return this.bulletPatterns[randomNumber];
  }
}
