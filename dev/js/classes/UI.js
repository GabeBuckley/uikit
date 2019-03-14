/**
 * The UI namespace.
 * @namespace
 * @name UI
 */

/**
 * Interface for classes that fire and respond to events.
 *
 * @interface 
 * @name UI#EventTarget
 * @memberof UI
 */

/**
 * Attach an event listener to a specific event
 *
 * @function
 * @name UI#EventTarget#addEventListener
 * @returns undefined
 * @memberof UI#EventTarget
 */

import EventMgr from "./EventMgr.js";
import Util from "../modules/uikitUtility/uikitUtility.js";

const _id = Symbol('id');
const _options = Symbol('options');
const _text = Symbol('text');
const _visible = Symbol('visible');
const _type = Symbol('type');
const _physical = Symbol('physical');
const _shadow = Symbol('shadow');
const _data = Symbol('_data');

const _events = Symbol('events');
const _onClick = Symbol('onClick');

const _element = Symbol('_element');
const _elements = Symbol('elements');


const _setText = Symbol('setText');
const _implements = Symbol('implements');
const _getUIElements = Symbol('getUIElements');
const _shadowCopy = Symbol('shadowCopy');
const _harvestOptions = Symbol('harvestOptions');
const _handleOptionChange = Symbol('_handleOptionChange');
const _getEventInfo = Symbol('_getEventInfo');


const UI_Icons = {
    times: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>'
}


// Utility Classes
class UIException extends Error {
    constructor(strMessage){
        super(strMessage);        
    }
    
}

class UIEvent extends Event {
    constructor(strEventType, objElementInfo){
        super(strEventType);
        this[_element] = objElementInfo;
    }
    
    get element(){
        return this[_element];
    }
}

class UIElement {
    constructor(objHTMLElement, objOptions){
        this[_events] = new EventMgr(this);
        this[_data] = {
            lastPropertyChange: ''
        };
         
        this[_physical] = objHTMLElement;
                
        this[_options] = {
            default: {
                id:         'id_' + Util.guid().value,
                text:       '',
                type:       '',
                visible:    true,
                widget:     'Panel'
            },
            attributes: {},
            supplied: objOptions,
            final: {}
        };
        
        if( this[_physical] != null 
            && typeof this[_physical] == 'object' 
            && typeof this[_physical].tagName == "string"){
            
            this[_id] = this[_physical].id;
            
            this[_shadow] = document.createElement('article');
            this[_shadowCopy]();
            
            this[_harvestOptions]();
            
            
            
            /**
            
            if(typeof this[_options].type != "undefined"){
                this[_type] = this[_options].type;
                this.addClass('ui-' + this[_type]);
            } else {
                this[_type] = 'none';
            }
            
            this.addClass('ui-element');
                        
            this[_setText](this[_text]);
            
            if(this[_physical].hasAttribute('data-visible')){
                if(this[_physical].getAttribute('data-visible') == 'true'){
                    this[_visible] = true;
                } else {
                    this[_visible] = false;
                }
            }
            **/
            
            this.addEventListener('UIOptionChange', this[_handleOptionChange].bind(this));
            
            for(var opt in this[_options].final){
                if(this[_options].final.hasOwnProperty(opt)){
                    this.setOption(opt, this.getOption(opt));
                }
            }
            
            this[_implements] = ['UIElement', 'EventTarget'];
        }
        else {
            throw new UIException('UIException: The first parameter must be a valid HTMLElement');
        }
    }
    
    get type(){
        return this.getOption('type');
    }
    
    set type(strType){
        this.setOption('type',strType);
    }
    
    get visible(){
        return this.getOption('visible');
    }
    
    set visible(blVisible){
        this.setOption('visible',blVisible);
    }
    
    get classList(){
        var classArray = [];
        for(var i = 0; i < this[_physical].classList.length; i++){
            classArray.push(this[_physical].classList[i]);
        }
        return classArray;
    }
    
    get id(){
        return this.getOption('id');
    }
    
    hasOption(strOpt){
        for(var prop in this[_options].final){
            if(this[_options].final.hasOwnProperty(prop)){
                if(prop.toLowerCase() == strOpt.toLowerCase()){
                    return true;
                }
            }
        }
        return false;
    }
    
    getOption(strOpt){
        if(this.hasOption(strOpt)){
            return this[_options].final[strOpt];
        }
        else {
            return null;
        }
    }
    
    setOption(strOpt, objValue){
        this[_options].final[strOpt] = objValue;
        this[_data].lastPropertyChange = strOpt;
        this.dispatchEvent(new UIEvent('UIOptionChange', this[_getEventInfo]('UIOptionChange')));
    }
        
