// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/normalize.css/normalize.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/tinycolor2/tinycolor.js":[function(require,module,exports) {
var define;
// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);

},{}],"scripts/lib/vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector = Vector;

// Vector class originally from https://evanw.github.io/lightgl.js/docs/vector.html
// Edited and expanded to match p5's vectors
// ref - p5 vector https://p5js.org/reference/#/p5.Vector
// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/more-vector-math
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector.prototype = {
  negative: function negative() {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add: function add(v) {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    return new Vector(this.x + v, this.y + v, this.z + v);
  },
  sub: function sub(v) {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    return new Vector(this.x - v, this.y - v, this.z - v);
  },
  mult: function mult(v) {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    return new Vector(this.x * v, this.y * v, this.z * v);
  },
  div: function div(v) {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    return new Vector(this.x / v, this.y / v, this.z / v);
  },
  equals: function equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  },
  dot: function dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function cross(v) {
    return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
  },
  length: function length() {
    return Math.sqrt(this.dot(this));
  },
  mag: function mag() {
    return this.length();
  },
  magSq: function magSq() {
    var m = this.length();
    return m * m;
  },
  setMag: function setMag(m) {
    var c = this.mag();
    var r = m / c;
    return this.mult(r);
  },
  normalize: function normalize() {
    var mag = this.mag();
    mag = mag || 1;
    return this.div(mag);
  },
  unit: function unit() {
    return this.divide(this.length());
  },
  min: function min() {
    return Math.min(Math.min(this.x, this.y), this.z);
  },
  max: function max() {
    return Math.max(Math.max(this.x, this.y), this.z);
  },
  limit: function limit(v) {
    var cm = this.mag();

    if (cm > v) {
      return this.setMag(v);
    }

    return this;
  },
  // clamp(min, max) {
  //     // export const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a));
  // },
  toAngles: function toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    };
  },
  angleTo: function angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function toArray(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone: function clone() {
    return new Vector(this.x, this.y, this.z);
  },
  init: function init(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
};

Vector.negative = function (a, b) {
  b.x = -a.x;
  b.y = -a.y;
  b.z = -a.z;
  return b;
};

Vector.add = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
    c.z = a.z + b.z;
  } else {
    c.x = a.x + b;
    c.y = a.y + b;
    c.z = a.z + b;
  }

  return c;
};

Vector.subtract = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x - b.x;
    c.y = a.y - b.y;
    c.z = a.z - b.z;
  } else {
    c.x = a.x - b;
    c.y = a.y - b;
    c.z = a.z - b;
  }

  return c;
};

Vector.multiply = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x * b.x;
    c.y = a.y * b.y;
    c.z = a.z * b.z;
  } else {
    c.x = a.x * b;
    c.y = a.y * b;
    c.z = a.z * b;
  }

  return c;
};

Vector.divide = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x / b.x;
    c.y = a.y / b.y;
    c.z = a.z / b.z;
  } else {
    c.x = a.x / b;
    c.y = a.y / b;
    c.z = a.z / b;
  }

  return c;
};

Vector.cross = function (a, b, c) {
  c.x = a.y * b.z - a.z * b.y;
  c.y = a.z * b.x - a.x * b.z;
  c.z = a.x * b.y - a.y * b.x;
  return c;
};

Vector.unit = function (a, b) {
  var length = a.length();
  b.x = a.x / length;
  b.y = a.y / length;
  b.z = a.z / length;
  return b;
};

Vector.fromAngles = function (theta, phi) {
  return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};

Vector.randomDirection = function () {
  return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};

Vector.min = function (a, b) {
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};

Vector.max = function (a, b) {
  return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};

Vector.lerp = function (a, b, fraction) {
  return b.subtract(a).multiply(fraction).add(a);
};

Vector.fromArray = function (a) {
  return new Vector(a[0], a[1], a[2]);
};

Vector.angleBetween = function (a, b) {
  return a.angleTo(b);
};
},{}],"scripts/lib/particle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointPush = exports.attractPoint = exports.avoidPoint = exports.gravityPoint = exports.edgeWrap = exports.edgeBounce = exports.attract = exports.drag = exports.friction = exports.applyForce = exports.updatePosWithVelocity = exports.createRandomParticleValues = exports.psCanvasRandom = exports.pixel = exports.Particle = void 0;

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _math = require("./math");

