/*
 *
 *
 * Modified Constant Volume Joint (c) 2010 Collin Hover
 * Based on original script by Erin Catto
 * Modified script major changes are ability to split and join
 * organically with other constant volume joints
 *
 *
 */

/*
* Copyright (c) 2006-2007 Erin Catto http:
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

var b2ConstantVolumeJoint = Class.create();
Object.extend(b2ConstantVolumeJoint.prototype, b2Joint.prototype);
Object.extend(b2ConstantVolumeJoint.prototype, 
{
	// no need to override get methods, defaults defined by Joint class are correct
	
	// returns array of bodies
	GetBodies: function() {
		return this.bodies;
	},
	
	// returns body percent relative to min / max caps
	GetBodiesPct: function () {
		return Math.max(this.m_splitMinBodies, Math.min(this.m_splitForceBodyCap, this.bodies.length)) / this.m_splitForceBodyCap;
	},
	
	GetCenterPosition: function () {
		return this.centerPos;
	},

	// increases or decreases volume (based on passed factor)
	Inflate: function(factor, savePrev) {
		if(b2ConstantVolumeJoint.isNumber(factor) !== false) {
			this.effectiveRadius *= factor;//Math.sqrt(Math.abs(this.targetVolume) / Math.PI);
			this.targetVolume = 0.5 * this.bodies.length * Math.pow(this.effectiveRadius, 2) * Math.sin((Math.PI * 2) / this.bodies.length) * (Math.abs(this.targetVolume) / this.targetVolume); // Math.PI * Math.pow(this.effectiveRadius, 2) * (Math.abs(this.targetVolume) / this.targetVolume);
			if(savePrev === true) {
				this.inflationFactorPrev = this.inflationFactor;
			}
			this.inflationFactor *= factor;
		}
	},
	
	// reverts inflation to last saved state
	InflateRevert: function (savePrev) {
		if(this.inflationFactorPrev !== this.inflationFactor) {
			this.Inflate(this.inflationFactorPrev / this.inflationFactor, savePrev);
		}
	},
	
	// resets inflation to base state of 1
	InflateReset: function (savePrev) {
		if(this.inflationFactor !== 1) {
			this.Inflate(1 / this.inflationFactor, savePrev);
		}
	},
	
	// inflates over time
	VolumeTo: function (radiusTarget, iterationsTo) {		
		// stop current
		this.VolumeToStop();
		
		// init new
		this.m_volumeTo = {radiusInit: this.effectiveRadius,
							radiusTarget: radiusTarget,
							volumeInit: this.targetVolume,
							volumeTarget: this.GetVolumeFromRadius(radiusTarget),
							iterationsTotal: (b2ConstantVolumeJoint.isNumber(iterationsTo) === false) ? b2ConstantVolumeJoint.VOLUME_TO_ITERATIONS : iterationsTo, 
							iterationsDone: 0};
							
		// set additional values
		this.m_volumeTo.radiusStep = (this.m_volumeTo.radiusTarget - this.m_volumeTo.radiusInit) / this.m_volumeTo.iterationsTotal;
		this.m_volumeTo.volumeStep = (this.m_volumeTo.volumeTarget - this.m_volumeTo.volumeInit) / this.m_volumeTo.iterationsTotal;
	},
	
	// inflate over time step
	VolumeToStep: function () {
		if(typeof this.m_volumeTo !== "undefined") {
			// set radius and volume
			this.effectiveRadius += this.m_volumeTo.radiusStep;
			this.targetVolume += this.m_volumeTo.volumeStep;
			
			// increase iterations done
			this.m_volumeTo.iterationsDone++;
			
			// check if finished
			if(this.m_volumeTo.iterationsDone >= this.m_volumeTo.iterationsTotal) {
				this.VolumeToFinish();
			}
		}
	},
	
	// finishes volume to
	VolumeToFinish: function () {
		if(typeof this.m_volumeTo !== "undefined") {
			this.effectiveRadius = this.m_volumeTo.radiusTarget;
			this.targetVolume = this.m_volumeTo.volumeTarget;
			this.VolumeToStop();
		}
	},
	
	// stops inflate to
	VolumeToStop: function () {
		if(typeof this.m_volumeTo !== "undefined") {
			this.m_volumeTo = undefined;
		}
	},
	
	// gets volume based on radius
	GetVolumeFromRadius: function (radius) {
		var vfr = 0.5 * this.bodies.length * Math.pow(radius, 2) * Math.sin((Math.PI * 2) / this.bodies.length);
		if(b2ConstantVolumeJoint.isNumber(this.targetVolume) === true) {
			 vfr = vfr * (Math.abs(this.targetVolume) / this.targetVolume);
		}
		return vfr;
	},
	
	// sets target volume of joint
	SetTargetVolume: function (volume, savePrev) {
		if(savePrev === true) {
			this.targetVolumePrev = this.targetVolume;
		}
		this.targetVolume = volume;
	},
	
	// reverts volume to last saved state
	TargetVolumeRevert: function (savePrev) {
		if(this.targetVolumePrev !== this.targetVolume) {
			this.SetTargetVolume(this.targetVolumePrev, savePrev);
		}
	},
	
	// gets target volume
	GetTargetRadius: function () {
		if(typeof this.m_volumeTo !== "undefined") {
			return this.m_volumeTo.radiusTarget;
		}
		else {
			return this.effectiveRadius;
		}
	},
	
	// sets effective radius of joint
	SetEffectiveRadius: function (radius, savePrev) {
		if(savePrev === true) {
			this.effectiveRadiusPrev = this.effectiveRadius;
		}
		this.effectiveRadius = radius;
	},
	
	// reverts effective radius to last saved state
	EffectiveRadiusRevert: function (savePrev) {
		if(this.effectiveRadiusPrev !== this.effectiveRadius) {
			this.SetEffectiveRadius(this.effectiveRadiusPrev, savePrev);
		}
	},
	
	FlexibilityModify: function(frequency, damping, saveState) {
		var i;
		
		// update
		if(b2ConstantVolumeJoint.isNumber(frequency) === true) {
			// save state
			if(saveState === true) {
				this.frequencyHzPrev = this.frequencyHz;
			}
			this.frequencyHz = frequency;
		}
		if(b2ConstantVolumeJoint.isNumber(damping) === true && damping >= 0 && damping <= 1) {
			// save state
			if(saveState === true) {
				this.dampingRatioPrev = this.dampingRatio;
			}
			this.dampingRatio = damping;
		}
		
		// apply new
		for(i = 0; i < this.distanceJoints.length; i++) {
			if(b2ConstantVolumeJoint.isNumber(frequency) === true) {
				this.distanceJoints[i].SetFrequency(this.frequencyHz);
			}
			if(b2ConstantVolumeJoint.isNumber(damping) === true && damping >= 0 && damping <= 1) {
				this.distanceJoints[i].SetDampingRatio(this.dampingRatio);
			}
		}
	},
	
	FlexibilityRevert: function(saveState) {
		var newFrequency, newDamping;
		
		// set new
		if(this.frequencyHzPrev !== this.frequencyHz && b2ConstantVolumeJoint.isNumber(this.frequencyHzPrev) === true && this.frequencyHzPrev > 0) {
			newFrequency = this.frequencyHzPrev;
		}
		else {
			newFrequency = this.frequencyHz;
		}
		
		if(this.dampingRatioPrev !== this.dampingRatio && b2ConstantVolumeJoint.isNumber(this.dampingRatioPrev) === true && this.dampingRatioPrev >= 0 && this.dampingRatioPrev <= 1) {
			newDamping = this.dampingRatioPrev;
		}
		else {
			newDamping = this.dampingRatio;
		}
		
		// revert to last saved state
		this.FlexibilityModify(newFrequency, newDamping, saveState);
	},
	
	
	// returns frequency
	GetFrequency: function () {
		var fq;
		
		if(this.m_frequencyByBodyCount === true) {
			fq = this.m_frequencyMin + (this.m_frequencyMax - this.m_frequencyMin) * (1 - this.GetBodiesPct());
		}
		else {
			fq = this.m_frequencyMin;
		}
		
		return fq;
	},
	
	// tests a point to see if it resides inside area of constant volume joint
	TestPoint: function(p){
		var length = this.bodies.length, counter = 0, x_inter, p1 = this.bodies[0].GetCenterPosition(), p2, i;
		
		for(i = 1; i <= length; i++){
			p2 = this.bodies[i % length].GetCenterPosition();
			
			if(p.y > Math.min(p1.y,p2.y)){
				if(p.y <= Math.max(p1.y,p2.y)){
					if(p.x <= Math.max(p1.x,p2.x)){
						if(p1.y !== p2.y){
							x_inter = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
							if(p1.x === p2.x || p.x <= x_inter){
								counter++;
							}
						}
					}
				}
			}
			
			p1 = p2;
		}
		
		return((counter % 2) === 1);
	},
	
	// sets self imposed gravity force towards a point
	SetGravityTowardsPoint: function (ptX, ptY, force) {
		var bodies, deltaForce, currForce, forceMod = 1, nb, nbc, dx, dy, dist, fx, fy, i;
		
		bodies = this.bodies;
		deltaForce = (force / bodies.length) * forceMod;
		currForce = (Math.round(Math.random() * bodies.length) * deltaForce) * forceMod;
		for(i = 0; i < bodies.length; i++) {
			nb = bodies[i];
			nbc = nb.GetCenterPosition();
			
			dx = ptX - nbc.x;
			dy = ptY - nbc.y;
			dist = b2Math.Length(dx, dy);
			fx = currForce * (dx / dist);
			fy = currForce * (dy / dist);
			
			nb.SetSelfImposedGravityXY(fx, fy);
			
			currForce -= deltaForce;
			if(currForce <= 0) {
				currForce = force;
			}
		}
	},
	
	// set no self imposed gravity
	SetGravityZero: function () {
		var bodies, nb, i;
		
		bodies = this.bodies;
		
		for(i = 0; i < bodies.length; i++) {
			nb = bodies[i];
			nb.SetSelfImposedGravityXY(0, 0);
		}
	},
	
	// inits a basic joint copy of this one
	// pass optional body1 and body2 for only a part of this joint as its own joint
	BasicCopyAsDef: function (body1, body2, doNotSetConnectorLength) {
		var cvjDef, entireJoint, b1Index, b2Index, connectorLength, bdPct;
		
		// check that body1 and body2 are valid
		if(typeof body1 === "undefined" || body1 === null || typeof body2 === "undefined" || body2 === null) {
			// set as first and last
			body1 = this.bodies[0];
			body2 = this.bodies[this.bodies.length - 1];
			
			// set entire joint
			entireJoint = true;
		}
		
		b1Index = this.bodies.indexOf(body1);
		b2Index = this.bodies.indexOf(body2);
		
		// check that indexes are valid
		if(b1Index !== -1 && b2Index !== -1 && b1Index !== b2Index) {
			
			// init copy def
			cvjDef = new b2ConstantVolumeJointDef();
			
			// init bodies
			cvjDef.body1 = body1;
			cvjDef.body2 = body2;
			
			// inflation factors
			cvjDef.inflationFactor = this.inflationFactor;
			
			// frequency and damping
			cvjDef.frequencyByBodyCount = this.m_frequencyByBodyCount;
			cvjDef.frequencyMax = this.m_frequencyMax;
			cvjDef.frequencyMin = this.m_frequencyMin;
			cvjDef.frequencyHz = this.frequencyHz;
			cvjDef.dampingRatio = this.dampingRatio;
			
			// split properties
			cvjDef.splitForceMin = this.m_splitForceMin;
			cvjDef.splitForceMax = this.m_splitForceMax;
			cvjDef.splitMinBodies = this.m_splitMinBodies;
		
			// if b1Index is higher than b2Index
			// I.E. b1Index is near end of array, b2Index near beginning
			if(b1Index > b2Index) {
				// bodies
				cvjDef.bodies = this.bodies.slice(b1Index, this.bodies.length);
				cvjDef.bodies = cvjDef.bodies.concat(this.bodies.slice(0, b2Index + 1));
				
				// target lengths
				cvjDef.targetLengths = this.targetLengths.slice(b1Index, this.targetLengths.length);
				cvjDef.targetLengths = cvjDef.targetLengths.concat(this.targetLengths.slice(0, b2Index + 1));
				
				// distance joints
				cvjDef.distanceJoints = this.distanceJoints.slice(b1Index, this.distanceJoints.length);
				cvjDef.distanceJoints = cvjDef.distanceJoints.concat(this.distanceJoints.slice(0, ((entireJoint === true) ? b2Index + 1 : b2Index)));
			}
			// else take as normal
			else {
				// bodies
				cvjDef.bodies = this.bodies.slice(b1Index, b2Index + 1);
				
				// target lengths
				cvjDef.targetLengths = this.targetLengths.slice(b1Index, b2Index + 1);
				
				// distance joints
				cvjDef.distanceJoints = this.distanceJoints.slice(b1Index, ((entireJoint === true) ? b2Index + 1 : b2Index));
			}
			
			// if is not entire joint
			if(entireJoint !== true) {
				connectorLength = (doNotSetConnectorLength !== true) ? this.m_avgLength : undefined;
				// create new connector distance joint
				cvjDef.distanceJoints[cvjDef.distanceJoints.length] = b2ConstantVolumeJoint.CreateDistanceJoint(body2, body1, connectorLength, cvjDef.frequencyHz, cvjDef.dampingRatio);
			}
			
			// get effectiveRadius
			bdPct = (cvjDef.bodies.length / this.bodies.length);
			cvjDef.effectiveRadius = this.effectiveRadius * bdPct;
			
			// get effectiveRadius target
			if(typeof this.m_volumeTo !== "undefined") {
				cvjDef.effectiveRadius_target = this.m_volumeTo.radiusTarget * bdPct;
			}
			else {
				cvjDef.effectiveRadius_target = cvjDef.effectiveRadius;
			}
				
			// set target volume
			// volume equation for split pieces is based on regular polygon area formula
			cvjDef.targetVolume = 0.5 * cvjDef.bodies.length * Math.pow(cvjDef.effectiveRadius, 2) * Math.sin((Math.PI * 2) / cvjDef.bodies.length); // this.targetVolume * bdPct;//
			
			// set split / combine enabled status
			cvjDef.combineEnabled = this.m_combineEnabled;
			cvjDef.splitEnabled = this.m_splitEnabled;
		}
		
		return cvjDef;
	},
	
	// sets combine enabled
	SetCombineEnabled: function (bool) {
		this.m_combineEnabled = bool;
	},
	
	// returns combine enabled
	GetCombineEnabled: function () {
		return this.m_combineEnabled;
	},
	
	// returns combine locations
	CombineLocations: function () {
		return this.combineLocations;
	},
	
	// combine this joint with others based on combine locations passed
	// (mulitple locations to combine with the same other joint may cause unexpected behavior)
	// returns combined joint already added to world if requested, else defaults to event
	Combine: function (returnCombination) {
		var combineLocations, cvjDef, cvjDef_o, cvj, effectiveRadius_target, parts, si, oi, i;
		
		this.findCombineLocations();
		
		combineLocations = this.combineLocations;
		
		// for each location
		for(i = 0; i < combineLocations.length; i++) {
			// store self and other info
			si = combineLocations[i].self;
			oi = combineLocations[i].other;
			
			// if any info is invalid, skip
			if(typeof oi === "undefined" || oi.cvj === this || oi.bd.m_cvj !== oi.cvj || typeof si === "undefined" || si.cvj !== this) {
				continue;
			}
			
			// get indexes of combination joint areas
			si.jindex = (typeof cvjDef !== "undefined") ? cvjDef.distanceJoints.indexOf(si.joint) : this.distanceJoints.indexOf(si.joint);
			oi.jindex = oi.cvj.distanceJoints.indexOf(oi.joint);
			
			// if joint indexes are invalid, skip
			if(si.jindex === -1 || oi.jindex === -1) {
				continue;
			}
			
			// init new combined cvj def
			if(typeof cvjDef === "undefined") {
				cvjDef = this.BasicCopyAsDef();
				effectiveRadius_target = cvjDef.effectiveRadius_target;
			}
			
			// init parts list
			if(typeof parts === "undefined") {
				parts = [this];
			}
			
			// add other joint to parts
			parts[parts.length] = oi.cvj;
			
			// get copy of other cvj
			cvjDef_o = oi.cvj.BasicCopyAsDef();
						
			// extract all other distance joints 
			oi.djToInsert = b2ConstantVolumeJoint.ExtractFromArrayAroundIndex(cvjDef_o.distanceJoints, oi.jindex);
			
			// extract all other bodies
			oi.bodiesToInsert = b2ConstantVolumeJoint.ExtractFromArrayAroundIndex(cvjDef_o.bodies, oi.jindex, true);
			
			// extract all other target lengths
			oi.tlToInsert = b2ConstantVolumeJoint.ExtractFromArrayAroundIndex(cvjDef_o.targetLengths, oi.jindex, true);
						
			// create distance joints / target lengths for this bodies to other bodies at combine joint locations
			// add to beginning and end of other dj to insert array
			oi.djToInsert.unshift(b2ConstantVolumeJoint.CreateDistanceJoint(si.joint.m_body1, oi.joint.m_body2, this.m_avgLength, cvjDef.frequencyHz, cvjDef.dampingRatio));
			oi.djToInsert[oi.djToInsert.length] = b2ConstantVolumeJoint.CreateDistanceJoint(oi.joint.m_body1, si.joint.m_body2, this.m_avgLength, cvjDef.frequencyHz, cvjDef.dampingRatio);
			
			// insert all extracted parts into cvjDef at combine joint index
			cvjDef.distanceJoints = b2ConstantVolumeJoint.InsertArray1IntoArray2(oi.djToInsert, cvjDef.distanceJoints, si.jindex, true);
			cvjDef.bodies = b2ConstantVolumeJoint.InsertArray1IntoArray2(oi.bodiesToInsert, cvjDef.bodies, si.jindex);
			cvjDef.targetLengths = b2ConstantVolumeJoint.InsertArray1IntoArray2(oi.tlToInsert, cvjDef.targetLengths, si.jindex);
						
			// set init effectiveRadius / targetVolume
			effectiveRadius_target += cvjDef_o.effectiveRadius_target;
			cvjDef.targetVolume += cvjDef_o.targetVolume;
						
			// remove all remaining joints / bodies from this
			oi.cvj.distanceJoints.splice(0, oi.cvj.distanceJoints.length);
			oi.cvj.bodies.splice(0, oi.cvj.bodies.length);
			
			// add location joint back to joints array
			// for automatic destroy
			oi.cvj.distanceJoints[oi.cvj.distanceJoints.length] = oi.joint;
			
			// destroy other
			oi.cvj.DestroySelf();
		}
		
		// if combination was successful
		if(typeof cvjDef !== "undefined") {
			// set init effectiveRadius
			cvjDef.effectiveRadius = Math.sqrt(cvjDef.targetVolume / Math.PI);
			
			// remove all remaining joints / bodies from this
			this.distanceJoints.splice(0, this.distanceJoints.length);
			this.bodies.splice(0, this.bodies.length);
			
			// for each location
			// add location joint back to joints array
			// for automatic destroy
			for(i = 0; i < combineLocations.length; i++) {
				this.distanceJoints[this.distanceJoints.length] = combineLocations[i].self.joint;
			}
			
			// destroy self
			this.DestroySelf();
			
			// create new combined joint
			cvj = this.world.CreateJoint(cvjDef);
			
			// start stepping new combined joint towards target volume
			cvj.VolumeTo(effectiveRadius_target);
			
			// if should return combination
			if(returnCombination === true) {
				return {cvj: cvj, parts: parts};
			}
			else {
				// fire combine event
				// jQuery must be loaded
				// prototype cannot fire/listen for events on non-DOM elements
				// passes new combination joint and parts as parameters to listener function
				if(typeof jQuery !== "undefined") {
					jQuery(this).trigger(b2ConstantVolumeJoint.COMBINE_EVENT, [cvj, parts]);
				}
				
				return true;
			}
		}
	},
	
	// updates split force threshold
	// returns threshold
	UpdateSplitForceThreshold: function () {
		this.m_splitForceThreshold = this.m_splitForceMin + (this.m_splitForceMax - this.m_splitForceMin) * this.GetBodiesPct();
		return this.m_splitForceThreshold;
	},
	
	// sets split forces by joint
	SetSplitForceThresholdPctsByJoint: function (individualForces) {
		this.splitForceThresholdPctsByJoint = individualForces;
	},
	
	// get split forces by joint
	GetSplitForceThresholdPctsByJoint: function () {
		return this.splitForceThresholdPctsByJoint;
	},
	
	// sets split enabled
	SetSplitEnabled: function (bool) {
		this.m_splitEnabled = bool;
	},
	
	// returns split enabled
	GetSplitEnabled: function () {
		return this.m_splitEnabled;
	},
	
	// returns split locations
	SplitLocations: function () {
		return this.splitLocations;
	},
	
	// splits joint based on split info passed
	// returns array of new constant volume joints already added to world if requested, else defaults to event
	Split: function (/* splitLocations,  */returnParts) {
		var splitLocations, parts, loc_curr, loc_next, removeLoc, icb2, inb1, partsTotalVolume, splitTargetRadius, allLocationsReady, cn, cnLength, bd1, bd2, cLength, part, bLV, i, j;
		
		this.findSplitLocations();
		
		splitLocations = this.splitLocations;
		
		// if split locations valid and this can split
		if(this.m_splitEnabled === true && this.bodies.length >= (this.m_splitMinBodies * 2)) {
			
			// if locations valid
			if(typeof splitLocations !== "undefined" && splitLocations.length >= b2ConstantVolumeJoint.SPLIT_MIN_LOCATIONS) {
			
				// if split is not already occurrring
				if(this.m_splitOccurringFlag >= b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX) {
					// for each distance joint split location
					// get index of joint
					for(i = splitLocations.length - 1; i >= 0; i--) {
						loc_curr = splitLocations[i];
						
						// get index of joint in this
						loc_curr.index = this.distanceJoints.indexOf(loc_curr.joint);
						
						// if should remove location from list
						if(loc_curr.index === -1) {
							splitLocations.splice(i, 1);
						}
					}
					
					// for each distance joint split location
					// make sure locations have at least 2 joints separating them
					for(i = splitLocations.length - 1; i >= 0; i--) {
						removeLoc = false;
						
						loc_curr = splitLocations[i];
						loc_next = splitLocations[(i >= splitLocations.length - 1) ? 0 : (i + 1)];
						
						icb2 = this.bodies.indexOf(loc_curr.joint.m_body2);
						inb1 = this.bodies.indexOf(loc_next.joint.m_body1);
						
						// if location is too close to another (next or prev vs curr)
						if(inb1 === icb2 || (inb1 > icb2 && ((inb1 - icb2) + 1) < this.m_splitMinBodies) || (icb2 > inb1 && ((this.bodies.length - icb2) + inb1 + 1) < this.m_splitMinBodies)) {
							splitLocations.splice(i, 1);
						}
					}
					
					// if more than one locations
					if(splitLocations.length >= b2ConstantVolumeJoint.SPLIT_MIN_LOCATIONS) {
		/*
						// if only one location
						// generate an additional location
						if(splitLocations.length === 1) {
							//console.log("SPLIT > only one valid location passed");
							return parts;
						}
		*/
						
						// set is splitting
						this.m_splitOccurringFlag = 0;
						
						// for each split location with a valid joint
						partsTotalVolume = 0;
						for(i = 0; i < splitLocations.length; i++) {
							loc_curr = splitLocations[i];
							loc_next = splitLocations[(i >= splitLocations.length - 1) ? 0 : (i + 1)];
							
							// create constant volume joint def
							// for current and next
							loc_curr.cvjDef = this.BasicCopyAsDef(loc_curr.joint.m_body2, loc_next.joint.m_body1, true);
							
							// add volume of cvjDef to partsTotalVolume
							partsTotalVolume = partsTotalVolume + this.GetVolumeFromRadius(loc_curr.cvjDef.effectiveRadius_target);
							
							// last distance joint is new connector
							loc_curr.connector = loc_curr.cvjDef.distanceJoints[loc_curr.cvjDef.distanceJoints.length - 1];
						}
						
						// start inflating this joint towards target volume that will match total of volumes of all parts
						splitTargetRadius = Math.sqrt(partsTotalVolume / Math.PI);
						this.VolumeTo(splitTargetRadius, b2ConstantVolumeJoint.STEPS_TO_SPLIT_LENGTH * 2);
					}
				}
				
				// if split is occuring
				if(this.m_splitOccurringFlag < b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX) {
					allLocationsReady = false;
					
					// increase split occurring flag
					this.m_splitOccurringFlag++;
					
					// for each split location with connector
					// check connector length
					for(i = 0; i < splitLocations.length; i++) {
						loc_curr = splitLocations[i];
						
						// if has connector and connector is not ready
						if(typeof loc_curr.connector !== "undefined") {
							cn = loc_curr.connector;
							cnLength = cn.GetLength();
							
							// if connector target length is not average length, step towards
							if(cnLength !== this.m_avgLength) {
								cn.SetLength(cnLength + ((this.m_avgLength - cnLength) / b2ConstantVolumeJoint.STEPS_TO_SPLIT_LENGTH));
							}
							
							// check if close enough
							bd1 = cn.m_body1;
							bd2 = cn.m_body2;
							cLength = b2Math.Length(bd2.m_position.x - bd1.m_position.x, bd2.m_position.y - bd1.m_position.y);
							
							// if connector bodies are separated by less than twice the average length of this
							if(cLength < this.m_avgLength * (b2ConstantVolumeJoint.SPLIT_CONNECTOR_LENGTH_MOD * (1 - (loc_curr.cvjDef.bodies.length / this.bodies.length)))) {
								// set all locations not ready
								allLocationsReady = true;
							}
						}
					}
					
					// if all split locations ready
					if(allLocationsReady === true || this.m_splitOccurringFlag >= b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX) {
						// init parts
						parts = [];
						
						// for each split location
						for(i = 0; i < splitLocations.length; i++) {
							loc_curr = splitLocations[i];
							
							// set connector length
							loc_curr.connector.SetLength(this.m_avgLength);
							
							// create part
							parts[parts.length] = {cvjDef: loc_curr.cvjDef, pct: (loc_curr.cvjDef.bodies.length / this.bodies.length)};
						}
					}
				}
			}	
		}
		
		// if parts valid
		if(typeof parts !== "undefined" && parts.length > 0 && parts.length === splitLocations.length) {
			// remove all remaining joints / bodies from this
			this.distanceJoints.splice(0, this.distanceJoints.length);
			this.bodies.splice(0, this.bodies.length);
			
			// for each location
			// add location joint to joints array
			// for automatic destroy
			for(i = 0; i < splitLocations.length; i++) {
				loc_curr = splitLocations[i];
				
				this.distanceJoints.unshift(loc_curr.joint);
			}
			
			// destroy self
			this.DestroySelf();
			
			// create new constant volume joint for each part
			for(i = 0; i < parts.length; i++) {
				part = parts[i];
				part.joint = this.world.CreateJoint(part.cvjDef);
				part.joint.VolumeTo(part.cvjDef.effectiveRadius_target, b2ConstantVolumeJoint.STEPS_TO_SPLIT_LENGTH * 2);
				
				for(j = 0; j < part.joint.bodies.length; j++) {
					bLV = part.joint.bodies[j].GetLinearVelocity();
					bLV.Multiply(0.5);
				}
			}
			
			// if does not need to return parts
			if(returnParts === true) {
				return parts;
			}
			else {
				// fire split event
				// jQuery must be loaded
				// prototype cannot fire/listen for events on non-DOM elements
				// passes parts as parameter to listener function
				if(typeof jQuery !== "undefined") {
					jQuery(this).trigger(b2ConstantVolumeJoint.SPLIT_EVENT, [parts]);
				}
				
				return true;
			}
		}
	},
	
	DestroySelf: function () {
		// set hold combine / split flag
		this.m_csHoldFlag = 0;
		this.m_splitOccurringFlag = 0;
		
		// if not destroyed yet
		if(this.m_destroyed !== true) {
			// destroys all joint bodies
			for(i = 0; i < this.bodies.length; i++) {
				this.bodies[i].m_cvj = undefined;
				this.world.DestroyBody(this.bodies[i]);
			}
			
			// destroys joint
			this.world.DestroyJoint(this);
		}
	},
	
	//--------------- Internals Below -------------------

	

	initialize: function(def){
		var nextIndex, c1, c2, distVec, dist, i;
		
		// The constructor for b2Joint
		// initialize instance variables for references
		this.m_node1 = new b2JointNode();
		this.m_node2 = new b2JointNode();
		//
		this.m_type = def.type;
		this.m_prev = null;
		this.m_next = null;
		this.m_body1 = def.body1;
		this.m_body2 = def.body2;
		this.m_collideConnected = def.collideConnected;
		this.m_islandFlag = false;
		this.m_userData = def.userData;
		//
		// super call does not work?
		//super(def);
		
		// init misc properties
		this.centerPos = new b2Vec2(0, 0);
		this.m_collideConnected = false;
		this.m_impulse = 0.0;
		this.m_splitOccurringFlag = b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX;
		this.m_csHoldFlag = 0;
		this.m_combineEnabled = def.combineEnabled;
		this.combineLocations = [];
		this.m_splitEnabled = def.splitEnabled;
		this.m_splitForceMin = def.splitForceMin;
		this.m_splitForceMax = def.splitForceMax;
		this.m_splitForceBodyCap = def.splitForceBodyCap;
		this.m_splitMinBodies = def.splitMinBodies;
		this.m_splitForceThreshold = this.m_splitForceMax;
		this.splitForceThresholdPctsByJoint = [];
		this.splitLocations = [];
		
		// check if enough bodies
		if (def.bodies.length > b2ConstantVolumeJoint.MIN_BODIES) {
			this.world = def.bodies[0].GetWorld();
			this.bodies = def.bodies;
			
			// update split force threshold
			this.UpdateSplitForceThreshold();
			
			// init inflation factor
			this.inflationFactor = (b2ConstantVolumeJoint.isNumber(def.inflationFactor) === true) ? def.inflationFactor : 1;
			this.inflationFactorPrev = this.inflationFactor;
			
			// init target lengths
			if(typeof def.targetLengths !== "undefined" && def.targetLengths.length === this.bodies.length) {
				this.targetLengths = def.targetLengths;
			}
			else {
				this.targetLengths = [];
				for(i = 0; i < this.bodies.length; i++) {
					// set target length
					nextIndex = (i === this.bodies.length - 1) ? 0 : (i + 1);
					c1 = this.bodies[i].GetCenterPosition();
					c2 = this.bodies[nextIndex].GetCenterPosition();
					distVec = new b2Vec2(c1.x, c1.y);
					distVec.Subtract(c2);
					dist = distVec.Length();
					this.targetLengths[i] = dist;
				}
			}
			
			// find average length
			this.m_avgLength = 0;
			for(i = 0; i < this.targetLengths.length; i++) {
				this.m_avgLength = this.m_avgLength + this.targetLengths[i];
			}
			this.m_avgLength = this.m_avgLength / this.targetLengths.length;
			
			// connect body to this
			for(i = 0; i < this.bodies.length; i++) {
				// add to center position
				this.centerPos.Add(this.bodies[i].GetCenterPosition());
			}
			
			// average center position
			this.centerPos.Multiply(1 / this.bodies.length);
			
			// frequency and damping
			if(def.frequencyByBodyCount === true && b2ConstantVolumeJoint.isNumber(def.frequencyMax) === true && b2ConstantVolumeJoint.isNumber(def.frequencyMin) === true) {
				this.m_frequencyByBodyCount = true;
				this.m_frequencyMax = def.frequencyMax;
				this.m_frequencyMin = def.frequencyMin;	
			}
			else {
				this.m_frequencyByBodyCount = false;
				this.m_frequencyMin = this.m_frequencyMax = def.frequencyHz;
			}
			this.frequencyHzPrev = this.frequencyHz = this.GetFrequency();
			this.dampingRatioPrev = this.dampingRatio = def.dampingRatio;
			
			// create distance joints
			if(typeof def.distanceJoints !== "undefined" && def.distanceJoints.length === this.targetLengths.length) {
				this.distanceJoints = def.distanceJoints;
			}
			else {
				this.distanceJoints = [];
				for(i = 0; i < this.targetLengths.length; i++) {
					nextIndex = (i === this.targetLengths.length - 1) ? 0 : i + 1;
					
					// create new distance joint
					this.distanceJoints[i] = b2ConstantVolumeJoint.CreateDistanceJoint(this.bodies[i], this.bodies[nextIndex], undefined, this.frequencyHz, this.dampingRatio);
				}
			}
			
			// get effectiveRadius
			this.effectiveRadius = (b2ConstantVolumeJoint.isNumber(def.effectiveRadius) === true) ? def.effectiveRadius : (this.m_avgLength / (2 * Math.sin(Math.PI / this.distanceJoints.length)));
			
			// set target volume
			this.targetVolume = (b2ConstantVolumeJoint.isNumber(def.targetVolume) === true) ? def.targetVolume : this.GetArea();
			
			// init normals
			if(typeof def.normals !== "undefined" && def.normals.length === this.bodies.length) {
				this.normals = def.normals;
			}
			else {
				this.normals = [];
				for (i = 0; i < this.bodies.length; i++) {
					this.normals[i] = new b2Vec2();
				}
			}
			
			// init tlD
			if(typeof def.tlD !== "undefined" && def.tlD.length === this.bodies.length) {
				this.tlD = def.tlD;
			}
			else {
				this.tlD = [];
				for (i = 0; i < this.bodies.length; i++) {
					this.tlD[i] = new b2Vec2();
				}
			}
	
			this.m_body1 = this.bodies[0];
			this.m_body2 = this.bodies[1];
		}
	},
	
