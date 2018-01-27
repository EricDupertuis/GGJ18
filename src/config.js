export default {
    gameWidth: 1280,
    gameHeight: 980,
    worldBoundX: 880,
    worldBoundY: 980,
    localStorageName: 'ggj18',
    speeds: {
        numberOfGears: 5,
        maxSpeed: 500,
        minSpeed: 100,
        startGear: 5
    },
    gamepadConfig: {

    },
    playerConfig: {

    },
    enemyConfig: {
        health: 1000
    },
    colorPalette: {
        softBlue: '#7593C9',
        grey: '#3A3A3A',
        neonOrange: '#F84526',
        avocadoGreen: '#19B226',
        neonGreen: '#26FF5E',
        darkGreen: '#264C47'
    },
    ui: {
        textConfig: {
            font: '32px Risque',
            fill: '#fff',
        },
        texts: {
            scoreText: {
                text: 'Score: ',
                y: 10
            },
            livesText: {
                text: 'Lives: ',
                y: 65
            },
            gearsText: {
                text: 'Current gear: ',
                y: 120,
                spacing: 35
            }
        }
    },
    patterns: {
        selected: 4,
        randomBulletEmitter: {
            rate: 50,
            bulletSpeed: 500,

            /* Bullet speed half time in second.
             * e.g. 2 means that the bullet will half its speed in 2 seconds. */
            bulletSpeedHalftime: 0.8,
            bulletSpeedMin: 75
        },
        sinePattern: {
            bulletSpeed: 200,
            frequency: 0.4,
            interval: 25
        },
        starPattern: {
            bulletSpeed: 400,
            interval: 100,
            angles: [-60, -40, -20, 0, 20, 40, 60]
        },
        crossAimPattern: {
            bulletSpeed: 1000,
            interval: 80,
            cooldown: 0.5
        },
        crossEmitter: {
            bulletSpeed: 300,
            interval: 30,
            rotationSpeed: 150,
            N: 4 /* number of beams */
        }
    }
};
