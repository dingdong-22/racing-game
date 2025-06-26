// Global State
let start = Date.now();
let lastGameLoopTimeStamp = Date.now()
let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')
let lastKeyUpKeyCode = "";
let lastKeyDownKeyCode = "";
let lastKeyUpKey = "";
let lastKeyDownKey = "";
const car = new Car({ctx: ctx, velocity: { x: 1, y: 1}})

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

}

function initKeyControls() {
    window.onkeydown = function (event) {
        lastKeyDownKeyCode = event.keyCode;
        lastKeyDownKey = event.key;
    };

    window.onkeyup = function (event) {
        lastKeyUpKeyCode = event.keyCode;
        lastKeyUpKey = event.key;
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
    ctx.clearRect(0, 0, 225, 70);
    ctx.font = "48px Arial";
    ctx.strokeText(minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + ":" + milliseconds.toString().padStart(3, "0"), 0, 50);
}

function renderBackground() {
  const SPRITE_SIZE = 128;
  const map = [
    ["01", "09", "09", "09", "02", "11", "11", "11", "11", "11"],
    ["05", "12", "13", "14", "03", "11", "11", "11", "11", "11"],
    ["05", "08", "02", "05", "08", "09", "09", "02", "11", "11"],
    ["06", "14", "03", "06", "13", "13", "14", "03", "11", "11"],
    ["11", "05", "03", "11", "11", "11", "05", "08", "02", "11"],
    ["11", "05", "03", "11", "11", "11", "06", "14", "03", "11"],
    ["11", "05", "08", "09", "09", "09", "09", "10", "03", "11"],
    ["11", "06", "13", "13", "13", "13", "13", "13", "07", "11"],
  ]

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      const currTile = new Image();
      const tileSpritePath = "./assets/Tiles/Grass/land_grass" + map[y][x] + ".png"
      currTile.src = tileSpritePath
      currTile.addEventListener("load", () => {
        ctx.drawImage(currTile, x * SPRITE_SIZE, y * SPRITE_SIZE)
      })
    }
  }
}

function updateCarState() {
    car.updateState()
}

function renderCar() {
    car.draw()
}

(function gameLoop(){
    renderBackground();
    renderTimer();
    updateCarState();
    renderCar();
    // renderForeground();

    lastGameLoopTimeStamp = Date.now()
    window.requestAnimationFrame(gameLoop);
})()