/*
	// DOES NOTHING CURRENTLY
	// destroys all joints
	destructor: function() {
		var i;
		for (i = 0; i < this.distanceJoints.length; i++) {
			this.world.destroyJoint(this.distanceJoints[i]);
		}
	},
*/
	
	// get area of constant volume
	// optional: pass array of {x:n, y:n} (2D vertices), 
	//   and will return area of collection of vertices instead of this
	GetArea: function(vertices) {
		var area = 0, isThis, h1, h2, i;
		
		if(typeof vertices !== "undefined" && vertices.length > 0) {
			isThis = false;
		}
		else {
			isThis = true;
			vertices = this.bodies;
		}
		
		// check
		for(i = 0; i < vertices.length; i++){
			h1 = (isThis) ? vertices[i].GetCenterPosition() : vertices[i];
			h2 = (isThis) ? vertices[(i+1) % vertices.length].GetCenterPosition() : vertices[(i+1) % vertices.length];
			
			area += (h1.x * h2.y - h2.x * h1.y);
		}
		
		return area * 0.5;
	},
	
	PrepareVelocitySolver: function(step) {
		var prevIndex, nextIndex, nc, pc, d, i;
		
		this.m_step = step;
		
		// update inflation step
		this.VolumeToStep();
		
		d = this.tlD;
		
		for (i = 0; i < this.bodies.length; i++) {
			prevIndex = (i === 0) ? this.bodies.length - 1 : i - 1;
			nextIndex = (i === this.bodies.length - 1) ? 0 : i + 1;
			nc = this.bodies[nextIndex].GetCenterPosition();
			pc = this.bodies[prevIndex].GetCenterPosition();
			d[i].Set(nc.x, nc.y);
			d[i].Subtract(pc);
		}
		
		if(b2World.s_enableWarmStarting) {
			this.m_impulse *= step.dtRatio;
			//float lambda = -2.0f * crossMassSum / dotMassSum;
			//System.out.println(crossMassSum + " " +dotMassSum);
			//lambda = MathUtils.clamp(lambda, -Settings.maxLinearCorrection, Settings.maxLinearCorrection);
			//m_impulse = lambda;
			for (i = 0; i < this.bodies.length; i++) {
				this.bodies[i].m_linearVelocity.x += this.bodies[i].m_invMass * d[i].y * 0.5 * this.m_impulse;
				this.bodies[i].m_linearVelocity.y += this.bodies[i].m_invMass * -d[i].x * 0.5 * this.m_impulse;
			}
		}
		else {
			this.m_impulse = 0.0;
		}
	},
	
	SolveVelocityConstraints: function(step) {
		var crossMassSum = 0.0, dotMassSum = 0.0, prevIndex, nextIndex, nc, pc, lambda, d, i;
		
		d = this.tlD;

		for(i = 0; i < this.bodies.length; i++) {
			prevIndex = (i === 0) ? this.bodies.length - 1 : i - 1;
			nextIndex = (i === this.bodies.length - 1) ? 0 : i + 1;
			nc = this.bodies[nextIndex].GetCenterPosition();
			pc = this.bodies[prevIndex].GetCenterPosition();
			d[i].Set(nc.x, nc.y);
			d[i].Subtract(pc);
			dotMassSum += (d[i].LengthSquared() / this.bodies[i].GetMass());
			crossMassSum += b2Math.b2CrossVV(this.bodies[i].GetLinearVelocity(), d[i]);
		}
		
		lambda = -2.0 * (crossMassSum / dotMassSum);
		lambda = Math.max(-b2Settings.b2_maxLinearCorrection, Math.min(lambda, b2Settings.b2_maxLinearCorrection));

		this.m_impulse += lambda;
		
		for (i = 0; i < this.bodies.length; i++) {
			this.bodies[i].m_linearVelocity.x += this.bodies[i].m_invMass * d[i].y * 0.5 * lambda;
			this.bodies[i].m_linearVelocity.y += this.bodies[i].m_invMass * -d[i].x * 0.5 * lambda;
		}
	},
	
	// returns boolean done
	SolvePositionConstraints: function() {
		return this.constrainEdges(this.m_step);
	},
	
	/**
	 * Apply the position correction to the particles.
	 * @param step
	 * returns boolean
	 */
	constrainEdges: function(step) {
		var perimeter = 0.0, deltaArea, toExtrude, nextIndex, c1, c2, dx, dy, dist, delta, norm, newCenter, done, i;
		
		// zero out center position and max radius
		this.centerPos.SetZero();
		this.maxRadius = 0;
		
		for(i = 0; i < this.bodies.length; i++) {
			nextIndex = (i === this.bodies.length - 1) ? 0 : i + 1;
			c1 = this.bodies[i].GetCenterPosition();
			c2 = this.bodies[nextIndex].GetCenterPosition();
			dx = c2.x - c1.x;
			dy = c2.y - c1.y;
			dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < b2Settings.b2_EPSILON) {
				dist = 1.0;
			}
			this.normals[i].x = dy / dist;
			this.normals[i].y = -dx / dist;
			perimeter += dist;
			
			// add to center
			this.centerPos.Add(c1);
		}
		
		// average center position
		this.centerPos.Multiply(1 / this.bodies.length);

		deltaArea = this.targetVolume - this.GetArea();
		toExtrude = 0.5 * deltaArea / perimeter; //*relaxationFactor
		//float sumdeltax = 0.0f;
		done = true;
		for(i = 0; i < this.bodies.length; i++) {
			nextIndex = (i === this.bodies.length - 1) ? 0 : i + 1;
			delta = new b2Vec2(toExtrude * (this.normals[i].x + this.normals[nextIndex].x),
			                            toExtrude * (this.normals[i].y + this.normals[nextIndex].y));
			//sumdeltax += dx;
			norm = delta.Length();
			if(norm > b2Settings.b2_maxLinearCorrection){
				delta.Multiply(b2Settings.b2_maxLinearCorrection / norm);
			}
			if(norm > b2Settings.b2_linearSlop){
				done = false;
			}
			
			newCenter = this.bodies[nextIndex].GetCenterPosition();
			newCenter.Add(delta);
			
			// get maximum radius
			this.maxRadius = Math.max(this.maxRadius, b2Math.Length(this.centerPos.x - newCenter.x, this.centerPos.y - newCenter.y));
			
			//this.bodies[nextIndex].
			//this.bodies[nextIndex].SetCenterPosition(newCenter, this.bodies[nextIndex].GetRotation());
			
			//this.bodies[nextIndex].m_sweep.c.x += delta.x;
			//this.bodies[nextIndex].m_sweep.c.y += delta.y;
			//this.bodies[nextIndex].synchronizeTransform();
			
			//this.bodies[nextIndex].m_linearVelocity.x += delta.x * step.inv_dt;
			//this.bodies[nextIndex].m_linearVelocity.y += delta.y * step.inv_dt;
		}
		
