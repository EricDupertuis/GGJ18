export default {
    gameWidth: 1280,
    gameHeight: 880,
    worldBoundX: 880,
    worldBoundY: 880,
    localStorageName: 'ggj18',
    showMenu: false,

    gameDuration: 240,
    victoryState: 'Menu',
    defeatState: 'Credits',

    background: {
        scrollSpeed: 150,
        scale: 4,
        alpha: 0.7,
        clouds: {
            rate: 3,
            speed: 300,
            alpha: 0.4,
            scale: {x: 1, y: 2}
        },
        specialTileProbability: 0.15
    },
    speeds: {
        numberOfGears: 3,
        maxSpeed: 500,
        minSpeed: 100,
        scoreMultipliers: [100, 1000, 2000]
    },
    gamepadConfig: {

    },
    playerConfig: {
        lives: 5,
        hitCooldown: 3000,
        shootAngles: [[-10, 0, 10], [-6, 0, 6], [-2, 0, 2]],
        bulletSpeed: 500
    },
    enemyConfig: {
        // Physical model. Increase kp to make the enemy move faster and
        // increase kd to reduce the oscillations
        kp: 50,
        kd: 5,

        startingState: 'enter',

        enterDuration: 3,
        tauntDuration: 3,
        phase2: {
            leftPattern: 'random+sine',
            rightPattern: 'aim+cross',
            movementPeriod: 15
        },
        tauntMessages: [
            'All you bases are belong to us!',
            'Not sure if "1" means you have\none extra life, or if it is\nyour last...',
            'Don\'t look at me, look at the\nroad! That\'s how accidents\nhappen.',
            'Zug-zug!'
        ]
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
        paddingTop: 70,
        paddingLeft: 20,
        textConfig: {
            font: '32px Space Mono',
            fill: '#fff'
        },
        texts: {
            scoreText: {
                text: 'Score: ',
                y: 50
            },
            livesText: {
                text: 'Lives: ',
                y: 105
            },
            gearsText: {
                text: 'Current gear: ',
                y: 160,
                spacing: 35
            },
            timeText: {
                y: 270
            },
            timerText: {
                y: 325
            },
            tauntText: {
                text: '',
                x: 300,
                y: 600
            }
        }
    },
    patterns: {
        selected: 0,
        randomBulletEmitter: {
            rate: 20,
            bulletSpeed: 500,

            /* Bullet speed half time in second.
             * e.g. 2 means that the bullet will half its speed in 2 seconds. */
            bulletSpeedHalftime: 0.5,
            bulletSpeedMin: 60
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
            bulletSpeed: 500,
            interval: 80,
            cooldown: 2
        },
        crossEmitter: {
            bulletSpeed: 200,
            interval: 50,
            rotationSpeed: 150,
            N: 4 /* number of beams */
        }
    }
};
