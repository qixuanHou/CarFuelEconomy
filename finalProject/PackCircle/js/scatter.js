
var margin = { top: 20, right: 30, bottom: 20, left: 40},
    //outerWidth = 1050,
    //outerHeight = 500,
    //width = outerWidth - margin.left - margin.right,
    //height = outerHeight - margin.top - margin.bottom;

    outerWidth = $('#scatter').innerWidth(),
    outerHeight = outerWidth*0.5,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

    //console.log(width);
    //console.log(height);

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Comb FE (Guide) - Conventional Fuel",
    yCat = "Comb CO2 Rounded Adjusted (as shown on FE Label)",
    colorCat = "Drive Desc";


d3.csv("data/data2.csv", function(data) {
  data = data.filter(function(row) {
    return row[yCat] >=0 && row[xCat] > 0;})
  data.forEach(function(d) {
    d[xCat] = +d[xCat];
    d[yCat] = +d[yCat];
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

 // var color = d3.scale.category10();

  var color = d3.scale.ordinal()
      .domain(["2-Wheel Drive, Rear", "All Wheel Drive", "2-Wheel Drive, Front", "4-Wheel Drive", "Part-time 4-Wheel Drive"])
      .range(["#1f77b4", "#666633", "#ff7f0e" , "#ff3399", "#9467bd", ]);




  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return d["Mfr Name"] + "-" + d["Carline"];
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  document.getElementById('scatter').setAttribute("style","width:"+ outerWidth + "px");
  document.getElementById('scatter').setAttribute("style","height:"+ outerHeight + "px");

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text("MPG");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", 5)
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[colorCat]); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { 

          return "translate(" + (10 +i * 90) + ",-10)";
        
         });

  legend.append("circle")
      .attr("r", 3.5)
      .attr("cx", 0)
      .attr("fill", color);

  legend.append("text")
      .attr("x", 5)
      .attr("dy", ".35em")
      .text(function(d) { 
        if (d == "2-Wheel Drive, Rear") {
          return "2-Rear-Wheel";
        } else if (d == "All Wheel Drive") {
          return "All-Wheel";
        } else if (d ==  "2-Wheel Drive, Front") {
          return "2-Front-Wheel";
        } else if (d == "4-Wheel Drive") {
          return "4-Wheel";
        } else {
          return "Part-time 4-Wheel";
        }
      });


  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});

$("#change").click( function(event) {
  event.preventDefault();
  filter();
});

function filter() {
  document.getElementById("scatter").innerHTML = "";
  var yCat = document.getElementById("filter").elements[0].value;
  
  d3.csv("data/data2.csv", function(data) {
    data = data.filter(function(row) {
      return row[yCat] >=0 && row[xCat] > 0;})
    data.forEach(function(d) {
      d[xCat] = +d[xCat];
      d[yCat] = +d[yCat];
    });

    var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
        xMin = d3.min(data, function(d) { return d[xCat]; }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
        yMin = d3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

  var color = d3.scale.ordinal()
      .domain(["2-Wheel Drive, Rear", "All Wheel Drive", "2-Wheel Drive, Front", "4-Wheel Drive", "Part-time 4-Wheel Drive"])
      .range(["#1f77b4", "#666633", "#ff7f0e" , "#ff3399", "#9467bd", ]);



    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          return d["Mfr Name"] + "-" + d["Carline"];
        });

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

    var svg = d3.select("#scatter")
      .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text("MPG");

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
      .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yCat);

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    objects.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .classed("dot", true)
        .attr("r", 5)
        .attr("transform", transform)
        .style("fill", function(d) { return color(d[colorCat]); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .filter(function(d) {
          if (currentNode.name != "Manufacturers") {
            // in manufacturer name level 
            if (currentNode.name.indexOf(" - ") == -1) {
                return (d["Mfr Name"] != currentNode.name);
            } else {  
                return (d["Mfr Name"] != currentNode.name.split(" - ")[0] || d["Carline Class Desc"] != currentNode.name.split(" - ")[1]);      
            }
          } else {
            return false;
          }
        })
        .attr("visibility", "hidden");

    var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
     .attr("transform", function(d, i) { 

          return "translate(" + (10 +i * 90) + ",-10)";
        
         });

  legend.append("circle")
      .attr("r", 3.5)
      .attr("cx", 0)
      .attr("fill", color);

  legend.append("text")
      .attr("x", 5)
      .attr("dy", ".35em")
      .text(function(d) { 
        if (d == "2-Wheel Drive, Rear") {
          return "2-Rear-Wheel";
        } else if (d == "All Wheel Drive") {
          return "All-Wheel";
        } else if (d ==  "2-Wheel Drive, Front") {
          return "2-Front-Wheel";
        } else if (d == "4-Wheel Drive") {
          return "4-Wheel";
        } else {
          return "Part-time 4-Wheel";
        }
      });

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
          .attr("transform", transform);
    }

    function transform(d) {
      return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
    }
  });
}