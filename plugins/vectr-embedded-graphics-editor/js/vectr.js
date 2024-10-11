/**
 *  Vembedded.vectr.js
 *
 *  This library lets you embed Vectr as an vector editor for your service.
 *
 *  Author: Vectr Labs
 *  Website: https://vectr.com
 *
 *  @preserve
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Vectr", [], factory);
	else if(typeof exports === 'object')
		exports["Vectr"] = factory();
	else
		root["Vectr"] = factory();
})(this, function() {
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

	var u = __webpack_require__(1);
	var c = __webpack_require__(2);

	var Vectr = function () {
	  function Vectr() {
	    _classCallCheck(this, Vectr);

	    // testing use
	    this.utils = u;
	    this.constants = c;

	    // internal properties
	    this._events = {};
	    this.ready = false;
	    this.isOpened = false;
	    this.lastFilename = 'new';

	    // configurations
	    this._config = {
	      serverUrl: c.VECTR_SERVER_URL,
	      saveFormat: c.DEFAULT_SAVE_FORMAT
	    };

	    this._init();
	  }

	  _createClass(Vectr, [{
	    key: '_injectCSS',
	    value: function _injectCSS() {
	      var $link = u.$('#' + c.CSS_LINK_ID);
	      if (!$link) {
	        var src = u.getCurrentSrc();
	        var $head = u.$('head');
	        $link = document.createElement('link');
	        $link.id = c.DEFAULT_CSS_ID;
	        $link.rel = 'stylesheet';
	        $link.type = 'text/css';
	        $link.href = src.replace(/\.js$/, '.css');
	        $head.appendChild($link);
	      }
	    }
	  }, {
	    key: '_injectDOMs',
	    value: function _injectDOMs() {
	      var template = '\n      <div class="' + c.OVERLAY_CLASS + '">\n        <a href="#" class="' + c.CLOSE_BUTTON_CLASS + '">\u2717</a>\n        <a href="#" class="' + c.SAVE_BUTTON_CLASS + '">\u2713</a>\n        <div class="' + c.EMBEDDED_EDITOR_CLASS + '">\n          <iframe class="' + c.IFRAME_CLASS + '" frameborder="0"></iframe>\n        </div>\n      </div>\n    ';

	      var temp = document.createElement('div');
	      temp.innerHTML = template;
	      var all = temp.querySelector('.' + c.OVERLAY_CLASS);

	      var $defaultOverlay = all;
	      var $defaultIframe = all.querySelector('.' + c.IFRAME_CLASS);
	      var $defaultSaveButton = all.querySelector('.' + c.SAVE_BUTTON_CLASS);
	      var $defaultCloseButton = all.querySelector('.' + c.CLOSE_BUTTON_CLASS);

	      var $overlay = u.$('.' + c.OVERLAY_CLASS);
	      var $saveButton = u.$('.' + c.SAVE_BUTTON_CLASS);
	      var $closeButton = u.$('.' + c.CLOSE_BUTTON_CLASS);
	      var $iframeContainer = u.$('.' + c.EMBEDDED_EDITOR_CLASS);

	      this.$closeButton = $closeButton ? $closeButton : $defaultCloseButton;
	      this.$saveButton = $saveButton ? $saveButton : $defaultSaveButton;
	      this.$overlay = $overlay ? $overlay : $defaultOverlay;
	      this.$iframe = $defaultIframe;

	      if ($iframeContainer) {
	        $iframeContainer.appendChild(this.$iframe);
	      } else {
	        var $body = u.$('body');
	        $body.appendChild(all);
	      }

	      this.$saveButton.classList.add('disabled');
	      this.$overlay.classList.add('hide');
	    }
	  }, {
	    key: '_init',
	    value: function _init() {
	      var _this = this;

	      this._injectCSS();

	      if (document.readyState === 'complete') {
	        this.ready = true;
	        this._injectDOMs();
	      } else {
	        document.addEventListener('DOMContentLoaded', function () {
	          _this.ready = true;
	          _this._injectDOMs();
	        });
	      }

	      window.addEventListener('message', function (e) {
	        var origin = e.origin || e.originalEvent.origin;
	        if (origin !== _this._config.serverUrl) {
	          return;
	        }

	        var data = e.data || {};
	        var name = data.name;
	        var error = data.error;
	        var value = data.value;

	        _this.trigger(name, error, value);
	      });

	      document.addEventListener('click', function (e) {
	        var target = e.target;
	        var classList = target && target.classList;

	        if (!classList) {
	          return;
	        }

	        if (classList.contains(c.CLOSE_BUTTON_CLASS)) {
	          _this.close();
	          return;
	        }

	        if (classList.contains(c.SAVE_BUTTON_CLASS)) {
	          _this.save();
	          return;
	        }

	        if (classList.contains(c.VECTR_BUTTON_CLASS)) {
	          _this.open();
	          return;
	        }
	      });

	      document.addEventListener('keydown', function (e) {
	        var key = e.which || e.keyCode;
	        if (key === c.KEYS.ESC) {
	          return _this.close();
	        }
	      });

	      var openedFilename = this.lastFilename;

	      this.on('opening', function () {
	        _this.$saveButton.classList.add('disabled');
	        _this.$closeButton.classList.remove('disabled');
	        _this.$overlay.classList.remove('hide');
	      });

	      this.on('open', function (error, filename) {
	        _this.$saveButton.classList.remove('disabled');
	        openedFilename = filename;
	      });

	      this.on('closing', function () {
	        _this.$saveButton.classList.add('disabled');
	        _this.$closeButton.classList.add('disabled');
	      });

	      this.on('close', function (error) {
	        if (!error) {
	          _this.$overlay.classList.add('hide');
	          _this.isOpened = false;
	          _this.$iframe.src = '';
	        }
	      });

	      this.on('save', function (error, url) {
	        if (error) {
	          return;
	        }

	        // lastFilename will be changed until save button got clicked
	        _this.lastFilename = openedFilename;
	      });

	      var $vectrButton = u.$('.' + c.VECTR_BUTTON_CLASS);
	      if ($vectrButton) {
	        this.lastFilename = $vectrButton.dataset.filename;
	      }
	    }
	  }, {
	    key: '_buildUrl',
	    value: function _buildUrl(filename) {
	      filename = filename || c.DEFAULT_FILENAME;
	      return this._config.serverUrl + '/' + filename;
	    }
	  }, {
	    key: '_postMessage',
	    value: function _postMessage(params) {
	      params = params || {};
	      if (!params.name) {
	        return false;
	      }

	      var win = this.$iframe.contentWindow;
	      win.postMessage(params, this._config.serverUrl);
	    }
	  }, {
	    key: 'on',
	    value: function on(name, cb) {
	      if (!name || !cb) {
	        return;
	      }

	      if (!this._events[name]) {
	        this._events[name] = [];
	      }

	      this._events[name].push(cb);
	    }
	  }, {
	    key: 'off',
	    value: function off(name, cb) {
	      if (!name || !cb) {
	        return;
	      }

	      var fns = this._events[name];
	      var index = fns.indexOf(cb);
	      if (index >= 0) {
	        fns.splice(index, 1);
	      }
	    }
	  }, {
	    key: 'once',
	    value: function once(name, cb) {
	      if (!name || !cb) {
	        return;
	      }

	      var self = this;
	      this.on(name, function wrapper() {
	        self.off(name, wrapper);
	        cb.apply({}, arguments);
	      });
	    }
	  }, {
	    key: 'trigger',
	    value: function trigger(name, error, value) {
	      var ret = void 0;
	      var fns = this._events[name] || [];

	      for (var i = fns.length - 1; i >= 0 && ret !== false; i--) {
	        var fn = fns[i];
	        ret = fn.call({}, error, value);
	      }
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      if (!this.ready || !this.isOpened) {
	        return;
	      }

	      this._postMessage({
	        name: 'save',
	        value: {
	          format: this._config.saveFormat || c.DEFAULT_SAVE_FORMAT
	        }
	      });

	      this.close();
	    }
	  }, {
	    key: 'open',
	    value: function open(filename) {
	      if (!this.ready || this.isOpened) {
	        return;
	      }

	      this.trigger('opening');
	      this.isOpened = true;

	      // so that users can keep editing the same file
	      if (!filename) {
	        filename = this.lastFilename;
	      }

	      this.$iframe.src = this._buildUrl(filename);
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      if (!this.ready || !this.isOpened) {
	        return;
	      }

	      this.trigger('closing');

	      this._postMessage({
	        name: 'close'
	      });
	    }
	  }, {
	    key: 'import',
	    value: function _import(url) {
	      if (!this.ready || !this.isOpened) {
	        return;
	      }

	      this._postMessage({
	        name: 'import',
	        value: {
	          url: url
	        }
	      });
	    }
	  }, {
	    key: 'config',
	    value: function config(opts) {
	      var _this2 = this;

	      Object.keys(opts).forEach(function (key) {
	        _this2._config[key] = opts[key];
	      });
	    }
	  }]);

	  return Vectr;
	}();

	module.exports = new Vectr();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  $: function $(sel) {
	    return document.querySelector(sel);
	  },

	  getCurrentSrc: function getCurrentSrc() {
	    var src = '';
	    var scripts = document.getElementsByTagName('script');
	    var currentScript = scripts[scripts.length - 1];
	    if (currentScript) {
	      src = currentScript.src;
	    }
	    return src;
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  DEFAULT_FILENAME: 'new',
	  DEFAULT_SAVE_FORMAT: 'png',
	  VECTR_SERVER_URL: 'https://vectr.com',
	  CSS_LINK_ID: 'vectr-css',
	  VECTR_BUTTON_CLASS: 'vectr-button',
	  SAVE_BUTTON_CLASS: 'vectr-save-button',
	  CLOSE_BUTTON_CLASS: 'vectr-close-button',
	  OVERLAY_CLASS: 'vectr-overlay',
	  EMBEDDED_EDITOR_CLASS: 'vectr-embedded-editor',
	  IFRAME_CLASS: 'vectr-iframe',
	  KEYS: {
	    ESC: 27
	  }
	};

/***/ }
/******/ ])
});
;