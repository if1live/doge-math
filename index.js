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

function render(question, inputSequence, fakeData) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.rect(0, 0, 540, 1080);
  ctx.fillStyle = "#00FFFF";
  ctx.textAlign = "center";
  ctx.fill();
  
  function createFontName(size) {
    return size + "px \"Comic Sans MS\", \"Comic Sans\", \"comic_reliefregular\", cursive, sans-serif";
    //return size + "px \"Comic Sans MS\", \"Comic Sans\", cursive, sans-serif";
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
    ctx.fillText("wow", halfWidth + 60, baseY + 120);
    
    baseY += 270;
    ctx.fillStyle = "#FFFF00";
    ctx.fillText("such function", halfWidth - 150, baseY + 0);
    
    ctx.fillStyle = "#CA1D19";
    ctx.fillText("many maths", halfWidth - 110, baseY + 50);
    
    ctx.fillStyle = "#0008F1";
    ctx.fillText("wow", halfWidth + 10, baseY + 100);
    
    // image
    var imageObj = new Image();
    imageObj.onload = function() {
      var w = 500;
      var h = 646;
      var scale = 1.7;
      ctx.drawImage(imageObj, 290, 860, w/scale, h/scale);
    };
    imageObj.src = './assets/doge.png';
  }
  
  function renderQuestion(ctx, inputSequence, question) {
    var baseY = 50;
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(25);
    ctx.fillText(question, halfWidth, baseY + 0);
    
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(60);
    
    var ySeq = _.map(inputSequence, function(el) { return el[1]; });
    ySeq.push("?");
    var question = ySeq.join(", ")  
    ctx.fillText(question, halfWidth, baseY + 100);
    
    //TODO ?는 다른 색으로?
  }
  
  function renderPolynomial(ctx, coef, baseX, baseY, virtual) {
    var eqY = baseY;
    var eqX = baseX;
    var normalFontSize = 18;
    var supFontSize = 10;
    
    // set basic config
    ctx.fillStyle = "#000000";
    ctx.font = createFontName(normalFontSize);
    ctx.textAlign = "left";
    
    // start equation
    if(!virtual) {
      ctx.fillText("f(x) = ", eqX, eqY);
    }
    eqX += ctx.measureText("f(x) = ").width;
    
    
    var variableWidth = ctx.measureText("x").width;
    
    var reverseCoef = _.map(coef, function(x) { return x; });
    reverseCoef.reverse();
    _.each(reverseCoef, function(x, idx) {
      var order = reverseCoef.length - idx - 1;
      
      // no coef -> no rendering
      if(x.n == 0) {
        return;
      }
      
      // handle sign
      var sign = '';
      if(idx == 0) {
        if(x.s < 0) {
          sign = '-';
        }
      } else {
        if(x.s < 0) {
          sign = '-';
        } else {
          sign = '+';
        }
      }
      if(sign !== "") {
        if(!virtual) {
          ctx.fillText(sign, eqX, eqY);
        }
        eqX += ctx.measureText(sign).width;
      }
      
      if(x.d == 1) {
        // handle coef (number)
        if(!virtual) {
          ctx.fillText(x.n, eqX, eqY);
        }
        eqX += ctx.measureText(x.n).width;
        
      } else {
        // handle coef (fraction)
        var dWidth = ctx.measureText(x.d).width;
        var nWidth = ctx.measureText(x.n).width;
        
        var numWidth = (dWidth > nWidth) ? dWidth : nWidth;
        var nX = eqX + numWidth / 2 - nWidth / 2;
        if(!virtual) {
          ctx.fillText(x.n, nX, eqY - normalFontSize + 5);
        }
        
        var dX = eqX + numWidth / 2 - dWidth / 2;
        if(!virtual) {
          ctx.fillText(x.d, dX, eqY + normalFontSize - 5);
        }
        
        var fractionLineY = eqY - normalFontSize / 3;
        if(!virtual) {
          ctx.beginPath();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = "2";
          ctx.moveTo(eqX, fractionLineY);
          ctx.lineTo(eqX + numWidth, fractionLineY);
          ctx.stroke();
        }
      
        eqX += numWidth;
      }
      
      // handle x ** order
      if(order !== 0) {
        if(!virtual) {
          ctx.fillText('x', eqX, eqY);
        }
        eqX += variableWidth;
        
        if(order > 1) {
          // render sup
          var supHeight = ctx.measureText(order).width;
          
          ctx.font = createFontName(supFontSize);
          if(!virtual) {
            ctx.fillText(order, eqX, eqY - supHeight / 2 - 3);
          }
          eqX += ctx.measureText(order).width;
          
          // restore state
          ctx.font = createFontName(normalFontSize);
        }
      }
    });

    ctx.textAlign = "center";
    
    // eqX = width;
    return eqX;
  }
  
  function renderAnswer(ctx, inputSequence, fakeData) {
    var baseY = 400;
    
    var coef = calculateFunnyCoef(inputSequence, fakeData);
    
    _.each(coef, function(x, idx) {
      console.log(idx + " : " + x.toString());
      console.log(idx + " : " + x.s * x.n + "/" + x.d);
    });
    
    var polyWidth = renderPolynomial(ctx, coef, 0, 0, true);
    renderPolynomial(ctx, coef, halfWidth - polyWidth/2, baseY + 210, false);
    
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
  
  renderQuestion(ctx, inputSequence, question);
  renderAnswer(ctx, inputSequence, fakeData);
  renderDecoration(ctx);
}

