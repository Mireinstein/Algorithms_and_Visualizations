const SVG_NS = "http://www.w3.org/2000/svg";

function Graph(id) {
    this.id = id;            // (unique) ID of this graph
    this.vertices = [];      // set of vertices in this graph
    this.edges = [];         // set of edges in this graph
    this.nextVertexID = 0;   // ID to be assigned to next vtx
    this.nextEdgeID = 0;     // ID to be assigned to next edge
    
    // create and return a new vertex at a given location
    this.createVertex = function (x, y) {
    const vtx = new Vertex(this.nextVertexID, this, x, y);
    this.nextVertexID++;
	  return vtx;
    }

    // add vtx to the set of vertices of this graph, if the vtx is not
    // already stored as a vertex
    this.addVertex = function(vtx) {
	if (!this.vertices.includes(vtx)) {
	    this.vertices.push(vtx);
	    console.log("added vertex with id " + vtx.id);
	} else {
	    console.log("vertex with id " + vtx.id + " not added because it is already a vertex in the graph.");
	}
    }

    // create and return an edge between vertices vtx1 and vtx2;
    // returns existing edge if there is already an edge between the
    // two vertices
    this.addEdge = function(vtx1, vtx2) {
	if (!this.isEdge(vtx1, vtx2)) {
	    const edge = new Edge(vtx1, vtx2, this.nextEdgeID);
	    this.nextEdgeID++;
	    vtx1.addNeighbor(vtx2);
	    vtx2.addNeighbor(vtx1);
	    this.edges.push(edge);
	    console.log("added edge (" + vtx1.id + ", " + vtx2.id + ")");
	    return edge;
	} else {
	    console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
	    return null;
	}
    }

    // determine if vtx1 and vtx2 are already an edge in this graph
    this.isEdge = function (vtx1, vtx2) {
	return (this.getEdge(vtx1, vtx2) != null);
    }

    // return the edge object corresponding to a pair (vtx1, vtx2), or
    // null if no such edge is in the graph
    this.getEdge = function (vtx1, vtx2) {
	for(const edge of this.edges) {
	    if (edge.equals(vtx1, vtx2)) {
		return edge;
	    }
	}

	return null;
    }

    // return a string representation of the adjacency lists of the
    // vertices in this graph
    this.adjacencyLists = function () {
	let str = '';
	for (const vtx of this.vertices) {
	    str += vtx.id + ':';
	    for (const nbr of vtx.neighbors) {
		str += (' ' + nbr.id);
	    }
	    str += '<br>';
	}
	return str;
    }
}

// an object representing a vertex in a graph
// each vertex has an associated unique identifier (id), the graph
// containing the vertex, as well as x,y coordinates of the vertex's
// physical location
function Vertex(id, graph, x, y) {
    this.id = id;        // the unique id of this vertex
    this.graph = graph;  // the graph containing this vertex
    this.x = x;          // x coordinate of location
    this.y = y;          // y coordinate of location
    
    this.neighbors = []; // the adjacency list of this vertex

    // add vtx as a neighbor of this vertex, if it is not already a
    // neighbor
    this.addNeighbor = function (vtx) {
	if (!this.neighbors.includes(vtx)) {
	    this.neighbors.push(vtx);
	}
    }

    // remove vtx as a neighbor of this vertex
    this.removeNeighbor = function (vtx) {
	const index = this.neighbors.indexOf(vtx);
	if (index != -1) {
	    this.neighbors.splice(index, 1);
	}
    }

    // determine if vtx is a neighbor of this vertex
    this.hasNeighbor = function (vtx) {
	return this.neighbors.includes(vtx);
    }
}

// an object representing an edge in a graph
function Edge (vtx1, vtx2, id) {
    this.vtx1 = vtx1;   // first endpoint of the edge
    this.vtx2 = vtx2;   // second endpoint of the edge
    this.id = id;       // the unique identifier of this edge

    // determine if this edge has vtx1 and vtx2 as endpoints
    this.equals = function (vtx1, vtx2) {
	return (this.vtx1 == vtx1 && this.vtx2 == vtx2) || (this.vtx1 == vtx2 && this.vtx2 == vtx1);
    }

    this.weight=function(){
      x1=vtx1.x;
      y1=vtx1.y;
      x2=vtx2.x;
      y2=vtx2.y;
     let distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      return distance;
  }

   // Compare this edge to another. The comparison is according to
  // lexicographical ordering. 
  this.compareTo = function (e) {
      if (this.weight() > e.weight()) {
          return 1;
      }
  
      if (this.weight() < e.weight()) {
          return -1;
      }
      return 0;
      }

}

