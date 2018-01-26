export const handleEnemyHit = (bullet, enemy) => {
    bullet.kill();
    enemy.kill();
};

export const handlePlayerHit = (enemyBullet, player) => {
    enemyBullet.kill();
    player.kill();
};

export const handleEnemyPlayerCollision = (enemy, player) => {
    enemy.kill();
    player.kill();
};
