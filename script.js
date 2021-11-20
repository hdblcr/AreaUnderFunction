
class MyPlot{
  constructor(dataList, steps, max, name){
    const dl = dataList.split("~");
    this.steps = steps.split(".")[0];
    this.plotX = dl[0].split(",");
    this.plotY = dl[1].split(",");
    this.fX = dl[2].split(",");
    this.fY = dl[3].split(",");

    this.overArea = dl[4];
    this.upArea = dl[5];
    this.max = max;
    this.name = name;
  }
  
  buildPlot(){

    // Create chart title
    var mytitle = "Steps: " + this.steps + "<br />Over then up area is " + Math.round(this.overArea) + "<br />Up then over area is " + Math.round(this.upArea);

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
    Plotly.newPlot('plot', data, layout);

    // return false to prevent refresh
    return false;
  }
}

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

async function main() {
  let plots = [];
  //console.log("hello " + plots);
  try {
		var filelist = await uploadFile("xSquared/filelist.txt");
    const files = filelist.split("~");
    for (let i=0; i < (files.length - 1); i++){
      
      try {
        //console.log("file: " + files[i]);
        let filename = "xSquared/" + files[i];
        let plotdata = await uploadFile(filename);
        var newPlot = new MyPlot(plotdata, files[i]);
        plots.push(newPlot);
      }
      catch(e){
        alert("Gathering data. \n" + e.message);
        console.log(e);
      }
    }
    // plot data
    for (let i=0; i < plots.length; i++){
      setTimeout(function(){
        plots[i].buildPlot();
      }, 1000 * i);
    }

/*
    for (var count = 0; count < plots.length; count++) {
      (function(){setTimeout(function() {
          plots[count].buildPlot();
      }, 1000 * count)})();
    }*/

	}
	catch(e) {
		alert("Gathering filelist. \n" + e.message);
    console.log(e);
	}
}
