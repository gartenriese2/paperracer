function Track () {

	this.pts = [];
	this.vectors = [];
	this.sidePoints = [];
	this.controlPoints = [];
	this.finishLine = [];
	this.finished = false;

}

Track.prototype.refresh = function() {
	
	if (this.pts.length > 0) {
		
		this.vectors = this.calculateVectors();
		this.sidePoints = this.calculateSidePoints();
		this.controlPoints = this.calculateControlPoints();
		this.finishLine = this.createFinishLine();

	}

}

Track.prototype.addPoint = function(pnt) {
	
	this.pts.push(pnt);
	this.refresh();

}

Track.prototype.deleteLastPoint = function() {
	
	if (this.pts.length > 0) {
		this.pts.splice(this.pts.length - 1, 1);
	}

}

Track.prototype.getVectors = function() {
	
	return this.vectors;

}

Track.prototype.getMidpoints = function() {
	
	return this.pts;

}

Track.prototype.getSidepoints = function() {
	
	return this.sidePoints;

}

Track.prototype.getControlpoints = function() {
	
	return this.controlPoints;

}

Track.prototype.getFinishLine = function() {
	
	return this.finishLine;

}

Track.prototype.finish = function() {
	
	this.finished = true;
	this.refresh();

}

Track.prototype.unfinish = function() {
	
	this.finished = false;
	this.refresh();

}

Track.prototype.isFinished = function() {

	return this.finished;

}

Track.prototype.calculateVectors = function() {

	var sideVectors = [];

	for (var i = 0; i < this.pts.length; i++) {
		
		if (i == 0) {

			var vec = new Point();
			vec.add(1, 0);

			sideVectors.push(vec);

		} else if (i == this.pts.length - 1) {

			var vec = new Point();
				
			if (this.finished) {
		
				vec.addPoint(this.pts[0]).subPoint(this.pts[i - 1]);

			} else {
	
				vec.addPoint(this.pts[i]).subPoint(this.pts[i - 1]);

			}

			sideVectors.push(vec.normalize());

		} else {

			var vec = new Point();

			vec.addPoint(this.pts[i + 1]).subPoint(this.pts[i - 1]);

			sideVectors.push(vec.normalize());

		}

	}

	return sideVectors;

}

Track.prototype.calculateSidePoints = function() {

	var sidePoints = [];

	for (var i = 0; i < this.pts.length; i++) {
		
		var point = new Point();

		point.addPoint(this.pts[i]).add(this.pts[i].width * this.vectors[i].y, this.pts[i].width * -this.vectors[i].x);

		sidePoints.push(point);

	}

	if (this.finished) {
		
		var point1 = new Point();
		var point2 = new Point();

		point1.add(this.pts[0].x, this.pts[0].y - this.pts[0].width);
		point2.add(point1.x, this.pts[0].y + this.pts[0].width);
		
		sidePoints.push(point1);
		sidePoints.push(point2);

	}

	for (var i = this.pts.length - 1; i >= 0; i--) {
		
		var point = new Point();

		point.addPoint(this.pts[i]).sub(this.pts[i].width * this.vectors[i].y, this.pts[i].width * -this.vectors[i].x);

		sidePoints.push(point);

	}

	return sidePoints;

}

