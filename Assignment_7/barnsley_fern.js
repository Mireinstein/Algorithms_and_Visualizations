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
    // Apply affine transformation matrix
    let a = 0, b = 0, c = 0, d = 0.16, e = 0, f = 0;
    nextX = a * x + b * y + e;
    nextY = c * x + d * y + f;
  } else if (r < 0.86) {
    // Apply affine transformation matrix
    let a = 0.85, b = 0.04, c = -0.04, d = 0.85, e = 0, f = 1.6;
    nextX = a * x + b * y + e;
    nextY = c * x + d * y + f;
  } else if (r < 0.93) {
    // Apply affine transformation matrix
    let a = 0.20, b = -0.26, c = 0.23, d = 0.22, e = 0, f = 1.6;
    nextX = a * x + b * y + e;
    nextY = c * x + d * y + f;
  } else {
    // Apply affine transformation matrix
    let a = -0.15, b = 0.28, c = 0.26, d = 0.24, e = 0, f = 0.44;
    nextX = a * x + b * y + e;
    nextY = c * x + d * y + f;
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
