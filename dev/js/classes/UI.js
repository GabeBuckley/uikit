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

const _id = Symbol('id');
const _options = Symbol('options');
const _physical = Symbol('physical');
const _text = Symbol('text');
const _visible = Symbol('visible');
const _type = Symbol('type');


const _events = Symbol('events');
const _onClick = Symbol('onClick');


const _elements = Symbol('elements');


const _setText = Symbol('setText');
const _implements = Symbol('implements');
const _getUIElements = Symbol('getUIElements');


const UI_Icons = {
    times: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>'
}

const UITypes = {
    types: [
        'warning'
    ],
    isType: function(strType){
        for(var i = 0; i < this.types.length; i++){
            if(this.types[i] == strType){
                return true;
            }
        }
        return false;
    }
};

// Utility Classes
class UIException extends Error {
    constructor(strMessage){
        super(strMessage);        
    }
    
}

class UIElement {
    constructor(objHTMLElement){
        this[_events] = new EventMgr(this);
        
        this[_physical] = objHTMLElement;
                
        this[_options] = {};
        
        if( this[_physical] != null 
            && typeof this[_physical] == 'object' 
            && typeof this[_physical].tagName == "string"){

            this[_id] = this[_physical].id;
            
            if(this[_physical].hasAttribute('data-options')){
                try{
                    this[_options] = eval('this[_options]=' + this[_physical].getAttribute('data-options'));
                } catch(e){
                    alert(e);
                }
            }

            if(typeof this[_options].text != "undefined"){
                this[_text] = this[_options].text;
            } else {
                if(this[_physical].innerHTML){
                    this.text = this[_physical].innerHTML;
                }
                else {
                    this[_text] = '';
                }
            }
            
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
            
            this[_implements] = ['UIElement', 'EventTarget'];
        }
        else {
            throw new UIException('UIException: The first parameter must be a valid HTMLElement');
        }
    }
    
    get type(){
        return this[_type];
    }
    
    set type(strType){
        if(UITypes.isType(strType)){
            for(var i = 0; i < UITypes.types.length; i++){
                this.removeClass('ui-' + UITypes.types[i]);
            }
            this[_type] = strType;
            this.addClass('ui-' + strType);
        }
    }
    
    get visible(){
        return this[_visible];
    }
    
    set visible(blVisible){
        this[_visible] = blVisible;
        if(this[_physical] != null){
            this[_physical].setAttribute('data-visible',this[_visible]);
        }
        if(this[_visible]){
            this[_events].event('UIElementShow').fire();
        }
        else{
            this[_events].event('UIElementHide').fire();
        }
    }
    
    get text(){
        return this[_text];
    }
    
    set text(strText){
        this[_text] = strText;
        this[_setText](strText);
        this[_events].event('UIElementTextChange').fire();
    }
    
    get classList(){
        var classArray = [];
        for(var i = 0; i < this[_physical].classList.length; i++){
            classArray.push(this[_physical].classList[i]);
        }
        return classArray;
    }
    
    get id(){
        return this[_id];
    }
    
    [_setText](strText){
        this[_physical].innerHTML = this[_text];
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
        
        let classMap = {
            Alert: UIAlert,
            Button: UIButton
        };
        
        this[_elements] = [];
        
        for(var i = 0; i < uiElements.length; i++){
            var el = uiElements[i];
            if(el.hasAttribute('data-options')){
                var strOptions = el.getAttribute('data-options');
                var options = {
                    ui: null
                };
                eval("options = " + strOptions + ";");
                if(options.ui == null){
                    options.ui = 'Button';
                }
                
                var uiEl = new classMap[options.ui](el);
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
    constructor(objHTMLElement){
        super(objHTMLElement); 
        
        this.addClass('ui-alert');
        
        // Push content down one level
        this[_inner] = document.createElement('div');
        this[_inner].innerHTML = this[_physical].innerHTML;
        this[_physical].innerHTML = '';
        this[_physical].appendChild(this[_inner]);
        
        this[_closeButton] = new UIIconButton(document.createElement('a'));
        this[_closeButton].icon = 'times';
        this[_closeButton].type = 'warning';
        this[_closeButton].text = UI_Icons.times;
        this[_physical].appendChild(this[_closeButton][_physical]);
        
        this[_closeButton].addEventListener('click', this.close.bind(this));
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
    constructor(objHTMLElement){
        super(objHTMLElement); 
        
        this.addClass('ui-button');
        
        // Pass the click event back up to the handler
        this[_physical].addEventListener('click', this[_onClick].bind(this));
        
    }
    
    [_onClick](objEvent){
        this.dispatchEvent(objEvent);
    }
}


const CLASS_ICON_BUTTON = { };
const _icon = Symbol('icon');
const _clear = Symbol('clear');
class UIIconButton extends UIButton {
    constructor(objHTMLElement){
        super(objHTMLElement); 
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
}


const UIObject = {
    Alert: UIAlert,
    Button: UIButton,
    icons: UI_Icons,
    elements: new UIElementCollection()
};

export default UIObject;