Track.prototype.calculateControlPoints = function() {

	var controlPoints = [];

	for (var i = 0; i < this.sidePoints.length / 2 - 1; i++) {
		
		var A = this.sidePoints[i];
		var B = this.sidePoints[i + 1];
		var vA = this.vectors[i];
		if (i == this.sidePoints.length / 2 - 2) {
			var vB = this.vectors[0];
		} else {
			var vB = this.vectors[i + 1];
		}

		var S = this.calculateIntersection(A, vA, B, vB);

		var xDelta = (S.x - A.x) / 2;
		var yDelta = (S.y - A.y) / 2;
		var len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K1 = new Point();
		K1.x = A.x + len * vA.x;
		K1.y = A.y + len * vA.y;
		//K1.draw(context, "#FF0000");

		controlPoints.push(K1);

		xDelta = (B.x - S.x) / 2;
		yDelta = (B.y - S.y) / 2;
		len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K2 = new Point();
		K2.x = B.x - len * vB.x;
		K2.y = B.y - len * vB.y;
		// K2.draw(context, "#00FF00");

		controlPoints.push(K2);

	};


	var p1 = new Object();
	var p2 = new Object();

	if (this.finished) {
		
		p1.x = this.sidePoints[0].x;
		p1.y = this.sidePoints[0].y + 1;
		controlPoints.push(p1);
		
		p2.x = p1.x;
		p2.y = this.sidePoints[0].y + 2;
		controlPoints.push(p2);

	} else {

		p1.x = this.sidePoints[this.sidePoints.length / 2 - 1].x - this.vectors[this.vectors.length - 1].y;
		p1.y = this.sidePoints[this.sidePoints.length / 2 - 1].y + this.vectors[this.vectors.length - 1].x;
		controlPoints.push(p1);
		
		p2.x = this.sidePoints[this.sidePoints.length / 2].x + this.vectors[this.vectors.length - 1].y;
		p2.y = this.sidePoints[this.sidePoints.length / 2].y - this.vectors[this.vectors.length - 1].x;
		controlPoints.push(p2);

	}
	

	var vecCount = this.vectors.length - 1;
	for (var i = this.sidePoints.length / 2; i < this.sidePoints.length - 1; i++) {

		var A = this.sidePoints[i];
		var B = this.sidePoints[i + 1];
		var vA = new Object();
		var vB = new Object();
		if (i == this.sidePoints.length / 2 && this.finished) {
			vA.x = -this.vectors[0].x;
			vA.y = -this.vectors[0].y;
			vB.x = -this.vectors[vecCount].x;
			vB.y = -this.vectors[vecCount].y;
		} else {
			vA.x = -this.vectors[vecCount].x;
			vA.y = -this.vectors[vecCount].y;
			vB.x = -this.vectors[vecCount - 1].x;
			vB.y = -this.vectors[vecCount - 1].y;
			vecCount--;
		}
		

		var S = this.calculateIntersection(A, vA, B, vB);

		var xDelta = (S.x - A.x) / 2;
		var yDelta = (S.y - A.y) / 2;
		var len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K1 = new Object();
		K1.x = A.x + len * vA.x;
		K1.y = A.y + len * vA.y;

		controlPoints.push(K1);

		xDelta = (B.x - S.x) / 2;
		yDelta = (B.y - S.y) / 2;
		len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K2 = new Object();
		K2.x = B.x - len * vB.x;
		K2.y = B.y - len * vB.y;

		controlPoints.push(K2);

	}

	return controlPoints;

}

Track.prototype.calculateIntersection = function(A,vA,B,vB) {

	var intersection = new Point();
	var beta = 0;

	if ((vA.x == 0 && vB.x == 0) || (vA.y == 0 && vB.y == 0)) {
		intersection.x = (A.x + B.x) / 2;
		intersection.y = (A.y + B.y) / 2;
		// intersection.addPoint(A.addPoint(B).div(2));
		return intersection;
	} else if (vA.x == 0) {
		beta = (A.x - B.x) / vB.x;
	} else if (vA.y == 0) {
		beta = (A.y - B.y) / vB.y;
	} else if (vB.x == 0 || vB.y == 0) {
		if (vB.x == 0) {
			beta = (B.x - A.x) / vA.x;
		} else {
			beta = (B.y - A.y) / vA.y;
		}
		intersection.x = A.x + beta * vA.x;
		intersection.y = A.y + beta * vA.y;
		return intersection;
	} else {
		beta = (A.y - B.y + (B.x - A.x) * vA.y / vA.x) / (vB.y - vA.y * vB.x / vA.x);
	}
	
	intersection.x = B.x + beta * vB.x;
	intersection.y = B.y + beta * vB.y;

	return intersection;

}

Track.prototype.createFinishLine = function() {
	
	var finishLine = [];
	finishLine.push(this.sidePoints[0]);
	finishLine.push(this.sidePoints[this.sidePoints.length - 1]);
	return finishLine;

}

Track.prototype.draw = function() {
	
	context.lineWidth = 2;
	context.strokeStyle = "#000000";
	drawSmoothPath(this.sidePoints, this.controlPoints);
	context.fillStyle = "#AAAAAA";
	context.fill();

	this.drawFinishLine();

}

Track.prototype.drawFinishLine = function() {
	
	context.lineWidth = 5;
	context.strokeStyle = "#FF0000";
	drawPath(this.finishLine);

};