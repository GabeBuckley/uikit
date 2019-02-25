// module "uikitGUID"
/* eslint-env es6 */

import enums from "../../enums/enums.js";


export default class uikitGUID {

	constructor() {
		this.arrChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
		this.strGuid = null;
		this.blStatus = enums.status.UNINITIALISED;
		this["generate"]();
	}

    ["generate"]() {
		let blocks = [8, 4, 4, 4, 12];
		var strGUID = "";
		var blockArray = [];

		var _self = this;

		var createBlock = function (intLength) {
			var charArray = [];
			for (let i = 0; i < intLength; i++) {
				charArray.push(
					_self.arrChars.charAt(
						Math.floor(
							Math.random() * 10000
						) % _self.arrChars.length
					)
				);
			}
			return charArray.join('');
		};

		for (let i = 0; i < blocks.length; i++) {
			blockArray.push(
				createBlock(blocks[i])
			);
		}

		strGUID = blockArray.join('-');
		this.strGuid = strGUID;
		this.blStatus = enums.status.INITIALISED;
	}

	get value() {
		return this.strGuid;
	}

	toString() {
		return this.value;
	}

	get status() {
		return this.blStatus;
	}
}

if (typeof module != 'undefined') {
	module.exports.uikitGUID = uikitGUID;
}
