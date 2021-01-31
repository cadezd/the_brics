//setup canvasa
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
let WIDTH = window.innerWidth + 10;
let HEIGHT = window.innerHeight + 10;
let WIDTHGAME = 700;
let HEIGHTGAME = 500;
canvas.width = WIDTH;
canvas.height = HEIGHT;
let background = setImage("images/background.png");
let brickWidth = 70;
let brickHeight = 70;
let paused = true;

//audio
let audio = new Audio("../sound/laser1.mp3");
audio.loop = false;

//TOPBAR (SCORE, ŽIVLJENJA  in MENI NASTAVITEV)

//SCORE
let score = 0;

function updateScore(val){
    let scoreHolder = document.getElementById("score");
    scoreHolder.innerHTML = "SCORE: " + val;
}

//ŽIVLJENJA
let lives = 3;
let livesHolder = document.getElementById("lives");
let livesImg = document.createElement("img");
let livesImg1 = document.createElement("img");
let livesImg2 = document.createElement("img");
livesImg.setAttribute("src", "./images/heart.png");
livesImg1.setAttribute("src", "./images/heart.png");
livesImg2.setAttribute("src", "./images/heart.png");
function updateLives(lives){
    livesHolder.textContent = "";

    switch(lives){
        case 3:
            livesHolder.appendChild(livesImg);
            livesHolder.appendChild(livesImg1);
            livesHolder.appendChild(livesImg2);
            break;
        case 2:
            livesHolder.appendChild(livesImg);
            livesHolder.appendChild(livesImg1);
            break;
        case 1:
            livesHolder.appendChild(livesImg);
            break;
        default:
            break;
    }
    
}



//MENENI NASTAVITEV 
let settings = document.getElementById("settings");
let cog = document.getElementById("cog");
let close = document.getElementsByClassName("close")[0];
cog.onclick = function() {
    settings.style.display = "block";
    setPause();
}
close.onclick = function() {
    settings.style.display = "none";
    continueGame();
}

//igralni način (miška ali tipkovnica)
let mouseButton = document.getElementById("mouse");
let keyboardButton = document.getElementById("keyboard");
let paddleSpeedInput = document.getElementsByClassName("slider")[0];
let ballSpeedInput = document.getElementsByClassName("slider")[1];

//dobi value od slajderja
let ballSpeed = 3;
let paddleSpeed = 3;
function updateValPaddle(val){
    document.getElementById("paddlespeed").innerHTML = "Paddle speed: " + val
    paddleSpeed = val;
}

function updateValBall(val){
    document.getElementById("ballspeed").innerHTML = "Ball speed: " + val
    ballSpeed = val;
}


//razlicni game modi
let mode = 1;
function setMouse() {
        keyboardButton.style.background = "#ffffff";
        mouseButton.style.background = "#562bbb";
        mode = 0;
    }
function setKeyboard() {
        mouseButton.style.background = "#ffffff";
        keyboardButton.style.background = "#562bbb";
        mode = 1;
}
function setPause(){
    paused = true;
}
function continueGame(){
    paused = false;
}
setKeyboard(); // default playmode

//BOTTOM BAR (ČAS)
let sekunde = 1;
let sekundeI;
let minuteI;
let intTimer;
let izpisTimer;
let timeHolder = document.getElementById("time");

function timer(){
    sekunde ++;

    sekundeI = ((sekundeI = Math.floor(sekunde / 60) % 60) > 9) ? sekundeI : "0"+sekundeI;
    minuteI = ((minuteI = Math.floor(sekunde / 3600) % 3600) > 9) ? minuteI : "0"+minuteI;

    izpisTimer = minuteI + ":" + sekundeI;
    
    timeHolder.innerHTML= izpisTimer;
}

//PRIKAZ NAJBOLJSIH REZULTATOV
let list = document.getElementById("list");
let bestResaults = document.getElementById("bestresaults");
let close1 = document.getElementsByClassName("close")[1];
list.onclick = function(){
    bestResaults.style.display = "block";
}
close1.onclick = function() {
    bestResaults.style.display = "none";
    continueGame();
}

