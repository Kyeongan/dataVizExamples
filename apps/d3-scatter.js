var data = [];
for (let i = 0; i < 10; i++) {
	var random = [];
	random[0] = Math.floor(d3.randomUniform(0, 800)());
	random[1] = Math.floor(d3.randomUniform(0, 400)());
	data.push(random);
}
console.log(data);

// var data = [
// 	{ date: "11/01/2020", num: 0 },
// 	{ date: "11/02/2020", num: 0 },
// 	{ date: "11/03/2020", num: 0 },
// 	{ date: "11/04/2020", num: 0 },
// 	{ date: "11/05/2020", num: 0 },
// 	{ date: "11/06/2020", num: 0 },
// 	{ date: "11/07/2020", num: 0 },
// 	{ date: "11/08/2020", num: 0 },
// 	{ date: "11/09/2020", num: 0 },
// 	{ date: "11/10/2020", num: 0 },
// 	{ date: "11/11/2020", num: 0 }
// ];

// for (let i = 0; i < data.length; i++) {
// 	var random = 0;
// 	random = Math.floor(d3.randomUniform(0, 100)());
// 	data[i].num = random;
// }

var chart_width = 800;
var chart_height = 400;
var padding = 50;

var time_parse = d3.timeParse("%m/%d/%Y");
var time_format = d3.timeFormat("%b %e");

// Loop throught each date
// data.forEach(function (e, i) {
// 	data[i].date = time_parse(e.date);
// });

// Create SVG Element
var svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", chart_width)
	.attr("height", chart_height);

// Create Scales
var x_scale = d3
	.scaleLinear()
	.domain([
		0,
		d3.max(data, function (d) {
			return d[0];
		})
	])
	.range([padding, chart_width - padding * 2]);

var y_scale = d3
	.scaleLinear()
	.domain([
		0,
		d3.max(data, function (d) {
			return d[1];
		})
	])
	.range([chart_height - padding, padding]);

var r_scale = d3
	.scaleLinear()
	.domain([
		0,
		d3.max(data, function (d) {
			return d[1];
		})
	])
	.range([0, 25]);

var a_scale = d3
	.scaleSqrt()
	.domain([
		0,
		d3.max(data, function (d) {
			return d[1] / 3;
		})
	])
	.range([10, 30]);

// Bind Data - Creating circle
svg
	.append("g")
	.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function (d) {
		return x_scale(d[0]);
	})
	.attr("cy", function (d) {
		return y_scale(d[1]);
	})
	.attr("r", function (d) {
		return a_scale(d[1] / 2);
	})
	.attr("fill", "lightblue");
// .attr("stroke", "line");

// Create Labels
svg
	.append("g")
	.selectAll("text")
	.data(data)
	.enter()
	.append("text")
	.text(function (d) {
		return d.join(", ");
	})
	.attr("x", function (d) {
		return x_scale(d[0]);
	})
	.attr("y", function (d) {
		return y_scale(d[1]);
	});

var slices = [100, 200, 300, 400, 500];
var scale = d3
	.scaleLinear()
	.domain([d3.min(slices), d3.max(slices)])
	.range([10, 350]);

// Adding Axis
var x_axis = d3.axisBottom(x_scale);
// .ticks(15)
// .tickValues([1, 5, 10, 15])
svg
	.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0, " + (chart_height - padding) + ")")
	.call(x_axis);

var y_axis = d3.axisLeft(y_scale).ticks(10);
svg
	.append("g")
	.attr("class", "y-axis")
	.attr("transform", "translate(" + padding + ", 0)")
	.call(y_axis);
