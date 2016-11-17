var marginRadar = {top: 75, right: 175, bottom: 75, left: 75},
	// widthRadar = Math.min(700, window.innerWidth - 10) - marginRadar.left - marginRadar.right,
	// heightRadar = Math.min(widthRadar, window.innerHeight - marginRadar.top - marginRadar.bottom - 20);

	widthRadar = ($('#radar').innerWidth() - marginRadar.left - marginRadar.right)*0.6,
	heightRadar = widthRadar;

	//console.log($('#radar').innerWidth());
	//console.log(heightRadar);

// var radarData;

// d3.csv("data/data_1.csv", function(data) {
// 	data = data.filter(function(row) {
// 		if((row["Division"] == "Aston Martin Lagonda Ltd" && row["Index (Model Type Index)"] == 3) ||
// 		(row["Division"] == "MAZDA" && row["Index (Model Type Index)"] == 10) ||
// 		(row["Division"] == "FIAT" && row["Index (Model Type Index)"] == 41))
// 		return row;
// 	});
// 	radarData = data;
// 	// console.log(data[0]);

// 	var test = [];
// 	data.forEach(function(d) {
// 		var attri = [];
// 		attri.push({"axis": "Engine Displacement", "value": d["Eng Dis Scale"], "model": d["Division"]});
// 		attri.push({"axis": "#Cyl", "value": d["# Cyl"] / 12, "model": d["Division"]});
// 		attri.push({"axis": "Fuel Efficiency Rating", "value": d["FE Rating (1-10 rating on Label)"] / 10, "model": d["Division"]});
// 		attri.push({"axis": "Gears", "value": d["# Gears"] / 8, "model": d["Division"]});
// 		// attri.push({"axis": "Combined MPG", "value": d["Cmb MPG"] / 45, "model": d["Division"]});

// 		test.push({key: d["Division"], values: attri});
// 	});

// 	var color = d3.scale.ordinal()
// 		.range(["#EDC951","#CC333F","#00A0B0"]);
				
// 	var radarChartOptions = {
// 	  w: widthRadar,
// 	  h: heightRadar,
// 	  margin: marginRadar,
//         legendPos: legendPos,
// 	  maxValue: 1,
// 	  levels: 5,
// 	  roundStrokes: true,
// 	  color: color,
// 		axisName: "axis",
// 		areaName: "model",
// 		value: "value"
// 	};

// 	RadarChart(".radarChart", test, radarChartOptions);
// });

var color = d3.scale.ordinal()
	.range(["#1f77b4","#666633","#ff7f0e", "#ff3399", "#9467bd"]);

var radarChartOptions = {
  width: 500,
  height: 400,
  margins: marginRadar,
  color: color
};

radarChart = RadarChart()
         d3.select('#radar')
           .call(radarChart);
radarChart.options(radarChartOptions).update();
radarChart.options({'legend': {display: true}});


function updateRadar(manufacturer, carline) {
	if(radarData.length > 3)
		return;
	d3.csv("data/data_1.csv", function(data) {
		data = data.filter(function(row) {
			if((row["Mfr Name"] == manufacturer && row["Carline"] == carline))
				return row;
		});
		data = data.slice(0, 1);
		var test = radarData;
		data.forEach(function(d) {
			var attri = [];
			attri.push({"axis": "Engine Displacement", "value": d["Eng Dis Scale"], "truevalue": d["Eng Displ"], "model": d["Division"]});
			attri.push({"axis": "Number of Cylinder", "value": d["# Cyl"] / 12, "truevalue": d["# Cyl"], "model": d["Division"]});
			// attri.push({"axis": "Fuel Efficiency Rating", "value": d["FE Rating (1-10 rating on Label)"] / 10, "model": d["Division"]});
			attri.push({"axis": "Number of Gears", "value": d["# Gears"] / 9, "truevalue": d["# Gears"], "model": d["Division"]});
			attri.push({"axis": "City MPG", "value": d["City FE (Guide) - Conventional Fuel"] / 58, "truevalue": d["City FE (Guide) - Conventional Fuel"], "model": d["Division"]});
			attri.push({"axis": "Highway MPG", "value": d["Hwy FE (Guide) - Conventional Fuel"] / 53, "truevalue": d["Hwy FE (Guide) - Conventional Fuel"], "model": d["Division"]});

			test.push({"key": d["Mfr Name"] + " " + d["Carline"], "values": attri});
		});
		radarChart.data(test).duration(1000).update();
	});
}



