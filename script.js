var width, height, container, canvas, ctx, points, target, animateHeader = true;

function init() {
  initHeader();
  initAnimation();
  addListeners();
}

function initHeader() {
  width = window.innerWidth;
  height = window.innerHeight;
  target = {
    x: width / 2,
    y: height / 2
  };

  container = document.getElementById('connecting-dots');
  container.style.height = height + 'px';

  canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');

  // create points
  points = [];
  for (var x = 0; x < width; x = x + width / 20) {
    for (var y = 0; y < height; y = y + height / 20) {
      var px = x + Math.random() * width / 100;
      var py = y + Math.random() * height / 100;
      var p = {
        x: px,
        originX: px,
        y: py,
        originY: py
      };
      points.push(p);
    }
  }

  // for each point find the 5 closest points
  for (var i = 0; i < points.length; i++) {
    var closest = [];
    var p1 = points[i];
    for (var j = 0; j < points.length; j++) {
      var p2 = points[j]
      if (!(p1 == p2)) {
        var placed = false;
        for (var k = 0; k < 5; k++) {
          if (!placed) {
            if (closest[k] == undefined) {
              closest[k] = p2;
              placed = true;
            }
          }
        }

        for (var k = 0; k < 5; k++) {
          if (!placed) {
            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
              closest[k] = p2;
              placed = true;
            }
          }
        }
      }
    }
    p1.closest = closest;
  }

  // assign a circle to each point
  for (var i in points) {
    var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.9)');
    points[i].circle = c;
  }
}

// Event handling
function addListeners() {
  if (!('ontouchstart' in window)) {
  //  window.addEventListener("mousemove", mouseMove);
  }
  window.addEventListener("resize", resize, true);
  window.addEventListener("scroll", scrollCheck);
}

function mouseMove(e) {
  var posx = posy = 0;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  target.x = posx;
  target.y = posy;
}

function scrollCheck() {
  if (document.body.scrollTop > height) animateHeader = false;
  else animateHeader = true;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  container.style.height = height + 'px';
  ctx.canvas.width = width;
  ctx.canvas.height = height;
}

// animation
function initAnimation() {
  animate();
  for (var i in points) {
    shiftPoint(points[i]);
  }
}

function animate() {
  if (animateHeader) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i in points) {
      // detect points in range
      if (Math.abs(getDistance(target, points[i])) < 4000) {
        points[i].active = 0.3;
        points[i].circle.active = 0.6;
      } else if (Math.abs(getDistance(target, points[i])) < 20000) {
        points[i].active = 0.1;
        points[i].circle.active = 0.3;
      } else if (Math.abs(getDistance(target, points[i])) < 40000) {
        points[i].active = 0.02;
        points[i].circle.active = 0.1;
      } else {
        points[i].active = 0;
        points[i].circle.active = 0;
      }

      drawLines(points[i]);
      points[i].circle.draw();
    }
  }
  requestAnimationFrame(animate);
}

function shiftPoint(p) {
  TweenLite.to(p, 1 + 1 * Math.random(), {
    x: p.originX - 50 + Math.random() * 100,
    y: p.originY - 50 + Math.random() * 100,
    ease: Circ.easeInOut,
    onComplete: function() {
      shiftPoint(p);
    }
  });
}

// Canvas manipulation
function drawLines(p) {
  if (!p.active) return;
  for (var i in p.closest) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.closest[i].x, p.closest[i].y);
    ctx.strokeStyle = 'rgba(255,255,255,' + p.active + ')';
    ctx.stroke();
  }
}

function Circle(pos, rad, color) {
  var _this = this;

  // constructor
  (function() {
    _this.pos = pos || null;
    _this.radius = rad || null;
    _this.color = color || null;
  })();

  this.draw = function() {
    if (!_this.active) return;
    ctx.beginPath();
    ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(255,255,255,' + _this.active + ')';
    ctx.fill();
  };
}

// Util
function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

init();


;(function(window) {

	'use strict';

		//FIND IP

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

//FIND LOCATIOn


$.getJSON('https://ipapi.co/'+$(ip).val()+'/json', function(data){

      $('.country').text(data.country);
  });


	(function() {

		var theConsole = $('span.console');
		var texted = $("#ip").text();

		theConsole.html(texted);
	});

var search_form = document.getElementsByClassName('search__form');
console.log(search_form);



function createHome(){

  var homeDiv = document.createElement('div');
        homeDiv.innerHTML = '<div class="home_container"><h2>HELP INFORMATION:</h2><p>Please try inputting a command, and pressing "enter". <br/> You can see the list of commands under "Navigation Portals".</p><div class="close_home" href="">x</div></div>';
        homeDiv.setAttribute('class', 'home');
        document.body.appendChild(homeDiv);

        $('.close_home').click(function(){
            $('.home').remove();
            console.log('Home Erased');
        });

}

var navigationLink = $('.terminal__line a');

navigationLink.click(function(e){
  if ($(this).hasClass('out')) {
    window.open('http://instagram.com/');
  }else
  {
  createHome();
  }
});



	$(search_form).submit(function( event ) {
	  if ( 'help' === $( "input" ).val() || 'ass' === $( "input" ).val() ||  'keyword2' === $( "input" ).val() || 'keyword3' === $( "input" ).val() || 'keyword4' === $( "input" ).val() || 'keyword5'  === $( "input" ).val()) {

    createHome();

	  } else if ( $( "input" ).val() === "about" ) {
				window.open('http://www.eveassistant.com/home',"_self");
      } else if ( $( "input" ).val() === "music" ) {
				window.open('http://www.eveassistant.com/music',"_self");
      } else if ( $( "input" ).val() === "console" ) {
				window.open('http://www.eveassistant.com/interact',"_self");
      } else if ( $( "input" ).val() === "social" ) {
				window.open('http://www.jemi.app/iameve',"_self");
      } else if ( $( "input" ).val() === "discord" ) {
				window.open('https://discord.gg/87cwQATfDK',"_self");
      } else if ( $( "input" ).val() === "admin" ) {
				window.open('http://www.eveassistant.com/admin',"_self");

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