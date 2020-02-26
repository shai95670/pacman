export default class Pill {
    constructor(twoDimensionalCanvas, pointsWorth, x, y, radius, cellX, cellY){
      this.twoDimensionalCanvas = twoDimensionalCanvas;
      this.pointsWorth = pointsWorth;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.cellX = cellX;
      this.cellY = cellY;
    }
    draw(){
        this.twoDimensionalCanvas.fillStyle = 'pink';
        this.twoDimensionalCanvas.beginPath();
        this.twoDimensionalCanvas.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.twoDimensionalCanvas.fill();
    }
}

class EnergyPill extends Pill {
    constructor(){
        //
    }
}

class Fruit extends Pill {
    constructor(){
        //
    }
}

