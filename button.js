function Button(xPosTemp, yPosTemp, widthTemp, heightTemp, textTemp, textSizeTemp, rTemp, gTemp, bTemp) {
	rectMode(CENTER)
	this.location = createVector(xPosTemp, yPosTemp);
	this.text = textTemp
	this.textSize = textSizeTemp
	this.r = rTemp
	this.g = gTemp
	this.b = bTemp
	this.transp = 100;
	this.width = widthTemp
	this.height = heightTemp
	this.leftEdge = this.location.x - (this.width/2)
	this.rightEdge = this.location.x + (this.width/2)
	this.topEdge = this.location.y - (this.height/2)
	this.bottomEdge = this.location.y + (this.height/2)
	this.action = this.actionTemp;
	this.active = true;

	this.clicked = function() {
		if (mouseX < this.rightEdge && mouseX > this.leftEdge && mouseY < this.bottomEdge && mouseY > this.topEdge && this.active) {
			clickBeepSound.play()
			return true;

		} else {
			return false;
		}
	}


	this.display = function() {
		textFont(myFont)
		textAlign(CENTER, CENTER)
		rectMode(CENTER)
		noStroke();
		if (this.active) {
			fill(this.r, this.g ,this.b, this.transp)			
		} else {
			fill(100, 100)
		}

		rect(this.location.x, this.location.y, this.width, this.height, 20)
		textSize(this.textSize)
		if (this.active) {
			fill(200);		
		} else {
			fill(120, 100);
		}
		rectMode(CENTER)
		text(this.text, this.location.x, this.location.y, this.width-(this.width/20), this.height)

		if (mouseX < this.rightEdge && mouseX > this.leftEdge && mouseY < this.bottomEdge && mouseY > this.topEdge) {
			this.transp = 180;
		} else {
			this.transp = 100;
		}
	}
}