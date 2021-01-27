// set the dimensions and margins of the graph
var width = 530
    height = 345
    margin = 10

// The radius of the donut plot is half the width or half the height (smallest one).
var radius = Math.min(width, height) / 2.3 - margin

// Append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Input data
var data = {"No Dual, Good (5.90%)": 647, "No Dual, Bad (4.32%)": 474, "No Dual, Neutral (3.56%)": 390, "Public, Good (14.85%)": 1628, "Public, Bad (13.24%)": 1452, 
"Public, Neutral (6.44%)": 706, "Secret, Good (14.71%)": 1613, "Secret, Bad (29.39%)": 3223, "Secret, Neutral (7.46%)": 818}

// Set the color scale
var color = d3.scaleOrdinal()
  .domain(["No Dual, Good (5.90%)", "No Dual, Bad (4.32%)", "No Dual, Neutral (3.56%)", "Public, Good (14.85%)", "Public, Bad (13.24%)", 
  "Public, Neutral (6.44%)", "Secret, Good (14.71%)", "Secret, Bad (29.39%)", "Secret, Neutral (7.46%)"])
  .range(["#806f00", "#9e9a26", "#ede732", "#1d4003", "#326909", "#82d941", "#590000", "#910707", "#cf5f5f"]);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    .text( function(d) { console.log(d.data.key) ; return d.data.key } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })