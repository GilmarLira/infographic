
/////////////////////////////////////////////////
// General functions
/////////////////////////////////////////////////



/////////////////////////////////////////////////
// D3.js Data Visualization
/////////////////////////////////////////////////

var data;
var show;
var width = window.innerWidth;
var height = window.innerHeight;
var games;
var scale_factor = 15;
var time = 0;

var x = d3.scale.linear().range([0, width]);
var y = d3.time.scale().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
  .orient("top").ticks(10);
var yAxis = d3.svg.axis().scale(y)
  .orient("right").ticks(5);

var chart = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

// var slider = d3.select("body").append("svg")
// 	.attr("id", "slider")
// 	.attr("width", 100)
// 	.attr("height", height);

var format = d3.time.format("%A %b %e %Y");

d3.csv("schedule.csv")
  .row(function(d) { return {
    'Game': +d["Gm#"],
    'Date': format.parse(d.Date + " 2014"),
    'Team': d.Tm,
    'Place': d[""],
    'Opponent': d.Opp,
    'W/L': d["W/L"],
    'Scored': d.R,
    'Allowed': d.RA,
    'Innings': d.Inn,
    'W-L': d["W-L"],
    'Rank': +d.Rank,
    'Duration': d.Time,
    'D/N': d["D/N"],
    'Attendance': d.Attendance,
    'Streak': d.Streak
    };
  })
  .get(function(error, rows) {

    // Set timeline duration
    d3.select(".slider")
      .attr("max", rows.length)
      .property("value", 0);

    // Get x and y dimensions from data
    x.domain([0, rows.length]);
    y.domain(d3.extent(rows, function(d) { return d.Date; }));

    // Copy data to global variable
    data = rows;

    // Don't show anything in the begining
    time_scrub(0);
  });

function time_scrub(val) {
  // Get games for current timeline slider value
  show = data.slice(0, val);

  // Display those games
  redraw();
}

function redraw() {
  games = chart.selectAll("g").data(show);

  games.enter()
    .append("g").append("circle")
    .attr("cx", function(d, i){ return x(i); })
    .attr("cy", function(d) { return y(d.Date); })
    .attr("r", 0)
    .style("fill", function(d){
      if(d["W/L"].substr(0, 1) === "W") {
        return "rgba(255, 93, 0, 0.7)";
      } else {
        return "none";
      }
    })
    .style("stroke", function(d){
      if(d["W/L"].substr(0, 1) === "L") {
        return "rgba(0, 0, 0, 0.6)";
      }
    })
    .style("stroke-width", function(d){
      return (d["W/L"].substr(0, 1) === "L") ? scale_factor/2 : 0;
    });

  games.selectAll("circle")
    .transition()
    .ease("elastic-in")
    .duration(1000)
    .delay(function(d, i){ return 100+i*50; })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) * scale_factor; });


  games.exit()
    .selectAll("circle")
    .transition()
    .ease("ease-out")
    .duration(200)
    .delay(function(d, i){ return 100+i*50; })
    .attr("r", 0);

  // Add the X Axis
  // chart.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxis);

  // Add the Y Axis
  // chart.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxis);
}



function show(selection) {
  selection.selectAll("circle")
    .transition()
    .ease("elastic-in")
    .duration(1000)
    .delay(function(d, i){ return 100+i*50; })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) * scale_factor; });
}

function hide(selection) {
  selection.selectAll("circle")
  .transition()
  .ease("ease-in")
  .duration(500)
  .delay(function(d, i){ return 100+i*50; })
  .attr("r", 0);
}


// function updateWindow(){
//     width = window.innerWidth;
//     height = window.innerHeight;

//     svg.attr("width", width).attr("height", height);
// }
// window.onresize = updateWindow;
