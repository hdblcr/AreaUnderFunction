// declare variables 
var timeout = false;
var myNow = new Date();
var pausedAt = 0;
var stepsList = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500];
var func = false;
var min = 0;
var max = 0;
var contin = true;
var frame = 0;

function convertToFloat(x) {
  var wrap = () => "\"use strict\";return parseFloat(" + x + ");";
  return new Function(wrap(x));
}

function myFunction(func) {
  var body = "function( x ){ return " + func + "}";
  var wrap = () => "{ return " + body + " };";
  return new Function(wrap(body));
}


class MyPlot {
  constructor(func, steps, min, max) {
    this.func = myFunction(func);
    this.steps = steps;
    this.min = convertToFloat(min).call(null);
    this.max = convertToFloat(max).call(null);
    this.name = func;
    this.width = (this.max - this.min) / this.steps;
    this.plotX = this.plotXplease(this.steps, this.width);
    this.plotY = this.plotYplease(this.steps, this.width);
    this.fX = this.plotXplease(100, (this.max - this.min) / 100);
    this.fY = this.plotYplease(100, (this.max - this.min) / 100);
    this.overArea = this.getOverArea();
    this.upArea = this.getUpArea();
  }

  plotXplease(steps, width) {
    var plot = [];
    for (let i = 0; i < (steps + 1); i++) {
      plot.push((i * width) + this.min);
    }
    return plot;
  }

  plotYplease(steps, width) {
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

    var trace2 = {
      x: this.plotX,
      y: this.plotY,
      line: { shape: 'hv' },
      type: 'scatter',
      fill: 'tozeroy',
      mode: 'none',
      name: "Over then Up"
    };

    var trace3 = {
      x: this.plotX,
      y: this.plotY,
      line: { shape: 'vh' },
      type: 'scatter',
      fill: 'tonexty',
      mode: 'none',
      name: "Up then Over"
    };
    var data = [trace1, trace2, trace3];
    var layout = {
      title: mytitle,
      font: {
        family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        size: 12
      },
    };

    //return {data: data, layout: layout};

    Plotly.newPlot('plot', data, layout);

    // return false to prevent refresh
    return false;
  }
}
/*
function sleep(ms){
  setTimeout(function(){return 0;}, ms);
  return 0;
}
*/
/*
async function uploadFile(filename) {
  const controller = new AbortController()

  // 5 second timeout:
  //const timeoutId = setTimeout(() => controller.abort(), 5000)

	let response = await fetch(filename, {signal: controller.signal});
		
	if(response.status != 200) {
		throw new Error("Server Error: " + response.status);
	}
		
	// read response stream as text
	let text_data = await response.text();
  //console.log(text_data);
	return text_data;
}
*/

function pause() {
  if(!func){
    notRunning();
    return;
  }
  console.log("pause called line 171");
  contin = false;
  /*
  let pauseTime = Date.now();
  for (let i = 0; i < timeouts.length; i++) {
    // clear timeouts
    timeouts[i].clear();
    // "complete" timeouts gone by
    if (pauseTime > timeouts[i].timeoutTime) {
      pausedAt = i + 1;
    } 
  }
  console.log(pausedAt);*/
}

function resume() {
  if(!func){
    notRunning();
    return;
  }
  console.log("resume called");
  contin = true;
  //animate();
}

function notRunning(){
  alert("Press \"Build Plot\" to get started.");
  return;
}

function restart() {
  clearInterval(timeout);
  contin = true;
  frame = 0;
  if(!func){
    notRunning();
    return;
  }
  animate();
  /*
  for (let i=0; i<timeouts.length; i++){
    timeouts[i].clear();
  }
  contin = true;
  pausedAt = 0;
  animate();*/
}

function animate() {
  console.log("animate called. pausedAt = " + pausedAt);
  // set now time
  myNow = Date.now();
  let time = 0;
  const current = pausedAt % stepsList.length;

  let i=current;

  timeout = setInterval(function(){
      if(contin && frame<20*stepsList.length){
        new MyPlot(func, stepsList[frame % stepsList.length], min, max).buildPlot();
        frame++;
      }
    }, 1000);
/*
  for (let i = current + 1; i < 20 * stepsList.length; i++) {
    // collect timeouts
    if(contin){
      timeouts.push(new MyTimeout(

      // timeout id is what setTimeout returns
      setTimeout(function () {
        // created and build each plot
        new MyPlot(func, stepsList[i % stepsList.length], min, max).buildPlot();
      }, 1000 * i),
      // timeoutTime is now + the time of the setTimeout
      myNow + 1000 * (i-current)));
    }
  }  */
}


function main() {



  //get function, min, and max from user
  func = document.getElementById("formFunc").value;
  min = document.getElementById("formMin").value;
  max = document.getElementById("formMax").value;
  
  if (timeout){
    restart();
    return false;
  }
  /*
    do {
      setTimeout(function(){
        new MyPlot(func, stepsList[i % stepsList.length], min, max).buildPlot();
        clearTimeout(oldtimeout);
      }, 1000 * i)
      i++;
    } while (contin);
    */
  /*
  var p = 0;
  var k = 0;
  var now = new Date();
  for (var index = 0; index < 10; index++) {
    (function(idx, timeout){
        setTimeout(function() {
            //write your code here
            console.log("Index: " + idx + ", printed after", (new Date() - now)/1000, " Seconds");

        }, timeout, idx);
        k += 1000;
    })(index, k);
}*/

  // display first one
  //const first = new MyPlot(func, stepsList[0], min, max)
  //first.buildPlot();

  // call animate
  animate();
  /*
    
  
    // build data
    for (let i=0; i<stepsList.length; i++){
      plots.push(new MyPlot(func, stepsList[i], min, max));
    }
  
    // plot data
    for (let i=0; i<plots.length; i++){
      setTimeout(function(){
        plots[i].buildPlot();
      }, 1000 * i);
    }*/
}
