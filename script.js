/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱    KONAMI CODE     ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/


/**
 * Handles KeySequences
 * @property {KeySequence[]} keySequences - An array of key sequences.
 * @property {number[]} keys - An array of keys to process on keydown.
 */
 function KeySequenceHandler (keySequences) {
  this.keySequences = keySequences;
  this.keys = [];

  this.init();
}

/**
* Populates keys array and readies keydown event listener.
*/
KeySequenceHandler.prototype.init = function () {
  this.keys = this.getKeys(this.keySequences);

  document.addEventListener('keydown', function(e) {
      var keyCode = e.keyCode;
      if (this.keys.indexOf(keyCode) != -1) {
          for (var i = 0; i < this.keySequences.length; i++) {
              this.keySequences[i].step(keyCode);
          }
      }
  }.bind(this));
};

/**
* Get all keys from key sequences
* @param {KeySequence[]} keySequences - An array of key sequences.
* @return {number[]} - A deduped array of keys used in all key sequences.
*/
KeySequenceHandler.prototype.getKeys = function (keySequences) {
  var keys = [];

  // for each key sequence
  for (var i = 0; i < keySequences.length; i++) {

      // for each key in sequence
      var sequence = keySequences[i].sequence;
      for (var j = 0; j < sequence.length; j++) {

          var key = sequence[j];
          if (keys.indexOf(key) == -1) {
              keys.push(key);
          }
      }
  }
  return keys;
};
/**
* Defines a sequence of keypresses with accompanying code to execute.
* @param {number[]} sequence - A sequence of keys.
* @param {Function} callback - A function to be called when the sequence is completed.
* @property {number} position - A number for tracking position in the sequence.
*/
function KeySequence (sequence, callback) {
  this.sequence = sequence;
  this.callback = (callback === undefined) ? Function.prototype : callback; // noop?
  this.position = 0;
}

/**
* Steps through the sequence.
* @param {number} keyCode - A key code to check.
*/
KeySequence.prototype.step = function (keyCode) {
  var req = this.sequence[this.position];
  if (keyCode == req) {
      this.position++;
      if (this.position == this.sequence.length) {
          this.position = 0;
          this.callback(); // hurrah!
      }
  } else {
      this.position = 0;
  }
};
/* END KEY SEQUENCE */










/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱   THREE.JS ANI     ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/
//----------------------------------------------------------------- BASIC parameters
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  console.log(window.innerWidth);
};
//---

document.body.appendChild( renderer.domElement );

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
};

var camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 500 );

camera.position.set(0, 2, 14);

var scene = new THREE.Scene();
var city = new THREE.Object3D();
var smoke = new THREE.Object3D();
var town = new THREE.Object3D();

var createCarPos = true;
var uSpeed = 0.0001;

//----------------------------------------------------------------- FOG background

var setcolor = 0xF02050;
//var setcolor = 0xF2F111;
//var setcolor = 0xFF6347;

scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);
//scene.fog = new THREE.FogExp2(setcolor, 0.05);
//----------------------------------------------------------------- RANDOM Function
function mathRandom(num = 8) {
  var numValue = - Math.random() * num + Math.random() * num;
  return numValue;
};
//----------------------------------------------------------------- CHANGE bluilding colors
var setTintNum = true;
function setTintColor() {
  if (setTintNum) {
    setTintNum = false;
    var setColor = 0x000000;
  } else {
    setTintNum = true;
    var setColor = 0x000000;
  };
  //setColor = 0x222222;
  return setColor;
};

//----------------------------------------------------------------- CREATE City

function init() {
  var segments = 2;
  for (var i = 1; i<100; i++) {
    var geometry = new THREE.CubeGeometry(1,0,0,segments,segments,segments);
    var material = new THREE.MeshStandardMaterial({
      color:setTintColor(),
      wireframe:false,
      opacity:0.9,
      //transparent:true,
      roughness: 0.3,
      metalness: 1,
      shading: THREE.SmoothShading,
      //shading:THREE.FlatShading,
      side:THREE.DoubleSide});
    var wmaterial = new THREE.MeshLambertMaterial({
      color:0xFFFFFF,
      wireframe:true,
      transparent:true,
      opacity: 0.03,
      side:THREE.DoubleSide/*,
      shading:THREE.FlatShading*/});

    var cube = new THREE.Mesh(geometry, material);
    var wire = new THREE.Mesh(geometry, wmaterial);
    var floor = new THREE.Mesh(geometry, material);
    var wfloor = new THREE.Mesh(geometry, wmaterial);
    
    cube.add(wfloor);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1+Math.abs(mathRandom(8));
    
    //floor.scale.x = floor.scale.z = 1+mathRandom(0.33);
    floor.scale.y = 0.05;+mathRandom(0.5);
    cube.scale.y = 0.1+Math.abs(mathRandom(8));
    //TweenMax.to(cube.scale, 0.1, {y:cube.rotationValue, repeat:-1, yoyo:true, delay:i*0.0001, ease:Power1.easeInOut});
    /*cube.setScale = 0.1+Math.abs(mathRandom());
    
    TweenMax.to(cube.scale, 4, {y:cube.setScale, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});
    TweenMax.to(cube.position, 4, {y:cube.setScale / 2, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});*/
    
    var cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth+mathRandom(1-cubeWidth);
    //cube.position.y = cube.scale.y / 2;
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());
    
    floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z)
    
    town.add(floor);
    town.add(cube);
  };
  //----------------------------------------------------------------- Particular
  
  var gmaterial = new THREE.MeshToonMaterial({color:0xFFFF00, side:THREE.DoubleSide});
  var gparticular = new THREE.CircleGeometry(0.01, 3);
  var aparticular = 5;
  
  for (var h = 1; h<300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular),mathRandom(aparticular));
    particular.rotation.set(mathRandom(),mathRandom(),mathRandom());
    smoke.add(particular);
  };
  
  var pmaterial = new THREE.MeshPhongMaterial({
    color:0x000000,
    side:THREE.DoubleSide,
    roughness: 10,
    metalness: 0.6,
    opacity:0.9,
    transparent:true});
  var pgeometry = new THREE.PlaneGeometry(60,60);
  var pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = -90 * Math.PI / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;
  //pelement.material.emissive.setHex(0xFFFFFF + Math.random() * 100000);

  city.add(pelement);
};

