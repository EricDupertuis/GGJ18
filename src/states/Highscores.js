import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.cursors = null;
        this.textConfig = {
            font: '25px Arial',
            fill: '#ecf0f1',
            align: 'center',
            boundsAlignH: 'center'
        };

        this.entires = [];
        this.selectedMenu = 0;
    }

    preload() {
        this.load.image('menu-background', 'assets/images/menu.jpg');
        this.load.json('highscores', config.server.baseUrl + config.server.getPath);
    }

    create() {
        this.goKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'menu-background');
        this.stage.backgroundColor = '#000000';
        this.background.alpha = 0.6;
        let highscoreJSON = this.cache.getJSON('highscores');

        let text = highscoreJSON.map((s) => s.name + ' - ' + s.score).join('\n\n');
        text = this.game.add.text(0, 0,
            text,
            this.textConfig
        );

        const width = 300;
        text.setTextBounds(this.game.world.centerX - width, 80, 2 * width, 400);
    }

    update() {
        if (this.goKey.justDown) {
            this.game.state.start('Menu');
        }
    }
}
