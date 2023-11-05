
const totalTiles = 900
const rows = 30
const cols = 30
const right = 1
const down = 2
const left = 3
const up = 4
const scoreTxt = document.querySelector('.scoreNum')

let score = 0
let speed = 100
let fruitX, fruitY
let direction = right
let snakeBody = [
    {x:15, y:1},
    {x:15, y:2},
    {x:15, y:3}
]


//=======================================================================

document.addEventListener('touchmove', function (e) {
    e.preventDefault();
})

document.addEventListener('keydown', (e)=>{
    if(e.key == 'ArrowRight' && direction != left && direction != right) direction=right;
    else if(e.key == 'ArrowDown' && direction != up && direction != down) direction=down; 
    else if(e.key == 'ArrowLeft' && direction != right && direction != left) direction=left; 
    else if(e.key == 'ArrowUp' && direction != down && direction != up) direction=up; 
})

let touchStartX, touchStartY, touchEndX, touchEndY;
document.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction != left && direction != right)direction = right;
        else if(deltaX < 0 && direction != right && direction != left) direction=left; 
    } else {
        // Vertical swipe
        if (deltaY > 0 && direction != up && direction != down) direction=down; 
        else if(deltaY < 0 && direction != down && direction != up) direction=up; 
    }

    event.preventDefault();
});

//=======================================================================

function startGame(){
    createBox()
    createSnakeBody()
    randomFruit()
    movingSnake()
}

function createBox(){
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            const tile = document.createElement('div')
            tile.classList.add('tile')
            tile.classList.add(`row-${i}-col-${j}`)
            document.querySelector('.box').appendChild(tile)
        }
    }
}

function createSnakeBody(){
    for (let i = 0; i < snakeBody.length; i++) {
        const x = snakeBody[i].x;
        const y = snakeBody[i].y;
        document.querySelector(`.row-${x}-col-${y}`).classList.add('snake-body')
    }
}



function movingSnake(){
    let tmpX, tmpY;

    switch(direction){
        case up:
            tmpX = snakeBody[snakeBody.length-1].x - 1
            tmpY = snakeBody[snakeBody.length-1].y 
            break
        case down:
            tmpX = snakeBody[snakeBody.length-1].x + 1
            tmpY = snakeBody[snakeBody.length-1].y
            break
        case left:
            tmpX = snakeBody[snakeBody.length-1].x
            tmpY = snakeBody[snakeBody.length-1].y - 1
            break
        case right:
            tmpX = snakeBody[snakeBody.length-1].x
            tmpY = snakeBody[snakeBody.length-1].y + 1
            break
    }
    if(tmpY == 31 || tmpX == 31 || tmpY == 0 || tmpX == 0)gameOverMessage()
    snakeBody.forEach(part =>{
        if(part.x == tmpX && part.y == tmpY)gameOverMessage()
    })
    snakeBody.push({x:tmpX, y:tmpY})

    createSnakeBody()
    sleep(speed).then(()=>{
        movingSnake()
        if(tmpX == fruitX && tmpY == fruitY){
            score++;
            speed -= score/5;
            scoreTxt.innerHTML = score
            document.querySelector('.fruit').classList.remove('fruit')
            randomFruit()
        } else{
            eliminateTail()
        }
    })
}

function eliminateTail(){
    const x = snakeBody[0].x;
    const y = snakeBody[0].y;
    document.querySelector(`.row-${x}-col-${y}`).classList.remove('snake-body')
    snakeBody.shift()
}


function gameOverMessage (){
    alert(`Game Over!! \n Your score : ${score}`)
    location.reload();
}

function randomFruit() {
    let X = Math.floor(Math.random() * rows) + 1;
    let Y = Math.floor(Math.random() * cols) + 1;
    fruitX = X, fruitY = Y
    document.querySelector(`.row-${X}-col-${Y}`).classList.add('fruit')
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


startGame()