var _vector = require("./vector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MAX_COORD_HISTORY = 30;

var limitArrayLen = function limitArrayLen(arr) {
  var arrLength = arr.length;

  if (arrLength > MAX_COORD_HISTORY) {
    arr.splice(0, arrLength - MAX_COORD_HISTORY);
  }

  return arr;
};

var Particle = /*#__PURE__*/function () {
  function Particle(values) {
    _classCallCheck(this, Particle);

    this.initValues(values);
  }

  _createClass(Particle, [{
    key: "initValues",
    value: function initValues(_ref) {
      var index = _ref.index,
          x = _ref.x,
          y = _ref.y,
          velocityX = _ref.velocityX,
          velocityY = _ref.velocityY,
          accelerationX = _ref.accelerationX,
          accelerationY = _ref.accelerationY,
          radius = _ref.radius,
          mass = _ref.mass,
          color = _ref.color,
          alpha = _ref.alpha,
          rotation = _ref.rotation,
          lifetime = _ref.lifetime,
          drawFn = _ref.drawFn,
          updateFn = _ref.updateFn,
          colorFn = _ref.colorFn,
          rest = _objectWithoutProperties(_ref, ["index", "x", "y", "velocityX", "velocityY", "accelerationX", "accelerationY", "radius", "mass", "color", "alpha", "rotation", "lifetime", "drawFn", "updateFn", "colorFn"]);

      this.props = rest;
      this.index = index || 0;
      this._x = x || 0;
      this._y = y || 0;
      this.xHistory = [x];
      this.yHistory = [y];
      this.oX = x || this.oX;
      this.oY = y || this.oY;
      this.velocityX = velocityX || 0;
      this.velocityY = velocityY || 0;
      this.accelerationX = accelerationX || 0;
      this.accelerationY = accelerationY || 0; // this.oVelocityX = velocityX || 0;
      // this.oVelocityY = velocityY || 0;

      this.mass = mass || 1;
      this.radius = radius || 1;
      this._color = color ? (0, _tinycolor.default)(color) : (0, _tinycolor.default)({
        r: 255,
        g: 255,
        b: 255
      });
      this.rotation = rotation || 0;
      this.lifetime = lifetime || 1;
      this.drawFn = drawFn;
      this.updateFn = updateFn; // always return a string

      this.colorFn = colorFn;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.drawFn(this);
    }
  }, {
    key: "update",
    value: function update() {
      this.updateFn(this);
      this.draw(this);
    }
  }, {
    key: "color",
    get: function get() {
      if (this.colorFn) {
        return (0, _tinycolor.default)(this.colorFn(this));
      }

      return this._color;
    },
    set: function set(value) {
      this._color = (0, _tinycolor.default)(value);
    }
  }, {
    key: "colorStr",
    get: function get() {
      if (this.colorFn) {
        return this.colorFn(this);
      }

      return this._color.toRgbString();
    }
  }, {
    key: "x",
    get: function get() {
      return this._x;
    },
    set: function set(value) {
      this._x = value;
      this.xHistory.unshift(value);

      if (this.xHistory.length > MAX_COORD_HISTORY) {
        this.xHistory = this.xHistory.slice(0, MAX_COORD_HISTORY);
      }
    }
  }, {
    key: "y",
    get: function get() {
      return this._y;
    },
    set: function set(value) {
      this._y = value;
      this.yHistory.unshift(value);

      if (this.yHistory.length > MAX_COORD_HISTORY) {
        this.yHistory = this.yHistory.slice(0, MAX_COORD_HISTORY);
      }
    }
  }, {
    key: "vVector",
    get: function get() {
      return new _vector.Vector(this.velocityX, this.velocityY, 0);
    },
    set: function set(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      this.velocityX = x;
      this.velocityY = y;
    }
  }, {
    key: "aVector",
    get: function get() {
      return new _vector.Vector(this.accelerationX, this.accelerationY, 0);
    },
    set: function set(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      this.accelerationX = x;
      this.accelerationY = y;
    } // Rotation angle to point in direction of velocity

  }, {
    key: "heading",
    get: function get() {
      return (0, _math.pointAngleFromVelocity)(this);
    }
  }]);

  return Particle;
}();

exports.Particle = Particle;

var pixel = function pixel(x, y, color, radius) {
  return new Particle({
    x: x,
    y: y,
    color: color,
    radius: radius
  });
};

exports.pixel = pixel;

var psCanvasRandom = function psCanvasRandom(canvas) {
  return {
    x: (0, _math.randomNumberBetween)(0, canvas.width),
    y: (0, _math.randomNumberBetween)(0, canvas.height)
  };
};

exports.psCanvasRandom = psCanvasRandom;

var createRandomParticleValues = function createRandomParticleValues(canvas) {
  var vel = 2;
  var radius = (0, _math.randomNumberBetween)(5, 10);
  var coords = psCanvasRandom(canvas);
  return {
    radius: radius,
    x: coords.x,
    y: coords.y,
    mass: (0, _math.randomNumberBetween)(1, 10),
    velocityX: (0, _math.randomNumberBetween)(-vel, vel),
    velocityY: (0, _math.randomNumberBetween)(-vel, vel),
    accelerationX: 0,
    accelerationY: 0,
    rotation: (0, _math.randomNumberBetween)(-180, 180),
    // color: { r: randomNumberBetween(100, 255), g: randomNumberBetween(100, 255), b: randomNumberBetween(100, 255) },
    color: {
      r: (0, _math.lerp)(0, 255, coords.x / canvas.width),
      g: (0, _math.randomNumberBetween)(100, 255),
      b: (0, _math.lerp)(0, 255, coords.y / canvas.height)
    }
  };
};

exports.createRandomParticleValues = createRandomParticleValues;

var updatePosWithVelocity = function updatePosWithVelocity(particle) {
  particle.x += particle.vVector.x;
  particle.y += particle.vVector.y;
}; // https://www.youtube.com/watch?v=L7CECWLdTmo


exports.updatePosWithVelocity = updatePosWithVelocity;

var applyForce = function applyForce(fVect, particle) {
  var fV = fVect.div(particle.mass);
  var aV = particle.aVector.add(fV);
  var pV = particle.vVector.add(aV);
  particle.aVector = aV;
  particle.vVector = pV;
}; // https://www.youtube.com/watch?v=WBdhAuWS6X8


exports.applyForce = applyForce;

var friction = function friction(particle) {
  var mu = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var normal = particle.mass;
  var vfriction = particle.vVector.normalize().mult(-1).setMag(mu * normal);
  applyForce(vfriction, particle);
}; // https://www.youtube.com/watch?v=DxFDgOYEoy8


exports.friction = friction;

var drag = function drag(particle) {
  var coefficent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var area = 1; // particle.radius;

  var velUnit = particle.vVector.normalize().mult(-1);
  var speed = particle.vVector.magSq() * area * coefficent;
  var vdrag = velUnit.setMag(speed);
  applyForce(vdrag, particle);
}; // https://www.youtube.com/watch?v=EpgB3cNhKPM
// mode 1 is attract, -1 is repel
// const attractor = { x: canvas.width / 2, y: canvas.height / 2, mass: 50, g: 1 };


exports.drag = drag;

var attract = function attract(_ref4, particle) {
  var x = _ref4.x,
      y = _ref4.y,
      mass = _ref4.mass,
      g = _ref4.g;
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var affectDist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

  if ((0, _math.pointDistance)({
    x: x,
    y: y
  }, {
    x: particle.x,
    y: particle.y
  }) < affectDist) {
    g = g || 1;
    var dir = new _vector.Vector(x, y).sub(new _vector.Vector(particle.x, particle.y));
    var distanceSq = (0, _math.clamp)(50, 5000, dir.magSq());
    var strength = mode * (g * (mass * particle.mass)) / distanceSq;
    var force = dir.setMag(strength);
    applyForce(force, particle);
  }
};

exports.attract = attract;

var edgeBounce = function edgeBounce(_ref5, particle) {
  var width = _ref5.width,
      height = _ref5.height;

  // if (particle.x + particle.radius > width || particle.x - particle.radius < 0) {
  //     particle.velocityX *= -1;
  // }
  // if (particle.y + particle.radius > height || particle.y - particle.radius < 0) {
  //     particle.velocityY *= -1;
  // }
  if (particle.x + particle.radius > width) {
    particle.velocityX *= -1;
    particle.x = width - particle.radius;
  }

  if (particle.x - particle.radius < 0) {
    particle.velocityX *= -1;
    particle.x = particle.radius;
  }

  if (particle.y + particle.radius > height) {
    particle.velocityY *= -1;
    particle.y = height - particle.radius;
  }

  if (particle.y - particle.radius < 0) {
    particle.velocityY *= -1;
    particle.y = particle.radius;
  }
};

exports.edgeBounce = edgeBounce;

var edgeWrap = function edgeWrap(_ref6, particle) {
  var width = _ref6.width,
      height = _ref6.height;

  if (particle.x + particle.radius > width) {
    particle.x = 0 + particle.radius;
  } else if (particle.x - particle.radius < 0) {
    particle.x = width - particle.radius;
  }

  if (particle.y + particle.radius > height) {
    particle.y = 0 + particle.radius;
  } else if (particle.y - particle.radius < 0) {
    particle.y = height - particle.radius;
  }
};

exports.edgeWrap = edgeWrap;

var gravityPoint = function gravityPoint() {
  var mult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.2;
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return function (x, y, radius, particle) {
    var distance = (0, _math.pointDistance)({
      x: x,
      y: y
    }, particle);

    if (distance < radius) {
      var dx = x - particle.x;
      var dy = y - particle.y;
      var forceDirectionX = dx / distance;
      var forceDirectionY = dy / distance;
      var force = (0, _math.normalizeInverse)(0, radius, distance) * f * mult;
      var tempX = forceDirectionX * force * particle.radius * 2;
      var tempY = forceDirectionY * force * particle.radius * 2;
      particle.x += tempX;
      particle.y += tempY;
    }
  };
}; // for moving points, push away/around from point


exports.gravityPoint = gravityPoint;

var avoidPoint = function avoidPoint(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  gravityPoint(1, f *= -1)(point.x, point.y, point.radius, particle);
}; // for moving points, pull towards point


exports.avoidPoint = avoidPoint;

var attractPoint = function attractPoint(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  gravityPoint(1, f)(point.x, point.y, point.radius, particle);
}; // for moving static, push away/outward from point


exports.attractPoint = attractPoint;

var pointPush = function pointPush(point, particle) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var dx = point.x - particle.x;
  var dy = point.y - particle.y;
  var distance = (0, _math.pointDistance)(point, particle);
  var forceDirectionX = dx / distance;
  var forceDirectionY = dy / distance;
  var force = (0, _math.normalizeInverse)(0, point.radius, distance) * f;
  particle.velocityX = forceDirectionX * force * particle.mass * 0.8;
  particle.velocityY = forceDirectionY * force * particle.mass * 0.8;

  if (distance < point.radius) {
    particle.x -= particle.velocityX;
    particle.y -= particle.velocityY;
  } else {
    // TODO if < 1 then snap to 0
    if (particle.x !== particle.oX) {
      particle.x -= (particle.x - particle.oX) * 0.1;
    }

    if (particle.y !== particle.oY) {
      particle.y -= (particle.y - particle.oY) * 0.1;
    }
  }
};

exports.pointPush = pointPush;
},{"tinycolor2":"node_modules/tinycolor2/tinycolor.js","./math":"scripts/lib/math.js","./vector":"scripts/lib/vector.js"}],"scripts/lib/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGridPoints = exports.createCirclePoints = exports.scalePointToCanvas = exports.radiansToDegrees = exports.pointAngleFromVelocity = exports.pointRotateCoord = exports.pointDistance = exports.lerpRange = exports.invlerp = exports.clamp = exports.lerp = exports.normalizeInverse = exports.normalize = exports.pointOnCircle = exports.createRandomNumberArray = exports.randomSign = exports.randomNumberBetweenMid = exports.randomNumberBetween = void 0;

var _particle = require("./particle");

var _canvas = require("./canvas");

