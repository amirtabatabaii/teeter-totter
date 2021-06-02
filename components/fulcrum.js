import MainState from "../store/main.js";
import Config from "../configAndUtils/config.js";

export default class Fulcrum {
  constructor() {
    this.mainState = new MainState();
    this.config = new Config();

    this.canvas = this.mainState.getCanvas();
    this.context = this.mainState.getContext();
    this.fulcrumSize = this.config.getFulcrumSize();
  }

  update() {
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const startPos = {
      x: this.canvas.width / 2,
      y: this.canvas.height - this.fulcrumSize.height,
    };

    this.context.beginPath();
    this.context.moveTo(startPos.x, startPos.y);
    this.context.lineTo(
      startPos.x + this.fulcrumSize.base / 2,
      this.canvas.height
    );
    this.context.lineTo(
      startPos.x - this.fulcrumSize.base / 2,
      this.canvas.height
    );
    this.context.closePath();

    this.context.fillStyle = "#FFFFFF";
    this.context.fill();
  }
}
