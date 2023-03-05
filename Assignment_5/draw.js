function displayPage() {
  const ns = "http://www.w3.org/2000/svg";

  //access the svg element
  const svg = document.querySelector("#canvas");

  //add a rectangle with a black border
  let rectangle = document.createElementNS(ns, "rect");
  rectangle.setAttribute("x", "0");
  rectangle.setAttribute("y", "0");
  rectangle.setAttribute("width", "600");
  rectangle.setAttribute("height", "400");
  rectangle.setAttribute("stroke", "black");
  rectangle.setAttribute("stroke-width", "5");
  rectangle.setAttribute("fill", "white");
  svg.appendChild(rectangle);

  //add event listeners to the canvas
  let isDrawing = false;
  let prevX = 0;
  let prevY = 0;
  let lineInProgress = null;

  svg.addEventListener("mousedown", (event) => {
    isDrawing = true;
    prevX = event.offsetX;
    prevY = event.offsetY;
    if (lineInProgress === null) {
      lineInProgress = document.createElementNS(ns, "line");
      lineInProgress.setAttribute("x1", prevX);
      lineInProgress.setAttribute("y1", prevY);
      lineInProgress.setAttribute("x2", prevX);
      lineInProgress.setAttribute("y2", prevY);
      lineInProgress.setAttribute("stroke", "black");
      lineInProgress.setAttribute("stroke-width", "5");
      svg.appendChild(lineInProgress);
    }
  });

  svg.addEventListener("mousemove", (event) => {
    if (isDrawing === true && lineInProgress !== null) {
      lineInProgress.setAttribute("x2", event.offsetX);
      lineInProgress.setAttribute("y2", event.offsetY);
    }
  });

  svg.addEventListener("mouseup", (event) => {
    isDrawing = false;
    if (lineInProgress !== null) {
      lineInProgress = null;
    }
  });

  svg.appendChild(rectangle);
}
