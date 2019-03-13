// module "uikitUtility"
/* eslint-env es6 */
import UI from "./classes/UI.js";

if (!window.uikit) {
	window.uikit = {
        ui: UI
    };
}