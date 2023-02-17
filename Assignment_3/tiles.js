function drawTiles(){
    const grid=document.getElementById("grid");
    grid.style.display="grid";
    grid.style.gridTemplateRows = "repeat(10, 1fr)";
    grid.style.gridTemplateColumns = "repeat(10, 1fr)";

    for (let i=0;i<10;i++){
        for(let j=0;j<10;j++){
        let cell=document.createElement("div");
        cell.id = "cell-" + i + "-" + j;
        
         // calculate the distances from top-left and bottom-right corners and from center
            let distanceFromTopLeft = Math.sqrt(i*i + j*j);
            let distanceFromBottomRight = Math.sqrt((i-9)*(i-9) + (j-9)*(j-9));
            let distanceFromCenter=Math.sqrt((i-5)*(i-5) + (j-5)*(j-5));

            // set the background color of the cell based on the distances
            let green = Math.floor(255 - distanceFromTopLeft*15);
            let red = Math.floor(255 - distanceFromBottomRight*15);
            let blue = Math.floor(255 - distanceFromCenter*15);
            cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

            cell.style.height = "50px";
            cell.style.width = "50px";

               // add event listeners to change background color on mouseover and mouseout
            cell.addEventListener("mouseover", function() {
                cell.style.backgroundColor = "rgb(255,0,0)";
            });
            cell.addEventListener("mouseout", function() {
                cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
            });
             //event listener to change cells permanently on click
            cell.addEventListener("click", function() {
                cell.style.borderRadius = "50%";
                cell.style.backgroundColor = "black"
            });

            grid.appendChild(cell);
        }
    }

}

