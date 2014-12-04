/**
 * Expose it.
 */
module.exports = Range();

/**
 * Range parser.
 * @returns {Range}
 * @constructor
 */
function Range(){
  if (!(this instanceof Range)) {
    return new Range();
  }

  // default options.
  this.options = {
    min: Number.MIN_VALUE,
    max: Number.MAX_VALUE,
    res: {
      range  : /^[\s\d\-~,]+$/,
      blank  : /\s+/g,
      number : /^\-?\d+$/,
      min2num: /^~\-?\d+$/,
      num2max: /^\-?\d+~$/,
      num2num: /^\-?\d+~\-?\d+$/
    }
  };

  Object.freeze(this.options);
}

/**
 * Parse range from a string.
 * @param {String} str
 * @returns {*}
 */
Range.prototype.parse = function(str){
  var opts = this.options;

  // make sure is a range string.
  if (!opts.res.range.test(str)) {
    throw new Error('Can not parse an invalid string.');
  }

  var rg = [];
  // remove blanks and split by `,`
  str.replace(opts.res.blank, '').split(',').forEach(function(s){
    if(s.length == 0){
      return;
    }

    var ret = null;
    // Parse string by a matched parser.
    ['number', 'min2num', 'num2max', 'num2num'].some(function(n, i){
      var matched = opts.res[n].test(s);
      matched && (ret = Range.parser[n](s, opts));
      return matched;
    });

    ret && rg.push(ret);
  });

  // nothing be found.
  if(rg.length == 0){
    return rg;
  }

  // merge overlapped ranges
  return this._merge(rg.sort(function(r1, r2){
    return r1[0] - r2[0];
  }));
};

/**
 * Merge overlapped ranges.
 * @param {Array} rg
 * @returns {Array}
 * @private
 */
Range.prototype._merge = function(rg){
  var n = 0, len = rg.length;
  for (var i = 1; i < len; ++i) {
    // continue loop if the next minimum is greater than the previous maximum.
    if (rg[i][0] > rg[n][1] + 1) {
      n = i;
      continue;
    }
    // merge ranges.
    if (rg[n][1] < rg[i][1]) {
      rg[n][1] = rg[i][1];
    }
    rg[i] = null;
  }

  var ret = [];

  // wrap output array.
  rg.forEach(function(r){
    r && ret.push(r[0] == r[1] ? r[0] : r);
  });

  return ret;
};

/**
 * Parsers.
 * @type {{number: Function, min2num: Function, num2max: Function, num2num: Function}}
 */
Range.parser = {
  /**
   * A number, e.g.: 12,3,4
   * @param {String} s
   * @returns {*[]}
   */
  number : function(s){
    var d = parseFloat(s);
    return [d, d];
  },
  /**
   * String like `~13`, `~100`, it means a range from minimum to a specific number.
   * @param {String} s
   * @param {Object} opts
   * @returns {*[]}
   */
  min2num: function(s, opts){
    return [opts.min, parseFloat(s.substr(1))];
  },
  /**
   * String like `1~`, `5~`, it means a range from a specific number to maximum.
   * @param {String} s
   * @param {Object} opts
   * @returns {*[]}
   */
  num2max: function(s, opts){
    return [parseFloat(s.slice(0, -1)), opts.max]
  },
  /**
   * String like `1~2`, `5~8`, it means a range from a specific number to another.
   * @param {String} s
   * @param {Object} opts
   * @returns {*}
   */
  num2num: function(s, opts){
    var r = s.split('~').map(function(d){
      return parseFloat(d);
    });
    // number at position 1 must greater than position 0.
    if (r[0] > r[1]) {
      return r.reverse();
    }
    return r;
  }
};