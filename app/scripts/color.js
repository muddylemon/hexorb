var Colors = (function() {

  return {
    get: function(n, d) {
      var a = [];
      for (; n > 0; n--) {
        a.push(this.fresh(a, d));
      }
      return a;
    },
    hex2rgb: function(hex) {
      if (Array.isArray(hex)) {
        return hex;
      }

      var h = parseInt(hex.toString().replace('#', ''), 16);
      return [(h & (255 << 16)) >> 16, (h & (255 << 8)) >> 8, h & 255];
    },
    rgb2hex: function(rgb) {

      function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
      }

      return toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);

    },

    absorb: function(a, b) {

      return [
        scoot(a[0], b[0]),
        scoot(a[1], b[1]),
        scoot(a[2], b[2])
      ];

      /**
       * push the number X% closer to the other one
       * return the result (between 0 and 255)
       */
      function scoot(a, b) {
        var diff = Math.ceil(a);
        if (a < b) {
          diff = Math.floor(b - ((b - a) * .04));
        }
        if (a > b) {
          diff = Math.ceil(b + ((a - b) * .04));
        }
        return Math.min(255, Math.max(0, diff));
      }

    },
    distance: function(a, b) {
      var d = [a[2] - b[0], a[1] - b[1], a[2] - b[2]];
      return Math.sqrt((d[0] * d[0]) + (d[1] * d[1]) + (d[2] * d[2]));
    },
    fresh: function(sofar, d) {
      var n, ok;
      while (true) {
        ok = true;
        n = Math.random() * 0xFFFFFF << 0;
        for (var c in sofar) {
          if (this.distance(this.hex2rgb(sofar[c]), this.hex2rgb(n)) < d) {
            console.log(this.distance(this.hex2rgb(sofar[c]), this.hex2rgb(n)));
            
            ok = false;
            break;
          }
        }
        if (ok) {
          return this.hex2rgb(n);
        }
      }
    }

  }


  function lab2rgb(lab) {
    var y = (lab[0] + 16) / 116,
      x = lab[1] / 500 + y,
      z = y - lab[2] / 200,
      r, g, b;

    x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
    y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
    z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);

    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
    g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
    b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;

    return [Math.max(0, Math.min(1, r)) * 255,
      Math.max(0, Math.min(1, g)) * 255,
      Math.max(0, Math.min(1, b)) * 255
    ]
  }


  function rgb2lab(rgb) {
    var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      x, y, z;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
    y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
    z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
  }

  // calculate the perceptual distance between colors in CIELAB
  // https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

  function distance(labA, labB) {
    return deltaE(labA, labB);

    return i < 0 ? 0 : Math.sqrt(i);
  }

  // returns the sum of the squares of
  function labSq(lab) {
    return Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2])
  }

  function deltaL(a, b) {
    return a[0] - b[0];
  }

  function deltaA(a, b) {
    return a[1] - b[1];
  }

  function deltaB(a, b) {
    return a[2] - b[2];
  }

  // the difference between the sum of the squares of a[1,2] and b[1,2]
  function deltaC(a, b) {
    return labSq(a) - labSq(b);
  }

  function deltaH(a, b) {
    var dA = deltaA(a, b),
      dB = deltaB(a, b),
      dC = deltaC(a, b),
      h = (dA * dA) + (dB * dB) - (dC * dC);
    return h < 0 ? 0 : Math.sqrt(h);
  }


  function deltaE(labA, labB) {
    var deltaL = labA[0] - labB[0];
    var deltaA = labA[1] - labB[1];
    var deltaB = labA[2] - labB[2];
    var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    var deltaC = c1 - c2;
    var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    var sc = 1.0 + 0.045 * c1;
    var sh = 1.0 + 0.015 * c1;
    var deltaLKlsl = deltaL / (1.0);
    var deltaCkcsc = deltaC / (sc);
    var deltaHkhsh = deltaH / (sh);
    var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }



}());

// practice absorbing

// var a = Colors.hex2rgb(0x00FF00),
//   b = Colors.hex2rgb(0x000044),
//   res = [];
//
//
// for (var i = 0; i < 440; i++) {
//   b = Colors.absorb(a, b);
//   res.push('<div class="winko" style="background-color:rgb(' + b.toString(16) + ');">' + i + '</div>');
// }
//
// $("html").prepend(res);
