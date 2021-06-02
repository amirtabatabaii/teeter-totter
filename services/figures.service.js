import MainState from "../store/main.js";
import Config from "../configAndUtils/config.js";

export default class FiguresService {
  constructor() {
    if (!!FiguresService.instance) {
      return FiguresService.instance;
    }

    FiguresService.instance = this;

    this.mainState = new MainState();
    this.config = new Config();

    this.context = this.mainState.getContext();

    return this;
  }

  getRandomFigure() {
    return this.config.getFigures()[Math.floor(Math.random() * 3)];
  }

  getFigure(idx) {
    return this.config.getFigures()[idx];
  }

  drawFigure(data) {
    switch (data.t) {
      case this.getFigure(0):
        this.drawSquare(data);
        break;
      case this.getFigure(1):
        this.drawTriangle(data);
        break;
      case this.getFigure(2):
        this.drawCircle(data);
    }
  }

  drawSquare({ x, y, w, h, k, b }) {
    this.context.beginPath();
    this.context.moveTo(x + (b - w) / 2, y);
    this.context.lineTo(x + w + (b - w) / 2, y);
    this.context.lineTo(x + w + (b - w) / 2, y + h);
    this.context.lineTo(x + (b - w) / 2, y + h);
    this.context.closePath();

    this.context.fillStyle = "#8EA2E3";
    this.context.fill();

    this.context.font = "15px Arial";
    this.context.fillStyle = "#091745";
    this.context.textAlign = "center";
    this.context.fillText(k.toString(), x + b / 2, y + h / 1.5);
  }

  drawTriangle({ x, y, w, h, k, b }) {
    this.context.beginPath();
    this.context.moveTo(x + b / 2, y);
    this.context.lineTo(x + w + (b - w) / 2, y + h);
    this.context.lineTo(x + (b - w) / 2, y + h);
    this.context.closePath();

    this.context.fillStyle = "#8EA2E3";
    this.context.fill();

    this.context.font = "15px Arial";
    this.context.fillStyle = "#091745";
    this.context.textAlign = "center";
    this.context.fillText(k.toString(), x + b / 2, y + h / 1.2);
  }

  drawCircle({ x, y, w, h, k, b }) {
    this.context.beginPath();
    this.context.arc(x + b / 2, y + h / 2, w / 2, 0, 2 * Math.PI);
    this.context.closePath();

    this.context.fillStyle = "#8EA2E3";
    this.context.fill();

    this.context.font = "15px Arial";
    this.context.fillStyle = "#091745";
    this.context.textAlign = "center";
    this.context.fillText(k.toString(), x + b / 2, y + h / 1.5);
  }
}
