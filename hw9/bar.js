var margin = {top: 20, right: 50, bottom: 185, left: 23},
    width = 500 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;



var svg = d3.select(".barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Setting the range for X */
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

/* Setting the range for Y */
var y = d3.scale.linear()
    .range([height, 0]);

/* Creating the X Axis */
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

/* Creating the Y Axis */
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    

/* Load data from file with a specific type function */
d3.csv("cereal.csv", type, function(error, data) {
    data = data.filter(function(row) {
    return row.Calories >= 0 && row.Calories != null 
      && row.Sugars >= 0 && row.Sugars != null 
      && row["Cereal Name"] != null
      && row.Manufacturer != null
      && row.Type != null
      && row["Protein (g)"] != null && row["Protein (g)"] >= 0 
      && row.Fat >= 0 && row.Fat != null 
      && row.Sodium >= 0 && row.Sodium != null 
      && row.Carbs >= 0 && row.Carbs != null 
      && row["Dietary Fiber"] != null && row["Dietary Fiber"] >= 0 
      && row.Potassium >= 0 && row.Potassium != null 
      && row["Serving Size Weight"] != null && row["Serving Size Weight"] >= 0 
      && row["Cups per Serving"] != null && row["Cups per Serving"] >= 0 
      && row["Vitamins and Minerals"] != null && row["Vitamins and Minerals"] >= 0 
      && row["Display Shelf"] != null && row["Display Shelf"] >= 0 
      ; });



  	if (error) throw error;
  	/* Setting the domain for X and Y */
  	x.domain(data.map(function(d) {return d.Manufacturer;}));
  	y.domain([0, d3.max(data, function(d) { return d.Calories; })]);


	var nestedData = d3.nest()
  		.key(function(d) { return d.Manufacturer; })
  		.rollup(function(v) { return {
    	avg: d3.mean(v, function(d) { return d.Calories; }) }; })
  		.entries(data);

  	/* Drawing the X and Y axes */
  	drawXAxis();
  	drawYAxis();
  	/* Drawing the Bars */
  	drawBars(nestedData);

});

function type(d) {
  d.Calories = +d.Calories;
  return d;
}



function drawXAxis(){
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

 }
  
function drawYAxis() {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Calories");
}



function drawBars(data) {
  svg.selectAll(".barChart")
      .data(data)
      .enter().append("rect")
      .attr("id", "oneBar")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.values.avg); })
      .attr("height", function(d) { return height - y(d.values.avg); })
      .on("click", function(d) {

          // TODO: show the tool tip
          tooltip.style("opacity", 1);
          
          // TODO: expand all nodes with the same manufacturer
          d3.selectAll(".dot").transition() 
            .duration(500)
            .style("opacity", function(e) {
              
              if (d.key != e.Manufacturer) {
                 return 0.25;
              }
            })
      })

        .on("mouseout", function(d) {
          // TODO: hide the tooltip
          tooltip.style('opacity', 0);

          // TODO: resize the nodes
          d3.selectAll(".dot").transition()
            .duration(500)
            .style("opacity", function(e) {
              return 1;
            })

      });
}