/*
		if(this.m_csHoldFlag < b2ConstantVolumeJoint.CS_HOLD_STEPS) {
			this.m_csHoldFlag++;
		}
		else {
			// if split enabled
			if(this.m_splitEnabled === true) {
				this.Split();
			}
			
			// check for combine
			if(this.m_combineEnabled === true) {
				this.Combine();
			}
		}
*/
			
		return done;
	},
	
	// finds and stores splittable joints
	findSplitLocations: function () {
		var preAreaFixLocations, dj, rf, sft, slArea, sl, i;
		
		// clear current split locations
		if(this.splitLocations.length > 0 && this.m_splitOccurringFlag >= b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX) {
			this.splitLocations = [];
		}
		
		// if split disabled
		if(this.m_splitEnabled !== true || this.m_csHoldFlag !== b2ConstantVolumeJoint.CS_HOLD_STEPS || this.m_splitOccurringFlag < b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX || this.bodies.length < (this.m_splitMinBodies * 2) || this.m_destroyed === true) {
			return;
		}
		
		// init pre area fix locations
		preAreaFixLocations = [];
		
		// iterate through each distance joint
		for(i = 0; i < this.distanceJoints.length; i++) {
			dj = this.distanceJoints[i];
			rf = dj.GetReactionForce();
						
			// set split force threshold for this joint
			// if should set by joint
			if(typeof this.splitForceThresholdPctsByJoint !== "undefined" && this.splitForceThresholdPctsByJoint.length === this.distanceJoints.length) {
				sft = this.m_splitForceMin + (this.m_splitForceMax - this.m_splitForceMin) * this.splitForceThresholdPctsByJoint[i];
			}
			// else default to global split force threshold
			else {
				sft = this.m_splitForceThreshold;
			}
								
			// if joint reaction force is large enough
			if(Math.abs(rf.x) >= sft || Math.abs(rf.y) >= sft) {
				// store split info
				preAreaFixLocations[preAreaFixLocations.length] = {joint: dj, index: i};
			}
		}
		
		// iterate through each split location
		// find and isolate areas of possible split joints that are side by side
		// remove all joints in area except center joint, rounded down
		if(preAreaFixLocations.length >= b2ConstantVolumeJoint.SPLIT_MIN_LOCATIONS) {
			slArea = {};
			for(i = preAreaFixLocations.length - 1; i >= 0; i--) {
				sl = preAreaFixLocations[i];
				
				// if is within minimum bodies area, add to area
				if(b2ConstantVolumeJoint.isNumber(slArea.lastIndex) === true && slArea.lastIndex <= sl.index + 1) {
					// store location in area
					slArea.locations[slArea.locations.length] = sl;
				}
				// else if not within minimum bodies area
				else {
					if(typeof slArea.locations !== "undefined") {
						// remove mid location from slArea and add to split locations
						this.splitLocations.unshift(slArea.locations.splice(Math.floor(slArea.locations.length * 0.5), 1)[0]);
					}
					
					// re-init locations of area
					slArea.locations = [sl];
				}
				
				// store last index
				slArea.lastIndex = sl.index;
				
				// if should process area again for final
				if(i === 0) {
					// remove mid location from slArea and add to split locations
					this.splitLocations.unshift(slArea.locations.splice(Math.floor(slArea.locations.length * 0.5), 1)[0]);
				}
			}
		}
	},
	
	// finds all contact locations with other constant volume joints
	findCombineLocations: function () {
		var bd, cn, cnc, bdo, bdti, bdoi, cbdiList, cbdi, skipContact, ojpb1c, tjnb2c, ojnb2c, tjpb1c, tnopDist, ontpDist, i, j, b;
		
		// clear current combine locations
		if(this.combineLocations.length > 0) {
			this.combineLocations = [];
		}
		
		// if combine disabled
		if(this.m_combineEnabled !== true || this.m_csHoldFlag !== b2ConstantVolumeJoint.CS_HOLD_STEPS || this.m_splitOccurringFlag < b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX || this.m_destroyed === true) {
			return;
		}
		
		// search each body
		for(i = 0; i < this.bodies.length; i++) {
			bd = this.bodies[i];
			
			// if body is not in right place, skip
			if(bd.m_cvj !== this) {
				continue;
			}
			
			// Search all contacts connected to this body.
			for (cn = bd.m_contactList; cn !== null; cn = cn.next) {
				cnc = cn.contact;
				
				// get other body of contact
				if(bd === cn.contact.m_shape1.m_body) {
					bdo = cn.contact.m_shape2.m_body;
				}
				else {
					bdo = cn.contact.m_shape1.m_body;
				}
				
				// if other body is part of constant volume joint, not this cvj, and can combine
				if(typeof bdo.m_cvj !== "undefined" && bdo.m_cvj !== this && bdo.m_cvj.m_combineEnabled === true && bdo.m_cvj.m_csHoldFlag === b2ConstantVolumeJoint.CS_HOLD_STEPS && bdo.m_cvj.m_splitOccurringFlag >= b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX) {
					// no need for more than one combine location per constant volume joint pair
					// if current combine locations exist
					if(this.combineLocations.length > 0) {
												
						// for each combine location
						for(b = 0; b < this.combineLocations.length; b++) {
							// if other constant volume joint is current other cvj
							if(this.combineLocations[b].other.cvj === bdo.m_cvj) {
								// skip to next contact
								skipContact = true;
								break;
							}
						}
						
						// if should skip to next contact
						if(skipContact === true) {
							continue;
						}
					}
					
					// init info
					bdti = {bd: bd, cvj: this};
					bdoi = {bd: bdo, cvj: bdo.m_cvj};	
					
					// get distance joints of next and prev for each body
					cbdiList = [bdti, bdoi];
					for(b = 0; b < cbdiList.length; b++) {
						cbdi = cbdiList[b];
						
						// for each joint of body
						for (j = cbdi.bd.m_jointList; j !== null; j = j.next) {
							// if is distance joint
							if(j.joint.m_type === b2Joint.e_distanceJoint) {
								// set dist joint as next or prev
								// based on whether body is body1 or body2
								if(cbdi.bd === j.joint.m_body1) {
									// next
									cbdi.jn = j.joint;
								}
								else {
									// prev
									cbdi.jp = j.joint;
								}
							}
						}
					}
					
					// find distances of other body pairs
					ojpb1c = bdoi.jp.m_body1.GetCenterPosition();
					tjnb2c = bdti.jn.m_body2.GetCenterPosition(); 
					ojnb2c = bdoi.jn.m_body2.GetCenterPosition();
					tjpb1c = bdti.jp.m_body1.GetCenterPosition();
					tnopDist = b2Math.Length(ojpb1c.x - tjnb2c.x, ojpb1c.y - tjnb2c.y);
					ontpDist = b2Math.Length(ojnb2c.x - tjpb1c.x, ojnb2c.y - tjpb1c.y);
					
					// find next closest body pair (one in this joint, one in other)
					if(tnopDist < ontpDist) {
						bdti.joint = bdti.jn;
						bdoi.joint = bdoi.jp;
					}
					else {
						bdti.joint = bdti.jp;
						bdoi.joint = bdoi.jn;
					}
					
					// store as location
					this.combineLocations[this.combineLocations.length] = {self: bdti, other: bdoi};
				}
			}
		}
	},
	
	bodies:null,					// array of objects
	m_avgLength:null,				// number
	targetLengths:null,				// array of numbers
	targetVolume:null,				// number
	targetVolumePrev:null,			// number
	m_frequencyByBodyCount:null,	// boolean
	m_frequencyMax:null,			// number
	m_frequencyMin:null,			// null
	frequencyHz:null,				// number
	frequencyHzPrev:null,			// number
	dampingRatio:null,				// number
	dampingRatioPrev:null,			// number
	world:null,						// object
	normals:null,					// array of 2d vectors
	m_step:null,					// number
	m_impulse:null,					// number
	distanceJoints:null,			// array of joints
	tlD:null,						// array of 2d vectors
	centerPos:null,					// object (x,y)
	effectiveRadius:null,			// number
	effectiveRadiusPrev:null,		// number
	maxRadius:null,					// number
	inflationFactor:null,			// number
	inflationFactorPrev:null,		// number
	m_splitOccurringFlag:null,		// number
	m_csHoldFlag:null,				// number
	m_combineEnabled:null,			// boolean
	combineLocations:null,			// array
	m_splitEnabled:null,			// boolean
	m_splitForceMin:null,			// number
	m_splitForceMax:null,			// number
	m_splitForceBodyCap:null,		// number
	m_splitForceThreshold:null,		// number
	splitForceThresholdPctsByJoint:null,		// array
	m_splitMinBodies:null,			// number
	splitLocations:null				// array
});

