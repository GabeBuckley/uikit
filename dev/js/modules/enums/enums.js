// module "enums"
/* eslint-env es6 */

export default class enums {

	static get status() {
		return {
			UNINITIALISED: 1000,
			INITIALISED: 1001
		};
	}
}

if (typeof module != 'undefined') {
	module.exports.enums = enums;
}