/*
  // Math aliases
  var π = Math.PI
  var random = Math.random
  var round = Math.round
  var floor = Math.floor
  var abs = Math.abs
  var sin = Math.sin
  var cos = Math.cos
  var tan = Math.tan

  Math Snippets
  https://github.com/terkelg/math
*/
var randomNumberBetween = function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
};

exports.randomNumberBetween = randomNumberBetween;

var randomNumberBetweenMid = function randomNumberBetweenMid(min, max) {
  return randomNumberBetween(min, max) - max / 2;
};

exports.randomNumberBetweenMid = randomNumberBetweenMid;

var randomSign = function randomSign() {
  return Math.round(Math.random()) == 1 ? 1 : -1;
};

exports.randomSign = randomSign;

var createRandomNumberArray = function createRandomNumberArray(len, min, max) {
  var arr = [];

  for (var i = 0; i < len; i++) {
    arr.push(randomNumberBetween(min, max));
  }

  return arr;
};

exports.createRandomNumberArray = createRandomNumberArray;

var pointOnCircle = function pointOnCircle(x, y, r, d) {
  return {
    x: r * Math.sin(d) + x,
    y: r * Math.cos(d) + y
  };
}; // returns value between 0-1, 250,500,0 => .5


exports.pointOnCircle = pointOnCircle;

var normalize = function normalize(min, max, val) {
  return (val - min) / (max - min);
};

exports.normalize = normalize;

var normalizeInverse = function normalizeInverse(min, max, val) {
  return 1 - normalize(min, max, val);
}; // https://twitter.com/mattdesl/status/1031305279227478016
// https://www.trysmudford.com/blog/linear-interpolation-functions/
// lerp(20, 80, 0.5) // 40


exports.normalizeInverse = normalizeInverse;

var lerp = function lerp(x, y, a) {
  return x * (1 - a) + y * a;
};

exports.lerp = lerp;

var clamp = function clamp() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var a = arguments.length > 2 ? arguments[2] : undefined;
  return Math.min(max, Math.max(min, a));
}; // invlerp(50, 100, 75)  // 0.5


exports.clamp = clamp;

var invlerp = function invlerp(x, y, a) {
  return clamp(0, 1, (a - x) / (y - x));
}; // a is point in 1 and converts to point in 2
// range(10, 100, 2000, 20000, 50) // 10000


exports.invlerp = invlerp;

var lerpRange = function lerpRange(x1, y1, x2, y2, a) {
  return lerp(x2, y2, invlerp(x1, y1, a));
};

exports.lerpRange = lerpRange;

var pointDistance = function pointDistance(pointA, pointB) {
  var dx = pointA.x - pointB.x;
  var dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}; // https://stackoverflow.com/questions/13043945/how-do-i-calculate-the-position-of-a-point-in-html5-canvas-after-rotation


exports.pointDistance = pointDistance;

var pointRotateCoord = function pointRotateCoord(point, angle) {
  return {
    x: point.x * cos(angle) - point.y * sin(angle),
    y: point.y * cos(angle) + point.x * sin(angle)
  };
}; // https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-angular-movement/a/pointing-towards-movement


exports.pointRotateCoord = pointRotateCoord;

var pointAngleFromVelocity = function pointAngleFromVelocity(_ref) {
  var velocityX = _ref.velocityX,
      velocityY = _ref.velocityY;
  return Math.atan2(velocityY, velocityX);
};

exports.pointAngleFromVelocity = pointAngleFromVelocity;

var radiansToDegrees = function radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}; // Scale up point grid and center in the canvas


exports.radiansToDegrees = radiansToDegrees;

var scalePointToCanvas = function scalePointToCanvas(cwidth, cheight, width, height, zoomFactor, x, y) {
  var particleXOffset = cwidth / 2 - width * zoomFactor / 2;
  var particleYOffset = cheight / 2 - height * zoomFactor / 2;
  return {
    x: x * zoomFactor + particleXOffset,
    y: y * zoomFactor + particleYOffset
  };
}; // [[x,y], ...]


exports.scalePointToCanvas = scalePointToCanvas;

var createCirclePoints = function createCirclePoints(centerX, centerY, diameter, steps) {
  var sx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var sy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var points = [];

  for (var theta = 0; theta < 360; theta += steps) {
    var radius = theta * (Math.PI / 180);
    var x = Math.cos(radius) * diameter + sx + centerX;
    var y = Math.sin(radius) * diameter + sy + centerY;
    points.push([x, y]);
  }

  return points;
};

exports.createCirclePoints = createCirclePoints;

var createGridPoints = function createGridPoints(width, height, xMargin, yMargin, columns, rows) {
  var gridPoints = [];
  var colStep = (width - xMargin * 2) / (columns - 1);
  var rowStep = (height - yMargin * 2) / (rows - 1);

  for (var col = 0; col < columns; col++) {
    var x = xMargin + col * colStep;

    for (var row = 0; row < rows; row++) {
      var y = yMargin + row * rowStep;
      gridPoints.push([x, y]);
    }
  }

  return gridPoints;
};

exports.createGridPoints = createGridPoints;
},{"./particle":"scripts/lib/particle.js","./canvas":"scripts/lib/canvas.js"}],"scripts/lib/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawAttractor = exports.drawMouse = exports.drawPointTrail = exports.connectParticles = exports.drawSpikeCircle = exports.drawParticleVectors = exports.drawCircle = exports.drawThickLine = exports.drawLine = exports.drawTriangle = exports.drawSquare = exports.drawRect = exports.drawRake = exports.drawTestPoint = exports.drawPoint = exports.drawRotatedParticle = exports.resetStyles = exports.background = exports.fillCanvas = exports.clearCanvas = exports.getImageColor = exports.getImageDataFromImage = exports.resizeCanvas = void 0;

var _tinycolor = _interopRequireDefault(require("tinycolor2"));

var _math = require("./math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizeCanvas = function resizeCanvas(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
};

exports.resizeCanvas = resizeCanvas;

var getImageDataFromImage = function getImageDataFromImage(context) {
  return function (image) {
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.width);
  };
}; // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas


exports.getImageDataFromImage = getImageDataFromImage;

var getImageColor = function getImageColor(imageData, x, y) {
  return {
    r: imageData.data[y * 4 * imageData.width + x * 4],
    g: imageData.data[y * 4 * imageData.width + x * 4 + 1],
    b: imageData.data[y * 4 * imageData.width + x * 4 + 2],
    a: imageData.data[y * 4 * imageData.width + x * 4 + 3]
  };
};

exports.getImageColor = getImageColor;

var clearCanvas = function clearCanvas(canvas, context) {
  return function (_) {
    return context.clearRect(0, 0, canvas.width, canvas.height);
  };
};

exports.clearCanvas = clearCanvas;

var fillCanvas = function fillCanvas(canvas, context) {
  return function () {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0,0,0';
    context.fillStyle = "rgba(".concat(color, ",").concat(opacity, ")");
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
};

exports.fillCanvas = fillCanvas;

var background = function background(canvas, context) {
  return function () {
    var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'black';
    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}; // context.save() and context.restore() may be slow, just reset what i'm using


exports.background = background;

var resetStyles = function resetStyles(context) {
  context.strokeStyle = '#000';
  context.fillStyle = '#fff';
  context.lineWidth = 1;
  context.setLineDash([]);
  context.lineCap = 'butt';
};

exports.resetStyles = resetStyles;

var drawRotatedParticle = function drawRotatedParticle(ctx, drawFn, particle) {
  var pSaveX = particle.x;
  var pSaveY = particle.y;
  particle.x = 0;
  particle.y = 0;
  ctx.save();
  ctx.translate(pSaveX, pSaveY);
  ctx.rotate(particle.heading);

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  drawFn(ctx)(particle, args);
  ctx.restore();
  particle.x = pSaveX;
  particle.y = pSaveY;
};

exports.drawRotatedParticle = drawRotatedParticle;

var drawPoint = function drawPoint(context) {
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        radius = _ref.radius,
        color = _ref.color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
  };
};

exports.drawPoint = drawPoint;

var drawTestPoint = function drawTestPoint(context) {
  return function (_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        radius = _ref2.radius,
        color = _ref2.color;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
    drawLine(context)(1, x, y, x + radius, y);
  };
}; // TODO center it


exports.drawTestPoint = drawTestPoint;

var drawRake = function drawRake(context) {
  return function (_ref3, spacing) {
    var x = _ref3.x,
        y = _ref3.y,
        radius = _ref3.radius,
        color = _ref3.color;
    var points = 5;
    spacing |= radius * 3;

    for (var i = 0; i < points; i++) {
      drawPoint(context)({
        x: x + spacing * i,
        y: y,
        radius: radius,
        color: color
      });
    }
  };
};

exports.drawRake = drawRake;

var drawRect = function drawRect(context) {
  return function (x, y, w, h) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'white';
    context.fillStyle = (0, _tinycolor.default)(color).toRgbString();
    context.fillRect(x, y, w, h);
  };
};

