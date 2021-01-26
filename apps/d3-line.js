var data = [
	{ date: 1988, num: 51 },
	{ date: 1989, num: 60 },
	{ date: 1990, num: 62 },
	{ date: 1991, num: -64 },
	{ date: 1992, num: 69 },
	{ date: 1993, num: 69 },
	{ date: 1994, num: 75 },
	{ date: 1995, num: 80 },
	{ date: 1996, num: 91 },
	{ date: 1997, num: 93 },
	{ date: 1998, num: 97 },
	{ date: 1999, num: 100 },
	{ date: 2000, num: -103 },
	{ date: 2001, num: 104 },
	{ date: 2002, num: 105 },
	{ date: 2003, num: 110 },
	{ date: 2004, num: 111 },
	{ date: 2005, num: 112 },
	{ date: 2006, num: 112 },
	{ date: 2007, num: 113 },
	{ date: 2008, num: 119 },
	{ date: 2009, num: 128 },
	{ date: 2010, num: 139 },
	{ date: 2011, num: -139 },
	{ date: 2012, num: 139 },
	{ date: 2013, num: 140 },
	{ date: 2014, num: 143 },
	{ date: 2015, num: 146 },
	{ date: 2016, num: 147 },
	{ date: 2017, num: 149 }
];

// d3.csv("../data/aapl.csv", (error, data) => {
// 	if (error) {
// 		console.error(error);
// 	} else {
// 		console.log(data);
// 	}
// });

var time_parse = d3.timeParse("%Y");
var time_format = d3.timeFormat("%Y");

// d3.csv("../data/aapl.csv").then(function (data) {
// 	data.forEach(function (d) {
// 		console.log(d);
// 		d.date = timeParse(d.date);
// 		d.num = d.num;
// 	});
// 	console.log(data[0]);
// });

// Create SVG Element
var chart_width = 800;
var chart_height = 400;
var padding = 50;

// Format Date
data.forEach(function (e, i) {
	data[i].date = time_parse(e.date);
	// data[i].close = time_parse(e.close);
});

// Create Scales
var x_scale = d3
	.scaleTime()
	.domain([
		d3.min(data, function (d) {
			return d.date;
		}),
		d3.max(data, function (d) {
			return d.date;
		})
	])
	.range([padding, chart_width - padding]);
let x_axis = d3.axisBottom(x_scale).ticks(10).tickFormat(time_format);

let y_scale = d3
	.scaleLinear()
	.domain([
		0,
		d3.max(data, function (d) {
			return d.num;
		})
	])
	.range([chart_height - padding, padding]);
let y_axis = d3.axisLeft(y_scale).ticks(12).tickFormat(d3.format(",.0d"));

var svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", chart_width)
	.attr("height", chart_height);

svg
	.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (chart_height - padding) + ")")
	.call(x_axis);

svg
	.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + padding + ",0)")
	.call(y_axis);

// Create Line
var line = d3
	.line()
	.defined((d) => d.num > 0)
	.x((d) => x_scale(d.date))
	.y((d) => y_scale(d.num));

var red_line = d3
	.line()
	.defined((d) => d.num >= 100)
	.x((d) => x_scale(d.date))
	.y((d) => y_scale(d.num));

var area = d3
	.area()
	.defined((d) => d.num > 0)
	.x((d) => x_scale(d.date))
	.y0((d) => y_scale.range()[0])
	.y1((d) => y_scale(d.num));

svg
	.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "steelblue")
	.attr("stroke-width", 2)
	.attr("d", line);

svg
	.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "red")
	.attr("stroke-width", 2)
	.attr("d", red_line);
svg
	.append("path")
	.datum(data)
	.attr("fill", "#ffccdd")
	// .attr("stroke", "#ffccd")
	// .attr("stroke-width", 2)
	.attr("d", area);

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
			(chart_width / data.length - padding) / 2
		);
	})
	.attr("y", function (d) {
		return chart_height - d * 10 - 5;
	})
	.attr("font-size", 16)
	.attr("text-anchor", "middle");
// .attr("fill", "#fff");
