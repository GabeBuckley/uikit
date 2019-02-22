// module "uikitUtility"
/* eslint-env es6 */
import enums from "./modules/enums/enums.js";
import uikitGUID from "./modules/uikitUtility/uikitGUID/uikitGUID.js";
import uikitUtility from "./modules/uikitUtility/uikitUtility.js";

if(!window.uikit){
    window.uikit = {
        util: new uikitUtility() 
    };
}

