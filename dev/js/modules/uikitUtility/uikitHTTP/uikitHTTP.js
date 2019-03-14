// module "uikitHTTP"
/* eslint-env es6 */

import uikitHTTPRequest from "./uikitHTTPRequest/uikitHTTPRequest.js";


class uikitHTTP {
	static request(strMethod, strURL, fnCallback) {
		return new uikitHTTPRequest(strMethod, strURL, fnCallback);
	}
}

export default uikitHTTP;