//----------------------------------------------------------------- MOUSE function
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var intersected;

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};
function onDocumentTouchStart( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
    mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
  };
};
function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
    mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
  }
}
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false );
window.addEventListener('touchmove', onDocumentTouchMove, false );

//----------------------------------------------------------------- Lights
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

var spotLightHelper = new THREE.SpotLightHelper( lightFront );
//scene.add( spotLightHelper );

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0,6,0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

//----------------------------------------------------------------- GRID Helper
var gridHelper = new THREE.GridHelper( 60, 120, 0xFF0000, 0x000000);
city.add( gridHelper );

//----------------------------------------------------------------- CAR world
var generateCar = function() {
  
}
//----------------------------------------------------------------- LINES world

var createCars = function(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
  var cMat = new THREE.MeshToonMaterial({color:cColor, side:THREE.DoubleSide});
  var cGeo = new THREE.CubeGeometry(1, cScale/40, cScale/40);
  var cElem = new THREE.Mesh(cGeo, cMat);
  var cAmp = 3;
  
  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = (mathRandom(cAmp));

    TweenMax.to(cElem.position, 3, {x:cPos, repeat:-1, yoyo:true, delay:mathRandom(3)});
  } else {
    createCarPos = true;
    cElem.position.x = (mathRandom(cAmp));
    cElem.position.z = -cPos;
    cElem.rotation.y = 90 * Math.PI / 180;
  
    TweenMax.to(cElem.position, 5, {z:cPos, repeat:-1, yoyo:true, delay:mathRandom(3), ease:Power1.easeInOut});
  };
  cElem.receiveShadow = true;
  cElem.castShadow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);
};

var generateLines = function() {
  for (var i = 0; i<60; i++) {
    createCars(0.1, 20);
  };
};

//----------------------------------------------------------------- CAMERA position

var cameraSet = function() {
  createCars(0.1, 20, 0xFFFFFF);
  TweenMax.to(camera.position, 1, {y:1+Math.random()*4, ease:Expo.easeInOut})
};

//----------------------------------------------------------------- ANIMATE

var animate = function() {
  var time = Date.now() * 0.00005;
  requestAnimationFrame(animate);
  
  city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
  city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
  if (city.rotation.x < -0.05) city.rotation.x = -0.05;
  else if (city.rotation.x>1) city.rotation.x = 1;
  var cityRotation = Math.sin(Date.now() / 5000) * 13;
  //city.rotation.x = cityRotation * Math.PI / 180;
  
  //console.log(city.rotation.x);
  //camera.position.y -= (-(mouse.y * 20) - camera.rotation.y) * uSpeed;;
  
  for ( let i = 0, l = town.children.length; i < l; i ++ ) {
    var object = town.children[ i ];
    //object.scale.y = Math.sin(time*50) * object.rotationValue;
    //object.rotation.y = (Math.sin((time/object.rotationValue) * Math.PI / 180) * 180);
    //object.rotation.z = (Math.cos((time/object.rotationValue) * Math.PI / 180) * 180);
  }
  
  smoke.rotation.y += 0.01;
  smoke.rotation.x += 0.01;
  
  camera.lookAt(city.position);
  renderer.render( scene, camera );  
}

//----------------------------------------------------------------- START functions
generateLines();
init();
animate();





/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱   KONAMI CODES     ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/


