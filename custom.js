// declare global variables 
var timeout = false;
var stepsList = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500];
var func = false;
var min = 0;
var max = 0;
var contin = true;
var frame = 0;

//===== functions to read user input and convert to useable functions
function convertToFloat(x) {
  var wrap = () => "\"use strict\";return parseFloat(" + x + ");";
  return new Function(wrap(x));
}

function myFunction(func) {
  var body = "function( x ){ return " + func + "}";
  var wrap = () => "{ return " + body + " };";
  return new Function(wrap(body));
}

//===== class for plotly stuff ====
class MyPlot {
  constructor(func, steps, min, max) {
    this.func = myFunction(func);
    this.steps = steps;
    this.min = convertToFloat(min).call(null);
    this.max = convertToFloat(max).call(null);
    this.name = func;
    this.width = (this.max - this.min) / this.steps;
    this.plotX = this.getPlotX(this.steps, this.width);
    this.plotY = this.getPlotY(this.steps, this.width);
    this.fX = this.getPlotX(100, (this.max - this.min) / 100);
    this.fY = this.getPlotY(100, (this.max - this.min) / 100);
    this.overArea = this.getOverArea();
    this.upArea = this.getUpArea();
  }

  getPlotX(steps, width) {
    var plot = [];
    for (let i = 0; i < (steps + 1); i++) {
      plot.push((i * width) + this.min);
    }
    return plot;
  }

  getPlotY(steps, width) {
    var plot = [];
    for (let i = 0; i < (steps + 1); i++) {
      let x = (i * width) + this.min;
      plot.push(this.func.call(null).call(null, x));
    }
    return plot;
  }

  getOverArea() {
    var area = 0;
    for (let i = 0; i < this.plotY.length; i++) {
      area += this.width * this.plotY[i];
    }
    return area;
  }

  getUpArea() {
    var area = 0;
    for (let i = 0; i < this.plotY.length - 1; i++) {
      area += this.width * this.plotY[i + 1];
    }
    let x = this.width * this.steps + this.min;
    area += this.func.call(null).call(null, this.max + this.width) * this.width;
    return area;
  }

  buildPlot() {

    // Create chart title
    var mytitle = "Steps: " + this.steps + "<br />Over then up area is " + this.overArea.toPrecision(5) + "<br />Up then over area is " + this.upArea.toPrecision(5);

    // plot simulation
    var trace1 = {
      x: this.fX,
      y: this.fY,
      name: this.name
    };

    // plot over then up
    var trace2 = {
      x: this.plotX,
      y: this.plotY,
      line: { shape: 'hv' },
      type: 'scatter',
      fill: 'tozeroy',
      mode: 'none',
      name: "Over then Up"
    };

    // plot up then over
    var trace3 = {
      x: this.plotX,
      y: this.plotY,
      line: { shape: 'vh' },
      type: 'scatter',
      fill: 'tonexty',
      mode: 'none',
      name: "Up then Over"
    };
    
    // collect all plots
    var data = [trace1, trace2, trace3];
    var layout = {
      title: mytitle,
      font: {
        family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        size: 12
      },
    };

    // Show plot
    Plotly.newPlot('plot', data, layout);

    // return false to prevent refresh
    return false;
  }
}

//===== functions to run animation =======
function pause() {
  // check that we are already running
  if(!func){
    notRunning();
    return;
  }
  contin = false; // pause interval execution
}

function resume() {
  // check that we are already running
  if(!func){
    notRunning();
    return;
  }
  contin = true; // allow to run again
}

function notRunning(){
  alert("Press \"Build Plot\" to get started.");
  return;
}

function restart() {
  // check that we are already running
  if(!func){
    notRunning();
    return;
  }

  // start from scratch by clearing interval
  clearInterval(timeout);
  contin = true; // allow to run again
  frame = 0; // start with frame 0
  animate(); // kick it off
}

function animate() {
  // new frame each second
  timeout = setInterval(function(){
    // if we're allowed to run and aren't in an infinite loop
    if(contin && frame<20*stepsList.length){
      // create and show a new plot
      new MyPlot(func, stepsList[frame % stepsList.length], min, max).buildPlot();
      // increase frame number
      frame++;
    }
  }, 1000);
}

//======= kick it off, read in user input =======
function main() {

  //get function, min, and max from user
  func = document.getElementById("formFunc").value;
  min = document.getElementById("formMin").value;
  max = document.getElementById("formMax").value;
  
  // if already running, just call restart animation instead
  if (timeout){
    restart();
    return false;
  }

  // call animate
  animate();

  // return false to prevent refresh
  return false;
}
