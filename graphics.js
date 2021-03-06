class Graphics {
    static markerOffset = 4;
    static cardStart = 64;
    static cardGutter = 16;
    static textSize = 11;
    textFont() { return Graphics.textSize + "px Arial"; }

    constructor(canvas) {
        this.backbuffer = canvas.getContext("2d");
        this.backbufferWidth = canvas.width;
        this.backbufferHeight = canvas.height;
    }

    drawText(text, x, y, color, align = "left", textSize = Graphics.textSize) {
        var previoustxtSize = Graphics.textSize;
        Graphics.textSize = textSize;
        this.backbuffer.font = this.textFont();
        this.backbuffer.textAlign = align;
        this.backbuffer.fillStyle = color;
        this.backbuffer.fillText(text, x, y);
        Graphics.textSize = previoustxtSize;
    }

    drawMarker(x, y) {
        this.backbuffer.strokeRect(x - Graphics.markerOffset, y - Graphics.markerOffset, Card.width + (Graphics.markerOffset * 2), Card.height + (Graphics.markerOffset * 2));
    }

    getRawPosition(x, y) {
        return {
            x: Graphics.cardStart + ((Card.width + Graphics.cardGutter) * x),
            y: Graphics.cardStart + ((Card.height + Graphics.cardGutter) * y)
        }
    }

    getNextX() { return Card.width + Graphics.cardGutter; }
    getNextY() { return Card.height + Graphics.cardGutter; }

    Clear() {
        this.backbuffer.clearRect(0, 0, this.backbufferWidth, this.backbufferHeight);
    }

    Draw(deck, waste, foundation, tableau) {
        // [ D E C K ]---------------------------------------
	    // Initialize draw coordinate
	    var pos = this.getRawPosition(0, 0);

	    // Draw deck marker
        this.drawMarker(pos.x, pos.y);
        
        // Draw deck cards
	    for (let d = 0; d < deck.length; d++) {
            deck[d].Draw(graphics, pos.x, pos.y);
	    	pos.y -= Card.deckCardOffset;
	    }
	    // --------------------------------------------------



        // [ W A S T E ]---------------------------
	    // Reposition draw coordinate for waste
	    pos = this.getRawPosition(1, 0);

	    // Draw waste marker
        this.drawMarker(pos.x, pos.y);
        
        // Draw waste cards
	    for (let w = waste.length - 3; w < waste.length; w++) {
            if (w < 0) continue;
            
            waste[w].Draw(graphics, pos.x, pos.y);
	    	pos.x += Card.wasteCardOffset;
	    }
	    // --------------------------------------------------



	    // [ F O U N D A T I O N ]---------------------------
	    // Reposition draw coordinate for foundation
	    pos = this.getRawPosition(3, 0);

	    // Draw foundation markers
	    for (let f = 0; f < foundation.length; f++) {
	    	this.drawMarker(pos.x, pos.y);
	    	pos.x += this.getNextX();
        }
        
        // Reposition draw coordinate for foundation cards
        pos = this.getRawPosition(3, 0);
        var yCardStart = pos.y;

        // Draw foundation cards
	    for (let f = 0; f < foundation.length; f++) {
            const fn = foundation[f];

            for (let c = 0; c < fn.length; c++) {
                fn[c].Draw(graphics, pos.x, pos.y);
                pos.y -= Card.foundationCardOffset;
            }
            pos.x += this.getNextX();
            pos.y = yCardStart;
	    }
	    // --------------------------------------------------



        // [ T A B L E A U ]---------------------------------
        // Reposition draw coordinate for tableau markers
        pos = this.getRawPosition(0, 1.5);

        // Draw tableau markers
        for (let t = 0; t < tableau.length; t++) {
            this.drawMarker(pos.x, pos.y);
            pos.x += this.getNextX();
        }

        // Reposition draw coordinate for tableau piles
        pos = this.getRawPosition(0, 1.5);
        var yPileStart = pos.y;

        // Draw tableau piles
        for (let t = 0; t < tableau.length; t++) {
            for (let p = 0; p < tableau[t].length; p++) {
                tableau[t][p].Draw(this, pos.x, pos.y);
                pos.y += Card.pileOffset;
            }
            pos.x += this.getNextX();
            pos.y = yPileStart;
        }
        // --------------------------------------------------
    }
}