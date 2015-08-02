/** (Constructor) Game(table:object)
 *
 *  Create a game using given table ( contents of game )
 *
 *  table - A object, here is a example:
 *
 *  <pre>
 *  {
 *      "あ": "a",
 *      "い": "i",
 *      "う": "u",
 *      "え": "e",
 *      "お": "o"
 *  }
 *  </pre>
 */

var Game = function(table) {
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
