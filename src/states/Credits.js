import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init(params = {hasHighScore: false, score: 0}) {
        this.credits = 'A Game By :\nAntoine Albertelli\nAnthony Chappuis\nEric Dupertuis';
        this.goKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.hasHighScore = params.hasHighScore;
        this.score = params.score;
    }

    preload() {
    }

    create() {
        let textConfig = config.ui.textConfig;

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'credits');
        this.creditText = this.game.add.text(
            this.game.world.centerX + 450,
            this.game.world.centerY - 200,
            this.credits,
            textConfig
        );

        this.gameOverText = this.game.add.text(
            200,
            this.game.world.centerY - 230,
            'Game Over',
            {
                font: '64px Space Mono',
                fill: '#fff'
            }
        );

        this.creditText.setTextBounds(0, 0, 100, 400);
        this.creditText.anchor.set(0.5);

        if (this.hasHighScore) {
            this.highScoreText = this.game.add.text(
                200,
                this.game.world.centerY,
                'Your score: ' + this.score,
                {
                    font: '64px Space Mono',
                    fill: '#fff'
                }
            );
        }

        this.background.alpha = 0.4;
    }

    update() {
        if (this.goKey.isDown) {
            this.game.state.start('Menu');
        }
    }
}
