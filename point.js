function Point (pX, pY) {
	
	if (arguments.length == 0) {

		this.x = 0;
		this.y = 0;

	} else if (arguments.length == 1) {

		this.x = pX.x;
		this.y = pX.y;

	} else {

		this.x = pX;
		this.y = pY;

	}

}

Point.prototype.add = function(x, y) {
	
	this.x += x;
	this.y += y;
	return this;

};

Point.prototype.sub = function(x, y) {

	this.x -= x;
	this.y -= y;
	return this;

};

Point.prototype.mul = function(x) {
	
	this.x *= x;
	this.y *= x;
	return this;

};

Point.prototype.div = function(x) {
	
	if (x != 0) {
		
		this.x /= x;
		this.y /= x;

	}

	return this;

};

Point.prototype.inv = function() {
	
	this.x = -this.x;
	this.y = -this.y;
	return this;

};

Point.prototype.addPoint = function(pnt) {
	
	this.x += pnt.x;
	this.y += pnt.y
	return this;

};

Point.prototype.subPoint = function(pnt) {
	
	this.x -= pnt.x;
	this.y -= pnt.y
	return this;

};

Point.prototype.normalize = function() {
	
	var len = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	this.div(len);
	return this;

};

Point.prototype.log = function() {
	
	console.log("x: " + this.x + ", y: " + this.y);

};

Point.prototype.draw = function(ctx, col) {
	
	ctx.fillStyle = col;
	ctx.fillRect(this.x - 4, this.y - 4, 8, 8);

};