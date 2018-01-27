export const handleEnemyHit = (enemy, bullet) => {
    --enemy.health;

    if (enemy.health <= 0) {
        enemy.kill();
    }

    bullet.kill();
};

export const handlePlayerHit = (enemyBullet, player) => {
    enemyBullet.kill();
    player.kill();
};

export const handleEnemyPlayerCollision = (enemy, player) => {
    enemy.kill();
    player.kill();
};
