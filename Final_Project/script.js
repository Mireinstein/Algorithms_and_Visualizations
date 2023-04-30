const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;


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


function MSTViewer(svg, ps) {
    this.svg = svg;  // an svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized
    const rect = svg.getBoundingClientRect();
    this.loadPage=function(){
        svg.addEventListener("click", (e) => {
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            ps.addNewPoint(x,y);
            let point=document.createElementNS(SVG_NS,"circle")
            point.classList.add("points")
            point.setAttributeNS(null,"cx",x);
            point.setAttributeNS(null,"cy",y);
            point.setAttributeNS(null,"id","c"+ps.points[ps.points.length-1].id)
            svg.appendChild(point);
        })

        kruskalButton.addEventListener('click', () => {
            Kruskal(MSTViewer)
          });

        primButton.addEventListener('click', () => {
            Prim(MSTViewer);
          });
        

    }

    this.drawSegment=function(point1,point2){
        let segment=document.createElementNS(SVG_NS,"line")
        segment.classList.add("ch-segment");
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

    this.highlightPoint=function(point){
      let dot=document.querySelector("#c"+point.id);
      dot.classList.add("highlight");
    }

    this.unHighlightPoint=function(point){
        let dot=document.querySelector("#c"+point.id);
        dot.classList.remove("highlight");
      }

      this.clear=function(){
        location.reload();
      }
}

function Prim(MSTViewer){

}

function Kruskal(MSTViewer){

}


  
const svg =document.querySelector("#canvas");
const pointSet= new PointSet();
const mstViewer=new MSTViewer(svg,pointSet);
const prim= new Prim(pointSet,MSTViewer);
const kruskal=new Kruskal(pointSet,MSTViewer);
const primButton=document.querySelector("#Prim")
const kruskalButton=document.querySelector("#Kruskal")