exports.drawRect = drawRect;

var drawSquare = function drawSquare(context) {
  return function (_ref4) {
    var x = _ref4.x,
        y = _ref4.y,
        radius = _ref4.radius,
        color = _ref4.color;
    drawRect(context)(x, y, radius, radius, color);
  };
};

exports.drawSquare = drawSquare;

var drawTriangle = function drawTriangle(context) {
  return function (_ref5) {
    var x = _ref5.x,
        y = _ref5.y,
        radius = _ref5.radius,
        color = _ref5.color;
    var half = radius / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill(); // context.beginPath();
    // context.arc(x+half, y, 3, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgb(255,0,0)';
    // context.fill();
  };
};

exports.drawTriangle = drawTriangle;

var drawLine = function drawLine(context) {
  return function (strokeWidth, x1, y1, x2, y2) {
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
};

exports.drawLine = drawLine;

var drawThickLine = function drawThickLine(context) {
  return function (strokeWidth, x1, y1, x2, y2) {
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
};

exports.drawThickLine = drawThickLine;

var drawCircle = function drawCircle(context) {
  return function (strokeWidth, x, y, radius) {
    // context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false); // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();

    context.stroke();
  };
};

exports.drawCircle = drawCircle;

var drawParticleVectors = function drawParticleVectors(context) {
  return function (particle) {
    var vmult = 5;
    var amult = 100;
    var vel = 'green';
    var acc = 'yellow';
    var vVector = particle.vVector;
    var aVector = particle.aVector;
    context.strokeStyle = (0, _tinycolor.default)(vel).toRgbString();
    drawLine(context)(1, particle.x, particle.y, particle.x + vVector.x * vmult, particle.y + vVector.y * vmult);
    context.strokeStyle = (0, _tinycolor.default)(acc).toRgbString();
    drawLine(context)(1, particle.x, particle.y, particle.x + aVector.x * amult, particle.y + aVector.y * amult);
  };
}; // Spikes is an array of angles


exports.drawParticleVectors = drawParticleVectors;

var drawSpikeCircle = function drawSpikeCircle(context) {
  return function (_ref6, spikes) {
    var x = _ref6.x,
        y = _ref6.y,
        radius = _ref6.radius,
        color = _ref6.color;
    var spikeLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var circleStroke = 1;
    var spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false); // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();

    context.stroke();

    for (var s = 0; s < spikes.length; s++) {
      var pointA = (0, _math.pointOnCircle)(x, y, radius, spikes[s]);
      var pointB = (0, _math.pointOnCircle)(x, y, radius + spikeLength, spikes[s]);
      context.strokeStyle = color.toRgbString();
      drawLine(context)(spikeStroke, pointA.x, pointA.y, pointB.x, pointB.y);
    }
  };
};

exports.drawSpikeCircle = drawSpikeCircle;

var connectParticles = function connectParticles(context) {
  return function (pArray, proximity) {
    var useAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var len = pArray.length;

    for (var a = 0; a < len; a++) {
      // all consecutive particles
      for (var b = a; b < len; b++) {
        var pA = pArray[a];
        var pB = pArray[b];
        var distance = (0, _math.pointDistance)(pA, pB);

        if (distance < proximity) {
          var pColor = pA.color;

          if (useAlpha) {
            pColor.setAlpha((0, _math.normalizeInverse)(0, proximity, distance));
          }

          context.strokeStyle = pColor.toHslString();
          drawLine(context)(0.5, pA.x, pA.y, pB.x, pB.y);
        }
      }
    }

    resetStyles(context);
  };
};

exports.connectParticles = connectParticles;

var drawPointTrail = function drawPointTrail(context) {
  return function (particle) {
    var trailLen = particle.xHistory.length;
    context.lineWidth = particle.radius;
    var pColor = particle.color;
    var aFade = 100 / trailLen * 0.01;
    var alpha = 1;
    var sFade = particle.radius * 2 / trailLen;
    var stroke = particle.radius * 2;

    for (var i = 0; i < trailLen; i++) {
      var startX = i === 0 ? particle.x : particle.xHistory[i - 1];
      var startY = i === 0 ? particle.y : particle.yHistory[i - 1];
      drawLine(context)(stroke, startX, startY, particle.xHistory[i], particle.yHistory[i]);
      pColor.setAlpha(alpha);
      context.strokeStyle = pColor.toRgbString();
      alpha -= aFade;
      stroke -= sFade;
    } //

  };
};

exports.drawPointTrail = drawPointTrail;

var drawMouse = function drawMouse(context) {
  return function (_ref7) {
    var x = _ref7.x,
        y = _ref7.y,
        radius = _ref7.radius;
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
  };
};

exports.drawMouse = drawMouse;

var drawAttractor = function drawAttractor(context) {
  return function (_ref8, mode, radius) {
    var x = _ref8.x,
        y = _ref8.y,
        mass = _ref8.mass,
        g = _ref8.g;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(0,0,0,.1)';
    context.fill();
    context.beginPath();
    context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
    context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
    context.fill();
  };
};

exports.drawAttractor = drawAttractor;
},{"tinycolor2":"node_modules/tinycolor2/tinycolor.js","./math":"scripts/lib/math.js"}],"scripts/lib/sketch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sketch = void 0;

var _canvas = require("./canvas");

/*
Convenience canvas sketch runner. Based on p5js


const variation = () => {
    const config = {};

    const setup = (canvas, context) => {
        // create initial state
    };

    // will run every frame
    const draw = (canvas, context, mouse) => {
        // draw on every frame
        return 1; // -1 to exit animation loop
    };

    return {
        config,
        setup,
        draw,
    };
};
*/
var sketch = function sketch() {
  var mouse = {
    x: undefined,
    y: undefined,
    isDown: false,
    radius: 100
  };
  var fps = 0;
  var currentVariation;
  var canvasSizeFraction = 0.85;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.width = window.innerWidth * canvasSizeFraction;
  canvas.height = window.innerHeight * canvasSizeFraction;

  var getCanvas = function getCanvas(_) {
    return canvas;
  };

  var getContext = function getContext(_) {
    return context;
  };

  var getMouse = function getMouse(_) {
    return mouse;
  };

  var mouseDown = function mouseDown(evt) {
    mouse.isDown = true;
  };

  var mouseMove = function mouseMove(evt) {
    var canvasFrame = canvas.getBoundingClientRect();
    mouse.x = evt.x - canvasFrame.x;
    mouse.y = evt.y - canvasFrame.y;
  };

  var mouseUp = function mouseUp(evt) {
    mouse.isDown = false;
  };

  var mouseOut = function mouseOut(evt) {
    mouse.x = undefined;
    mouse.y = undefined;
    mouse.isDown = false;
  };

  var windowResize = function windowResize(evt) {
    return (0, _canvas.resizeCanvas)(canvas, window.innerWidth * canvasSizeFraction, window.innerHeight * canvasSizeFraction);
  };

  window.addEventListener('mousedown', mouseDown);
  window.addEventListener('touchstart', mouseDown);
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('touchmove', mouseMove);
  window.addEventListener('mouseup', mouseUp);
  window.addEventListener('touchend', mouseUp);
  window.addEventListener('mouseout', mouseOut);
  window.addEventListener('touchcancel', mouseOut);
  window.addEventListener('resize', windowResize);

  var run = function run(variation) {
    currentVariation = variation;
    var backgroundColor = '0,0,0';

    if (variation.hasOwnProperty('config')) {
      var config = variation.config;
      console.log('Sketch config:', variation.config);

      if (config.width && config.height) {
        window.removeEventListener('resize', windowResize);
        (0, _canvas.resizeCanvas)(canvas, config.width, config.height);
      }

      if (config.background) {
        backgroundColor = config.background;
      }

      if (config.fps) {
        fps = config.fps;
      }
    }

    var rendering = true;
    var targetFpsInterval = 1000 / fps;
    var lastAnimationFrameTime;

    var startSketch = function startSketch() {
      window.removeEventListener('load', startSketch);
      variation.setup(canvas, context); // fillCanvas(canvas, context)(1,backgroundColor);

      var render = function render() {
        var result = variation.draw(canvas, context, mouse);

        if (result !== -1) {
          requestAnimationFrame(render);
        }
      }; // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe


      var renderAtFps = function renderAtFps() {
        if (rendering) {
          requestAnimationFrame(renderAtFps);
        }

        var now = Date.now();
        var elapsed = now - lastAnimationFrameTime;

        if (elapsed > targetFpsInterval) {
          lastAnimationFrameTime = now - elapsed % targetFpsInterval;
          var result = variation.draw(canvas, context, mouse);

          if (result === -1) {
            rendering = false;
          }
        }
      };

      if (!fps) {
        requestAnimationFrame(render);
      } else {
        lastAnimationFrameTime = Date.now();
        requestAnimationFrame(renderAtFps);
      }
    };

    window.addEventListener('load', startSketch);
  };

  return {
    canvas: getCanvas,
    context: getContext,
    mouse: getMouse,
    run: run
  };
};

