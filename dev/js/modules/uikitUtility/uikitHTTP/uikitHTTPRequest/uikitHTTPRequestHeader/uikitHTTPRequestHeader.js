// module "uikitHTTPRequestHeader"
/* eslint-env es6 */

export default class uikitHTTPRequestHeader {

	constructor(strHeader, strValue) {
		this._header = strHeader;
		this._value = strValue;
	}

	get header() {
		return this._header;
	}

	set header(strHeader) {
		this._header = strHeader
	}

	get value() {
		return this._value;
	}

	set value(strValue) {
		this._value = strValue
	}

}

if (typeof module != 'undefined') {
	module.exports.uikitHTTPRequestHeader = uikitHTTPRequestHeader;
}
