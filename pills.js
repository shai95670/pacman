export default class Pill {
    constructor(twoDimensionalCanvas, pointsWorth, x, y, radius){
      this.twoDimensionalCanvas = twoDimensionalCanvas;
      this.pointsWorth = pointsWorth;
      this.x = x;
      this.y = y;
      this.radius = radius;
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

