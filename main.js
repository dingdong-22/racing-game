// Constants
const SPRITE_SIZE = 127;

// Global State
let start = Date.now();
let newGameLoopTimeStamp = Date.now()
let lastGameLoopTimeStamp = Date.now()
let gameLoopDelta = 0
let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d', { willReadFrequently: true })
let lastKeyUpKeyCode = "";
let lastKeyDownKeyCode = "";
let lastKeyUpKey = "";
let lastKeyDownKey = "";
let cam = { x: 0, y: 0 }
const car1 = new Car({width: 20, height: 35, position: { x: 475, y: 350 }, ctx: ctx, velocity: { x: 0, y: 0}, imagePath: "assets/Cars/car_red_small_1.png", player: 1})
const car2 = new Car({width: 20, height: 35, position: { x: 525, y: 350 }, ctx: ctx, velocity: { x: 0, y: 0}, imagePath: "assets/Cars/car_blue_small_1.png", player: 2})
const cars = [car1, car2]
let bounds = []
let keyDown = {
    87: false, 
    83: false,
    65: false,
    68: false,
}

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
    window.addEventListener("keydown", (event) => {
      keyDown[event.which] = true
    });

    window.addEventListener("keyup", (event) => {
      keyDown[event.which] = false
    });
}

initCanvas()
initKeyControls()

function renderTimer() {
    let dt = Date.now() - start
    let milliseconds = Math.floor(dt % 1_000);
    let seconds = Math.floor(dt / 1_000);
    let minutes = Math.floor(dt / 60_000);
    seconds %= 60;
    ctx.clearRect(window.innerWidth - 225, 0, 225, 70);
    ctx.font = "48px Arial";
    ctx.strokeStyle = "black";
    ctx.strokeText(minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + ":" + milliseconds.toString().padStart(3, "0"), window.innerWidth - 225, 50);
}

function renderBackground() {
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
      ctx.drawImage(currTile, (x * SPRITE_SIZE), (y * SPRITE_SIZE))
    }
  }
}

function renderForeground() {
  const map = [
    [null, null, null, null, "rock3", "tribune_full", null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, "tree_small", null],
    [null, null, null, null, "tree_small", null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, "rock2"],
    ["rock1", null, null, null, null, null, null, null, null, null]
  ]

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] == null) continue;
      const currTile = new Image();
      const tileSpritePath = "./assets/Objects/" + map[y][x] + ".png"
      currTile.src = tileSpritePath
      ctx.drawImage(currTile, (x * SPRITE_SIZE), (y * SPRITE_SIZE))
    }
  }
}

function renderBounds() {
  bounds = []
  
  const topBound = new Component({
    ctx,
    position: {
      x: 0,
      y: 0
    },
    width: SPRITE_SIZE * 10,
    height: 60,
    color: 'transparent'
  })
  bounds.push(topBound)
  
  const topBound2 = new Component({
    ctx,
    position: {
      x: SPRITE_SIZE * 4.6,
      y: 60
    },
    width: SPRITE_SIZE * 3,
    height: SPRITE_SIZE * 1.9,
    color: 'transparent'
  })
  bounds.push(topBound2)
  
  const bottomBound = new Component({
    ctx,
    position: {
      x: 0,
      y: (SPRITE_SIZE * 8 - 60)
    },
    width: SPRITE_SIZE * 10,
    height: 60,
    color: 'transparent'
  })
  bounds.push(bottomBound)
  
  const leftBound = new Component({
    ctx,
    position: {
      x: 0,
      y: 0
    },
    width: 60,
    height: SPRITE_SIZE * 8,
    color: 'transparent'
  })
  bounds.push(leftBound)
  
  const leftBound2 = new Component({
    ctx,
    position: {
      x: 60,
      y: ((SPRITE_SIZE * 8) - (SPRITE_SIZE * 8 / 2) - 45)
    },
    width: 120,
    height: SPRITE_SIZE * 8 / 2,
    color: 'transparent'
  })
  bounds.push(leftBound2)
  
  const rightBound = new Component({
    ctx,
    position: {
      x: (SPRITE_SIZE * 10 - 190),
      y: 0
    },
    width: 190,
    height: SPRITE_SIZE * 8,
    color: 'transparent'
  })
  bounds.push(rightBound)
  
  const rightBound2 = new Component({
    ctx,
    position: {
      x: ((SPRITE_SIZE * 10 - 190) - 190 + 70),
      y: 60
    },
    width: 120,
    height: SPRITE_SIZE * 8 / 2 - 10,
    color: 'transparent'
  })
  bounds.push(rightBound2)
  
  const innerBound = new Component({
    ctx,
    position: {
      x: 440,
      y: ((SPRITE_SIZE * 8) - (SPRITE_SIZE * 8 / 2) - 60)
    },
    width: SPRITE_SIZE * 3.9 - 120,
    height: SPRITE_SIZE * 5.8 / 2,
    color: 'transparent'
  })
  bounds.push(innerBound)
  
  const innerBound2 = new Component({
    ctx,
    position: {
      x: (320 + SPRITE_SIZE * 3.9),
      y: (SPRITE_SIZE * 8 - SPRITE_SIZE * 4.5 / 2)
    },
    width: SPRITE_SIZE,
    height: SPRITE_SIZE * 0.5,
    color: 'transparent'
  })
  bounds.push(innerBound2)
  
  const innerBound3 = new Component({
    ctx,
    position: {
      x: 320,
      y: (SPRITE_SIZE * 1.6)
    },
    width: 120,
    height: SPRITE_SIZE * 8 / 1.75,
    color: 'transparent'
  })
  bounds.push(innerBound3)
  
  const innerBound4 = new Component({
    ctx,
    position: {
      x: 200,
      y: (SPRITE_SIZE * 1.75)
    },
    width: 120,
    height: SPRITE_SIZE * 0.5,
    color: 'transparent'
  })
  bounds.push(innerBound4)

  bounds.forEach((bound) => {
    bound.draw();
  });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCarState() {
  cars.forEach((car) => {
    car.update()
  })
}

function renderCar() {
  cars.forEach((car) => {
    car.draw()
  })
}

(function gameLoop(){
    newGameLoopTimeStamp = Date.now()
    const dt = newGameLoopTimeStamp - lastGameLoopTimeStamp
    gameLoopDelta = dt / 2
    clear()
    renderBackground();
    renderForeground();
    renderBounds();
    updateCarState();
    renderCar();
    renderTimer();

    bounds.forEach((bound) => {
      if (car1.collidesWith(bound)) {
        car1.velocity.x = -car1.velocity.x * 2;
        car1.velocity.y = -car1.velocity.y * 4;
      }
      
      if (car2.collidesWith(bound)) {
        car2.velocity.x = -car2.velocity.x * 2;
        car2.velocity.y = -car2.velocity.y * 4;
      }
    })
    
    console.log(car1.velocity)
    if (car1.collidesWith(car2)) {
      car1.velocity.x = -car1.velocity.x * 2;
      car1.velocity.y = -car1.velocity.y;

      car2.velocity.x = -car2.velocity.x * 2;
      car2.velocity.y = -car2.velocity.y;
    }

    lastGameLoopTimeStamp = Date.now()
    window.requestAnimationFrame(gameLoop);
})()
