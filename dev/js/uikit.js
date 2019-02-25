// module "uikitUtility"
/* eslint-env es6 */
import uikitUtility from "./modules/uikitUtility/uikitUtility.js";

if (!window.uikit) {
	window.uikit = {
		util: new uikitUtility()
	};
}

/** ALIASES **/
uikit.req = uikit.util.httpRequest;
