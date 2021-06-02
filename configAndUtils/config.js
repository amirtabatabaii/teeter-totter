export default class Config {
  constructor(args) {
    if (!!Config.instance) {
      return Config.instance;
    }

    Config.instance = this;

    this.fulcrumSize = args.fulcrumSize;
    this.padding = args.padding;
    this.barLengthStep = (args.canvas.width - 2 * args.padding) / 10;
    this.figures = args.figures;

    return this;
  }

  getFulcrumSize() {
    return this.fulcrumSize;
  }

  getPadding() {
    return this.padding;
  }

  getBarLengthStep() {
    return this.barLengthStep;
  }

  getFigures() {
    return this.figures;
  }
}
