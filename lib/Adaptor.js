"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.certify = certify;
exports.getCertificateStream = getCertificateStream;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

var _formData = _interopRequireDefault(require("form-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @module Adaptor */
const {
  axios
} = _languageCommon.http;
exports.axios = axios;
exports.FormData = _formData.default;
/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @function
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */

function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  };
  return state => {
    return (0, _languageCommon.execute)(...operations)({ ...initialState,
      ...state
    });
  };
}
/**
 * Generate a DIVOC vaccine certificate
 * @public
 * @example
 * certify({preEnrollmentCode: "foo", name: "bar"})
 * @function
 * @param {object} params - data required to request the certificate
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */


function certify(params, callback) {
  return state => {
    params = (0, _languageCommon.expandReferences)(params)(state);
    const {
      baseUrl,
      token
    } = state.configuration;
    const url = `${baseUrl}/divoc/api/v1/certify`;
    const Authorization = `Bearer ${token}`;
    const config = {
      url,
      data: params,
      headers: {
        Authorization
      }
    };
    return _languageCommon.http.post(config)(state).then(response => {
      const nextState = { ...(0, _languageCommon.composeNextState)(state, response.data),
        response
      };
      if (callback) return callback(nextState);
      return nextState;
    });
  };
}
/**
 * Get the PDF of a generated certificate
 * @public
 * @example
 * getCertificate("foo");
 * @function
 * @param {string} id - the certificate identifier
 * @param {function} handler - callback function which takes a stream
 * @param {function} callback - (Optional) callback function which takes the result of the streamhandler
 * @returns {Operation}
 */


function getCertificateStream(id, handler, callback) {
  return state => {
    id = (0, _languageCommon.expandReferences)(id)(state);
    const {
      baseUrl,
      token
    } = state.configuration;
    const url = `${baseUrl}/cert/api/certificatePDF/${id}`;
    const Authorization = `Bearer ${token}`;
    const config = {
      url,
      headers: {
        Authorization
      },
      responseType: 'stream'
    };
    return _languageCommon.http.get(config)(state).then(response => handler(response.data)).then(response => {
      console.log('Handler finished. Got response:', response);
      const nextState = { ...(0, _languageCommon.composeNextState)(state, response.data),
        response
      };
      if (callback) return callback(nextState);
      return nextState;
    });
  };
}