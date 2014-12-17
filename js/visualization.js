/////////////////////////////////////////////////
// D3.js Data Visualization
/////////////////////////////////////////////////

var data;
var show;
var width = window.innerWidth;
var height = window.innerHeight;
var scale_factor = 15;
var time = 0;
var radius = 400;

var wins = 0;
var losses = 0;
var runs = 0;

// var x = d3.scale.linear().range([0, width]);
// var y = d3.time.scale().range([height, 0]);

// var xAxis = d3.svg.axis().scale(x)
//   .orient("top").ticks(10);
// var yAxis = d3.svg.axis().scale(y)
//   .orient("right").ticks(5);

var scoreBoard = d3.select("#scoreboard");

var chart = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g").attr("id", "games").attr("transform", "translate("+width/2+", "+height+") rotate(45)");

var games;
// var scores = chart.append("g").attr("id", "scores").attr("transform", "translate("+width/2+", "+height*.75+") rotate(45)");
// var grid = chart.append("g").attr("id", "grid");
// var pie = chart.append("g").attr("id", "pie").attr("transform", "translate("+width/2+", "+height*.75+")");
  
var format = d3.time.format("%A %b %e %Y");

d3.csv("schedule.csv")
  .row(function(d) { return {
    'Game': +d["Gm#"],
    'Date': format.parse(d.Date + " 2014"),
    'Team': d.Tm,
    'Place': d[""],
    'Opponent': d.Opp,
    'W/L': d["W/L"],
    'Scored': +d.R,
    'Allowed': +d.RA,
    'Innings': +d.Inn,
    'W-L': d["W-L"],
    'Rank': +d.Rank,
    'Duration': d.Time,
    'D/N': d["D/N"],
    'Attendance': +d.Attendance,
    'Streak': d.Streak
    };
  })
  .get(function(error, rows) {

    // Set domain
    // var x = d3.scale.linear().range([0, width]);

    // Set timeline duration
    d3.select(".slider")
      .attr("max", rows.length)
      .property("value", rows.length);

    // Get x and y dimensions from data
    // x.domain([0, rows.length]);
//     y.domain(d3.extent(rows, function(d) { return d.Date; }));

    // Copy data to global variable
    data = rows;

    // Show everything in the begining
    time_scrub(rows.length);
  });

function time_scrub(val) {
  // Get games for current timeline slider value
  show = data.slice(0, val);

  // Display those games
  redraw();
}

function y_value(game, r) {
  return Math.sin(-Math.PI/2/data.length*game) * r;
}

function x_value(game, r) {
  return -Math.cos(Math.PI/2/data.length*game) * r;
}

function redraw() {

  games = chart.selectAll("g").data(show, function(d) { return d.Game; });

  var gamesEnter = games.enter()
    .append("g")
    .attr("class", "game");

  gamesEnter.append("circle")
    .attr("class", "score")
    .attr("cx", function(d, i) { return x_value(i, radius); })
    .attr("cy", function(d, i) { return y_value(i, radius); })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) ; })
    .style("opacity", 0);

    
  // home game
  gamesEnter.each(function (d, i) {
    if(d.Place == "") {    
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.45))
        .attr("cy", y_value(i, radius*1.45));  
    }
  });

  // away game
  gamesEnter.each(function (d, i) {
    if(d.Place == "@") {    
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.4))
        .attr("cy", y_value(i, radius*1.4));  
    }
  });

  // win
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "W") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.35))
        .attr("cy", y_value(i, radius*1.35));  
    }
  });
      
  // loss 
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "L") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.3))
        .attr("cy", y_value(i, radius*1.3));  
    }
  });

  // scored
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Scored / 2; })
    .attr("cx", function(d, i) { return x_value(i, radius*1.25); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.25); });

  // allowed
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Allowed / 2; })
    .attr("cx", function(d, i) { return x_value(i, radius*1.2); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.2); });

  // rank
  // d3.select(this).append("circle")
  //   .attr("r", d.Allowed / 2)
  //   .attr("cx", x(i))
  //   .attr("cy", 200);

  // time
  gamesEnter.append("circle")
    .attr("r", function(d, i) { 
      var gd = d.Duration;
      return (+gd.substr(0,1) + gd.substr(2,2)/60);             
    })
    .attr("cx", function(d, i) { return x_value(i, radius*1.1); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.1); });

  // attendance
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Attendance / 10000; })
    .attr("cx", function(d, i) { return x_value(i, radius*1.05); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.05); });

      // attendance
      // d3.select(this).append("circle")
      //   .attr("r", d.Attendance / 10000)
      //   .attr("cx", x(i))
      //   .attr("cy", 240);  

  games.selectAll("circle")
    // .transition()
    // .ease("elastic-in")
    // .duration(500)
    .style("fill", "white")
    // .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) * 2; })
    // .attr("r", 5)
    .style("opacity", .8);
 
	games.each(function(d, i) {
		if (i == 162) {
			var wins_losses = d["W/L"];
			var minus_index = wins_losses.indexOf("-");
	 		wins = wins_losses.substring(0, minus_index);
	 		losses = wins_losses.substring(minus_index);
	 	}
 		runs += d.Scored; 
	})
  .call(function(d, i) {
  	scoreBoard.select("#wins + dd").text(wins);
		scoreBoard.select("#losses + dd").text(losses);
		scoreBoard.select("#runs + dd").text(runs);
  });
  
  games.exit()
    // .transition()
    // .ease("ease-out")
    // .duration(200)
