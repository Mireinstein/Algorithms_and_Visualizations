let svgElement;
let x = 0, y = 0;

window.onload = function () {
  svgElement = document.getElementById("svg");
  setInterval(() => {
    // Update 20 times every frame
    for (let i = 0; i < 20; i++)
      update();
  }, 1000/250); // 250 frames per second
};

function update() {
  let nextX, nextY;
  let r = Math.random();
  if (r < 0.01) {
    nextX =  0;
    nextY =  0.16 * y;
  } else if (r < 0.86) {
    nextX =  0.85 * x + 0.04 * y;
    nextY = -0.04 * x + 0.85 * y + 1.6;
  } else if (r < 0.93) {
    nextX =  0.20 * x - 0.26 * y;
    nextY =  0.23 * x + 0.22 * y + 1.6;
  } else {
    nextX = -0.15 * x + 0.28 * y;
    nextY =  0.26 * x + 0.24 * y + 0.44;
  }

  // Scaling and positioning
  let plotX = (x + 3) * svgElement.clientWidth / 6;
  let plotY = svgElement.clientHeight - ((y + 2) * svgElement.clientHeight / 14);

  drawFilledCircle(plotX, plotY, 1, "green");

  x = nextX;
  y = nextY;
}

const drawFilledCircle = (centerX, centerY, radius, color) => {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", centerX);
  circle.setAttribute("cy", centerY);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", color);
  svgElement.appendChild(circle);
};