// an object to visualize and interact with a graph
function GraphVisualizer (graph, svg, text) {
    this.graph = graph;      // the graph we are visualizing
    this.svg = svg;          // the svg element we are drawing on
    this.text = text;        // a text box

    // define the behavior for clicking on the svg element
    this.svg.addEventListener("click", (e) => {
	// create a new vertex
	this.createVertex(e);
    });


    this.prim = null;

    // sets of highlighted/muted vertices and edges
    this.highVertices = [];
    this.lowVertices = [];
    this.highEdges = [];
    this.lowEdges = [];

    // create svg group for displaying edges
    this.edgeGroup = document.createElementNS(SVG_NS, "g");
    this.edgeGroup.id = "graph-" + graph.id + "-edges";
    this.svg.appendChild(this.edgeGroup);

    // create svg group for displaying vertices
    this.vertexGroup = document.createElementNS(SVG_NS, "g");
    this.vertexGroup.id = "graph-" + graph.id + "-vertices";
    this.svg.appendChild(this.vertexGroup);

    this.vertexElts = [];   // svg elements for vertices
    this.edgeElts = [];     // svg elements for edges

    // create a new vertex 
    this.createVertex = function (e) {
	const rect = this.svg.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const vtx = graph.createVertex(x, y);
	this.addVertex(vtx);
	this.graph.addVertex(vtx);
	this.updateTextBox(graph.adjacencyLists());
    }

    // add a vertex to the visualization by creating an svg element
    this.addVertex = function (vtx) {
	const elt = document.createElementNS(SVG_NS, "circle");
	elt.classList.add("vertex");
	elt.setAttributeNS(null, "cx", vtx.x);
	elt.setAttributeNS(null, "cy", vtx.y);

	elt.addEventListener("click", (e) => {
	    e.stopPropagation();
	    this.clickVertex(vtx);
	});

	this.vertexGroup.appendChild(elt);
	this.vertexElts[vtx.id] = elt;
    }

    
    // method to be called when a vertex is clicked
    this.clickVertex = function (vtx) {
	console.log("You clicked vertex " + vtx.id);

	// check if any other highlighted vertices
	if (this.highVertices.length == 0) {
	    this.highVertices.push(vtx);
	    this.highlightVertex(vtx);
	} else if (this.highVertices.includes(vtx)) {
	    this.unhighlightVertex(vtx);
	    this.highVertices.splice(this.highVertices.indexOf(vtx), 1);
	} else {
	    const other = this.highVertices.pop();
	    let e = this.graph.addEdge(other, vtx);
	    if (e != null) {
		this.addEdge(e);
	    }
	    this.unhighlightVertex(other);
	}
    }

    // add an edge to the visualization
    this.addEdge = function (edge) {
	const vtx1 = edge.vtx1;
	const vtx2 = edge.vtx2;
	const edgeElt = document.createElementNS(SVG_NS, "line");
	edgeElt.setAttributeNS(null, "x1", vtx1.x);
	edgeElt.setAttributeNS(null, "y1", vtx1.y);
	edgeElt.setAttributeNS(null, "x2", vtx2.x);
	edgeElt.setAttributeNS(null, "y2", vtx2.y);
	edgeElt.classList.add("edge");
	this.edgeElts[edge.id] = edgeElt;
	this.edgeGroup.appendChild(edgeElt);
	this.updateTextBox(this.graph.adjacencyLists());
    }

    this.updateTextBox = function (str) {
	this.text.innerHTML = str;
    }

    /*********************************************************
     * Methods to (un)highlight and (un) mute vertices/edges *
     *********************************************************/


    this.highlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("highlight");
    }

    this.unhighlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("highlight");	
    }

    this.muteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("muted");
    }

    this.unmuteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("muted");
    }

    this.highlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("highlight");	
    }

    this.unhighlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("highlight");	
    }

    this.muteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("muted");
    }

    this.unmuteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("muted");
    }

    this.muteAllVertices = function () {
	for (let vtx of this.graph.vertices) {
	    this.muteVertex(vtx);
	}
    }

    this.muteAllEdges = function () {
	for (let e of this.graph.edges) {
	    this.muteEdge(e);
	}
    }

    this.muteAll = function () {
	this.muteAllVertices();
	this.muteAllEdges();
    }

    this.unmuteAllVertices = function () {
	for (let vtx of this.graph.vertices) {
	    this.unmuteVertex(vtx);
	}
    }

    this.unmuteAllEdges = function () {
	for (e of this.graph.edges) {
	    this.unmuteEdge(e);
	}
    }

    this.unmuteAll = function () {
	this.unmuteAllVertices();
	this.unmuteAllEdges();
    }
        
}

