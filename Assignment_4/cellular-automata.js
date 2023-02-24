
function decimalToBinary8Bit(decimal) {
    let binary = "";
    for (let i = 7; i >= 0; i--) {
      if (decimal >= Math.pow(2, i)) {
        binary += "1";
        decimal -= Math.pow(2, i);
      } else {
        binary += "0";
      }
    }
    return binary;
}

function decimalToBinary3Bit(decimal) {
    let binary = "";
    for (let i = 2; i >= 0; i--) {
      if (decimal >= Math.pow(2, i)) {
        binary += "1";
        decimal -= Math.pow(2, i);
      } else {
        binary += "0";
      }
    }
    return binary;
}

function gatherState(i,config){
    //return left cell+currentCell+rightCell
    oldState="";

    //if we have one cell
    if(config.length===1){
     return config[0]+""+config[0]+""+config[0];
    }
    
    //if it's the first cell, left neighbour is last cell
    else if(i===0){
     oldState=config[config.length-1]+""+config[i]+""+config[1];
    }

    //if it's the last cell, right neighbor is the first cell
    else if(i===config.length-1){
        oldState=config[config.length-2]+""+config[i]+""+config[0];
    }
    
    // a cell in between other cells
    else{
        oldState=config[i-1]+""+config[i]+""+config[i+1];
    }
    return oldState;
}

function applyRule(config,rule){

    rule=decimalToBinary8Bit(rule);

    const ruleMap = new Map();

    for(let i=0; i<8;i++){
        state=decimalToBinary3Bit(i);
        output=rule[7-i];
        ruleMap.set(state, output);
    }

    const newConfig=[];

    for(let i=0;i<config.length;i++){
        oldState=""+gatherState(i,config);
        newState=ruleMap.get(oldState);
        
        if(newState==="1"){
        newConfig[i]=1;
        }
        else{
            newConfig[i]=0;
        }
    }

    return newConfig;

}

function displayPage(startingConfig){
     //display page
    const grid=document.getElementById("automata-visualizer");
    grid.style.display="grid";
    grid.style.gridTemplateRows = "repeat(60, 1fr)";
    grid.style.gridTemplateColumns = "repeat(60, 1fr)";

    for (let i=0;i<60;i++){
        for(let j=0;j<60;j++){
        let cell=document.createElement("div");
        cell.id="cell-"+i+"-"+j;
        
        cell.style.height = "10px";
        cell.style.width = "10px";
        cell.style.border = "1px solid black"; // Add a black border to the cell

        if(i===0){
          if(startingConfig[j]===1){
            cell.style.backgroundColor="rgb(0,0,0)";
          }
          else{
            cell.style.backgroundColor="rgb(255,255,255)";
          }
        }
        else{
            cell.style.backgroundColor="rgb(255,255,255)";
        }
        grid.appendChild(cell);
        }
    }
}

function transition(config,rowNumber){
 for(let j=0;j<60;j++){
   let cell=document.getElementById("cell-"+rowNumber+"-"+j);

    if(config[j]===1){
      cell.style.backgroundColor="rgb(0,0,0)"
    }
  }
  setTimeout(() => {}, 0);
}

function go(){
    let rule = document.getElementById("ruleBox").value;
    const startingConfig=[0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0];
    let newConfig=applyRule(startingConfig,rule);
    for(let i=1;i<60;i++){
        newConfig=applyRule(newConfig,rule);
        transition(newConfig,i);
    }
}



module.exports = { applyRule };