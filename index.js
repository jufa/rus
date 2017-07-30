var rus = (function(){
  var scales = [];
  var scaleCount = 30;

  var DragonScale = function(opts={}){
    var accel = 0.15; // catchup speed in pixels per animframe
    var maxVel = opts.maxVel | 8.0;
    var tgt = {x: 100.0, y: 100.0};
    var pos = {x: 0.0, y: 0.0};
    var lastPos = {x: 0.0, y: 0.0};

    var updateTarget = function(newTgt){ // newTgt = {x:int, y:int}
      tgt = newTgt;
    }

    var updatePosition = function(){
      Object.assign(lastPos, pos);
      pos.x = pos.x + clamp((tgt.x - pos.x) * accel, maxVel);
      pos.y = pos.y + clamp((tgt.y - pos.y) * accel, maxVel);
    }

    var getPos = function(){
      return pos;
    }

    var getAngle = function() {
      return Math.atan2(pos.y - lastPos.y, pos.x - lastPos.x);
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
      getPos: getPos,
      getAngle: getAngle
    }
  };
  
  function startup() {
    var el = document.getElementById("stage");
    el.addEventListener("touchstart", handleMove, false);
    // el.addEventListener("touchend", handleEnd, false);
    // el.addEventListener("touchcancel", handleCancel, false);
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
    var segments = opts.segments | 1;
    for (let i = 0; i < scaleCount; i++) {
      scales.push(new DragonScale());
      scaleNode = document.createElement("div");
      stage.appendChild(scaleNode);
      scaleNode.setAttribute("class", "scale");
      scaleNode.setAttribute("name", "scale");
      scaleNode.style.width = scaleCount*2-i*2+10 + "px";
      scaleNode.style.height = scaleCount*2-i*2+10 + "px";
    }

  }

  var updateDragonTarget = function(x, y) {
    var pos={},tgt={};
    for (var i in scales){
      if (i == 0) {
        scales[i].updateTarget({x: x, y: y})
      } else {
        tgt = scales[i-1].getPos();
        scales[i].updateTarget(tgt);
      }
    }
  }

  var updateDragonPosition = function() {
    for (var i in scales){
      scales[i].updatePosition();
    }
  }

  var render = function(){
    updateDragonPosition();
    for (let i in scales){
      var el = document.getElementsByName("scale")[i];
      var pos = scales[i].getPos();
      var angle = scales[i].getAngle();
      el.style.transform = "translate(" + pos.x + "px ," + pos.y + "px) rotate(" + angle + "rad)";
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

