var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

//holderji
var livesHolder = document.getElementById("lives");
var pointsHolder = document.getElementById("score");
var timeHolder = document.getElementById("time");
var keyboard = false;

//zvok
var brokenGlassAudio = new Audio("sound/broken_glass.wav");
var shatteredGlassAudio = new Audio("sound/shattered_glass.wav");
var backgroundMusic = new Audio("sound/background.mp3");
backgroundMusic.loop = true;

//doda vse potrebne css atribute canvasu
function initCanvas(){
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.width = 600;
    canvas.height = 800;
    canvas.style.marginLeft = "-300px";
    canvas.style.marginTop = "-400px";
    canvas.style.zIndex = "2";
    canvas.style.background = "rgba(255, 255, 255, 0.2)";
    canvas.style.border = "10px solid #000000";
}

//PRIKAZ NAJBOLJSIH REZULTATOV
var vsiRez = window.localStorage.getItem("rezultat") == null ? [] : JSON.parse(window.localStorage.getItem("rezultat"));
vsiRez.sort(function(a, b){return b.score - a.score});
var resaultsHtml = "Date:  &nbsp; &nbsp; Time:  &nbsp; &nbsp; Score: <br>";
function prepeareText(){
    var dolzina = vsiRez.length > 5 ? 5 : vsiRez.length;
    for(let i = 0; i < dolzina; i++){
        resaultsHtml += vsiRez[i].date + " &nbsp; &nbsp; " + vsiRez[i].time + " &nbsp; &nbsp; " + vsiRez[i].score + "<br>";
    }

    resaultsHtml.replace("undefined", "");
}

function addReasult(date, time, score){
    vsiRez.push({    
    date: date,
    time: time,
    score: score});


    window.localStorage.setItem("rezultat", JSON.stringify(vsiRez));

    vsiRez = JSON.parse(window.localStorage.getItem("rezultat"));
    vsiRez.sort(function(a, b){return b.score - a.score});
    resaultsHtml = "";
    console.log(vsiRez)
    prepeareText(); 
}

function showBestResaults(){
    play = false;
    Swal.fire({
        icon: "info",
        title: "Top 5 resaults",
        html: resaultsHtml,
        confirmButtonText: "Okay",  
        toast: true
    });
}

//prikaze navodila za igranje igre
function instructions(){
    play = false;
    Swal.fire({
        icon: "info",
        title: "Instructions",
        html: "To move the paddle press ← → (rihgt or left arrow key) or move the mouse.<br> To start a game press SPACE, to pause a game press P.",
        confirmButtonText: "Okay",  
        toast: true
      })
}

//end screen ob konanih livelih
async function endScreen(){
    play = false;
    const { value: accept } = await Swal.fire({
        icon: "success",
        title: "Game over",
        html: "Congratulations you have successfully<br>completed all levels in the game!",
        confirmButtonText:
          "Okay",
        toast: true
      });
      
    if (accept) {
        location.reload();
    }
}

//end screen ob izgubi vseh zivljenj
async function endGame(){
    play = false;
    var score1 = score != 1 ? score + " points " : score + " point "
    var minues1 = minuteI != 1 ? minuteI + " minues and ": minuteI + " minue and ";
    var seconds1 = sekundeI != 1 ? sekundeI + " seconds.": sekundeI + " second."

    const { value: accept } = await Swal.fire({
        icon: "error",
        title: "Game over",
        html: "You lost all your lives!<br>You scored " + score1 + minues1 + seconds1,
        confirmButtonText:
          "Okay",
        toast: true
      });
      
    if (accept) {
        location.reload();
    }
}

//dimenzije kanvassa
var WIDTH = 600;
var HEIGHT = 800;
//x in y koordinata in x in y smer zogice 
var x = 150;
var y = 150;
var r = 10;
var dx = 2;
var dy = 5;
//sirina, visina x in y koordinata ploscka
var paddleh = 10;
var paddlew = 75;
var paddlex = (WIDTH / 2) - (paddlew / 2);
var paddley = HEIGHT - 50;
// falgi ali je pritisnjena kaka tipka
var rightDown = false;
var leftDown = false;
// spremenljivke za birckse
var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;
//življenja
var lives = 3;
//točke
var score = 0;
//spremenljivke timer
var sekunde = 0;
var sekundeI;
var minuteI;
var intTimer;
var izpisTimer;
//deklaracija spremenljivke za igranje
var play = false;
var finishedLevel = false;
var level = 1;
var nBrics = 1;


