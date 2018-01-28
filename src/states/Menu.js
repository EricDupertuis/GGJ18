import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    init() {
        this.cursors = null;
        this.textConfig = {
            font: '40px Arial',
            fill: '#ecf0f1',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        };

        this.instructionTextConfig = {
            font: '25px Arial',
            fill: '#ecf0f1',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        };

        this.menuEntries = [];
        this.selectedMenu = 0;
    }

    preload() {
        this.load.image('menu-background', 'assets/images/menu.jpg');
    }

    create() {
        this.goKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'menu-background');
        this.stage.backgroundColor = '#000000';
        this.background.alpha = 0.6;

        this.menuEntries[0] = this.game.add.text(
            this.game.world.centerX + 300,
            300,
            'New Game',
            this.textConfig
        );

        this.menuEntries[1] = this.game.add.text(
            this.game.world.centerX + 300,
            360,
            'Credits',
            this.textConfig
        );

        this.menuEntries[2] = this.game.add.text(
            this.game.world.centerX + 300,
            420,
            'Highscores',
            this.textConfig
        );

        let instructionText = this.game.add.text(
            0, 0,
            config.instructionsText,
            this.instructionTextConfig
        );

        const width = 200;
        instructionText.setTextBounds(this.game.world.centerX - width, 650, 2 * width, 300);

        this.menuEntries.forEach((text) => {
            text.setTextBounds(0, 0, 100, 100);
        }, this);

        this.game.input.onDown.add(this.goFullScreen, this);
    }

    update() {
        if (this.cursors.up.justDown) {
            if (this.selectedMenu > 0) {
                this.selectedMenu -= 1;
            }
        } else if (this.cursors.down.justDown) {
            if (this.selectedMenu < this.menuEntries.length - 1) {
                this.selectedMenu += 1;
            }
        }

        this.menuEntries.forEach((m) => {
            m.alpha = 0.8;
        });
        this.menuEntries[this.selectedMenu].alpha = 1;

        if (this.goKey.justDown) {
            let nextState = ['Game', 'Credits', 'Highscores'];
            this.game.state.start(nextState[this.selectedMenu]);
        }
    }

    goFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen(true);
        }
    }
}
