var data = [];

for (let i = 0; i < 20; i++) {
	// var num = Math.floor(Math.random() * 50);
	// data.push(num);
	var random = Math.floor(d3.randomUniform(1, 20)());
	data.push(random);
	console.log(random);
}

// Create SVG Element
var chart_width = 800;
var chart_height = 400;
var bar_padding = 5;
var svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", chart_width)
	.attr("height", chart_height);

// Create Scales
var x_scale = d3
	.scaleBand()
	.domain(d3.range(data.length))
	.rangeRound([0, chart_width])
	.paddingInner(0.05);

// Bind Data and Create Bars
svg
	.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x", function (d, i) {
		return x_scale(i); //
	})
	.attr("y", function (d) {
		return chart_height - d * 10;
	})
	.attr("width", x_scale.bandwidth())
	.attr("height", function (d) {
		return d * 10;
	})
	.style("stroke", "black")
	.style("fill", "lightblue");

// Create Labels
svg
	.selectAll("text")
	.data(data)
	.enter()
	.append("text")
	.text(function (d) {
		return d;
	})
	.attr("x", function (d, i) {
		// return i * (chart_width / data.length); //
		return (
			i * (chart_width / data.length) +
			(chart_width / data.length - bar_padding) / 2
		);
	})
	.attr("y", function (d) {
		return chart_height - d * 10 - 5;
	})
	.attr("font-size", 16)
	.attr("text-anchor", "middle");
// .attr("fill", "#fff");
