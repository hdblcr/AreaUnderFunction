function convertToFloat(x) {
  var wrap = s => '"use strict";return parseFloat(' + x + ');';
  return new Function( wrap(x) );
} 

function myFunction(func){
  var body = "function( x ){ return " + func + "}";
  var wrap = s => "{ return " + body + " };";
  return new Function(wrap (body) );
}

class MyPlot{
  constructor(func, steps, min, max){
    this.func = myFunction(func);
    this.steps = steps;
    this.min = convertToFloat(min).call(null);
    this.max = convertToFloat(max).call(null);
    this.name = func;
    this.width = (this.max-this.min)/this.steps;
    this.plotX = this.plotXplease(this.steps, this.width);
    this.plotY = this.plotYplease(this.steps, this.width);
    this.fX = this.plotXplease(100, (this.max-this.min)/100);
    this.fY = this.plotYplease(100, (this.max-this.min)/100);
    this.overArea = this.getOverArea();
    this.upArea = this.getUpArea();
  }

  plotXplease(steps, width){
    var plot = [];
    for (let i=0; i<(steps+1); i++){
      plot.push((i * width) + this.min);
    }
    return plot;
  }

  plotYplease(steps, width){
    var plot = [];
    for (let i=0; i<(steps+1); i++){
      let x = (i * width) + this.min;
      plot.push(this.func.call(null).call(null, x));
    }
    return plot;
  }

  getOverArea(){
    var area = 0;
    for (let i=0; i<this.plotY.length; i++){
      area += this.width * this.plotY[i];
    }
    return area;
  }

  getUpArea(){
    var area = 0;
    for (let i=0; i<this.plotY.length-1; i++){
      area += this.width * this.plotY[i+1];
    }
    let x = this.width * this.steps + this.min;
    area += this.func.call(null).call(null,x) ;
    return area;
  }

  buildPlot(){

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
      line: {shape: 'hv'},
      type: 'scatter',
      fill: 'tozeroy',
      mode: 'none',
      name: "Over then Up"
    };

    var trace3 = {
      x: this.plotX,
      y: this.plotY,
      line: {shape: 'vh'},
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
function main() {
  //get function, min, and max from user
  var func = document.getElementById("formFunc").value;
  var min = document.getElementById("formMin").value;
  var max = document.getElementById("formMax").value;

  var steps = [5,10,15,20,30,40,50,60,70,80,90,100,150,200,250,300,350,400,450,500];

  let plots = [];
  let frames = [];
  const first = new MyPlot(func, steps[0], min, max)

  first.buildPlot();
  /*
  .then(function() {
    // find data
    for (let i=1; i<steps.length; i++){
      plots.push(new MyPlot(func, steps[i], max));
    }

    // add to frames
    for (let i=0; i < plots.length; i++){
      frames.push(plots[i].buildPlot());
    }

    // Add frames so we can animate them
    Plotly.addFrames('plot', frames);
  });


  // animate the frames
  Plotly.animate('plot', frames, {
    transition: {
      duration: 100,
    },
    frame: {
      duration: 1000,
      redraw: false
    },
    mode: 'afterall'
  });
*/
  // build data
  for (let i=0; i<steps.length; i++){
    plots.push(new MyPlot(func, steps[i], min, max));
  }

  // plot data
  for (let i=0; i<plots.length; i++){
    setTimeout(function(){
      plots[i].buildPlot();
    }, 1000 * i);
  }
}
