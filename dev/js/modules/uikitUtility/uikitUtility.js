// module "uikitUtility"
/* eslint-env es6 */

import uikitGUID from "./uikitGUID/uikitGUID.js";
import uikitHTTP from "./uikitHTTP/uikitHTTP.js";


export default class uikitUtility {
	constructor() {

	}

	guid() {
		return new uikitGUID();
	}

	httpRequest(strMethod, strURL, fnCallback) {
		return uikitHTTP.request(strMethod, strURL, fnCallback);
	}

}

if (typeof module != 'undefined') {
	module.exports.uikitUtility = uikitUtility;
}
