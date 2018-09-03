//-------------------------ENEMIES-------------------------
//Set all enemies variables
var Enemy = function(y) {
    this.initialPosition = -100;
    this.maxX = 600;
    this.y = y;
    this.minSpeed = 60;
    this.maxSpeed = 260;
    this.speed = this.calculateSpeed();
    this.sprite = 'images/enemy-bug.png';

    this.getInitialPosition();
};

//Set enemies initial coordinates
Enemy.prototype.getInitialPosition = function() {
    this.x = this.initialPosition;
    this.y = this.y;
}

//Calculate and return random speed
Enemy.prototype.calculateSpeed = function(minSpeed, maxSpeed) {
    let randomSpeed;

    if (game.score >= 500) {
        this.minSpeed = 150;
        this.maxSpeed = 350;
    }
    if (game.score >= 1000) {
        this.minSpeed = 350;
        this.maxSpeed = 550;
    }
    if (game.score >= 1500) {
        this.minSpeed = 450;
        this.maxSpeed = 700;
    }

    randomSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    randomSpeed = Math.floor(randomSpeed);
    randomSpeed < 100 ? randomSpeed = 100 : randomSpeed;
    return this.speed = randomSpeed;
}

// Updates the enemy 's position, multiplying the dt parameter by * enemy 's movement ensures the game runs at the same speed for all computers.
//dt is a number which is a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x >= this.maxX) {
        this.x = this.initialPosition;
        this.speed = this.calculateSpeed();
    }
};

//Draw enemies on screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//-------------------------PLAYER-------------------------
//Set all player variables
let Player = function() {
    this.minX = 0;
    this.maxX = 400;
    this.minY = 0;
    this.maxY = 400;
    this.isInWater = false;
    this.sprite = 'images/char-boy.png';

    this.getInitialPosition();
}

// Set player initial coordinates
Player.prototype.getInitialPosition = function() {
    this.x = 200;
    this.y = 400;
    this.isInWater;
}

// Update player position and call both getInitialPosition() and checkCollisions() methods
Player.prototype.update = function() {
    if (this.y <= -10) {
        this.getInitialPosition();
        !this.isInWater && game.updateScore();
    }
    this.checkCollisions();
}

// Draw player on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Check for collisions by checking if enemy and player are on same coordinates
Player.prototype.checkCollisions = function() {
    allEnemies.forEach(enemy => {
            let playerOnFirstRow = player.y - 14 === enemy.y;
            let playerOnSecondRow = player.y - 16 === enemy.y;
            let playerOnThirdRow = player.y - 20 === enemy.y;
            let enemyOnPlayer = enemy.x >= player.x - 40 && enemy.x <= player.x + 40;

            let collision = playerOnFirstRow || playerOnSecondRow || playerOnThirdRow) && enemyOnPlayer;

        collision && this.getInitialPosition(); collision && game.score >= 50 && (game.score -= 50); collision && (game.collisions += 1);

        if (game.collisions === 3) {
            allLives.splice(0, 1);
            game.collisions = 0;
        }
        collision && allLives.length === 0 && (game.isOver = true) && game.over();
    });
}

// Set allowed keys and their values to move player on canvas
Player.prototype.handleInput = function(allowedKeys) {
    switch (allowedKeys) {
        case 'left':
            this.x <= 10 ? this.x = 0 : this.x -= 100;
            break;
        case 'up':
            this.y <= 50 ? this.y = -10 : this.y -= 80;
            break;
        case 'right':
            this.x <= 400 ? this.x = 400 : this.x += 100;
            break;
        case 'down':
            this.y <= 400 ? this.y = 400 : this.y += 80;
            break;
    }
}

// Listen for key-presses through the handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left'
        65: 'left'
        38: 'up'
        87: 'up'
        39: 'right',
        68: 'right',
        40: 'down',
        83: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//-------------------------GAME-------------------------
// Track player score
let Game = function() {
    this.score = 0;
    this.highScore = 0;
    this.collisions = 0;
    this.isOver = false;
}

// Update the score and when game is won
Game.prototype.updateScore = function() {
    !player.isInWater && (this.score += 100);

    if (!player.isInWater && this.score >= 2000 && allLives.length > 0) {
        this.playerWon = true;
        this.won();
    }
}

// Set game over and call both setHistoryGame() and sortScore() functions
Game.prototype.over = function() {
    let button = document.getElementById('button');

    button.style.visibility = 'visible';
    this.isOver === true && gameRecords.push(this.score);

    this.setHistoryGame();
    this.sortScore();
}

// Set game won, push game score to gameRecord and call both setHistoryGame() and sortScore() functions
Game.prototype.won = function() {
    let button = document.getElementById('button');

    button.style.visibility = 'visible';

    this.playerWon === true && gameRecords.push(this.score);
    this.setHistoryGame();
    this.sortScore();

    this.gameFinished = true;
}

