const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;

const svg =document.querySelector("#canvas");
const pointSet= new PointSet();
const edgeSet=new EdgeSet();
const mstViewer=new MSTViewer(svg,pointSet,edgeSet);
const primButton=document.querySelector("#Prim")
const kruskalButton=document.querySelector("#Kruskal")

//for edge making
let lastClickedPoint = null;

//add actionListeners
window.onload = function () {
    const rect = svg.getBoundingClientRect();
    svg.addEventListener("click", (e) => {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        pointSet.addNewPoint(x,y);
        let point=document.createElementNS(SVG_NS,"circle")
        point.classList.add("points")
        point.setAttributeNS(null,"cx",x);
        point.setAttributeNS(null,"cy",y);
        point.setAttributeNS(null,"id","c"+pointSet.points[pointSet.points.length-1].id)

        //action Listener for edge making
        point.addEventListener("click", (e)=>{
            e.stopPropagation()
            makeEdge(point)
        })

        //add the point to the svg
        svg.appendChild(point);
    })

    kruskalButton.addEventListener('click', () => {
        kruskal()
      });

    primButton.addEventListener('click', () => {
        prim();
      });
    
  };


// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. 
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }


    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}

function Edge(point1, point2,id){
    this.point1=point1;
    this.point2=point2;
    this.id=id;

    this.weight=function(){
        x1=point1.x;
        y1=point1.y;
        x2=point2.x;
        y2=point2.y;
       let distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance;
    }

     // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. 
    this.compareTo = function (e) {
        if (this.weight > e.weight) {
            return 1;
        }
    
        if (this.weight < e.weight) {
            return -1;
        }
        return 0;
        }

}

// An object that represents a set of edges in the plane. The `sort`
// function sorts the edges according to the `Edge.compareTo`
// function. 
function EdgeSet () {
    this.edges = [];
    this.curEdgeID = 0;

    // create a new edge and add it to this
    // edgeSet
    this.addNewEdge = function (point1, point2) {
	this.edges.push(new Edge(point1, point2, this.curEdgeID));
	this.curEdgeID++;
    }

    // add an existing edge to this  edgeSet
    this.addEdge = function (edge) {
	this.edges.push(edge);
    }

    // sort the edges in this.edges
    this.sort = function () {
	this.edges.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the edges in this.edges
    this.reverse = function () {
	this.edges.reverse();
    }

    // get the number of edges
    this.size = function () {
	return this.edges.length;
    }
}

  //function for making this point part of an edge
function makeEdge(point){

    //make an abstract represantation of the point
        //add edge to set of edges///
        let x =point.getAttribute('cx')
        let y =point.getAttribute('cy')

        //cut off the c that was added to make an id for circles
        let id=parseInt(point.getAttribute("id").slice(1))

        //create a representation of a 2-D point
        point=new Point(x,y,id)

        //1. highlight the point
        mstViewer.highlightPoint(point)
    

        //2. if lastClicked isn't null, , add this edge to set of edges set,draw segment between two points, unhighlight both points, lastClicked to null,
        if (lastClickedPoint!=null){

            //add the edge to the set of edges
            edgeSet.addNewEdge(lastClickedPoint,point);

           //draw the edge
           mstViewer.drawSegment(lastClickedPoint,point);

           //unhighlight the last clicked keeping this one highlighted
           mstViewer.unHighlightPoint(lastClickedPoint);
           mstViewer.unHighlightPoint(point);

           //set lastClicked to null
           lastClickedPoint=null;

        }
          //3. else set this to lastclicked
        else{
            lastClickedPoint=point;
        }

      
        
    }


function MSTViewer(svg, pointSet, edgeSet) {
    this.svg = svg;  // an svg object where the visualization is drawn
    this.pointSet = pointSet;
    this.edgeSet=edgeSet;    // a point set of the points to be visualized
 

    this.drawSegment=function(point1,point2){
        let segment=document.createElementNS(SVG_NS,"line")
        segment.classList.add("segment");
        segment.setAttributeNS(null,"id",point1.id+"_"+point2.id);
        segment.setAttributeNS(null,"x1",point1.x);
        segment.setAttributeNS(null,"y1",point1.y);
        segment.setAttributeNS(null,"x2",point2.x);
        segment.setAttributeNS(null,"y2",point2.y);
        svg.appendChild(segment);
    }

    this.removeSegment=function(point1,point2){
        segment=document.getElementById(point1.id+"_"+point2.id);
        if(segment){
            segment.classList.remove("segment");
            svg.removeChild(segment);
        }
        
    }

    this.highlightSegment=function(point1,point2){
        let segment=document.createElementNS(SVG_NS,"line")
        segment.classList.add("highlight");
        segment.setAttributeNS(null,"id",point1.id+"_"+point2.id);
        segment.setAttributeNS(null,"x1",point1.x);
        segment.setAttributeNS(null,"y1",point1.y);
        segment.setAttributeNS(null,"x2",point2.x);
        segment.setAttributeNS(null,"y2",point2.y);
        svg.appendChild(segment);
    }

    this.unHighlightSegment=function(point1,point2){
        segment=document.getElementById(point1.id+"_"+point2.id);
        if(segment){
            segment.classList.remove("highlight");
            svg.removeChild(segment);
        }
    }

    //takes a representation of a point
    this.highlightPoint=function(point){
      let dot=document.querySelector("#c"+point.id);
      dot.classList.add("highlight");
    }

    //takes a representation of a point
    this.unHighlightPoint=function(point){
        let dot=document.querySelector("#c"+point.id);
        dot.classList.remove("highlight");
      }

      this.clear=function(){
        location.reload();
      }
}

function kruskal(){
    //pointSet and edgeSet are objects that contain arrays of points edges respectively

    let points=pointSet.points;

    //points that are now connected
    let spanningTree=[];
    edgeSet.sort()
    let edges=edgeSet.edges;

    alert(edges.length)
    
    //while the set of edges is non-empty and spanning Tree is not spanning
    while(edges.length>0 && spanningTree.length<=points.length){

        //remove the lightest edge
        let edge=edges.shift();

        let u=edge.point1;
        let v=edge.point2;

        //if u and v are in same component, do nothing
        if (spanningTree.includes(u) && spanningTree.includes(v)) {
            // draw segment
            mstViewer.highlightSegment(u, v);
            
            // remove segment after 1 second (1000 milliseconds)
            setTimeout(() => {
              mstViewer.unHighlightSegment(u, v);
            }, 1000);
          }
        //highlight this edge and add u,v to the 
        else{

            //make u and v into one component
            if(!spanningTree.includes(u)){
                spanningTree.push(u);

            }

            if(!spanningTree.includes(v)){
                spanningTree.push(v);

            }
           
            //highlight the edge
            mstViewer.highlightSegment(u,v)
            
        }
     
    }

}


function prim(mstViewer,pointSet,edgeSet){
     //pointSet and edgeSet are objects that contain arrays of points edges respectively
    alert("Still Working on it")

}

