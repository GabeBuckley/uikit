// module "uikitGUID"
/* eslint-env es6 */

import enums from "../../enums/enums";

export default class uikitGUID {
    
    constructor(){
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        this.value = "";
        this.status = enums.status.UNINITIALISED;
        this["generate"]();
    }
    
    ["generate"](){
        let blocks = [8,4,4,4,12];
        var strGUID = "";
        var blockArray = [];
        
        var createBlock = function(intLength){
            var charArray = [];
            for(let i = 0; i < intLength; i++){
                charArray.push(
                    this.chars.charAt(
                        Math.floor(
                            Math.random() * 10000
                        ) % this.chars.length
                    )
                );
            }
            return charArray.join('');
        };
        
        for(let i = 0; i < blocks.length; i++){
            blockArray.push(
                createBlock(blocks[i])
            );
        }
        
        strGUID = blockArray.join('-');
        this.value = strGUID;
        this.status = enums.status.INITIALISED;
        
    }

    get value(){
        return this.strGuid;
    }

    toString(){
        return this.value;
    }
}

