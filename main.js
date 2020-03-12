import Pacman from "./pacman.js";
import Loader from "./loader/assetLoader.js";
import MazeMap from "./tileMap/map.js";
import Pill from "./pills.js";
/*
  The main idea is going to be to add a maze sprize to a game container 
  and to that same container im going to add the pacman, ghost, pills
  sprites, on top of that an invisable grid is going to be drawn
  which will house 28 x 36 = 1008 tiles.
  each tile is 8 width and 8 height big
  28 tiles in a single row, and 36 rows

  The logic grid will be used to achive different collisions between:
  1. pacman and ghosts through each sprites center point
  2. pacman and pills through each sprites center point
  3. pacman and maze through pacmans center point ?
  4. ghosts and maze through ghosts center point ?

  TODO:
  1. Animate pac man and make it move - done
     a. animate pacman death
  2. Animate maze -
  3. animate pills in maze
  4. animate ghosts in maze
     a. animate eatble ghosts
     b. animate eaten ghosts      
*/
const canvas = document.querySelector("canvas"); // 300x400
const ctx = canvas.getContext("2d");
const SCALE = 0.8;
const WIDTH = 16;
const HEIGHT = 16;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const PACMAN_SPRITES_XS = [0, 1, 2];
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let currentSpriteIndex = 0;
let frameCount = 0;
let pacman = new Pacman();
let loader = new Loader();
let maze = new MazeMap(ctx);
let hasMoved = false;

/*
 0 - right
 1 - left
 2 - up
 3 - down
*/

let currentDirection = 0;
let keyPresses = {};

loader.loadImage("pacman", "./sprites/pacman.png");

function drawFrame(image, frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(
    image,
    frameX * WIDTH,
    frameY * HEIGHT,
    WIDTH,
    HEIGHT,
    canvasX,
    canvasY,
    SCALED_WIDTH,
    SCALED_HEIGHT
  );
}

function createFood() {
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      if (maze.VisualRepresentation[row][column] === 2) {
        maze.LogicalRepresentation[row][column] = new Pill(
          ctx,
          30,
          column * maze.tileWidth + maze.tileWidth / 2,
          row * maze.tileHeight + maze.tileHeight / 2,
          1,
          column * maze.tileWidth,
          row * maze.tileHeight
        );
      }
    }
  }
}

function drawFood() {
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      if (maze.LogicalRepresentation[row][column].hasOwnProperty("radius")) {
        maze.LogicalRepresentation[row][column].draw();
      }
    }
  }
}

function keyDownListener(event) {
  keyPresses[event.key] = true;
}

function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function clearScreen() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function isPacmanInTile(row, column) {
  return (
    pacman.x >= maze.LogicalRepresentation[row][column].x &&
    pacman.x <= maze.LogicalRepresentation[row][column].x + maze.tileWidth &&
    pacman.y >= maze.LogicalRepresentation[row][column].y &&
    pacman.y <= maze.LogicalRepresentation[row][column].y + maze.tileHeight
  );
}

function getCurrentPacManTile(){
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      if (isPacmanInTile(row, column)) {
        console.log(row, column);
      }
    }
  } 
}

function handleFoodCollisionTasks() {
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      if (
        isPacmanInTile(row, column) &&
        maze.LogicalRepresentation[row][column].hasOwnProperty("radius")
      ) {
        // clean visual rep
        maze.changeValue(row, column, "visual", 0);
        // initiate logical value to 0
        maze.changeValue(row, column, "logical", {
          value: 0,
          x: column * maze.tileWidth,
          y: row * maze.tileHeight,
          width: maze.tileWidth,
          height: maze.tileHeight
        });
      }
    }
  }
}

function isCollisionWithMaze(direction) {
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      // check for all four next directions
      if(isPacmanInTile(row, column)){
          if(maze.getValue(row + 1, column, "logical").value === 1 ||
             maze.getValue(row - 1, column, "logical").value === 1 ||
             maze.getValue(row, column + 1, "logical").value === 1 ||
             maze.getValue(row, column - 1, "logical").value === 1){
             console.log('maze collision');
          }     
      }
    }
  }
}

function isPassableTile(){
  for (let row = 0; row < maze.mapHeight; row++) {
    for (let column = 0; column < maze.mapWidth; column++) {
      // check for all four next directions
      if(isPacmanInTile(row, column)){
        if(maze.getValue(row, column, "logical").value === 0){
            console.log('can pass');
        }     
      }
    }
  }
}


function handleKeyPresses() {
  hasMoved = false;
  if (keyPresses.w) {
    // up
    pacman.y -= pacman.movementSpeed;
    currentDirection = 2;
    hasMoved = true;
  } else if (keyPresses.d) {
    // right
    pacman.x += pacman.movementSpeed;
    currentDirection = 0;
    hasMoved = true;
  } else if (keyPresses.a) {
    // left
    pacman.x -= pacman.movementSpeed;
    currentDirection = 1;
    hasMoved = true;
  } else if (keyPresses.s) {
    // down
    pacman.y += pacman.movementSpeed;
    currentDirection = 3;
    hasMoved = true;
  }
}

function incrementPacManSpriteIndex() {
    frameCount++;
    //console.log(frameCount);
    if (frameCount >= 12) {
      frameCount = 0;
      currentSpriteIndex++;
      if (currentSpriteIndex >= PACMAN_SPRITES_XS.length) {
        currentSpriteIndex = 0;
      }
    }
}

function gameLoop() {
  clearScreen();
  handleKeyPresses();
  
  // every 12 frames draw a pacman sprite
  if (hasMoved) {
    incrementPacManSpriteIndex();
  }

  // draw maze
  maze.drawMaze();
  // draw food at each 0 value in the array
  drawFood();
  //draw pacman
  drawFrame(
    loader.getImage("pacman"),
    PACMAN_SPRITES_XS[currentSpriteIndex],
    currentDirection,
    pacman.x - WIDTH / 2,
    pacman.y - HEIGHT / 2
  );
  handleFoodCollisionTasks();
  isCollisionWithMaze();
  isPassableTile()
  //getCurrentPacManTile();
  window.requestAnimationFrame(gameLoop);
}

createFood();
gameLoop();
window.addEventListener("keydown", keyDownListener, false);
window.addEventListener("keyup", keyUpListener, false);
