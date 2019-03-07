// module "EventOwner"
/* eslint-env es6 */

export default class EventMgr {
    
    constructor(objParent){
        this._parent = objParent;
        
        this.listeners = {};
        
        this._parent.listeners = this.listeners;
        this._parent.addEventListener = this.addEventListener;
        this._parent.removeEventListener = this.removeEventListener;
        this._parent.dispatchEvent = this.dispatchEvent;
        this._parent.emit = this.emit;
    }
    
    addEventListener(type, callback) {
      if (!(type in this.listeners)) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
    };
    
    removeEventListener(type, callback) {
      if (!(type in this.listeners)) {
        return;
      }
      var stack = this.listeners[type];
      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback){
          stack.splice(i, 1);
          return;
        }
      }
    };
    
    dispatchEvent(event) {
      if (!(event.type in this.listeners)) {
        return true;
      }
      var stack = this.listeners[event.type].slice();

      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
      }
      return !event.defaultPrevented;
    };
    
    emit(type){
        var evt = new Event(type);
        this.dispatchEvent(evt);
    }
    
    event(type){
        var evt = new Event(type);
        
        evt.fire = function(){
            this.dispatchEvent(evt);
        }.bind(this);
        
        evt.source = this._parent;
        return evt;
    }
}

if (typeof module != 'undefined') {
	module.exports.EventMgr = EventMgr;
}