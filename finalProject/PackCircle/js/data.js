d3.csv("data/Manufacturer.csv", function(data) {
	var manufacturers = d3.nest()
			.key(function(d) { return d['Mfr Name']; })
			.key(function(d) { return d['Carline']; })
            .rollup(function(v) { return {
                size: v.length,
                cars: d3.nest()
                    .key(function(d) { return d['Name']; })
                    .rollup(function(v) { return d3.mean(v, function(d) { return d.MPG; }); })
                    .entries(v)
            }; })
			.entries(data);
	//console.log(JSON.stringify(manufacturers));
    //console.log(manufacturers);

    var pack_data = [];
    var id_parent_level = [];
    id_parent_level.push({'name': 'Manufacturers', 'ID': ''});
    var bar_data =[];

    var a = 1;
    var b = 1;
    for (i = 0; i < manufacturers.length; i++) {
        var node = [];
        parent = manufacturers[i].key;
        child = manufacturers[i].values;
        //console.log(child.length);
        id_parent_level.push({'name': parent, 'ID': (a.toString() + '.' + b.toString())});
        var node1 = [];
        var c = 1;
        for (j = 0; j < child.length; j++) {
            name = child[j].key;
            size = child[j].values.size;
            var count = a.toString() + '.' + b.toString() + '.' + c.toString();
            node1.push({'name': name, 'size': size, 'ID': count});
            c++;
            var cars = (child[j].values.cars).sort(function(a,b) { return b.values - a.values});
            //console.log(cars);
            for (k = 0; k< cars.length; k++){
                bar_data.push({'ID': count, 'name': cars[k].key , 'value': Math.round(cars[k].values)})
            }
        }
        b++;
        pack_data.push({'name':parent, 'children':node1});
    }
    pack_data = {'name': 'Manufacturers', 'children': pack_data};
    //console.log(JSON.stringify(pack_data));
    //console.log(id_parent_level);
    //console.log(bar_data);
    drawAll(bar_data, id_parent_level, pack_data);
});