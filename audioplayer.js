(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("classnames"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "classnames"], factory);
	else if(typeof exports === 'object')
		exports["AudioPlayer"] = factory(require("react"), require("classnames"));
	else
		root["AudioPlayer"] = factory(root["React"], root["classNames"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(1);
	var classNames = __webpack_require__(2);

	var log = console.log.bind(console);
	var logError = console.error ? console.error.bind(console) : log;
	var logWarning = console.warn ? console.warn.bind(console) : log;

	/* converts given number of seconds to standard time display format
	 * http://goo.gl/kEvnKn
	 */
	function convertToTime(number) {
	  var mins = Math.floor(number / 60);
	  var secs = (number % 60).toFixed();
	  return '' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
	}

	/*
	 * AudioPlayer
	 *
	 * Accepts 'playlist' prop of the form:
	 *
	 * [{ "url": "./path/to/file.mp3",
	 *    "displayText": "ArtistA - Track 1" },
	 *  { "url": "https://domain.com/track2.ogg",
	 *    "displayText": "ArtistB - Track 2" }]
	 *
	 * Accepts 'autoplay' prop (true/[false]).
	 *
	 * Accepts 'autoplayDelayInSeconds' prop (default 0).
	 *
	 * Accepts 'hideBackSkip' prop (default false,
	 * hides back skip button if true).
	 *
	 * Accepts 'stayOnBackSkipThreshold' prop, default 5,
	 * is number of seconds to progress until pressing back skip
	 * restarts the current song.
	 *
	 * Accepts 'placeAtTop' prop, default false, if true,
	 * player is placed at top of screen instead of bottom.
	 *
	 */

	var AudioPlayer = function (_React$Component) {
	  _inherits(AudioPlayer, _React$Component);

	  function AudioPlayer(props) {
	    _classCallCheck(this, AudioPlayer);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioPlayer).call(this, props));

	    _this.playlist = props.playlist;

	    /* how many seconds must progress before a back skip will
	     * just restart the current track
	     */
	    _this.stayOnBackSkipThreshold = props.stayOnBackSkipThreshold || 5;
	    /* true if the user is currently dragging the mouse
	     * to seek a new track position
	     */
	    _this.seekInProgress = false;
	    // index matching requested track (whether track has loaded or not)
	    _this.currentTrackIndex = 0;

	    _this.state = {
	      /* activeTrackIndex will change to match
	       * this.currentTrackIndex once metadata has loaded
	       */
	      activeTrackIndex: -1,
	      // indicates whether audio player should be paused
	      paused: true,
	      /* elapsed time for current track, in seconds -
	       * DISPLAY ONLY! the actual elapsed time may
	       * not match up if we're currently seeking, since
	       * the new time is visually previewed before the
	       * audio seeks.
	       */
	      displayedTime: 0
	    };

	    // html audio element used for playback
	    _this.audio = null;
	    _this.audioProgressContainer = null;
	    /* bounding rectangle used for calculating seek
	     * position from mouse/touch coordinates
	     */
	    _this.audioProgressBoundingRect = null;
	    return _this;
	  }

	  _createClass(AudioPlayer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      __webpack_require__(3);

	      // These listeners are outside the scope of our render method
	      window.addEventListener('mouseup', this.seek.bind(this));
	      document.addEventListener('touchend', this.seek.bind(this));
	      window.addEventListener('resize', this.fetchAudioProgressBoundingRect.bind(this));
	      this.fetchAudioProgressBoundingRect();

	      /* We'll need to use some tools outside of the React
	       * paradigm in order to hook up audio things correctly.
	       */
	      var audio = this.audio = document.createElement('audio');
	      audio.preload = 'metadata';
	      audio.addEventListener('ended', this.skipToNextTrack.bind(this));
	      audio.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
	      audio.addEventListener('loadedmetadata', function () {
	        _this2.setState({
	          activeTrackIndex: _this2.currentTrackIndex
	        });
	      });
	      audio.addEventListener('play', function () {
	        _this2.setState({
	          paused: false
	        });
	      });
	      audio.addEventListener('stalled', this.togglePause.bind(this, true));
	      if (this.playlist && this.playlist.length) {
	        this.updateSource();
	        if (this.props.autoplay) {
	          var delay = this.props.autoplayDelayInSeconds || 0;
	          setTimeout(this.togglePause.bind(this, false), delay * 1000);
	        }
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.stayOnBackSkipThreshold = nextProps.stayOnBackSkipThreshold || stayOnBackSkipThreshold;
	      if (!nextProps.playlist) {
	        return;
	      }
	      this.playlist = nextProps.playlist;
	      this.currentTrackIndex = -1;
	      if (this.audio) {
	        this.skipToNextTrack(false);
	      }
	    }
	  }, {
	    key: 'togglePause',
	    value: function togglePause(value) {
	      var pause = typeof value === 'boolean' ? value : !this.state.paused;
	      if (pause) {
	        this.audio.pause();
	        return this.setState({
	          paused: true
	        });
	      }
	      if (!this.playlist || !this.playlist.length) {
	        return;
	      }
	      try {
	        this.audio.play();
	      } catch (error) {
	        logError(error);
	        var warningMessage = 'Audio playback failed at ' + new Date().toLocaleTimeString() + '! (Perhaps autoplay is disabled in this browser.)';
	        logWarning(warningMessage);
	      }
	    }
	  }, {
	    key: 'skipToNextTrack',
	    value: function skipToNextTrack(shouldPlay) {
	      var _this3 = this;

	      this.audio.pause();
	      if (!this.playlist || !this.playlist.length) {
	        return;
	      }
	      var i = this.currentTrackIndex + 1;
	      if (i >= this.playlist.length) {
	        i = 0;
	      }
	      this.currentTrackIndex = i;
	      this.setState({
	        activeTrackIndex: -1,
	        displayedTime: 0
	      }, function () {
	        _this3.updateSource();
	        var shouldPause = typeof shouldPlay === 'boolean' ? !shouldPlay : false;
	        _this3.togglePause(shouldPause);
	      });
	    }
	  }, {
	    key: 'backSkip',
	    value: function backSkip() {
	      if (!this.playlist || !this.playlist.length) {
	        return;
	      }
	      var audio = this.audio;
	      if (audio.currentTime >= this.stayOnBackSkipThreshold) {
	        return audio.currentTime = 0;
	      }
	      var i = this.currentTrackIndex - 1;
	      if (i < 0) {
	        i = this.playlist.length - 1;
	      }
	      this.currentTrackIndex = i - 1;
	      this.skipToNextTrack();
	    }
	  }, {
	    key: 'updateSource',
	    value: function updateSource() {
	      this.audio.src = this.playlist[this.currentTrackIndex].url;
	    }
	  }, {
	    key: 'fetchAudioProgressBoundingRect',
	    value: function fetchAudioProgressBoundingRect() {
	      this.audioProgressBoundingRect = this.audioProgressContainer.getBoundingClientRect();
	    }
	  }, {
	    key: 'handleTimeUpdate',
	    value: function handleTimeUpdate() {
	      if (!this.seekInProgress) {
	        this.setState({
	          displayedTime: this.audio.currentTime
	        });
	      }
	    }
	  }, {
	    key: 'adjustDisplayedTime',
	    value: function adjustDisplayedTime(event) {
	      if (!this.playlist || !this.playlist.length) {
	        return;
	      }
	      // make sure we don't select stuff in the background while seeking
	      if (event.type === 'mousedown' || event.type === 'touchstart') {
	        this.seekInProgress = true;
	        document.body.classList.add('noselect');
	      } else if (!this.seekInProgress) {
	        return;
	      }
	      /* we don't want mouse handlers to receive the event
	       * after touch handlers if we're seeking.
	       */
	      event.preventDefault();
	      var boundingRect = this.audioProgressBoundingRect;
	      var isTouch = event.type.slice(0, 5) === 'touch';
	      var pageX = isTouch ? event.targetTouches.item(0).pageX : event.pageX;
	      var position = pageX - boundingRect.left - document.body.scrollLeft;
	      var containerWidth = boundingRect.width;
	      var progressPercentage = position / containerWidth;
	      this.setState({
	        displayedTime: progressPercentage * this.audio.duration
	      });
	    }
	  }, {
	    key: 'seek',
	    value: function seek(event) {
	      /* this function is activated when the user lets
	       * go of the mouse, so if .noselect was applied
	       * to the document body, get rid of it.
	       */
	      document.body.classList.remove('noselect');
	      if (!this.seekInProgress) {
	        return;
	      }
	      /* we don't want mouse handlers to receive the event
	       * after touch handlers if we're seeking.
	       */
	      event.preventDefault();
	      this.seekInProgress = false;
	      var displayedTime = this.state.displayedTime;
	      if (isNaN(displayedTime)) {
	        return;
	      }
	      this.audio.currentTime = displayedTime;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      var activeIndex = this.state.activeTrackIndex;
	      var displayText = activeIndex < 0 ? null : this.playlist[activeIndex].displayText;

	      var displayedTime = this.state.displayedTime;
	      var duration = this.audio && this.audio.duration || 0;

	      var elapsedTime = convertToTime(displayedTime);
	      var fullTime = convertToTime(duration);
	      var timeRatio = elapsedTime + ' / ' + fullTime;

	      var progressBarWidth = displayedTime / duration * 100 + '%';

	      return React.createElement(
	        'div',
	        { id: 'audio_player',
	          className: classNames('audio_player', { 'top': this.props.placeAtTop }),
	          title: displayText },
	        React.createElement(
	          'div',
	          { className: 'audio_controls' },
	          React.createElement(
	            'div',
	            { id: 'skip_button',
	              className: classNames('skip_button', 'back', 'audio_button', {
	                'hidden': this.props.hideBackSkip
	              }),
	              onClick: this.backSkip.bind(this) },
	            React.createElement(
	              'div',
	              { className: 'skip_button_inner' },
	              React.createElement('div', { className: 'right_facing_triangle' }),
	              React.createElement('div', { className: 'right_facing_triangle' })
	            )
	          ),
	          React.createElement(
	            'div',
	            { id: 'play_pause_button',
	              className: classNames('play_pause_button', 'audio_button', {
	                'paused': this.state.paused
	              }),
	              onClick: this.togglePause.bind(this, null) },
	            React.createElement(
	              'div',
	              { className: 'play_pause_inner' },
	              React.createElement('div', { className: 'left' }),
	              React.createElement('div', { className: 'right' }),
	              React.createElement('div', { className: 'triangle_1' }),
	              React.createElement('div', { className: 'triangle_2' })
	            )
	          ),
	          React.createElement(
	            'div',
	            { id: 'skip_button',
	              className: 'skip_button audio_button',
	              onClick: this.skipToNextTrack.bind(this, null) },
	            React.createElement(
	              'div',
	              { className: 'skip_button_inner' },
	              React.createElement('div', { className: 'right_facing_triangle' }),
	              React.createElement('div', { className: 'right_facing_triangle' })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { id: 'audio_progress_container',
	            className: 'audio_progress_container',
	            ref: function ref(_ref) {
	              return _this4.audioProgressContainer = _ref;
	            },
	            onMouseDown: this.adjustDisplayedTime.bind(this),
	            onMouseMove: this.adjustDisplayedTime.bind(this),
	            onTouchStart: this.adjustDisplayedTime.bind(this),
	            onTouchMove: this.adjustDisplayedTime.bind(this) },
	          React.createElement('div', { id: 'audio_progress',
	            className: 'audio_progress',
	            style: { width: progressBarWidth } }),
	          React.createElement(
	            'div',
	            { id: 'audio_progress_overlay', className: 'audio_progress_overlay' },
	            React.createElement(
	              'div',
	              { className: 'audio_info_marquee' },
	              React.createElement(
	                'div',
	                { id: 'audio_info', className: 'audio_info noselect', draggable: 'false' },
	                displayText
	              )
	            ),
	            React.createElement(
	              'div',
	              { id: 'audio_time_progress',
	                className: 'audio_time_progress noselect',
	                draggable: 'false' },
	              timeRatio
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return AudioPlayer;
	}(React.Component);

	AudioPlayer.propTypes = {
	  playlist: React.PropTypes.array,
	  autoplay: React.PropTypes.bool,
	  autoplayDelayInSeconds: React.PropTypes.number,
	  hideBackSkip: React.PropTypes.bool,
	  stayOnBackSkipThreshold: React.PropTypes.number,
	  placeAtTop: React.PropTypes.bool
	};

	module.exports = AudioPlayer;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;