b2ConstantVolumeJoint.SPLIT_EVENT = "joint:split";
b2ConstantVolumeJoint.COMBINE_EVENT = "joint:combine";
b2ConstantVolumeJoint.MIN_BODIES = 3;
b2ConstantVolumeJoint.SPLIT_MIN_LOCATIONS = 2;
b2ConstantVolumeJoint.CS_HOLD_STEPS = 10;
b2ConstantVolumeJoint.SPLIT_OCCURRING_STEPS_MAX = 15;
b2ConstantVolumeJoint.VOLUME_TO_ITERATIONS = 30;
b2ConstantVolumeJoint.STEPS_TO_SPLIT_LENGTH = 4;
b2ConstantVolumeJoint.SPLIT_CONNECTOR_LENGTH_MOD = 4;

b2ConstantVolumeJoint.isNumber = function (value) {
	return typeof value === 'number' && isFinite(value);
};

// creates distance joint between two bodies with optional target length, frequency, and damping
b2ConstantVolumeJoint.CreateDistanceJoint = function (body1, body2, targetLength, frequencyHz, dampingRatio) {
	var djd, c1, c2, dj;
	
	// create new distance joint
	djd = new b2DistanceJointDef();
	djd.body1 = body1;
	djd.body2 = body2;
	c1 = djd.body1.GetCenterPosition();
	c2 = djd.body2.GetCenterPosition();
	djd.anchorPoint1.Set(c1.x, c1.y);
	djd.anchorPoint2.Set(c2.x, c2.y);
	djd.frequencyHz = (b2ConstantVolumeJoint.isNumber(frequencyHz) === true) ? frequencyHz : this.frequencyHz;
	djd.dampingRatio = (b2ConstantVolumeJoint.isNumber(dampingRatio) === true) ? dampingRatio : this.dampingRatio;
	dj = djd.body1.GetWorld().CreateJoint(djd);
	
	// set target length
	if(b2ConstantVolumeJoint.isNumber(targetLength) === true) {
		dj.SetLength(targetLength);
	}
	
	return dj;
};

// extracts all items in an array after and before requested index
b2ConstantVolumeJoint.ExtractFromArrayAroundIndex = function (arrayTarget, index, includeItemAtIndex) {
	var result = [];
	
	// extract all items after index
	if(index < arrayTarget.length - 1) {
		result = result.concat(arrayTarget.slice(index + 1, arrayTarget.length));
	}
	
	// extract all items before index
	if(index > 0) {
		result = result.concat(arrayTarget.slice(0, index));
	}
	
	// check include
	if(includeItemAtIndex === true) {
		result[result.length] = arrayTarget[index];
	}
	
	return result;
};

// inserts one array into another at requested index
b2ConstantVolumeJoint.InsertArray1IntoArray2 = function (arrayToInsert, arrayTarget, index, replaceItemAtIndex) {
	var result = [];
	
	// before
	if(index > 0) {
		result = result.concat(arrayTarget.slice(0, index));
	}

	// check replace
	if(replaceItemAtIndex !== true) {
		result[result.length] = arrayTarget[index];
	}
	
	// insert
	result = result.concat(arrayToInsert);

	// after
	if(index < arrayTarget.length - 1) {
		result = result.concat(arrayTarget.slice(index + 1, arrayTarget.length));
	}
	
	return result;
};