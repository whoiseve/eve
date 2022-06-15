/* KONAMI CODE */


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


    /* ANIMATION */
    $(window).load(function(){  
      for (var i = 0; i < 50; i++) {
        var names = ['x1','x2','y1','y2'],
            name = names[Math.floor(Math.random() * names.length)];
        $('.circles').append('<div class="circle-container c'+i+'"><div class="circle i'+ i +'"></div></div>');
        $('.c'+i).css({
          'animation': 'z 5s .'+ i +'s linear infinite'
        });
        $('.i'+i).css({
          'animation': name + ' 7.5s .'+ i +'s linear infinite'
        });
      }
    });



  /* ANIMATION END */



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

// init
new KeySequenceHandler([sequence1,sequence2]);

  // FIND IP

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

  // FIND LOCATION

  $.getJSON('https://ipapi.co/'+$(ip).val()+'/json', function(data) {
    $('.country').text(data.country);
  });

	(function() {
		var theConsole = $('span.console');
		var texted = $("#ip").text();
		theConsole.html(texted);
	});

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