let resaults = document.getElementById("resaults");
let vsiRez = window.localStorage.getItem("rezultat") == null ? [] : JSON.parse(window.localStorage.getItem("rezultat"));
vsiRez.sort(function(a, b){return b.score - a.score});
function prikazRezultata(i){
    let resault = document.createElement("div");
    resault.className = "resault"
    let s =  document.createElement("h1");
    let t =  document.createElement("h1");
    let d =  document.createElement("h1");
    let rezIzpis;

    rezIzpis = vsiRez[i];
    s.innerHTML = rezIzpis.score;
    t.innerHTML = rezIzpis.time;
    d.innerHTML = rezIzpis.date;

    resault.appendChild(d);
    resault.appendChild(s);
    resault.appendChild(t);
    resaults.appendChild(resault);
}
function prikaziRezultate(){
    for(let i = 0; i < vsiRez.length; i++){
        prikazRezultata(i);
    }
}
function zapisiRezultat(date, time, score){

    vsiRez.push({    
    date: date,
    time: time,
    score: score});


    window.localStorage.setItem("rezultat", JSON.stringify(vsiRez));
   
    console.log(window.localStorage);

    vsiRez = JSON.parse(window.localStorage.getItem("rezultat"));
    vsiRez.sort(function(a, b){return b.score - a.score});
    resaults.innerHTML = "";
    prikaziRezultate();
    
}

prikaziRezultate();


//slika za ozdaje
function setImage(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}

//pobrise canvas
function clear() {
    c.beginPath();
    c.fillStyle = "#add9ff"
    c.fillRect(0, 0, WIDTH, HEIGHT);
    c.drawImage(background, 0, 0, WIDTH, HEIGHT);
    c.closePath();
}

//narise meje kje se zogica odbiva
function drawBorders(sx, sy, ex, ey) {
    c.strokeStyle = "#000000";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(ex, ey);
    c.stroke();
    c.closePath();
}

function drawAllBorders(){
    c.font = "20px Arial";
    c.fillStyle = "#000000";
    c.fillText("Press SPACE to start the game", (WIDTH / 2) - 125, HEIGHTGAME - 310); 
    drawBorders((WIDTH / 2) - (WIDTHGAME / 2), 200, (WIDTH / 2) + (WIDTHGAME / 2), 200);
    drawBorders((WIDTH / 2) + (WIDTHGAME / 2), 200 + HEIGHTGAME, (WIDTH / 2) + (WIDTHGAME / 2), 200);
    drawBorders((WIDTH / 2) - (WIDTHGAME / 2), 200 + HEIGHTGAME, (WIDTH / 2) + (WIDTHGAME / 2), 200 + HEIGHTGAME);
    drawBorders((WIDTH / 2) - (WIDTHGAME / 2), 200 + HEIGHTGAME, (WIDTH / 2) - (WIDTHGAME / 2), 200);
}

//BRIKSI (VESOLJCI)

let alien1 = setImage("images/alien1.png");
let alien2 = setImage("images/alien2.png");
let alien3 = setImage("images/alien3.png");
let alien4 = setImage("images/alien4.png");

class Brics {
    constructor(width, height, table = [
        []
    ]) {
        this.widht = width;
        this.height = height;
        this.table = table;
    }

    update() {
        let x;
        let y;
        let value;
        for (let i = 0; i < this.table.length; i++) {
            for (let j = 0; j < this.table[i].length; j++) {

                // risanje
                if (this.table[i][j].value > 0) {
                    x = (this.height / this.table[i].length) * j + (WIDTH / 2) - (WIDTHGAME / 2) + 20;
                    y = (this.widht / this.table.length) * i + 220;
                    value = this.table[i][j].value;
                    this.table[i][j].x = x;
                    this.table[i][j].y = y;
                    this.draw(x, y, value);
                }
            }
        }
    }