    hasClass(strClass){
        return this[_physical].classList.contains(strClass);
    }
    
    addClass(strClass){
        return this[_physical].classList.add(strClass);
    }
    
    toggleClass(strClass, blForce){
        if(typeof blForce != "undefined"){
            return this[_physical].classList.toggle(strClass, blForce);
        }
        else {
            return this[_physical].classList.toggle(strClass);
        }
    }
    
    swapClass(strClass, strNewClass){
        return this[_physical].classList.replace(strClass, strNewClass);
    }
    
    removeClass(strClass){
        return this[_physical].classList.remove(strClass);
    }
    
    implements( strInterface ){
        if(strInterface == null || typeof strInterface == 'undefined' || strInterface.length == 0){
            return this[_implements];
        }
        else {
            for(var i = 0; i < this[_implements].length; i++){
                if(strInterface.toLowerCase() == this[_implements][i].toLowerCase()){
                    return true;
                }
            }
            return false;
        }
    }
    
    [_getEventInfo](strType){
        var infoBundle = {
            widget: this[_options].final.widget,
            id: this[_id],
        };
        switch(strType.toLowerCase()){
            case 'uioptionchange' : {
                infoBundle.option = {
                    label: this[_data].lastPropertyChange,
                    value: this[_options].final[this[_data].lastPropertyChange]
                };
                
                break;
            }
            default : {
                break;
            }
        }
        return infoBundle;
    }
    
    [_setText](strText){
        this[_physical].innerHTML = this[_text];
    }
    
    [_shadowCopy](){
        while(this[_shadow].childNodes.length > 0){
            this[_shadow].removeChild(thisthis[_shadow].childNodes[0]);
        }
        for(var i = 0; i < this[_physical].childNodes.length; i++){
            this[_shadow].appendChild(this[_physical].childNodes[i]);
        }
    }
    
    [_handleOptionChange](evt){
        switch(evt.element.option.label){
            case 'type' : {
                for(var strType in UIDEFINE.type){
                    this[_physical].classList.remove(UIDEFINE.type[strType]);
                }
                
                this[_physical].classList.add('ui-' + this.getOption('type'));
            }
                
            case 'visible' : {
                var isVisible = this.getOption('visible');
                this[_physical].setAttribute('data-visible',isVisible);
                if(isVisible){
                    this.dispatchEvent(new UIEvent('UIElementShow', this[_getEventInfo]('UIElementShow')));
                }
                else{
                    this.dispatchEvent(new UIEvent('UIElementHide', this[_getEventInfo]('UIElementHide')));
                }
            }
                
            default :{
                
            }
        }
    }
    
    [_harvestOptions](){
        
        let classMap = UIDEFINE.class;
        
        let tagMap = UIDEFINE.tag;
        
        let attMap = UIDEFINE.attribute;
        
        var harvestFromAttributes = function(){
            if(this[_physical].hasAttribute('id')){
                this[_options].attributes.id = this[_physical].getAttribute('id');
            }
            for(var attr in attMap){
                if(attMap.hasOwnProperty(attr)){
                    if(this[_physical].hasAttribute(attMap[attr])){
                        this[_options].attributes.widget = attMap[attr];
                    }
                }
            }
        }.bind(this);
        
        var harvestFromTagName = function(){
            var strTag = this[_physical].tagName.toLowerCase();
            if(tagMap.hasOwnProperty(strTag)){
                this[_options].attributes.widget = tagMap[strTag];
            }
        }.bind(this);
        
        var consolidate = function(){
            //debugger;
            var objFinal = {};
            if(this[_options].default != null){
                for(var prop in this[_options].default){
                    if(this[_options].default.hasOwnProperty(prop)){
                        objFinal[prop] = this[_options].default[prop];
                    }
                }
            }
            
            if(this[_options].supplied != null){
                for(var prop in this[_options].supplied){
                    if(this[_options].supplied.hasOwnProperty(prop)){
                        objFinal[prop] = this[_options].supplied[prop];
                    }
                }
            }
            
            if(this[_options].attributes != null){
                for(var prop in this[_options].attributes){
                    if(this[_options].attributes.hasOwnProperty(prop)){
                        objFinal[prop] = this[_options].attributes[prop];
                    }
                }
            }
            
            this[_options].final = objFinal;
        }.bind(this);
        
        // Sequence is important
        harvestFromAttributes();
        harvestFromTagName();
        consolidate( );
        
    }
}

class UIElementCollection {
    constructor(){
        this[_elements] = [];
        
        this.refresh();
    }
    
    add(objElement){
        if(objElement.implements != null && objElement.implements('UIElement')){
            this[_elements].push(objElement);
            this[objElement.id] = objElement;
        }
    }
    
