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
  // show = val === 0 ? [] : data.slice(0, val);
  show = data.slice(0, val);

  // Display those games
  redraw();
}


function redraw() {
  games = chart.selectAll("g.game").data(show, function(d) { return d.Game; });

  var factor = 2;

  var gamesEnter = games.enter()
    .append("g")
    .attr("class", "game");

  // home game
  gamesEnter.each(function (d, i) {
    if(d.Place === "") {
      d3.select(this)
        .append("circle")
        .attr("r", 4 * factor)
        .attr("cx", x_value(i, radius*(1 + 0.5 * 8/8) ))
        .attr("cy", y_value(i, radius*(1 + 0.5 * 8/8) ));
        // .transition()
        // .ease("elastic-in")
        // .duration(500)
        // .attr("r", 4);
    }
  });

  // away game
  gamesEnter.each(function (d, i) {
    if(d.Place == "@") {
      d3.select(this)
        .append("circle")
        .attr("r", 4 * factor)
        .attr("cx", x_value(i, radius*(1 + 0.5 * 7/8) ))
        .attr("cy", y_value(i, radius*(1 + 0.5 * 7/8) ));
    }
  });

  // win
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "W") {
      d3.select(this)
        .append("circle")
        .attr("r", 4 * factor)
        .attr("cx", x_value(i, radius*(1 + 0.5 * 6/8) ))
        .attr("cy", y_value(i, radius*(1 + 0.5 * 6/8) ));
    }
  });

  // loss
  gamesEnter.each(function(d, i) {
    if(d["W/L"] === "L") {
      d3.select(this)
        .append("circle")
        .attr("r", 4*factor)
        .attr("cx", x_value(i, radius*(1 + 0.5 * 5/8) ))
        .attr("cy", y_value(i, radius*(1 + 0.5 * 5/8) ));
    }
  });

  // scored
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Scored / 1 * factor; })
    .attr("cx", function(d, i) { return x_value(i, radius*(1 + 0.5 * 4/8) ); })
    .attr("cy", function(d, i) { return y_value(i, radius*(1 + 0.5 * 4/8) ); });

  // allowed
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Allowed / 1 * factor; })
    .attr("cx", function(d, i) { return x_value(i, radius*(1 + 0.5 * 3/8) ); })
    .attr("cy", function(d, i) { return y_value(i, radius*(1 + 0.5 * 3/8) ); });

  // rank
  // d3.select(this).append("circle")
  //   .attr("r", d.Allowed / 2)
  //   .attr("cx", x(i))
  //   .attr("cy", 200);

  // duration
  gamesEnter.append("circle")
    .attr("r", function(d, i) {
      var gd = d.Duration;
      return (+gd.substr(0,1) + gd.substr(2,2)/60)*1.5 * factor;
    })
    .attr("cx", function(d, i) { return x_value(i, radius*(1 + 0.5 * 2/8) ); })
    .attr("cy", function(d, i) { return y_value(i, radius*(1 + 0.5 * 2/8) ); });

  // attendance
  gamesEnter.append("circle")
    .attr("r", function(d, i) { return d.Attendance / 8000 * factor; })
    .attr("cx", function(d, i) { return x_value(i, radius*(1 + 0.5 * 1/8) ); })
    .attr("cy", function(d, i) { return y_value(i, radius*(1 + 0.5 * 1/8) ); });

  // score
  gamesEnter.append("circle")
    .attr("class", "score")
    .attr("cx", function(d, i) { return x_value(i, radius); })
    .attr("cy", function(d, i) { return y_value(i, radius); })
    .attr("r", function(d) { return Math.abs((d.Scored-d.Allowed)) * factor; });



  gamesEnter
    .style("fill", "#f50")
    .transition()
    .duration(300)
    .style("fill", "#fff")
    // .style("opacity", 0.7)
    .selectAll("circle")
    .attr("r", function() { return d3.select(this).attr("r")/2; });



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
    .selectAll("circle")
    .transition()
    .ease("ease-out")
    .duration(300)
    .attr("r", 0)
    .each("end", function() {
      d3.select(this).remove();
    });

  games.exit()
    .transition()
    .duration(400)
    .each("end", function() {
      d3.select(this).remove();
    });

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
