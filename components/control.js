import MainState from "../store/main.js";
import Config from "../configAndUtils/config.js";
import { getBarY } from "../configAndUtils/utils.js";

import FiguresService from "../services/figures.service.js";

export default class Control {
  constructor() {
    this.mainState = new MainState();
    this.config = new Config();

    this.figuresService = new FiguresService();

    this.canvas = this.mainState.getCanvas();
    this.context = this.mainState.getContext();
    this.control = {};
  }

  nextControl() {
    this.control = {
      xStep: 0,
      yPos: 0,
      type: this.figuresService.getRandomFigure(),
      weight: 1 + Math.floor(Math.random() * 10),
    };
  }

  moveControl() {
    return new Promise((resolve) => {
      const padding = this.config.getPadding();
      const fulcrumSize = this.config.getFulcrumSize();
      const barLengthStep = this.config.getBarLengthStep();

      this.control.yPos += this.mainState.getSpeed() * barLengthStep;
      const barY = getBarY(
        this.control,
        this.mainState.getAngleDegree(),
        barLengthStep
      );

      const currentPos = this.control.yPos + padding + barLengthStep;
      const limitPos =
        this.canvas.height -
        fulcrumSize.height -
        this.mainState.getLeftTop()[this.control.xStep] +
        barY;

      if (currentPos > limitPos) {
        this.control.yPos =
          this.canvas.height - fulcrumSize.height - padding - barLengthStep;
        resolve(true);
      }

      resolve(false);
    });
  }

  update() {
    const size =
      (this.config.getBarLengthStep() / 10) * (5 + this.control.weight / 2);
    this.figuresService.drawFigure({
      x:
        this.config.getBarLengthStep() * this.control.xStep +
        this.config.getPadding(),
      y:
        this.control.yPos +
        this.config.getPadding() +
        (this.config.getBarLengthStep() - size),
      w: size,
      h: size,
      k: this.control.weight,
      b: this.config.getBarLengthStep(),
      t: this.control.type,
    });
  }
}
