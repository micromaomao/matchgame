// Code from
// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
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
 *  `"V-N"` is the reverse.
 *  * `order`: `"ASC"` `"DESC"` or `"RANDOM"` ( default ).
 *  `}`
 */

var Game = function(table, mode) {
    this.table = table;
    this.element = $('<div class="matchgame-wrapper"></div>');

    this.mode = mode;
    var pts = [];
    for(var i in table) {
        if(table.hasOwnProperty(i)) {
            if(mode.way == "V-N") {
                pts.push({name: table[i], value: i});
            } else {
                pts.push({name: i, value: table[i]});
            }
        }
    }
    var th = this;
    switch(mode.order) {
        case "ASC":
            pts.sort(function(a, b) {
                var pr = [a.name, b.name];
                pr.sort();
                // assert(pr[0] != pr[1])
                return (pr[0] == a.name?-1:1);
            });
            break;
        case "DESC":
            pts.sort(function(a, b) {
                return -name_order_ASC(a, b);
            });
            break;
        case "RANDOM":
        default:
            shuffle(pts);
    }
    this.run(pts, function(){
        Game.prototype.showResults.apply(th, arguments);
    }, (mode.answer=="choose"?(mode.selectlength||4):null));
};
Game.prototype.run = function(arr, callback, opinum) {
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
        }, opinum?(function(){
            var dsa = [];
            for(var j = 0; j < arr.length; j ++) {
                if(i == j) {
                    continue;
                }
                dsa.push(j);
            }
            shuffle(dsa);
            var pa = [];
            for(var s = 0; s < opinum-1; s ++) {
                if(s >= dsa.length) break;
                pa.push(arr[dsa[s]].value);
            }
            pa.push(arr[i].value);
            shuffle(pa);
            return pa;
        })():null);
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
    rlist.append($('<tr><td>Name</td><td>Correct Answer</td><td>Your input</td><td>If correct</td></tr>'));
    for(var i = 0; i < results.length; i ++) {
        var r = results[i];
        var row = $('<tr><td class="name"></td><td class="corr">'
                     + '</td><td class="user"></td><td class="result-' + (!!(r.iscorr)).toString() +'">'+
                         (r.iscorr?"yes":"no")+'</td></tr>')
                     .children('.name').text(r.name).parent()
                     .children('.corr').text(r.corr).parent()
                     .children('.user').text(r.user).parent();
        if(!r.iscorr) {
            row.addClass('wrong');
        }
        rlist.append(row);
    }
};
Game.prototype.input = function(name, callback, opinions) {
    var mpm = $('<div class="answer-input-wrapper"></div>');
    this.element.append(mpm);
    var nm = $('<div class="answer-input-name"></div>');
    nm.text(name);
    var ipt = $('<input type="text" placeholder="answer" class="answer-input">');
    var btnok = $('<button class="answer-input-btnok">Check</buttom>');
    mpm.append(nm);
    if(!opinions) {
        mpm.append('<div class="howto">Input your answer below, or leave blank if you don\'t know. ' +
                   'On finish, press Enter or tap the "Check" buttom. </div>');
        mpm.append(ipt);
    } else {
        mpm.append('<div class="howto">Select the correct answer or if you don\'t know, click next.'+
                   ' Press 1-9 on keyboard to quick select.</div>');
    }
    var onok = function(){
        $(document).off('keydown');
        callback(ipt.val());
        mpm.remove();
    };
    if(!opinions) {
        mpm.append($('<div class="answer-input-btnok-wrapper"></div>').append(btnok));
        btnok.on('click tap', onok);
        ipt.on('keydown', function(evt){
            if(evt.keyCode == 13) {
                onok();
            }
        });
        setTimeout(function(){
            ipt[0].focus();
        }, 20);
    } else {
        opinions.push(null);
        for(var i = 0; i < opinions.length; i ++) {
            !function(i) {
                var sel = $('<button class="opinion"></button>');
                sel.text(opinions[i] || "Next");
                if(i <= 8) {
                    sel.prepend($('<span class="num"></span>').text(i+1));
                }
                mpm.append(sel);
                sel.on('tap click', function() {
                    ipt.val(opinions[i]);
                    onok();
                });
            }(i);
        }
        $(document).on('keydown', function(evt) {
            var num = evt.keyCode - 48;
            if(num >= 1 && num <= opinions.length) {
                ipt.val(opinions[num-1]);
                onok();
            }
        });
    }
};
Game.prototype.appendTo = function(element) {
    (element.append?element.append(this.element):element.appendChild(this.element[0]));
};
$(document).ready(function(){
    document.title = "MatchGame Configure";
    var ce = CodeMirror(document.body, {
        lineNumbers: false,
        autofocus: true,
        mode: "javascript",
        matchBrackets: true
    });
    ce.setValue(localStorage.code || "!" + (function(){
        var g = new CardMatch({
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
            "そ": "so",
            "た": "ta",
            "ち": "chi",
            "つ": "tsu",
            "て": "te",
            "と": "to",
            "な": "na",
            "に": "ni",
            "ぬ": "nu",
            "ね": "ne",
            "の": "no",
            "は": "ha",
            "ひ": "hi",
            "ふ": "fu",
            "へ": "he",
            "ほ": "ho",
            "ま": "ma",
            "み": "mi",
            "む": "mu",
            "め": "me",
            "も": "mo",
            "や": "ya",
            "ゆ": "yu",
            "よ": "yo",
            "ら": "ra",
            "り": "ri",
            "る": "ru",
            "れ": "re",
            "ろ": "ro",
            "わ": "wa",
            "を": "o",
            "ん": "n"
        }, 15);
        $('body').html('');
        g.appendTo($('body'));
        document.title = "Match";
    }).toString() + "();");
    $('body').append($('<button class="answer-input-btnok">Start</button>').on('tap click', function(){
        localStorage.code = ce.getValue();
        eval(localStorage.code);
    }));
});
