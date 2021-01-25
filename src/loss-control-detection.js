// echarts init for the charts
var roll_pitch_chart = echarts.init(
	document.getElementById("id_roll_pitch_chart"),
	null,
	{ renderer: "svg" }
);
var risk_score_chart = echarts.init(
	document.getElementById("id_risk_score_chart"),
	null,
	{ renderer: "svg" }
);

// 50-80 is good for testing and 150-200 is good for recording a video - this depends on a set to `animationDurationUpdate = 0`
let transitionSpeed = 150;
var hasHistory = true;

var __time = [],
	__pitch = [],
	__roll = [],
	__scatter = [],
	__riskScore = [];

var dataUpperBound = [];
var start = 300,
	end = 480;

// loading the data, then parse it into array
d3.csv("../data/roll_exemplar.csv", function (d) {
	let data = JSON.parse(JSON.stringify(d));
	console.log("Succssfully loaded data");
	data.forEach(function (e, i) {
		// limit the x-axis range from 300 to 450/500 seconds
		if (i >= start - 1 && i < end) {
			__time.push(e["time"]);
			__pitch.push(e["pitch"]);
			__roll.push(e["roll"]);
			__scatter.push([e["roll"], e["pitch"]]);
			__riskScore.push(e["riskScore"]);
		}
		// upper bound is set as 1
		dataUpperBound.push(1);
	});

	// when ready, render!!
	init();
});

function init() {
	colors = ["#4a70c3", "#e64646"];

	// Pitch Roll Chart Option
	optionPitchRoll = {
		xAxis: {
			name: "Roll (deg)",
			nameLocation: "middle",
			nameGap: 50,
			position: "bottom",
			max: 60,
			min: -60
		},
		yAxis: {
			name: "Pitch (deg)",
			nameLocation: "middle",
			nameGap: 50,
			position: "left",
			max: 30,
			min: -15
		},
		grid: {
			// top: "10%",
			right: "2%"
			// bottom: "15%",
			// left: "10%"
		},
		// label: {
		// 	show: true,
		// 	position: "top",
		// 	fontSize: 15
		// },
		series: [
			{
				name: "Roll and Pitch",
				type: "scatter",
				data: __scatter,
				itemStyle: {
					normal: {
						color: function (param) {
							// if (param.data[0] > 45 || param.data[0] < -45) return colors[1];
							return colors[0];
						}
					}
				},
				symbolSize: 10,
				animationDelay: 0,
				animationDuration: 0,
				animationDurationUpdate: 0,
				markArea: {
					silent: true,
					itemStyle: {
						color: "transparent",
						borderColor: colors[1],
						borderWidth: 2,
						borderType: "dotted"
						// opacity: 0.5
					},
					data: [
						[
							{
								name: "Envelop Boundary Range",
								xAxis: -45,
								yAxis: -10
							},
							{
								xAxis: 45,
								yAxis: 25
							}
						]
					]
				}
			}
		]
	};
	roll_pitch_chart.setOption(optionPitchRoll);

	// Risk Score Chart Option
	optionRiskScore = {
		title: {
			text: ""
		},
		tooltip: {
			show: false
		},
		legend: {
			show: false,
			data: ["Actual", "", ""]
		},
		xAxis: {
			type: "category",
			name: "Time (secs)",
			nameLocation: "middle",
			nameGap: 50,
			position: "bottom",
			splitLine: {
				show: false
			},
			data: __time,
			axisLabel: {
				interval: 19,
				showMaxLabel: true
			}
		},
		yAxis: {
			type: "value",
			name: "Risk Score",
			nameLocation: "middle",
			nameGap: 60,
			position: "left",
			boundaryGap: [0, 1],
			splitLine: {
				show: true
			},
			max: 1.1,
			min: -0.1,
			axisLabel: {
				show: true,
				showMaxLabel: false,
				showMinLabel: false
			}
		},
		grid: {
			// top: "10%",
			right: "2%"
			// bottom: "15%",
			// left: "10%"
		},
		series: [
			{
				type: "line",
				name: "Actual",
				showSymbol: false,
				hoverAnimation: false,
				smooth: true,
				data: __riskScore,
				// lineStyle: {
				// 	color: colors[1]
				// },
				animationDelay: 0,
				animationDuration: 0,
				animationDurationUpdate: 0
			},
			{
				type: "line",
				name: "Bar",
				showSymbol: false,
				smooth: true,
				data: dataUpperBound,
				lineStyle: {
					silent: true,
					type: "dotted",
					width: 2,
					color: colors[1]
					// opacity: 0.5
				},
				animationDelay: 0,
				animationDuration: 0,
				animationDurationUpdate: 0
			}
		]
	};
	risk_score_chart.setOption(optionRiskScore);
	roll_pitch_chart.setOption(optionPitchRoll);

	// set an interval for transition of animation
	var idx = 0;
	var length = __scatter.length;
	var riskScore = [];
	var rollPitch = [];

	timeInterval = setInterval(function () {
		riskScore.push(__riskScore[idx]);
		optionRiskScore["series"][0]["data"][idx] = __riskScore[idx];
		if (!hasHistory) rollPitch = [];
		rollPitch.push(__scatter[idx]);
		// console.log(idx, rollPitch);

		risk_score_chart.setOption({
			series: [
				{
					data: riskScore
				}
			]
		});
		roll_pitch_chart.setOption({
			series: [
				{
					data: rollPitch
				}
			]
		});

		idx += 1;
		if (idx >= length) {
			// when finished, render full data again
			roll_pitch_chart.setOption({
				series: [
					{
						data: __scatter
					}
				]
			});
			clearInterval(timeInterval);
		}
	}, transitionSpeed);
}

window.addEventListener("resize", handleResize);
function handleResize() {
	risk_score_chart.resize();
}
