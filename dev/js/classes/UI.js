import EventMgr from "./EventMgr.js";

const _DevNull = Symbol('DevNull');

const _setText = Symbol('setText');
const _events = Symbol('events');
const _physical = Symbol('physical');
const _options = Symbol('options');
const _text = Symbol('text');
const _visible = Symbol('visible');
const _type = Symbol('type');

const _onClick = Symbol('onClick');


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
            
            this.addClass('ui-element');
                        
            this[_setText](this[_text]);
            
            
            if(this[_physical].hasAttribute('data-visible')){
                if(this[_physical].getAttribute('data-visible') == 'true'){
                    this[_visible] = true;
                } else {
                    this[_visible] = false;
                }
            }
            
        }
        else {
            throw new UIException('UIException: The first parameter must be a valid HTMLElement');
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
}



class UIAlert extends UIElement {
    constructor(objHTMLElement){
        super(objHTMLElement); 
        
        this.addClass('ui-alert');
        
        if(typeof this[_options].type != "undefined"){
            this[_type] = this[_options].type;
            this.addClass('ui-' + this[_type]);
        } else {
            this[_type] = 'none';
        }
    }
}

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

/**
 * The UI namespace.
 * @namespace UI
 */

const UIObject = {
    /**
     * @name UI.Alert
     * @memberof UI

     * @class
     * @implements EventTarget
     * @param {HTMLElement} objElement
     * @throws {UIException} UIException: The first parameter must be a valid HTMLElement
     */
    Alert: UIAlert,
    
    /**
     * @name UI.Button
     * @class
     * @implements EventTarget
     * @param {HTMLElement} objElement
     * @throws {UIException} UIException: The first parameter must be a valid HTMLElement
     */
    Button: UIButton
};

window[_DevNull] = {
    /**
     * @name UI.Alert.text
     * @member {string} UI.Alert.text The text displayed in the alert message
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
     * @memberof UI.Alert
     */
    "UI.Alert.text": null,
    
    /**
     * @name UI.Alert.visible
     * @member {boolean} UI.Alert.visible The visibility status of the alert message
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
     * @memberof UI.Alert
     */
    "UI.Alert.visible": null,
    
    /**
     * @name UI.Button.text
     * @member {string} UI.Button.text The text displayed in the button
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
     * @memberof UI.Button
     */
    "UI.Button.text": null,
    
    /**
     * @name UI.Button.visible
     * @member {boolean} UI.Button.visible The visibility status of the Button message
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
     * @memberof UI.Button
     */
    "UI.Button.visible": null,
}

export default UIObject;