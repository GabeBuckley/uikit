// module "uikitUtility"
/* eslint-env es6 */

import uikitGUID from "./uikitGUID/uikitGUID.js";
import uikitHTTP from "./uikitHTTP/uikitHTTP.js";


class uikitUtility {
	constructor() {

	}

	static guid() {
		return new uikitGUID();
	}

	static httpRequest(strMethod, strURL, fnCallback) {
		return uikitHTTP.request(strMethod, strURL, fnCallback);
	}

}

export default uikitUtility;