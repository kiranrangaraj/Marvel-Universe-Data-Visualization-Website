var diameter = 725,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.cluster()
    .size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0.5))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("body").append("svg")
    .attr("viewBox", `-87 -20 900 760`)
  .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

d3.csv("./powers.csv", function(error, credits) {
  if (error) throw error;
  
  var classes = creditsToClasses( credits );

  var root = packageHierarchy(classes)
      .sum(function(d) { return d.size; });

  cluster(root);

  link = link
    .data(packageImports(root.leaves()))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line);

  node = node
    .data(root.leaves())
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { 
		if( d.data.key != "Name")
			return d.data.key; 
	  })
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted);
});

function mouseovered(d) {
  node
      .each(function(n) { n.target = n.source = false; });

  link
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  node
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });
}

function mouseouted(d) {
  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--target", false)
      .classed("node--source", false);
}

// Construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
	if( typeof d.name != 'undefined')
		find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) 
		d.data.imports.forEach(function(i) {
			var input = map[d.data.name];
			var mapi = map[i];
			if( typeof mapi != 'undefined'){
				var path = input.path(mapi);
				imports.push(path);
			}
		});
  });

  return imports;
}

function creditsToClasses( credits){
 var classArray = [];

 for( var column =0; column < credits.columns.length; column++){
	 var classObj = {};
	 classObj.name =  credits.columns[column];
	 classObj.size = 1;
	 classObj.imports=[];
	 classArray.push(classObj);
 }
 for(var row =1; row < credits.length; row++){
 	var classObj = {};
	var contributor = credits[row];
	classObj.name = contributor["Name"];
	classObj.imports=[];

	var size =1;
	for( var column = 0; column < credits.columns.length;column++){
		if( contributor[credits.columns[column]]==1){
			classObj.imports.push(credits.columns[column]) ;
			size++;
		}
	}
	classObj.size = size;

	classArray.push(classObj);

 }
 return classArray;
}