function getParameterByName(name) {
  //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// http://stackoverflow.com/questions/6209161/extract-the-current-dom-and-print-it-as-a-string-with-styles-intact
// Element.prototype.serializeWithStyles = (function () { ...
// not use  

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

document.getElementById("btn-copy-url").onclick = function() {
  // http://stackoverflow.com/questions/10729570/html5-alternative-to-flash-based-zeroclipboard-for-safe-copying-of-data-to-clipb
  var form = document.getElementById("form-data");
  var url = getUrl(form);
  var copyElement = document.createElement('input');
  copyElement.setAttribute('type', 'text');
  copyElement.setAttribute('value', url);
  copyElement = document.body.appendChild(copyElement);
  copyElement.select();
  document.execCommand('copy');
  copyElement.remove();
};

function getUrl(form) {
  var fieldList = [
    "question",
    "val_1",
    "val_2",
    "val_3",
    "val_4",
    "fake_data"
  ];
  var queryList = _.map(fieldList, function(field) {
    var value = form[field].value;
    return field + "=" + encodeURIComponent(value);
  })
  var query = queryList.join("&");
  var baseHost = "http://libsora.so/doge-math/"
  var url = baseHost + "?" + query;
  return url;
}

// main function
function updateCanvas() {
  var form = document.getElementById("form-data");
  var inputSequence = [];
  var idx = 1;
  var fieldList = [
    "val_1",
    "val_2",
    "val_3",
    "val_4"
  ];
  _.each(fieldList, function(field) {
    var val = parseInt(form[field].value, 10);
    if(isNaN(val)) {
      return;
    }
    inputSequence.push([idx, val]);
    idx += 1;
  });
  var fakeData = [0, parseInt(form.fake_data.value, 10)];
  var question = form.question.value;
  render(question, inputSequence, fakeData);
  
  var url = getUrl(form);
  document.getElementById("text-url").innerHTML = url;
}

// update mime if value changed
(function() {
  var form = document.getElementById("form-data");
  var fieldList = [
    "question",
    "val_1",
    "val_2",
    "val_3",
    "val_4",
    "fake_data"
  ];
  _.each(fieldList, function(field) {
    var el = form[field];
    el.onchange = updateCanvas;
  });
  
  // fill get query
  if(location.search.length > 0) {
    _.each(fieldList, function(field) {
      var el = form[field];
      var val = getParameterByName(field)
      el.value = decodeURIComponent(val);
    });
  }
  
  updateCanvas();
})();


twttr.ready(function (twttr) {
  //var form = document.getElementById("form-data");
  //var url = getUrl(form);
  //var question = form.question.value;
  var url = "http://libsora.so/doge-math/";
  var question = "Find the next number of the sequence";
  
  twttr.widgets.createShareButton(
    url,
    document.getElementById('twitter-container'),
    {
      text: "Doge Math - " + question
    }
  );
});
