// module "enums"
/* eslint-env es6 */

class enums {
    
    static get status(){
        return {
            UNINITIALISED: 1000,
            INITIALISED: 1001
        };
    }
}

module.exports.default = enums;