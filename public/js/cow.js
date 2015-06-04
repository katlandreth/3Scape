$(window).load(function(){
$(".startGame").fadeIn(1000);
  
  // ----------- MAKE TIMER --------------
  var handle;
	var clock = $('#clock');
	var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
	var digits = {};
	var positions = [
		'm1', 'm2', ':', 's1', 's2'
	];
	var digit_holder = clock.find('.digits');

	$.each(positions, function(){

		if(this == ':'){
			digit_holder.append('<div class="dots">');
		}
		else{
      
			var pos = $('<div>');

			for(var i=1; i<8; i++){
        console.log("for loop works");
				pos.append('<span class="d' + i + '">');
			}
			digits[this] = pos;
			digit_holder.append(pos);
		}
	});

	// Run a timer every second and update the clock

  function runTimer(){
    var now = moment().startOf('hour');
    function update_time(){
      var formatted = now.format("mmss");
      digits.m1.attr('class', digit_to_name[formatted[0]]);
      digits.m2.attr('class', digit_to_name[formatted[1]]);
      digits.s1.attr('class', digit_to_name[formatted[2]]);
      digits.s2.attr('class', digit_to_name[formatted[3]]);
      now = now.add(1, 's');
      checkTime();
    };
    handle = setInterval(update_time, 1000);
  };
 
  
  // ------------ START GAME ----------------
  
  function startGame(){
    var allColliders = [];
    var count = 0;
    
    //Generate a random number - used in random positioning of jewel and colliders
    function randomNumber(){
      var num = Math.floor(Math.random()*75) + 1; 
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
      return num;
    };


    function makeTrigger(xPos, zPos){
      var cmd =  "<Model name='trigger' url='objects/wall.lwo' moveable='false' opacity='1' selectable='false' physicsEnabled='true' detectCollision='true'>";
          cmd += "<color r='0.55' g='0.025' b='0.30' a='1'/>";
          cmd += "<scale x='10' y='10' z='3' />";
          cmd += "<rotation x='90' y='0' z='0' />";
//          cmd += "<position x='" + xPos + "' y='0' z='" + zPos + "' />";  
          cmd += "<position x='0' y='0' z='0' />"
          cmd += "<physicalProperties>";
          cmd += "<mass>0</mass>";
          cmd += "<friction>0.0</friction>";
          cmd += "</physicalProperties>";
          cmd += "</Model>";
      bridgeworks.updateScene(cmd);
    }
    
    makeTrigger(randomNumber(), randomNumber());
    
    // Get the cow and make it a collider
    function collide(){
        cmd = "<Update><AnimalMover name='Roaming_cow' target='cow' linearSpeed='1' angularSpeed='5'/>";
        cmd += "<Set target='cow' detectCollision='" + true + "' detectObstruction='false'>";
        cmd += "</Set>"
        cmd += "</Update>";
      bridgeworks.updateScene(cmd);
    }
    
    collide();

    
    
    //Keep the Cow on the Grid & check the position of the trigger
    function checkXZ(part){
      var partToCheck = bridgeworks.get(part),
          sRot = partToCheck.rotation.getValueDirect(),
          positionXYZ = partToCheck.position.getValueDirect(),
          positionX = positionXYZ.x,
          positionZ = positionXYZ.z,
          positionXZ = {x:positionX, z:positionZ};
//        console.log("checking position: " + positionX + " " + positionZ);
      if (part == "cow"){
        if (positionX > 5){
          partToCheck.position.setValueDirect(positionXYZ.x-5, positionXYZ.y, positionXYZ.z);
          partToCheck.rotation.setValueDirect(sRot.x, sRot.y+90, sRot.z);
        }
        else if (positionX < -5){
          partToCheck.position.setValueDirect(positionXYZ.x+5, positionXYZ.y, positionXYZ.z);
          partToCheck.rotation.setValueDirect(sRot.x, sRot.y+90, sRot.z);
        }
        else if (positionZ > 5){
          partToCheck.position.setValueDirect(positionXYZ.x, positionXYZ.y, positionXYZ.z-5);
          partToCheck.rotation.setValueDirect(sRot.x, sRot.y+90, sRot.z);
        }

        else if (positionZ < -5){
          partToCheck.position.setValueDirect(positionXYZ.x, positionXYZ.y, positionXYZ.z+5);
          partToCheck.rotation.setValueDirect(sRot.x, sRot.y+90, sRot.z);
        }
        return positionXZ;
      }
      else if (part == "trigger"){
        return positionXZ;
      }
    };
    
    var triggerPosition = checkXZ("trigger");
    console.log("trigger position " + triggerPosition);
    var triggerArray = [];
    
    var checkColliders = setInterval(function(){
      var currentCow = checkXZ("cow");
      
      console.log(currentCow);
    //  console.log("trigger position " + triggerPosition.x + " trigger possition plus five " + (triggerPosition.x + 5));
      if ( (triggerPosition.x + 15) >= currentCow.x && currentCow.x >= (triggerPosition.x - 15) && (triggerPosition.z + 15) >= currentCow.z && currentCow.z >= (triggerPosition.z - 15) ) {
        console.log("#1 trigger!");
        if ( triggerArray.length == 3 ){
          console.log("!!!!!!WINNER!!!!!!");
          winGame();
        }
        triggerArray.push("trigger");
        }
      else {
        console.log("cow not on trigger");
        triggerArray = [];
      }
    }, 1000);
    
 
    var checkTime = setInterval (function checkTime(){
      if ( $(".digits div:nth-child(2)").hasClass("two")){
        console.log("two minutes!");
        winGame();
      };
    }, 1000);
    
    function winGame(){
      clearInterval(checkColliders);
      clearInterval(checkTime);
      bridgeworks.contentDir = '/BwContent';
      bridgeworks.onLoadModified();
      bridgeworks.updateScene('Winner.xml');
      setTimeout(function(){
        $(".winnerMessage").fadeIn(4000);
      },1500);
    }
    
  }; //END of START GAME

  
  $(".startGame button").click(function(){
    $(".startGame").fadeOut(2000);    
    startGame();
//    runTimer();
  });

  $(".loseMessage button, .winnerMessage button").click(function(){
    console.log("lose button clicked");
    bridgeworks.contentDir = '/BwContent';
    bridgeworks.onLoadModified();
    bridgeworks.updateScene('AdventureTime.xml');
    $(".loseMessage").fadeOut(2000);
    $(".winnerMessage").fadeOut(2000);
    runTimer();
    startGame();
  });

});