    get length(){
        return this[_elements].length;
    }
    
    fetch(varArg){
        if(typeof varArg == "number") {
            varArg = parseInt(varArg,10) % this.length;
            return this[_elements][varArg];
        }
        if(typeof varArg == "string") {
            return this[varArg];
        }
    }
    
    refresh(){
        this[_getUIElements]();
    }
    
    remove(strElementId){
        if(this[strElementId] != null){
            if(this.hasOwnProperty(strElementId)){
                var newArray = [];
                for(var i = 0; i < this.length; i++){
                    var currEl = this[_elements][i];
                    if(currEl.id != strElementId){
                        newArray.push(currEl);
                    }
                }
                if(newArray.length < this.length){
                    this[_elements] = newArray;
                    delete this[strElementId];
                }
            }
        }
    }
    
    [_getUIElements](){
        let uiElements = document.querySelectorAll('*[data-ui="true"]');
                
        let classMap = UIDEFINE.class;
        
        let tagMap = UIDEFINE.tag;
        
        let attMap = UIDEFINE.attribute;
        
        this[_elements] = [];
        
        for(var i = 0; i < uiElements.length; i++){
            var el = uiElements[i];
            if(el.hasAttribute('data-options')){
                var strOptions = el.getAttribute('data-options');
                var options = {
                    widget: null
                };
                try {
                    eval("options = " + strOptions + ";");
                } catch(e){
                    console.log(e);
                }
                if(options.widget == null){
                    options.widget = 'Panel';
                }
                
                var uiEl = new classMap[options.widget](el,options);
                this.add(uiEl);
            }
        }
        
    }
}

// UI Classes

const CLASS_ALERT = {
 /**
 * @class
 * @name UI#Alert
 * @memberof UI

 * @implements UI#EventTarget
 * @param {HTMLElement} objElement
 * @throws {UIException} UIException: The first parameter must be a valid HTMLElement
 */
    /**
     * @method 
     * @name UI#Alert#addClass
     * @param {String} strClass
     * @memberof UI#Alert
     */

    /**
     * @method 
     * @name UI#Alert#hasClass
     * @param {String} strClass
     * @returns {boolean} A boolean indicating whether or not the element has the specified class
     * @memberof UI#Alert
     */
        
    /**
     * @method 
     * @name UI#Alert#removeClass
     * @param {String} strClass
     * @memberof UI#Alert
     */
        
    /**
     * @method 
     * @name UI#Alert#swapClass
     * @param {String} strFindClass
     * @param {String} strReplaceClass
     * @memberof UI#Alert
     */
        
    /**
     * @method 
     * @name UI#Alert#toggleClass
     * @param {String} strClass
     * @param {Boolean} force
     * @memberof UI#Alert
     */

    /**
     * 
     * @member
     * @name UI#Alert#text
     * @fires UIElementTextChange
     * @example
// returns 'Warning, file not found.'
        
  var myElement = document.createElement('div');
  myElement.innerHTML = 'Warning, file not found.';
  var myAlert = new uikit.UI.Alert(myElement);
  return myAlert.text;
    * @example
// Sets the text of the Alert to "All Good".
// Fires the UIElementTextChange event
    
  var myElement = document.createElement('div');
  var myAlert = new uikit.UI.Alert(myElement); 
  myAlert.text = 'All Good';
     * @memberof UI#Alert
     */
    
    /**
     * @member
     * @name UI#Alert#visible
     * @fires UIElementShow
     * @fires UIElementHide
     * @example
// returns true
var myElement = document.createElement('div');
myElement.innerHTML = 'Warning, file not found.';
var myAlert = new uikit.UI.Alert(myElement);
return myAlert.visible;
    * @example
// Hides the Alert.
// Fires the UIElementHide event
var myElement = document.createElement('div');
var myAlert = new uikit.UI.Alert(myElement); 
myAlert.visible = false;
     * @memberof UI#Alert
     */
};
const _closeButton = Symbol('closeButton');
const _inner = Symbol('inner');
class UIAlert extends UIElement {
    constructor(objHTMLElement, objOptions){
        super(objHTMLElement, objOptions);
        
        this.addClass('ui-alert');
        
        // Push content down one level
        this[_inner] = document.createElement('div');
        this[_inner].innerHTML = this[_physical].innerHTML;
        this[_physical].innerHTML = '';
        this[_physical].appendChild(this[_inner]);
        
        this.setOption('text', this.getOption('text'));
        
        this[_closeButton] = new UIIconButton(document.createElement('a'));
        this[_closeButton].icon = 'times';
        this[_closeButton].type = 'warning';
        this[_closeButton].text = UI_Icons.times;
        this[_physical].appendChild(this[_closeButton][_physical]);
        
        this[_closeButton].addEventListener('click', this.close.bind(this));
    }
    
