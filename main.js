import Pacman from './pacman.js';
import Loader from './loader/assetLoader.js';
import MazeMap from './tileMap/map.js';
import Pill from './pills.js';
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
const canvas = document.querySelector('canvas'); // 300x400
const ctx = canvas.getContext('2d');
const SCALE = 1;
const WIDTH = 16;
const HEIGHT = 16;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 2];
const MOVEMENT_SPEED = 2;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
let food = [];

let currentLoopIndex = 0;
let frameCount = 0;
let pacman = new Pacman();
let loader = new Loader();
let maze = new MazeMap(ctx);

/*
 0 - right
 1 - left
 2 - up
 3 - down
*/ 
let currentDirection = 0;
let keyPresses = {};


loader.loadImage('pacman', './sprites/pacman.png')
loader.loadImage('maze', './sprites/Arcade - Pac-Man - Maze Parts.png')

function drawFrame(image, frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(image,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

function createFood(){
  for(let row = 0; row < maze.mapHeight; row++){
    for(let column = 0; column < maze.mapWidth; column++){
          if(maze.VisualRepresentation[row][column] === 2){
            food.push(new Pill(ctx,
               30,
               (column * maze.tileWidth) + (maze.tileWidth / 2),
               (row * maze.tileHeight) + (maze.tileHeight / 2), 2,
               column * maze.tileWidth,
               row * maze.tileHeight
            ))
          } 
    }
  }
}

function drawFood(){
  for(let index = 0; index < food.length; index++){
    food[index].draw();
  }
}

function keyDownListener(event) {
  keyPresses[event.key] = true;
}

function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function clearScreen(){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function removeFoodObject(x, y){
  console.log(x, y);
  food.find(foodObject => {
   return foodObject.cellX === x && foodObject.cellY === y
  })
}

function handleFoodCollisionTasks(){
  for(let row = 0; row < maze.mapHeight; row++){
    for(let column = 0; column < maze.mapWidth; column++){
     if ((pacman.x >= maze.LogicalRepresentation[row][column].x &&
         pacman.x <= maze.LogicalRepresentation[row][column].x + maze.tileWidth) &&
         (pacman.y >= maze.LogicalRepresentation[row][column].y &&
         pacman.y <= maze.LogicalRepresentation[row][column].y + maze.tileHeight) &&
         maze.LogicalRepresentation[row][column].value === 2) {
         // delete food object from the food list
         removeFoodObject(maze.LogicalRepresentation[row][column].x, maze.LogicalRepresentation[row][column].y);
         // clean visual rep
         maze.changeValue(row, column, 'visual', 0); 
         // initiate logical value to 0
         maze.changeValue(row, column, 'logical', 0);
         console.log(food);
     }   
    }   
  } 
}


function gameLoop() {
  clearScreen();
  let hasMoved = false;
  if (keyPresses.w) {
  // up
      pacman.y -= MOVEMENT_SPEED
      currentDirection = 2;
      hasMoved = true;
  } else if (keyPresses.d) {
  // right
      pacman.x += MOVEMENT_SPEED;
      currentDirection = 0;
      hasMoved = true;
  } else if (keyPresses.a) {
  // left
      pacman.x -= MOVEMENT_SPEED;
      currentDirection = 1;
      hasMoved = true;
  } else if (keyPresses.s) {
  // down
      pacman.y += MOVEMENT_SPEED
      currentDirection = 3;
      hasMoved = true;
  }
  
  if (hasMoved) {
      frameCount++;
      if (frameCount >= 12) {
          frameCount = 0;
          currentLoopIndex++;
          if (currentLoopIndex >= CYCLE_LOOP.length) {
              currentLoopIndex = 0;
          }
      }
  }
  // draw maze
  maze.drawMaze();
  // draw food at each 0 value in the array
  drawFood();
  //draw pacman
  drawFrame(loader.getImage('pacman'),CYCLE_LOOP[currentLoopIndex], currentDirection, pacman.x, pacman.y);
  handleFoodCollisionTasks();
  window.requestAnimationFrame(gameLoop);
}

createFood();
console.log(food);
gameLoop();
window.addEventListener('keydown', keyDownListener, false);
window.addEventListener('keyup', keyUpListener, false);