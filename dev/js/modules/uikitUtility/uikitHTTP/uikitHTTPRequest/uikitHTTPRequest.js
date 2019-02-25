// module "uikitHTTP"
/* eslint-env es6 */

import uikitHTTPRequestHeader from "./uikitHTTPRequestHeader/uikitHTTPRequestHeader.js";

export default class uikitHTTPRequest {

	constructor(strMethod, strURL, fnCallback) {
		this._request = new XMLHttpRequest();

		this._method = strMethod;
		this._url = strURL;
		this._callback = fnCallback;

		this._headers = [];

		var _this = this;
		this._handleReadyStateChange = function () {
			console.log('_handleReadyStateChange fired, ready state: ' + _this._request.readyState)
			if (_this._request.readyState === 4) {
				_this._response = _this._request.responseText;
				if (typeof _this._callback == 'function') {
					_this._callback(_this._request.responseText);
				}
			}
		}

		this._processHeaders = function () {
			for (let i = 0; i < _this._headers.length; i++) {
				var objHeader = _this.headers[i];
				_this._request.setRequestHeader(objHeader.header, objHeader.value);
			}
		}

		this._request.open(this._method, this._url, true);
		this._request.addEventListener("readystatechange", this._handleReadyStateChange);

	}

	setHeader(strHeader, strValue) {
		if (arguments.length === 2) {
			var objHeader = new uikitHTTPRequestHeader(strHeader, strValue);
		} else if (arguments.length === 1) {
			var objHeader = arguments[0];
		} else {
			return;
		}

		this._headers.unshift(objHeader);
		this._processHeaders();
	}

	get headers() {
		return this._headers;
	}

	send() {
		this._request.send();
	}
}

if (typeof module != 'undefined') {
	module.exports.uikitHTTPRequest = uikitHTTPRequest;
}
