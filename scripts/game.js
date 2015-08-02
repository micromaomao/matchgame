/** (Constructor) Game(table:object, mode:object)
 *
 *  Create a game using given table ( contents of game )
 *
 *  table - A object, here is a example:
 *
 *      {
 *          "あ": "a",
 *          "い": "i",
 *          "う": "u",
 *          "え": "e",
 *          "お": "o"
 *      }
 *
 *  mode - A object defined below:
 *
 *  `{`  
 *  * `answer`: One of `"input"` - means player will be asked to input the full answer,
 *  `"choose"` - means user will be asked to choose the correct one from some answers.
 *  * `selectlength`: When `"choose"` given to `answer`, this is the number of different
 *  answer showen. **Must be greater than 0**.
 *  * `way`: One of `"N-V"` - means name are given and player needs to answer the value,
 *  `"V-N"` is the reverse, and `"R"` means random, `"R80%V"` or `"R20%N"` means
 *  it has 80% chance to let user answer value.
 *  * `order`: `"ASC"` `"DESC"` or `"RANDOM"` ( default ).
 *  `}`
 */

var Game = function(table, mode) {
    this.table = table;
    this.element = $('<div class="matchgame-wrapper"></div>');

    // TODO: Read mode object.
    this.mode = mode;
    var pts = [];
    for(var i in table) {
        if(table.hasOwnProperty(i))
            pts.push({name: i, value: table[i]});
    }
    this.order_ASC_input(pts);
};
Game.prototype.order_ASC_input = function(arr, callback) {
    arr.sort(function(a, b) {
        var pr = [a.name, b.name];
        pr.sort();
        // assert(pr[0] != pr[1])
        return (pr[0] == a.name?-1:1);
    });
    var th = this;
    var corrnum = 0;
    var results = [];
    var sm = $('<div class="sm">You have answered <span class="answer-count">0</span>' +
               ' problem, you got <span class="answer-correct-num">0</span> correct. <span class="answer-last"></span></div>');
    this.element.append(sm);
    var ds = function(i) {
        if(i >= arr.length) {
            sm.remove();
            callback && callback(corrnum, results);
            return;
        }
        th.input(arr[i].name, function(ans){
            if(ans == arr[i].value) {
                results.push(true);
                corrnum ++;
                sm.find('.answer-last').text("You got the last one correct.");
            } else {
                results.push(false);
                sm.find('.answer-last').text("You got the last one wrong.");
            }
            sm.find('.answer-count').text(i+1);
            sm.find('.answer-correct-num').text(corrnum);
            ds(i+1);
        });
    };
    ds(0);
}
Game.prototype.input = function(name, callback) {
    var mpm = $('<div class="answer-input-wrapper"></div>');
    this.element.append(mpm);
    var nm = $('<div class="answer-input-name"></div>');
    nm.text(name);
    var ipt = $('<input type="text" placeholder="answer" class="answer-input">');
    var btnok = $('<button class="answer-input-btnok">Check</buttom>');
    mpm.append(nm);
    mpm.append('<div class="howto">Input your answer below, or leave blank if you don\'t know. ' +
               'On finish, press Enter or tap the "Check" buttom. </div>');
    mpm.append(ipt);
    mpm.append($('<div class="answer-input-btnok-wrapper"></div>').append(btnok));
    var onok = function(){
        callback(ipt.val());
        mpm.remove();
    };
    btnok.on('click tap', onok);
    ipt.on('keydown', function(evt){
        if(evt.keyCode == 13) {
            onok();
        }
    });
    setTimeout(function(){
        ipt[0].focus();
    }, 20);
};
Game.prototype.appendTo = function(element) {
    (element.append?element.append(this.element):element.appendChild(this.element[0]));
};

$(document).ready(function(){
    document.title = "MatchGame Preview";
    var testgame = new Game({
        "あ": "a",
        "い": "i",
        "う": "u",
        "え": "e",
        "お": "o"
    });
    testgame.appendTo($('body'));
});
