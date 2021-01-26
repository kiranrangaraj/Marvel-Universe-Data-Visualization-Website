var svgHeight = 450;
var svgWidth = 1100;

var chartMargin = {
    top: 5,
    bottom: 40,
    left: 35,
    right: 15
};

var chartWidth = svgWidth - (chartMargin.left + chartMargin.right);
var chartHeight = svgHeight - (chartMargin.top + chartMargin.bottom);

var svg = d3
    .select(".container")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

var tooltip = d3.select("#body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("./firstAppearances.csv").then((characterData) => {
    console.log(characterData);

    characterData.forEach((data) => {
        parseFloat(data.Year);
        //data.capture_rate = +data.capture_rate;
        //data.flee_rate = +data.flee_rate;
        data.TotalNewCharacters = +data.TotalNewCharacters;
    });

    var xBandScale = d3.scaleBand()
        .domain(characterData.map(data => data.Year))
        .range([0, chartWidth]);
    //.padding(0);

    var yLinearScale = d3.scaleLinear()
        .domain([0, 600])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(20);

    var barSpacing = 1;
    var scaleY = 0.675;

    var barWidth = (chartWidth - (barSpacing * (characterData.length - 1))) / characterData.length;

    chartGroup.append("g")
        .call(leftAxis);
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d){
          return "rotate(-65)";
          }); 

    chartGroup.selectAll(".bar")
        .data(characterData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", data => barWidth)
        .attr("height", data => data.TotalNewCharacters * scaleY)
        .attr("x", (data, i) => i * (barWidth + barSpacing))
        .attr("y", data => chartHeight - data.TotalNewCharacters * scaleY)
        .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.TotalNewCharacters) + "Characters" + "<br>" + (d.PercentofTotalCharacters) + "%");
      })
   
    chartGroup.append("text")
        .attr("class", "label")
        .attr("y", barHeight / 2)
        .attr("dy", ".45em") //vertical align middle
        .text(function(d){
            return d.TotalNewCharacters;
        }).each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));

});


}).catch(function (error) {
    console.log(error)
});