    [_handleOptionChange](evt){
        super[_handleOptionChange](evt);
        switch(evt.element.option.label){
            case 'text' : {
                if(this[_inner]){
                    this[_inner].innerHTML = this.getOption('text');
                }
            }

            default :{

            }
        }
    }
    
    close( ){
        var final = function(){
            this.visible = false;
            this.removeClass('fade_out');
        }.bind(this);
        
        setTimeout(final, 500);
        this.addClass('fade_out');
    }
}


const CLASS_BUTTON = {
/**
 * @class
 * @name UI#Button
 * @memberof UI

 * @implements UI#EventTarget
 * @param {HTMLElement} objElement
 * @throws {UIException} UIException: The first parameter must be a valid HTMLElement
 */

    /**
     * @member
     * @name UI#Button#text
     * @fires UIElementTextChange
     * @example
// returns 'Click Me!'
var myElement = document.createElement('span');
myElement.innerHTML = 'Click Me!';
var myButton = new uikit.UI.Button(myElement);
return myButton.text;
     * @example
// Sets the text of the Button to "OK".
// Fires the UIElementTextChange event
var myElement = document.createElement('span');
var myButton = new uikit.UI.Button(myElement); 
myButton.text = 'OK';
     * @memberof UI#Button
     */
    
    /**
     * @member
     * @name UI#Button#visible
     
     * @fires UIElementShow
     * @fires UIElementHide
     * @example
// returns true
var myElement = document.createElement('div');
myElement.innerHTML = 'OK';
var myButton = new uikit.UI.Button(myElement);
return myButton.visible;
    * @example
// Hides the Button.
// Fires the UIElementHide event
var myElement = document.createElement('div');
var myButton = new uikit.UI.Button(myElement); 
myButton.visible = false;
     * @memberof UI#Button
     */
};
class UIButton extends UIElement {
    constructor(objHTMLElement, objOptions){
        super(objHTMLElement, objOptions); 
        
        this.addClass('ui-button');
        
        // Pass the click event back up to the handler
        this[_physical].addEventListener('click', this[_onClick].bind(this));
        
    }
    
    [_onClick](objEvent){
        this.dispatchEvent(objEvent);
    }
    
    [_handleOptionChange](evt){
        switch(evt.element.option.label){
            case 'text' : {
                this[_physical].innerHTML = this.getOption('text');
            }
                
            default :{
                
            }
        }
    }
}


const CLASS_ICON_BUTTON = { };
const _icon = Symbol('icon');
const _clear = Symbol('clear');
class UIIconButton extends UIButton {
    constructor(objHTMLElement, objOptions){
        super(objHTMLElement, objOptions); 
        this.addClass('ui-icon-button');
        this[_icon] = 'trash';
        this.addClass('icon-' + this[_icon])
    }
    
    get icon(){
        return this[_icon];
    }
    
    set icon(strIcon){
        this[_icon] = strIcon;
        this[_clear]();
        this.addClass('icon-' + this[_icon])
    }
    
    [_clear](){
        var re = /^icon-/;
        for(var i = 0; i < this.classList.length; i++){
            var currClass = this.classList[i];
            var match = re.test(currClass);
            if(match){
                this.removeClass(currClass);
            }
        }
    }
    
    [_handleOptionChange](evt){
        super[_handleOptionChange](evt);
        switch(evt.element.option.label){
            case 'text' : {
                this[_physical].innerHTML = this.getOption('text');
            }
                
            default :{
                
            }
        }
    }
}

class UIPanel extends UIElement {
    constructor(objHTMLElement, objOptions){
        super(objHTMLElement, objOptions); 
        this.addClass('ui-panel');
    }
    
    [_handleOptionChange](evt){
        super[_handleOptionChange](evt);
        switch(evt.element.option.label){
            case 'text' : {
                this[_physical].innerHTML = this.getOption('text');
            }
                
            default :{
                
            }
        }
    }
}


const UIDEFINE = {
    class: {
        Alert: UIAlert,
        Button: UIButton,
        Panel: UIPanel
    },
    tag: {
        "ui-alert": UIAlert,
        "ui-button": UIButton,
        "ui-panel": UIPanel
    },
    attribute: {
        "data-alert": UIAlert,
        "data-button": UIButton,
        "data-panel": UIPanel
    },
    type: {
        warning: 'ui-warning',
        info: 'ui-info',
        success: 'ui-success'
    }
};

const UIObject = {
    Alert: UIAlert,
    Button: UIButton,
    icons: UI_Icons,
    elements: new UIElementCollection()
};

export default UIObject;