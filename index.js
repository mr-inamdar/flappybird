//board
let board;
let boardwidth = window.innerWidth;
let boardheight = window.innerHeight;
let context;

//bird
let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth/8;
let birdY = boardheight/2;
// let birdImg;
let birdImgs = [];
let birdImgIndex = 0;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}

//pipes
let pipeArray = [];
let pipewidth = 64;
let pipeheight = 515;
let pipeX = boardwidth;
let pipeY = 0;     

let topPipeImage;
let bottomPipeImage;

// Game Pysics
let velocityX = -2;
let velocityY = 0;
let gravity = 2;

let gameOver = false;
let score = 0;

let wingSound = new Audio("./asets/sfx_wing.wav");
let hitSound = new Audio("./asets/sfx_hit.wav");
let bgSound = new Audio("./asets/bgm_mario.mp3");
bgSound.loop = true;

let restartImg;
let restartImgwidth = 175;
let restartImgHeight = 175;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    
    context = board.getContext("2d"); // use for drawing on the board
 
    //draw flappy bird
    //  context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // birdImg = new Image();
    // birdImg.src = "./asets/flappybird.png";
    // birdImg.onload = function(){
    //     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    // }

    for(let i = 0; i < 4; i++){
        let birdImg = new Image();
        birdImg.src = `./asets/flappybird${i}.png`;
        birdImgs.push(birdImg);
    }

    restartImg = new Image();
    //restartImg.src = "C:\\Users\\HP\\Desktop\\WebDev\\DinoGame\\restart.png";
    restartImg.src = "./asets/restart.png";

    topPipeImage = new Image();
    topPipeImage.src = "./asets/toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./asets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);//har 1.5sec k bad call hunga ye function
    setInterval(animatedBird, 100);

    document.addEventListener('keydown', moveBird1);
    board.addEventListener("touchstart", moveBird2);
    document.addEventListener("click", moveBird2);
    window.addEventListener("resize", () => {
        boardwidth = window.innerWidth;
        boardheight = window.innerHeight;
        board.width = boardwidth;
        board.height = boardheight;
    });
}

function update() { 
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // bird 
    if(velocityY <= 0){
        velocityY += gravity;
    }
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    //context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    context.drawImage(birdImgs[birdImgIndex], bird.x, bird.y, bird.width, bird.height);
    // birdImgIndex++;
    // if(birdImgIndex >= 4){
    //     birdImgIndex = 0;
    // }
    if(bird.y > board.height){
        gameOver = true; 
    }
    //pipe
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipewidth){
            score += 0.5;
            pipe.passed =true;
        }
        if(detectCollision(bird, pipe)){
            hitSound.play();
            gameOver = true;
        }
    }
    //clar the pipe
    while(pipeArray.length> 0 &&  pipeArray[0].x < -pipewidth){
        pipeArray.shift(); // remove first element from the array

    }

    // Score    
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    
        context.drawImage(restartImg,( boardwidth - restartImgwidth)/2, (boardheight - restartImgHeight)/2, restartImgwidth, restartImgHeight);

        bgSound.pause();
        bgSound.currentTime = 0;
    }
} 
function animatedBird(){
    birdImgIndex++;
    if(birdImgIndex >= 4){
        birdImgIndex = 0;
    }
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY- pipeheight/4 - Math.random()*(pipeheight/2);

    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImage,
        x : pipeX,
        y : randomPipeY,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(topPipe);
    
    let bottomPipe = {
        img : bottomPipeImage,
        x : pipeX,
        y : randomPipeY +pipeheight +openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(bottomPipe);

}

function moveBird1(e){
    if(e.code == "Space" || e.code == "ArrowUp"){
        bgSound.play();
        wingSound.play();
        //jump
        velocityY = -17;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}
function moveBird2(){
    if(bgSound.paused){
        bgSound.play();
    }
    
    wingSound.play();
    velocityY = -17;

    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }

} 

function detectCollision(a, b){
    return (a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y);
}