function Prim(graph, vis) {
    this.graph = graph;
    this.vis = vis;
    this.V= graph.vertices;
    this.E= graph.edges;

    this.startVertex=null;

    //choose random starting vertix and put it in S
    this.curVtx=null;
    this.visited=[];

    //priority queue to keep track of edges
    this.priorityQueue=[];

    //set of MST edges
    this.mST=[]
 
    //triggers prim's algorithms
    this.start=function(){
      this.startVertex = vis.highVertices.pop();
	
      if (this.startVertex == null) {
          vis.updateTextBox("Please select a starting vertex and start again.");
          return;
      }
        
      this.curVtx = this.startVertex;
      this.visited.push(this.startVertex);
  
      this.vis.muteAll();
      this.vis.unmuteVertex(this.startVertex);

      //add all neighbours of current vertex to the priority queue
      for (let vtx of this.curVtx.neighbors) {
        let edge=this.graph.getEdge(this.curVtx,vtx)
        this.priorityQueue.push(edge);
        }
    }
    
  
    //execute each step of prim's algorithm
  this.step = function () {
   
	}

  this.animate=function(){
    while(this.priorityQueue.length>0){
         sort(this.priorityQueue);
         
         let edge=this.priorityQueue.shift();

         //extract the nodes
         let v=edge.vtx2;
         let u=edge.vtx1;

         //check which node is not in the spanning tree
         if (!this.visited.includes(v) && this.visited.includes(u) ){
          this.mST.push(edge);
          this.visited.push(v);
         // vis.unmuteEdge(edge)
          vis.highlightEdge(edge)
          for (let vtx of v.neighbors) {
            if (!this.visited.includes(vtx)) {
             let neighborEdge=this.graph.getEdge(v,vtx);
             this.priorityQueue.push(neighborEdge);
            }
           }
         }

         else if (this.visited.includes(v) && !this.visited.includes(u) ){
            this.mST.push(edge);
            this.visited.push(u);
           // vis.unmuteEdge(edge)
            vis.highlightEdge(edge)
            for (let vtx of u.neighbors) {
              if (!this.visited.includes(vtx)) {
               let neighborEdge=this.graph.getEdge(u,vtx);
               this.priorityQueue.push(neighborEdge);
              }
             }
         }
        }       
    
    }

}

function Kruskal(graph, vis){
    this.graph = graph;
    this.vis = vis;
    this.V= graph.vertices;
    this.E= graph.edges;
    this.visited=[];
 
    //triggers prim's algorithms
    this.start=function(){
     vis.muteAll();   
     sort(this.E);
    }
    
  
    //execute each step of prim's algorithm
  this.step = function () {
   
	}

  this.animate=function(){
    for(let edge of this.E){
        let u=edge.vtx1;
        let v=edge.vtx2;
     if (((!this.visited.includes(u) && this.visited.includes(v)) || (this.visited.includes(u) && !this.visited.includes(v)))||
     (!this.visited.includes(u) && !this.visited.includes(v))){
        vis.unmuteEdge(edge)
        vis.highlightEdge(edge)

        if (!this.visited.includes(v)){
            this.visited.push(v);
           }
    
           else if (!this.visited.includes(u)){
              this.visited.push(u);
            
           }
     }
     
    }
 
 }
}

//sort the edges in increasing order of the weights
function sort(queue) {
    queue.sort(function(a, b) {
      return a.weight() - b.weight();
    });
  }
const svg = document.querySelector("#graph-box");
const text = document.querySelector("#graph-text-box");
const graph = new Graph(0);
const gv = new GraphVisualizer(graph, svg, text);
const prim = new Prim(graph, gv);
const kruskal= new Kruskal(graph,gv)

