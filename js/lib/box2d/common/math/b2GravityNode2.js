var b2GravityNode2 = Class.create();
Object.extend(b2GravityNode2.prototype, b2Vec2.prototype);
Object.extend(b2GravityNode2.prototype, 
{
	initialize: function(x_, y_, gravity_, fOut_, fIn_) {
		this.x = x_; 
		this.y = y_;
		this.gravity = ((this.isNumber(gravity_)) ? gravity_ : 0.0);
		this.falloffOuter = ((this.isNumber(fOut_)) ? fOut_ : 0.0);
		this.falloffInner = ((this.isNumber(fIn_)) ? fIn_ : 0.0);
	},
	
	isNumber: function (value) {
		return typeof value === 'number' && isFinite(value);
	},

	SetZero: function() { this.x = 0.0; this.y = 0.0; this.gravity = 0.0; this.falloffOuter=0.0; this.falloffInner=0.0;},
	
	Set: function(x_, y_, gravity_, fOut_, fIn_) {
		this.x = x_; 
		this.y = y_;
		this.gravity = ((this.isNumber(gravity_)) ? gravity_ : 0.0);
		this.falloffOuter = ((this.isNumber(fOut_)) ? fOut_ : 0.0);
		this.falloffInner = ((this.isNumber(fIn_)) ? fIn_ : 0.0);
	},
	
	SetM: function(m) {
		this.x=m.x;
		this.y=m.y;
		this.gravity=m.gravity;
		this.falloffOuter=m.falloffOuter;
		this.falloffInner=m.falloffInner;
	},
	
	Copy: function(){
		return new b2Magnet2(this.x,this.y,this.gravity,this.falloffOuter,this.falloffInner);
	},
	
	GetCorrectedGravity: function(distanceToThis) {
		var correctedGravity = 0;
		var dist = distanceToThis;
		if(dist < this.falloffOuter && dist > this.falloffInner) {
			var falloffRange = this.falloffOuter - this.falloffInner;
			//var midDist = falloffRange * 0.5;
			var distR = dist - this.falloffInner;
			correctedGravity = this.gravity * (1 - (distR / falloffRange));
			//if(distR >= midDist) {
			//	correctedGravity = this.gravity * (1 - ((distR - midDist) / midDist));
			//}
			//else {
			//	correctedGravity = this.gravity * (distR / midDist);
			//}
		}
		
		if(this.isNumber(correctedGravity) === false) {
			correctedGravity = 0;
		}
		
		return correctedGravity;
	},
	
	GravityAddToOut: function(targetPosition, out, modifier) {
		var dx = this.x - targetPosition.x;
		var dy = this.y - targetPosition.y;
		var dist = b2Math.Length(dx, dy);
		var mod = (modifier) ? modifier : 1;
		
		if(dist !== 0) {
			var correctedGravity = this.GetCorrectedGravity(dist);
			
			var dxPct = dx / dist;
			var dyPct = dy / dist;
			
			out.x += correctedGravity * dxPct * mod;
			out.y += correctedGravity * dyPct * mod;
		}
	},
	
	x: null,
	y: null,
	gravity: null,
	falloffOuter: null,
	falloffInner: null
});