;(function(window) {
	'use strict';


  // example sequences
var sequence1 = new KeySequence(
  [38, 38, 40, 40, 37, 39,37 ,39, 66, 65],
  function () { 
    // DO THINGSSSSSS
    alert('congradulations. you understood the assignment. you will now be taken to an exclusive area.');
    window.open('http://eveassistant.com/vip');
  }
);

  // example sequences
  var sequence2 = new KeySequence(
    [69, 86, 69, 65, 83, 83, 73, 83, 84, 65, 78, 84],
    function () { 
      // DO THINGSSSSSS
      alert('you are being redirected to the administrator panel');
      window.open('http://eveassistant.com/admin',"_self");
    }
  );

/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱     BREAK LINE     ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/
new KeySequenceHandler([sequence1,sequence2]);
/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱      FIND IP       ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/
  function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
    var pc = new myPeerConnection({iceServers: []}),
      noop = function() {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function ipIterate(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }
    pc.createDataChannel(""); //create a bogus data channel
    pc.createOffer(function(sdp) {
      sdp.sdp.split('\n').forEach(function(line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(ipIterate);
      });
      pc.setLocalDescription(sdp, noop, noop);
    }, noop); // create offer and set local description
    pc.onicecandidate = function(ice) { //listen for candidate events
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
    };
  }

  function addIP(ip) {
    console.log('got ip: ', ip);

    var theIp = document.getElementById('ip');
    var theConsole = $('span.console');
    var texted = ip;

    theIp.textContent = ip;
    theConsole.html(texted);
  }

  findIP(addIP);
/*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱   FIND LOCATION    ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/
  $.getJSON('https://ipapi.co/'+$(ip).val()+'/json', function(data) {
    $('.country').text(data.country);
  });

	(function() {
		var theConsole = $('span.console');
		var texted = $("#ip").text();
		theConsole.html(texted);
	});


  /*
  ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
 ╱╱    SEARCH FORM     ╱╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
*/
  var search_form = document.getElementsByClassName('search__form');
  console.log(search_form);

  function createHome() {
    var homeDiv = document.createElement('div');
    homeDiv.innerHTML = '<div class="home_container"><h2>HELP INFORMATION:</h2><p>Please try inputting a command, and pressing "enter". <br/> You can see the list of commands under "Navigation Portals".</p><div class="close_home" href="">x</div></div>';
    homeDiv.setAttribute('class', 'home');
    document.body.appendChild(homeDiv);

    $('.close_home').click(function() {
      $('.home').remove();
      console.log('Home Erased');
    });
  }

  function createAdmin() {
    var homeDiv = document.createElement('div');
    homeDiv.innerHTML = '<div class="home_container"><h2>If you are an administrator, </h2><p>please navigate to and login to the console.</p><div class="close_home" href="">x</div></div>';
    homeDiv.setAttribute('class', 'home');
    document.body.appendChild(homeDiv);

    $('.close_home').click(function() {
      $('.home').remove();
      console.log('Home Erased');
    });
  }

  var navigationLink = $('.terminal__line a');
  navigationLink.click(function(e) {
    if ($(this).hasClass('out')) {
      window.open('http://instagram.com/');
    } else {
      createHome();
    }
  });

  $(search_form).submit(function( event ) {
    if ('admin' === $( "input" ).val()) {
      createAdmin();
    } else if ( 'help' === $( "input" ).val() || 'instructions' === $( "input" ).val() || 'keyword3' === $( "input" ).val() || 'keyword4' === $( "input" ).val() || 'keyword5'  === $( "input" ).val()) {
      createHome();
    } else if ( $( "input" ).val() === "about" ) {
      window.open('http://eveassistant.com/home',"_self");
    } else if ( $( "input" ).val() === "music" ) {
      window.open('http://eveassistant.com/music',"_self");
    } else if ( $( "input" ).val() === "console" ) {
      window.open('http://www.eveassistant.com/interact',"_self");
    } else if ( $( "input" ).val() === "social" ) {
      window.open('http://www.jemi.app/iameve',"_self");
    } else if ( $( "input" ).val() === "discord" ) {
      window.open('https://discord.gg/Y5p7cfvYTs',"_self");
    } else if ( $( "input" ).val() === "admin" ) {
      window.open('http://www.eveassistant.com/admin',"_self");
    } else if ( $( "input" ).val() === "welcometoeve" ) {
      window.open('http://www.eveassistant.com/new',"_self");

      var binder = $('input').val();
      var terminal_div = document.getElementsByClassName('terminal');
      $('.terminal').addClass("binding");
      var theipagain = $('#ip').html();

      var ipconfig = document.createElement('p');
      $(ipconfig).text('ipconfig: ' + theipagain);
      ipconfig.setAttribute('class', 'terminal__line');
      $(ipconfig).appendTo(terminal_div);
      console.log(ipconfig.length);

    }

    var binder = $('input').val();
    var terminal_div = document.getElementsByClassName('terminal');
    $('.terminal').addClass("binding");

    var commands = document.createElement('p');
    commands.innerHTML = ('Execute: ' + binder);
    commands.setAttribute('class', 'terminal__line');
    $(commands).appendTo(terminal_div);

    event.preventDefault();
  });

})(window);
