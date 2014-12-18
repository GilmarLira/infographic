var sound;

function preload() {

  	sound = loadSound('audio/dusted.mp3');
  	// "Keg Baseball" by Centz, thank you freemusicarchive.com http://hope.ly/1J1BvZS

}

function setup() {
  noCanvas();

  // song loaded during preload(), ready to play in setup()
  sound.play();
}

//Scott & Ryan - hiding technique, thank you and see it in action: https://github.com/rybotron/wnm498genart_f14/tree/gh-pages/week10/Scott%26Ryan
function hideWrapper() {
 	document.getElementById('wrapper').style.cssText = 'display:none';

}
