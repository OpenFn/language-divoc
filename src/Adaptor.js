/** @module Adaptor */
import {
  execute as commonExecute,
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

import FormData from 'form-data';

const { axios } = http;
exports.axios = axios;
exports.FormData = FormData;

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
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return state => {
    return commonExecute(...operations)({
      ...initialState,
      ...state,
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
export function certify(params, callback) {
  return state => {
    params = expandReferences(params)(state);

    const { baseUrl, token } = state.configuration;

    const url = `${baseUrl}/divoc/api/v1/certify`;
    const Authorization = `Bearer ${token}`;

    const config = {
      url,
      data: params,
      headers: { Authorization },
    };

    return http
      .post(config)(state)
      .then(response => {
        const nextState = {
          ...composeNextState(state, response.data),
          response,
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
export function getCertificateStream(id, handler, callback) {
  return state => {
    id = expandReferences(id)(state);

    const { baseUrl, token } = state.configuration;

    const url = `${baseUrl}/cert/api/certificatePDF/${id}`;
    const Authorization = `Bearer ${token}`;

    const config = {
      url,
      headers: { Authorization },
      responseType: 'stream',
    };

    return http
      .get(config)(state)
      .then(response => handler(response.data))
      .then(response => {
        console.log('Handler finished. Got response:', response);
        const nextState = {
          ...composeNextState(state, response.data),
          response,
        };

        if (callback) return callback(nextState);
        return nextState;
      });
  };
}

export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  http,
  lastReferenceValue,
  merge,
  sourceValue,
} from '@openfn/language-common';
