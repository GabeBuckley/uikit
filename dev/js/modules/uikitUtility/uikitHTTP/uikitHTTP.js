// module "uikitHTTP"
/* eslint-env es6 */

import uikitHTTPRequest from "./uikitHTTPRequest/uikitHTTPRequest.js";


export default class uikitHTTP {
	static request(strMethod, strURL, fnCallback) {
		return new uikitHTTPRequest(strMethod, strURL, fnCallback);
	}
}

if (typeof module != 'undefined') {
	module.exports.uikitHTTP = uikitHTTP;
}
