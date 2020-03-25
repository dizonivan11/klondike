function Solve() {
    if (TalonToFoundation()) return;
    if (TableauToFoundation()) return;
    if (Maneuver()) return;
    if (TalonToTableau()) return;

    if (HasCardFromDeck()) {
        DrawDeck();
    } else {
        ResetDeck();
    }
}

function HasCardFromDeck() {
    return deck.length > 0;
}

function CanPileTo(source, destination) {
    return source.Color() != destination.Color() && Ranks[source.rank] + 1 == Ranks[destination.rank];
}

function CanTurnOverTo(card, foundation) {
    if (foundation.length < 1) {
        if (card.rank == "ACE") return true;
        return false;
    }
    var lastCard = foundation[foundation.length - 1];
    return card.Color() == lastCard.Color() && Ranks[card.rank] - 1 == Ranks[lastCard.rank];
}

function MovePileTo(pileStart, source, destination, isKing = false) {
    if (destination.length == 0 && source[pileStart].previousParent == Card.Blank) return false;
    if (destination.length > 0) {
        if (source[pileStart].previousParent == destination[destination.length - 1] && !isKing) return false;
    }
    if (pileStart > 0 && source[pileStart - 1].faced) source[pileStart].previousParent = source[pileStart - 1];
    else source[pileStart].previousParent = Card.Blank;

    for (let mp = pileStart; mp < source.length; mp++) {
        const pileCard = source[mp];
        destination.push(pileCard);
    }
    source.splice(pileStart, source.length - pileStart);
    if (source.length > 0 && !source[source.length - 1].faced)
        source[source.length - 1].ToggleFace();

    return true;
}

function Maneuver() {
    var hasMoved = false;
    for (let s = 0; s < tableau.length; s++) {
        const source = tableau[s];
        
        for (let p = 0; p < source.length; p++) {
            const pileStartCard = source[p];
            if (!pileStartCard.faced) continue;
            
            for (let d = 0; d < tableau.length; d++) {
                const destination = tableau[d];
                if (destination.length < 1) {
                    if (pileStartCard.rank == "KING") {
                        if (MovePileTo(p, source, destination, true))
                            return true;
                    }
                    continue;
                };
                
                const destinationCard = destination[destination.length - 1];
                if (CanPileTo(pileStartCard, destinationCard)) {
                    if (MovePileTo(p, source, destination))
                        return true;
                }
            }
        }
    }
    return hasMoved;
}

function TalonToFoundation() {
    var hasMoved = false;
    if (waste.length > 0) {
        const talonCard = waste[waste.length - 1];
            
        for (let d = 0; d < foundation.length; d++) {
            const destination = foundation[d];
            if (CanTurnOverTo(talonCard, destination)) {
                return MovePileTo(waste.length - 1, waste, destination);
            }
        }
    }
    return hasMoved;
}

function TableauToFoundation() {
    var hasMoved = false;
    for (let s = 0; s < tableau.length; s++) {
        const source = tableau[s];

        if (source.length > 0) {
            const sourceCard = source[source.length - 1];

            for (let d = 0; d < foundation.length; d++) {
                const destination = foundation[d];
                if (CanTurnOverTo(sourceCard, destination)) {
                    return MovePileTo(source.length - 1, source, destination);
                }
            }
        }
    }
    return hasMoved;
}

function TalonToTableau() {
    var hasMoved = false;
    if (waste.length > 0) {
        const talonCard = waste[waste.length - 1];
            
        for (let d = 0; d < tableau.length; d++) {
            const destination = tableau[d];
            if (destination.length < 1) {
                if (talonCard.rank == "KING") {
                    return MovePileTo(waste.length - 1, waste, destination, true);
                }
                continue;
            };
                
            const destinationCard = destination[destination.length - 1];
            if (CanPileTo(talonCard, destinationCard)) {
                return MovePileTo(waste.length - 1, waste, destination);
            }
        }
    }
    return hasMoved;
}

function ResetDeck() {
    deck = waste.slice().reverse();
    for (let d = 0; d < deck.length; d++) {
        deck[d].ToggleFace();
    }
    waste = [];
}

function DrawDeck() {
    var drawCard = deck.pop();
    drawCard.ToggleFace();
    waste.push(drawCard);
}