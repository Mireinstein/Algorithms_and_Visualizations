
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
    return oldtate;
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

module.exports = { applyRule };