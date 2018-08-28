if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        value: function (searchElement, fromIndex) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError("\"this\" is null or not defined");
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError("\"this\" is null or not defined");
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}

// https://tc39.github.io/ecma262/#sec-string.prototype.includes
if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, "includes", {
        value: function(search, start) {
            if (typeof start !== 'number') {
                start = 0;
              }

              if (start + search.length > this.length) {
                return false;
              } else {
                return this.indexOf(search, start) !== -1;
              }
            }
    });
}

var CanvasPrototype = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;
var hasBlobConstructor =
    window.Blob &&
    (function () {
        try {
            return Boolean(new Blob());
        } catch (e) {
            return false;
        }
    }());
var hasArrayBufferViewSupport =
    hasBlobConstructor &&
    window.Uint8Array &&
    (function () {
        try {
            return new Blob([new Uint8Array(100)]).size === 100;
        } catch (e) {
            return false;
        }
    }());
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/;
var dataURLtoBlob =
    (hasBlobConstructor || BlobBuilder) &&
    window.atob &&
    window.ArrayBuffer &&
    window.Uint8Array &&
    function (dataURI) {
        var matches, mediaType, isBase64, dataString, byteString, arrayBuffer, intArray, i, bb;
        // Parse the dataURI components as per RFC 2397
        matches = dataURI.match(dataURIPattern);
        if (!matches) {
            throw new Error("invalid data URI");
        }
        // Default to text/plain;charset=US-ASCII
        mediaType = matches[2] ? matches[1] : "text/plain" + (matches[3] || ";charset=US-ASCII");
        isBase64 = !!matches[4];
        dataString = dataURI.slice(matches[0].length);
        if (isBase64) {
            // Convert base64 to raw binary data held in a string:
            byteString = atob(dataString);
        } else {
            // Convert base64/URLEncoded data component to raw binary:
            byteString = decodeURIComponent(dataString);
        }
        // Write the bytes of the string to an ArrayBuffer:
        arrayBuffer = new ArrayBuffer(byteString.length);
        intArray = new Uint8Array(arrayBuffer);
        for (i = 0; i < byteString.length; i += 1) {
            intArray[i] = byteString.charCodeAt(i);
        }
        // Write the ArrayBuffer (or ArrayBufferView) to a blob:
        if (hasBlobConstructor) {
            return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {type: mediaType});
        }
        bb = new BlobBuilder();
        bb.append(arrayBuffer);
        return bb.getBlob(mediaType);
    };
if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
    if (CanvasPrototype.mozGetAsFile) {
        CanvasPrototype.toBlob = function (callback, type, quality) {
            if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
                callback(dataURLtoBlob(this.toDataURL(type, quality)));
            } else {
                callback(this.mozGetAsFile("blob", type));
            }
        };
    } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
        CanvasPrototype.toBlob = function (callback, type, quality) {
            callback(dataURLtoBlob(this.toDataURL(type, quality)));
        };
    }
}
if (typeof define === "function" && define.amd) {
    define(function () {
        return dataURLtoBlob;
    });
} else if (typeof module === "object" && module.exports) {
    module.exports = dataURLtoBlob;
} else {
    window.dataURLtoBlob = dataURLtoBlob;
}
