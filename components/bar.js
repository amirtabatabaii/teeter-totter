import MainState from "../store/main.js";
import Config from "../configAndUtils/config.js";
import { getBarY, celciusToRadian } from "../configAndUtils/utils.js";

import FiguresService from "../services/figures.service.js";

export default class Bar {
  constructor() {
    this.mainState = new MainState();
    this.config = new Config();

    this.canvas = this.mainState.getCanvas();
    this.context = this.mainState.getContext();

    this.figuresService = new FiguresService();
  }

  update() {
    this.drawBar();
    this.drawBarItems();
  }

  drawBar() {
    const barLength = this.canvas.width - 2 * this.config.getPadding();
    const angle = celciusToRadian(this.mainState.getAngleDegree());
    const center = { x: this.canvas.width / 2, y: this.canvas.height - 50 };

    this.context.beginPath();
    this.context.moveTo(
      center.x - (Math.cos(angle) * barLength) / 2,
      center.y + (Math.sin(angle) * barLength) / 2
    );
    this.context.lineTo(
      center.x + (Math.cos(angle) * barLength) / 2,
      center.y - (Math.sin(angle) * barLength) / 2
    );
    this.context.closePath();

    this.context.strokeStyle = "#FFFFFF";
    this.context.stroke();
  }

  drawBarItems(padding) {
    const leftTop = [0, 0, 0, 0, 0];
    for (let left of this.mainState.getOnLeft()) {
      const size =
        (this.config.getBarLengthStep() / 10) * (5 + left.weight / 2);
      const barY = getBarY(
        left,
        this.mainState.getAngleDegree(),
        this.config.getBarLengthStep()
      );
      let yPos = left.yPos + this.config.getPadding() - leftTop[left.xStep];
      yPos = yPos + (this.config.getBarLengthStep() - size) + barY;

      this.figuresService.drawFigure({
        x:
          this.config.getBarLengthStep() * left.xStep +
          this.config.getPadding(),
        y: yPos,
        w: size,
        h: size,
        k: left.weight,
        b: this.config.getBarLengthStep(),
        t: left.type,
      });
      leftTop[left.xStep] += size;
    }

    const rightTop = [0, 0, 0, 0, 0];
    for (let right of this.mainState.getOnRight()) {
      const size =
        (this.config.getBarLengthStep() / 10) * (5 + right.weight / 2);
      const barY = getBarY(
        right,
        this.mainState.getAngleDegree(),
        this.config.getBarLengthStep()
      );
      let yPos =
        right.yPos + this.config.getPadding() - rightTop[right.xStep - 5];
      yPos = yPos + (this.config.getBarLengthStep() - size) + barY;

      this.figuresService.drawFigure({
        x:
          this.config.getBarLengthStep() * right.xStep +
          this.config.getPadding(),
        y: yPos,
        w: size,
        h: size,
        k: right.weight,
        b: this.config.getBarLengthStep(),
        t: right.type,
      });
      rightTop[right.xStep - 5] += size;
    }
  }

  randomRight() {
    const xStep = 5 + Math.floor(Math.random() * 5);
    const weight = 1 + Math.floor(Math.random() * 10);
    let yPos = this.canvas.height - this.config.getFulcrumSize().height;
    yPos = yPos - this.config.getPadding() - this.config.getBarLengthStep();

    this.mainState.getOnRight().push({
      xStep: xStep,
      yPos,
      type: this.figuresService.getRandomFigure(),
      weight: weight,
    });

    this.mainState.getRightTop()[xStep] +=
      (this.config.getBarLengthStep() / 10) * (5 + weight / 2);
  }

  putOnLeft(control) {
    this.mainState.getOnLeft().push({
      xStep: control.xStep,
      yPos: control.yPos,
      type: control.type,
      weight: control.weight,
    });

    const inc =
      (this.config.getBarLengthStep() / 10) * (5 + control.weight / 2);
    this.mainState.getLeftTop()[control.xStep] += inc;
  }
}