function initBall(){
    x = (WIDTH / 2);
    y = 200;
    dx = Math.random() * 5 - 2;
    drawBall(x, y);
}

function initPaddle(){
    paddlex = (WIDTH / 2) - (paddlew / 2);
    paddley = HEIGHT - 50;
    drawPaddle(paddlex, paddley);
}

//timer
function timer(){
    if(play == true){
        sekunde++;

        sekundeI = ((sekundeI = Math.floor(sekunde / 60) % 60) > 9) ? sekundeI : "0"+sekundeI;
        minuteI = ((minuteI = Math.floor(sekunde / 3600) % 3600) > 9) ? minuteI : "0"+minuteI;
        izpisTimer = minuteI + ":" + sekundeI;

        timeHolder.innerHTML = izpisTimer;
    } else {
        sekunde=0;
        izpisTimer = "00:00";
        timeHolder.innerHTML = izpisTimer;
    }
}

function drawLives(lives){
    if(lives == 1)
        livesHolder.innerHTML = lives + " life remaining";
    else
        livesHolder.innerHTML = lives + " lives remaining";
}

function drawScore(score){
    if(score == 1)
        pointsHolder.innerHTML = score + " point";
    else
        pointsHolder.innerHTML = score + " points";
}

//funkcija za inicializacijo opek
function initbricks(rows, cols, padding) {
    NROWS = rows;
    NCOLS = cols;
    PADDING = padding;
    BRICKWIDTH = (WIDTH/NCOLS) - (PADDING + (PADDING / NCOLS)) ;
    BRICKHEIGHT = 15;
    bricks = new Array(NROWS);
    for (i=0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      for (j=0; j < NCOLS; j++) {
            bricks[i][j] = new Brick(j * (BRICKWIDTH + PADDING) + PADDING, i * (BRICKHEIGHT + PADDING) + PADDING, (NROWS - i));
      }
    }
  }



function Brick(x, y, stregnth) {
    this.x = x;
    this.y = y;
    this.stregnth = stregnth;
    this.draw = function () {
        ctx.fillStyle = "rgba(63, 127, 191, " + ((this.stregnth * 0.2) + 0.2) + ")";
        ctx.fillRect(this.x, this.y, BRICKWIDTH, BRICKHEIGHT);
    }
  }

//brise canvas
function clearCanvas(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//funkcija za inicializaciijo event listenerja za tipkovnico
function initKeyboard(){
    window.addEventListener("keydown", function(evt){
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37)
            leftDown = true;
    });

    window.addEventListener("keyup", function(evt){
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) 
            leftDown = false;
    });
}

//zazene igro ob pritisku na space on pritisku esc pa pavza
function startStopGame(){
    document.addEventListener("keypress", function(evt){
        backgroundMusic.play();
        if (evt.keyCode == 32 && lives > 0){
            play = true;
        }
        else if (evt.keyCode == 80 || evt.keyCode == 112){
            play = !play;
        }
    });
}

//funkcija za inicializaciijo event listenerja za misko
function initMouse(){
    window.addEventListener("mousemove", function(evt){
        if(evt.clientX > canvas.offsetLeft && evt.clientX < canvas.offsetLeft + WIDTH && evt.clientY > canvas.offsetTop && evt.clientY < canvas.offsetTop + HEIGHT)
            paddlex = (evt.clientX - (paddlew / 2) - canvas.offsetLeft);
    });
}


//narise zogo glede na x in y koordinate
function drawBall(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

//narise paddle
function drawPaddle(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, paddlew, paddleh);
    ctx.closePath();
}
  

function drawBrics(bricks){
    //risanje opek
    //riši opeke
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j].stregnth > 0) {
                bricks[i][j].draw();
            }
        }
    }
}

function checkForFinishedLevel(bricks){
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j].stregnth != 0) {
                return false;
            }
        }
    }
    return true;
}

