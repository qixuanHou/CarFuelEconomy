
var margin1 = {top: 20, right: 40, bottom: 185, left: 0};
var width1 =  500 - margin1.left - margin1.right;
var height1 = 750 - margin1.top - margin1.bottom;
    

// pre-cursors
var sizeForCircle = function(d) {
  // TODO: modify the size
  return 8 * d["Serving Size Weight"];
}



// setup x
var xValue1 = function(d) { return d["Calories"];}, // data -> value
    xScale1 = d3.scale.linear().range([0, width1]), // value -> display
    xMap1 = function(d) { return xScale1(xValue1(d));}, // data -> display
    xAxis1 = d3.svg.axis().scale(xScale1).orient("bottom");



// setup y
var yValue1 = function(d) { return d["Sugars"];}, // data -> value
    yScale1 = d3.scale.linear().range([height1, 0]), // value -> display
    yMap1 = function(d) { return yScale1(yValue1(d));}, // data -> display
    yAxis1 = d3.svg.axis().scale(yScale1).orient("left").ticks(10);

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg1 = d3.select(".scatterplot").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", "translate( 30," + margin1.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    

// load data
d3.csv("cereal.csv", function(error, data) {
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
      && row["Display Shelf"] != null && row["Display Shelf"] >= 0; });


  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Sugars = +d.Sugars;
    d.Calories = +d.Calories;
    d["Serving Size Weight"] = +d["Serving Size Weight"];
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale1.domain([0, d3.max(data, xValue1)+1]);
  yScale1.domain([0, d3.max(data, yValue1)+1]);

  // x-axis
  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(xAxis1)
    .append("text")
      .attr("class", "label")
      .attr("x", width1)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Calories");

  // y-axis
  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis1)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Sugars");



  // draw dots
  svg1.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap1)
      .attr("cy", yMap1)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {

          // TODO: show the tool tip
          tooltip.style("opacity", 1);

          // TODO: fill to the tool tip with the appropriate data
          tooltip.html("Cereal Name: " + d["Cereal Name"] + "<br/>" + "Sugars: " + d["Sugars"] + "<br/> Calories: " + d["Calories"])
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px");

          // TODO: update text in our custom nutrition label
          d3.select("#nutrition-label-name").text(d["Cereal Name"]);
          d3.select("#nutrition-label-calories").text(d["Calories"]);
          d3.select("#nutrition-label-sugars").text(d["Sugars"]);
        
      })
      // TODO: change color the bar
      .on("click", function(d) {
          tooltip.style('opacity', 0);
          d3.selectAll(".bar").transition() 
            .duration(500)
            .style("fill", function(e) {

              if(d["Calories"] < e.values.avg) {
                  return "blue";
              }
            })
      })


      .on("mouseout", function(d) {
          // TODO: hide the tooltip
          tooltip.style('opacity', 0);

          // TODO: change color the nodes
          d3.selectAll(".bar").transition()
            .duration(500)
            .style("fill", function(e) {
              return "black";
            })

      });

  // draw legend
  var legend = svg1.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-250," + i*20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width1 - 180)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width1 - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
});
