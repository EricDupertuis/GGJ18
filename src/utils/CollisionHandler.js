export const handleEnemyHit = (enemy, bullet) => {
    --enemy.health;

    if (enemy.health <= 0) {
        enemy.kill();
    }

    bullet.kill();
};

export const handlePlayerHit = (player, enemyBullet) => {
    if (player.game.time.now < player.hitCooldown) {
        return;
    }

    --player.lives;

    if (player.lives <= 0) {
        player.kill();
    }

    player.hitCooldown = player.game.time.now + 1000;
    enemyBullet.kill();
};

export const handleEnemyPlayerCollision = (enemy, player) => {
    enemy.kill();
    player.kill();
};