// Sort game records and return higher score
Game.prototype.sortScore = function() {
    gameRecords.length && gameRecords.sort(function(a, b) {
        return (b - a);
    });
    this.higherScore += gameRecords[0];
}

// Set game score in local storage
Game.prototype.setHistoryGame = function() {
    localStorage.setItem('record', JSON.stringify(gameRecords));
}

// Game reset of all values
Game.prototype.resetGame = function() {
    game = new Game();
    enemy1 = new Enemy(60);
    enemy2 = new Enemy(144);
    enemy3 = new Enemy(226);
    allEnemies = [enemy1, enemy2, enemy3];
    player.getInitialPosition();

    life1 = new Lives(370);
    life2 = new Lives(410);
    life3 = new Lives(450);
    allLives = [life1, life2, life3];
}

// Create the text for game score on canvas
Game.prototype.render = function() {
    ctx.font = '36px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${this.score}`, 20, 563);
    ctx.textBaseline = 'middle';

    if (this.isOver === true) {
        ctx.fillStyle = '#eec643';
        ctx.fillRect(0, 125, 505, 260);
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(`Game Over!`, 100, 220);
        ctx.fillText(`Score: ${this.score}`, 100, 260);
        ctx.fillText(`Higher Score: ${this.higherScore}`, 100, 300);
    }

    if (this.gameFinished === true) {
        ctx.fillStyle = '#f02d3a';
        ctx.fillRect(0, 125, 505, 260);
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`You Won!`, 100, 220);
        ctx.fillText(`Score: ${this.score}`, 100, 260);
        ctx.fillText(`Higher Score: ${this.higherScore}`, 100, 300);
    }
}

//-------------------------LIVES-------------------------
// Set all required Lives variables to create player lives
let Lives = function(x) {
    this.sprite = 'images/Heart.png';
    this.x = x;
    this.y = 530;
    this.width = 40;
    this.height = 60;
}

// Draw lives hearts on canvas
Lives.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

//-------------------------COLLECTABLES-------------------------
// Set all variables required for collectibles and call the getRandomGem() function
let Gem = function() {
    this.x;
    this.y;
    this.width = 60;
    this.height = 80;
    this.getImages = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Star.png',
        'images/Key.png'
    ];
    this.gemValues = [100, 150, 200, 300, 350];
    this.randomGem;
    this.sprite;

    this.getRandomGem();
}


// Generate random values to create collectables
Gem.prototype.getRandomGem = function() {
    let randomX,
        randomY,
        possibleX = [20, 120, 220, 320, 420],
        possibleY = [120, 200, 280];

    this.randomGem = Math.floor(Math.random() * this.getImages.length);
    randomX = Math.floor(Math.random() * possibleX.length);
    randomY = Math.floor(Math.random() * possibleY.length);

    this.x = possibleX[randomX];
    this.y = possibleY[randomY];
    this.gemValues = this.gemValues[this.randomGem];
    this.sprite = this.gemImages[this.randomGem];
}

// Instantiate collectables
Gem.generateGem = function() {
    let gem = new Gem();

    allGems.push(gem);
    Gem.getGems();
}

// Set random delay to show and remove collectables
Gem.getGems = function() {
    let delay = Math.floor(Math.random() * (10000 - 6000) + 6000);

    setTimeout(Gem.removeGem, 6000);
    setTimeout(Gem.generateGem, delay);
}

// Remove collectables
Gem.removeGem = function() {
    allGems.splice(0, 1);
}

// Clear the timeout function
Gem.clearTimeOuts = function() {
    clearTimeout(Gem.generateGem);
    clearTimeout(Gem.removeGem);
}

// Draw collectables
Gem.prototype.render = function() {
    if (gem.score >= 300) {
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(`${this.gemValues}`, this.x + 12, this.y + 90);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }
}

// Check when player is on same coordinates as collectable and update score
Gem.prototype.update = function() {
    let gemPicked = (allGems.length && player.y + 40 === allGems[0].y) && (allGems.length && player.x + 20 === allGems[0].x);

    if (gemPicked) {
        (game.score < 300) ? game.score = game.score: (game.score += this.gemValues);
        allGems.splice(0, 1);
    }
}

//-------------------------INSTANCES-------------------------
// Enemy and Player instances
let gameRecords = JSON.parse(localStorage.getItem('record')) || [];
let game = new Game();
let enemy1 = new Enemy(60);
let enemy2 = new Enemy(144);
let enemy3 = new Enemy(226);
let allEnemies = [enemy1, enemy2, enemy3];
let player = new Player();
let life1 = new Lives(370);
let life2 = new Lives(410);
let life3 = new Lives(450);
let allLives = [enemy1, enemy2, enemy3];
let allGems = [];
Gem.generateGem();