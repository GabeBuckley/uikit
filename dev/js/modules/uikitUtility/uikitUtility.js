// module "uikitUtility"
/* eslint-env es6 */
class uikitUtility {
    guid(){
        return new uikitGUID();
    }
}

module.exports.uikitUtility = uikitUtility;