//glavna metoda za risanje in updejtanje vsega
function draw() {
    if(play && finishedLevel == false && level < 3){
        finishedLevel = checkForFinishedLevel(bricks);
        clearCanvas();
        drawBall(x, y);
        drawPaddle(paddlex, paddley);
        drawBrics(bricks);
        drawScore(score);
        drawLives(lives);
        timer();

        //premik ploščice levo in desno 
        if (rightDown){
            if((paddlex + paddlew) < WIDTH){
                paddlex += 3;
            }else{
                paddlex = WIDTH-paddlew;
            }       
        } 
        else if (leftDown){
            if(paddlex > 0){
                paddlex -= 3;
            }else{
                paddlex = 0;
            }
        }


        //preverjanje odbojev od stranic 
        if (x + dx > WIDTH - r || x + dx < 0 + r)
            dx = -dx;
        if (y + dy < 0 + r)
            dy = -dy;
        else if (y + dy > paddley - r) {
            // razlicen odboj kroglice od ploscka
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
                dy = -dy;
            }
            else if (y + dy > HEIGHT - r){
                if(lives > 1){
                    lives--;
                    dy = -dy;
                } else { //ob izgubi vseh zivljen
                    lives --;
                    if(lives < 0)
                        lives = 0;
                    drawLives(lives);
                    play = false;

                    var date = new Date();
                    addReasult(date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear(), timeHolder.innerHTML, score);
                    endGame();
                }
            }
        }

        //razbivanje opek
        for (var i = 0; i < NROWS; i++) {
            for (var j = 0; j < NCOLS; j++) {
                if(bricks[i][j].stregnth > 0){
                    //odboj od zgoraj in odpsodaj
                    if (x  >= bricks[i][j].x && x <= (bricks[i][j].x + BRICKWIDTH) && (y + r) >= bricks[i][j].y && y <= (bricks[i][j].y + BRICKHEIGHT)) {
                        dy = -dy; 
                        score ++;
                        
                        //preveri kateri zvok mora zaigrati
                        if(bricks[i][j].stregnth == 1){
                            brokenGlassAudio.play();
                        } else {
                            shatteredGlassAudio.play();
                        }

                        bricks[i][j].stregnth --;
                    }
                    //odboj od desne
                    if ((y + r) <= (bricks[i][j].y + BRICKHEIGHT) && y >= bricks[i][j].y && (x + r) >= bricks[i][j].x && x <= bricks[i][j].x) {
                        dy = -dy; 
                        score ++;

                        //preveri kateri zvok mora zaigrati
                        if(bricks[i][j].stregnth == 1){
                            brokenGlassAudio.play();
                    
                        } else {
                            shatteredGlassAudio.play();
                        }

                        bricks[i][j].stregnth --;
                    }
                    //odboj od leve
                    if ((y + r) <= (bricks[i][j].y + BRICKHEIGHT) && y >= bricks[i][j].y && (x - r) <= (bricks[i][j].x + BRICKWIDTH) && x >= (bricks[i][j].x + BRICKWIDTH)) {
                        dy = -dy; 
                        score ++;

                        //preveri kateri zvok mora zaigrati
                        if(bricks[i][j].stregnth == 1){
                            brokenGlassAudio.play();
                        } else {
                            shatteredGlassAudio.play();
                        }

                        bricks[i][j].stregnth --;
                    }
                }
            }
        }

        //spreminajanje smeri zoge
        x += dx;
        y += dy;


    } else if (play && level > 3){ // end screen ob konacni igri
        play = false;
        endScreen();
    } else if(play && finishedLevel == true){ // postavi nov livel
        play = false;
        nBrics += ((2*level) + 1);
        initCanvas();
        initbricks(nBrics, 10, 4);
        drawBrics(bricks);
        initBall();
        initPaddle();
        level++;
        finishedLevel = false;
    }
}


function start() {
    return setInterval(draw, 1000/60); //klic funkcije draw vsakih 10 ms; http://www.w3schools.com/jsref/met_win_setinterval.asp
}

prepeareText();
initMouse();
initKeyboard();
instructions();
initCanvas();
initbricks(nBrics, 3, 4);
drawBrics(bricks);
initBall();
initPaddle();
startStopGame();
start();