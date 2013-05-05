var child_process = require('child_process');
var fs = require("fs");
var path = require("path");
/**
 * Ensures a directory exists using mkdir -p.
 *
 * @param {String} path
 * @param {Function} callback
 * @api public
 */

exports.ensureDir = ensureDir = function (dir, callback) {
    fs.exists(dir, function(exists){
        if (exists) return callback(null);
        var current = path.resolve(dir), parent = path.dirname(current);
        ensureDir(parent, function(err) {
            if (err) return callback(err);
            fs.mkdir(current, function(err){
                if (err && err.code != 'EEXIST') return callback(err);
                callback(null);
            });
        });
    });
};

/**
 * Wraps a callback with a message to print on success
 * (no error argument passed to it)
 *
 * @param {String} msg - the message to display on success
 * @param {Function} fn - the callback to wrap
 * @api public
 */

exports.announce = function (msg, fn) {
    return function (err) {
        if (err) {
            return fn.apply(this, arguments);
        }
        console.log(msg);
        return fn.apply(this, arguments);
    };
};

/**
 * Creates a deep-clone of a JSON-serializable object
 *
 * @param obj - the object to serialize
 * @api public
 */

exports.jsonClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Send a 302 (Found) redirect response for a HTTP Server
 * Request object
 */

exports.redirect = function (loc, res) {
    res.writeHead(302, {Location: loc});
    return res.end(
        '<html>' +
            '<head>' +
                '<title>302 Found</title>' +
            '</head>' +
            '<body>' +
                '<p>' +
                    'Found: <a href="' + loc + '">' + loc + '</a>' +
                '</p>' +
            '</body>' +
        '</html>'
    );
};

/**
 * Print a new line when processing a list of async functions. Only works for
 * iterators that rely on side effects (applyAll, series, parallel, each, etc),
 * as it doesn't return any value.
 */

exports.linebreak = function () {
    var callback = arguments[arguments.length-1];
    console.log('');
    return callback();
};
