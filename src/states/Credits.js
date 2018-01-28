import Phaser from 'phaser';

export default class extends Phaser.State {
    init() {
        this.credits = 'Antoine Albertelli\nAnthony Chappuis\nEric Dupertuis';
        this.goKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    preload() {
    }

    create() {
        let textConfig = {
            font: '40px Arial',
            fill: '#ecf0f1',
            align: 'right'
        };

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'credits');
        this.creditText = this.game.add.text(
            this.game.world.centerX + 330,
            this.game.world.centerY,
            this.credits,
            textConfig
        );

        this.creditText.setTextBounds(0, 0, 100, 400);

        this.creditText.anchor.set(0.5);

        this.background.alpha = 0.4;
    }

    update() {
        if (this.goKey.isDown) {
            this.game.state.start('Menu');
        }
    }
}
