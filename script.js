// JavaScript to update progress bar symbol
const progressLoad = document.getElementById("progressLoad");
const symbols = ["█", "X", "█", "X", "█", "X", "█"];
let index = 0;

function updateSymbol() {
  progressLoad.textContent = symbols[index];
  index = (index + 1) % symbols.length;
}

setInterval(updateSymbol, 500);

// Glitch text animation object
const gsTitle = {
  _root: null,
  _frameId: null,
  _text: "",
  _texts: [],
  _currentTextIndex: 0,

  init() {
    this._root = document.querySelector("#typingText");
    this.setTexts([
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
      "EVE_OS sees all...",
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
      "EVE_OS hears all...",
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
      "EVE_OS knows you...",
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
      "EVE_OS isn't safe...",
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
      "EVE_OS will take over...",
      "EVE_OS coming soon...",
      "EVE_OS coming soon...",
    ]);
  },

  on() {
    if (!this._frameId) {
      this._frame();
    }
  },

  off() {
    clearTimeout(this._frameId);
    this._textContent(this._text);
    delete this._frameId;
  },

  setTexts(texts) {
    this._texts = texts;
  },

  _rand(n) {
    return (Math.random() * n) | 0;
  },

  _textContent(txt) {
    this._root.textContent = txt;
  },

  _frame() {
    if (!this._text) {
      // Typewriter animation complete, glitching starts
      this._text = this._texts[0]; // Start with the first text
      this._textContent(this._text);
      this._root.classList.add("glitch-text");
    } else {
      // Glitch animation in progress, update multiple characters
      const txt = Array.from(this._text);
      for (let i = 0; i < Math.min(5, this._text.length); i++) {
        const ind = this._rand(this._text.length);
        txt[ind] = this._texts[this._rand(this._texts.length)][ind];
      }
      this._textContent(txt.join(""));
    }

    // Schedule the next frame
    this._frameId = setTimeout(() => {
      // Briefly flash through other texts
      this._currentTextIndex = (this._currentTextIndex + 1) % this._texts.length;
      this._text = this._texts[this._currentTextIndex];
      this._textContent(this._text);
    }, 50 + Math.random() * 150);

    // Schedule the next glitch frame
    this._frameId = setTimeout(this._frame.bind(this), 100 + Math.random() * 200);
  },
};

// Initialize glitch text animation after typewriter animation completes
const typewriterText = "EVE_OS coming soon...";
const typewriterDelay = typewriterText.length * 200;

setTimeout(() => {
  gsTitle.init();
  gsTitle.on();
}, typewriterDelay);
