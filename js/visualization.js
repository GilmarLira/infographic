/////////////////////////////////////////////////
// D3.js Data Visualization
/////////////////////////////////////////////////

var data;
var show;
var width = window.innerWidth;
var height = window.innerHeight;
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

var games;
var scores = chart.append("g").attr("id", "scores");
var grid = chart.append("g").attr("id", "grid");
  
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
//     y.domain(d3.extent(rows, function(d) { return d.Date; }));

    // Copy data to global variable
    data = rows;

    // Don't show anything in the begining
    time_scrub(rows.length);
  });

function time_scrub(val) {
  // Get games for current timeline slider value
  show = data.slice(0, val);

  // Display those games
  redraw();
}

function redraw() {

  games = scores.selectAll("circle").data(show);

  games.enter()
    .append("circle")
    .attr("cx", function(d, i){ return x(i); })
    .attr("cy", height/2)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", function(d){
      if(d["W/L"].substr(0, 1) === "W") {
        return "rgba(255, 93, 0, 0.3)";
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

  games
    .transition()
    .ease("elastic-in")
    .duration(500)
//     .delay(function(d, i){ return 100+i*50; })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) * scale_factor; })
    .style("opacity", 100);
  
  games.exit()
    .transition()
    .ease("ease-out")
    .duration(200)
//     .delay(function(d, i){ return 100+i*50; })
    .attr("r", 0)
    .style("opacity", 0)
    .remove();

  // Add the X Axis
  // chart.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxis);

  // Add the Y Axis
  // chart.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxis);


  grid = chart.select("#grid").selectAll("g").data(show);

  grid.enter()
    .append("g")
    .each(function(d, i) {

      // home game
      d3.select(this).append("circle")
        .attr("r", d.Place == "" ? 0 : 2)
        .attr("cx", x(i))
        .attr("cy", 100);

      // away game
      d3.select(this).append("circle")
        .attr("r", d.Place == "@" ? 0 : 2)
        .attr("cx", x(i))
        .attr("cy", 120);

      // win
      d3.select(this).append("circle")
        .attr("r", d["W/L"] == "W" ? 0 : 2)
        .attr("cx", x(i))
        .attr("cy", 140);

      // loss
      d3.select(this).append("circle")
        .attr("r", d["W/L"] == "L" ? 0 : 2)
        .attr("cx", x(i))
        .attr("cy", 160);

      // scored
      d3.select(this).append("circle")
        .attr("r", d.Scored / 2)
        .attr("cx", x(i))
        .attr("cy", 180);

      // allowed
      d3.select(this).append("circle")
        .attr("r", d.Allowed / 2)
        .attr("cx", x(i))
        .attr("cy", 200);

      // rank
      // d3.select(this).append("circle")
      //   .attr("r", d.Allowed / 2)
      //   .attr("cx", x(i))
      //   .attr("cy", 200);

      // time
      d3.select(this).append("circle")
        .attr("r", d.Duration.substr(0,1))
        .attr("cx", x(i))
        .attr("cy", 220);

      // attendance
      d3.select(this).append("circle")
        .attr("r", d.Attendance / 10000)
        .attr("cx", x(i))
        .attr("cy", 240);

      // attendance
      // d3.select(this).append("circle")
      //   .attr("r", d.Attendance / 10000)
      //   .attr("cx", x(i))
      //   .attr("cy", 240);
    });

  grid.exit()
    .selectAll("circle")
    .transition()
    .duration(200)
    .attr("r", 0);

  grid.exit()
    .remove();


}

// function updateWindow(){
//     width = window.innerWidth;
//     height = window.innerHeight;

//     svg.attr("width", width).attr("height", height);
// }
// window.onresize = updateWindow;
