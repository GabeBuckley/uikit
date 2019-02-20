// module "uikitUtility"
/* eslint-env es6 */

import uikitGUID from "uikitGUID/uikitGUID";

export default class uikitUtility {
    guid(){
        return new uikitGUID();
    }
}