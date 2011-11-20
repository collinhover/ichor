if(typeof Box2DLoader === 'undefined') {

var Box2DLoader = {};

Box2DLoader.prototypeDirectory = '';
Box2DLoader.box2DDirectory = '';
Box2DLoader.prototypeScript = 'prototype-1.7.0.js';
Box2DLoader.preBox2DScripts = [];
Box2DLoader.box2DScripts = [ 'common/b2Settings.js',
					    'common/math/b2Vec2.js',
					    'common/math/b2GravityNode2.js',
					    'common/math/b2Mat22.js',
					    'common/math/b2Math.js',
					    'collision/b2AABB.js',
					    'collision/b2Bound.js',
					    'collision/b2BoundValues.js',
					    'collision/b2Pair.js',
					    'collision/b2PairCallback.js',
					    'collision/b2BufferedPair.js',
					    'collision/b2PairManager.js',
					    'collision/b2BroadPhase.js',
					    'collision/b2Collision.js',
					    'collision/Features.js',
					    'collision/b2ContactID.js',
					    'collision/b2ContactPoint.js',
					    'collision/b2Distance.js',
					    'collision/b2Manifold.js',
					    'collision/b2OBB.js',
					    'collision/b2Proxy.js',
					    'collision/ClipVertex.js',
					    'collision/shapes/b2Shape.js',
					    'collision/shapes/b2ShapeDef.js',
					    'collision/shapes/b2BoxDef.js',
					    'collision/shapes/b2CircleDef.js',
					    'collision/shapes/b2CircleShape.js',
					    'collision/shapes/b2MassData.js',
					    'collision/shapes/b2PolyDef.js',
					    'collision/shapes/b2PolyShape.js',
					    'dynamics/b2Body.js',
					    'dynamics/b2BodyDef.js',
					    'dynamics/b2CollisionFilter.js',
					    'dynamics/b2Island.js',
					    'dynamics/b2TimeStep.js',
					    'dynamics/contacts/b2ContactNode.js',
					    'dynamics/contacts/b2Contact.js',
					    'dynamics/contacts/b2ContactConstraint.js',
					    'dynamics/contacts/b2ContactConstraintPoint.js',
					    'dynamics/contacts/b2ContactRegister.js',
					    'dynamics/contacts/b2ContactSolver.js',
					    'dynamics/contacts/b2CircleContact.js',
					    'dynamics/contacts/b2Conservative.js',
					    'dynamics/contacts/b2NullContact.js',
					    'dynamics/contacts/b2PolyAndCircleContact.js',
					    'dynamics/contacts/b2PolyContact.js',
					    'dynamics/b2ContactManager.js',
					    'dynamics/b2World.js',
					    'dynamics/b2WorldListener.js',
					    'dynamics/joints/b2JointNode.js',
					    'dynamics/joints/b2Joint.js',
					    'dynamics/joints/b2JointDef.js',
					    'dynamics/joints/b2DistanceJoint.js',
					    'dynamics/joints/b2DistanceJointDef.js',
					    'dynamics/joints/b2Jacobian.js',
					    'dynamics/joints/b2GearJoint.js',
					    'dynamics/joints/b2GearJointDef.js',
					    'dynamics/joints/b2MouseJoint.js',
					    'dynamics/joints/b2MouseJointDef.js',
					    'dynamics/joints/b2PrismaticJoint.js',
					    'dynamics/joints/b2PrismaticJointDef.js',
					    'dynamics/joints/b2PulleyJoint.js',
					    'dynamics/joints/b2PulleyJointDef.js',
					    'dynamics/joints/b2RevoluteJoint.js',
					    'dynamics/joints/b2RevoluteJointDef.js',
					    'dynamics/joints/b2ConstantVolumeJoint.js',
					    'dynamics/joints/b2ConstantVolumeJointDef.js'];
	Box2DLoader.postBox2DScripts = [];
	Box2DLoader.queuedScripts = [];
	Box2DLoader.loadedScripts = [];
	Box2DLoader.callback;
	Box2DLoader.loadInfo = {remaining:0, complete:0, current:0, total:0, loadPct:0};
	Box2DLoader.updateCallback;
					    
	Box2DLoader.loadAll = function (box2DDirectoryPath, prototypeDirectoryPath, callback, updateCallback, preBox2DScriptsList, postBox2DScriptsList) {
		var main = this, nextScript, i;
		
		// store callback
		if(callback != undefined) {
			main.callback = callback;
		}
		if(updateCallback != undefined) {
			main.updateCallback = updateCallback;
		}
		
		// store pre/post scripts list
		if(preBox2DScriptsList != undefined) {
			for(i = 0; i < preBox2DScriptsList.length; i++) {
				main.preBox2DScripts[main.preBox2DScripts.length] = preBox2DScriptsList[i];
			}
		}
		if(postBox2DScriptsList != undefined) {
			for(i = 0; i < postBox2DScriptsList.length; i++) {
				main.postBox2DScripts[main.postBox2DScripts.length] = postBox2DScriptsList[i];
			}
		}
		
		// get scripts to load
		main.queuedScripts = main.getScriptsToLoad(box2DDirectoryPath, prototypeDirectoryPath);
		
		// set load info
		main.loadInfo.total = main.queuedScripts.length;
		main.updateLoadInfo();
		
		// load first
		main.loadScript(main.queuedScripts[0]);
	};
	
	Box2DLoader.loadScript = function (scriptURL) {
		var main = this;
		jQuery.getScript(scriptURL, function() { main.scriptLoaded(scriptURL); });
	};
	
	Box2DLoader.updateLoadInfo = function () {
		var main = this;
		
		main.loadInfo.remaining = main.queuedScripts.length;
		main.loadInfo.complete = main.loadedScripts.length;
		main.loadInfo.current = main.loadInfo.complete;
		main.loadInfo.loadPct = main.loadInfo.complete / main.loadInfo.total;
		
		// update callback
		if(main.updateCallback != undefined) {
			main.updateCallback(main.loadInfo.loadPct);
		}
	};
	
	Box2DLoader.scriptLoaded = function (script) {
		var main = this, i;
		
		// get index of script in queued scripts
		for(i = 0; i < main.queuedScripts.length; i++) {
			if(main.queuedScripts[i] === script) {
				main.loadedScripts[main.loadedScripts.length] = main.queuedScripts.splice(i, 1)[0];
				break;
			}
		}
		
		// update load info
		main.updateLoadInfo();
		
		// if more to load, load next
		if(main.queuedScripts.length > 0) {
			main.loadScript(main.queuedScripts[0]);
		}
		// if all loaded, perform callback
		else {
			if(main.callback != undefined) {
				main.callback();
			}
		}
	};
	
	Box2DLoader.getScriptsToLoad = function (box2DDirectoryPath, prototypeDirectoryPath) {
		var main = this, scriptsToLoad, i;
		
		// store paths
		if(box2DDirectoryPath != undefined) {
			main.box2DDirectory = box2DDirectoryPath + '/';
		}
		if(prototypeDirectoryPath != undefined) {
			main.prototypeDirectory = prototypeDirectoryPath + '/';
		}
		
		// queue up all required
		scriptsToLoad = [main.prototypeDirectory + main.prototypeScript];
		// queue pre-box2d scripts
		for(i = 0; i < main.preBox2DScripts.length; i++) {
			scriptsToLoad[scriptsToLoad.length] = main.preBox2DScripts[i];
		}
		// queue box2d scripts
		for(i = 0; i < main.box2DScripts.length; i++) {
			scriptsToLoad[scriptsToLoad.length] = main.box2DDirectory + main.box2DScripts[i];
		}
		// queue post-box2d scripts
		for(i = 0; i < main.postBox2DScripts.length; i++) {
			scriptsToLoad[scriptsToLoad.length] = main.postBox2DScripts[i];
		}
		
		return scriptsToLoad;
	};
}