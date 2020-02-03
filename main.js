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
*/

//Create a Pixi Application
const app = new PIXI.Application({width: 244, height: 288});
const gameContainer = app.stage;
const WIDTH = app.renderer.view.width;
const HEIGHT = app.renderer.view.height;
const IMAGEPATH = "sprites/Arcade - Pac-Man - General Sprites.png"; 

//Setup Pixi and load the texture atlas files - call the `setup`
//function when they've loaded
function setup() {
    //Initialize the game sprites, set the game `state` to `play`
    //and start the 'gameLoop'
    //Create Ghosts
    //Create pacman
    //Create Pills
    //Create maze
    //Create GameOver 
    //Create scoreBox
}

function gameLoop(delta) {
    //Runs the current game `state` in a loop and renders the sprites
}

function play(delta) {
    //All the game logic goes here
}

function end() {
    //All the code that should run at the end of the game
}

//The game's helper functions:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);