class Card {
    static foundationNumber = 4;
    static tableauNumber = 7;
    static width = 60;
    static height = 80;
    static pileOffset = 16;
    static miniTextOffset = 4;
    static deckCardOffset = 1;
    static wasteCardOffset = 4;
    static Blank = new Card("NONE", "NONE");
    Color() { return this.suite == Suites.HEARTS || this.suite == Suites.DIAMONDS ? "#ff0000" : "#000000"; }

    constructor(suite, rank) {
        this.suite = suite;
        this.rank = rank;
        this.faced = false;
        this.previousParent = null;
    }

    static CreateDeck() {
        var deck = [];
        for (var suite in Suites) {
            for (var rank in Ranks) {
                deck.push(new Card(suite, rank));
            }
        }
        return deck;
    }

    static CreateWaste() {
        return [];
    }

    static CreateFoundation() {
        var foundation = [];
        for (var t = 0; t < this.foundationNumber; t++) {
            foundation.push([]);
        }
        return foundation;
    }

    static CreateTableau() {
        var tableau = [];
        for (var t = 0; t < this.tableauNumber; t++) {
            tableau.push([]);
        }
        return tableau;
    }

    static Shuffle(deck) {
        var currentIndex = deck.length, temporaryValue, randomIndex;
    
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            // And swap it with the current element.
            temporaryValue = deck[currentIndex];
            deck[currentIndex] = deck[randomIndex];
            deck[randomIndex] = temporaryValue;
        }
        return deck;
    }

    static DrawCardFrom(deck) { return deck.pop(); }

    ToggleFace() {
        this.faced = !this.faced;
    }

    SuiteText() {
        switch(this.suite) {
            case Suites.DIAMONDS: return String.fromCharCode(9830);
            case Suites.HEARTS: return String.fromCharCode(9829);
            case Suites.CLUBS: return String.fromCharCode(9827);
            case Suites.SPADES: return String.fromCharCode(9824);
        }
        return "";
    }

    RankText() {
        switch(Ranks[this.rank]) {
            case Ranks.KING: return "K";
            case Ranks.QUEEN: return "Q";
            case Ranks.JACK: return "J";
            case Ranks.TEN: return "10";
            case Ranks.NINE: return "9";
            case Ranks.EIGHT: return "8";
            case Ranks.SEVEN: return "7";
            case Ranks.SIX: return "6";
            case Ranks.FIVE: return "5";
            case Ranks.FOUR: return "4";
            case Ranks.THREE: return "3";
            case Ranks.TWO: return "2";
            case Ranks.ACE: return "A";
        }
        return "";
    }

    Draw(graphics, x, y) {
        if (this.faced) {
            graphics.backbuffer.fillStyle = "#efefef";
            graphics.backbuffer.fillRect(x, y, Card.width, Card.height);
            graphics.backbuffer.strokeRect(x, y, Card.width, Card.height);

            graphics.drawText(this.SuiteText() + '-' + this.RankText(), x + Card.miniTextOffset, y + Graphics.textSize + (Card.miniTextOffset / 2), this.Color());
            graphics.drawText(this.SuiteText(), x + (Card.width / 2), y + (Card.height / 2), this.Color(), "center", 20);
            graphics.drawText(this.rank, x + (Card.width / 2), y + (Card.height / 2) + Graphics.textSize, this.Color(), "center");
        } else {
            graphics.backbuffer.fillStyle = "#ccccff";
            graphics.backbuffer.fillRect(x, y, Card.width, Card.height);
            graphics.backbuffer.strokeRect(x, y, Card.width, Card.height);
        }
    }
}