// Global State
let start = Date.now();
let lastKeyUpKeyCode = "";
let lastKeyDownKeyCode = "";
let lastKeyUpKey = "";
let lastKeyDownKey = "";
let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')

function initCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight

    // 1. Multiply the canvas's width and height by the devicePixelRatio
    const ratio = window.devicePixelRatio || 1
    canvas.width = width * ratio
    canvas.height = height * ratio

    // 2. Force it to display at the original (logical) size with CSS or style attributes
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    // 3. Scale the context so you can draw on it without considering the ratio.
    ctx.scale(ratio, ratio)

    // TODO remove me.
    const img = new Image();

    img.addEventListener("load", () => {
        ctx.drawImage(img, 200, 200);
    });

    img.src = "assets/Cars/car_black_small_1.png";
}

function initKeyControls() {
    const drawCar = () => {
    console.log(lastKeyUpKey);
    console.log(lastKeyDownKey);

    console.log(lastKeyUpKeyCode);
    console.log(lastKeyDownKeyCode);
    };

    window.onkeydown = function (event) {
        lastKeyDownKeyCode = event.keyCode;
        lastKeyDownKey = event.key;

        drawCar();
    };

    window.onkeyup = function (event) {
        lastKeyUpKeyCode = event.keyCode;
        lastKeyUpKey = event.key;

        drawCar();
    };
}

initCanvas()
initKeyControls()

function renderTimer() {
    let dt = Date.now() - start
    let milliseconds = Math.floor(dt % 1_000);
    let seconds = Math.floor(dt / 1_000);
    let minutes = Math.floor(dt / 60_000);
    seconds %= 60;
    ctx.clearRect(0, 0, 250, 150);
    ctx.font = "48px Arial";
    ctx.strokeText(minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + ":" + milliseconds.toString().padStart(3, "0"), 0, 50);
}

(function gameLoop(){
    // renderBackground();
    // renderForeground();
    // renderCar();
    renderTimer();

    window.requestAnimationFrame(gameLoop);
})()