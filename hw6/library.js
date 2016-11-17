function drawBars(data) {

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Department + d["Course Number"]); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.GPA); })
      .attr("height", function(d) { 
        if (d.GPA < 0) {
          return height - y(0); 
        } else {
          return height - y(d.GPA); 
        }
      });
}

function drawXAxis(){
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text");
}

function drawYAxis() {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("GPA");
}

function filter() {
      var svg = d3.select("body").transition();
      var filterGPA = document.getElementById("filter").elements[0].value;
      var department = document.getElementById("filter").elements[1].value;
      svg.selectAll(".bar")
        .duration(1000)
        .delay(100)
        .attr("height", function(d) { 
          if (d.GPA >= filterGPA && d.Department == department) {
            return height - y(d.GPA); 
          } else {
            return height - y(0); 
          }
        })
}