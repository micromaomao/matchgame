var CardMatch = function(table) {
    this.element = $('<div class="matchgame-wrapper"></div>')
    this.keyvals = [];
    for(var i in table) {
        if(table.hasOwnProperty(i)) {
            this.keyvals.push({key: i, val: table[i]});
        }
    }
    shuffle(this.keyvals);
    var th = this;
    function av(i) {
        var end = th.nextTern(i, 15, function() {
            if(!end) av(i + 15);
        });
    }
    av(0);
};
CardMatch.prototype.nextTern = function(start, maxPairs, callback) {
    var amount = Math.min(maxPairs, this.keyvals.length - start);
    if(amount <= 0) {
        return true;
    }
    var end = start + amount;
    var th = this;
    var rightAmount = 0;
    var cards = (function() {
        var fpid = 0;
        var cards = [];
        for(var i = start; i < end; i ++) {
            var kv = th.keyvals[i];
            var card = new Card(fpid, 1, kv.key, fpid+1);
            cards.push(card);
            fpid++;
            card = new Card(fpid, 0, kv.val, fpid-1);
            cards.push(card);
            fpid++;
        }
        return cards;
    })();
    shuffle(cards);
    var last = null;
    for(var i = 0; i < cards.length; i ++) {
        cards[i].appendTo(this.element);
        (function(card) {
            card.element.bind('click', function() {
                if(card.righted) {
                    return;
                }
                if(!last) {
                    last = card;
                    card.show();
                } else {
                    if(card.id == last.id) {
                        return;
                    }
                    card.show();
                    card.righted = last.righted = true;
                    if(card.id == last.right) {
                        rightAmount ++;
                        card.element.unbind('click');
                        last.element.unbind('click');
                        card.markRight();
                        last.markRight();
                        if(rightAmount >= amount) {
                            setTimeout(function() {
                                th.element.animate({opacity: 0}, 300, callback);
                            }, 1000);
                        }
                    } else {
                        (function(last) {
                            setTimeout(function() {
                                last.hide();
                                card.hide();
                                card.righted = last.righted = false;
                            }, (last.isKey == card.isKey?500:1500));
                        })(last);
                    }
                    last = null;
                }
            });
        })(cards[i]);
    }
    th.element.css({opacity: 0});
    th.element.animate({opacity: 1}, 300);
};
CardMatch.prototype.appendTo = function(element) {
    (element.append?element.append(this.element):element.appendChild(this.element[0]));
};
var Card = function(id, isKey, content, right) {
    this.id = id;
    this.isKey = isKey;
    this.content = content;
    this.right = right;
    this.element = $('<div class="card"></div>');
    this.text = $('<span></span>');
    this.text.text(this.content);
    this.element.append(this.text);
    this.text.css({opacity: 0});
};
Card.prototype.appendTo = function(element) {
    (element.append?element.append(this.element):element.appendChild(this.element[0]));
};
Card.prototype.show = function() {
    this.text.stop(true, false, false).animate({opacity: 1}, 300);
};
Card.prototype.hide = function() {
    this.text.stop(true, false, false).animate({opacity: 0}, 300);
};
Card.prototype.markRight = function() {
    this.text.stop(true, false, false).animate({opacity: 0.6}, 300);
};
