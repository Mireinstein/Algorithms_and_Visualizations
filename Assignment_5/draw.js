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
  //add event listeners to the rectangle
  let isDrawing = false;
  let prevX = 0;
  let prevY = 0;
  
  svg.addEventListener("mousedown", (event) => {
    isDrawing = true;
    prevX = event.offsetX;
    prevY = event.offsetY;
  });
  
  svg.addEventListener("mousemove", (event) => {
    if (isDrawing === true) {
      // Remove any existing lines
      while (svg.lastChild && svg.lastChild.tagName === "line") {
        svg.removeChild(svg.lastChild);
      }
  
      // Create a new line from the initial mouse down position to the current mouse position
      let line = document.createElementNS(ns, "line");
      line.setAttribute("x1", prevX);
      line.setAttribute("y1", prevY);
      line.setAttribute("x2", event.offsetX);
      line.setAttribute("y2", event.offsetY);
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "5");
  
      svg.appendChild(line);
    }
  });
  
  
  svg.addEventListener("mouseup", (event) => {
    isDrawing = false;
  });

  svg.appendChild(rectangle);
}