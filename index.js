// http://www.solvemymath.com/online_math_calculator/interpolation.php
// lagrange interpolation
// [0, 217331], [1, 1], [2, 3], [3, 5], [4, 7]

// Reference
// https://mat.iitm.ac.in/home/sryedida/public_html/caimna/interpolation/lagrange.html


function calculateFunnyCoef(inputSequence, fakeData) {
  var xSequence = [fakeData[0]].concat(_.map(inputSequence, function(p) { return p[0]; }));
  var ySequence = [fakeData[1]].concat(_.map(inputSequence, function(p) { return p[1]; }));
  
  var coefSequence = _.map(xSequence, function(x) { return Fraction(0); });
  
  for(var i = 0 ; i < xSequence.length ; ++i) {
    var currX = xSequence[i];
    var currY = ySequence[i];
    
    // numerator
    var numeratorXSeq = _.reject(xSequence, function(x, idx) { return idx == i; });
    var numerator = _.reduce(numeratorXSeq, function(numerator, x) {
      return numerator * (currX - x);
    }, 1.0); 
    
    // not maximum order
    for(var order = 0 ; order < coefSequence.length ; ++order) {
      var denominatorPairArray = k_combinations(numeratorXSeq, coefSequence.length - 1 - order);
      for(var j = 0 ; j < denominatorPairArray.length ; ++j) {
        var denominator = _.reduce(denominatorPairArray[j], function(product, x) { 
          return product.mul(-x);
        }, Fraction(1.0));
        
        coefSequence[order] = coefSequence[order].add(Fraction(currY).mul(denominator).div(numerator)); 
      }
    }
    
    // maximum order
    var maxOrder = coefSequence.length - 1;
    coefSequence[maxOrder] = coefSequence[maxOrder].add(Fraction(currY).div(numerator));
  }
  
  return coefSequence;
}

function calculateFunnySolutionWithCoef(coefSeq, x) {
  var retval = 0.0;
  for(var i = 0 ; i < coefSeq.length ; ++i) {
    var coef = coefSeq[i];
    retval += coef.valueOf() * Math.pow(x, i);
  }
  return retval;
}

function render(inputSequence, fakeData) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.rect(0, 0, 540, 1080);
  ctx.fillStyle = "#00FFFF";
  ctx.textAlign = "center";
  ctx.fill();
  
  function createFontName(size) {
    return size + "px \"Comic Sans MS\", cursive, sans-serif";
  }
  var halfWidth = ctx.canvas.width / 2;
  
  function renderDecoration(ctx) {
    var baseY = 700;
    ctx.font = createFontName(35); 
    
    ctx.fillStyle = "#00F455";
    ctx.fillText("much solution", halfWidth + 120, baseY + 0);
    
    ctx.fillStyle = "#C91EED";
    ctx.fillText("very logic", halfWidth + 150, baseY + 80);
    
    ctx.fillStyle = "#0008F1";
    ctx.fillText("wow", halfWidth + 20, baseY + 100);
    
    baseY += 270;
    ctx.fillStyle = "#FFFF00";
    ctx.fillText("such function", halfWidth - 150, baseY + 0);
    
    ctx.fillStyle = "#CA1D19";
    ctx.fillText("many maths", halfWidth - 110, baseY + 50);
    
    ctx.fillStyle = "#0008F1";
    ctx.fillText("wow", halfWidth + 10, baseY + 100);  
  }
  
  function renderQuestion(ctx, inputSequence) {
    var baseY = 50;
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(25);
    ctx.fillText("Find the next number of the sequence", halfWidth, baseY + 0);
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(60);
    
    var ySeq = _.map(inputSequence, function(el) { return el[1]; });
    ySeq.push("?");
    var question = ySeq.join(", ")  
    ctx.fillText(question, halfWidth, baseY + 100);
    
    //TODO ?는 다른 색으로?
  }
  
  function renderAnswer(ctx, inputSequence, fakeData) {
    var baseY = 400;
    
    var coef = calculateFunnyCoef(inputSequence, fakeData);
    
    _.each(coef, function(x, idx) {
      console.log(idx + " : " + x.toString());
      console.log(idx + " : " + x.s * x.n + "/" + x.d);
    });
    
    
    var targetX = inputSequence[inputSequence.length-1][0] + 1;
    var solution = calculateFunnySolutionWithCoef(coef, targetX);
    console.log("real solution : " + solution);
    var solutionStr = solution.toString(); 
    if(solution != Math.floor(solution)) {
      solutionStr = "≈ " + solution.toFixed(2);
    }
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(55);
    ctx.fillText("Correct solution", halfWidth, baseY + 0);
    
    ctx.fillStyle = "#0D07F1";
    ctx.font = createFontName(70);
    ctx.fillText(solutionStr, halfWidth, baseY + 100);
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(30);
    ctx.fillText("because when", halfWidth, baseY + 150);
    
    var functionOutputBaseY = 700;
    var functionOutputBaseX = 100;
    var functionOutputFontSize = 30;
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(functionOutputFontSize);
    ctx.textAlign = "left";
    _.each(inputSequence, function(el, idx) {
      var x = el[0];
      var y = el[1];
      ctx.fillText("f(" + x + ")=" + y, functionOutputBaseX, functionOutputBaseY + idx * 50);
    });
    
    var finalOutputY = functionOutputBaseY + inputSequence.length * 50;
    var answerText = "f(" + targetX + ")=" + solution;
    ctx.fillText(answerText, functionOutputBaseX, finalOutputY);
    ctx.textAlign = "center";
    
    ctx.beginPath();
    ctx.strokeStyle = "#0008F1";
    ctx.lineWidth = "8";
    ctx.rect(functionOutputBaseX - 10, finalOutputY - 35, ctx.measureText(answerText).width + 20, functionOutputFontSize + 20);
    ctx.stroke();
  }
  
  renderQuestion(ctx, inputSequence);
  renderAnswer(ctx, inputSequence, fakeData);
  renderDecoration(ctx);
}


//http://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
function dlCanvas() {
  var canvas = document.getElementById("myCanvas");
  var dt = canvas.toDataURL('image/png');
  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
  dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=doge-math.png');
  this.href = dt;
};
document.getElementById("dl").addEventListener('click', dlCanvas, false);


// main function
function updateCanvas() {
  var form = document.getElementById("form-data");
  var inputSequence = [
    [1, parseInt(form.val_1.value, 10)], 
    [2, parseInt(form.val_2.value, 10)],
    [3, parseInt(form.val_3.value, 10)],
    [4, parseInt(form.val_4.value, 10)]
  ];
  var fakeData = [0, parseInt(form.fake_data.value, 10)];
  render(inputSequence, fakeData); 
}
updateCanvas();
