export const handleEnemyHit = (bullet, enemy) => {
    bullet.kill();
    enemy.kill();
}