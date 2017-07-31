var rus = (function(){
  var scales = [];
  var scaleCount = 60;

  var DragonScale = function(opts={}){
    var width = opts.width;
    var height = opts.height;
    var accel = 0.25; // catchup speed in pixels per animframe
    var maxVel = opts.maxVel | 6.0;
    var tgt = {x: 100.0, y: 100.0};
    var pos = {x: 0.0, y: 0.0};
    var lastPos = {x: 0.0, y: 0.0};
    var angle = 0.0, lastAngle = 0.0;
    var translationNode;
    var rotationNode;

    var updateTarget = function(newTgt){ // newTgt = {x:int, y:int}
      tgt = newTgt;
    }

    var updatePosition = function(){
      lastPos.x = pos.x;
      lastPos.y = pos.y;
      pos.x = pos.x + clamp((tgt.x - pos.x) * accel, maxVel);
      pos.y = pos.y + clamp((tgt.y - pos.y) * accel, maxVel);
    }

    var updateAngle = function(){
      angle= Math.atan2(pos.y - lastPos.y, pos.x - lastPos.x) - Math.PI * 0.5;
    }

    var getPos = function(){
      return pos;
    }

    var getAngle = function() {
      return angle;
    }

    var getSize = function(){
      return {width: width, height: height};
    }

    var clamp = function(val, maxMag){
      if (-maxMag <= val && maxMag >= val){
        return val;
      } else if (val < -maxMag) {
        return -maxMag;
      } else {
        return maxMag;
      }
    }

    return {
      updateTarget: updateTarget,
      updatePosition: updatePosition,
      updateAngle: updateAngle,
      getPos: getPos,
      getAngle: getAngle,
      getSize: getSize,
      translationNode:translationNode,
      rotationNode:rotationNode
    }
  };
  
  function startup() {
    var el = document.getElementById("stage");
    el.addEventListener("touchstart", handleMove, false);
    el.addEventListener("touchmove", handleMove, false);
  }

  function handleMove(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
          
    var x = touches[0].pageX;
    var y = touches[0].pageY;
    
    updateDragonTarget(x, y);
  }

  var setUpDragon = function(opts={}){
    var stage = document.getElementById("stage");
    var scaleNode;
    var calcSize = 0.0;
    var patternHead = document.getElementsByClassName("head")[0];
    var patternBody = document.getElementsByClassName("scale")[0];
    var patternArms = document.getElementsByClassName("arms")[0];

    for (var i = 0; i < scaleCount; i++) {
      calcSize = scaleCount * 1.2 - i;
      if (i > 0) {
        scales.push(new DragonScale({width: calcSize, height: calcSize}));
        scaleNode = patternBody.cloneNode(true);
        scales[i].translationNode = scaleNode;
        scales[i].rotationNode = scaleNode.getElementsByTagName("object")[0];
      } else if (i == 0) {
        scales.push(new DragonScale({width: calcSize * 2, height: calcSize * 2}));
        scaleNode = patternHead.cloneNode(true);
        scales[i].translationNode = scaleNode;
        scales[i].rotationNode = scaleNode.getElementsByTagName("object")[0];
      }
      scaleNode.style.width = scales[i].getSize().width;
      scaleNode.style.height = scales[i].getSize().height;
      stage.appendChild(scaleNode);
    }
  }

  var updateDragonTarget = function(x, y) {
    var pos={},tgt={};
    for (var i = 0; i < scaleCount; i++){
      if (i == 0) {
        scales[i].updateTarget({x: x, y: y})
      } else {
        tgt = scales[i-1].getPos();
        scales[i].updateTarget(tgt);
      }
    }
  }

  var updateDragonPosition = function() {
    for (var i = 0; i < scaleCount; i++){
      scales[i].updatePosition();
      scales[i].updateAngle();
    }
  }

  var render = function(){
    updateDragonPosition();
    
    for (var i = 0; i < scaleCount; i++){
      var pos = scales[i].getPos();
      var angle = scales[i].getAngle();
      var size = scales[i].getSize();
      var tx = pos.x;
      var ty = pos.y;
      var str = "translate(" + tx + "px ," + ty + "px)";
      scales[i].translationNode.style.transform = str;
      str = "rotate(" + angle + "rad)";
      scales[i].rotationNode.style.transform = str;
    }
  }

  var tick = function() {
    render();
    requestAnimationFrame(tick);
  }

  setUpDragon();
  startup();
  requestAnimationFrame(tick);
  
})();

