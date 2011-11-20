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

var b2ConstantVolumeJointDef = Class.create();
Object.extend(b2ConstantVolumeJointDef.prototype, b2JointDef.prototype);
Object.extend(b2ConstantVolumeJointDef.prototype, 
{
	initialize: function()
	{
		// The constructor for b2JointDef
		this.type = b2Joint.e_unknownJoint;
		this.userData = null;
		this.body1 = null;
		this.body2 = null;
		this.collideConnected = false;
		//

		this.type = b2Joint.e_constantVolumeJoint;
		this.bodies = [];
		this.frequencyByBodyCount = false;
		this.frequencyMax = 15;
		this.frequencyMin = 0;
		this.frequencyHz = 0;
		this.dampingRatio = 0;
		this.combineEnabled = false;
		this.splitEnabled = false;
		this.splitForceMin = 600;
		this.splitForceMax = 1200;
		this.splitMinBodies = 3;
		this.splitForceBodyCap = 80;
	},
	
	AddBody: function(body) {
		this.bodies[this.bodies.length] = body;
		if(this.bodies.length === 1) {
			this.body1 = body;
		}
		if(this.bodies.length === 2) {
			this.body2 = body;
		}
	},

	bodies:null,
	frequencyByBodyCount:null,
	frequencyMax:null,
	frequencyMin:null,
	frequencyHz:null,
	dampingRatio:null,
	combineEnabled:null,
	splitEnabled:null,
	splitForceMin:null,
	splitForceMax:null,
	splitMinBodies:null,
	splitForceBodyCap:null
	
});
