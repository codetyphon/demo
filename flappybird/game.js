width = 375;
height = 500;
var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var player;//游戏主角
var cursors;//控制键
var score = 0;
var scoreText;
var time = 0;
var moveup;
function preload() {
    this.load.image('fire', 'images/fire.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.image('ground', 'images/ground.png');
    this.load.image('bg', 'images/background.png');
    this.load.image('pipe', 'images/pipe.png');
    this.load.spritesheet('bird',
        'images/bird.png',
        { frameWidth: 92, frameHeight: 64 }
    );
}

function create() {

    this.input.on('pointerdown', function () {
        moveup = true;
    }, this);
    // this.add.image(0, 0, 'bg');
    this.bg = this.add.tileSprite(0, -60, 768, 892, 'bg');
    this.bg.setOrigin(0)
    this.bg.scale = 0.6;
    this.ground = this.add.tileSprite(0, 460, 1000, 100, 'ground');
    this.ground.setOrigin(0)
    this.ground.scale = 0.5;
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    gameoverText = this.add.text(screenCenterX, screenCenterY, '', { fontSize: '64px', fill: '#000', boundsAlignH: "center", boundsAlignV: "middle" }).setOrigin(0.5);


    player = this.physics.add.sprite(100, 100, 'bird');


    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'stop',
        frames: [{ key: 'bird', frame: 0 }],
        frameRate: 20,
    });

    player.scale = 0.5;

    this.ground.physicsType = Phaser.SPRITE;
    this.physics.add.collider(player, this.ground);

    player.setVelocity(10);

    player.setBounce(0.3);
    player.setCollideWorldBounds(true);

    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    this.bombs = this.physics.add.group();
    this.physics.add.collider(player, this.bombs, hit, null, this);
    function hit(player, pipe) {
        player.setTint(0xff0000);
        player.setVelocity(800);
        player.anims.play('stop');
        this.gameOver = true;
        // setTimeout(() => {
        //     this.physics.pause();
        // },800);
    }
}
function update() {

    if (!this.gameOver) {
        player.x = 100;
        this.bg.tilePositionX += 0.5;
        this.ground.tilePositionX += 1;

        score += 1;
        scoreText.setText(`${score} km`);

        if (cursors.left.isDown) {
            player.setVelocityX(Phaser.Math.Between(-500, -20));

        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
        }
        else if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-160);
            player.anims.play('fly');
            setTimeout(() => {
                player.anims.play('stop');
            }, 800);
        } else {

        }

        if (moveup) {
            player.setVelocityY(-160);
            player.anims.play('fly', true);
            moveup = false
        }

        time += 1;
        if (time > 30) {
            var bomb = this.bombs.create(Phaser.Math.Between(500, 600), 16, 'bomb');
            bomb.setBounce(0.3);
            bomb.scale = Phaser.Math.Between(0.2, 1.5);
            bomb.body.setGravityY(Phaser.Math.Between(0, 10));
            // bomb.setCollideWorldBounds(true);
            bomb.setVelocityX(Phaser.Math.Between(-900, -200));
            bomb.setVelocityY(Phaser.Math.Between(0, 500));
            time = 0;
            // 
            var particles = this.add.particles('fire');
            var emitter = particles.createEmitter({
                speed: 10,
                scale: { start: 0.3, end: 0.1 },
                blendMode: 'ADD'
            });
            emitter.startFollow(bomb);
        }
    } else {
        gameoverText.setText(`GAME OVER`);
        
        // if (moveup) {
        //     gameOver = false;
        //     score = 0;
        //     moveup = false
        //     window.location.reload()
        // };
    }

}