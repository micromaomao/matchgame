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