exports.sketch = sketch;
},{"./canvas":"scripts/lib/canvas.js"}],"scripts/forcesDev.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forcesDev = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var _vector = require("./lib/vector");

var forcesDev = function forcesDev() {
  var config = {
    width: 700,
    height: 700 // fps: 30,

  };
  var numParticles = 10;
  var particlesArray = [];
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas); // props.color = 'white';
      // props.mass = 1;

      props.radius = Math.sqrt(props.mass) * 10;
      props.y = 0;
      props.velocityX = 0;
      props.velocityY = 0;
      particlesArray.push(new _particle.Particle(props));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.5
    });
    (0, _canvas.drawRect)(context)(0, canvas.height / 2, canvas.width, canvas.height / 2, 'rgba(255,255,255,.1');

    for (var i = 0; i < numParticles; i++) {
      var gravity = new _vector.Vector(0, 0.25);
      var wind = new _vector.Vector(1, 0);
      var weight = gravity.mult(particlesArray[i].mass);

      if (mouse.isDown) {
        (0, _particle.applyForce)(wind, particlesArray[i]);
      }

      (0, _particle.applyForce)(weight, particlesArray[i]);

      if (particlesArray[i].y + particlesArray[i].radius >= canvas.height) {
        (0, _particle.friction)(particlesArray[i]);
      }

      if (particlesArray[i].y + particlesArray[i].radius >= canvas.height / 2) {
        (0, _particle.drag)(particlesArray[i]);
      }

      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawTestPoint, particlesArray[i]);
      (0, _canvas.drawParticleVectors)(context)(particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.forcesDev = forcesDev;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js","./lib/vector":"scripts/lib/vector.js"}],"scripts/forcesDevGravity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forcesDevGravity = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var forcesDevGravity = function forcesDevGravity() {
  var config = {// width: 700,
    // height: 700,
    // fps: 30,
  };
  var numParticles = 50;
  var particlesArray = [];
  var attractor = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    mass: 100,
    g: 20
  };
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.radius = Math.sqrt(props.mass);
      particlesArray.push(new _particle.Particle(props));
    }
  }; // const targetX = mouse.x ? mouse.x : canvas.width / 2;
  // const targetY = mouse.y ? mouse.y : canvas.height / 2;
  // accelerateToPoint(targetX, targetY, particlesArray[i]);
  // https://www.youtube.com/watch?v=T84AWnntxZA
  // const accelerateToPoint = (targetX, targetY, particle) => {
  //     const magnitude = 0.001;
  //     const vLimit = 5;
  //     const accX = ((targetX - particle.x) * magnitude) / particle.mass;
  //     const accY = ((targetY - particle.y) * magnitude) / particle.mass;
  //     particle.velocityX += accX;
  //     particle.velocityY += accY;
  //     particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
  //     particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
  // };


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.01
    });
    var mode = 1;
    attractor.x = mouse.x ? mouse.x : canvasCenterX;
    attractor.y = mouse.y ? mouse.y : canvasCenterY;

    for (var i = 0; i < numParticles; i++) {
      if (mouse.isDown) {
        mode = -1;
      } else {
        mode = 1;
      }

      (0, _particle.attract)(attractor, particlesArray[i], mode, 2000);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(20);
      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawRake, particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.forcesDevGravity = forcesDevGravity;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/test-grid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testGrid = void 0;

var _math = require("./lib/math");

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var testGrid = function testGrid() {
  var config = {// width: 500,
    // height: 500,
    // fps: 24,
  };
  var numParticles;
  var particlesArray = [];
  var gridPoints = [];
  var hue = 0;
  var attractorDist;
  var leftattractor;
  var midattractor;
  var rightattractor;
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;
    attractorDist = canvas.width / 0.7;
    leftattractor = {
      x: 0,
      y: canvas.height / 2,
      mass: 10,
      g: 3
    };
    midattractor = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      mass: 50,
      g: 10
    };
    rightattractor = {
      x: canvas.width,
      y: canvas.height / 2,
      mass: 10,
      g: 3
    };
    gridPoints = (0, _math.createGridPoints)(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50);
    numParticles = gridPoints.length;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.x = gridPoints[i][0];
      props.y = gridPoints[i][1];
      props.velocityX = 0;
      props.velocityY = 0;
      props.mass = 1;
      props.radius = 1; // randomNumberBetween(10, 30);

      props.spikes = (0, _math.createRandomNumberArray)(20, 0, 360);
      var h = (0, _math.lerpRange)(0, canvas.width, 0, 90, props.x);
      var s = 100; // lerpRange(0,10,0,100,prop.radius);

      var l = 50; // lerpRange(0,10,25,75,prop.radius);

      props.color = "hsla(".concat(h, ",").concat(s, "%,").concat(l, "%,0.1)"); // props.color = { r: 0, g: 0, b: 0, a: 0.1 };

      particlesArray.push(new _particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)('white');
  };

  var draw = function draw(canvas, context, mouse) {
    // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
    // let mode = 1;
    // attractor.x = mouse.x ? mouse.x : canvasCenterX;
    // attractor.y = mouse.y ? mouse.y : canvasCenterY;
    for (var i = 0; i < numParticles; i++) {
      // if (mouse.isDown) {
      //     mode = -1;
      // } else {
      //     mode = 1;
      // }
      (0, _particle.attract)(leftattractor, particlesArray[i], -1, attractorDist);
      (0, _particle.attract)(midattractor, particlesArray[i], 1, attractorDist);
      (0, _particle.attract)(rightattractor, particlesArray[i], -1, attractorDist);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(10);
      (0, _particle.updatePosWithVelocity)(particlesArray[i]); // edgeBounce(canvas, particlesArray[i]);
      // edgeWrap(canvas, particlesArray[i]);

      (0, _canvas.drawPoint)(context)(particlesArray[i]); // drawSpikeCircle(context)(particlesArray[i], particlesArray[i].props.spikes);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50, false); // drawAttractor(context)(leftattractor, -1, attractorDist);
    // drawAttractor(context)(midattractor, 1, attractorDist);
    // drawAttractor(context)(rightattractor, -1, attractorDist);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.testGrid = testGrid;
},{"./lib/math":"scripts/lib/math.js","./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"hi1.png":[function(require,module,exports) {
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGd2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NjQ4LCAyMDIxLzAxLzEyLTE1OjUyOjI5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDItMThUMDg6MzY6MDEtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDItMThUMDg6MzY6MDEtMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAyLTE4VDA4OjM2OjAxLTA1OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEwM2Q0MzgxLWI4YzUtNDU3Yy1hZDBjLWZkYmQwZjk5MGI0MyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRjM2VmZDIzLTQzYTAtOTM0Mi1iN2M1LWQ5YzA5N2IxNDBiOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY3N2Q4MDE4LTEwNzQtNDIxNC1hNDFlLWNkNzBjYTkzZDdjYiIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Njc3ZDgwMTgtMTA3NC00MjE0LWE0MWUtY2Q3MGNhOTNkN2NiIiBzdEV2dDp3aGVuPSIyMDIxLTAyLTE4VDA4OjM2OjAxLTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YTAzZDQzODEtYjhjNS00NTdjLWFkMGMtZmRiZDBmOTkwYjQzIiBzdEV2dDp3aGVuPSIyMDIxLTAyLTE4VDA4OjM2OjAxLTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJIaSIgcGhvdG9zaG9wOkxheWVyVGV4dD0iSGkiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlAvRF4AAAOqSURBVHic7duxS+tAHAfw6+NtDh0KRaEgVAy4VBAyiUuk0L9AgqsFBwcHoZuLDk7NIh0K6apBwcUlpZLJuohIXIKBBopdLCgIydw3BEop+Hp3aZMm/X6mKve7u37JlV6TIwQAAAAAAAAAAAAAAGYhFfUEpuz09HR1dVUUxeF/XNe1LOvh4UHTtAgnNl9UVXVdd/A70zSPjo6inmbUBEHodDr/iWnUzc1N1PONFH1SPlVVo55yRKrVKlNSg8HAdV1BEKKeeBRM02QNi/vi+kPTSFVVjgmN6nQ6ox8Wsiy32+3Pz0+mTkzTrFarY3MrFAocbzuXy3FUUWm32wHD8g3fqq7r3J1IkjQ6N75OTNPkyIHqyrq8vOz3+xy9j0mn0/6LlZUV7k42NjZG//Q8j6OT5+dnjiqqsDRN29nZaTabHAPM2uPjI0dVt9vlqKIKixBi23apVJrDvO7v71lL+v3++fk5x1i0YflKpdJU1uMU1Wq129tb+vae5x0fH/ONxRYWIeT19ZVvpNnZ29trNBo0LR3HKZfL3JtE5rB6vR7fSDNVLpd3d3ebzeZvn/eO4yiKsra2FmQ7/Ze7ct4YhmEYBiFEluVMJpPP59PpdLfb/f7+brVatm0HHyI5YQ3N7qcY5mW4yGJ5ZQmCUKlUgvRwdXXlr1kmsQyrWCweHBwE6UEUxc3NTdaqWC5Dy7L4djlDfNvvWIZlGMbW1tbT01PI48YyLEKIbdvb29shb7/iGpYv5O1XvMMiXBtpbrEPK8y9auzDChPCYhDql1JRFP3bKsvLy2GOOy2hhlUoFPi+Dc4JLEMGCItBqGE1Go1UKpVKpd7e3sIcd1pwZTFAWAwQFgOExQBhMUBYDBAWA4TFIJZ3d6ZIEIRisUgIqdVqExsveliVSsW/q/b19TXxVvaiL8Phw6WZTGZi40UPa319nb5x7JehZVl8hZIk9Xq9fD5PXxL7sDgeWfBdX1+P/tlqtSaWJGEZOo7DUZXNZrPZrP/a8zyaB7iSENbLy0vAHigfi09CWHd3dwF70HWdplkSwtI0LchPr/RPeichLELIxcUFd+3Z2Rlly4SEpWmaoigchYqi0Gx0fKF+dfj5+fFfuK7L3clvX6xOTk4IIYeHh0tLSzT9eJ5Xr9f9qlkRBIHviJ9pmsMjkbIss56f8008tCtJEs2RM13Xx06X0Uja6XufJEn7+/u5XG7s+Nn7+/vHx0e9Xp/KY/EAAAAAAAAAAAAAAAAAAPA//wDG+qdJedjgoAAAAABJRU5ErkJggg==";
},{}],"scripts/hiImage01.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hiImage01 = void 0;

