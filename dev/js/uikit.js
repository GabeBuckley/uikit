// module "uikitUtility"
/* eslint-env es6 */
import UI from "./classes/UI.js";
import EventMgr from "./classes/EventMgr.js";
import uikitUtility from "./modules/uikitUtility/uikitUtility.js";

function sayboo(){
    alert('boo');
}

if (!window.uikit) {
	window.uikit = {};
    
	window.uikit.util = new uikitUtility();
    window.uikit.events = new EventMgr(window.uikit);
    
    window.uikit.UI = UI;
    window.uikit.UI.elements = [];
    
    var uiElements = document.querySelectorAll('*[data-ui="true"]');
    for(var i = 0; i < uiElements.length; i++){
        var el = uiElements[length];
        var uiEl = new UI.Button(el);
        uiEl.addEventListener('click', sayboo);
        window.uikit.UI.elements.push(uiEl); 
    }
    
}

/** ALIASES **/
uikit.req = uikit.util.httpRequest;
