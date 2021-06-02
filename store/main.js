export default class MainState {
    constructor(args) {
        if (!!MainState.instance) {
            return MainState.instance;
        }

        MainState.instance = this;

        this.canvas = args.canvas;
        this.context = args.context;
        this.simulationState = args.simulationState;
        this.angleDegree = args.angleDegree;
        this.onLeft = args.onLeft;
        this.onRight = args.onRight;
        this.leftTop = args.leftTop;
        this.rightTop = args.rightTop;
        this.speed = args.speed;

        return this;
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.context;
    }

    setSimulationState(simulationState) {
        this.simulationState = simulationState;
    }

    getSimulationState() {
        return this.simulationState;
    }

    setAngleDegree(angleDegree) {
        this.angleDegree = angleDegree;
    }

    getAngleDegree() {
        return this.angleDegree;
    }

    setleftTop(leftTop) {
        this.leftTop = leftTop; 
    }

    getLeftTop() {
        return this.leftTop;
    }

    setRightTop(rightTop) {
        this.rightTop = rightTop; 
    }

    getRightTop() {
        return this.rightTop;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }

    increaseSpeed(inc) {
        return this.speed += inc;
    }

    setOnLeft(onLeft) {
        this.onLeft = onLeft;
    }

    getOnLeft() {
        return this.onLeft;
    }

    setOnRight(onRight) {
        this.onRight = onRight;
    }

    getOnRight() {
        return this.onRight;
    }
}