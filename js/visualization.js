/////////////////////////////////////////////////
// D3.js Data Visualization
/////////////////////////////////////////////////

var data;
var show;
var width = window.innerWidth;
var height = window.innerHeight;
var scale_factor = 15;
var time = 0;
var radius = height/2;

var wins = 0;
var losses = 0;
var runs = 0;

// var x = d3.scale.linear().range([0, width]);
// var y = d3.time.scale().range([height, 0]);

var scoreBoard = d3.select("#scoreboard");
var scorevis = d3.select("#scorevis").append("svg").append("g").attr("transform", function() {
  var x = d3.select("#scorevis").select("svg").node().getBoundingClientRect().width/2;
  var y = d3.select("#scorevis").select("svg").node().getBoundingClientRect().height/2;

  return "translate(" + x + ", " + y + ")";
});

scorevis.append("circle").attr("id", "scorevis-wins");
scorevis.append("circle").attr("id", "scorevis-losses");

var chart = d3.select("#main").append("svg")
  .append("g").attr("id", "games")
  .attr("transform", function() {
    var x = d3.select("#main").select("svg").node().getBoundingClientRect().width/2;
    var y = d3.select("#main").select("svg").node().getBoundingClientRect().height*0.9;

    return "translate(" + x + ", " + y + ") rotate(45)";
  });

var games;

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

    // Set timeline duration
    d3.select(".slider")
      .attr("max", rows.length)
      .property("value", rows.length);

    // Copy data to global variable
    data = rows;

    // Show everything in the begining
    time_scrub(rows.length);

    var x = d3.scale.ordinal()
      .domain(["Home", "Away", "Win", "Loss", "Scored", "Allowed", "Duration", "Attendance", "Score"])
      .rangePoints([0, radius/2]);

    var xAxis = d3.svg.axis()
      .scale(x);
      // .orient("right");

    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + -radius*1.5 + ", 0)")
      .call(xAxis)
      .selectAll("text")
        .attr("y", -9)
        .attr("dx", "-2em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");
  });

function time_scrub(val) {
  // Get games for current timeline slider value
  show = data.slice(0, val);

  // Display those games
  redraw();
}


function redraw() {
  games = chart.selectAll(".game").data(show, function(d) { return d.Game; });

  var gamesEnter = games.enter()
    .append("g")
    .attr("class", "game");

  // score
  gamesEnter.append("circle")
    .attr("class", "score")
    .attr("cx", function(d, i) { return x_value(i, radius); })
    .attr("cy", function(d, i) { return y_value(i, radius); })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) ; })
    .style("opacity", 0);


  // home game
  gamesEnter.each(function (d, i) {
    if(d.Place === "") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.5))
        .attr("cy", y_value(i, radius*1.5));
    }
  });

  // away game
  gamesEnter.each(function (d, i) {
    if(d.Place == "@") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.4375))
        .attr("cy", y_value(i, radius*1.4375));
    }
  });

  // win
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "W") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.375))
        .attr("cy", y_value(i, radius*1.375));
    }
  });

  // loss
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "L") {
      d3.select(this)
        .append("circle")
        .attr("r", 2)
        .attr("cx", x_value(i, radius*1.3125))
        .attr("cy", y_value(i, radius*1.3125));
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
    .attr("cx", function(d, i) { return x_value(i, radius*1.1875); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.1875); });

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
    .attr("cx", function(d, i) { return x_value(i, radius*1.125); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.125); });

  // attendance
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Attendance / 10000; })
    .attr("cx", function(d, i) { return x_value(i, radius*1.0625); })
    .attr("cy", function(d, i) { return y_value(i, radius*1.0625); });

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
    .style("opacity", 0.8);

  runs = 0;
	games.each(function(d, i) {
        var wins_losses = d["W-L"];
        var minus_index = wins_losses.indexOf("-");

		if (games[0].length >= 162) {
      if (i == 161) {
  	    wins = wins_losses.substring(0, minus_index);
  		  losses = wins_losses.substring(minus_index+1);
    	}
    }
    else{
      if (i == games[0].length-1) {
        wins = wins_losses.substring(0, minus_index);
        losses = wins_losses.substring(minus_index+1);
      }
    }
		runs += d.Scored;
	})
  .call(function(d, i) {
    scoreBoard.select("#wins").text(wins);
  	scoreBoard.select("#losses").text(losses);
  	scoreBoard.select("#runs").text(runs);

    scorevis.select("#scorevis-wins")
      .attr("r", wins);

    scorevis.select("#scorevis-losses")
      .attr("r", losses);
  });

  games.exit()
    // .transition()
    // .ease("ease-out")
    // .duration(200)
    // .delay(function(d, i){ return 100+i*50; })
    // .attr("r", 0)
    // .style("opacity", 0)
    .remove();
}

function y_value(game, r) {
    return Math.sin(-Math.PI/2/data.length*game) * r;
}

function x_value(game, r) {
    return -Math.cos(Math.PI/2/data.length*game) * r;
}


// function updateWindow(){
//     width = window.innerWidth;
//     height = window.innerHeight;

//     svg.attr("width", width).attr("height", height);
// }
// window.onresize = updateWindow;