var _hi = _interopRequireDefault(require("../hi1.png"));

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var _particle = require("./lib/particle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var hiImage01 = function hiImage01(_) {
  var config = {
    width: 600,
    height: 600
  };
  var numParticles = 2000;
  var imageSize = 100; // square

  var imageZoomFactor;
  var png = new Image();
  png.src = _hi.default;
  var particlesArray = [];
  var imageData;
  var imageColorData;
  var cropColor = 255 / 2;

  var createColorArrayFromImageData = function createColorArrayFromImageData(imageData) {
    var data = [];

    for (var y = 0, height = imageData.height; y < height; y++) {
      for (var x = 0, width = imageData.width; x < width; x++) {
        data.push(_objectSpread({
          x: x,
          y: y
        }, (0, _canvas.getImageColor)(imageData, x, y)));
      }
    }

    return data;
  };

  var setup = function setup(canvas, context) {
    imageData = (0, _canvas.getImageDataFromImage)(context)(png);
    (0, _canvas.clearCanvas)(canvas, context)();
    imageZoomFactor = canvas.width / imageSize; // imageColorData = createColorArrayFromImageData(imageData);

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.radius = 5;
      props.color = 'black';

      if (i % 2) {
        props.x = 0;
      } else {
        props.x = canvas.width;
      } // const pxColor = getImageColor(
      //     imageData,
      //     Math.round(props.x / imageZoomFactor),
      //     Math.round(props.y / imageZoomFactor)
      // );
      // props.color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;


      particlesArray.push(new _particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)({
      r: 255,
      g: 255,
      b: 0
    });
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 255,
      g: 255,
      b: 0,
      a: 0.01
    });

    for (var i = 0; i < numParticles; i++) {
      (0, _particle.updatePosWithVelocity)(particlesArray[i]); // edgeBounce(canvas, particlesArray[i]);

      (0, _particle.edgeWrap)(canvas, particlesArray[i]);
      var pxColor = (0, _canvas.getImageColor)(imageData, Math.round(particlesArray[i].x / imageZoomFactor), Math.round(particlesArray[i].y / imageZoomFactor));

      if (pxColor.r > 250) {
        particlesArray[i].velocityX *= -1;
        particlesArray[i].velocityY *= -1;
      } // particlesArray[i].color = `rgb(${pxColor.r},${pxColor.g},${pxColor.b})`;
      // particlesArray[i].color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;


      (0, _canvas.drawSquare)(context)(particlesArray[i]);
    } // connectParticles(context)(particlesArray, 100, true);

  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.hiImage01 = hiImage01;
},{"../hi1.png":"hi1.png","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js","./lib/particle":"scripts/lib/particle.js"}],"scripts/variation1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation1 = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

// Based on https://www.youtube.com/watch?v=d620nV6bp0A
var variation1 = function variation1() {
  var numParticles = 100;
  var particlesArray = [];
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.radius = 5;
      particlesArray.push(new _particle.Particle(props));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)();

    for (var i = 0; i < numParticles; i++) {
      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _particle.avoidPoint)({
        radius: centerRadius,
        x: canvasCenterX,
        y: canvasCenterY
      }, particlesArray[i], 4);
      (0, _particle.attractPoint)(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
      (0, _canvas.drawPoint)(context)(particlesArray[i]);
      (0, _canvas.drawPointTrail)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 200);
    (0, _canvas.drawMouse)(context)(mouse);
  };

  return {
    setup: setup,
    draw: draw
  };
};