    draw(x, y, value) {
        c.beginPath();
        if(value == 1){
            c.drawImage(alien1, x, y, 70, 63);
        } else if (value == 2){
            c.drawImage(alien2, x, y, 70, 63);
        } else if(value == 3) {
            c.drawImage(alien3, x, y, 70, 63);
        } else if (value == 4){
            c.drawImage(alien4, x, y, 70, 63);
        }
        c.closePath();
    }
}
//ZOGA
class Ball {
    constructor(x, y, dx, dy, color, color2, radious) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.color2 = color2;
        this.radious = radious;
        this.offset = 15;
        this.points = [{x: this.x, y:this.y},]
    }

    draw() { // risanje zoge
        c.beginPath();
        c.globalAlpha = 1;
        c.strokeStyle = this.color;
        c.lineWidth = 5;
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radious, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
        c.closePath();

        //risanje sledi zoge
        for(let i = 0; i < this.points.length; i++){
            if(i < 10){
                c.beginPath();
                c.strokeStyle = this.color;
                c.lineWidth = 5;
                c.fillStyle = this.color;
                c.arc(this.points[i].x, this.points[i].y, this.radious, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();
                c.closePath();
            } else {
                break;
            }
        }

    }

    reset(){
        this.x = WIDTH / 2 - this.radious;
        this.y = HEIGHT / 2 + 150;
    }

    bordersCheck() { // preverjanje mej
        if ((this.x + this.radious) >= (WIDTH / 2) + (WIDTHGAME / 2)) { // desno
            this.dx = -this.dx;
        }
        if ((this.x - this.offset) <= (WIDTH / 2) - (WIDTHGAME / 2)) { // levo
            this.dx = -this.dx;
        }
        if ((this.y + this.radious) >= (HEIGHTGAME + 200)) { // odspodaj
            this.dy = -this.dy;
        }
        if ((this.y - this.offset) <= 200) { // odzgoraj
            this.dy = -this.dy;
        }
    }

    paddleCheck(px, py, pw, ph) { //TODO: popravi da se bo zogica odbijala tudi od strani

        // odboj od ploscka od zgoraj
        if (this.x >= px && this.x <= (px + pw) && (this.y + this.offset) >= py && this.y <= (py + ph)) {
            this.dy = -this.dy;
            this.dx = 8 * ((this.x-(px+pw/2))/pw)
        }

        // desni odboj
        if ((this.y + this.radious) <= (py + ph) && this.y >= py && (this.x + this.radious) >= px && this.x <= px) {
            this.dx = -this.dx;
        }

        //levi odboj
        if ((this.y + this.radious) <= (py + ph) && this.y >= py && (this.x - this.radious) <= (px + pw) && this.x >= (px + pw)) {
            this.dx = -this.dx;
        }
    }

    update(px, py, pw, ph) {
        //shranjevanje sledi
        this.points.push({x: this.x, y:this.y}); 

        if(this.points.length > 12){
            this.points.shift();
        }

        //odboj zoge
        this.bordersCheck();

        //odboj od ploscka
        this.paddleCheck(px, py, pw, ph)

        // spremeni koordinate zogi
        this.x += this.dx;
        this.y += this.dy;

        //narise zogo
        this.draw();
    }

    setDx(dx){
        if(this.dx < 0) this.dx = -dx;
        else this.dx = dx;
    }

    setDy(dy){
        if(this.dy < 0) this.dy = -dy;
        else this.dy = dy;
    }

    getDx(){
        return this.dx;
    }

    getDy(){
        return this.dy;
    }
}

//ODBOJNI PLOSCEK
class Paddle {
    constructor(x, y, widht, height, color, dx) {
        this.x = x;
        this.y = y;
        this.widht = widht;
        this.height = height;
        this.color = color
        this.dx = dx; // hitros pemikanja
        this.rightDown = false;
        this.leftDown = false;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.widht, this.height);
        c.closePath();
    }

    changePositionMouse() {
        let mousePosX;
        let mousePosY;

        window.addEventListener("mousemove", () => {
            mousePosX = event.clientX;
            mousePosY = event.clientY;

            //preveri ali je nacin igranja z misko
            if (mode === 0) {
                //preveri da je miska v obmocju igrice
                if ((this.x + this.widht) <= (WIDTH / 2) + (WIDTHGAME / 2) && (mousePosX + this.widht / 2) <= (WIDTH / 2) + (WIDTHGAME / 2) && this.x >= (WIDTH / 2) - (WIDTHGAME / 2) && (mousePosX - this.widht / 2) >= (WIDTH / 2) - (WIDTHGAME / 2) && mousePosY <= (200 + HEIGHTGAME) && mousePosY >= 200) {
                    this.x = mousePosX - (this.widht / 2);
                }
                // ce gre miska izven obmocja igrice na desni strani paddle ohrani na tem mestu
                if ((this.x + this.widht) >= (WIDTH - 212) && mousePosX <= (WIDTH - 212)) {
                    this.x = (WIDTH - 220) - this.widht;
                }
                // ce gre miska izven obmocja igrice na levi strani paddle ohrani na tem mestu
                if ((this.x) <= 200 && mousePosX >= (200)) {
                    this.x = 205;
                }
            }
        });
    }

    onKeyDown(evt) { // preveri ali so arrow key pritisnjeni 
        if (evt.keyCode == 39)
            this.rightDown = true;
        else if (evt.keyCode == 37)
            this.leftDown = true;
    }

    onKeyUp(evt) { // preveri ali so arrow key spusceni 
        if (evt.keyCode == 39)
            this.rightDown = false;
        else if (evt.keyCode == 37)
            this.leftDown = false;
    }

    changePositionKeyboard() { // spreminaj pozicijo paddla s tipkovnico
        window.addEventListener("keydown", () => {
            this.onKeyDown(event);
        });
        window.addEventListener("keyup", () => {
            this.onKeyUp(event);
        });

        // ce je desni arrow kex pritisnjen premakni paddle v desno
        // preverja tudi da je paddle v okvirju
        if (this.rightDown === true && (this.x + this.widht + 2) <= (WIDTH / 2) + (WIDTHGAME / 2)) {
            this.x += this.dx
        }
        // ce je levi arrow kex pritisnjen premakni paddle v levo
        // preverja tudi da je paddle v okvirju
        if (this.leftDown === true && (this.x - 2) >= (WIDTH / 2) - (WIDTHGAME / 2)) {
            this.x += -this.dx
        }
    }

    update() {
        // preveri kaksen je nacin igranja (z misko ali tipkovnico)
        switch (mode) {
            case 0:
                this.changePositionMouse();
                break;
            case 1:
                this.changePositionKeyboard();
                break;
            default:
                break;
        }

        this.draw();
    }

    reset(){
        this.x = (WIDTH / 2) - (this.widht / 2 );
    }
}

