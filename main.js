import MainState from "./store/main.js";
import Config from "./configAndUtils/config.js";
import { getBarY, calculateRatioAngle } from "./configAndUtils/utils.js";

import Fullcrum from "./components/fulcrum.js";
import Control from "./components/control.js";
import Bar from "./components/bar.js";

(() => {
  const canvas = document.getElementById("simulation");
  const context = canvas.getContext("2d");

  context.scale(1, 1);

  // state
  const mainState = new MainState({
    canvas: { width: canvas.width, height: canvas.height },
    context,
    simulationState: 1, // 0: stopped, 1: running , 2: end
    angleDegree: 0,
    onLeft: [],
    onRight: [],
    leftTop: [0, 0, 0, 0, 0],
    rightTop: [0, 0, 0, 0, 0],
    speed: 0.1,
  });

  // configuration
  const config = new Config({
    fulcrumSize: { base: 150, height: 50 },
    padding: 10,
    canvas: mainState.getCanvas(),
    figures: ["square", "triangle", "circle"],
  });

  // components
  const fulcrumComponent = new Fullcrum();
  const controlComponent = new Control();
  const barComponent = new Bar();

  // update variables
  let tickCounter = 0;
  let updateInterval = 1000;
  let lastTick = 0;

  // html variables
  let leftWeight = 0;
  let leftMomentum = 0;
  let rightWeight = 0;
  let rightMomentum = 0;
  let animationRate = { initialSpeed: 15, gravity: 0.9 };

  setUpButton();
  ResetButton();
  nextMove();
  update();
  updateScore();

  function nextMove() {
    controlComponent.nextControl();
    barComponent.randomRight();

    updateScore();
  }

  function update(time = 0) {
    if (mainState.getSimulationState() === 1) {
      const delta = time - lastTick;
      lastTick = time;

      tickCounter += delta;
      if (tickCounter > updateInterval) {
        tickCounter = 0;
        moveControl();
      }
      render();
      requestAnimationFrame(update);
    } else if (mainState.getSimulationState() === 2) {
      jumpAnimation();
      render();
      requestAnimationFrame(update);
    }
  }

  function moveControl() {
    controlComponent.moveControl().then((passed) => {
      if (passed) {
        barComponent.putOnLeft(controlComponent.control);
        mainState.increaseSpeed(0.05);
        updateScore();
        checkEndCase();
        if (mainState.getSimulationState() === 1) {
          nextMove();
        }
      }
    });
  }

  function jumpAnimation() {
    for (let left of mainState.getOnLeft()) {
      left.yPos -= animationRate.initialSpeed;
    }

    for (let right of mainState.getOnRight()) {
      right.yPos -= animationRate.initialSpeed;
    }

    animationRate.initialSpeed -= animationRate.gravity;

    if (animationRate.initialSpeed <= -30) {
      reset();
      mainState.setSimulationState(1);
      nextMove();
    }
  }

  function checkEndCase() {
    const [differenceRatio, angleDegree] = calculateRatioAngle(
      leftMomentum,
      rightMomentum
    );
    mainState.setAngleDegree(angleDegree);

    if (differenceRatio > 30) {
      endAnimation();
    } else if (Math.abs(leftMomentum - rightMomentum) > 20) {
      endAnimation();
    }
  }

  function endAnimation() {
    animationRate.initialSpeed = 10;
    mainState.setSimulationState(2);
  }

  function reset() {
    mainState.setAngleDegree(0);
    nextMove();
    mainState.setOnLeft([]);
    mainState.setOnRight([]);
    mainState.setleftTop([0, 0, 0, 0, 0]);
    mainState.setRightTop([0, 0, 0, 0, 0]);
    leftWeight = 0;
    leftMomentum = 0;
    rightWeight = 0;
    rightMomentum = 0;
    mainState.setSpeed(0.1);
    mainState.setSimulationState(1);
  }

  function render() {
    fulcrumComponent.update();
    barComponent.update();
    if (mainState.getSimulationState() !== 2) {
      controlComponent.update();
    }
  }

  function controlMove(direction) {
    if (
      (direction === -1 && controlComponent.control.xStep > 0) ||
      (direction === 1 && controlComponent.control.xStep < 4)
    ) {
      controlComponent.control.xStep += direction;
    }
  }

  document.addEventListener("keydown", (event) => {
    const barLengthStep = (canvas.width - 2 * config.getPadding()) / 10;
    if (event.keyCode === 37) {
      controlMove(-1); // Arrow Left
    } else if (event.keyCode === 39) {
      controlMove(1); // Arrow Right
    } else if (event.keyCode === 40) {
      //Arrow Down
      const barY = getBarY(
        controlComponent.control,
        mainState.getAngleDegree(),
        barLengthStep
      );
      const leftTopVal = mainState.getLeftTop()[controlComponent.control.xStep];
      let yPos =
        canvas.height - config.getFulcrumSize().height - config.getPadding();
      yPos = yPos - barLengthStep - leftTopVal + barY;
      controlComponent.control.yPos = yPos;
    }
  });

  function updateScore() {
    leftWeight = 0;
    leftMomentum = 0;
    rightWeight = 0;
    rightMomentum = 0;

    for (let left of mainState.getOnLeft()) {
      leftWeight += left.weight;
      leftMomentum += left.weight * (5 - left.xStep);
    }

    for (let right of mainState.getOnRight()) {
      rightWeight += right.weight;
      rightMomentum += right.weight * (right.xStep - 4);
    }

    document.getElementById("leftWeight").innerText = leftWeight;
    document.getElementById("leftMomentum").innerText = leftMomentum;
    document.getElementById("rightWeight").innerText = rightWeight;
    document.getElementById("rightMomentum").innerText = rightMomentum;
    const speed = (mainState.speed * config.getBarLengthStep()).toFixed(0);
    document.getElementById("speed").innerText = `${speed}`;
  }

  function setUpButton() {
    const button = document.getElementById("pauseResume");
    button.addEventListener("click", (e) => {
      mainState.setSimulationState(
        mainState.getSimulationState() === 0 ? 1 : 0
      );
      if (mainState.getSimulationState() === 1) {
        update();
        button.innerHTML = "STOP";
      } else {
        button.innerHTML = "RESUME";
      }
    });
  }

  function ResetButton() {
    const button = document.getElementById("resetGame");
    button.addEventListener("click", () => {
      mainState.setSimulationState(2);
    });
  }
})();