exports.variation1 = variation1;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/variation2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation2 = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
var variation2 = function variation2() {
  var config = {
    friction: 0.8,
    gravity: 1,
    decay: 0.05,
    tweenDamp: 0.1,
    margin: 50,
    intensity: 0,
    numParticles: 200
  };
  var particlesArray = [];

  var setup = function setup(canvas, context) {
    for (var i = 0; i < config.numParticles; i++) {
      particlesArray.push(new _particle.Particle((0, _particle.createRandomParticleValues)(canvas)));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.clearCanvas)(canvas, context)();

    for (var i = 0; i < config.numParticles; i++) {
      particlesArray[i].radius -= config.decay;

      if (particlesArray[i].radius <= 0) {
        var newValues = (0, _particle.createRandomParticleValues)(canvas);
        var newCoords = mouse;
        newValues.x = newCoords.x + (0, _math.randomNumberBetween)(-10, 10);
        newValues.y = newCoords.y + (0, _math.randomNumberBetween)(-10, 10);
        particlesArray[i].initValues(newValues);
      }

      particlesArray[i].y += particlesArray[i].mass * (mouse.isDown ? 1 : 0.2);
      particlesArray[i].mass += 0.2 * config.gravity;

      if (particlesArray[i].y + particlesArray[i].radius > canvas.height || particlesArray[i].y - particlesArray[i].radius < 0) {
        particlesArray[i].mass *= -1;
      }

      (0, _particle.avoidPoint)(mouse, particlesArray[i]); // attractPoint(psMouseCoords(), particlesArray[i]);

      (0, _canvas.drawPoint)(context)(particlesArray[i]); // drawPointTrail(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 100);
    (0, _canvas.drawMouse)(context)(mouse);
    return 1;
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation2 = variation2;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"domokun.png":[function(require,module,exports) {
module.exports = "/domokun.0afe23b8.png";
},{}],"scripts/domokun.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domokun = void 0;

var _domokun = _interopRequireDefault(require("../domokun.png"));

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var _particle = require("./lib/particle");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Based on https://www.youtube.com/watch?v=afdHgwn1XCY
var domokun = function domokun(_) {
  var config = {
    width: 600,
    height: 600
  };
  var numParticles;
  var imageSize = 100; // square

  var png = new Image();
  png.src = _domokun.default;
  var particlesArray = [];

  var setup = function setup(canvas, context) {
    var imageData = (0, _canvas.getImageDataFromImage)(context)(png);
    (0, _canvas.clearCanvas)(canvas, context)();
    var imageZoomFactor = canvas.width / imageSize;
    var cropColor = 255 / 2;

    for (var y = 0, height = imageData.height; y < height; y++) {
      for (var x = 0, width = imageData.width; x < width; x++) {
        var pxColor = (0, _canvas.getImageColor)(imageData, x, y);

        if (pxColor.a > cropColor) {
          var points = (0, _math.scalePointToCanvas)(canvas.width, canvas.height, imageData.width, imageData.height, imageZoomFactor, x, y);
          var pX = points.x;
          var pY = points.y;
          var mass = (0, _math.randomNumberBetween)(2, 12);
          var color = pxColor;
          var radius = imageZoomFactor;
          particlesArray.push(new _particle.Particle({
            x: pX,
            y: pY,
            mass: mass,
            color: color,
            radius: radius
          }));
        }
      }
    }

    numParticles = particlesArray.length;
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)('yellow');

    for (var i = 0; i < numParticles; i++) {
      (0, _particle.pointPush)(mouse, particlesArray[i], mouse.isDown ? -1 : 1);
      (0, _canvas.drawSquare)(context)(particlesArray[i]);
    } // drawMouse(context)(mouse);

  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.domokun = domokun;
},{"../domokun.png":"domokun.png","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js","./lib/particle":"scripts/lib/particle.js"}],"scripts/variation4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation4 = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var variation4 = function variation4() {
  var config = {
    numParticles: 0
  };
  var particlesArray = [];
  var circles = [];

  var setup = function setup(canvas, context) {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var diameter = canvas.height / 4;
    var steps = 10;

    for (var theta = 0; theta < 360; theta += steps) {
      var rad = theta * (Math.PI / 180);
      var x = Math.cos(rad) * diameter + centerX;
      var y = Math.sin(rad) * diameter + centerY;
      circles.push([x, y]);
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.x = x;
      props.y = y;
      props.radius = 1;
      props.color = {
        r: 0,
        g: 0,
        b: 0
      };
      props.index = circles.length - 1;
      particlesArray.push(new _particle.Particle(props));
    }

    config.numParticles = particlesArray.length;
    (0, _canvas.fillCanvas)(canvas, context)(1, '255,255,255');
  }; // will run every frame


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)(0.005, '255,255,255');

    for (var i = 0; i < config.numParticles; i++) {
      (0, _particle.pointPush)(mouse, particlesArray[i], mouse.isDown ? -1 : 5);
      (0, _canvas.drawPoint)(context)(particlesArray[i]); // let index = particlesArray[i].index + 1;
      // if(index === circles.length) {
      //     index = 0;
      // }
      // particlesArray[i].x = circles[index][0];
      // particlesArray[i].y = circles[index][1];
      // particlesArray.index = index;
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 200);
    return 1; // -1 to exit animation loop
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation4 = variation4;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/variation5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation5 = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

var variation5 = function variation5() {
  var config = {
    numParticles: 50
  };
  var particlesArray = [];
  var circles = [];

  var setup = function setup(canvas, context) {
    for (var i = 0; i < config.numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.x = canvas.width / 2;
      props.y = canvas.height / 2;
      props.color = {
        r: 0,
        g: 0,
        b: 0
      };
      props.radius = .5;
      particlesArray.push(new _particle.Particle(props));
    }

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var diameter = canvas.height / 4;
    var steps = 30;

    for (var theta = 0; theta < 360; theta += steps) {
      var rad = theta * (Math.PI / 180);
      var x = Math.cos(rad) * diameter + centerX;
      var y = Math.sin(rad) * diameter + centerY;
      circles.push([x, y, (0, _math.randomNumberBetween)(20, 100)]);
    }

    (0, _canvas.fillCanvas)(canvas, context)(1, '255,255,255');
  };

  var draw = function draw(canvas, context, mouse) {
    // fillCanvas(canvas, context)(.005,'255,255,255');
    for (var i = 0; i < config.numParticles; i++) {
      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);

      for (var c = 0; c < circles.length; c++) {
        (0, _particle.avoidPoint)({
          radius: circles[c][2],
          x: circles[c][0],
          y: circles[c][1]
        }, particlesArray[i], 4);
      }

      (0, _canvas.drawPoint)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.variation5 = variation5;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"scripts/variation6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variation6 = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var _math = require("./lib/math");

// Based on https://www.youtube.com/watch?v=j_BgnpMPxzM
var variation6 = function variation6() {
  var numParticles = 200;
  var particlesArray = [];
  var hue = 0;

  var setup = function setup(canvas, context) {
    for (var i = 0; i < numParticles; i++) {
      var initValues = (0, _particle.createRandomParticleValues)(canvas);
      initValues.color = {
        r: 255,
        g: 255,
        b: 255
      };
      particlesArray.push(new _particle.Particle(initValues));
    }
  };

  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.fillCanvas)(canvas, context)(.08);
    if (hue++ > 361) hue = 0;

    for (var i = 0; i < numParticles; i++) {
      particlesArray[i].radius -= 0.05;

      if (particlesArray[i].radius <= 0) {
        var initValues = (0, _particle.createRandomParticleValues)(canvas);
        initValues.x = mouse.x ? mouse.x : canvas.width / 2;
        initValues.y = mouse.y ? mouse.y : canvas.height / 2; // let h = lerpRange(0,canvas.width,100,200,initValues.x);

        var s = (0, _math.lerpRange)(0, 10, 0, 100, initValues.radius);
        var l = (0, _math.lerpRange)(0, 10, 25, 75, initValues.radius);
        initValues.color = "hsl(".concat(hue, ",").concat(s, "%,").concat(l, "%)");
        particlesArray[i].initValues(initValues);
      }

      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _particle.gravityPoint)()(canvas.width / 2, canvas.height, 2000, particlesArray[i]); // gravityPoint({x:canvas.width/2, y:canvas.height}, particlesArray[i])

      (0, _canvas.drawPoint)(context)(particlesArray[i]);
    } // connectParticles(context)(particlesArray, 100);


    return 1;
  };

  return {
    setup: setup,
    draw: draw
  };
};