function preveriKoncaniLVL(arr){
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
            if(arr[i][j].value != 0){
                return false;
            }
        }
    }
    return true;
}



let lvl1 = [
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
];
let lvl2 = [
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
];
let lvl3 = [
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
];
let lvl4 = [
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }],
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }],
];
let lvl5 = [
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 1 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 1 }],
];
let lvl6 = [
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }],
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 2 }],
];
let lvl7 = [
    [{ x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }],
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }],
];
let lvl8 = [
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
];
let lvl9 = [
    [{ x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }],
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }],
    [{ x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }, { x: 0, y: 0, value: 1 }],
];
let lvl10 = [
    [{ x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }],
    [{ x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }, { x: 0, y: 0, value: 4 }],
    [{ x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }, { x: 0, y: 0, value: 3 }, { x: 0, y: 0, value: 2 }],
];

let x = 0;
let levels = [lvl1, lvl2, lvl3, lvl4, lvl5, lvl6, lvl7, lvl8, lvl9, lvl10];

let date = new Date();

//GAME LOOP

window.addEventListener("keydown", (evt) =>{
    if(evt.keyCode == 32  ){
        paused = false;
    }
});   

window.addEventListener("load", () => {
    let ball = new Ball(WIDTH / 2, HEIGHT / 2 + 150, ballSpeed, ballSpeed, "#8c1915", "#ffffff", 8);
    let paddle = new Paddle(WIDTH / 2 - 50, HEIGHT - 300, 100, 8, "#000000", paddleSpeed);
    let brics = new Brics(HEIGHTGAME / 2, WIDTHGAME, levels[x], );
    setInterval(()=> {
        clear();
        drawAllBorders();
        updateLives(lives); 

        if(!paused){
            timer(); 
            updateScore(score);
            paddle.update();
            ball.update(paddle.x, paddle.y, paddle.widht, paddle.height);
            brics.update();

                // razbivanje opek
                for (let i = 0; i < brics.table.length; i++) {
                    for (let j = 0; j < brics.table[i].length; j++) {
                        if (brics.table[i][j].value > 0) {
                            //odzgoraj in odspodaj
                            if (ball.x >= brics.table[i][j].x && ball.x <= (brics.table[i][j].x + brickWidth) && (ball.y + ball.radious) >= brics.table[i][j].y && ball.y <= (brics.table[i][j].y + brickHeight)) {
                                brics.table[i][j].value--;
                                score++;
                                ball.dy = -ball.dy;
                                audio.play();
                            }
                            // desno
                            if ((ball.y + ball.radious) <= (brics.table[i][j].y + brickHeight) && ball.y >= brics.table[i][j].y && (ball.x + ball.radious) >= brics.table[i][j].x && ball.x <= brics.table[i][j].x) {
                                brics.table[i][j].value--;
                                score++;
                                ball.dx = -ball.dx;
                                audio.play();
                            }
                            //od leve
                            if ((ball.y + ball.radious) <= (brics.table[i][j].y + brickHeight) && ball.y >= brics.table[i][j].y && (ball.x - ball.radious) <= (brics.table[i][j].x + brickWidth) && ball.x >= (brics.table[i][j].x + brickWidth)) {
                                brics.table[i][j].value--;
                                score++;
                                ball.dx = -ball.dx;
                                audio.play();
                            }
                        }
                    }
                }

                //preveri za koncani lvl
                if(preveriKoncaniLVL(brics.table)){
                    x++;
                    paused = true;
                    brics.table = levels[x];
                    paddle.reset();
                    ball.reset();
                    ball.points = [];
                } else if( x == 9){
                    location.reload();
                }

                // ce pade izven okvirja
                if(ball.y + ball.radious >= (200 + HEIGHTGAME)){
                    paused = true;
                    paddle.reset();
                    ball.reset();
                    ball.points = [];
                    lives--;
                }

                if(lives == 0 && paused == true){
                    zapisiRezultat(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),izpisTimer, score);
                }
        } else {
            paddle.draw();
            ball.draw();
            brics.update();
        }
    }, 1000 / 60);
});