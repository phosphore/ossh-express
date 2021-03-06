;(function() {
	
	"use strict";
		
	// has property and extend jibbed from coffeescript
  var root = window || this;
  var _hasProp = {}.hasOwnProperty;
  var _extends = function(child, parent) { for (var key in parent) { if (_hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	// check if requestAnimationFrame already exists
	if (!root.requestAnimFrame) {
		root.requestAnimFrame = (function(){
		  return root.requestAnimationFrame || root.webkitRequestAnimationFrame || root.mozRequestAnimationFrame || function(callback) { root.setTimeout(callback, 1000 / 60); };
		})();
	}

	/* ---------------------------------------
	
		 Config
	
	--------------------------------------- */

	var config, eventMap;
	
	root.QS = {};
	
	// defaults config for when the QuickSketch instantiates
	config = {
		container: document.body,
		ctx: "2d",
		hasTouch: 'ontouchstart' in window
	};

	// Interaction events mapping ready
	eventMap = ["mousedown", "mouseup", "mousemove", "touchstart", "touchend", "touchmove"];
		
	/* ---------------------------------------
	
		 Utilities
	
	--------------------------------------- */	

	// Vector2D (Factory)
	root.Vector2D = {};Vector2D.create=function(){var e=[];e[0]=0;e[1]=0;return e};Vector2D.clone=function(e){var t=[];t[0]=e[0];t[1]=e[1];return t};Vector2D.fromValues=function(e,t){var n=[];n[0]=e;n[1]=t;return n};Vector2D.copy=function(e,t){e[0]=t[0];e[1]=t[1];return e};Vector2D.set=function(e,t,n){e[0]=t;e[1]=n;return e};Vector2D.add=function(e,t,n){e[0]=t[0]+n[0];e[1]=t[1]+n[1];return e};Vector2D.subtract=function(e,t,n){e[0]=t[0]-n[0];e[1]=t[1]-n[1];return e};Vector2D.sub=Vector2D.subtract;Vector2D.multiply=function(e,t,n){e[0]=t[0]*n[0];e[1]=t[1]*n[1];return e};Vector2D.mult=Vector2D.multiply;Vector2D.divide=function(e,t,n){e[0]=t[0]/n[0];e[1]=t[1]/n[1];return e};Vector2D.div=Vector2D.divide;Vector2D.min=function(e,t,n){e[0]=Math.min(t[0],n[0]);e[1]=Math.min(t[1],n[1]);return e};Vector2D.max=function(e,t,n){e[0]=Math.max(t[0],n[0]);e[1]=Math.max(t[1],n[1]);return e};Vector2D.scale=function(e,t,n){e[0]=t[0]*n;e[1]=t[1]*n;return e};Vector2D.scaleAndAdd=function(e,t,n,r){e[0]=t[0]+n[0]*r;e[1]=t[1]+n[1]*r;return e};Vector2D.distance=function(e,t){var n=t[0]-e[0];var r=t[1]-e[1];return Math.sqrt(n*n+r*r)};Vector2D.dist=Vector2D.distance;Vector2D.squaredDistance=function(e,t){var n=t[0]-e[0];var r=t[1]-e[1];return n*n+r*r};Vector2D.sqrDist=Vector2D.squaredDistance;Vector2D.length=function(e){var t=e[0];var n=e[1];return Math.sqrt(t*t+n*n)};Vector2D.len=Vector2D.length;Vector2D.squaredLength=function(e){var t=e[0];var n=e[1];return t*t+n*n};Vector2D.sqrLen=Vector2D.squaredLength;Vector2D.negate=function(e,t){e[0]=-t[0];e[1]=-t[1];return e};Vector2D.limit=function(e,t,n){var r=t[0],i=t[1];var s=r*r+i*i;if(s>n*n&&s>0){e[0]=r;e[1]=i;Vector2D.normalize(e,e);Vector2D.scale(e,e,n)}return e};Vector2D.normalize=function(e,t){var n=t[0];var r=t[1];var i=n*n+r*r;if(i>0){i=1/Math.sqrt(i);e[0]=t[0]*i;e[1]=t[1]*i}return e};Vector2D.dot=function(e,t){return e[0]*t[0]+e[1]*t[1]};Vector2D.cross=function(e,t,n){var r=t[0]*n[1]-t[1]*n[0];e[0]=e[1]=0;e[2]=r;return e};Vector2D.lerp=function(e,t,n,r){var i=t[0];var s=t[1];e[0]=i+r*(n[0]-i);e[1]=s+r*(n[1]-s);return e};Vector2D.random=function(e,t){t=t||1;var n=Math.random()*2*Math.PI;e[0]=Math.cos(n)*t;e[1]=Math.sin(n)*t;return e};Vector2D.transformMat2=function(e,t,n){var r=t[0];var i=t[1];e[0]=n[0]*r+n[2]*i;e[1]=n[1]*r+n[3]*i;return e};Vector2D.transformMat2d=function(e,t,n){var r=t[0];var i=t[1];e[0]=n[0]*r+n[2]*i+n[4];e[1]=n[1]*r+n[3]*i+n[5];return e};Vector2D.transformMat3=function(e,t,n){var r=t[0];var i=t[1];e[0]=n[0]*r+n[3]*i+n[6];e[1]=n[1]*r+n[4]*i+n[7];return e};Vector2D.transformMat4=function(e,t,n){var r=t[0];var i=t[1];e[0]=n[0]*r+n[4]*i+n[12];e[1]=n[1]*r+n[5]*i+n[13];return e};Vector2D.forEach=function(){var e=Vector2D.create();return function(t,n,r,i,s,o){var u,a;if(!n){n=2}if(!r){r=0}if(i){a=Math.min(i*n+r,t.length)}else{a=t.length}for(u=r;u<a;u+=n){e[0]=t[u];e[1]=t[u+1];s(e,e,o);t[u]=e[0];t[u+1]=e[1]}return t}}();Vector2D.str=function(e){return"Vector2D("+e[0]+", "+e[1]+")"};if(typeof exports!=="undefined"){exports.Vector2D=Vector2D};
	
	function getEvents(context) {
		var events = [], e;
		for (var key in context.__proto__) {
			e = eventMap.indexOf(key);
			if (e > -1) { events.push(eventMap[e]); }
		}
		return events;
	};
	
	/* ---------------------------------------
	
		 Constructor
	
	--------------------------------------- */

	QS = function(options) {			

		var _i, events;
		var canvas = this.container ? document.getElementById(this.container) : undefined;

		this.attrs = options ? options : {};	
		if (this.draggable === undefined) this.draggable = false;		
		this.size = this.size ? this.size : [window.innerWidth,window.innerHeight];
		
		// return setup
		if (this.setup) {
			this.setup.apply(this, arguments);
		}
		
		// fire draw to loop
		if (this.draw) { this.loop(); }

		$(window).resize(function() {				
			console.log("resizing");
			this.resize(); 
		}.bind(this));
	};

	/* ---------------------------------------
	
		 Private
	
	--------------------------------------- */
	
	QS.prototype.events = [];

	QS.prototype.loop = function() {
		// this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height)
		this.draw();
		this.ctx.render(this.stage);
		root.requestAnimFrame(this.loop.bind(this));
	};

	/* ---------------------------------------
	
		 Extend
	
	------------------------------------------
		We need to emulate inheritence to copy over proto 
		and static methods without overriding the parents defaults

	*/

	var extend = function(protoProps, staticProps) {
		return (function(_super) {
	    _extends(QS, _super);
	    function QS() {
	      return QS.__super__.constructor.apply(this, arguments);
	    }
			if (protoProps) {
				for (var ckey in protoProps) { 
					QS.prototype[ckey] = protoProps[ckey]; 
				}
			}
	    return QS;
	  })(this);
	};
	
	// for any addons
	QS.extend = extend;
	QS.Vector2D = Vector2D; // is also global anyways
		
}).call(this);
