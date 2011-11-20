/*
 * Ichor
 * http://www.anunstablegrid.com/
 *
 * Copyright 2010, Collin Hover
 *
 * Date: Thurs Jan 27 13:43:00 CST 2011
 */
 
var Ichor = {};

(function () {
	//======================================================================
	//
	//	GLOBAL
	//
	//======================================================================
	
	
	Ichor.frameRate = 30;
	Ichor.initializing = false;
	Ichor.ready = false;
	Ichor.mobileDevice = false;
	Ichor.stageBaseId = "Ichor_stage";
	Ichor.canvasBaseId = "Ichor_canvas";
	
	Ichor.systemUpdateDelay = Ichor.frameRate;
	Ichor.updatingSelf_system = false;
	
	Ichor.stageX = 0;
	Ichor.stageY = 0;
	Ichor.stageRedrawDelay = 30;
	Ichor.updatingSelf_stage = false;
	
	Ichor.physics2DEnabled = true;
	Ichor.updatingSelf_physics2D = false;
	
	Ichor.statsEnabled = true;
	Ichor.statsVisible = false;
	
	Ichor.baseScriptsPath = '';
	Ichor.secondaryScripts = [];
	Ichor.requiredScripts = ['js/ckh/base/Box2DLoader.js'];
	
	// colors properties		
	Ichor.colors = {	w: [255, 255, 255, 1],
					bl: [0, 0, 0, 1],
					c: [0, 255, 255, 1], 
					m: [255, 0, 255, 1], 
					y: [255, 255, 0, 1], 
					k: [0, 0, 0, 1],
					r: [255, 0, 0, 1],
					g: [0, 255, 0, 1],
					b: [0, 0, 255, 1],
					cs1_purple1: [153, 0, 255, 1],
					cs1_purple2: [102, 0, 255, 1],
					cs1_blue1: [0, 102, 255, 1],
					cs1_blue2: [0, 204, 255, 1],
					cs1_bluegreen: [0, 255, 204, 1],
					cs1_green: [0, 255, 102, 1],
					cs1_greenyellow: [102, 255, 0, 1],
					cs1_yellow: [204, 255, 0, 1],
					cs1_yellowred: [255, 204, 0, 1],
					cs1_orange: [255, 102, 0, 1],
					cs1_magenta: [255, 0, 102, 1]};
	Ichor.colors.list = [Ichor.colors.m, Ichor.colors.c, Ichor.colors.cs1_green];
	
	// properties
	Ichor.m_p = {};
	Ichor.m_p.minPageWidth = 900;
	Ichor.m_p.minPageHeight = 600;
	Ichor.m_p.loadCompleteDelayTime = 200;
	Ichor.m_p.loadCompleteFadeTimeOut = 500;
	Ichor.m_p.loadCompleteFadeTimeIn = 300;
	
	// mobile platform properties
	Ichor.m_pMobile = {};
	
	// background
	Ichor.m_p.bg = {};
	Ichor.m_p.bg.id = "bg_source_image";
	Ichor.m_p.bg.innerColor = '#403A3F';
	Ichor.m_p.bg.outerColor = '#FFFFFF';
	
	// mouse joint defaults
	Ichor.m_p.mj = {};
	Ichor.m_p.mj.forceMax = 100000;
	Ichor.m_p.mj.forceMin = 100000;
	Ichor.m_p.mj.forceChangeThreshold = (Ichor.m_p.mj.forceMax - Ichor.m_p.mj.forceMin) * 0.05;
	Ichor.m_p.mj.force = Ichor.m_p.mj.forceMin;
	Ichor.m_p.mj.frequency = 10;
	Ichor.m_p.mj.damping = 1;
	Ichor.m_p.mj.userMouseRadius = 30;
	Ichor.m_p.mj.userConnectRadius = 50;
	
	// physics 2D
	Ichor.m_p.p2D = {};
	Ichor.m_p.p2D.stepDelay = 10;
	Ichor.m_p.p2D.stepDTMax = 1 / 50;
	Ichor.m_p.p2D.stepDTMin = 1 / 150;
	Ichor.m_p.p2D.iterationsPerStep = 10;
	Ichor.m_p.p2D.worldWidth = 10000.0;
	Ichor.m_p.p2D.worldHeight = 10000.0;
	Ichor.m_p.p2D.mouseForce = Ichor.m_p.mj.force;
	Ichor.m_p.p2D.gravityX = 0;
	Ichor.m_p.p2D.gravityY = 0;
	Ichor.m_p.p2D.wallThickness = 200;
	Ichor.m_p.p2D.cvjDrawCurved = true;
	
	// liquid objects
	Ichor.m_p.lqObjs = {};
	Ichor.m_p.lqObjs.overridePhysicsDraw = true;
	Ichor.m_p.lqObjs.drawConnectedCurved = true;
	Ichor.m_p.lqObjs.addDelayMax = 1000;
	Ichor.m_p.lqObjs.addDelayMin = 400;
	Ichor.m_p.lqObjs.gravityInterval = 1000;
	Ichor.m_p.lqObjs.gravityDelayCounter = 0;
	Ichor.m_p.lqObjs.numMax = 3;
	Ichor.m_p.lqObjs.radius = 75;
	Ichor.m_p.lqObjs.vertices = 40;
	Ichor.m_p.lqObjs.frequencyByBodyCount = true;
	Ichor.m_p.lqObjs.frequencyMax = 12;
	Ichor.m_p.lqObjs.frequencyMin = 7;
	Ichor.m_p.lqObjs.frequency = Ichor.m_p.lqObjs.frequencyMin;
	Ichor.m_p.lqObjs.damping = 1;
	Ichor.m_p.lqObjs.combineEnabled = true;
	Ichor.m_p.lqObjs.splitEnabled = true;
	Ichor.m_p.lqObjs.splitMinBodies = 6;
	Ichor.m_p.lqObjs.splitForceMin = 300;
	Ichor.m_p.lqObjs.splitForceMax = 800;
	Ichor.m_p.lqObjs.valueMax = 5;
	Ichor.m_p.lqObjs.valueMin = -5;
	Ichor.m_p.lqObjs.randomShapeMod = 6;
	Ichor.m_p.lqObjs.randomShapeMax = 2;
	Ichor.m_p.lqObjs.randomShapeMin = 0;
	Ichor.m_p.lqObjs.initInflateMax = 1;
	Ichor.m_p.lqObjs.initInflateMin = 1;
	Ichor.m_p.lqObjs.colorExpCeil = 0.5;
	Ichor.m_p.lqObjs.colorExpFloor = 1.5;
	Ichor.m_p.lqObjs.colorList = Ichor.colors.list;
	Ichor.m_p.lqObjs.colorAlpha = 0.4;
	Ichor.m_p.lqObjs.colorShift = {};
	Ichor.m_p.lqObjs.colorShift.time = 600; 
	Ichor.m_p.lqObjs.colorShift.delay = 30;
	Ichor.m_p.lqObjs.initColor = [255, 255, 255, 0];
	Ichor.m_p.lqObjs.vertexBody = {};
	Ichor.m_p.lqObjs.vertexBody.Radius = 2.5;
	Ichor.m_p.lqObjs.vertexBody.Density = 0.1;
	Ichor.m_p.lqObjs.vertexBody.Restitution = 0.1;
	Ichor.m_p.lqObjs.vertexBody.Friction = 0.2;
	Ichor.m_p.lqObjs.mouseConnect = {};
	Ichor.m_p.lqObjs.mouseConnect.centerEvenDistributionMod = 0.5;
	Ichor.m_p.lqObjs.mouseConnect.cbDistPctUDMod = 0.9;
	Ichor.m_p.lqObjs.mouseConnect.cbDistPctDivMod = 8;
	Ichor.m_p.lqObjs.mouseConnect.minDistPct = 0;//0.005;
	Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsByJoint = true;
	Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsMin = 0.5;
	Ichor.m_p.lqObjs.mouseConnect.vecRadianShiftMin = 0.1;
	Ichor.m_p.lqObjs.mouseConnect.vecRadianShiftSteps = 10;
	Ichor.m_p.lqObjs.mouseConnect.distributionVal = 4;
	Ichor.m_p.lqObjs.mouseConnect.waitCheckDelay = 30;
	Ichor.m_p.lqObjs.mouseConnect.killWaitDelay = 2000;
	Ichor.m_p.lqObjs.states = {};
	Ichor.m_p.lqObjs.states.idle = 'idle';
	
	// liquid activation zone
	Ichor.m_p.laz = {};
	Ichor.m_p.laz.gravity = -600;
	Ichor.m_p.laz.falloffOuter = 300;
	Ichor.m_p.laz.falloffInner = 0;
	Ichor.m_p.laz.radius = 300;
	Ichor.m_p.laz.radiusActivate = Math.max(Ichor.m_p.lqObjs.radius, Ichor.m_p.laz.radius * 0.85);
	Ichor.m_p.laz.frequency = 10;
	Ichor.m_p.laz.damping = 0;
	Ichor.m_p.laz.numVertices = 40;//Ichor.m_p.lqObjs.num;
	Ichor.m_p.laz.vertexBodyRadius = 5;//Ichor.m_p.lqObjs.vertexBody.Radius;
	Ichor.m_p.laz.drawCurved = true;
	Ichor.m_p.laz.RGBA = [255, 255, 255, 0.3];
	Ichor.m_p.laz.mj = {};
	Ichor.m_p.laz.mj.force = 600;
	Ichor.m_p.laz.mj.frequency = 1;
	Ichor.m_p.laz.mj.damping = 0;
	
	// liquid objects (cont)
	Ichor.m_p.lqObjs.ranMoveRadius = Ichor.m_p.laz.falloffOuter;
	Ichor.m_p.lqObjs.ranMoveForce = Math.abs(Ichor.m_p.laz.gravity) * 0.25;
	
	Ichor.degreesToRadians = Math.PI / 180;
	Ichor.radiansToDegrees = 180 / Math.PI;
	Ichor.two_pi = Math.PI * 2;
	
	//======================================================================
	//
	//	UTILS
	//
	//======================================================================
	
	// loads a series of scripts via jQuery's getScript
	Ichor.loadScripts = function (loadInfo) {
		var nextScript = loadInfo.scripts.shift();
		
		// load next script if exists
		if (typeof nextScript !== "undefined") {
			jQuery.getScript(nextScript, function () {
				loadInfo.completed++;
				// update callback if exists
				if (typeof loadInfo.updateCallback !== "undefined") {
					loadInfo.pct = loadInfo.completed / loadInfo.total;
					loadInfo.updateCallback(loadInfo.pct);
				}
				Ichor.loadScripts(loadInfo);
			});
		}
		// else do final callback
		else {
			if (typeof loadInfo.finalCallback !== "undefined") {
				loadInfo.finalCallback();
			}
		}
	};
	
	// clone object - credit to dan beams
	// does not deep copy
	Ichor.copyAIntoB = function (orig, copy) {
		var key;
		
	    // terminal state
	    if (/number|string|boolean|undefined/.test(typeof orig) || null === orig) {
	        return orig;
	    }
	
	    if ("undefined" === typeof copy) {
	        copy = (orig instanceof Array) ? [] : {};
	    }
	
	    for (key in orig) {
	        if (orig !== orig[key]) {
	            copy[key] = orig[key];
	        }
	    }
	
	    return copy;
	};
	
	Ichor.initStats = function (statsContainer) {
		this.stats = {};
		this.stats.init = function (statsContainer) {
			var statsObj = this, t;
			
			// set properties
		    statsObj.t = new Date().getTime() / 1000.0;
		    statsObj.n = 0;
		    statsObj.fps = 0.0;
		    statsObj.update = function () {
		        statsObj.n = statsObj.n + 1;
		        if (statsObj.n === 10) {
		            statsObj.n = 0;
		            t = new Date().getTime() / 1000.0;
		            statsObj.fps = Math.round(10.0 / (t - statsObj.t));
		            statsObj.t = t;
		            if (typeof statsObj.display !== "undefined") {statsObj.display.innerHTML = "FPS: " + statsObj.fps;
		            }
		         }
		    };
		    
		    // if container passed
		    if (typeof statsContainer !== "undefined") {
			    // create div element for stats
			    statsObj.display = document.createElement("div");
				statsObj.display.id = "Stats";
				statsObj.display.style.position = 'absolute';
				statsObj.display.style.left = "0px";
				statsObj.display.style.top = "0px";
				
				// add stats to statsContainer
				statsContainer.appendChild(statsObj.display);
			}
			
			// set interval
			if (statsObj.timeoutId) {
				clearInterval(statsObj.timeoutId);
			}
			setInterval(function () { statsObj.update(); }, Ichor.frameRate);
		};
		
		// start stats
		this.stats.init(statsContainer);
	};
	
	/*
	* checks for event support
	* credit to kangax at perfectionkills.com
	*/
	Ichor.isEventSupported = function (eventName, element) {
	    element = element || document.createElement('div');
	    eventName = 'on' + eventName;
	    
	    var isSupported = (eventName in element);
	    
	    if (!isSupported) {
	      // if it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
	      if (!element.setAttribute) {
	        element = document.createElement('div');
	      }
	      if (element.setAttribute && element.removeAttribute) {
	        element.setAttribute(eventName, '');
	        isSupported = typeof element[eventName] === 'function';
	
	        // if property was created, "remove it" (by setting value to `"undefined"`)
	        if (typeof element[eventName] !== "undefined") {
	          element[eventName] = "undefined";
	        }
	        element.removeAttribute(eventName);
	      }
	    }
	    
	    element = null;
	    return isSupported;
	};
	
	// returns pct (targetColor / 100% <---> 0% / sourceColor) of two colors as RGBA color in array format
	Ichor.averageColorsByPct = function (sourceColor, targetColor, pct) {
		// get shift pct
		var shiftPctTO = Math.max(0, Math.min(1, pct));
		var shiftPctFROM = 1 - shiftPctTO;
		
		var avgColor = [];
		
		// shift to target color
		avgColor[0] = Math.round(sourceColor[0] * shiftPctFROM + targetColor[0] * shiftPctTO);
		avgColor[1] = Math.round(sourceColor[1] * shiftPctFROM + targetColor[1] * shiftPctTO);
		avgColor[2] = Math.round(sourceColor[2] * shiftPctFROM + targetColor[2] * shiftPctTO);
		avgColor[3] = sourceColor[3] * shiftPctFROM + targetColor[3] * shiftPctTO;
		
		return avgColor;
	};
	
	
	//======================================================================
	//
	//	GETTERS / SETTERS
	//
	//======================================================================
	
	// page size
	Ichor.pageWidth = function () {
		return Math.max(this.m_p.minPageWidth, window.innerWidth);
	};
	Ichor.pageHeight = function () {
		return Math.max(this.m_p.minPageHeight, window.innerHeight);
	};
	
	
	//======================================================================
	//
	//	RESIZE
	//
	//======================================================================
	
	// resizes page
	Ichor.resize_page = function () {
		document.body.innerWidth = this.pageWidth();
		document.body.innerHeight = this.pageHeight();
	};
	
	// resize canvas
	Ichor.resize_stage = function () {
		var midX = Ichor.pageWidth() * 0.5;
		var midY = Ichor.pageHeight() * 0.5;
		var oC = Ichor.m_p.bg.outerColor;
		var sourceBGImg, xPos, yPos, bgString, credits;
		
		// set background
		if (typeof Ichor.m_p.bg.id !== "undefined") {
			sourceBGImg = jQuery("#" + Ichor.m_p.bg.id); // document.getElementById(Ichor.m_p.bg.id);
			xPos = "50%";
			yPos = "50%";
			
			// position
			// x
			if (sourceBGImg.width() > 0) {
				xPos = Math.round(midX - sourceBGImg.width() * 0.5) + "px";
			}
			// y
			if (sourceBGImg.height() > 0) {
				yPos = Math.round(midY - sourceBGImg.height() * 0.5) + "px";
			}
			
			// set CSS bg
			bgString = oC + ' url("' + sourceBGImg.attr('src') + '") no-repeat scroll ' + xPos + ' ' + yPos;
			jQuery(Ichor.stageCanvas).css('background', bgString);
		}
			
		if (typeof Ichor.stage !== "undefined") {
			// set new stage size
			Ichor.stageCanvas.width = Ichor.pageWidth();
			Ichor.stageCanvas.height = Ichor.pageHeight();
			
			// redraw stage
			Ichor.drawStage();
		}
		
		// reposition credits
		credits = jQuery("#credits");
		credits.width(130);
		credits.css({	"display":"block",
						"position":"absolute",
						"left":Math.max(0, this.pageWidth() - credits.width() - 10) + "px",
						"top":Math.max(0, this.pageHeight() - credits.height() - 10) + "px"
						});
	};
	 
	// on window resize handler
	Ichor.on_resize = function (e) {
		// resize page
		Ichor.resize_page();
	
		// resize canvas
		Ichor.resize_stage();
	};
	
	
	//======================================================================
	//
	//	SYSTEM UPDATE
	//
	//======================================================================
	
	
	Ichor.updateSystem = function () {
		// physics 2D interaction
		if (Ichor.physics2DEnabled && typeof Ichor.physics2D !== "undefined") {
			// step physics 2D world
			Ichor.physics2D.step();
		}
		
		// draw stage
		Ichor.updateStage();
		
		// set timeout if to continue updating
		if (Ichor.updatingSelf_system === true) {
			clearTimeout(Ichor.systemUpdateTimeoutId);
			Ichor.systemUpdateTimeoutId = setTimeout(function () { Ichor.updateSystem(); }, Ichor.systemUpdateDelay);
		}
	};
	
	
	//======================================================================
	//
	//	GRAPHICS
	//
	//======================================================================
	
	Ichor.updateStage = function () {
		// draw
		Ichor.drawStage();
		
		// set timeout if to continue drawing
		if (Ichor.updatingSelf_stage === true) {
			clearTimeout(Ichor.stageUpdateTimeoutId);
			Ichor.stageUpdateTimeoutId = setTimeout(function () { Ichor.updateStage(); }, Ichor.stageRedrawDelay);
		}
	};
	
	Ichor.clearStage = function () {
		Ichor.stage.clearRect(0, 0, Ichor.pageWidth(), Ichor.pageHeight());
	};
	
	Ichor.drawStage = function () {
		// clear stage
		Ichor.clearStage();
		
		// redraw physics if enabled
		if (Ichor.physics2DEnabled && typeof Ichor.physics2D !== "undefined") {
			Ichor.physics2D.draw();
		}
	};
	
	
	//======================================================================
	//
	//	MATH
	//
	//======================================================================
	
	/* 
	*	checks if value is number
	*/
	Ichor.isNumber = function (value) {
		return typeof value === 'number' && isFinite(value);
	};
	
	/* 
	*	evaluate modified Bessel function In(x) and n=0.(credit to http://Ichorw.astro.rug.nl/~gipsy/sub/bessel.c)
	*/
	Ichor.bessi0 = function (x) {
		var ax = Math.abs(x), ans, y;
		
		if (ax < 3.75) {
	      y = x / 3.75;
	      y = y * y;
	      ans = 1.0 + y * (3.5156229 + y * (3.0899424 + y * (1.2067492 + y * (0.2659732 + y * (0.360768e-1 + y * 0.45813e-2)))));
	   } else {
	      y = 3.75 / ax;
	      ans = (Math.exp(ax) / Math.sqrt(ax)) * (0.39894228 + y * (0.1328592e-1 + y * (0.225319e-2 + y * (-0.157565e-2 + y * (0.916281e-2 + y * (-0.2057706e-1 + y * (0.2635537e-1 + y * (-0.1647633e-1 + y * 0.392377e-2))))))));
	   }
		
		return ans;
	};
	
	/* 
	*	evaluate von mises distribution for value x (radian), with concentration k and distribution angle m
	*/
	Ichor.vonMisesDistribution = function (x, k, m) {
		var vmd = (Math.pow(Math.E, k * Math.cos(x - m))) / (2 * Math.PI * Ichor.bessi0(k));
		return vmd;
	};
	
	/* 
	*	normalize radian to fit around center value
	*/
	Ichor.normalizeRadian = function (radian, center) {
		return radian - Ichor.two_pi * Math.floor((radian + Math.PI - center) / Ichor.two_pi);
	};
	
	// random between max and min numbers
	Ichor.ranMM = function (max, min) {
		var randomResult = 0;
		
		if (max) {
			if (min) {
				randomResult = Math.random() * (max - min) + min;
			}
			else
			{
				randomResult = Math.random() * max;
			}
		}
		
		return randomResult;
	};
	
	// find random numbers between min / max range that add up to target value
	Ichor.ranNumbersThatEqualValue = function (max, min, tValue) {
		var piecesValues, lastVal, initVal, maxVal, deltaVal, pieceVal, val, b;
		
		// init piecesValues list
		piecesValues = {};
		for(b = 0; b <= max - min; b++) {
			val = b + min;
			
			// if val is not 0
			if (val !== 0) {
				// create new values list in piecesValues
				piecesValues[val] = 0;
			}
		}
		
		// find minimum pieces necessary to equal thought value
		// use equal amounts of values from min to max
		
		// if tValue is positive
		initVal = 0;
		if (tValue > 0) {
			maxVal = max;
			deltaVal = 1;
		}
		// if negative
		else {
			maxVal = min;
			deltaVal = -1;
		}
		
		// start lastVal from max val randomly
		lastVal = Math.round(Math.random() * (maxVal - deltaVal));
		
		// subtract varying values from tValue (b) until 0 is reached
		b = tValue;
		while(b !== 0) {
			lastVal += deltaVal;
			pieceVal = lastVal;
			
			// if tValue is smaller than piece val
			if (Math.abs(b) < Math.abs(pieceVal)) {
				pieceVal = b;
			}
			
			// subtract piece val from b
			b -= pieceVal;
			
			// add 1 count of piece val to piecesValues
			piecesValues[pieceVal]++;
			
			// check lastVal
			if (Math.abs(lastVal) >= Math.abs(maxVal)) {
				lastVal = initVal;
			}
		}
		
		return piecesValues;
	};
	
	
	//======================================================================
	//
	//	PHYSICS 2D
	//
	//======================================================================
	
	// init physics 2D
	Ichor.initPhysics2D = function () {
		// init info object
		Ichor.physics2D = {};
		var p2D = Ichor.physics2D;
		p2D.engine = Ichor;
		p2D.stepping = true;
		p2D.stepDelay = Ichor.m_p.p2D.stepDelay;
		p2D.stepDTMin = Ichor.m_p.p2D.stepDTMin;
		p2D.stepDTMax = Ichor.m_p.p2D.stepDTMax;
		p2D.stepDT = p2D.stepDTMax;
		p2D.iterationsPerStep = Ichor.m_p.p2D.iterationsPerStep;
		p2D.worldWidth = Ichor.m_p.p2D.worldWidth;
		p2D.worldHeight = Ichor.m_p.p2D.worldHeight;
		p2D.mouseForce = Ichor.m_p.p2D.mouseForce;
		p2D.gravityX = Ichor.m_p.p2D.gravityX;
		p2D.gravityY = Ichor.m_p.p2D.gravityY;
		p2D.wallThickness = Ichor.m_p.p2D.wallThickness;
		p2D.cvjDrawCurved = Ichor.m_p.p2D.cvjDrawCurved;
		
		// init backend visual properties
		p2D.backendVisualInfo = {};
		var bevi = p2D.backendVisualInfo;
		bevi.shapeStroke = {lineWidth: 1, strokeStyle: "#FFFFFF"};
		bevi.jointStroke = {lineWidth: 1, strokeStyle: "#00EEEE"};
		bevi.jointPaint = {fillStyle: "#DDDDDD", lineWidth: 1, strokeStyle: "#DDDDDD"};
	
		// init worldAABB
		p2D.worldAABB = new b2AABB();
		p2D.worldAABB.minVertex.Set(-p2D.worldWidth * 0.5, -p2D.worldHeight * 0.5);
		p2D.worldAABB.maxVertex.Set(p2D.worldWidth * 0.5, p2D.worldHeight * 0.5);
		
		// init world
		p2D.gravity = new b2Vec2(p2D.gravityX, p2D.gravityY);
		p2D.doSleep = true;
		p2D.world = new b2World(p2D.worldAABB, p2D.gravity, p2D.doSleep);
		
		// init arrays
		p2D.mouseConnections = [];
		
		// init functions
		// starts physics 2D world
		p2D.start = function () {
			// add resize listener
			jQuery(window).bind('resize', this.resize);
			
			// start stepping
			this.stepping = true;
			Ichor.updatingSelf_physics2D = true;
			this.step();	
		};
		
		// stops/pauses physics 2D world
		p2D.stop = function () {
			// remove resize listener
			jQuery(window).unbind('resize', this.resize);
				
			// stop stepping
			this.stepping = false;
			Ichor.updatingSelf_physics2D = false;
		};
		
		// steps physics 2D world
		p2D.step = function () {
			var timeStep = this.stepDT, iterations = this.iterationsPerStep, p2DObj = this, frameRateMod, newMouseForce, i;
			
			// slow down or speed up physics 2D based on current fps vs expected frame rate
			if (typeof Ichor.stats !== "undefined") {
				frameRateMod = Ichor.stats.fps / Ichor.frameRate;
				newMouseForce = Math.round(Ichor.m_p.mj.forceMin + (Ichor.m_p.mj.forceMax - Ichor.m_p.mj.forceMin) * (1 - frameRateMod));
				
				// if new force value is enough different from current, change all current mouse connections to reflect
				if (newMouseForce !== Ichor.m_p.mj.force && Math.abs(Ichor.m_p.mj.force - newMouseForce) >= Ichor.m_p.mj.forceChangeThreshold) {
					
					Ichor.m_p.p2D.mouseForce = Ichor.m_p.mj.force = newMouseForce;
					for(i = 0; i < p2D.mouseConnections.length; i++) {
						p2D.mouseConnections[i].updateForce(Ichor.m_p.mj.force);
					}
				}
				timeStep = this.stepDT = this.stepDTMin + (this.stepDTMax - this.stepDTMin) * (1 - frameRateMod);
			}
			
			// step world
			this.world.Step(timeStep, iterations);
			
			// set interval for next step, if needed
			if (Ichor.updatingSelf_physics2D === true) {
				clearTimeout(this.stepTimeoutId);
				this.stepTimeoutId = setTimeout(function () { p2DObj.step(); }, this.stepDelay);
			}
		};
		
		// resize
		p2D.resize = function () {
			// recreate walls
			p2D.setWalls();	
		};
		
		// creates walls for physics 2D world based on page size
		p2D.setWalls = function () {
			var world = this.world, wallsMod = p2D.wallThickness * 2, wallsLength = Ichor.pageWidth() * 0.5 + wallsMod, wallsHeight = Ichor.pageHeight() * 0.5 + wallsMod;
			
			// check walls array
			if (typeof this.walls === "undefined") {
				this.walls = [];
			}
			
			// wall create function
			var createWall = function (world, x, y, width, height) {
				var boxSd = new b2BoxDef(), boxBd = new b2BodyDef();
				// wall shape
				boxSd.extents.Set(width, height);
				// wall body
				boxBd.AddShape(boxSd);
				boxBd.position.Set(x,y);
				// create and return
				return world.CreateBody(boxBd);
			};
			
			// destroy all current
			this.destroyWalls();
				
			// top
			this.walls[this.walls.length] = createWall(world, 0, -wallsHeight + wallsMod * 0.5, wallsLength, p2D.wallThickness);
			// right
			this.walls[this.walls.length] = createWall(world, wallsLength - wallsMod * 0.5, 0, p2D.wallThickness, wallsHeight);
			// bottom
			this.walls[this.walls.length] = createWall(world, 0, wallsHeight - wallsMod * 0.5, wallsLength, p2D.wallThickness);
			// left
			this.walls[this.walls.length] = createWall(world, -wallsLength + wallsMod * 0.5, 0, p2D.wallThickness, wallsHeight);
		};
		
		// destroys all walls in physics 2D world
		p2D.destroyWalls = function () {
			var world = this.world, i;
			
			for(i = this.walls.length - 1; i >= 0; i--) {
				world.DestroyBody(this.walls.splice(i, 1)[0]);
			}
		};
		
		// draws interpreted physics data
		p2D.draw = function () {
			// draw backend
			this.drawBE();
		};
		
		// draws backend
		p2D.drawBE = function () {
			var bevi = this.backendVisualInfo, j, b, s;
			
			// draw mouse joints
			this.drawMouseJoints();
			
			var jc = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
			var jcc = 0;
			
			// draw joints
			for (j = this.world.m_jointList; j; j = j.m_next) {
				this.drawJointBE(j, true, true);
				
				if (j.m_highlightState === true) {
					Ichor.stage.stroke({lineWidth: 6, strokeStyle: "#FF0000"});
				}
				else if (j.m_type === b2Joint.e_constantVolumeJoint) {
					Ichor.stage.stroke({lineWidth: 2, strokeStyle: jc[(jcc++) % jc.length]});
				}
				else {
					Ichor.stage.stroke(bevi.jointStroke);
				}
			}
			
			// draw bodies
			for (b = this.world.m_bodyList; b; b = b.m_next) {
				for (s = b.GetShapeList(); s !== null; s = s.GetNext()) {
					this.drawShapeBE(s);
				}
			}
		};
		
		// draws mouse connection
		p2D.drawMouseJoints = function () {
			var bevi = this.backendVisualInfo, mcList = this.mouseConnections, i, b;
			for(i = 0; i < mcList.length; i++) {
				for(b = 0; b < mcList[i].mouseJoints.length; b++) {
					this.drawJointBE(mcList[i].mouseJoints[b], true, true);
					Ichor.stage.stroke(bevi.jointStroke);
				}
			}
		};
		
		// draws backend joint
		p2D.drawJointBE = function (joint, beginPath, endPath, drawAsCurve, nextJointForCurve, prevJointForCurve) {
			var sMidW = this.engine.pageWidth() * 0.5, sMidH = this.engine.pageHeight() * 0.5, i;
			
			// if constant volume (collection of distance joints), recursive
			if (joint.m_type === b2Joint.e_constantVolumeJoint) {
				for(i = 0; i < joint.distanceJoints.length; i++) {
					if (this.cvjDrawCurved) {
						nextJointForCurve = (i === joint.distanceJoints.length - 1) ? joint.distanceJoints[0] : joint.distanceJoints[i + 1];
						prevJointForCurve = (i === 0) ? joint.distanceJoints[joint.distanceJoints.length - 1] : joint.distanceJoints[i - 1];
					}
					this.drawJointBE(joint.distanceJoints[i], ((i === 0) ? true : false), ((i === joint.distanceJoints.length - 1) ? true : false), this.cvjDrawCurved, nextJointForCurve, prevJointForCurve);
				}
			}
			// else draw joint
			else {
				var world = Ichor.physics2D.world, b1 = joint.m_body1, b2 = joint.m_body2,
					p1 = joint.GetAnchor1(), p2 = joint.GetAnchor2(), 
					bp1x = sMidW + b1.m_position.x, bp1y = sMidH + b1.m_position.y, 
					bp2x = sMidW + b2.m_position.x, bp2y = sMidH + b2.m_position.y,
					jp1x = sMidW + p1.x, jp1y = sMidH + p1.y,
					jp2x = sMidW + p2.x, jp2y = sMidH + p2.y,
					p3, jp3x, jp3y, p0, jp0x, jp0y, p3p1DX, p3p1DY, p0p2DX, p0p2DY, cpMod, cp1x, cp1y, cp2x, cp2y;
					
				if (beginPath === true) {
					Ichor.stage.beginPath();
				}
				
				// create path
				if (joint.m_type === b2Joint.e_distanceJoint) {
					if (beginPath === true) {
						Ichor.stage.moveTo(jp1x, jp1y);
					}
					if (drawAsCurve && typeof nextJointForCurve !== "undefined" && typeof prevJointForCurve !== "undefined") {
						p3 = nextJointForCurve.GetAnchor2();
						jp3x = sMidW + p3.x;
						jp3y = sMidH + p3.y;
						p0 = prevJointForCurve.GetAnchor1();
						jp0x = sMidW + p0.x;
						jp0y = sMidH + p0.y;
						p3p1DX = jp1x - jp3x;
						p3p1DY = jp1y - jp3y; 
						p0p2DX = jp2x - jp0x;
						p0p2DY = jp2y - jp0y;
						cpMod = 0.25;
						cp1x = jp1x + p0p2DX * cpMod;
						cp1y = jp1y + p0p2DY * cpMod;
						cp2x = jp2x + p3p1DX * cpMod;
						cp2y = jp2y + p3p1DY * cpMod;
						
						Ichor.stage.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, jp2x, jp2y);
					}
					else {
						Ichor.stage.lineTo(jp2x, jp2y);
					}
				}
				else {
					if (b1 === world.m_groundBody) {
						if (beginPath === true) {
							Ichor.stage.moveTo(jp1x, jp1y);
						}
						Ichor.stage.lineTo(bp2x, bp2y);
					}
					else if (b2 === world.m_groundBody) {
						if (beginPath === true) {
							Ichor.stage.moveTo(jp1x, jp1y);
						}
						Ichor.stage.lineTo(bp1x, bp1y);
					}
					else {
						if (beginPath === true) {
							Ichor.stage.moveTo(bp1x, bp1y);
						}
						Ichor.stage.lineTo(jp1x, jp1y);
						Ichor.stage.lineTo(bp2x, bp2y);
						Ichor.stage.lineTo(jp2x, jp2y);
					}
				}
				
				if (endPath === true) {
					Ichor.stage.closePath();
				}
			}
		};
		
		// draws backend shape
		p2D.drawShapeBE = function (shape) {
			var bevi = this.backendVisualInfo, sMidW = this.engine.pageWidth() * 0.5, sMidH = this.engine.pageHeight() * 0.5, i;
			
			// begin shape path
			Ichor.stage.beginPath();
			
			// draw by shape
			if (shape.m_type === b2Shape.e_circleShape) {
				Ichor.stage.ellipse(sMidW + shape.m_position.x, sMidH + shape.m_position.y, shape.m_radius, shape.m_radius);
			}
			else if (shape.m_type === b2Shape.em_polyShape) {
				
				var tV = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[0]));
				Ichor.stage.moveTo(sMidW + tV.x, sMidH + tV.y);
				for (i = 0; i < shape.m_vertexCount; i++) {
					var v = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[i]));
					Ichor.stage.lineTo(sMidW + v.x, sMidH + v.y);
				}
				Ichor.stage.lineTo(sMidW + tV.x, sMidH + tV.y);
			}
			
			// end shape path
			Ichor.stage.closePath().stroke(bevi.shapeStroke);
		};
		
		// physics mouse joint create
		p2D.createMouseJoint = function (mousePos, itarget, maxForceMod, frequency, damping) {
			var world = this.world;
			var mjd = new b2MouseJointDef();
			var mjdMaxForceMod = (typeof maxForceMod !== "undefined") ? maxForceMod : this.mouseForce;
			mjd.body1 = world.GetGroundBody();
			mjd.body2 = itarget;
			mjd.target.SetV(itarget.GetCenterPosition()); //mousePos
			mjd.maxForce = mjdMaxForceMod * itarget.GetMass();
			mjd.frequencyHz = (typeof frequency !== "undefined") ? frequency : 10.0;
			mjd.dampingRatio = (typeof damping !== "undefined") ? damping : 1.0;
			
			var newMJ = world.CreateJoint(mjd);
			newMJ.SetTarget(mousePos);
			newMJ.p2DBodyRef = itarget;
			
			return newMJ;
		};
		
		// physics mouse joint destroy
		p2D.destroyMouseJoint = function (mjRef) {
			p2D.world.DestroyJoint(mjRef);
		};
		
		// create walls
		p2D.setWalls();
	};
	
	//======================================================================
	//
	//	LIQUID OBJECTS
	//
	//======================================================================
	
	// sets up physics 2D for liquid objects
	Ichor.setupLiquidConsciousness = function () {
		var p2D = Ichor.physics2D, world = p2D.world;
		
		// add gravity node at center of world to attract liquid
		var gnCenterX = 0, gnCenterY = 0, gnGravity = 50, gnFalloffOuter = Math.max(p2D.worldWidth * 0.5, p2D.worldHeight * 0.5), gnFalloffInner = Ichor.m_p.laz.falloffOuter;
		world.AddGravityNode(new b2GravityNode2(gnCenterX, gnCenterY, gnGravity, gnFalloffOuter, gnFalloffInner));
		
		// liquid object properties
		var loi = p2D.baseLiquidObjectInfo = {};
		loi.world = world;
		loi.frequencyHz = Ichor.m_p.lqObjs.frequency;
		loi.dampingRatio = Ichor.m_p.lqObjs.damping;
		loi.numVertices = Ichor.m_p.lqObjs.vertices;
		loi.radPerVertex = (Ichor.two_pi) / loi.numVertices;
		loi.radius = Ichor.m_p.lqObjs.radius;
		loi.vertexBodyRadius = Ichor.m_p.lqObjs.vertexBody.Radius;
		loi.vertexBodyDensity = Ichor.m_p.lqObjs.vertexBody.Density;
		loi.vertexBodyRestitution = Ichor.m_p.lqObjs.vertexBody.Restitution;
		loi.vertexBodyFriction = Ichor.m_p.lqObjs.vertexBody.Friction;
		loi.spacing = 10;
		loi.size = (loi.radius * 2 + loi.spacing);
		loi.initColor = [Ichor.m_p.lqObjs.initColor[0], Ichor.m_p.lqObjs.initColor[1], Ichor.m_p.lqObjs.initColor[2], Ichor.m_p.lqObjs.initColor[3]];
		
		loi.interactive = true;
		loi.drawCurved = p2D.cvjDrawCurved;
		
		loi.minSpawnX = -Ichor.m_p.laz.radiusActivate + loi.size * 0.5;
		loi.minSpawnY = -Ichor.m_p.laz.radiusActivate + loi.size * 0.5;
		loi.maxSpawnX = Ichor.m_p.laz.radiusActivate - loi.size * 0.5;
		loi.maxSpawnY = Ichor.m_p.laz.radiusActivate - loi.size * 0.5;
		
		// init liquid objects array
		p2D.liquidObjects = [];
		
		// update each liquid object
		Ichor.lqObjsUpdateInterval = setInterval(function () {
			// only do if physics world is stepping
			if (p2D.stepping === true) {
				var sMidW = Ichor.pageWidth() * 0.5, sMidH = Ichor.pageHeight() * 0.5, combineList = [], initX, initY, maxX, maxY, currX, currY, deltaCX, deltaCY, i, b;
				
				// update gravity interval counter
				Ichor.m_p.lqObjs.gravityDelayCounter += Ichor.frameRate;
				
				// if gravity will update, init variables
				if (Ichor.m_p.lqObjs.gravityDelayCounter >= Ichor.m_p.lqObjs.gravityInterval) {
					initX = -sMidW;
					initY = -sMidH;
					maxX = sMidW;
					maxY = sMidH;
					currX = Math.random() * (maxX - initX) + initX;
					currY = Math.random() * (maxY - initY) + initY;
					deltaCX = (maxX - initX) / p2D.liquidObjects.length;
					deltaCY = (maxY - initY) / p2D.liquidObjects.length;
				}
				
				// each liquid object
				for(i = 0; i < p2D.liquidObjects.length; i++) {
					var lqObj = p2D.liquidObjects[i];
					var cc = lqObj.joint.GetCenterPosition();
					
					// if liquid object can combine
					if (lqObj.joint.GetCombineEnabled() === true) {
						// check for any liquid objects that are close enough to be combined
						// check distance from center of liquid object to all others
						// do not check those before this or this itself, as those have already checked this
						for(b = i + 1; b < p2D.liquidObjects.length; b++) {
							var oLqObj = p2D.liquidObjects[b];
							
							// if liquid object can combine
							if (oLqObj.joint.GetCombineEnabled() === true) {
								var co = oLqObj.joint.GetCenterPosition();
								var coDist = b2Math.Length(co.x - cc.x, co.y - cc.y);
								
								// if distance <= max radius of liquid object, add to combine list
								if (coDist <= lqObj.joint.maxRadius) {
									combineList[combineList.length] = [lqObj, oLqObj];
								}
							}
						}
					}
					
					// change gravity of each liquid object, if at gravity interval
					if (Ichor.m_p.lqObjs.gravityDelayCounter >= Ichor.m_p.lqObjs.gravityInterval) {
						if (lqObj.joint.GetBodies().length > 0) {
							// if liquidBlob is not connected to mouse
							if (Ichor.liquidConnectedToMouse(lqObj) === false && lqObj.state !== Ichor.m_p.lqObjs.states.activated) {
								lqObj.joint.SetGravityTowardsPoint(currX, currY, Ichor.m_p.lqObjs.ranMoveForce);
							}
							else {
								lqObj.joint.SetGravityZero();
							}
						}
						currX += deltaCX;
						if (currX > maxX) {
							currX = initX;
						}
						currY += deltaCY;
						if (currY > maxY) {
							currY = initY;
						}
					}
				}
				
				// check gravity interval counter and reset as needed
				if (Ichor.m_p.lqObjs.gravityDelayCounter >= Ichor.m_p.lqObjs.gravityInterval) {
					Ichor.m_p.lqObjs.gravityDelayCounter = Ichor.m_p.lqObjs.gravityDelayCounter - Ichor.m_p.lqObjs.gravityInterval;
				}
			}
		}, Ichor.frameRate);
		
		// override physics draw function
		if (Ichor.m_p.lqObjs.overridePhysicsDraw === true) {
			p2D.draw = function () {
				var i, j;
				
				// only draw liquid objects
				if (typeof this.liquidObjects !== "undefined" && this.liquidObjects.length > 0) {
					var drawCurved, nextJointForCurve, prevJointForCurve;
					
					// draw each liquid object
					for(i = 0; i < this.liquidObjects.length; i++) {
						var lqObj = this.liquidObjects[i];
						var lbJoints = lqObj.joint.distanceJoints;
						drawCurved = lqObj.drawCurved;
						if (Ichor.liquidConnectedToMouse(lqObj) === true) {
							drawCurved = Ichor.m_p.lqObjs.drawConnectedCurved;
						}
						
						for(j = 0; j < lbJoints.length; j++) {
							if (drawCurved) {
								nextJointForCurve = (j === lbJoints.length - 1) ? lbJoints[0] : lbJoints[j + 1];
								prevJointForCurve = (j === 0) ? lbJoints[lbJoints.length - 1] : lbJoints[j - 1];
							}
							this.drawJointBE(lbJoints[j], ((j === 0) ? true : false), ((j === lbJoints.length - 1) ? true : false), drawCurved, nextJointForCurve, prevJointForCurve);
						}
									
						// fill visual
						Ichor.stage.fill("fillStyle", lqObj.rgbaColorString());
					}
				}
			};
		}
		
		// conscious liquid area
		Ichor.initLiquidActivationZone();
		
		// liquid consciousness
		Ichor.initLiquidConsciousness();
	};
	
	// inits liquid consciousness
	Ichor.initLiquidConsciousness = function () {
		Ichor.initLiquidObjects(Ichor.m_p.lqObjs.numMax, true);
	};
	
	// creates liquid objects from array of thoughts
	Ichor.initLiquidObjects = function (numLiquidObjects, delayedAdd, delayAddNum) {
		var p2D = Ichor.physics2D, laz = p2D.liquidActivationZone, loi, currInitX = 0, currInitY = 0, delay, b;
		
		// if thought pieces invalid or not passed
		// set random number between 2 - 10
		if (typeof numLiquidObjects === "undefined" || numLiquidObjects < 1) {
			numLiquidObjects = Ichor.ranMM(4, 2);
		}
		
		// check thoughts list to make sure it does not exceed max num liquid objects
		var currNumLO = p2D.liquidObjects.length - ((typeof laz !== "undefined") ? 1 : 0);
		if (currNumLO + numLiquidObjects > Ichor.m_p.lqObjs.numMax) {
			numLiquidObjects = Ichor.m_p.lqObjs.numMax - currNumLO;
		}
		
		// if delayed add
		if (delayedAdd === true && typeof delayAddNum !== "undefined") {
			// counter
			delayAddNum = delayAddNum - 1;
			
			// if counter is greater than 0
			if (delayAddNum > 0) {
				// set delay
				delay = Math.round(Math.random() * (Ichor.m_p.lqObjs.addDelayMax - Ichor.m_p.lqObjs.addDelayMin) + Ichor.m_p.lqObjs.addDelayMin);
				
				// init timeout
				Ichor.m_p.lqObjs.addTimeoutId = setTimeout( function () {
					Ichor.initLiquidObjects(1, true, delayAddNum);
				}, delay);
			}
		}
		
		// create each
		for(b = 0; b < numLiquidObjects; b++) {
			// copy base liquid object properties
			loi = Ichor.copyAIntoB(p2D.baseLiquidObjectInfo);
			
			// liquid frequency by body count
			loi.frequencyByBodyCount = Ichor.m_p.lqObjs.frequencyByBodyCount;
			loi.frequencyMax = Ichor.m_p.lqObjs.frequencyMax;
			loi.frequencyMin = Ichor.m_p.lqObjs.frequencyMin;
			
			// set combine / split enabled
			loi.combineEnabled = Ichor.m_p.lqObjs.combineEnabled;
			loi.splitEnabled = Ichor.m_p.lqObjs.splitEnabled;
			loi.splitMinBodies = Ichor.m_p.lqObjs.splitMinBodies;
			loi.splitForceMin = Ichor.m_p.lqObjs.splitForceMin;
			loi.splitForceMax = Ichor.m_p.lqObjs.splitForceMax;
			
			// update init x/y
			loi.cX = currInitX = Math.random() * (loi.maxSpawnX - loi.minSpawnX) + loi.minSpawnX;
			loi.cY = currInitY = Math.random() * (loi.maxSpawnY - loi.minSpawnY) + loi.minSpawnY;
			
			// assign liquid object a value
			loi.value = Math.round(Ichor.ranMM(Ichor.m_p.lqObjs.valueMax, Ichor.m_p.lqObjs.valueMin));
			
			// create next liquid object
			var liquidObj = Ichor.createLiquidObject(loi);
			
			// deflate constant volume
			liquidObj.joint.Inflate(Math.random() * (Ichor.m_p.lqObjs.initInflateMax - Ichor.m_p.lqObjs.initInflateMin) + Ichor.m_p.lqObjs.initInflateMin);
		}
	};
	
	// create liquid object and return
	Ichor.createLiquidObject = function (liquidObjectInfo) {
		var p2D = Ichor.physics2D, liquidObj, loi = liquidObjectInfo, i;
		
		// init liquid object
		liquidObj = { world: loi.world, joint: liquidObjectInfo.joint, fill: {}, interactive: loi.interactive, drawCurved: loi.drawCurved};
		
		// if joint is "undefined"
		if (typeof liquidObj.joint === "undefined") {	
			// init def
			liquidObj.def = new b2ConstantVolumeJointDef();
			
			// set liquid object constant volume joint definition properties
			liquidObj.def.frequencyHz = loi.frequencyHz;
			liquidObj.def.frequencyByBodyCount = loi.frequencyByBodyCount;
			liquidObj.def.frequencyMax = loi.frequencyMax;
			liquidObj.def.frequencyMin = loi.frequencyMin;
			liquidObj.def.dampingRatio = loi.dampingRatio;
			liquidObj.def.combineEnabled = loi.combineEnabled;
			liquidObj.def.splitEnabled = loi.splitEnabled;
			liquidObj.def.splitMinBodies = loi.splitMinBodies;
			liquidObj.def.splitForceMin = loi.splitForceMin;
			liquidObj.def.splitForceMax = loi.splitForceMax;
			
			// init vertex bodies definitions
			var sd = new b2CircleDef();
			var bd = new b2BodyDef();
			sd.density = loi.vertexBodyDensity;
			sd.radius = loi.vertexBodyRadius;
			sd.restitution = loi.vertexBodyRestitution;
			sd.friction = loi.vertexBodyFriction;
			bd.AddShape(sd);
			
			// create each vertex body in liquid object
			for (i = 0; i < loi.numVertices; i++) {
				var rad = -Math.PI + loi.radPerVertex * i;
				var nbd_x = loi.cX + loi.radius * Math.cos(rad);
				var nbd_y = loi.cY + loi.radius * Math.sin(rad);
				
				// update position of vertex body def to current vertex
				bd.position.Set(nbd_x, nbd_y);
				
				// create vertex body
				var currbd = loi.world.CreateBody(bd);
				
				// add vertex body to constant volume joint definition
				liquidObj.def.AddBody(currbd);
			}
			
			// create liquid object constant volume joint
			liquidObj.joint = liquidObj.world.CreateJoint(liquidObj.def);
		}
		
		// if split enabled
		if (liquidObj.joint.GetSplitEnabled() === true) {
			// add listener for constant volume split event
			jQuery(liquidObj.joint).bind(b2ConstantVolumeJoint.SPLIT_EVENT, function (event, parts) { Ichor.splitLiquidObject(liquidObj, parts); });
		}
		
		// if combine enabled
		if (liquidObj.joint.GetCombineEnabled() === true) {
			// add listener for constant volume combine event
			jQuery(liquidObj.joint).bind(b2ConstantVolumeJoint.COMBINE_EVENT, function (event, combinedJoint, parts) { Ichor.combineLiquidObjects(combinedJoint, parts); });
		}
		
		// set value
		if (typeof loi.value !== "undefined") {
			liquidObj.value = loi.value;
		}
		// else create new
		else {
			liquidObj.value = Ichor.ranMM(Ichor.m_p.lqObjs.valueMax, Ichor.m_p.lqObjs.valueMin);
		}
		
		// init liquid object color values (for visuals)
		// if has color info
		if (typeof loi.colorInfo !== "undefined") {
			liquidObj.fill.orig_fillStyle = [loi.colorInfo[0], loi.colorInfo[1], loi.colorInfo[2], loi.colorInfo[3]];
		}
		else {
			// use value to determine color
			var colorVals = Ichor.colorByValue(liquidObj.value);
			
			// set fill info
			liquidObj.fill.orig_fillStyle = [colorVals[0], colorVals[1], colorVals[2], Ichor.m_p.lqObjs.colorAlpha];
		}
		
		// set shift info
		liquidObj.fill.shift = {};
		liquidObj.fill.shift.time = Ichor.m_p.lqObjs.colorShift.time;
		liquidObj.fill.shift.delay = Ichor.m_p.lqObjs.colorShift.delay;
		
		// set orig fill as default starting fill
		liquidObj.fill.fillStyle = [loi.initColor[0], loi.initColor[1], loi.initColor[2], loi.initColor[3]];
		liquidObj.fill.lineWidth = liquidObj.fill.orig_lineWidth;
		liquidObj.fill.strokeStyle = liquidObj.fill.orig_strokeStyle;
		
		// set functions
		// returns RGBA color string from fill style
		liquidObj.rgbaColorString = function () {
			return "rgba(" + this.fill.fillStyle[0] + "," + this.fill.fillStyle[1] + "," + this.fill.fillStyle[2] + "," + this.fill.fillStyle[3] + ")";
		};
		// creates an array of points
		liquidObj.shapePositions = function (origin, radiusMultiplier, isRandom, changePerVertex, numPositionsRequested, startRad, radRange, distribution) {
			var positions = [],
				bodies = this.joint.GetBodies(),
				shapeRadius = this.joint.GetTargetRadius() * ((Ichor.isNumber(radiusMultiplier) !== false) ? radiusMultiplier : 1),
				ranMax = 1, ranMin = 1, initCurrRanValX = 1, currRanValX = 1, initCurrRanValY = 1, currRanValY = 1, returnToInitInNumPositions = 3, ranChangePerVertex = 0,
				numPositions = (Ichor.isNumber(numPositionsRequested) !== false) ? numPositionsRequested : bodies.length,
				initRad, range, currRad, radPerVertex, rad, vmdMod, minRadPV, maxRadPV, numIterationsToFix, numIterationsActual, tempRelX, tempRelY;
			
			// if is random
			if (isRandom === true) {
				ranMax = Ichor.m_p.lqObjs.randomShapeMax;
				ranMin = Ichor.m_p.lqObjs.randomShapeMin;
				currRanValX = initCurrRanValX = Math.random() * (ranMax - ranMin) + ranMin;
				currRanValY = initCurrRanValY = Math.random() * (ranMax - ranMin) + ranMin;
				ranChangePerVertex = (ranMax / numPositions) * ((Ichor.isNumber(changePerVertex) !== false) ? changePerVertex : 6);
			}
			initRad = (Ichor.isNumber(startRad) !== false) ? Ichor.normalizeRadian(startRad, 0) : -Math.PI;
			range = (Ichor.isNumber(radRange) !== false) ? radRange : (Ichor.two_pi);
			currRad = initRad;
			radPerVertex = range / numPositions;
			
			// set distribution info
			// to be used in von Mises probability density function
			if (typeof distribution === "undefined") {
				distribution = {k: 0, m: initRad};
			}
			else {
				// concentration, closer to 0 will result in more even distribution
				if (Ichor.isNumber(distribution.k) !== true) {
					distribution.k = 0;
				}
				// location of highest concentration
				if (Ichor.isNumber(distribution.m) !== true) {
					distribution.m = initRad;
				}
				else {
					distribution.m = Ichor.normalizeRadian(distribution.m, 0);
				}
				
				// if m is less than initRad
				if (distribution.m < initRad) {
					distribution.m += Ichor.two_pi;
				}
			}
			
			// set min / max per vertex radian values 
			minRadPV = radPerVertex / Math.pow(Math.E, distribution.k);
			maxRadPV = radPerVertex + (radPerVertex - minRadPV);
			
			// if distribution concentration value (k) is not 0
			// fix currRad start point
			if (distribution.k !== 0) {
				// set currRad to distribution location
				currRad = distribution.m;
				
				// find num iterations needed to fix
				numIterationsToFix = (distribution.m - initRad) / radPerVertex;
				numIterationsActual = Math.floor(numIterationsToFix);
				
				// fix
				for(i = 0; i < numIterationsActual; i++) {
					rad = distribution.m - (radPerVertex * (numIterationsToFix - 1 - i));
					vmdMod = (Math.abs(distribution.m - rad) % (range * 0.5)) / (range * 0.5);
					if (rad <= distribution.m - (range * 0.5) || rad >= distribution.m + (range * 0.5)) {
						vmdMod = 1 - vmdMod;
					}
					
					// decrease curr radian
					currRad -= minRadPV + vmdMod * (maxRadPV - minRadPV);
				}
			}
/*
			// if k = 0, even distribution, set init rad to radian of init bd
			else {
				var lqObjCenter = this.joint.GetCenterPosition();
				var initBdCenter = bodies[0].GetCenterPosition();
				var initBdRad = Math.atan2(initBdCenter.y - lqObjCenter.y, initBdCenter.x - lqObjCenter.x);
				
				currRad = initRad = initBdRad;
			}
*/
			
			// create positions
			for(i = 0; i < numPositions; i++) {
				rad = initRad + (radPerVertex * i);
				vmdMod = (Math.abs(distribution.m - rad) % (range * 0.5)) / (range * 0.5);
				if (rad <= distribution.m - (range * 0.5) || rad >= distribution.m + (range * 0.5)) {
					vmdMod = 1 - vmdMod;
				}
				
				// increase curr radian
				if (i > 0) {
					currRad += minRadPV + vmdMod * (maxRadPV - minRadPV);
				}
				
				// set rad to current modified radian
				rad = currRad;
				
				// if random, modify random variables
				if (isRandom === true) {
					if (i >= numPositions - 1 - returnToInitInNumPositions) {
						currRanValX += (initCurrRanValX - currRanValX) * (1 / returnToInitInNumPositions);
						currRanValY += (initCurrRanValY - currRanValY) * (1 / returnToInitInNumPositions);
					}
					else {
						var minMaxPctX = (currRanValX - ranMin) / (ranMax - ranMin);
						var minMaxModX = minMaxPctX * 2 - 1;
						var minMaxPctY = (currRanValY - ranMin) / (ranMax - ranMin);
						var minMaxModY = minMaxPctY * 2 - 1;
						currRanValX += (Math.random() * (2 - minMaxModX) - 1) * (Math.random() * ranChangePerVertex);
						currRanValY += (Math.random() * (2 - minMaxModY) - 1) * (Math.random() * ranChangePerVertex);
					}
				}
				
				tempRelX = shapeRadius * Math.cos(rad) * currRanValX;
				tempRelY = shapeRadius * Math.sin(rad) * currRanValY;
				if (typeof origin !== "undefined" && typeof origin.x !== "undefined" && typeof origin.y !== "undefined") {
					tempRelX += origin.x;
					tempRelY += origin.y;
				}
				positions[positions.length] = new b2Vec2(tempRelX, tempRelY);
			}
			
			return positions;
		};
		// shifts color to target color over time
		liquidObj.colorShift = function (targetColor, sourceColor, totalTime, callback) {
			var mLO = this;
			
			// if shifting, kill current shift for new shift
			if (typeof mLO.fill.shift.timeoutId !== "undefined") {
				clearInterval(mLO.fill.shift.timeoutId);
				mLO.fill.shift.timeoutId = undefined;
			}
			
			// if current color does not equal current target color
			if (mLO.fill.fillStyle !== mLO.fill.shift.targetColor) {
				// set init shift properties if 
				// target color is not "undefined"
				// and target color is different from current target color
				if (typeof targetColor !== "undefined" && (typeof mLO.fill.shift.targetColor === "undefined" || mLO.fill.shift.targetColor !== targetColor)) {
					
					// set source color
					if (typeof sourceColor !== "undefined") {
						mLO.fill.shift.sourceColor = sourceColor.slice(0);
					}
					else {
						mLO.fill.shift.sourceColor = mLO.fill.fillStyle;
					}
					
					// set current target color
					mLO.fill.shift.targetColor = targetColor.slice(0);
					
					// set total time
					if (typeof totalTime === "undefined") {
						totalTime = mLO.fill.shift.time;
					}
					mLO.fill.shift.totalTime = totalTime;
					
					// store callback
					if (typeof callback !== "undefined") {
						mLO.fill.shift.callback = callback;
					}
					
					// reset current time
					mLO.fill.shift.currentTime = 0;
				}
				
				// shift to target color
				mLO.fill.fillStyle = Ichor.averageColorsByPct(mLO.fill.shift.sourceColor, mLO.fill.shift.targetColor, (mLO.fill.shift.currentTime / mLO.fill.shift.totalTime));
				
				// if current time less than total time, set timeout to continue shift
				if (mLO.fill.shift.currentTime < mLO.fill.shift.totalTime) {
					mLO.fill.shift.currentTime += liquidObj.fill.shift.delay;
					mLO.fill.shift.timeoutId = setTimeout( function ()  { mLO.colorShift(); }, liquidObj.fill.shift.delay);
				}
				// complete, do callback
				else {
					if (typeof mLO.fill.shift.callback !== "undefined") {
						mLO.fill.shift.callback();
						mLO.fill.shift.callback = undefined;
					}
				}
			}
		};
		// destroys self
		// optional parameter softDestroy, if true will not destroy bodies or joints
		liquidObj.destroySelf = function (softDestroy) {
			// if hard destroy
			if (softDestroy !== true) {
				liquidObj.joint.DestroySelf();
			}
		};
		
		// set liquid object to default state
		Ichor.liquidStateChange(liquidObj, Ichor.m_p.lqObjs.states.idle);
		
		// store liquid object
		// top
		p2D.liquidObjects.push(liquidObj);
			
		return liquidObj;
	};
	
	// listener for liquid object split event
	Ichor.splitLiquidObject = function (liquidObj, parts) {
		var p2D = Ichor.physics2D, mcList = p2D.mouseConnections, lqObjConnections, loi, largestPartPct, largestPart, newMConnect, i, b, j;
		
		// check parts to see if is valid split
		if (parts.length > 0) {		
			// copy base liquid object properties
			loi = Ichor.copyAIntoB(p2D.baseLiquidObjectInfo);
			loi.initColor = liquidObj.fill.fillStyle.slice(0, liquidObj.fill.fillStyle.length);
			
			// find largest part
			for(i = 0; i < parts.length; i++) {
				if (typeof largestPartPct === "undefined" || largestPartPct < parts[i].pct) {
					largestPartPct = parts[i].pct;
					largestPart = parts[i];
				}
			}
			
			// create new liquid object for each part
			for(i = 0; i < parts.length; i++) {
				// set joint
				loi.joint = parts[i].joint;
				
				// create
				parts[i].liquidObject = Ichor.createLiquidObject(loi);
			}
			
			// find any liquid object mouse connection
			if (typeof mcList !== "undefined" && mcList.length > 0) {
				for(i = mcList.length - 1; i >= 0; i--) {
					if (mcList[i].target === liquidObj) {
						if (typeof lqObjConnections === "undefined") {
							lqObjConnections = [];
						}
						lqObjConnections[lqObjConnections.length] = mcList.splice(i, 1)[0];
					}
				}
			}
			
			// if liquid object has mouse connection
			// create new transfer connections to parts
			if (typeof lqObjConnections !== "undefined" && lqObjConnections.length > 0) {
				for(i = lqObjConnections.length - 1; i >= 0; i--) {
					var loC = lqObjConnections[i];
					var targetPartIndex, maxPartConnectValue;
					
					// find part with most connections of highest force ( use dist pct also )
					for(b = 0; b < parts.length; b++) {
						var pi = parts[b];
						var distPctVal = 0;
						var centerDistVal = 0;
						var currPartConnectValue = 0;
						
						// add dist pcts to dist pct value
						for(j = 0; j < loC.mouseJoints.length; j++) {
							var mj = loC.mouseJoints[j];
							var mjt = mj.GetTargetBody();
							
							// if target is in bodies list of part joint
							// add dist pct to dist pct val
							if (pi.joint.bodies.indexOf(mjt) !== -1 && mj.distPct > Ichor.m_p.lqObjs.mouseConnect.minDistPct) {
								distPctVal = distPctVal + mj.distPct;
							}
						}
						
						// add dist between center values
						
						// add values to curr part connect value
						currPartConnectValue = distPctVal + centerDistVal;
						
						// check curr part connect val against max
						if (typeof maxPartConnectValue === "undefined" || maxPartConnectValue < currPartConnectValue) {
							targetPartIndex = b;
							maxPartConnectValue = currPartConnectValue;
						}
					}
					
					// destroy old connection
					Ichor.destroyLiquidPositionConnection(loC);
					
					// make new connection to target part index
					if (targetPartIndex >= 0 && targetPartIndex < parts.length) {
						newMConnect = Ichor.createLiquidPositionsConnection(parts[targetPartIndex].liquidObject, loC.id, {centerPt: loC.mousePos});
						
						// store new mouse connection in global list
						mcList[mcList.length] = newMConnect;
					}
				}
			}
			
			// destroy target liquid object
			Ichor.destroyLiquidObject(liquidObj);
		}
	};
	
	// combines several liquid objects
	Ichor.combineLiquidObjects = function (combinedJoint, parts) {
		var p2D = Ichor.physics2D, lqObjs = p2D.liquidObjects, mcList = p2D.mouseConnections, liquidObj, lqObjConnections, loi, largestPart, newMConnect, i, b;
		
		// check parts to see if is valid combine
		if (typeof combinedJoint !== "undefined" && parts.length > 0) {		
			// copy base liquid object properties
			loi = Ichor.copyAIntoB(p2D.baseLiquidObjectInfo);
			
			// destroy each each part
			for(i = 0; i < parts.length; i++) {
				var plqObj;
				
				// find liquid object
				for(b = lqObjs.length - 1; b >= 0; b--) {
					if (lqObjs[b].joint === parts[i]) {
						plqObj = lqObjs[b];
						break;
					}
				}
				
				// if liquid object found
				if (typeof plqObj !== "undefined") {
					// find any liquid object mouse connection
					if (typeof mcList !== "undefined" && mcList.length > 0) {
						for(b = mcList.length - 1; b >= 0; b--) {
							if (mcList[b].target === plqObj) {
								if (typeof lqObjConnections === "undefined") {
									lqObjConnections = [];
								}
								lqObjConnections[lqObjConnections.length] = mcList.splice(b, 1)[0];
							}
						}
					}
					
					// find largest part by target volume
					if (typeof largestPart === "undefined" || largestPart.targetVolume < parts[i].targetVolume) {
						largestPart = parts[i];
						
						// use color from largest part
						loi.initColor = plqObj.fill.fillStyle;
					}
					
					// destroy
					Ichor.destroyLiquidObject(plqObj);
				}
			}
			
			// set combined joint as loi joint
			loi.joint = combinedJoint;
			
			// create new liquid object for combined joint
			liquidObj = Ichor.createLiquidObject(loi);
			
			// if liquid object has mouse connection
			// create new transfer connections to parts
			if (typeof lqObjConnections !== "undefined" && lqObjConnections.length > 0) {
				for(i = lqObjConnections.length - 1; i >= 0; i--) {
					var loC = lqObjConnections[i];
					
					// make new connection to target part index
					newMConnect = Ichor.createLiquidPositionsConnection(liquidObj, loC.id, {centerPt: loC.mousePos});
					
					// store new mouse connection in global list
					mcList[mcList.length] = newMConnect;
					
					// destroy old connection
					Ichor.destroyLiquidPositionConnection(loC);
				}
			}
		}
	};
	
	// destroys liquid object
	Ichor.destroyLiquidObject = function (liquidObj, fadeInfo) {
		var p2D = Ichor.physics2D, mcList = p2D.mouseConnections, laz = p2D.liquidActivationZone, connection, i;
		
		// disconnect from center
		if (typeof laz !== "undefined" && laz.activations.length > 0) {
			for(i = laz.activations.length - 1; i >= 0; i--) {
				if (laz.activations[i].target === liquidObj) {
					connection = laz.activations.splice(i, 1)[0];
					Ichor.destroyLiquidPositionConnection(connection);
				}
			}
		}
		
		// disconnect any connections
		if (typeof mcList !== "undefined" && mcList.length > 0) {
			for(i = mcList.length - 1; i >= 0; i--) {
				if (mcList[i].target === liquidObj) {
					connection = mcList.splice(i, 1)[0];
					Ichor.destroyLiquidPositionConnection(connection);
				}
			}
		}
		
		// if should fade
		if (typeof fadeInfo !== "undefined") {
			// check color shift
			if (typeof fadeInfo.targetColor === "undefined") {
				fadeInfo.targetColor = [liquidObj.fill.orig_fillStyle[0], liquidObj.fill.orig_fillStyle[1], liquidObj.fill.orig_fillStyle[2], 0];
			}
			
			liquidObj.colorShift(fadeInfo.targetColor, null, null, function () {
				if (typeof fadeInfo.callback !== "undefined") { fadeInfo.callback(); }
				Ichor.removeLiquidObject(liquidObj);
			});
		}
		// else destroy immediately
		else {
			Ichor.removeLiquidObject(liquidObj);
		}
	};
	
	// removes liquid object from display
	Ichor.removeLiquidObject = function (liquidObj) {
		var p2D = Ichor.physics2D;
		
		// find liquid obj and remove from liquid objects list
		var lqObjIndex = p2D.liquidObjects.indexOf(liquidObj);
		if (lqObjIndex !== -1) {
			p2D.liquidObjects.splice(lqObjIndex, 1);
		}
		
		// liquid object self destroy
		liquidObj.destroySelf();
	};
	
	// set liquid state
	Ichor.liquidStateChange = function (liquidObj, newState) {
		// check new state, if "undefined"
		if (typeof newState === "undefined") {
			// set to default
			newState = Ichor.m_p.lqObjs.states.idle;
		}
		
		// set state (only if new state is different from current)
		// and update by new state
		if (liquidObj.state !== newState) {
			// store curr state as previous
			liquidObj.statePrev = liquidObj.state;
			
			// update liquid target by new state
			if (newState === Ichor.m_p.lqObjs.states.idle) {
				// color
				liquidObj.colorShift(liquidObj.fill.orig_fillStyle);
			}
			
			// store new state
			liquidObj.state = newState;
		}
	};
	
	// returns display index of liquid object
	Ichor.getLiquidDisplayIndex = function (liquidObj) {
		var p2D = Ichor.physics2D, ldIndex, i;
		
		for(i = 0; i < p2D.liquidObjects.length; i++) {
			if (p2D.liquidObjects[i] === liquidObj) {
				ldIndex = i;
				break;
			}
		}
		
		return ldIndex;
	};
	
	// moves liquid object to new index on display list
	Ichor.shiftLiquidDisplayIndex = function (liquidObj, newIndex) {
		var p2D = Ichor.physics2D, displayIndex;
		
		// get display index of liquid obj
		displayIndex = Ichor.getLiquidDisplayIndex(liquidObj);
		
		// if display index found
		if (typeof displayIndex !== "undefined" && displayIndex >= 0) {
			// if newIndex is greater than i, modify newIndex
			if (newIndex > displayIndex) {
				newIndex--;
			}
			
			// remove from liquid objects list
			p2D.liquidObjects.splice(displayIndex, 1);
			
			// add back at new index
			p2D.liquidObjects.splice(newIndex, 0, liquidObj);
		}
	};
	
	// create and return liquid position connection
	Ichor.createLiquidPositionsConnection = function (liquidObj, id, connectInfo) {
		var p2D = Ichor.physics2D, newActivationConnection = {target: liquidObj, id:(typeof id !== "undefined") ? id : -1, mouseJoints: [] }, mj, bodies = liquidObj.joint.GetBodies(), newMJPosition, useCenterPt = false, cP = new b2Vec2(0, 0), cPRad = 0, posInitRad = 0, bC, cbDist, cbDistPct = 1, cbDistMin, cbClosestPtIndex = 0, cbClosestPtC, cbDistVsRadius, centerEvenDistribution = 1, cbDistLORadianRatio, distribution, splitForceThresholdPcts, lastDistPct, firstDistPct, secondDistPct, i;
		
		// if connectInfo "undefined"
		if (typeof connectInfo === "undefined") {
			connectInfo = {};
		}
		
		// if center point not defined, set center of liquid object as center point
		if (typeof connectInfo.positions === "undefined" && (typeof connectInfo.centerPt === "undefined" || Ichor.isNumber(connectInfo.centerPt.x) !== true || Ichor.isNumber(connectInfo.centerPt.y) !== true)) {
			connectInfo.centerPt = liquidObj.joint.GetCenterPosition();
		}
		
		// if should use distance from center point to determine connection
		if (typeof connectInfo.centerPt !== "undefined" && Ichor.isNumber(connectInfo.centerPt.x) === true && Ichor.isNumber(connectInfo.centerPt.y) === true) {
			useCenterPt = true;
			
			cP = connectInfo.centerPt;
		
			// find min dist of bodies from center pt
			for(i = 0; i < bodies.length; i++) {
				// dist
				bC = bodies[i].GetCenterPosition();
				cbDist = b2Math.Length(bC.x - cP.x, bC.y - cP.y);
				
				// min
				if (typeof cbDistMin === "undefined" || cbDistMin > cbDist) {
					cbDistMin = cbDist;
					
					// closest pt
					cbClosestPtIndex = i;
				}
			}
			
			// get closest point center
			cbClosestPtC = bodies[cbClosestPtIndex].GetCenterPosition();
			
			// set center pt radian
			cPRad = Math.atan2(cbClosestPtC.y - liquidObj.joint.GetCenterPosition().y, cbClosestPtC.x - liquidObj.joint.GetCenterPosition().x);
			
			// get max of dist delta vs liquid obj radius
			var loActualRadius = liquidObj.joint.GetTargetRadius();
			
			// check if user connect radius is larger
			if(loActualRadius <= Ichor.m_p.mj.userConnectRadius) {
				// force instant volume to if actual joint radius is less than user connect
				liquidObj.joint.VolumeToFinish();
			}
			
			// find smallest radius
			cbDistVsRadius = Math.min(Ichor.m_p.mj.userConnectRadius, loActualRadius);
			
			// get ratio of effective radius and distvsradius var
			cbDistLORadianRatio = cbDistVsRadius / loActualRadius;
			centerEvenDistribution = Math.pow(cbDistLORadianRatio, (Ichor.m_p.lqObjs.mouseConnect.centerEvenDistributionMod / cbDistLORadianRatio));
		}
		
		// if positions is "undefined"
		if (typeof connectInfo.positions === "undefined") {
			if (useCenterPt === true) {
				// set positions start rad based on index of closest pt		
				if (cbClosestPtIndex > (bodies.length * 0.5)) {
					posInitRad = cPRad + (Math.PI * ((bodies.length * 0.5) - (cbClosestPtIndex - (bodies.length * 0.5))) / (bodies.length * 0.5));
				}
				else {
					posInitRad = cPRad - (Math.PI * (cbClosestPtIndex / (bodies.length * 0.5)));
				}
				
				// init distribution info
				distribution = {k: Ichor.m_p.lqObjs.mouseConnect.distributionVal * Math.max(0, Math.min(1, (1 - centerEvenDistribution))), m: cPRad + Math.PI};
			}
			
			// generate positions
			connectInfo.positions = liquidObj.shapePositions(connectInfo.centerPt, cbDistLORadianRatio, false, null, null, posInitRad, Ichor.two_pi, distribution);
		}
		
		// if positions is a single number
		if (typeof connectInfo.positions.length === "undefined") {
			// convert to array
			connectInfo.positions = [connectInfo.positions];
		}
		
		// set force
		if (typeof connectInfo.forceMod === "undefined") {
			connectInfo.forceMod = Ichor.m_p.mj.force;
		}
		
		// set frequency
		if (typeof connectInfo.frequency === "undefined") {
			connectInfo.frequency = Ichor.m_p.mj.frequency;
		}
		
		// set damping
		if (typeof connectInfo.damping === "undefined") {
			connectInfo.damping = Ichor.m_p.mj.damping;
		}
		
		// if should save connect info
		if (connectInfo.saveState === true) {
			newActivationConnection.prevConnectInfo = Ichor.copyAIntoB(connectInfo);
		}
		
		// create mouse joints for all outer bodies of target
		for(i = 0; i < bodies.length; i++) {
			
			// get position
			newMJPosition = connectInfo.positions[i % connectInfo.positions.length];
			
			// if should use center pt
			if (useCenterPt === true) {
				// if center distribution is not 1
				if (centerEvenDistribution !== 1) {
					// get dist as pct in index range from closest pt's index
					var blh = Math.round(bodies.length * 0.5);
					var indexDiffPct = (Math.abs(cbClosestPtIndex - i) % blh) / blh;
					if (i <= cbClosestPtIndex - blh || i >= cbClosestPtIndex + blh) {
						indexDiffPct = 1 - indexDiffPct;
					}
					cbDistPct = 1 - indexDiffPct;
				
					cbDistPct = Math.pow(cbDistPct, (Ichor.m_p.lqObjs.mouseConnect.cbDistPctUDMod / Math.pow(cbDistPct, Ichor.m_p.lqObjs.mouseConnect.cbDistPctDivMod)));
					
					if (isNaN(cbDistPct) || cbDistPct < Ichor.m_p.lqObjs.mouseConnect.minDistPct) {
						cbDistPct = Ichor.m_p.lqObjs.mouseConnect.minDistPct;
					}
				}
				
				// split force threshold pcts
				if (Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsByJoint === true) {
					// init
					if (typeof splitForceThresholdPcts === "undefined") {
						splitForceThresholdPcts = [];
					}
					
					// store current entry
					splitForceThresholdPcts[i] = 1;
					
					// if last to this is a switch from min dist pct to something higher
					if (typeof lastDistPct !== "undefined" && ((lastDistPct === Ichor.m_p.lqObjs.mouseConnect.minDistPct && lastDistPct < cbDistPct) || (cbDistPct === Ichor.m_p.lqObjs.mouseConnect.minDistPct && lastDistPct > cbDistPct))) {
						splitForceThresholdPcts[i - 1] = Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsMin;
					}
					
					// if is at end of bodies, check first
					if (i === bodies.length - 1) {
						// check between last and first
						if (cbDistPct === Ichor.m_p.lqObjs.mouseConnect.minDistPct && firstDistPct > cbDistPct) {
							splitForceThresholdPcts[i] = Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsMin;
						}
						else if ((firstDistPct === Ichor.m_p.lqObjs.mouseConnect.minDistPct && secondDistPct > firstDistPct) || (secondDistPct === Ichor.m_p.lqObjs.mouseConnect.minDistPct && secondDistPct < firstDistPct)) {
							splitForceThresholdPcts[0] = Ichor.m_p.lqObjs.mouseConnect.splitForceThresholdsMin;
						}
					}
					
					// store last
					lastDistPct = cbDistPct;
					// store last as first / second for reference when at last body
					if (i === 0) {
						firstDistPct = lastDistPct;	
					}
					else if (i === 1) {
						secondDistPct = lastDistPct;
					}
				}
			}
			
			// create new joint
			mj = p2D.createMouseJoint(newMJPosition, bodies[i], connectInfo.forceMod * cbDistPct, Math.max(b2Settings.b2_EPSILON, connectInfo.frequency * cbDistPct), connectInfo.damping);
			
			// set individual mouse joint vector angle
			if (useCenterPt === true) {
				mj.relPos = new b2Vec2(newMJPosition.x - cP.x, newMJPosition.y - cP.y);
				mj.distFromCenter = b2Math.Length(mj.relPos.x, mj.relPos.y);
				mj.vecRadian = Math.atan2(mj.relPos.y, mj.relPos.x);
			}
			mj.distPct = cbDistPct;
			
			// store new joint
			newActivationConnection.mouseJoints[newActivationConnection.mouseJoints.length] = mj;
		}
		
		// store overall center point as mouse pos
		newActivationConnection.mousePos = cP;
		
		// store overall centerEvenDistribution
		newActivationConnection.centerEvenDistribution = centerEvenDistribution;
		
		// store overall vector angle
		newActivationConnection.vecRadian = cPRad;
		
		// store split force threshold pcts
		if (typeof splitForceThresholdPcts !== "undefined") {
			newActivationConnection.target.joint.SetSplitForceThresholdPctsByJoint(splitForceThresholdPcts);
		}
		
		// set functions
		newActivationConnection.updateForce = function (newForceValue) {
			var nac = this, i;
			
			// update outer mouse joints
			for(i = 0; i < nac.mouseJoints.length; i++) {
				nac.mouseJoints[i].m_maxForce = (newForceValue * ((Ichor.isNumber(nac.mouseJoints[i].distPct) === true) ? nac.mouseJoints[i].distPct : 1)) * nac.mouseJoints[i].p2DBodyRef.GetMass();
			}
		};
		// update positions function
		newActivationConnection.updatePositions = function (updateInfo) {
			var nac = this, liquidObj = nac.target, updatedPos, mpDelta = 0, mpDeltaDist, mpDeltaRadian, vrDelta = 0, i;
			
			// if should save updateInfo
			if (updateInfo.saveState === true) {
				nac.prevConnectInfo = Ichor.copyAIntoB(updateInfo);
			}
			
			// if centerEvenDistribution is 1, no angling with mouse needed
			if (nac.centerEvenDistribution === 1) {
				updateInfo.angleWithMouse = false;
			}
			
			// update mouse position
			if (typeof updateInfo.mousePos !== "undefined") {
				//store previous mouse position
				if (typeof nac.mousePos !== "undefined") {
					nac.mousePos_prev = Ichor.copyAIntoB(nac.mousePos);
				}
				
				// store mouse position in mouse connection
				nac.mousePos = Ichor.copyAIntoB(updateInfo.mousePos);
				
				// find difference
				if (typeof nac.mousePos !== "undefined" && typeof nac.mousePos_prev !== "undefined") {
					mpDelta = b2Math.SubtractVV(nac.mousePos, nac.mousePos_prev);
					mpDeltaDist = b2Math.Length(mpDelta.x, mpDelta.y);
				}
				
				// if should angle with mouse
				if (updateInfo.angleWithMouse === true && typeof mpDelta !== "undefined") {
					mpDeltaRadian = Math.atan2(mpDelta.y, mpDelta.x);
					
					// set update info vector angle
					updateInfo.vecRadian = mpDeltaRadian;
				}
			}
			
			// update vector angle
			if (Ichor.isNumber(updateInfo.vecRadian) === true) {
				//store previous vector angle
				if (typeof nac.vecRadian !== "undefined") {
					nac.vecRadian_prev = nac.vecRadian;
				}
				
				// set vector angle update amount
				vrDelta = Ichor.normalizeRadian(updateInfo.vecRadian, 0) - ((Ichor.isNumber(nac.vecRadian) === true) ? nac.vecRadian : 0);
				
				// check delta value to see if there is a shorter angle
				if (Math.abs(vrDelta) > Math.PI) {
					vrDelta = -(Math.abs(vrDelta) / vrDelta) * (Math.PI - Math.abs(vrDelta % Math.PI));
				}
				
				// shift in steps
				if (updateInfo.vecRadianInstantShift !== true && Math.abs(vrDelta) >= Ichor.m_p.lqObjs.mouseConnect.vecRadianShiftMin) {
					vrDelta = vrDelta / ((Ichor.isNumber(updateInfo.vecRadianShiftSteps) === true) ? updateInfo.vecRadianShiftSteps : Ichor.m_p.lqObjs.mouseConnect.vecRadianShiftSteps);
				}
				
				// new vector angle
				var newVR = ((typeof nac.vecRadian !== "undefined") ? nac.vecRadian : 0) + vrDelta;
				nac.vecRadian = Ichor.normalizeRadian(newVR, 0);
			}
			
			// set properties for updated positions
			if (typeof updateInfo.positions !== "undefined") {
				// if positions is single point
				if (typeof updateInfo.positions.length === "undefined") {
					updateInfo.positions = [updateInfo.positions];
				}
				
				// update target volume, do not save state
				if (updateInfo.positions.length > 2) {
					liquidObj.joint.SetTargetVolume(liquidObj.joint.GetArea(updateInfo.positions));
				}
			}
			
			// update mouse joints
			for(i = 0; i < nac.mouseJoints.length; i++) {
				updatedPos = new b2Vec2((typeof updateInfo.offsetX !== "undefined") ? updateInfo.offsetX : null, (typeof updateInfo.offsetY !== "undefined") ? updateInfo.offsetY : null);
				
				// if positions defined
				if (typeof updateInfo.positions !== "undefined") {
					// add positions info
					updatedPos.Add(updateInfo.positions[i % updateInfo.positions.length]);
				}
				// else update positions based on position and angle diff between curr and prev mouse positions
				else if (updateInfo.positionWithMouse === true && typeof nac.mousePos_prev !== "undefined" && typeof nac.mousePos !== "undefined" && typeof mpDelta !== "undefined") {
					// update pos
					updatedPos.Add(nac.mouseJoints[i].GetTarget());
					
					// if should angle with mouse
					if (updateInfo.angleWithMouse === true && typeof nac.mouseJoints[i].relPos !== "undefined" && typeof nac.mouseJoints[i].vecRadian !== "undefined" && typeof nac.mouseJoints[i].distFromCenter !== "undefined") {
						
						// if vector angle changed
						if (vrDelta !== 0) {
							var rp = new b2Vec2(0, 0);
							
							// update individual mouse joint vector angle
							nac.mouseJoints[i].vecRadian += vrDelta;
							
							// modify relative position based on individual vector angle
							rp.x = nac.mouseJoints[i].distFromCenter * Math.cos(nac.mouseJoints[i].vecRadian);
							rp.y = nac.mouseJoints[i].distFromCenter * Math.sin(nac.mouseJoints[i].vecRadian);
							
							// add difference of relative position and mp delta to updated pos
							updatedPos.Add(b2Math.SubtractVV(rp, nac.mouseJoints[i].relPos));
							
							// store new relative position
							nac.mouseJoints[i].relPos = rp;
						}
					}
					
					// add mouse position delta
					updatedPos.Add(mpDelta);
				}
				
				// update mouse joint
				if (typeof updatedPos.x !== "undefined" && typeof updatedPos.y !== "undefined") {
					nac.mouseJoints[i].SetTarget(updatedPos);
				}
			}
		};
			
		return newActivationConnection;
	};
	
	Ichor.destroyLiquidPositionConnection = function (connectionInfo) {
		var p2D = Ichor.physics2D, i;
		
		// clear each mouse joint of matching connection
		for(i = 0; i < connectionInfo.mouseJoints.length; i++) {
			p2D.destroyMouseJoint(connectionInfo.mouseJoints[i]);
		}
	};
	
	// check for if liquid object is connected to mouse
	Ichor.liquidConnectedToMouse = function (target) {
		var p2D = Ichor.physics2D, mcList = p2D.mouseConnections, i;
		
		for(i = 0; i < mcList.length; i++) {
			if (mcList[i].target === target) {
				return true;
			}
		}
		
		return false;
	};
	
	
	
	//======================================================================
	//
	//	LIQUID ACTIVATION ZONE
	//
	//======================================================================
	
	// creates a center interaction point
	Ichor.initLiquidActivationZone = function (izX, izY, izGravity, izFalloffOuter, izFalloffInner) {
		var p2D = Ichor.physics2D, world = p2D.world, i;
		
		// add gravity node at center of world to push away
		var gnCenterX = (typeof izX !== "undefined") ? izX : 0, 
			gnCenterY = (typeof izY !== "undefined") ? izY : 0, 
			gnGravity = (typeof izGravity !== "undefined") ? izGravity : Ichor.m_p.laz.gravity, 
			gnFalloffOuter = (typeof izFalloffOuter !== "undefined") ? izFalloffOuter : Ichor.m_p.laz.falloffOuter, 
			gnFalloffInner = (typeof izFalloffInner !== "undefined") ? izFalloffInner : Ichor.m_p.laz.falloffInner;
		world.AddGravityNode(new b2GravityNode2(gnCenterX, gnCenterY, gnGravity, gnFalloffOuter, gnFalloffInner));
		
		// create another liquid object to act as center zone
		var loi = Ichor.copyAIntoB(p2D.baseLiquidObjectInfo);
		loi.frequencyHz = Ichor.m_p.laz.frequency;
		loi.dampingRatio = Ichor.m_p.laz.damping;
		loi.numVertices = Ichor.m_p.laz.numVertices;
		loi.radPerVertex = (Ichor.two_pi) / loi.numVertices;
		loi.radius = Ichor.m_p.laz.radius;
		loi.vertexBodyRadius = Ichor.m_p.laz.vertexBodyRadius;
		loi.size = (loi.radius * 2 + loi.spacing);
		loi.interactive = false;
		loi.drawCurved = Ichor.m_p.laz.drawCurved;
		
		// init center position
		var origin = new b2Vec2(0, 0);
		
		// set position
		loi.cX = origin.x;
		loi.cY = origin.y;
		
		// set visual info
		loi.colorInfo = [Ichor.m_p.laz.RGBA[0], Ichor.m_p.laz.RGBA[1], Ichor.m_p.laz.RGBA[2], Ichor.m_p.laz.RGBA[3]];
		
		// create liquidActivation zone
		var laz = p2D.liquidActivationZone = Ichor.createLiquidObject(loi);
		
		// init mouse joints list
		laz.mouseJoints = [];
		
		// init activation list
		laz.activations = [];
		
		// store center position
		laz.origin = origin;
		
		// get bodies of liquidActivation zone
		var bodies = laz.joint.GetBodies();
		
		// set mouse joints for each vertex in liquidActivation zone
		// to hold liquidActivation zone in place
		for(i = 0; i < bodies.length; i++) {
			var bodyOrigin = bodies[i].GetCenterPosition();
			var mjOrigin = new b2Vec2(bodyOrigin.x, bodyOrigin.y);
			laz.mouseJoints[laz.mouseJoints.length] = p2D.createMouseJoint(mjOrigin, bodies[i], Ichor.m_p.laz.mj.force, Ichor.m_p.laz.mj.frequency, Ichor.m_p.laz.mj.damping);
		}
	};
	
	// returns color based on pieces value
	Ichor.colorByValue = function (value) {
		var rgbaValue;
		
		if (typeof value !== "undefined") {
			var tValPct = Math.min(1, Math.abs(value - Ichor.m_p.lqObjs.valueMin) / Math.abs(Ichor.m_p.lqObjs.valueMax - Ichor.m_p.lqObjs.valueMin));
			var colorListPct = (Ichor.m_p.lqObjs.colorList.length - 1) * tValPct;
			var color1Index = Math.floor(colorListPct);
			var color2Index = Math.ceil(colorListPct);
			var colorIndexesDiff = (color2Index - color1Index);
			if (colorIndexesDiff < 1) {
				colorIndexesDiff = 1;
			}
			var colorsPct = (colorListPct - color1Index) / colorIndexesDiff;
			if (colorsPct < 0.5) {
				colorsPct = Math.pow(colorsPct, Ichor.m_p.lqObjs.colorExpFloor);
			}
			else {
				colorsPct = Math.pow(colorsPct, Ichor.m_p.lqObjs.colorExpCeil);
			}
			
			rgbaValue = Ichor.averageColorsByPct(Ichor.m_p.lqObjs.colorList[color1Index], Ichor.m_p.lqObjs.colorList[color2Index], colorsPct);
		}
		else {
			rgbaValue = [0, 0, 0, 1];
		}
		
		return rgbaValue;
	};
	
	// check if a point or mouse connection target is inside liquidActivation zone
	Ichor.withinActivationZone = function (target) {
		var p2D = Ichor.physics2D, laz = p2D.liquidActivationZone, isWithin = false,
			tCenter, lazDX, lazDY, lazDist = 0, activationRadius = Ichor.m_p.laz.radiusActivate;
		
		// if is liquid object
		if (typeof target.joint !== "undefined") {
			tCenter = target.joint.GetCenterPosition();
			lazDist += target.joint.maxRadius;
		}
		// else defaults to point
		else {
			tCenter = target;
		}
		
		// find distance
		lazDX = laz.joint.centerPos.x - tCenter.x;
		lazDY = laz.joint.centerPos.y - tCenter.y;
		lazDist += b2Math.Length(lazDX, lazDY);
		
		// dist check for if mouse connection target 
		// and max radius of liquid object is inside effective radius
		// and if center of liquid object is inside liquidActivation zone
		if (lazDist <= activationRadius){// && laz.joint.TestPoint(tCenter)) {
			isWithin = true;
		}
		
		return isWithin;
	};
	
	
	//======================================================================
	//
	//	LIQUID MOUSE EVENTS
	//
	//======================================================================
	
	
	// physics mouse interaction // add
	Ichor.addMouseToLiquidInteraction = function () {
		// mouse up / down
		jQuery(Ichor.stageCanvas).bind('mousedown touchstart', Ichor.liquidMouseDown).bind('mouseup touchend', Ichor.liquidMouseUp);
		jQuery(Ichor.mainContainer).bind('mouseleave', Ichor.liquidMouseLeave);
	};
	
	// physics mouse interaction // remove
	Ichor.removeMouseToLiquidInteraction = function () {	
		// mouse up / down
		jQuery(Ichor.stageCanvas).unbind('mousedown touchstart', Ichor.liquidMouseDown).unbind('mouseup touchend', Ichor.liquidMouseUp);
		jQuery(Ichor.mainContainer).unbind('mouseleave', Ichor.liquidMouseLeave);
	};
	
	// physics mouse down
	Ichor.liquidMouseDown = function (event, id) {
		var oEvent = event.originalEvent, i, t;
		
		// get if is touch event
		if (typeof oEvent !== "undefined" && typeof oEvent.touches !== "undefined" && typeof oEvent.changedTouches !== "undefined"){
			// prevent default behavior
			oEvent.preventDefault();
			
			// for each finger involved in the event
			var fingers = oEvent.changedTouches;
			for(i = 0; i < fingers.length; i++) {
				var touch = fingers[i];
				var touchId = 0;
				
				// find id
				for(t = 0; t < oEvent.touches.length; t++) {
					if (touch === oEvent.touches[t]) {
						touchId = t;
						break;
					}
				}
				
				// send as individual mouse down event
				Ichor.liquidMouseDown(touch, touchId);
			}
		}
		// else is mouse down
		else {
			var p2D = Ichor.physics2D, lbList = p2D.liquidObjects, mcList = p2D.mouseConnections, sMidW = Ichor.pageWidth() * 0.5, sMidH = Ichor.pageHeight() * 0.5, mousePos = new b2Vec2(event.pageX - sMidW, event.pageY - sMidH), nextLB, nDX, nDY, nextDist, possibleLBList = [], targetLB, newMConnect, minDistFromM, minDistIndex;
			
			// check id
			if (typeof id === "undefined") {
				id = -1;
			}
			
			// find all liquid blob that have an effective radius that contains mouse click point + userMouseRadius
			for(i = 0; i < lbList.length; i++) {
				nextLB = lbList[i];
				nDX = nextLB.joint.centerPos.x - mousePos.x;
				nDY = nextLB.joint.centerPos.y - mousePos.y;
				nextDist = b2Math.Length(nDX, nDY);
				
				// dist check
				if (nextDist <= nextLB.joint.maxRadius + Ichor.m_p.mj.userMouseRadius && nextLB.interactive === true) {
					possibleLBList[possibleLBList.length] = {lb: nextLB, dist: nextDist, dx: nDX, dy: nDY};
				}
			}
			
			// if list of possible liquid blobs found, find only liquid blobs that mouse point is inside
			for(i = 0; i < possibleLBList.length; i++) {
				nextLB = possibleLBList[i];
				
				// set position closer to next LB by userMouseRadius amount
				var ratioDistUMR = Math.min(1, Ichor.m_p.mj.userMouseRadius / nextLB.dist);
				var effectivePos = new b2Vec2(mousePos.x + nextLB.dx * ratioDistUMR, mousePos.y + nextLB.dy * ratioDistUMR);
				
				// if mouse point inside, set as targetLB
				// last liquid blob to be set as targetLB is highest on visual index, therefore correct as target
				if (nextLB.lb.joint.TestPoint(effectivePos)) {
					targetLB = nextLB.lb;
				}
				// else check if is shortest distance
				else if (typeof minDistFromM === "undefined" || nextLB.dist < minDistFromM) {
					minDistFromM = nextLB.dist;
					minDistIndex = i;
				}
			}
			
			// if targetLB was not found
			// use min dist liquid blob as back up
			if (typeof targetLB === "undefined" && typeof minDistIndex !== "undefined") {
				targetLB = possibleLBList[minDistIndex].lb;
			}
			
			// if targetLB was found
			if (typeof targetLB !== "undefined") {
				
				// check targetLB state
				if (targetLB.state === Ichor.m_p.lqObjs.states.activated) {
					// change liquid object state
					Ichor.liquidStateChange(targetLB, Ichor.m_p.lqObjs.states.postActivationA);
				}
				else if (targetLB.state === Ichor.m_p.lqObjs.states.postActivationA) {
					// change liquid object state
					Ichor.liquidStateChange(targetLB, Ichor.m_p.lqObjs.states.postActivationB);
				}
				
				// init new mouse connection
				newMConnect = Ichor.createLiquidPositionsConnection(targetLB, id, {centerPt:mousePos});
				
				// store new mouse connection in global list
				mcList[mcList.length] = newMConnect;
			}
			
			// set mouse move listener if needed
			if (mcList.length === 1) {
				jQuery(window).bind('mousemove touchmove', Ichor.liquidMouseMove);
			}
		}
		
		return false;
	};
	
	// physics mouse leave
	Ichor.liquidMouseLeave = function (event) {
		// if correct target
		if (event.target !== event.currentTarget) {
			Ichor.liquidMouseUp(event);
		}
		else {
			return false;
		}
	};
	
	// physics mouse down
	Ichor.liquidMouseUp = function (event, id) {
		var oEvent = event.originalEvent, i, t;
		
		// get if is touch event
		if (typeof oEvent !== "undefined" && typeof oEvent.touches !== "undefined" && typeof oEvent.changedTouches !== "undefined"){
			// prevent default behavior
			oEvent.preventDefault();
			
			// for each finger involved in the event
			var fingers = oEvent.changedTouches;
			for(i = 0; i < fingers.length; i++) {
				var touch = fingers[i];
				var touchId = 0;
				
				// find id
				for(t = 0; t < oEvent.touches.length; t++) {
					if (touch === oEvent.touches[t]) {
						touchId = t;
						break;
					}
				}
				
				// send as individual mouse up event
				Ichor.liquidMouseUp(touch, touchId);
			}
		}
		// else is mouse up
		else {
			var p2D = Ichor.physics2D, mcList = p2D.mouseConnections;
			
			// check id
			if (typeof id === "undefined") {
				id = -1;
			}
			
			// clear all connections with id matching id argument
			for(i = mcList.length - 1; i >= 0; i--) {
				if (mcList[i].id === id) {
					var mcInfo = mcList.splice(i, 1)[0];
					Ichor.destroyLiquidPositionConnection(mcInfo);
				}
			}
			
			// if mouse connections list is empty, remove mouse move listener
			if (mcList.length === 0) {
				jQuery(window).unbind('mousemove touchmove', Ichor.liquidMouseMove);
			}
		}
		
		return false;
	};
	
	// physics mouse move
	Ichor.liquidMouseMove = function (event, id) {
		var oEvent = event.originalEvent, i, t;
		
		// get if is touch event
		if (typeof oEvent !== "undefined" && typeof oEvent.touches !== "undefined" && typeof oEvent.changedTouches !== "undefined"){
			// prevent default behavior
			oEvent.preventDefault();
			
			// for each finger involved in the event
			var fingers = oEvent.changedTouches;
			for(i = 0; i < fingers.length; i++) {
				var touch = fingers[i];
				var touchId = 0;
				
				// find id
				for(t = 0; t < oEvent.touches.length; t++) {
					if (touch === oEvent.touches[t]) {
						touchId = t;
						break;
					}
				}
				
				// send as individual mouse up event
				Ichor.liquidMouseMove(touch, touchId);
			}
		}
		// else is mouse move
		else {
			var p2D = Ichor.physics2D, mcList = p2D.mouseConnections, sMidW = Ichor.pageWidth() * 0.5, sMidH = Ichor.pageHeight() * 0.5, mousePos = new b2Vec2(event.pageX - sMidW, event.pageY - sMidH);
			
			// check id
			if (typeof id === "undefined") {
				id = -1;
			}
			
			// update all connections with id matching id argument
			for(i = 0; i < mcList.length; i++) {
				var mcInfo = mcList[i];
				
				// if mouse connection id matches id of move
				if (mcInfo.id === id) {
					
					// update each mouse joint of matching connection
					mcInfo.updatePositions({mousePos: mousePos, positionWithMouse: true, angleWithMouse: true});
				}
			}
		}
		
		return false;
	};
	
	//======================================================================
	//
	//	LOADING
	//
	//======================================================================
	
	Ichor.setLoadPct = function (loadPct) {
		var area, cvIndex, cvNew, cvPIndex, cvPrev, relIndex, nPct, pPct, sbW, sbH, sbNumAW, sbNumAH, sbAW, sbAH, numAreasToFill, area, color_vals, color_alpha, statusFill, areaW, areaH, sMidW, sMidH;
		
		// check load pct
		if(Ichor.isNumber(loadPct) !== true) {
			loadPct = 0;
		}
		
		// if stage
		if(typeof Ichor.stage !== "undefined") {
			sMidW = Ichor.pageWidth() * 0.5;
			sMidH = Ichor.pageHeight() * 0.5;
			
			sbW = 100;
			sbH = 20;
			sbNumAW = 10;
			sbNumAH = 1;
			sbAW = sbW / sbNumAW;
			sbAH = sbH / sbNumAH;
			numAreasToFill = Math.round(Math.random() * (sbNumAW * sbNumAH));
			
			area = {x: (sMidW - sbW) + Math.round(Math.random() * (sbNumAW - 1)) * (loadPct * sbAW), y: (sMidH - sbH) + Math.round(Math.random() * (sbNumAH - 1)) * (loadPct * sbAH)};
			cvIndex = Math.ceil(loadPct * (Ichor.colors.list.length - 1));
			
			if(cvIndex > 0) {
				cvNew = Ichor.colors.list[cvIndex];
				cvPIndex = cvIndex - 1;
				cvPrev = Ichor.colors.list[cvPIndex];
				relIndex = loadPct * (Ichor.colors.list.length - 1);
				nPct = 1 - (cvIndex - relIndex);
				pPct = 1 - (relIndex - cvPIndex);
				color_vals = [Math.round(cvNew[0] * nPct + cvPrev[0] * pPct), Math.round(cvNew[1] * nPct + cvPrev[1] * pPct), Math.round(cvNew[2] * nPct + cvPrev[2] * pPct), 1];
			}
			else {
				color_vals = Ichor.colors.list[cvIndex];
			}
			color_alpha = 0.8;
			statusFill = {fillStyle: "rgba(" + color_vals[0] + "," + color_vals[1] + "," + color_vals[2] + "," + color_alpha + ")"};
			areaW = loadPct * (Math.random() * sbW);
			areaH = sbH;
			
			// draw rect
			Ichor.stage.fillRect(area.x, area.y, areaW, areaH, statusFill);
		}
	};
	
	//======================================================================
	//
	//	INIT
	//
	//======================================================================
	
	// interactivity
	Ichor.initInteraction = function () {
		// start physics 2D world
		if (Ichor.physics2DEnabled && typeof Ichor.physics2D.world !== "undefined") {
			// basic liquid setup
			Ichor.setupLiquidConsciousness();
		}
		
		// start interaction
		Ichor.startInteraction();
		
		// start updating stage
		Ichor.updatingSelf_stage = true;
		Ichor.updateStage();
	};
	
	// starts interactivity
	Ichor.startInteraction = function () {
		// physics 2D interaction
		if (Ichor.physics2DEnabled && typeof Ichor.physics2D.world !== "undefined") {
			// start stepping physics2D
			Ichor.physics2D.start();
		
			// physics mouse interaction
			Ichor.addMouseToLiquidInteraction();
		}
	};
	
	// stops interactivity
	Ichor.stopInteraction = function () {
		// physics 2D interaction
		if (Ichor.physics2DEnabled && typeof Ichor.physics2D.world !== "undefined") {
			// stop stepping physics 2D world
			Ichor.physics2D.stop();
			
			// physics mouse interaction
			Ichor.removeMouseToLiquidInteraction();
		}
	};
	
	// sets up engine
	Ichor.initEngine = function () {
		// init stage container
		Ichor.stageContainer = document.createElement("div");
		Ichor.stageContainer.id = this.stageBaseId;
		Ichor.stageContainer.style.position = 'absolute';
		Ichor.stageContainer.style.left = "0px";
		Ichor.stageContainer.style.top = "0px";
		
		// add parts to display
		Ichor.container.appendChild(Ichor.stageContainer);
		
		// init stage canvas
		//this.stageNode = dojo.byId(this.stageContainer.id);
		//this.stage = dojox.gfx.createSurface(this.stageNode, this.pageWidth(), this.pageHeight());
		Ichor.stageCanvas = document.createElement("canvas");
		Ichor.stageCanvas.id = Ichor.stageContainer.id + "_canvas";
		Ichor.stageCanvas.style.position = 'absolute';
		Ichor.stageCanvas.style.left = "0px";
		Ichor.stageCanvas.style.top = "0px";
		Ichor.stageCanvas.width = Ichor.pageWidth();
		Ichor.stageCanvas.height = Ichor.pageHeight();
		
		// add stage canvas
		Ichor.stageContainer.appendChild(Ichor.stageCanvas);
		
		// get canto canvas abtraction
		Ichor.stage = canto(Ichor.stageCanvas);
		
		// init stats
		if (Ichor.statsEnabled) {
			var statsContainer = (Ichor.statsVisible === true) ? Ichor.container : undefined;
			Ichor.initStats(statsContainer);
		}
	};
	
	Ichor.init = function (mainContainerId, ichorContainerId) {
		// get if is mobile device
		// checks for touch support 
		// (assumes mobile device if so... not the best method but will have to do for now)
		Ichor.mobileDevice = Ichor.isEventSupported('touchstart');
		
		// properties default to non-mobile device, so if is mobile, copy mobile properties
		if (Ichor.mobileDevice === true) {
			Ichor.m_p = Ichor.copyAIntoB(Ichor.m_pMobile, Ichor.m_p);
		}
		
		// store main container ref
		Ichor.mainContainer = document.getElementById(mainContainerId);
		
		// store container ref
		Ichor.container = document.getElementById(ichorContainerId);
		
		// add resize listener
		jQuery(window).resize(function (event) {
			Ichor.on_resize(event);
		});
		
		// resize once
		Ichor.on_resize();
		
		// check container
		if (typeof Ichor.mainContainer !== "undefined" && typeof Ichor.container !== "undefined" && Ichor.initializing === false && Ichor.ready === false) {
			// set initializing
			Ichor.initializing = true;
			
			// store load complete functions
			var mainLoadCallback = function () {
				// fade stage out
				jQuery(Ichor.stageCanvas).delay(Ichor.m_p.loadCompleteDelayTime).fadeTo(Ichor.m_p.loadCompleteFadeTimeOut, 0, function () {
					// init physics
					if (Ichor.physics2DEnabled) {
						Ichor.initPhysics2D();
					}
					
					// when stage loads
					if (typeof Ichor.stage !== "undefined") {
						// set ready
						Ichor.ready = true;
						
						// init interaction
						Ichor.initInteraction();
						
						// resize once
						Ichor.on_resize();
					}
					
					// fade stage in
					jQuery(Ichor.stageCanvas).fadeTo(Ichor.m_p.loadCompleteFadeTimeIn, 1);
				});
			};
			var initLoadCallback = function () {
				var mainLoadQueue = Box2DLoader.getScriptsToLoad('js/lib/box2d', 'js/lib').concat(Ichor.secondaryScripts);
				var mainLoadInfo = {scripts: mainLoadQueue, updateCallback: Ichor.setLoadPct, finalCallback: mainLoadCallback, total: mainLoadQueue.length, completed: 0, pct: 0};
				
				// init engine
				Ichor.initEngine();
				
				// load main scripts
				Ichor.loadScripts(mainLoadInfo);
			};
			
			// load all required scripts
			var initLoadInfo = {scripts: Ichor.requiredScripts, finalCallback: initLoadCallback, total: Ichor.requiredScripts.length, completed: 0, pct: 0};
			Ichor.loadScripts(initLoadInfo);
		}
	};
}());