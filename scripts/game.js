var name_order_ASC = function(a, b) {
    var pr = [a.name, b.name];
    pr.sort();
    // assert(pr[0] != pr[1])
    return (pr[0] == a.name?-1:1);
};
var name_order_DESC = function(a, b) {
    return -name_order_ASC(a, b);
};
var name_order_RANDOM = function(a, b) {
    return Math.random()-0.5;
};
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
    var th = this;
    this.order_input(pts, name_order_RANDOM, function() {
        Game.prototype.showResults.apply(th, arguments);
    });
};
Game.prototype.order_input = function(arr, order, callback) {
    arr.sort(order);
    var th = this;
    var corrnum = 0;
    var results = [];
    var sm = $('<div class="sm">You have answered <span class="answer-count">0</span>' +
               ' problem, you got <span class="answer-correct-num">0</span> correct. <div class="answer-last"></div>' +
               '<div class="answer-last-ctn"></div></div>');
    this.element.append(sm);
    var ds = function(i) {
        if(i >= arr.length) {
            sm.remove();
            callback && callback(corrnum, results);
            return;
        }
        th.input(arr[i].name, function(ans){
            var cor;
            if(ans == arr[i].value) {
                cor = true;
                corrnum ++;
                sm.find('.answer-last').text("You got the last one correct.");
                sm.find('.answer-last-ctn').text("You inputed \"" + ans + "\", and the correct answer is this.");
            } else {
                cor = false;
                sm.find('.answer-last').text("You got the last one wrong.");
                sm.find('.answer-last-ctn').text("You inputed \"" + ans + "\", however the correct answer is \"" + arr[i].value + '".');
            }
            results.push({
                name: arr[i].name, corr: arr[i].value,
                user: ans, iscorr: cor
            });
            sm.find('.answer-count').text(i+1);
            sm.find('.answer-correct-num').text(corrnum);
            ds(i+1);
        });
    };
    ds(0);
};
Game.prototype.showResults = function(corrnum, results) {
    var resele = $('<div class="result"></div>');
    this.element.append(resele);
    var reshead = $('<div class="result-head">Here is your result:</div>');
    resele.append(reshead);
    var resres = $('<div class="resres">You got <span class="correct">0</span> correct, ' +
                   '<span class="wrong">0</span> wrong. You got a final score: <div class="final">NaN</div></div>');
    resres.find('.correct').text(corrnum);
    resres.find('.wrong').text(results.length - corrnum);
    resres.find('.final').text(Math.floor((corrnum / results.length) * 100) + "%");
    var rlr = $('<table border="0" class="restable"><tbody></tbody></table>');
    var rlist = rlr.find('tbody');
    reshead.append(resres);
    resele.append(rlr);
    rlist.append('<tr><td>Name</td><td>Correct Answer</td><td>Your input</td><td>If correct</td></tr>');
    for(var i = 0; i < results.length; i ++) {
        var r = results[i];
        rlist.append('<tr><td>' + r.name + '</td><td>' + r.corr
                     + '</td><td>' + r.user + '</td><td class="result-' + r.iscorr.toString() +'">'+
                         (r.iscorr?"yes":"no")+'</td></tr>');
    }
};
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
// 
$(document).ready(function(){
    document.title = "MatchGame Preview";
    var testgame = new Game({
        "あ": "a",
        "い": "i",
        "う": "u",
        "え": "e",
        "お": "o",
        "か": "ka",
        "き": "ki",
        "く": "ku",
        "け": "ke",
        "こ": "ko",
        "さ": "sa",
        "し": "shi",
        "す": "su",
        "せ": "se",
        "そ": "so"
    });
    testgame.appendTo($('body'));
});