exports.variation6 = variation6;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js","./lib/math":"scripts/lib/math.js"}],"scripts/rainbow-rake-orbit-mouse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rainbowRakeOrbit = void 0;

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var rainbowRakeOrbit = function rainbowRakeOrbit() {
  var config = {// width: 700,
    // height: 700,
    // fps: 30,
  };
  var numParticles = 50;
  var particlesArray = [];
  var attractor = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    mass: 100,
    g: 20
  };
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.radius = 1; // Math.sqrt(props.mass);

      particlesArray.push(new _particle.Particle(props));
    }
  }; // const targetX = mouse.x ? mouse.x : canvas.width / 2;
  // const targetY = mouse.y ? mouse.y : canvas.height / 2;
  // accelerateToPoint(targetX, targetY, particlesArray[i]);
  // https://www.youtube.com/watch?v=T84AWnntxZA
  // const accelerateToPoint = (targetX, targetY, particle) => {
  //     const magnitude = 0.001;
  //     const vLimit = 5;
  //     const accX = ((targetX - particle.x) * magnitude) / particle.mass;
  //     const accY = ((targetY - particle.y) * magnitude) / particle.mass;
  //     particle.velocityX += accX;
  //     particle.velocityY += accY;
  //     particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
  //     particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
  // };


  var draw = function draw(canvas, context, mouse) {
    (0, _canvas.background)(canvas, context)({
      r: 0,
      g: 0,
      b: 50,
      a: 0.01
    });
    var mode = 1;
    attractor.x = mouse.x ? mouse.x : canvasCenterX;
    attractor.y = mouse.y ? mouse.y : canvasCenterY;

    for (var i = 0; i < numParticles; i++) {
      if (mouse.isDown) {
        mode = -1;
      } else {
        mode = 1;
      }

      (0, _particle.attract)(attractor, particlesArray[i], mode, 2000);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(20);
      (0, _particle.updatePosWithVelocity)(particlesArray[i]);
      (0, _particle.edgeBounce)(canvas, particlesArray[i]);
      (0, _canvas.drawRotatedParticle)(context, _canvas.drawRake, particlesArray[i]);
      particlesArray[i].aVector = {
        x: 0,
        y: 0
      };
    }
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.rainbowRakeOrbit = rainbowRakeOrbit;
},{"./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/threeAttractors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.threeAttractors = void 0;

var _math = require("./lib/math");

var _particle = require("./lib/particle");

var _canvas = require("./lib/canvas");

var threeAttractors = function threeAttractors() {
  var config = {// width: 500,
    // height: 500,
    // fps: 24,
  };
  var numParticles;
  var particlesArray = [];
  var gridPoints = [];
  var hue = 0;
  var attractorDist;
  var leftattractor;
  var midattractor;
  var rightattractor;
  var canvasCenterX;
  var canvasCenterY;
  var centerRadius;

  var setup = function setup(canvas, context) {
    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;
    centerRadius = canvas.height / 4;
    attractorDist = canvas.width / 0.7;
    leftattractor = {
      x: 0,
      y: canvas.height / 2,
      mass: 10,
      g: 3
    };
    midattractor = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      mass: 50,
      g: 10
    };
    rightattractor = {
      x: canvas.width,
      y: canvas.height / 2,
      mass: 10,
      g: 3
    };
    gridPoints = (0, _math.createGridPoints)(canvas.width, canvas.height, 100, 100, canvas.width / 50, canvas.height / 50);
    numParticles = gridPoints.length;

    for (var i = 0; i < numParticles; i++) {
      var props = (0, _particle.createRandomParticleValues)(canvas);
      props.x = gridPoints[i][0];
      props.y = gridPoints[i][1];
      props.velocityX = 0;
      props.velocityY = 0;
      props.mass = 1;
      props.radius = 1; // randomNumberBetween(10, 30);

      props.spikes = (0, _math.createRandomNumberArray)(20, 0, 360);
      var h = (0, _math.lerpRange)(0, canvas.width, 0, 90, props.x);
      var s = 100; // lerpRange(0,10,0,100,prop.radius);

      var l = 50; // lerpRange(0,10,25,75,prop.radius);

      props.color = "hsla(".concat(h, ",").concat(s, "%,").concat(l, "%,0.1)"); // props.color = { r: 0, g: 0, b: 0, a: 0.1 };

      particlesArray.push(new _particle.Particle(props));
    }

    (0, _canvas.background)(canvas, context)('white');
  };

  var draw = function draw(canvas, context, mouse) {
    // background(canvas, context)({ r: 255, g: 255, b: 255, a: 0.001 });
    for (var i = 0; i < numParticles; i++) {
      (0, _particle.attract)(leftattractor, particlesArray[i], -1, attractorDist);
      (0, _particle.attract)(midattractor, particlesArray[i], 1, attractorDist);
      (0, _particle.attract)(rightattractor, particlesArray[i], -1, attractorDist);
      particlesArray[i].vVector = particlesArray[i].vVector.limit(10);
      (0, _particle.updatePosWithVelocity)(particlesArray[i]); // edgeBounce(canvas, particlesArray[i]);

      (0, _canvas.drawPoint)(context)(particlesArray[i]);
    }

    (0, _canvas.connectParticles)(context)(particlesArray, 50, false);
  };

  return {
    config: config,
    setup: setup,
    draw: draw
  };
};

exports.threeAttractors = threeAttractors;
},{"./lib/math":"scripts/lib/math.js","./lib/particle":"scripts/lib/particle.js","./lib/canvas":"scripts/lib/canvas.js"}],"scripts/index.js":[function(require,module,exports) {
"use strict";

var _normalize = _interopRequireDefault(require("normalize.css"));

var _sketch = require("./lib/sketch");

var _forcesDev = require("./forcesDev");

var _forcesDevGravity = require("./forcesDevGravity");

var _testGrid = require("./test-grid");

var _hiImage = require("./hiImage01");

var _variation = require("./variation1");

var _variation2 = require("./variation2");

var _domokun = require("./domokun");

var _variation3 = require("./variation4");

var _variation4 = require("./variation5");

var _variation5 = require("./variation6");

var _rainbowRakeOrbitMouse = require("./rainbow-rake-orbit-mouse");

var _threeAttractors = require("./threeAttractors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Explorations with generative code
*/
var s = (0, _sketch.sketch)();
var DEBUG = true;

var saveCanvasCapture = function saveCanvasCapture(_) {
  console.log('Saving capture');
  var imageURI = s.canvas().toDataURL('image/png');
  document.getElementById('download').href = imageURI;
};

document.getElementById('download').addEventListener('click', saveCanvasCapture);
window.addEventListener('keydown', function (e) {
  if (e.key === 's') {
    document.getElementById('download').click();
  }
});

var setNote = function setNote(note) {
  return document.getElementById('note').innerText = note;
};

var getQueryVariable = function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return false;
};

var variationKey = getQueryVariable('variation');
variationKey = variationKey || '1';
var variations = {
  1: {
    note: 'Particles are attracted to the pointer. Press to repel.',
    sketch: _variation.variation1
  },
  2: {
    note: 'Press to increase speed.',
    sketch: _variation2.variation2
  },
  3: {
    note: 'Particles are repelled from the pointer. Press to attract.',
    sketch: _domokun.domokun
  },
  4: {
    note: 'Particles are repelled from the pointer. Press to attract.',
    sketch: _variation3.variation4
  },
  5: {
    note: 'Sit back and watch.',
    sketch: _variation4.variation5
  },
  6: {
    note: 'Move the mouse',
    sketch: _variation5.variation6
  },
  7: {
    note: 'Rakes orbit center and the mouse. Click to repel.',
    sketch: _rainbowRakeOrbitMouse.rainbowRakeOrbit
  },
  8: {
    note: 'One attractor in the center, two on the sides.',
    sketch: _threeAttractors.threeAttractors
  }
};

if (variations.hasOwnProperty(variationKey) & !DEBUG) {
  var vToRun = variations[variationKey];
  setNote(vToRun.note);
  s.run(vToRun.sketch());
} else {
  setNote('Not a valid variation!');
}

if (DEBUG) {
  // s.run(forcesDev());
  // s.run(testGrid());
  s.run((0, _hiImage.hiImage01)());
}
},{"normalize.css":"node_modules/normalize.css/normalize.css","./lib/sketch":"scripts/lib/sketch.js","./forcesDev":"scripts/forcesDev.js","./forcesDevGravity":"scripts/forcesDevGravity.js","./test-grid":"scripts/test-grid.js","./hiImage01":"scripts/hiImage01.js","./variation1":"scripts/variation1.js","./variation2":"scripts/variation2.js","./domokun":"scripts/domokun.js","./variation4":"scripts/variation4.js","./variation5":"scripts/variation5.js","./variation6":"scripts/variation6.js","./rainbow-rake-orbit-mouse":"scripts/rainbow-rake-orbit-mouse.js","./threeAttractors":"scripts/threeAttractors.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62512" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/index.js"], null)
//# sourceMappingURL=/scripts.bcf3243b.js.map