//     .delay(function(d, i){ return 100+i*50; })
    // .attr("r", 0)
    // .style("opacity", 0)
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


  // grid = chart.select("#grid").selectAll("g").data(show);

  // grid.enter()
  //   .append("g")
  //   .each(function(d, i) {

  //     // home game
  //     d3.select(this).append("circle")
  //       .attr("r", d.Place == "" ? 0 : 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 100);

  //     // away game
  //     d3.select(this).append("circle")
  //       .attr("r", d.Place == "@" ? 0 : 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 120);

  //     // win
  //     d3.select(this).append("circle")
  //       .attr("r", d["W/L"] == "W" ? 0 : 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 140);

  //     // loss
  //     d3.select(this).append("circle")
  //       .attr("r", d["W/L"] == "L" ? 0 : 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 160);

  //     // scored
  //     d3.select(this).append("circle")
  //       .attr("r", d.Scored / 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 180);

  //     // allowed
  //     d3.select(this).append("circle")
  //       .attr("r", d.Allowed / 2)
  //       .attr("cx", x(i))
  //       .attr("cy", 200);

  //     // rank
  //     // d3.select(this).append("circle")
  //     //   .attr("r", d.Allowed / 2)
  //     //   .attr("cx", x(i))
  //     //   .attr("cy", 200);

  //     // time
  //     d3.select(this).append("circle")
  //       .attr("r", d.Duration.substr(0,1))
  //       .attr("cx", x(i))
  //       .attr("cy", 220);

  //     // attendance
  //     d3.select(this).append("circle")
  //       .attr("r", d.Attendance / 10000)
  //       .attr("cx", x(i))
  //       .attr("cy", 240);

  //     // attendance
  //     // d3.select(this).append("circle")
  //     //   .attr("r", d.Attendance / 10000)
  //     //   .attr("cx", x(i))
  //     //   .attr("cy", 240);
  //   });

  // grid.exit()
  //   .selectAll("circle")
  //   .transition()
  //   .duration(200)
  //   .attr("r", 0);

  // grid.exit()
  //   .remove();


  // Draw arc test
  // field = pie.selectAll("circle").data(show);

  // field.enter()
  //   .append("circle")
  //   .attr("r", 5)
  //   .attr("cx", function(d, i) {
  //     return Math.cos( Math.PI/show.length * i) * 500 ;
  //   })
  //   .attr("cy", function(d, i) {
  //     return -Math.sin( Math.PI/show.length * i) * 500 ;
  //   });
}

// function updateWindow(){
//     width = window.innerWidth;
//     height = window.innerHeight;

//     svg.attr("width", width).attr("height", height);
// }
// window.onresize = updateWindow;
