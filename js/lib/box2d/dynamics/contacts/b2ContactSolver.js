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





var b2ContactSolver = Class.create();
b2ContactSolver.prototype = 
{
	initialize: function(contacts, contactCount, allocator){
		var tVec, tMat, count, contact, b1, b2, manifoldCount, manifolds, friction, restitution, v1X, v1Y, v2X, v2Y, w1, w2, manifold, normalX, normalY, c, k, cp, ccp, r1X, r1Y, r2X, r2Y, r1Sqr, r2Sqr, rn1, rn2, kNormal, tangentX, tangentY, rt1, rt2, kTangent, tX, tY, vRel, i, j;
		// initialize instance variables for references
		this.m_constraints = [];
		//

		this.m_allocator = allocator;

		this.m_constraintCount = 0;
		for (i = 0; i < contactCount; ++i)
		{
			this.m_constraintCount += contacts[i].GetManifoldCount();
		}

		// fill array
		for (i = 0; i < this.m_constraintCount; i++){
			this.m_constraints[i] = new b2ContactConstraint();
		}

		count = 0;
		for (i = 0; i < contactCount; ++i)
		{
			contact = contacts[i];
			b1 = contact.m_shape1.m_body;
			b2 = contact.m_shape2.m_body;
			manifoldCount = contact.GetManifoldCount();
			manifolds = contact.GetManifolds();
			friction = contact.m_friction;
			restitution = contact.m_restitution;

			//v1 = b1.m_linearVelocity.Copy();
			v1X = b1.m_linearVelocity.x;
			v1Y = b1.m_linearVelocity.y;
			//v2 = b2.m_linearVelocity.Copy();
			v2X = b2.m_linearVelocity.x;
			v2Y = b2.m_linearVelocity.y;
			w1 = b1.m_angularVelocity;
			w2 = b2.m_angularVelocity;

			for (j = 0; j < manifoldCount; ++j)
			{
				manifold = manifolds[ j ];

				//b2Settings.b2Assert(manifold.pointCount > 0);

				//normal = manifold.normal.Copy();
				normalX = manifold.normal.x;
				normalY = manifold.normal.y;

				//b2Settings.b2Assert(count < this.m_constraintCount);
				c = this.m_constraints[ count ];
				c.body1 = b1;
				c.body2 = b2;
				c.manifold = manifold;
				//c.normal = normal;
				c.normal.x = normalX;
				c.normal.y = normalY;
				c.pointCount = manifold.pointCount;
				c.friction = friction;
				c.restitution = restitution;

				for (k = 0; k < c.pointCount; ++k)
				{
					cp = manifold.points[ k ];
					ccp = c.points[ k ];

					ccp.normalImpulse = cp.normalImpulse;
					ccp.tangentImpulse = cp.tangentImpulse;
					ccp.separation = cp.separation;

					//r1 = b2Math.SubtractVV( cp.position, b1.m_position );
					r1X = cp.position.x - b1.m_position.x;
					r1Y = cp.position.y - b1.m_position.y;
					//r2 = b2Math.SubtractVV( cp.position, b2.m_position );
					r2X = cp.position.x - b2.m_position.x;
					r2Y = cp.position.y - b2.m_position.y;

					//ccp.localAnchor1 = b2Math.b2MulTMV(b1.m_R, r1);
					tVec = ccp.localAnchor1;
					tMat = b1.m_R;
					tVec.x = r1X * tMat.col1.x + r1Y * tMat.col1.y;
					tVec.y = r1X * tMat.col2.x + r1Y * tMat.col2.y;

					//ccp.localAnchor2 = b2Math.b2MulTMV(b2.m_R, r2);
					tVec = ccp.localAnchor2;
					tMat = b2.m_R;
					tVec.x = r2X * tMat.col1.x + r2Y * tMat.col1.y;
					tVec.y = r2X * tMat.col2.x + r2Y * tMat.col2.y;

					r1Sqr = r1X * r1X + r1Y * r1Y;
					r2Sqr = r2X * r2X + r2Y * r2Y;

					//rn1 = b2Math.b2Dot(r1, normal);
					rn1 = r1X*normalX + r1Y*normalY;
					//rn2 = b2Math.b2Dot(r2, normal);
					rn2 = r2X*normalX + r2Y*normalY;
					kNormal = b1.m_invMass + b2.m_invMass;
					kNormal += b1.m_invI * (r1Sqr - rn1 * rn1) + b2.m_invI * (r2Sqr - rn2 * rn2);
					//b2Settings.b2Assert(kNormal > Number.MIN_VALUE);
					ccp.normalMass = 1.0 / kNormal;

					//tangent = b2Math.b2CrossVF(normal, 1.0);
					tangentX = normalY;
					tangentY = -normalX;

					//rt1 = b2Math.b2Dot(r1, tangent);
					rt1 = r1X*tangentX + r1Y*tangentY;
					//rt2 = b2Math.b2Dot(r2, tangent);
					rt2 = r2X*tangentX + r2Y*tangentY;
					kTangent = b1.m_invMass + b2.m_invMass;
					kTangent += b1.m_invI * (r1Sqr - rt1 * rt1) + b2.m_invI * (r2Sqr - rt2 * rt2);
					//b2Settings.b2Assert(kTangent > Number.MIN_VALUE);
					ccp.tangentMass = 1.0 /  kTangent;

					// Setup a velocity bias for restitution.
					ccp.velocityBias = 0.0;
					if (ccp.separation > 0.0)
					{
						ccp.velocityBias = -60.0 * ccp.separation;
					}
					//vRel = b2Math.b2Dot(c.normal, b2Math.SubtractVV( b2Math.SubtractVV( b2Math.AddVV( v2, b2Math.b2CrossFV(w2, r2)), v1 ), b2Math.b2CrossFV(w1, r1)));
					tX = v2X + (-w2*r2Y) - v1X - (-w1*r1Y);
					tY = v2Y + (w2*r2X) - v1Y - (w1*r1X);
					//vRel = b2Dot(c.normal, tX/Y);
					vRel = c.normal.x*tX + c.normal.y*tY;
					if (vRel < -b2Settings.b2_velocityThreshold)
					{
						ccp.velocityBias += -c.restitution * vRel;
					}
				}

				++count;
			}
		}

		//b2Settings.b2Assert(count == this.m_constraintCount);
	},
	//~b2ContactSolver();

	PreSolve: function(){
		var tVec, tMat, b1, b2, invMass1, invI1, invMass2, invI2, normalX, normalY, tangentX, tangentY, j, tCount, ccp, PX, PY, r1X, r1Y, r2X, r2Y, ccp2, c, i;

		// Warm start.
		for (i = 0; i < this.m_constraintCount; ++i)
		{
			c = this.m_constraints[ i ];

			b1 = c.body1;
			b2 = c.body2;
			invMass1 = b1.m_invMass;
			invI1 = b1.m_invI;
			invMass2 = b2.m_invMass;
			invI2 = b2.m_invI;
			//normal = new b2Vec2(c.normal.x, c.normal.y);
			normalX = c.normal.x;
			normalY = c.normal.y;
			//tangent = b2Math.b2CrossVF(normal, 1.0);
			tangentX = normalY;
			tangentY = -normalX;

			j = 0;
			tCount = 0;
			if (b2World.s_enableWarmStarting)
			{
				tCount = c.pointCount;
				for (j = 0; j < tCount; ++j)
				{
					ccp = c.points[ j ];
					//P = b2Math.AddVV( b2Math.MulFV(ccp.normalImpulse, normal), b2Math.MulFV(ccp.tangentImpulse, tangent));
					PX = ccp.normalImpulse*normalX + ccp.tangentImpulse*tangentX;
					PY = ccp.normalImpulse*normalY + ccp.tangentImpulse*tangentY;

					//r1 = b2Math.b2MulMV(b1.m_R, ccp.localAnchor1);
					tMat = b1.m_R;
					tVec = ccp.localAnchor1;
					r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
					r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;

					//r2 = b2Math.b2MulMV(b2.m_R, ccp.localAnchor2);
					tMat = b2.m_R;
					tVec = ccp.localAnchor2;
					r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
					r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;

					//b1.m_angularVelocity -= invI1 * b2Math.b2CrossVV(r1, P);
					b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
					//b1.m_linearVelocity.Subtract( b2Math.MulFV(invMass1, P) );
					b1.m_linearVelocity.x -= invMass1 * PX;
					b1.m_linearVelocity.y -= invMass1 * PY;
					//b2.m_angularVelocity += invI2 * b2Math.b2CrossVV(r2, P);
					b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
					//b2.m_linearVelocity.Add( b2Math.MulFV(invMass2, P) );
					b2.m_linearVelocity.x += invMass2 * PX;
					b2.m_linearVelocity.y += invMass2 * PY;

					ccp.positionImpulse = 0.0;
				}
			}
			else{
				tCount = c.pointCount;
				for (j = 0; j < tCount; ++j)
				{
					ccp2 = c.points[ j ];
					ccp2.normalImpulse = 0.0;
					ccp2.tangentImpulse = 0.0;

					ccp2.positionImpulse = 0.0;
				}
			}
		}
	},
	SolveVelocityConstraints: function(){
		var j = 0, ccp, r1X, r1Y, r2X, r2Y, dvX, dvY, lambda, newImpulse, PX, PY, tMat, tVec, c, b1, b2, b1_angularVelocity, b1_linearVelocity, b2_angularVelocity, b2_linearVelocity, invMass1, invI1, invMass2, invI2, normalX, normalY, tangentX, tangentY, tCount, vn, vt, maxFriction, i;

		for (i = 0; i < this.m_constraintCount; ++i)
		{
			c = this.m_constraints[ i ];
			b1 = c.body1;
			b2 = c.body2;
			b1_angularVelocity = b1.m_angularVelocity;
			b1_linearVelocity = b1.m_linearVelocity;
			b2_angularVelocity = b2.m_angularVelocity;
			b2_linearVelocity = b2.m_linearVelocity;

			invMass1 = b1.m_invMass;
			invI1 = b1.m_invI;
			invMass2 = b2.m_invMass;
			invI2 = b2.m_invI;
			//normal = new b2Vec2(c.normal.x, c.normal.y);
			normalX = c.normal.x;
			normalY = c.normal.y;
			//tangent = b2Math.b2CrossVF(normal, 1.0);
			tangentX = normalY;
			tangentY = -normalX;

			// Solver normal constraints
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j)
			{
				ccp = c.points[ j ];

				//r1 = b2Math.b2MulMV(b1.m_R, ccp.localAnchor1);
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				//r2 = b2Math.b2MulMV(b2.m_R, ccp.localAnchor2);
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;

				// Relative velocity at contact
				//dv = b2Math.SubtractVV( b2Math.AddVV( b2.m_linearVelocity, b2Math.b2CrossFV(b2.m_angularVelocity, r2)), b2Math.SubtractVV(b1.m_linearVelocity, b2Math.b2CrossFV(b1.m_angularVelocity, r1)));
				//dv = b2Math.SubtractVV(b2Math.SubtractVV( b2Math.AddVV( b2.m_linearVelocity, b2Math.b2CrossFV(b2.m_angularVelocity, r2)), b1.m_linearVelocity), b2Math.b2CrossFV(b1.m_angularVelocity, r1));
				dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
				dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);

				// Compute normal impulse
				//vn = b2Math.b2Dot(dv, normal);
				vn = dvX * normalX + dvY * normalY;
				lambda = -ccp.normalMass * (vn - ccp.velocityBias);

				// b2Clamp the accumulated impulse
				newImpulse = b2Math.b2Max(ccp.normalImpulse + lambda, 0.0);
				lambda = newImpulse - ccp.normalImpulse;

				// Apply contact impulse
				//P = b2Math.MulFV(lambda, normal);
				PX = lambda * normalX;
				PY = lambda * normalY;

				//b1.m_linearVelocity.Subtract( b2Math.MulFV( invMass1, P ) );
				b1_linearVelocity.x -= invMass1 * PX;
				b1_linearVelocity.y -= invMass1 * PY;
				b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);

				//b2.m_linearVelocity.Add( b2Math.MulFV( invMass2, P ) );
				b2_linearVelocity.x += invMass2 * PX;
				b2_linearVelocity.y += invMass2 * PY;
				b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);

				ccp.normalImpulse = newImpulse;



				// MOVED FROM BELOW
				// Relative velocity at contact
				//dv = b2.m_linearVelocity + b2Cross(b2.m_angularVelocity, r2) - b1.m_linearVelocity - b2Cross(b1.m_angularVelocity, r1);
				//dv =  b2Math.SubtractVV(b2Math.SubtractVV(b2Math.AddVV(b2.m_linearVelocity, b2Math.b2CrossFV(b2.m_angularVelocity, r2)), b1.m_linearVelocity), b2Math.b2CrossFV(b1.m_angularVelocity, r1));
				dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
				dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);

				// Compute tangent impulse
				vt = dvX*tangentX + dvY*tangentY;
				lambda = ccp.tangentMass * (-vt);

				// b2Clamp the accumulated impulse
				maxFriction = c.friction * ccp.normalImpulse;
				newImpulse = b2Math.b2Clamp(ccp.tangentImpulse + lambda, -maxFriction, maxFriction);
				lambda = newImpulse - ccp.tangentImpulse;

				// Apply contact impulse
				//P = b2Math.MulFV(lambda, tangent);
				PX = lambda * tangentX;
				PY = lambda * tangentY;

				//b1.m_linearVelocity.Subtract( b2Math.MulFV( invMass1, P ) );
				b1_linearVelocity.x -= invMass1 * PX;
				b1_linearVelocity.y -= invMass1 * PY;
				b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);

				//b2.m_linearVelocity.Add( b2Math.MulFV( invMass2, P ) );
				b2_linearVelocity.x += invMass2 * PX;
				b2_linearVelocity.y += invMass2 * PY;
				b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);

				ccp.tangentImpulse = newImpulse;
			}



			// Solver tangent constraints
			// MOVED ABOVE FOR EFFICIENCY
			/*for (j = 0; j < tCount; ++j)
			{
				ccp = c.points[ j ];

				//r1 = b2Math.b2MulMV(b1.m_R, ccp.localAnchor1);
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
				r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
				//r2 = b2Math.b2MulMV(b2.m_R, ccp.localAnchor2);
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
				r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y

				// Relative velocity at contact
				//dv = b2.m_linearVelocity + b2Cross(b2.m_angularVelocity, r2) - b1.m_linearVelocity - b2Cross(b1.m_angularVelocity, r1);
				//dv =  b2Math.SubtractVV(b2Math.SubtractVV(b2Math.AddVV(b2.m_linearVelocity, b2Math.b2CrossFV(b2.m_angularVelocity, r2)), b1.m_linearVelocity), b2Math.b2CrossFV(b1.m_angularVelocity, r1));
				dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
				dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);

				// Compute tangent impulse
				vt = dvX*tangentX + dvY*tangentY;
				lambda = ccp.tangentMass * (-vt);

				// b2Clamp the accumulated impulse
				maxFriction = c.friction * ccp.normalImpulse;
				newImpulse = b2Math.b2Clamp(ccp.tangentImpulse + lambda, -maxFriction, maxFriction);
				lambda = newImpulse - ccp.tangentImpulse;

				// Apply contact impulse
				//P = b2Math.MulFV(lambda, tangent);
				PX = lambda * tangentX;
				PY = lambda * tangentY;

				//b1.m_linearVelocity.Subtract( b2Math.MulFV( invMass1, P ) );
				b1_linearVelocity.x -= invMass1 * PX;
				b1_linearVelocity.y -= invMass1 * PY;
				b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);

				//b2.m_linearVelocity.Add( b2Math.MulFV( invMass2, P ) );
				b2_linearVelocity.x += invMass2 * PX;
				b2_linearVelocity.y += invMass2 * PY;
				b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);

				ccp.tangentImpulse = newImpulse;
			}*/

			// Update angular velocity
			b1.m_angularVelocity = b1_angularVelocity;
			b2.m_angularVelocity = b2_angularVelocity;
		}
	},
	SolvePositionConstraints: function(beta){
		var minSeparation = 0.0, tMat, tVec, c, b1, b2, b1_position, b1_rotation, b2_position, b2_rotation, invMass1, invI1, invMass2, invI2, normalX, normalY, tangentX, tangentY, tCount, ccp, j, r1X, r1Y, r2X, r2Y, p1X, p1Y, p2X, p2Y, dpX, dpY, separation, C, dImpulse, impulse0, impulseX, impulseY, i;

		for (i = 0; i < this.m_constraintCount; ++i)
		{
			c = this.m_constraints[ i ];
			b1 = c.body1;
			b2 = c.body2;
			b1_position = b1.m_position;
			b1_rotation = b1.m_rotation;
			b2_position = b2.m_position;
			b2_rotation = b2.m_rotation;

			invMass1 = b1.m_invMass;
			invI1 = b1.m_invI;
			invMass2 = b2.m_invMass;
			invI2 = b2.m_invI;
			//normal = new b2Vec2(c.normal.x, c.normal.y);
			normalX = c.normal.x;
			normalY = c.normal.y;
			//tangent = b2Math.b2CrossVF(normal, 1.0);
			tangentX = normalY;
			tangentY = -normalX;

			// Solver normal constraints
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j)
			{
				ccp = c.points[ j ];

				//r1 = b2Math.b2MulMV(b1.m_R, ccp.localAnchor1);
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				//r2 = b2Math.b2MulMV(b2.m_R, ccp.localAnchor2);
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;

				//p1 = b2Math.AddVV(b1.m_position, r1);
				p1X = b1_position.x + r1X;
				p1Y = b1_position.y + r1Y;

				//p2 = b2Math.AddVV(b2.m_position, r2);
				p2X = b2_position.x + r2X;
				p2Y = b2_position.y + r2Y;

				//dp = b2Math.SubtractVV(p2, p1);
				dpX = p2X - p1X;
				dpY = p2Y - p1Y;

				// Approximate the current separation.
				//separation = b2Math.b2Dot(dp, normal) + ccp.separation;
				separation = (dpX*normalX + dpY*normalY) + ccp.separation;

				// Track max constraint error.
				minSeparation = b2Math.b2Min(minSeparation, separation);

				// Prevent large corrections and allow slop.
				C = beta * b2Math.b2Clamp(separation + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);

				// Compute normal impulse
				dImpulse = -ccp.normalMass * C;

				// b2Clamp the accumulated impulse
				impulse0 = ccp.positionImpulse;
				ccp.positionImpulse = b2Math.b2Max(impulse0 + dImpulse, 0.0);
				dImpulse = ccp.positionImpulse - impulse0;

				//impulse = b2Math.MulFV( dImpulse, normal );
				impulseX = dImpulse * normalX;
				impulseY = dImpulse * normalY;

				//b1.m_position.Subtract( b2Math.MulFV( invMass1, impulse ) );
				b1_position.x -= invMass1 * impulseX;
				b1_position.y -= invMass1 * impulseY;
				b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
				b1.m_R.Set(b1_rotation);

				//b2.m_position.Add( b2Math.MulFV( invMass2, impulse ) );
				b2_position.x += invMass2 * impulseX;
				b2_position.y += invMass2 * impulseY;
				b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
				b2.m_R.Set(b2_rotation);
			}
			// Update body rotations
			b1.m_rotation = b1_rotation;
			b2.m_rotation = b2_rotation;
		}

		return minSeparation >= -b2Settings.b2_linearSlop;
	},
	PostSolve: function(){
		var i, c, m, j, mPoint, cPoint;
		
		for (i = 0; i < this.m_constraintCount; ++i)
		{
			c = this.m_constraints[ i ];
			m = c.manifold;

			for (j = 0; j < c.pointCount; ++j)
			{
				mPoint = m.points[j];
				cPoint = c.points[j];
				mPoint.normalImpulse = cPoint.normalImpulse;
				mPoint.tangentImpulse = cPoint.tangentImpulse;
			}
		}
	},

	m_allocator: null,
	m_constraints: [],
	m_constraintCount: 0
};