(function() {
  // Audio Context
  var AudioController, audioCtx, generateMusic, html2tones, kit, node2tone, playBtn, trackTiming, waveForNode;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  trackTiming = {
    'sine': 0,
    'square': 0,
    'sawtooth': 0,
    'triangle': 0
  };

  /*
  	Handles Playing Notes
  */
  AudioController = class AudioController {
    constructor() {}

    playTone(wave, freq, start, stop, gain) {
      var gainNode, tone;
      if (wave !== 'silent') {
        gainNode = audioCtx.createGain();
        gainNode.value = gain;
        gainNode.connect(audioCtx.destination);
        tone = audioCtx.createOscillator();
        tone.connect(gainNode);
        tone.type = wave;
        tone.frequency.value = freq;
        tone.start(start);
        return tone.stop(start + stop);
      }
    }

  };

  // Generates the specifics for a notes sound, timing and duration
  /*
  @TODO Split into 4 tracks, each with its own timing/overlay
     maybe look at number of classes and if there is an ID?
  @TODO Determin Duration of note
  */
  node2tone = function(node, totalNodes) {
    var freq, gain, wave;
    if (node.tagName === 'parsererror') {
      document.getElementById('text2parse').value = "parse error";
    }
    wave = waveForNode(node);
    if (wave === 'silent') {
      trackTiming['sine'] += 0.25;
      trackTiming['square'] += 0.25;
      trackTiming['sawtooth'] += 0.25;
      trackTiming['triangle'] += 0.25;
    } else {
      //yes this is some random algorithm
      freq = Math.abs((1500 - (Math.abs(node.childNodes.length - node.tagName.length) + 1) * 400) % 1500) + (100 * (trackTiming[wave] * 4) % 1500) + ((totalNodes * 10) % 300);
      gain = (node.innerHTML.length % 25) / 100;
      trackTiming[wave] += 0.5;
    }
    //passes note
    return [wave, freq, audioCtx.currentTime + trackTiming[wave] - 0.5, trackTiming[wave] + 0.25, gain];
  };

  waveForNode = function(node) {
    if (node.id.length) {
      return 'square';
    } else if (node.classList.length > 1) {
      return 'sawtooth';
    } else if (node.classList.length === 1) {
      return 'sine';
    } else if (node.innerHTML.length > 200) {
      return 'triangle';
    } else {
      return "silent";
    }
  };

  
  // Converts a html text into value sets for notes
  html2tones = function(html) {
    var DOM, domNodes, i, parser, tones;
    tones = [];
    parser = new DOMParser();
    // fixes for some common broken DOM things
    html = html.replace(/<![^>]*>/g, "");
    html = html.replace(/<meta[^>]*>/g, "");
    html = html.replace(/<link[^>]*>/g, "");
    html = html.replace(/<link[^>]*\/>/g, "");
    html = html.replace(/<br>/g, "<br />");
    DOM = parser.parseFromString(html, "text/xml");
    domNodes = DOM.getElementsByTagName("*");
    i = 0;
    while (i < domNodes.length) {
      tones[i] = node2tone(domNodes[i], domNodes.length);
      i++;
    }
    return tones;
  };

  
  // Reads in textarea calls to parsers and plays notes
  generateMusic = function() {
    var i, note, results, tones;
    trackTiming = {
      'sine': 0,
      'square': 0,
      'sawtooth': 0,
      'triangle': 0
    };
    tones = html2tones(document.getElementById('text2parse').value);
    i = 0;
    results = [];
    while (i < tones.length) {
      note = tones[i];
      kit.playTone(note[0], note[1], note[2], note[3], note[4]);
      results.push(i++);
    }
    return results;
  };

  kit = new AudioController();

  playBtn = document.getElementById('playBtn');

  playBtn.addEventListener("click", generateMusic, false);

  /*
## these articles were super useful
- https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave
- https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createBiquadFilter
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- http://stackoverflow.com/questions/20156888/what-are-the-parameters-for-createperiodicwave-in-google-chrome
- https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
 */

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWU7RUFBQTtBQUFBLE1BQUEsZUFBQSxFQUFBLFFBQUEsRUFBQSxhQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQTs7RUFDZixRQUFBLEdBQVcsSUFBQSxDQUFNLE1BQU0sQ0FBQyxZQUFQLElBQXVCLE1BQU0sQ0FBQyxrQkFBcEMsQ0FBQSxDQUFBOztFQUNYLFdBQUEsR0FBYztJQUFDLE1BQUEsRUFBUyxDQUFWO0lBQWEsUUFBQSxFQUFXLENBQXhCO0lBQTJCLFVBQUEsRUFBYSxDQUF4QztJQUEyQyxVQUFBLEVBQWE7RUFBeEQsRUFGQzs7Ozs7RUFPVCxrQkFBTixNQUFBLGdCQUFBO0lBRUMsV0FBYSxDQUFBLENBQUEsRUFBQTs7SUFFYixRQUFVLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxLQUFiLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQUE7QUFDWCxVQUFBLFFBQUEsRUFBQTtNQUFFLElBQUcsSUFBQSxLQUFRLFFBQVg7UUFDQyxRQUFBLEdBQVcsUUFBUSxDQUFDLFVBQVQsQ0FBQTtRQUNYLFFBQVEsQ0FBQyxLQUFULEdBQWlCO1FBQ2pCLFFBQVEsQ0FBQyxPQUFULENBQWlCLFFBQVEsQ0FBQyxXQUExQjtRQUVBLElBQUEsR0FBTyxRQUFRLENBQUMsZ0JBQVQsQ0FBQTtRQUNQLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYjtRQUNBLElBQUksQ0FBQyxJQUFMLEdBQVk7UUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsR0FBdUI7UUFDdkIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYO2VBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFBLEdBQVEsSUFBbEIsRUFWRDs7SUFEUzs7RUFKWCxFQVBlOzs7Ozs7OztFQStCZixTQUFBLEdBQVksUUFBQSxDQUFDLElBQUQsRUFBTyxVQUFQLENBQUE7QUFDWixRQUFBLElBQUEsRUFBQSxJQUFBLEVBQUE7SUFBQyxJQUFHLElBQUksQ0FBQyxPQUFMLEtBQWdCLGFBQW5CO01BQ0MsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBcUMsQ0FBQyxLQUF0QyxHQUE4QyxjQUQvQzs7SUFFQSxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVo7SUFDUCxJQUFHLElBQUEsS0FBUSxRQUFYO01BQ0MsV0FBVyxDQUFDLE1BQUQsQ0FBWCxJQUF1QjtNQUN2QixXQUFXLENBQUMsUUFBRCxDQUFYLElBQXlCO01BQ3pCLFdBQVcsQ0FBQyxVQUFELENBQVgsSUFBMkI7TUFDM0IsV0FBVyxDQUFDLFVBQUQsQ0FBWCxJQUEyQixLQUo1QjtLQUFBLE1BQUE7O01BT0MsSUFBQSxHQUFPLElBQUksQ0FBQyxHQUFMLENBQVUsQ0FBQyxJQUFBLEdBQU8sQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBaEIsR0FBeUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUEvQyxDQUFBLEdBQXdELENBQXpELENBQUEsR0FBK0QsR0FBdkUsQ0FBQSxHQUE4RSxJQUF4RixDQUFBLEdBQWlHLENBQUMsR0FBQSxHQUFJLENBQUMsV0FBVyxDQUFDLElBQUQsQ0FBWCxHQUFrQixDQUFuQixDQUFKLEdBQTRCLElBQTdCLENBQWpHLEdBQXNJLENBQUMsQ0FBQyxVQUFBLEdBQWEsRUFBZCxDQUFBLEdBQW9CLEdBQXJCO01BQzdJLElBQUEsR0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixHQUF3QixFQUF6QixDQUFBLEdBQStCO01BQ3RDLFdBQVcsQ0FBQyxJQUFELENBQVgsSUFBcUIsSUFUdEI7S0FIRDs7V0FjQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsUUFBUSxDQUFDLFdBQVQsR0FBdUIsV0FBVyxDQUFDLElBQUQsQ0FBbEMsR0FBeUMsR0FBdEQsRUFBMkQsV0FBVyxDQUFDLElBQUQsQ0FBWCxHQUFvQixJQUEvRSxFQUFxRixJQUFyRjtFQWZXOztFQWlCWixXQUFBLEdBQWMsUUFBQSxDQUFDLElBQUQsQ0FBQTtJQUNiLElBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFYO0FBQ0MsYUFBTyxTQURSO0tBQUEsTUFFSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixHQUF3QixDQUE1QjtBQUNKLGFBQU8sV0FESDtLQUFBLE1BRUEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsS0FBeUIsQ0FBN0I7QUFDSixhQUFPLE9BREg7S0FBQSxNQUVBLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFmLEdBQXdCLEdBQTVCO2FBQ0osV0FESTtLQUFBLE1BQUE7YUFHSixTQUhJOztFQVBRLEVBaERDOzs7O0VBNkRmLFVBQUEsR0FBYSxRQUFBLENBQUMsSUFBRCxDQUFBO0FBQ2IsUUFBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxNQUFBLEVBQUE7SUFBQyxLQUFBLEdBQVE7SUFDUixNQUFBLEdBQVMsSUFBSSxTQUFKLENBQUEsRUFEVjs7SUFHQyxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxXQUFiLEVBQTBCLEVBQTFCO0lBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixFQUE2QixFQUE3QjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsRUFBNkIsRUFBN0I7SUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUEvQjtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsUUFBdEI7SUFDUCxHQUFBLEdBQU0sTUFBTSxDQUFDLGVBQVAsQ0FBdUIsSUFBdkIsRUFBNkIsVUFBN0I7SUFDTixRQUFBLEdBQVcsR0FBRyxDQUFDLG9CQUFKLENBQXlCLEdBQXpCO0lBQ1gsQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksUUFBUSxDQUFDLE1BQW5CO01BQ0MsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLFNBQUEsQ0FBVSxRQUFRLENBQUMsQ0FBRCxDQUFsQixFQUF1QixRQUFRLENBQUMsTUFBaEM7TUFDWCxDQUFBO0lBRkQ7V0FHQTtFQWZZLEVBN0RFOzs7O0VBK0VmLGFBQUEsR0FBZ0IsUUFBQSxDQUFBLENBQUE7QUFDaEIsUUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQTtJQUFDLFdBQUEsR0FBYztNQUFDLE1BQUEsRUFBUyxDQUFWO01BQWEsUUFBQSxFQUFXLENBQXhCO01BQTJCLFVBQUEsRUFBYSxDQUF4QztNQUEyQyxVQUFBLEVBQWE7SUFBeEQ7SUFDZCxLQUFBLEdBQVEsVUFBQSxDQUFXLFFBQVEsQ0FBQyxjQUFULENBQXdCLFlBQXhCLENBQXFDLENBQUMsS0FBakQ7SUFDUixDQUFBLEdBQUk7QUFDSjtXQUFNLENBQUEsR0FBSSxLQUFLLENBQUMsTUFBaEI7TUFDQyxJQUFBLEdBQU8sS0FBSyxDQUFDLENBQUQ7TUFDWixHQUFHLENBQUMsUUFBSixDQUFhLElBQUksQ0FBQyxDQUFELENBQWpCLEVBQXNCLElBQUksQ0FBQyxDQUFELENBQTFCLEVBQStCLElBQUksQ0FBQyxDQUFELENBQW5DLEVBQXdDLElBQUksQ0FBQyxDQUFELENBQTVDLEVBQWlELElBQUksQ0FBQyxDQUFELENBQXJEO21CQUNBLENBQUE7SUFIRCxDQUFBOztFQUplOztFQVVoQixHQUFBLEdBQU0sSUFBSSxlQUFKLENBQUE7O0VBQ04sT0FBQSxHQUFVLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCOztFQUNWLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxhQUFsQyxFQUFpRCxLQUFqRDs7RUEzRmU7Ozs7Ozs7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIjIEF1ZGlvIENvbnRleHRcbmF1ZGlvQ3R4ID0gbmV3ICgod2luZG93LkF1ZGlvQ29udGV4dCBvciB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSlcbnRyYWNrVGltaW5nID0geydzaW5lJyA6IDAsICdzcXVhcmUnIDogMCwgJ3Nhd3Rvb3RoJyA6IDAsICd0cmlhbmdsZScgOiAwfVxuXG4jIyNcblx0SGFuZGxlcyBQbGF5aW5nIE5vdGVzXG4jIyNcbmNsYXNzIEF1ZGlvQ29udHJvbGxlclxuIFxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRcblx0cGxheVRvbmU6ICh3YXZlLCBmcmVxLCBzdGFydCwgc3RvcCwgZ2FpbikgLT5cblx0XHRpZiB3YXZlICE9ICdzaWxlbnQnXG5cdFx0XHRnYWluTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKVxuXHRcdFx0Z2Fpbk5vZGUudmFsdWUgPSBnYWluXG5cdFx0XHRnYWluTm9kZS5jb25uZWN0IGF1ZGlvQ3R4LmRlc3RpbmF0aW9uXG5cblx0XHRcdHRvbmUgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKClcblx0XHRcdHRvbmUuY29ubmVjdCBnYWluTm9kZVxuXHRcdFx0dG9uZS50eXBlID0gd2F2ZVxuXHRcdFx0dG9uZS5mcmVxdWVuY3kudmFsdWUgPSBmcmVxXG5cdFx0XHR0b25lLnN0YXJ0KHN0YXJ0KVxuXHRcdFx0dG9uZS5zdG9wKHN0YXJ0ICsgc3RvcClcblxuIyBHZW5lcmF0ZXMgdGhlIHNwZWNpZmljcyBmb3IgYSBub3RlcyBzb3VuZCwgdGltaW5nIGFuZCBkdXJhdGlvblxuIyMjXG5AVE9ETyBTcGxpdCBpbnRvIDQgdHJhY2tzLCBlYWNoIHdpdGggaXRzIG93biB0aW1pbmcvb3ZlcmxheVxuICAgbWF5YmUgbG9vayBhdCBudW1iZXIgb2YgY2xhc3NlcyBhbmQgaWYgdGhlcmUgaXMgYW4gSUQ/XG5AVE9ETyBEZXRlcm1pbiBEdXJhdGlvbiBvZiBub3RlXG4jIyNcblxubm9kZTJ0b25lID0gKG5vZGUsIHRvdGFsTm9kZXMpIC0+XG5cdGlmIG5vZGUudGFnTmFtZSA9PSAncGFyc2VyZXJyb3InXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQycGFyc2UnKS52YWx1ZSA9IFwicGFyc2UgZXJyb3JcIlxuXHR3YXZlID0gd2F2ZUZvck5vZGUgbm9kZVxuXHRpZiB3YXZlID09ICdzaWxlbnQnXG5cdFx0dHJhY2tUaW1pbmdbJ3NpbmUnXSArPSAwLjI1XG5cdFx0dHJhY2tUaW1pbmdbJ3NxdWFyZSddICs9IDAuMjVcblx0XHR0cmFja1RpbWluZ1snc2F3dG9vdGgnXSArPSAwLjI1XG5cdFx0dHJhY2tUaW1pbmdbJ3RyaWFuZ2xlJ10gKz0gMC4yNVxuXHRlbHNlXG5cdFx0I3llcyB0aGlzIGlzIHNvbWUgcmFuZG9tIGFsZ29yaXRobVxuXHRcdGZyZXEgPSBNYXRoLmFicygoKDE1MDAgLSAoTWF0aC5hYnMobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAtIG5vZGUudGFnTmFtZS5sZW5ndGgpKyAxICkgKiA0MDApICUgMTUwMCkpICsgKDEwMCoodHJhY2tUaW1pbmdbd2F2ZV0qNCkgJSAxNTAwKSArICgodG90YWxOb2RlcyAqIDEwKSAlIDMwMClcblx0XHRnYWluID0gKG5vZGUuaW5uZXJIVE1MLmxlbmd0aCAlIDI1KSAvIDEwMFxuXHRcdHRyYWNrVGltaW5nW3dhdmVdICs9IDAuNVxuXHQjcGFzc2VzIG5vdGVcblx0W3dhdmUsIGZyZXEsIGF1ZGlvQ3R4LmN1cnJlbnRUaW1lICsgdHJhY2tUaW1pbmdbd2F2ZV0tMC41LCB0cmFja1RpbWluZ1t3YXZlXSArIDAuMjUsIGdhaW5dIFxuXG53YXZlRm9yTm9kZSA9IChub2RlKSAtPlxuXHRpZiBub2RlLmlkLmxlbmd0aFxuXHRcdHJldHVybiAnc3F1YXJlJ1xuXHRlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5sZW5ndGggPiAxKVxuXHRcdHJldHVybiAnc2F3dG9vdGgnXG5cdGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0Lmxlbmd0aCA9PSAxKVxuXHRcdHJldHVybiAnc2luZSdcblx0ZWxzZSBpZiAobm9kZS5pbm5lckhUTUwubGVuZ3RoID4gMjAwKVxuXHRcdCd0cmlhbmdsZSdcblx0ZWxzZVxuXHRcdFwic2lsZW50XCJcblx0XG4jIENvbnZlcnRzIGEgaHRtbCB0ZXh0IGludG8gdmFsdWUgc2V0cyBmb3Igbm90ZXNcbmh0bWwydG9uZXMgPSAoaHRtbCkgLT5cdFxuXHR0b25lcyA9IFtdXG5cdHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuXHQjIGZpeGVzIGZvciBzb21lIGNvbW1vbiBicm9rZW4gRE9NIHRoaW5nc1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKC88IVtePl0qPi9nLCBcIlwiKVxuXHRodG1sID0gaHRtbC5yZXBsYWNlKC88bWV0YVtePl0qPi9nLCBcIlwiKVxuXHRodG1sID0gaHRtbC5yZXBsYWNlKC88bGlua1tePl0qPi9nLCBcIlwiKVxuXHRodG1sID0gaHRtbC5yZXBsYWNlKC88bGlua1tePl0qXFwvPi9nLCBcIlwiKVxuXHRodG1sID0gaHRtbC5yZXBsYWNlKC88YnI+L2csIFwiPGJyIC8+XCIpXG5cdERPTSA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcgaHRtbCwgXCJ0ZXh0L3htbFwiXG5cdGRvbU5vZGVzID0gRE9NLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKVxuXHRpID0gMFxuXHR3aGlsZSBpIDwgZG9tTm9kZXMubGVuZ3RoXG5cdFx0dG9uZXNbaV0gPSBub2RlMnRvbmUoZG9tTm9kZXNbaV0sIGRvbU5vZGVzLmxlbmd0aClcblx0XHRpKytcblx0dG9uZXNcblx0XG4jIFJlYWRzIGluIHRleHRhcmVhIGNhbGxzIHRvIHBhcnNlcnMgYW5kIHBsYXlzIG5vdGVzXG5nZW5lcmF0ZU11c2ljID0gLT5cdFxuXHR0cmFja1RpbWluZyA9IHsnc2luZScgOiAwLCAnc3F1YXJlJyA6IDAsICdzYXd0b290aCcgOiAwLCAndHJpYW5nbGUnIDogMH1cblx0dG9uZXMgPSBodG1sMnRvbmVzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0MnBhcnNlJykudmFsdWUpXG5cdGkgPSAwXG5cdHdoaWxlIGkgPCB0b25lcy5sZW5ndGhcblx0XHRub3RlID0gdG9uZXNbaV1cblx0XHRraXQucGxheVRvbmUgbm90ZVswXSwgbm90ZVsxXSwgbm90ZVsyXSwgbm90ZVszXSwgbm90ZVs0XVxuXHRcdGkrK1xuXHRcblx0XG5raXQgPSBuZXcgQXVkaW9Db250cm9sbGVyKClcbnBsYXlCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheUJ0bicpXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnZW5lcmF0ZU11c2ljLCBmYWxzZSlcblxuIyMjXG4jIyB0aGVzZSBhcnRpY2xlcyB3ZXJlIHN1cGVyIHVzZWZ1bFxuLSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvT3NjaWxsYXRvck5vZGUvc2V0UGVyaW9kaWNXYXZlXG4tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BdWRpb0NvbnRleHQvY3JlYXRlQmlxdWFkRmlsdGVyXG4tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQXVkaW9fQVBJL1VzaW5nX1dlYl9BdWRpb19BUElcbi0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDE1Njg4OC93aGF0LWFyZS10aGUtcGFyYW1ldGVycy1mb3ItY3JlYXRlcGVyaW9kaWN3YXZlLWluLWdvb2dsZS1jaHJvbWVcbi0gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL09zY2lsbGF0b3JOb2RlXG4jIyMiXX0=
//# sourceURL=coffeescript