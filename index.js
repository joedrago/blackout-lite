(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Animation, calcSign;

calcSign = function(v) {
  if (v === 0) {
    return 0;
  } else if (v < 0) {
    return -1;
  }
  return 1;
};

Animation = (function() {
  function Animation(data) {
    var k, v;
    this.speed = data.speed;
    this.req = {};
    this.cur = {};
    for (k in data) {
      v = data[k];
      if (k !== 'speed') {
        this.req[k] = v;
        this.cur[k] = v;
      }
    }
  }

  Animation.prototype.warp = function() {
    if (this.cur.r != null) {
      this.cur.r = this.req.r;
    }
    if (this.cur.s != null) {
      this.cur.s = this.req.s;
    }
    if ((this.cur.x != null) && (this.cur.y != null)) {
      this.cur.x = this.req.x;
      return this.cur.y = this.req.y;
    }
  };

  Animation.prototype.animating = function() {
    if (this.cur.r != null) {
      if (this.req.r !== this.cur.r) {
        return true;
      }
    }
    if (this.cur.s != null) {
      if (this.req.s !== this.cur.s) {
        return true;
      }
    }
    if ((this.cur.x != null) && (this.cur.y != null)) {
      if ((this.req.x !== this.cur.x) || (this.req.y !== this.cur.y)) {
        return true;
      }
    }
    return false;
  };

  Animation.prototype.update = function(dt) {
    var dist, dr, ds, maxDist, negTwoPi, sign, twoPi, updated, vecX, vecY;
    updated = false;
    if (this.cur.r != null) {
      if (this.req.r !== this.cur.r) {
        updated = true;
        twoPi = Math.PI * 2;
        negTwoPi = -1 * twoPi;
        while (this.req.r >= twoPi) {
          this.req.r -= twoPi;
        }
        while (this.req.r <= negTwoPi) {
          this.req.r += twoPi;
        }
        dr = this.req.r - this.cur.r;
        dist = Math.abs(dr);
        sign = calcSign(dr);
        if (dist > Math.PI) {
          dist = twoPi - dist;
          sign *= -1;
        }
        maxDist = dt * this.speed.r / 1000;
        if (dist < maxDist) {
          this.cur.r = this.req.r;
        } else {
          this.cur.r += maxDist * sign;
        }
      }
    }
    if (this.cur.s != null) {
      if (this.req.s !== this.cur.s) {
        updated = true;
        ds = this.req.s - this.cur.s;
        dist = Math.abs(ds);
        sign = calcSign(ds);
        maxDist = dt * this.speed.s / 1000;
        if (dist < maxDist) {
          this.cur.s = this.req.s;
        } else {
          this.cur.s += maxDist * sign;
        }
      }
    }
    if ((this.cur.x != null) && (this.cur.y != null)) {
      if ((this.req.x !== this.cur.x) || (this.req.y !== this.cur.y)) {
        updated = true;
        vecX = this.req.x - this.cur.x;
        vecY = this.req.y - this.cur.y;
        dist = Math.sqrt((vecX * vecX) + (vecY * vecY));
        maxDist = dt * this.speed.t / 1000;
        if (dist < maxDist) {
          this.cur.x = this.req.x;
          this.cur.y = this.req.y;
        } else {
          this.cur.x += (vecX / dist) * maxDist;
          this.cur.y += (vecY / dist) * maxDist;
        }
      }
    }
    return updated;
  };

  return Animation;

})();

module.exports = Animation;


},{}],2:[function(require,module,exports){
var Blackout, Card, MAX_LOG_LINES, MIN_PLAYERS, OK, ShortSuitName, ShuffledDeck, State, Suit, SuitName, aiCharacterList, aiCharacters, cardBeats, character, highestIndexInSuit, highestValueIndexInSuitLowerThan, highestValueNonSpadeIndex, l, len, lowestIndexInSuit, lowestValueIndex, randomCharacter, stringifyCards, valuesOfSuit;

MIN_PLAYERS = 3;

MAX_LOG_LINES = 7;

OK = 'OK';

State = {
  LOBBY: 'lobby',
  BID: 'bid',
  TRICK: 'trick',
  ROUNDSUMMARY: 'roundSummary',
  POSTGAMESUMMARY: 'postGameSummary'
};

Suit = {
  NONE: -1,
  CLUBS: 0,
  DIAMONDS: 1,
  HEARTS: 2,
  SPADES: 3
};

SuitName = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

ShortSuitName = ['C', 'D', 'H', 'S'];

aiCharacterList = [
  {
    id: "mario",
    name: "Mario",
    sprite: "mario",
    brain: "normal"
  }, {
    id: "luigi",
    name: "Luigi",
    sprite: "luigi",
    brain: "chaos"
  }, {
    id: "peach",
    name: "Peach",
    sprite: "peach",
    brain: "normal"
  }, {
    id: "daisy",
    name: "Daisy",
    sprite: "daisy",
    brain: "conservativeMoron"
  }, {
    id: "yoshi",
    name: "Yoshi",
    sprite: "yoshi",
    brain: "normal"
  }, {
    id: "toad",
    name: "Toad",
    sprite: "toad",
    brain: "normal"
  }, {
    id: "bowser",
    name: "Bowser",
    sprite: "bowser",
    brain: "aggressiveMoron"
  }, {
    id: "bowserjr",
    name: "Bowser Jr",
    sprite: "bowserjr",
    brain: "normal"
  }, {
    id: "koopa",
    name: "Koopa",
    sprite: "koopa",
    brain: "normal"
  }, {
    id: "rosalina",
    name: "Rosalina",
    sprite: "rosalina",
    brain: "normal"
  }, {
    id: "shyguy",
    name: "Shyguy",
    sprite: "shyguy",
    brain: "normal"
  }, {
    id: "toadette",
    name: "Toadette",
    sprite: "toadette",
    brain: "normal"
  }
];

aiCharacters = {};

for (l = 0, len = aiCharacterList.length; l < len; l++) {
  character = aiCharacterList[l];
  aiCharacters[character.id] = character;
}

randomCharacter = function() {
  var r;
  r = Math.floor(Math.random() * aiCharacterList.length);
  return aiCharacterList[r];
};

Card = (function() {
  function Card(x) {
    this.suit = Math.floor(x / 13);
    this.value = Math.floor(x % 13);
    switch (this.value) {
      case 9:
        this.valueName = 'J';
        break;
      case 10:
        this.valueName = 'Q';
        break;
      case 11:
        this.valueName = 'K';
        break;
      case 12:
        this.valueName = 'A';
        break;
      default:
        this.valueName = String(this.value + 2);
    }
    this.name = this.valueName + ShortSuitName[this.suit];
  }

  return Card;

})();

cardBeats = function(challengerX, championX, currentSuit) {
  var challenger, champion;
  challenger = new Card(challengerX);
  champion = new Card(championX);
  if (challenger.suit === champion.suit) {
    return challenger.value > champion.value;
  } else {
    if (challenger.suit === Suit.SPADES) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

ShuffledDeck = (function() {
  function ShuffledDeck() {
    var i, j, m;
    this.cards = [0];
    for (i = m = 1; m < 52; i = ++m) {
      j = Math.floor(Math.random() * i);
      this.cards.push(this.cards[j]);
      this.cards[j] = i;
    }
  }

  return ShuffledDeck;

})();

Blackout = (function() {
  function Blackout(game, params) {
    var k, len1, m, player, ref, ref1, v;
    this.game = game;
    if (!params) {
      return;
    }
    if (params.state) {
      ref = params.state;
      for (k in ref) {
        v = ref[k];
        if (params.state.hasOwnProperty(k)) {
          this[k] = params.state[k];
        }
      }
      ref1 = this.players;
      for (m = 0, len1 = ref1.length; m < len1; m++) {
        player = ref1[m];
        if (player.character) {
          player.charID = player.character.sprite;
          delete player["character"];
        }
      }
    } else {
      this.state = State.LOBBY;
      this.players = params.players;
      this.log = [];
      if (params.rounds === 'M') {
        this.rounds = ['M'];
      } else {
        this.rounds = (function() {
          var len2, n, ref2, results;
          ref2 = params.rounds.split("|");
          results = [];
          for (n = 0, len2 = ref2.length; n < len2; n++) {
            v = ref2[n];
            results.push(Number(v));
          }
          return results;
        })();
      }
      this.players[0].bid = 0;
      this.players[0].tricks = 0;
      this.players[0].score = 0;
      this.players[0].index = 0;
      this.output(this.players[0].name + ' creates game');
    }
  }

  Blackout.prototype.marathonMode = function() {
    return this.rounds[0] === 'M';
  };

  Blackout.prototype.save = function() {
    var len1, m, name, names, state;
    names = "bids dealer log lowestRequired nextRound pile pileWho players prev prevTrickTaker prevWho rounds state trickID trickTaker tricks trumpBroken turn".split(" ");
    state = {};
    for (m = 0, len1 = names.length; m < len1; m++) {
      name = names[m];
      state[name] = this[name];
    }
    return state;
  };

  Blackout.prototype.findPlayer = function(id) {
    var len1, m, player, ref;
    ref = this.players;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      player = ref[m];
      if (player.id === id) {
        return player;
      }
    }
    return void 0;
  };

  Blackout.prototype.findOwner = function() {
    return this.players[0];
  };

  Blackout.prototype.currentPlayer = function() {
    return this.players[this.turn];
  };

  Blackout.prototype.currentSuit = function() {
    var card;
    if (this.pile.length === 0) {
      return Suit.NONE;
    }
    card = new Card(this.pile[0]);
    return card.suit;
  };

  Blackout.prototype.rename = function(id, name) {
    var player;
    player = this.findPlayer(id);
    if (player) {
      this.output(player.name + ' renamed to ' + name);
      return player.name = name;
    }
  };

  Blackout.prototype.playerHasSuit = function(player, suit) {
    var card, len1, m, ref, v;
    ref = player.hand;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      v = ref[m];
      card = new Card(v);
      if (card.suit === suit) {
        return true;
      }
    }
    return false;
  };

  Blackout.prototype.playerHasOnlySpades = function(player) {
    var card, len1, m, ref, v;
    ref = player.hand;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      v = ref[m];
      card = new Card(v);
      if (card.suit !== Suit.SPADES) {
        return false;
      }
    }
    return true;
  };

  Blackout.prototype.playerCanWinInSuit = function(player, championCard) {
    var card, len1, m, ref, v;
    ref = player.hand;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      v = ref[m];
      card = new Card(v);
      if (card.suit === championCard.suit) {
        if (card.value > championCard.value) {
          return true;
        }
      }
    }
    return false;
  };

  Blackout.prototype.bestInPile = function() {
    var best, currentSuit, i, m, ref;
    if (this.pile.length === 0) {
      return -1;
    }
    currentSuit = this.currentSuit();
    best = 0;
    for (i = m = 1, ref = this.pile.length; 1 <= ref ? m < ref : m > ref; i = 1 <= ref ? ++m : --m) {
      if (cardBeats(this.pile[i], this.pile[best], currentSuit)) {
        best = i;
      }
    }
    return best;
  };

  Blackout.prototype.playerAfter = function(index) {
    return (index + 1) % this.players.length;
  };

  Blackout.prototype.output = function(text) {
    this.log.push(text);
    if (this.log.length > MAX_LOG_LINES) {
      return this.log.shift();
    }
  };

  Blackout.prototype.reset = function(params) {
    var len1, m, player, ref, roundCount;
    if (this.players.length < MIN_PLAYERS) {
      return 'notEnoughPlayers';
    }
    ref = this.players;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      player = ref[m];
      player.score = 0;
      player.hand = [];
    }
    this.nextRound = 0;
    this.trumpBroken = false;
    this.prev = [];
    this.pile = [];
    this.pileWho = [];
    this.prevWho = [];
    this.prevTrickTaker = -1;
    if (this.marathonMode()) {
      roundCount = "Marathon mode";
    } else {
      roundCount = this.rounds.length + " rounds";
    }
    this.output("New game! (" + this.players.length + " players, " + roundCount + ")");
    this.startBid();
    return OK;
  };

  Blackout.prototype.startBid = function(params) {
    var deck, i, j, len1, m, n, player, ref, ref1;
    if (this.marathonMode()) {
      if (this.players[0].score > 0) {
        return 'gameOver';
      }
      this.tricks = 13;
    } else {
      if (this.nextRound >= this.rounds.length) {
        return 'gameOver';
      }
      this.tricks = this.rounds[this.nextRound];
    }
    this.nextRound++;
    if (this.prevTrickTaker === -1) {
      this.dealer = Math.floor(Math.random() * this.players.length);
      this.output("Randomly assigning dealer to " + this.players[this.dealer].name);
    } else {
      this.dealer = this.prevTrickTaker;
      this.output(this.players[this.dealer].name + " claimed last trick, deals");
    }
    deck = new ShuffledDeck();
    ref = this.players;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      player = ref[i];
      player.bid = -1;
      player.tricks = 0;
      this.game.log("dealing " + this.tricks + " cards to player " + i);
      player.hand = [];
      for (j = n = 0, ref1 = this.tricks; 0 <= ref1 ? n < ref1 : n > ref1; j = 0 <= ref1 ? ++n : --n) {
        player.hand.push(deck.cards.shift());
      }
      player.hand.sort(function(a, b) {
        return a - b;
      });
    }
    this.state = State.BID;
    this.turn = this.playerAfter(this.dealer);
    this.bids = 0;
    this.pile = [];
    this.pileWho = [];
    this.prev = [];
    this.prevWho = [];
    this.prevTrickTaker = -1;
    this.output('Round ' + this.nextRound + ' begins ' + this.players[this.turn].name + ' bids first');
    return OK;
  };

  Blackout.prototype.endBid = function() {
    var i, lowestCard, lowestPlayer, m, player, ref;
    lowestPlayer = 0;
    lowestCard = this.players[0].hand[0];
    for (i = m = 1, ref = this.players.length; 1 <= ref ? m < ref : m > ref; i = 1 <= ref ? ++m : --m) {
      player = this.players[i];
      if (player.hand[0] < lowestCard) {
        lowestPlayer = i;
        lowestCard = player.hand[0];
      }
    }
    this.lowestRequired = true;
    this.turn = lowestPlayer;
    this.trumpBroken = false;
    this.trickID = 0;
    return this.startTrick();
  };

  Blackout.prototype.startTrick = function() {
    this.trickTaker = -1;
    this.state = State.TRICK;
    return OK;
  };

  Blackout.prototype.endTrick = function() {
    var gameEnding, len1, m, overUnder, penaltyPoints, player, ref, roundCount, step, taker;
    taker = this.players[this.trickTaker];
    taker.tricks++;
    this.output(taker.name + ' pockets the trick [' + taker.tricks + ']');
    this.prevTrickTaker = this.trickTaker;
    this.turn = this.trickTaker;
    this.prev = this.pile;
    this.prevWho = this.pileWho;
    this.pile = [];
    this.pileWho = [];
    this.trickID++;
    if (this.players[0].hand.length > 0) {
      return this.startTrick();
    } else {
      roundCount = this.rounds.length;
      if (this.marathonMode()) {
        roundCount = "M";
      }
      this.output('Round ends [' + this.nextRound + '/' + roundCount + ']');
      ref = this.players;
      for (m = 0, len1 = ref.length; m < len1; m++) {
        player = ref[m];
        overUnder = player.bid - player.tricks;
        if (overUnder < 0) {
          overUnder *= -1;
        }
        penaltyPoints = 0;
        step = 1;
        while (overUnder > 0) {
          penaltyPoints += step++;
          overUnder--;
        }
        player.score += penaltyPoints;
        player.lastWent = String(player.tricks) + '/' + String(player.bid);
        player.lastPoints = penaltyPoints;
      }
      gameEnding = false;
      if (this.marathonMode()) {
        gameEnding = this.players[0].score > 0;
      } else {
        gameEnding = this.nextRound >= this.rounds.length;
      }
      if (gameEnding) {
        return this.state = State.POSTGAMESUMMARY;
      } else {
        return this.state = State.ROUNDSUMMARY;
      }
    }
  };

  Blackout.prototype.quit = function(params) {
    this.state = State.POSTGAMESUMMARY;
    return this.output('Someone quit Blackout over');
  };

  Blackout.prototype.next = function(params) {
    switch (this.state) {
      case State.LOBBY:
        return this.reset(params);
      case State.BIDSUMMARY:
        return this.startTrick();
      case State.ROUNDSUMMARY:
        return this.startBid();
      case State.POSTGAMESUMMARY:
        return 'gameOver';
      default:
        return 'noNext';
    }
    return 'nextIsConfused';
  };

  Blackout.prototype.bid = function(params) {
    var currentPlayer;
    if (this.state !== State.BID) {
      return 'notBiddingNow';
    }
    currentPlayer = this.currentPlayer();
    if (params.id !== currentPlayer.id) {
      return 'notYourTurn';
    }
    params.bid = Number(params.bid);
    if ((params.bid < 0) || (params.bid > this.tricks)) {
      return 'bidOutOfRange';
    }
    if (this.turn === this.dealer) {
      if ((this.bids + params.bid) === this.tricks) {
        return 'dealerFucked';
      }
      this.endBid();
    } else {
      this.turn = this.playerAfter(this.turn);
    }
    currentPlayer.bid = params.bid;
    this.bids += currentPlayer.bid;
    this.output(currentPlayer.name + " bids " + currentPlayer.bid);
    if (this.state !== State.BID) {
      this.output('Bidding ends ' + this.bids + '/' + this.tricks + ' ' + this.players[this.turn].name + ' throws first');
    }
    return OK;
  };

  Blackout.prototype.addPlayer = function(player) {
    player.bid = 0;
    player.tricks = 0;
    player.score = 0;
    if (!player.ai) {
      player.ai = false;
    }
    this.players.push(player);
    return player.index = this.players.length - 1;
  };

  Blackout.prototype.namePresent = function(name) {
    var len1, m, player, ref;
    ref = this.players;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      player = ref[m];
      if (player.name === name) {
        return true;
      }
    }
    return false;
  };

  Blackout.prototype.addAI = function() {
    var ai;
    while (true) {
      character = randomCharacter();
      if (!this.namePresent(character.name)) {
        break;
      }
    }
    ai = {
      charID: character.id,
      name: character.name,
      id: 'ai' + String(this.players.length),
      ai: true
    };
    this.addPlayer(ai);
    this.game.log("added AI player");
    return OK;
  };

  Blackout.prototype.canPlay = function(params) {
    var bestIndex, card, chosenCard, chosenCardX, currentPlayer, currentWinningCard, currentWinningCardX, forcedSuit, i, len1, m, ref;
    if (this.state !== State.TRICK) {
      return 'notInTrick';
    }
    currentPlayer = this.currentPlayer();
    if (params.id !== currentPlayer.id) {
      return 'notYourTurn';
    }
    if (params.hasOwnProperty('which')) {
      params.which = Number(params.which);
      params.index = -1;
      ref = currentPlayer.hand;
      for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
        card = ref[i];
        if (card === params.which) {
          params.index = i;
          break;
        }
      }
      if (params.index === -1) {
        return 'doNotHave';
      }
    } else {
      params.index = Number(params.index);
    }
    if ((params.index < 0) || (params.index >= currentPlayer.hand.length)) {
      return 'indexOutOfRange';
    }
    if (this.lowestRequired && (params.index !== 0)) {
      return 'lowestCardRequired';
    }
    chosenCardX = currentPlayer.hand[params.index];
    chosenCard = new Card(chosenCardX);
    if ((!this.trumpBroken) && (this.pile.length === 0) && (chosenCard.suit === Suit.SPADES) && (!this.playerHasOnlySpades(currentPlayer))) {
      return 'trumpNotBroken';
    }
    bestIndex = this.bestInPile();
    forcedSuit = this.currentSuit();
    if (forcedSuit !== Suit.NONE) {
      if (this.playerHasSuit(currentPlayer, forcedSuit)) {
        if (chosenCard.suit !== forcedSuit) {
          return 'forcedInSuit';
        }
        currentWinningCardX = this.pile[bestIndex];
        currentWinningCard = new Card(currentWinningCardX);
        if (currentWinningCard.suit === forcedSuit) {
          if ((!cardBeats(chosenCardX, currentWinningCardX, forcedSuit)) && (this.playerCanWinInSuit(currentPlayer, currentWinningCard))) {
            return 'forcedHigherInSuit';
          }
        }
      } else {
        forcedSuit = Suit.NONE;
      }
    }
    return OK;
  };

  Blackout.prototype.play = function(params) {
    var bestIndex, canPlayCard, card, chosenCard, chosenCardX, currentPlayer, i, len1, m, msg, ref;
    canPlayCard = this.canPlay(params);
    if (canPlayCard !== OK) {
      return canPlayCard;
    }
    currentPlayer = this.currentPlayer();
    if (params.hasOwnProperty('which')) {
      params.which = Number(params.which);
      params.index = -1;
      ref = currentPlayer.hand;
      for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
        card = ref[i];
        if (card === params.which) {
          params.index = i;
          break;
        }
      }
      if (params.index === -1) {
        return 'doNotHave';
      }
    } else {
      params.index = Number(params.index);
    }
    chosenCardX = currentPlayer.hand[params.index];
    chosenCard = new Card(chosenCardX);
    this.lowestRequired = false;
    this.pile.push(currentPlayer.hand[params.index]);
    this.pileWho.push(this.turn);
    currentPlayer.hand.splice(params.index, 1);
    bestIndex = this.bestInPile();
    if (bestIndex === (this.pile.length - 1)) {
      this.trickTaker = this.turn;
    }
    if (this.pile.length === 1) {
      msg = currentPlayer.name + " leads with " + chosenCard.name;
    } else {
      if (this.trickTaker === this.turn) {
        msg = currentPlayer.name + " claims the trick with " + chosenCard.name;
      } else {
        msg = currentPlayer.name + " dumps " + chosenCard.name;
      }
    }
    if ((!this.trumpBroken) && (chosenCard.suit === Suit.SPADES)) {
      msg += " (trump broken)";
      this.trumpBroken = true;
    }
    this.output(msg);
    if (this.pile.length === this.players.length) {
      this.endTrick();
    } else {
      this.turn = this.playerAfter(this.turn);
    }
    return OK;
  };

  Blackout.prototype.aiLogBid = function(i, why) {
    var card, currentPlayer;
    currentPlayer = this.currentPlayer();
    if (!currentPlayer.ai) {
      return false;
    }
    card = new Card(currentPlayer.hand[i]);
    return this.aiLog('potential winner: ' + card.name + ' [' + why + ']');
  };

  Blackout.prototype.aiLogPlay = function(i, why) {
    var card, currentPlayer;
    if (i === -1) {
      return;
    }
    currentPlayer = this.currentPlayer();
    if (!currentPlayer.ai) {
      return false;
    }
    card = new Card(currentPlayer.hand[i]);
    return this.aiLog('bestPlay: ' + card.name + ' [' + why + ']');
  };

  Blackout.prototype.aiBid = function(currentPlayer, i) {
    var reply;
    reply = this.bid({
      'id': currentPlayer.id,
      'bid': i
    });
    if (reply === OK) {
      this.game.log("AI: " + currentPlayer.name + " bids " + String(i));
      return true;
    }
    return false;
  };

  Blackout.prototype.aiPlay = function(currentPlayer, i) {
    var card, reply;
    card = new Card(currentPlayer.hand[i]);
    reply = this.play({
      'id': currentPlayer.id,
      'index': i
    });
    if (reply === OK) {
      this.game.log("AI: " + currentPlayer.name + " plays " + card.name);
      return true;
    } else {
      if (reply === 'dealerFucked') {
        this.output(currentPlayer.name + ' says "I hate being the dealer."');
      }
    }
    return false;
  };

  Blackout.prototype.aiPlayLow = function(currentPlayer, startingPoint) {
    var i, m, n, ref, ref1, ref2;
    for (i = m = ref = startingPoint, ref1 = currentPlayer.hand.length; ref <= ref1 ? m < ref1 : m > ref1; i = ref <= ref1 ? ++m : --m) {
      if (this.aiPlay(currentPlayer, i)) {
        return true;
      }
    }
    for (i = n = 0, ref2 = startingPoint; 0 <= ref2 ? n < ref2 : n > ref2; i = 0 <= ref2 ? ++n : --n) {
      if (this.aiPlay(currentPlayer, i)) {
        return true;
      }
    }
    return false;
  };

  Blackout.prototype.aiPlayHigh = function(currentPlayer, startingPoint) {
    var i, m, n, ref, ref1, ref2;
    for (i = m = ref = startingPoint; m >= 0; i = m += -1) {
      if (this.aiPlay(currentPlayer, i)) {
        return true;
      }
    }
    for (i = n = ref1 = currentPlayer.hand.length - 1, ref2 = startingPoint; n > ref2; i = n += -1) {
      if (this.aiPlay(currentPlayer, i)) {
        return true;
      }
    }
    return false;
  };

  Blackout.prototype.aiLog = function(text) {
    var currentPlayer;
    currentPlayer = this.currentPlayer();
    if (!currentPlayer.ai) {
      return false;
    }
    character = aiCharacters[currentPlayer.charID];
    return this.game.log('AI[' + currentPlayer.name + ' ' + currentPlayer.tricks + '/' + currentPlayer.bid + ' ' + character.brain + ']: hand:' + stringifyCards(currentPlayer.hand) + ' pile:' + stringifyCards(this.pile) + ' ' + text);
  };

  Blackout.prototype.aiTick = function() {
    var bid, currentPlayer, i, m, playedCard, ref, startingPoint;
    if ((this.state !== State.BID) && (this.state !== State.TRICK)) {
      return false;
    }
    currentPlayer = this.currentPlayer();
    if (!currentPlayer.ai) {
      return false;
    }
    if (this.state === State.BID) {
      this.aiLog("about to call brain.bid");
      character = aiCharacters[currentPlayer.charID];
      bid = this.brains[character.brain].bid.apply(this, [currentPlayer]);
      this.aiLog('bid:' + String(bid));
      if (this.aiBid(currentPlayer, bid)) {
        return true;
      }
      if (this.aiBid(currentPlayer, bid - 1)) {
        return true;
      }
      if (this.aiBid(currentPlayer, bid + 1)) {
        return true;
      }
      if (this.aiBid(currentPlayer, bid - 2)) {
        return true;
      }
      if (this.aiBid(currentPlayer, bid + 2)) {
        return true;
      }
      for (i = m = 0, ref = currentPlayer.hand.length; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
        if (this.aiBid(currentPlayer, i)) {
          this.aiLog('gave up and bid:' + String(i));
          return true;
        }
      }
    }
    if (this.state === State.TRICK) {
      this.aiLog("about to call brain.play");
      character = aiCharacters[currentPlayer.charID];
      playedCard = this.brains[character.brain].play.apply(this, [currentPlayer]);
      if (playedCard) {
        return true;
      } else {
        this.aiLog('brain failed to play card: picking random card to play');
        startingPoint = Math.floor(Math.random() * currentPlayer.hand.length);
        return this.aiPlayLow(currentPlayer, startingPoint);
      }
    }
    return false;
  };

  Blackout.prototype.brains = {
    normal: {
      id: "normal",
      name: "Normal",
      bid: function(currentPlayer) {
        var bid, card, clubValues, cr, handSize, i, len1, m, partialFaces, partialSpades, ref, v;
        handSize = currentPlayer.hand.length;
        cr = this.players.length * handSize;
        bid = 0;
        partialSpades = 0;
        partialFaces = 0;
        ref = currentPlayer.hand;
        for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
          v = ref[i];
          card = new Card(v);
          if (card.suit === Suit.SPADES) {
            if (cr > 40) {
              if (card.value >= 6) {
                bid++;
                this.aiLogBid(i, '8S or bigger');
                continue;
              } else {
                partialSpades++;
                if (partialSpades > 1) {
                  bid++;
                  this.aiLogBid(i, 'a couple of low spades');
                  partialSpades = 0;
                  continue;
                }
              }
            } else {
              bid++;
              this.aiLogBid(i, 'spade');
              continue;
            }
          } else {
            if ((card.value >= 9) && (card.value <= 11)) {
              partialFaces++;
              if (partialFaces > 2) {
                partialFaces = 0;
                this.aiLogBid(i, 'a couple JQK non-spades');
                continue;
              }
            }
          }
          if (cr > 40) {
            if ((card.value >= 11) && (card.suit !== Suit.CLUBS)) {
              bid++;
              this.aiLogBid(i, 'non-club ace or king');
              continue;
            }
          }
        }
        if (handSize >= 6) {
          clubValues = valuesOfSuit(currentPlayer.hand, Suit.CLUBS);
          if (clubValues.length > 0) {
            if (clubValues[clubValues.length - 1] === 12) {
              if (clubValues[0] > 0) {
                bid++;
                this.aiLogBid(0, 'AC with no 2C');
              }
            }
          }
        }
        return bid;
      },
      play: function(currentPlayer) {
        var bestPlay, currentSuit, lastCard, play, tricksNeeded, wantToWin, winningCard, winningIndex;
        tricksNeeded = currentPlayer.bid - currentPlayer.tricks;
        wantToWin = tricksNeeded > 0;
        bestPlay = -1;
        currentSuit = this.currentSuit();
        winningIndex = this.bestInPile();
        if (this.pile.length === this.players.length) {
          currentSuit = Suit.NONE;
          winningIndex = -1;
        }
        winningCard = false;
        if (winningIndex !== -1) {
          winningCard = new Card(this.pile[winningIndex]);
        }
        if (wantToWin) {
          if (currentSuit === Suit.NONE) {
            play = highestValueNonSpadeIndex(currentPlayer.hand, Suit.NONE);
            this.aiLogPlay(play, 'highest non-spade (trying to win)');
            if (bestPlay === -1) {
              bestPlay = 0;
              this.aiLogPlay(bestPlay, 'lowest spade (trying to win bleeding the table for a future win)');
            }
          } else {
            if (this.playerHasSuit(currentPlayer, currentSuit)) {
              if (this.playerCanWinInSuit(currentPlayer, winningCard)) {
                bestPlay = highestIndexInSuit(currentPlayer.hand, winningCard.suit);
                this.aiLogPlay(bestPlay, 'highest in suit (trying to win forced in suit)');
                if (bestPlay !== -1) {
                  return this.aiPlayHigh(currentPlayer, bestPlay);
                }
              } else {
                bestPlay = lowestIndexInSuit(currentPlayer.hand, winningCard.suit);
                this.aiLogPlay(bestPlay, 'lowest in suit (trying to win forced in suit, cant win)');
                if (bestPlay !== -1) {
                  return this.aiPlayLow(currentPlayer, bestPlay);
                }
              }
            }
            if (bestPlay === -1) {
              lastCard = new Card(currentPlayer.hand[currentPlayer.hand.length - 1]);
              if (lastCard.suit === Suit.SPADES) {
                bestPlay = currentPlayer.hand.length - 1;
                this.aiLogPlay(bestPlay, 'trump (trying to win)');
              } else {
                bestPlay = lowestValueIndex(currentPlayer.hand, Suit.NONE);
                this.aiLogPlay(bestPlay, 'dump (trying to win, throwing lowest)');
              }
            }
          }
        } else {
          if (currentSuit === Suit.NONE) {
            bestPlay = lowestValueIndex(currentPlayer.hand, Suit.SPADES);
            this.aiLogPlay(bestPlay, 'lowest value (trying to lose avoiding spades)');
          } else {
            if (this.playerHasSuit(currentPlayer, currentSuit)) {
              if (this.playerCanWinInSuit(currentPlayer, winningCard)) {
                bestPlay = lowestIndexInSuit(currentPlayer.hand, winningCard.suit);
                this.aiLogPlay(bestPlay, 'lowest in suit (trying to lose forced to win)');
                if (bestPlay !== -1) {
                  return this.aiPlayLow(currentPlayer, bestPlay);
                }
              } else {
                bestPlay = highestIndexInSuit(currentPlayer.hand, winningCard.suit);
                this.aiLogPlay(bestPlay, 'highest in suit (trying to lose forced in suit, but cant win)');
                if (bestPlay !== -1) {
                  return this.aiPlayHigh(currentPlayer, bestPlay);
                }
              }
            }
            if (bestPlay === -1) {
              if ((currentSuit !== Suit.SPADES) && (winningCard.suit === Suit.SPADES)) {
                bestPlay = highestValueIndexInSuitLowerThan(currentPlayer.hand, winningCard);
                this.aiLogPlay(bestPlay, 'trying to lose highest dumpable spade');
              }
            }
            if (bestPlay === -1) {
              bestPlay = highestValueNonSpadeIndex(currentPlayer.hand, winningCard.suit);
              this.aiLogPlay(bestPlay, 'trying to lose highest dumpable non-spade');
            }
          }
        }
        if (bestPlay !== -1) {
          if (this.aiPlay(currentPlayer, bestPlay)) {
            return true;
          } else {
            this.aiLog('not allowed to play my best play');
          }
        }
        return false;
      }
    },
    chaos: {
      id: "chaos",
      name: "Chaos",
      bid: function(currentPlayer) {
        return Math.floor(Math.random() * currentPlayer.hand.length * 0.5);
      },
      play: function(currentPlayer) {
        var canPlayCard, i, legalIndices, len1, m, randomIndex, ref, v;
        legalIndices = [];
        ref = currentPlayer.hand;
        for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
          v = ref[i];
          canPlayCard = this.canPlay({
            id: currentPlayer.id,
            index: i
          });
          if (canPlayCard === OK) {
            legalIndices.push(i);
          }
        }
        randomIndex = Math.floor(Math.random() * legalIndices.length);
        this.aiLog("legal indices: " + (JSON.stringify(legalIndices)) + ", choosing index " + legalIndices[randomIndex]);
        return this.aiPlay(currentPlayer, legalIndices[randomIndex]);
      }
    },
    conservativeMoron: {
      id: "conservativeMoron",
      name: "Conservative Moron",
      bid: function(currentPlayer) {
        var bid, card, len1, m, ref, v;
        bid = 0;
        ref = currentPlayer.hand;
        for (m = 0, len1 = ref.length; m < len1; m++) {
          v = ref[m];
          card = new Card(v);
          if (card.suit === Suit.SPADES) {
            bid++;
          }
        }
        this.aiLog("I am a moron and I have " + bid + " spades. Let's roll with it.");
        return bid;
      },
      play: function(currentPlayer) {
        this.aiLog("playing lowest possible card");
        return this.aiPlayLow(currentPlayer, 0);
      }
    },
    aggressiveMoron: {
      id: "aggressiveMoron",
      name: "Aggressive Moron",
      bid: function(currentPlayer) {
        var bid, card, len1, m, ref, v;
        bid = 0;
        ref = currentPlayer.hand;
        for (m = 0, len1 = ref.length; m < len1; m++) {
          v = ref[m];
          card = new Card(v);
          if ((card.suit === Suit.SPADES) || (card.value === 12)) {
            bid++;
          }
        }
        this.aiLog("I am a moron and I have " + bid + " spades and/or aces. Fart.");
        return bid;
      },
      play: function(currentPlayer) {
        this.aiLog("playing highest possible card");
        return this.aiPlayHigh(currentPlayer, currentPlayer.hand.length - 1);
      }
    }
  };

  return Blackout;

})();

valuesOfSuit = function(hand, suit) {
  var card, len1, m, v, values;
  values = [];
  for (m = 0, len1 = hand.length; m < len1; m++) {
    v = hand[m];
    card = new Card(v);
    if (card.suit === suit) {
      values.push(card.value);
    }
  }
  return values;
};

stringifyCards = function(cards) {
  var card, len1, m, t, v;
  t = '';
  for (m = 0, len1 = cards.length; m < len1; m++) {
    v = cards[m];
    card = new Card(v);
    if (t) {
      t += ',';
    }
    t += card.name;
  }
  return '[' + t + ']';
};

lowestIndexInSuit = function(hand, suit) {
  var card, i, len1, m, v;
  for (i = m = 0, len1 = hand.length; m < len1; i = ++m) {
    v = hand[i];
    card = new Card(v);
    if (card.suit === suit) {
      return i;
    }
  }
  return -1;
};

highestIndexInSuit = function(hand, suit) {
  var card, i, m, v;
  for (i = m = hand.length - 1; m >= 0; i = m += -1) {
    v = hand[i];
    card = new Card(v);
    if (card.suit === suit) {
      return i;
    }
  }
  return -1;
};

lowestValueIndex = function(hand, avoidSuit) {
  var card, i, lowestIndex, lowestValue, m, ref;
  card = new Card(hand[0]);
  lowestIndex = 0;
  lowestValue = card.value;
  for (i = m = 1, ref = hand.length; 1 <= ref ? m < ref : m > ref; i = 1 <= ref ? ++m : --m) {
    card = new Card(hand[i]);
    if (card.suit !== avoidSuit) {
      if (card.value < lowestValue) {
        lowestValue = card.value;
        lowestIndex = i;
      }
    }
  }
  return lowestIndex;
};

highestValueNonSpadeIndex = function(hand, avoidSuit) {
  var card, highestIndex, highestValue, i, m, ref;
  highestIndex = -1;
  highestValue = -1;
  for (i = m = ref = hand.length - 1; m >= 0; i = m += -1) {
    card = new Card(hand[i]);
    if ((card.suit !== avoidSuit) && (card.suit !== Suit.SPADES)) {
      if (card.value > highestValue) {
        highestValue = card.value;
        highestIndex = i;
      }
    }
  }
  return highestIndex;
};

highestValueIndexInSuitLowerThan = function(hand, winningCard) {
  var card, i, m, ref;
  for (i = m = ref = hand.length - 1; m >= 0; i = m += -1) {
    card = new Card(hand[i]);
    if ((card.suit === winningCard.suit) && (card.value < winningCard.value)) {
      return i;
    }
  }
  return -1;
};

module.exports = {
  Card: Card,
  Blackout: Blackout,
  State: State,
  OK: OK,
  aiCharacters: aiCharacters
};


},{}],3:[function(require,module,exports){
var Animation, Button;

Animation = require('./Animation');

Button = (function() {
  function Button(game, spriteNames, font, textHeight, x, y, cb) {
    this.game = game;
    this.spriteNames = spriteNames;
    this.font = font;
    this.textHeight = textHeight;
    this.x = x;
    this.y = y;
    this.cb = cb;
    this.anim = new Animation({
      speed: {
        s: 3
      },
      s: 0
    });
    this.color = {
      r: 1,
      g: 1,
      b: 1,
      a: 0
    };
  }

  Button.prototype.update = function(dt) {
    return this.anim.update(dt);
  };

  Button.prototype.render = function() {
    var text;
    this.color.a = this.anim.cur.s;
    this.game.spriteRenderer.render(this.spriteNames[0], this.x, this.y, 0, this.textHeight * 1.5, 0, 0.5, 0.5, this.game.colors.white, (function(_this) {
      return function() {
        _this.anim.cur.s = 1;
        _this.anim.req.s = 0;
        return _this.cb(true);
      };
    })(this));
    this.game.spriteRenderer.render(this.spriteNames[1], this.x, this.y, 0, this.textHeight * 1.5, 0, 0.5, 0.5, this.color);
    text = this.cb(false);
    return this.game.fontRenderer.render(this.font, this.textHeight, text, this.x, this.y, 0.5, 0.5, this.game.colors.buttontext);
  };

  return Button;

})();

module.exports = Button;


},{"./Animation":1}],4:[function(require,module,exports){
var FontRenderer, fontmetrics, hexToRgb;

fontmetrics = require('./fontmetrics');

hexToRgb = function(hex, a) {
  var result;
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return null;
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: a
  };
};

FontRenderer = (function() {
  function FontRenderer(game) {
    this.game = game;
    this.white = {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    };
  }

  FontRenderer.prototype.size = function(font, height, str) {
    var ch, code, glyph, i, j, len1, metrics, scale, totalHeight, totalWidth;
    metrics = fontmetrics[font];
    if (!metrics) {
      return;
    }
    scale = height / metrics.height;
    totalWidth = 0;
    totalHeight = metrics.height * scale;
    for (i = j = 0, len1 = str.length; j < len1; i = ++j) {
      ch = str[i];
      code = ch.charCodeAt(0);
      glyph = metrics.glyphs[code];
      if (!glyph) {
        continue;
      }
      totalWidth += glyph.xadvance * scale;
    }
    return {
      w: totalWidth,
      h: totalHeight
    };
  };

  FontRenderer.prototype.render = function(font, height, str, x, y, anchorx, anchory, color, cb) {
    var anchorOffsetX, anchorOffsetY, ch, code, colorStart, currX, currentColor, glyph, i, j, k, len, len1, len2, metrics, results, scale, skipColor, startingColor, totalHeight, totalWidth;
    metrics = fontmetrics[font];
    if (!metrics) {
      return;
    }
    scale = height / metrics.height;
    totalWidth = 0;
    totalHeight = metrics.height * scale;
    skipColor = false;
    for (i = j = 0, len1 = str.length; j < len1; i = ++j) {
      ch = str[i];
      if (ch === '`') {
        skipColor = !skipColor;
      }
      if (skipColor) {
        continue;
      }
      code = ch.charCodeAt(0);
      glyph = metrics.glyphs[code];
      if (!glyph) {
        continue;
      }
      totalWidth += glyph.xadvance * scale;
    }
    anchorOffsetX = -1 * anchorx * totalWidth;
    anchorOffsetY = -1 * anchory * totalHeight;
    currX = x;
    if (color) {
      startingColor = color;
    } else {
      startingColor = this.white;
    }
    currentColor = startingColor;
    colorStart = -1;
    results = [];
    for (i = k = 0, len2 = str.length; k < len2; i = ++k) {
      ch = str[i];
      if (ch === '`') {
        if (colorStart === -1) {
          colorStart = i + 1;
        } else {
          len = i - colorStart;
          if (len) {
            currentColor = hexToRgb(str.substr(colorStart, i - colorStart), startingColor.a);
          } else {
            currentColor = startingColor;
          }
          colorStart = -1;
        }
      }
      if (colorStart !== -1) {
        continue;
      }
      code = ch.charCodeAt(0);
      glyph = metrics.glyphs[code];
      if (!glyph) {
        continue;
      }
      this.game.drawImage(font, glyph.x, glyph.y, glyph.width, glyph.height, currX + (glyph.xoffset * scale) + anchorOffsetX, y + (glyph.yoffset * scale) + anchorOffsetY, glyph.width * scale, glyph.height * scale, 0, 0, 0, currentColor.r, currentColor.g, currentColor.b, currentColor.a, cb);
      results.push(currX += glyph.xadvance * scale);
    }
    return results;
  };

  return FontRenderer;

})();

module.exports = FontRenderer;


},{"./fontmetrics":10}],5:[function(require,module,exports){
var Animation, BUILD_TIMESTAMP, Blackout, Button, FontRenderer, Game, Hand, Menu, OK, Pile, SpriteRenderer, State, aiCharacters, ref;

Animation = require('./Animation');

Button = require('./Button');

FontRenderer = require('./FontRenderer');

SpriteRenderer = require('./SpriteRenderer');

Menu = require('./Menu');

Hand = require('./Hand');

Pile = require('./Pile');

ref = require('./Blackout'), Blackout = ref.Blackout, State = ref.State, OK = ref.OK, aiCharacters = ref.aiCharacters;

BUILD_TIMESTAMP = "0.0.1";

Game = (function() {
  function Game(_native, width, height) {
    var bidButtonDistance;
    this["native"] = _native;
    this.width = width;
    this.height = height;
    this.version = BUILD_TIMESTAMP;
    this.log("Game constructed: " + this.width + "x" + this.height);
    this.fontRenderer = new FontRenderer(this);
    this.spriteRenderer = new SpriteRenderer(this);
    this.font = "darkforest";
    this.zones = [];
    this.nextAITick = 1000;
    this.center = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.aaHeight = this.width * 9 / 16;
    this.log("height: " + this.height + ". height if screen was 16:9 (aspect adjusted): " + this.aaHeight);
    this.pauseButtonSize = this.aaHeight / 15;
    this.colors = {
      white: {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      },
      black: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      red: {
        r: 1,
        g: 0,
        b: 0,
        a: 1
      },
      orange: {
        r: 1,
        g: 0.5,
        b: 0,
        a: 1
      },
      gold: {
        r: 1,
        g: 1,
        b: 0,
        a: 1
      },
      buttontext: {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      },
      lightgray: {
        r: 0.5,
        g: 0.5,
        b: 0.5,
        a: 1
      },
      background: {
        r: 0,
        g: 0.2,
        b: 0,
        a: 1
      },
      logbg: {
        r: 0.1,
        g: 0,
        b: 0,
        a: 1
      },
      arrow: {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      },
      arrowclose: {
        r: 1,
        g: 0.5,
        b: 0,
        a: 0.3
      },
      handarea: {
        r: 0,
        g: 0.1,
        b: 0,
        a: 1.0
      },
      overlay: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.6
      },
      mainmenu: {
        r: 0.1,
        g: 0.1,
        b: 0.1,
        a: 1
      },
      pausemenu: {
        r: 0.1,
        g: 0.0,
        b: 0.1,
        a: 1
      },
      bid: {
        r: 0,
        g: 0.6,
        b: 0,
        a: 1
      }
    };
    this.textures = {
      "cards": 0,
      "darkforest": 1,
      "chars": 2,
      "howto1": 3,
      "howto2": 4,
      "howto3": 5
    };
    this.blackout = null;
    this.lastErr = '';
    this.paused = false;
    this.howto = 0;
    this.renderCommands = [];
    this.bid = 0;
    this.bidButtonSize = this.aaHeight / 8;
    this.bidTextSize = this.aaHeight / 6;
    bidButtonDistance = this.bidButtonSize * 3;
    this.bidButtonY = this.center.y - this.bidButtonSize;
    this.bidUI = {
      minus: new Button(this, ['minus0', 'minus1'], this.font, this.bidButtonSize, this.center.x - bidButtonDistance, this.bidButtonY, (function(_this) {
        return function(click) {
          if (click) {
            _this.adjustBid(-1);
          }
          return '';
        };
      })(this)),
      plus: new Button(this, ['plus0', 'plus1'], this.font, this.bidButtonSize, this.center.x + bidButtonDistance, this.bidButtonY, (function(_this) {
        return function(click) {
          if (click) {
            _this.adjustBid(1);
          }
          return '';
        };
      })(this))
    };
    this.optionMenus = {
      rounds: [
        {
          text: "8 rounds of 13",
          data: "13|13|13|13|13|13|13|13"
        }, {
          text: "4 rounds of 13",
          data: "13|13|13|13"
        }, {
          text: "3 to 13",
          data: "3|4|5|6|7|8|9|10|11|12|13"
        }, {
          text: "3 to 13 by odds",
          data: "3|5|7|9|11|13"
        }, {
          text: "Marathon",
          data: "M"
        }
      ],
      speeds: [
        {
          text: "AI Speed: Slow",
          speed: 2000
        }, {
          text: "AI Speed: Medium",
          speed: 1000
        }, {
          text: "AI Speed: Fast",
          speed: 500
        }, {
          text: "AI Speed: Ultra",
          speed: 250
        }
      ]
    };
    this.options = {
      players: 4,
      roundIndex: 0,
      speedIndex: 1,
      sound: true
    };
    this.mainMenu = new Menu(this, "Blackout!", "solid", this.colors.mainmenu, [
      (function(_this) {
        return function(click) {
          if (click) {
            _this.howto = 1;
          }
          return "How To Play";
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.options.roundIndex = (_this.options.roundIndex + 1) % _this.optionMenus.rounds.length;
          }
          return _this.optionMenus.rounds[_this.options.roundIndex].text;
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.options.players++;
            if (_this.options.players > 4) {
              _this.options.players = 3;
            }
          }
          return _this.options.players + " Players";
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.options.speedIndex = (_this.options.speedIndex + 1) % _this.optionMenus.speeds.length;
          }
          return _this.optionMenus.speeds[_this.options.speedIndex].text;
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.newGame();
          }
          return "Start";
        };
      })(this)
    ]);
    this.pauseMenu = new Menu(this, "Paused", "solid", this.colors.pausemenu, [
      (function(_this) {
        return function(click) {
          if (click) {
            _this.paused = false;
          }
          return "Resume Game";
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.howto = 1;
          }
          return "How To Play";
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.options.speedIndex = (_this.options.speedIndex + 1) % _this.optionMenus.speeds.length;
          }
          return _this.optionMenus.speeds[_this.options.speedIndex].text;
        };
      })(this), (function(_this) {
        return function(click) {
          if (click) {
            _this.blackout = null;
            _this.paused = false;
          }
          return "Quit Game";
        };
      })(this)
    ]);
  }

  Game.prototype.log = function(s) {
    return this["native"].log(s);
  };

  Game.prototype.load = function(json) {
    var k, ref1, state, v;
    this.log("(CS) loading state");
    try {
      state = JSON.parse(json);
    } catch (error) {
      this.log("load failed to parse state: " + json);
      return;
    }
    if (state.options) {
      ref1 = state.options;
      for (k in ref1) {
        v = ref1[k];
        this.options[k] = v;
      }
    }
    if (state.blackout) {
      this.log("recreating game from savedata");
      this.blackout = new Blackout(this, {
        state: state.blackout
      });
      return this.prepareGame();
    }
  };

  Game.prototype.save = function() {
    var state;
    state = {
      options: this.options
    };
    if (this.blackout != null) {
      state.blackout = this.blackout.save();
    }
    return JSON.stringify(state);
  };

  Game.prototype.aiTickRate = function() {
    return this.optionMenus.speeds[this.options.speedIndex].speed;
  };

  Game.prototype.newGame = function() {
    var j, p, ref1;
    this.blackout = new Blackout(this, {
      rounds: this.optionMenus.rounds[this.options.roundIndex].data,
      players: [
        {
          id: 1,
          name: 'Player'
        }
      ]
    });
    for (p = j = 1, ref1 = this.options.players; 1 <= ref1 ? j < ref1 : j > ref1; p = 1 <= ref1 ? ++j : --j) {
      this.blackout.addAI();
    }
    this.log("next: " + this.blackout.next());
    this.log("player 0's hand: " + JSON.stringify(this.blackout.players[0].hand));
    return this.prepareGame();
  };

  Game.prototype.prepareGame = function() {
    this.hand = new Hand(this);
    this.pile = new Pile(this, this.hand);
    return this.hand.set(this.blackout.players[0].hand);
  };

  Game.prototype.makeHand = function(index) {
    var j, results, v;
    results = [];
    for (v = j = 0; j < 13; v = ++j) {
      if (v === index) {
        results.push(this.hand[v] = 13);
      } else {
        results.push(this.hand[v] = v);
      }
    }
    return results;
  };

  Game.prototype.touchDown = function(x, y) {
    return this.checkZones(x, y);
  };

  Game.prototype.touchMove = function(x, y) {
    if (this.blackout !== null) {
      return this.hand.move(x, y);
    }
  };

  Game.prototype.touchUp = function(x, y) {
    if (this.blackout !== null) {
      return this.hand.up(x, y);
    }
  };

  Game.prototype.adjustBid = function(amount) {
    if (this.blackout === null) {
      return;
    }
    this.bid = this.bid + amount;
    if (this.bid < 0) {
      this.bid = 0;
    }
    if (this.bid > this.blackout.tricks) {
      return this.bid = this.blackout.tricks;
    }
  };

  Game.prototype.attemptBid = function() {
    if (this.blackout === null) {
      return;
    }
    this.adjustBid(0);
    if (this.blackout.state === State.BID) {
      if (this.blackout.turn === 0) {
        this.log("bidding " + this.bid);
        return this.lastErr = this.blackout.bid({
          id: 1,
          bid: this.bid,
          ai: false
        });
      }
    }
  };

  Game.prototype.prettyErrorTable = {
    bidOutOfRange: "You are somehow bidding an impossible value. The game must be broken.",
    dealerFucked: "Dealer restriction: You may not make total bids match total tricks.",
    doNotHave: "You are somehow attempting to play a card you don't own. The game must be broken.",
    forcedHigherInSuit: "You have a higher value in the lead suit. You must play it. (Rule 2)",
    forcedInSuit: "You have at least one of the lead suit. You must play it. (Rule 1)",
    gameOver: "The game is over.  The game must be broken.",
    indexOutOfRange: "You don't have that index. The game must be broken.",
    lowestCardRequired: "You must start the round with the lowest card you have.",
    nextIsConfused: "Interal error. The game must be broken.",
    noNext: "Interal error. The game must be broken.",
    notBiddingNow: "You are trying to bid during the wrong phase.",
    notEnoughPlayers: "Cannot start the game without more players.",
    notInTrick: "You are trying to play a card during the wrong phase.",
    notYourTurn: "It isn't your turn.",
    trumpNotBroken: "Trump isn't broken yet. Lead with a non-spade."
  };

  Game.prototype.prettyError = function() {
    var pretty;
    pretty = this.prettyErrorTable[this.lastErr];
    if (pretty) {
      return pretty;
    }
    return this.lastErr;
  };

  Game.prototype.calcHeadline = function() {
    var errText, headline;
    if (this.blackout === null) {
      return "";
    }
    headline = "";
    switch (this.blackout.state) {
      case State.BID:
        headline = "Waiting for `ff7700`" + this.blackout.players[this.blackout.turn].name + "`` to `ffff00`bid``";
        break;
      case State.TRICK:
        headline = "Waiting for `ff7700`" + this.blackout.players[this.blackout.turn].name + "`` to `ffff00`play``";
        break;
      case State.ROUNDSUMMARY:
        headline = "Waiting for next round...";
        break;
      case State.POSTGAMESUMMARY:
        headline = "Game over!";
    }
    errText = "";
    if ((this.lastErr.length > 0) && (this.lastErr !== OK)) {
      errText = "  ERROR: `ff0000`" + (this.prettyError());
      headline += errText;
    }
    return headline;
  };

  Game.prototype.gameOverText = function() {
    var j, l, len, len1, lowestScore, player, ref1, ref2, winners;
    if (this.blackout === null) {
      return ["Game Over!"];
    }
    if (this.blackout.marathonMode()) {
      return ["Marathon over!", "Survived " + (this.blackout.nextRound - 1) + " rounds"];
    }
    lowestScore = this.blackout.players[0].score;
    ref1 = this.blackout.players;
    for (j = 0, len = ref1.length; j < len; j++) {
      player = ref1[j];
      if (lowestScore > player.score) {
        lowestScore = player.score;
      }
    }
    winners = [];
    ref2 = this.blackout.players;
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      player = ref2[l];
      if (player.score === lowestScore) {
        winners.push(player.name);
      }
    }
    if (winners.length === 1) {
      return [winners[0] + " wins!"];
    }
    return ["Tie: " + (winners.join(','))];
  };

  Game.prototype.play = function(cardToPlay, x, y, r, cardIndex) {
    var ret;
    if (this.blackout.state === State.TRICK) {
      this.log("(game) playing card " + cardToPlay);
      ret = this.blackout.play({
        id: 1,
        which: cardToPlay
      });
      this.lastErr = ret;
      if (ret === OK) {
        this.hand.set(this.blackout.players[0].hand);
        return this.pile.hint(cardToPlay, x, y, r);
      }
    }
  };

  Game.prototype.update = function(dt) {
    var updated;
    this.zones.length = 0;
    updated = false;
    if (this.updateMainMenu(dt)) {
      updated = true;
    }
    if (this.updateGame(dt)) {
      updated = true;
    }
    return updated;
  };

  Game.prototype.updateMainMenu = function(dt) {
    var updated;
    updated = false;
    if (this.mainMenu.update(dt)) {
      updated = true;
    }
    return updated;
  };

  Game.prototype.updateGame = function(dt) {
    var trickTakerName, updated;
    if (this.blackout === null) {
      return false;
    }
    updated = false;
    if (this.pile.update(dt)) {
      updated = true;
    }
    if (this.pile.readyForNextTrick()) {
      this.nextAITick -= dt;
      if (this.nextAITick <= 0) {
        this.nextAITick = this.aiTickRate();
        if (this.blackout.aiTick()) {
          updated = true;
        }
      }
    }
    if (this.hand.update(dt)) {
      updated = true;
    }
    trickTakerName = "";
    if (this.blackout.prevTrickTaker !== -1) {
      trickTakerName = this.blackout.players[this.blackout.prevTrickTaker].name;
    }
    this.pile.set(this.blackout.trickID, this.blackout.pile, this.blackout.pileWho, this.blackout.prev, this.blackout.prevWho, trickTakerName, this.blackout.players.length, this.blackout.turn);
    if (this.pauseMenu.update(dt)) {
      updated = true;
    }
    this.adjustBid(0);
    if (this.bidUI.minus.update(dt)) {
      updated = true;
    }
    if (this.bidUI.plus.update(dt)) {
      updated = true;
    }
    return updated;
  };

  Game.prototype.render = function() {
    this.renderCommands.length = 0;
    if (this.howto > 0) {
      this.renderHowto();
    } else if (this.blackout === null) {
      this.renderMainMenu();
    } else {
      this.renderGame();
    }
    return this.renderCommands;
  };

  Game.prototype.renderHowto = function() {
    var arrowOffset, arrowWidth, color, howtoTexture;
    howtoTexture = "howto" + this.howto;
    this.log("rendering " + howtoTexture);
    this.spriteRenderer.render("solid", 0, 0, this.width, this.height, 0, 0, 0, this.colors.black);
    this.spriteRenderer.render(howtoTexture, 0, 0, this.width, this.aaHeight, 0, 0, 0, this.colors.white);
    arrowWidth = this.width / 20;
    arrowOffset = arrowWidth * 4;
    color = this.howto === 1 ? this.colors.arrowclose : this.colors.arrow;
    this.spriteRenderer.render("arrowL", this.center.x - arrowOffset, this.height, arrowWidth, 0, 0, 0.5, 1, color, (function(_this) {
      return function() {
        _this.howto--;
        if (_this.howto < 0) {
          return _this.howto = 0;
        }
      };
    })(this));
    color = this.howto === 3 ? this.colors.arrowclose : this.colors.arrow;
    return this.spriteRenderer.render("arrowR", this.center.x + arrowOffset, this.height, arrowWidth, 0, 0, 0.5, 1, color, (function(_this) {
      return function() {
        _this.howto++;
        if (_this.howto > 3) {
          return _this.howto = 0;
        }
      };
    })(this));
  };

  Game.prototype.renderMainMenu = function() {
    return this.mainMenu.render();
  };

  Game.prototype.renderGame = function() {
    var aiPlayers, bidButtonHeight, bidSize, character, characterHeight, characterMargin, characterWidth, gameOverSize, gameOverY, i, j, len, line, lines, ref1, restartQuitSize, scoreHeight, shadowDistance, textHeight, textPadding;
    this.spriteRenderer.render("solid", 0, 0, this.width, this.height, 0, 0, 0, this.colors.background);
    textHeight = this.aaHeight / 25;
    textPadding = textHeight / 5;
    characterHeight = this.aaHeight / 5;
    scoreHeight = textHeight;
    ref1 = this.blackout.log;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      line = ref1[i];
      this.fontRenderer.render(this.font, textHeight, line, 0, (i + 1) * (textHeight + textPadding), 0, 0, this.colors.white);
    }
    if (this.blackout.marathonMode()) {
      this.fontRenderer.render(this.font, textHeight, "MARATHON MODE", this.width - this.pauseButtonSize, 0, 1, 0, this.colors.orange);
    }
    aiPlayers = [null, null, null];
    if (this.blackout.players.length === 2) {
      aiPlayers[1] = this.blackout.players[1];
    } else if (this.blackout.players.length === 3) {
      aiPlayers[0] = this.blackout.players[1];
      aiPlayers[2] = this.blackout.players[2];
    } else {
      aiPlayers[0] = this.blackout.players[1];
      aiPlayers[1] = this.blackout.players[2];
      aiPlayers[2] = this.blackout.players[3];
    }
    characterMargin = characterHeight / 2;
    if (aiPlayers[0] !== null) {
      character = aiCharacters[aiPlayers[0].charID];
      characterWidth = this.spriteRenderer.calcWidth(character.sprite, characterHeight);
      this.spriteRenderer.render(character.sprite, characterMargin, this.hand.playCeiling, 0, characterHeight, 0, 0, 1, this.colors.white);
      this.renderScore(aiPlayers[0], aiPlayers[0].index === this.blackout.turn, scoreHeight, characterMargin + (characterWidth / 2), this.hand.playCeiling - textPadding, 0.5, 0);
    }
    if (aiPlayers[1] !== null) {
      character = aiCharacters[aiPlayers[1].charID];
      this.spriteRenderer.render(character.sprite, this.center.x, 0, 0, characterHeight, 0, 0.5, 0, this.colors.white);
      this.renderScore(aiPlayers[1], aiPlayers[1].index === this.blackout.turn, scoreHeight, this.center.x, characterHeight, 0.5, 0);
    }
    if (aiPlayers[2] !== null) {
      character = aiCharacters[aiPlayers[2].charID];
      characterWidth = this.spriteRenderer.calcWidth(character.sprite, characterHeight);
      this.spriteRenderer.render(character.sprite, this.width - characterMargin, this.hand.playCeiling, 0, characterHeight, 0, 1, 1, this.colors.white);
      this.renderScore(aiPlayers[2], aiPlayers[2].index === this.blackout.turn, scoreHeight, this.width - (characterMargin + (characterWidth / 2)), this.hand.playCeiling - textPadding, 0.5, 0);
    }
    this.pile.render();
    if ((this.blackout.state === State.POSTGAMESUMMARY) && this.pile.resting()) {
      lines = this.gameOverText();
      gameOverSize = this.aaHeight / 8;
      gameOverY = this.center.y;
      if (lines.length > 1) {
        gameOverY -= gameOverSize >> 1;
      }
      this.fontRenderer.render(this.font, gameOverSize, lines[0], this.center.x, gameOverY, 0.5, 0.5, this.colors.orange);
      if (lines.length > 1) {
        gameOverY += gameOverSize;
        this.fontRenderer.render(this.font, gameOverSize, lines[1], this.center.x, gameOverY, 0.5, 0.5, this.colors.orange);
      }
      restartQuitSize = this.aaHeight / 12;
      shadowDistance = restartQuitSize / 8;
      this.fontRenderer.render(this.font, restartQuitSize, "Restart", shadowDistance + this.center.x / 2, shadowDistance + this.height - restartQuitSize, 0.5, 1, this.colors.black, (function(_this) {
        return function() {};
      })(this));
      this.fontRenderer.render(this.font, restartQuitSize, "Restart", this.center.x / 2, this.height - restartQuitSize, 0.5, 1, this.colors.gold, (function(_this) {
        return function() {
          return _this.newGame();
        };
      })(this));
      this.fontRenderer.render(this.font, restartQuitSize, "Quit", shadowDistance + this.center.x + (this.center.x / 2), shadowDistance + this.height - restartQuitSize, 0.5, 1, this.colors.black, (function(_this) {
        return function() {};
      })(this));
      this.fontRenderer.render(this.font, restartQuitSize, "Quit", this.center.x + (this.center.x / 2), this.height - restartQuitSize, 0.5, 1, this.colors.gold, (function(_this) {
        return function() {
          return _this.blackout = null;
        };
      })(this));
    }
    if ((this.blackout.state === State.ROUNDSUMMARY) && this.pile.resting()) {
      this.fontRenderer.render(this.font, this.aaHeight / 8, "Tap for next round ...", this.center.x, this.center.y, 0.5, 0.5, this.colors.orange, (function(_this) {
        return function() {
          if (_this.blackout.next() === OK) {
            return _this.hand.set(_this.blackout.players[0].hand);
          }
        };
      })(this));
    }
    if ((this.blackout.state === State.BID) && (this.blackout.turn === 0)) {
      this.bidUI.minus.render();
      this.bidUI.plus.render();
      this.fontRenderer.render(this.font, this.bidTextSize, "" + this.bid, this.center.x, this.bidButtonY - (this.bidTextSize * 0.1), 0.5, 0.5, this.colors.white, (function(_this) {
        return function() {
          return _this.attemptBid();
        };
      })(this));
      bidButtonHeight = this.aaHeight / 12;
      bidSize = this.fontRenderer.size(this.font, bidButtonHeight, "Bid");
      this.spriteRenderer.render("solid", this.center.x, (this.bidButtonY + this.bidTextSize) + (bidSize.h * 0.2), bidSize.w * 3, bidSize.h * 1.5, 0, 0.5, 0.5, this.colors.bid, (function(_this) {
        return function() {
          return _this.attemptBid();
        };
      })(this));
      this.fontRenderer.render(this.font, bidButtonHeight, "Bid", this.center.x, this.bidButtonY + this.bidTextSize, 0.5, 0.5, this.colors.white);
    }
    this.hand.render();
    this.renderScore(this.blackout.players[0], 0 === this.blackout.turn, scoreHeight, this.center.x, this.height, 0.5, 1);
    this.fontRenderer.render(this.font, textHeight, this.calcHeadline(), 0, 0, 0, 0, this.colors.lightgray);
    this.spriteRenderer.render("pause", this.width, 0, 0, this.pauseButtonSize, 0, 1, 0, this.colors.white, (function(_this) {
      return function() {
        return _this.paused = true;
      };
    })(this));
    if (this.paused) {
      this.pauseMenu.render();
    }
  };

  Game.prototype.renderScore = function(player, myTurn, scoreHeight, x, y, anchorx, anchory) {
    var nameColor, nameSize, nameString, nameY, scoreSize, scoreString, scoreY, trickColor;
    if (myTurn) {
      nameColor = "`ff7700`";
    } else {
      nameColor = "";
    }
    nameString = " " + nameColor + player.name + "``: " + player.score + " ";
    if (player.bid === -1) {
      scoreString = "[ -- ]";
    } else {
      if (player.tricks < player.bid) {
        trickColor = "ffff33";
      } else if (player.tricks === player.bid) {
        trickColor = "33ff33";
      } else {
        trickColor = "ff3333";
      }
      scoreString = "[ `" + trickColor + "`" + player.tricks + "``/" + player.bid + " ]";
    }
    nameSize = this.fontRenderer.size(this.font, scoreHeight, nameString);
    scoreSize = this.fontRenderer.size(this.font, scoreHeight, scoreString);
    if (nameSize.w > scoreSize.w) {
      scoreSize.w = nameSize.w;
    }
    nameY = y;
    scoreY = y;
    if (anchory > 0) {
      nameY -= scoreHeight;
    } else {
      scoreY += scoreHeight;
    }
    this.spriteRenderer.render("solid", x, y, scoreSize.w, scoreSize.h * 2, 0, anchorx, anchory, this.colors.overlay);
    this.fontRenderer.render(this.font, scoreHeight, nameString, x, nameY, anchorx, anchory, this.colors.white);
    return this.fontRenderer.render(this.font, scoreHeight, scoreString, x, scoreY, anchorx, anchory, this.colors.white);
  };

  Game.prototype.drawImage = function(texture, sx, sy, sw, sh, dx, dy, dw, dh, rot, anchorx, anchory, r, g, b, a, cb) {
    var anchorOffsetX, anchorOffsetY, zone;
    this.renderCommands.push(this.textures[texture], sx, sy, sw, sh, dx, dy, dw, dh, rot, anchorx, anchory, r, g, b, a);
    if (cb != null) {
      anchorOffsetX = -1 * anchorx * dw;
      anchorOffsetY = -1 * anchory * dh;
      zone = {
        cx: dx,
        cy: dy,
        rot: rot * -1,
        l: anchorOffsetX,
        t: anchorOffsetY,
        r: anchorOffsetX + dw,
        b: anchorOffsetY + dh,
        cb: cb
      };
      return this.zones.push(zone);
    }
  };

  Game.prototype.checkZones = function(x, y) {
    var j, localX, localY, ref1, unrotatedLocalX, unrotatedLocalY, zone;
    ref1 = this.zones;
    for (j = ref1.length - 1; j >= 0; j += -1) {
      zone = ref1[j];
      unrotatedLocalX = x - zone.cx;
      unrotatedLocalY = y - zone.cy;
      localX = unrotatedLocalX * Math.cos(zone.rot) - unrotatedLocalY * Math.sin(zone.rot);
      localY = unrotatedLocalX * Math.sin(zone.rot) + unrotatedLocalY * Math.cos(zone.rot);
      if ((localX < zone.l) || (localX > zone.r) || (localY < zone.t) || (localY > zone.b)) {
        continue;
      }
      zone.cb(x, y);
      return true;
    }
    return false;
  };

  return Game;

})();

module.exports = Game;


},{"./Animation":1,"./Blackout":2,"./Button":3,"./FontRenderer":4,"./Hand":6,"./Menu":7,"./Pile":8,"./SpriteRenderer":9}],6:[function(require,module,exports){
var Animation, CARD_HAND_CURVE_DIST_FACTOR, CARD_HOLDING_ROT_ORDER, CARD_HOLDING_ROT_PLAY, CARD_IMAGE_ADV_X, CARD_IMAGE_ADV_Y, CARD_IMAGE_H, CARD_IMAGE_OFF_X, CARD_IMAGE_OFF_Y, CARD_IMAGE_W, CARD_PLAY_CEILING, CARD_RENDER_SCALE, Hand, NO_CARD, calcDistance, calcDistanceSquared, findAngle;

Animation = require('./Animation');

CARD_IMAGE_W = 120;

CARD_IMAGE_H = 162;

CARD_IMAGE_OFF_X = 4;

CARD_IMAGE_OFF_Y = 4;

CARD_IMAGE_ADV_X = CARD_IMAGE_W;

CARD_IMAGE_ADV_Y = CARD_IMAGE_H;

CARD_RENDER_SCALE = 0.35;

CARD_HAND_CURVE_DIST_FACTOR = 3.5;

CARD_HOLDING_ROT_ORDER = Math.PI / 12;

CARD_HOLDING_ROT_PLAY = -1 * Math.PI / 12;

CARD_PLAY_CEILING = 0.65;

NO_CARD = -1;

findAngle = function(p0, p1, p2) {
  var a, b, c;
  a = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  b = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2);
  c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2);
  return Math.acos((a + b - c) / Math.sqrt(4 * a * b));
};

calcDistance = function(p0, p1) {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
};

calcDistanceSquared = function(x0, y0, x1, y1) {
  return Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2);
};

Hand = (function() {
  function Hand(game) {
    var arcMargin, arcVerticalBias, bottomLeft, bottomRight;
    this.game = game;
    this.cards = [];
    this.anims = {};
    this.positionCache = {};
    this.dragIndexStart = NO_CARD;
    this.dragIndexCurrent = NO_CARD;
    this.dragX = 0;
    this.dragY = 0;
    this.cardSpeed = {
      r: Math.PI * 2,
      s: 2.5,
      t: 2 * this.game.width
    };
    this.playCeiling = CARD_PLAY_CEILING * this.game.height;
    this.cardHeight = Math.floor(this.game.height * CARD_RENDER_SCALE);
    this.cardWidth = Math.floor(this.cardHeight * CARD_IMAGE_W / CARD_IMAGE_H);
    this.cardHalfHeight = this.cardHeight >> 1;
    this.cardHalfWidth = this.cardWidth >> 1;
    arcMargin = this.cardWidth / 2;
    arcVerticalBias = this.cardHeight / 50;
    bottomLeft = {
      x: arcMargin,
      y: arcVerticalBias + this.game.height
    };
    bottomRight = {
      x: this.game.width - arcMargin,
      y: arcVerticalBias + this.game.height
    };
    this.handCenter = {
      x: this.game.width / 2,
      y: arcVerticalBias + this.game.height + (CARD_HAND_CURVE_DIST_FACTOR * this.game.height)
    };
    this.handAngle = findAngle(bottomLeft, this.handCenter, bottomRight);
    this.handDistance = calcDistance(bottomLeft, this.handCenter);
    this.handAngleAdvanceMax = this.handAngle / 7;
    this.game.log("Hand distance " + this.handDistance + ", angle " + this.handAngle + " (screen height " + this.game.height + ")");
  }

  Hand.prototype.set = function(cards) {
    this.cards = cards.slice(0);
    this.syncAnims();
    return this.warp();
  };

  Hand.prototype.syncAnims = function() {
    var anim, card, j, k, len, len1, ref, ref1, seen, toRemove;
    seen = {};
    ref = this.cards;
    for (j = 0, len = ref.length; j < len; j++) {
      card = ref[j];
      seen[card]++;
      if (!this.anims[card]) {
        this.anims[card] = new Animation({
          speed: this.cardSpeed,
          x: 0,
          y: 0,
          r: 0
        });
      }
    }
    toRemove = [];
    ref1 = this.anims;
    for (card in ref1) {
      anim = ref1[card];
      if (!seen.hasOwnProperty(card)) {
        toRemove.push(card);
      }
    }
    for (k = 0, len1 = toRemove.length; k < len1; k++) {
      card = toRemove[k];
      delete this.anims[card];
    }
    return this.updatePositions();
  };

  Hand.prototype.calcDrawnHand = function() {
    var card, drawnHand, i, j, len, ref;
    drawnHand = [];
    ref = this.cards;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      card = ref[i];
      if (i !== this.dragIndexStart) {
        drawnHand.push(card);
      }
    }
    if (this.dragIndexCurrent !== NO_CARD) {
      drawnHand.splice(this.dragIndexCurrent, 0, this.cards[this.dragIndexStart]);
    }
    return drawnHand;
  };

  Hand.prototype.wantsToPlayDraggedCard = function() {
    if (this.dragIndexStart === NO_CARD) {
      return false;
    }
    return this.dragY < this.playCeiling;
  };

  Hand.prototype.updatePositions = function() {
    var anim, card, desiredRotation, drawIndex, drawnHand, i, j, len, pos, positionCount, positions, results, wantsToPlay;
    drawnHand = this.calcDrawnHand();
    wantsToPlay = this.wantsToPlayDraggedCard();
    desiredRotation = CARD_HOLDING_ROT_ORDER;
    positionCount = drawnHand.length;
    if (wantsToPlay) {
      desiredRotation = CARD_HOLDING_ROT_PLAY;
      positionCount--;
    }
    positions = this.calcPositions(positionCount);
    drawIndex = 0;
    results = [];
    for (i = j = 0, len = drawnHand.length; j < len; i = ++j) {
      card = drawnHand[i];
      anim = this.anims[card];
      if (i === this.dragIndexCurrent) {
        anim.req.x = this.dragX;
        anim.req.y = this.dragY;
        anim.req.r = desiredRotation;
        if (!wantsToPlay) {
          results.push(drawIndex++);
        } else {
          results.push(void 0);
        }
      } else {
        pos = positions[drawIndex];
        anim.req.x = pos.x;
        anim.req.y = pos.y;
        anim.req.r = pos.r;
        results.push(drawIndex++);
      }
    }
    return results;
  };

  Hand.prototype.warp = function() {
    var anim, card, ref, results;
    ref = this.anims;
    results = [];
    for (card in ref) {
      anim = ref[card];
      results.push(anim.warp());
    }
    return results;
  };

  Hand.prototype.reorder = function() {
    var closestDist, closestIndex, dist, index, j, len, pos, positions;
    if (this.dragIndexStart === NO_CARD) {
      return;
    }
    if (this.cards.length < 2) {
      return;
    }
    positions = this.calcPositions(this.cards.length);
    closestIndex = 0;
    closestDist = this.game.width * this.game.height;
    for (index = j = 0, len = positions.length; j < len; index = ++j) {
      pos = positions[index];
      dist = calcDistanceSquared(pos.x, pos.y, this.dragX, this.dragY);
      if (closestDist > dist) {
        closestDist = dist;
        closestIndex = index;
      }
    }
    return this.dragIndexCurrent = closestIndex;
  };

  Hand.prototype.down = function(dragX, dragY, index) {
    this.dragX = dragX;
    this.dragY = dragY;
    this.up(this.dragX, this.dragY);
    this.game.log("picking up card index " + index);
    this.dragIndexStart = index;
    this.dragIndexCurrent = index;
    return this.updatePositions();
  };

  Hand.prototype.move = function(dragX, dragY) {
    this.dragX = dragX;
    this.dragY = dragY;
    if (this.dragIndexStart === NO_CARD) {
      return;
    }
    this.reorder();
    return this.updatePositions();
  };

  Hand.prototype.up = function(dragX, dragY) {
    var anim, card, cardIndex;
    this.dragX = dragX;
    this.dragY = dragY;
    if (this.dragIndexStart === NO_CARD) {
      return;
    }
    this.reorder();
    if (this.wantsToPlayDraggedCard()) {
      this.game.log("trying to play a " + this.cards[this.dragIndexStart] + " from index " + this.dragIndexStart);
      cardIndex = this.dragIndexStart;
      card = this.cards[cardIndex];
      anim = this.anims[card];
      this.dragIndexStart = NO_CARD;
      this.dragIndexCurrent = NO_CARD;
      this.game.play(card, anim.cur.x, anim.cur.y, anim.cur.r, cardIndex);
    } else {
      this.game.log("trying to reorder " + this.cards[this.dragIndexStart] + " into index " + this.dragIndexCurrent);
      this.cards = this.calcDrawnHand();
    }
    this.dragIndexStart = NO_CARD;
    this.dragIndexCurrent = NO_CARD;
    return this.updatePositions();
  };

  Hand.prototype.update = function(dt) {
    var anim, card, ref, updated;
    updated = false;
    ref = this.anims;
    for (card in ref) {
      anim = ref[card];
      if (anim.update(dt)) {
        updated = true;
      }
    }
    return updated;
  };

  Hand.prototype.render = function() {
    var anim, drawnHand, index, j, len, results, v;
    if (this.cards.length === 0) {
      return;
    }
    drawnHand = this.calcDrawnHand();
    results = [];
    for (index = j = 0, len = drawnHand.length; j < len; index = ++j) {
      v = drawnHand[index];
      if (v === NO_CARD) {
        continue;
      }
      anim = this.anims[v];
      results.push((function(_this) {
        return function(anim, index) {
          return _this.renderCard(v, anim.cur.x, anim.cur.y, anim.cur.r, 1, function(clickX, clickY) {
            return _this.down(clickX, clickY, index);
          });
        };
      })(this)(anim, index));
    }
    return results;
  };

  Hand.prototype.renderCard = function(v, x, y, rot, scale, cb) {
    var rank, suit;
    if (!rot) {
      rot = 0;
    }
    rank = Math.floor(v % 13);
    suit = Math.floor(v / 13);
    return this.game.drawImage("cards", CARD_IMAGE_OFF_X + (CARD_IMAGE_ADV_X * rank), CARD_IMAGE_OFF_Y + (CARD_IMAGE_ADV_Y * suit), CARD_IMAGE_W, CARD_IMAGE_H, x, y, this.cardWidth * scale, this.cardHeight * scale, rot, 0.5, 0.5, 1, 1, 1, 1, cb);
  };

  Hand.prototype.calcPositions = function(handSize) {
    var advance, angleLeftover, angleSpread, currentAngle, i, j, positions, ref, x, y;
    if (this.positionCache.hasOwnProperty(handSize)) {
      return this.positionCache[handSize];
    }
    if (handSize === 0) {
      return [];
    }
    advance = this.handAngle / handSize;
    if (advance > this.handAngleAdvanceMax) {
      advance = this.handAngleAdvanceMax;
    }
    angleSpread = advance * handSize;
    angleLeftover = this.handAngle - angleSpread;
    currentAngle = -1 * (this.handAngle / 2);
    currentAngle += angleLeftover / 2;
    currentAngle += advance / 2;
    positions = [];
    for (i = j = 0, ref = handSize; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      x = this.handCenter.x - Math.cos((Math.PI / 2) + currentAngle) * this.handDistance;
      y = this.handCenter.y - Math.sin((Math.PI / 2) + currentAngle) * this.handDistance;
      currentAngle += advance;
      positions.push({
        x: x,
        y: y,
        r: currentAngle - advance
      });
    }
    this.positionCache[handSize] = positions;
    return positions;
  };

  Hand.prototype.renderHand = function() {
    var index, j, len, ref, results, v;
    if (this.hand.length === 0) {
      return;
    }
    ref = this.hand;
    results = [];
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      v = ref[index];
      results.push((function(_this) {
        return function(index) {
          return _this.renderCard(v, x, y, currentAngle, 1, function(clickX, clickY) {
            return _this.down(clickX, clickY, index);
          });
        };
      })(this)(index));
    }
    return results;
  };

  return Hand;

})();

module.exports = Hand;


},{"./Animation":1}],7:[function(require,module,exports){
var Button, Menu;

Button = require('./Button');

Menu = (function() {
  function Menu(game, title, background, color, actions) {
    var action, button, buttonSize, currY, i, len, ref, slice;
    this.game = game;
    this.title = title;
    this.background = background;
    this.color = color;
    this.actions = actions;
    this.buttons = [];
    this.buttonNames = ["button0", "button1"];
    buttonSize = this.game.height / 15;
    this.buttonStartY = this.game.height / 5;
    slice = (this.game.height - this.buttonStartY) / (this.actions.length + 1);
    currY = this.buttonStartY + slice;
    ref = this.actions;
    for (i = 0, len = ref.length; i < len; i++) {
      action = ref[i];
      button = new Button(this.game, this.buttonNames, this.game.font, buttonSize, this.game.center.x, currY, action);
      this.buttons.push(button);
      currY += slice;
    }
  }

  Menu.prototype.update = function(dt) {
    var button, i, len, ref, updated;
    updated = false;
    ref = this.buttons;
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      if (button.update(dt)) {
        updated = true;
      }
    }
    return updated;
  };

  Menu.prototype.render = function() {
    var button, i, len, ref, results, titleHeight, titleOffset;
    this.game.spriteRenderer.render(this.background, 0, 0, this.game.width, this.game.height, 0, 0, 0, this.color);
    this.game.fontRenderer.render(this.game.font, this.game.height / 25, "Build: " + this.game.version, 0, this.game.height, 0, 1, this.game.colors.lightgray);
    titleHeight = this.game.height / 8;
    titleOffset = this.buttonStartY >> 1;
    this.game.fontRenderer.render(this.game.font, titleHeight, this.title, this.game.center.x, titleOffset, 0.5, 0.5, this.game.colors.white);
    ref = this.buttons;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(button.render());
    }
    return results;
  };

  return Menu;

})();

module.exports = Menu;


},{"./Button":3}],8:[function(require,module,exports){
var Animation, Pile, SETTLE_MS;

Animation = require('./Animation');

SETTLE_MS = 1000;

Pile = (function() {
  function Pile(game, hand) {
    var centerX, centerY, offsetX, offsetY;
    this.game = game;
    this.hand = hand;
    this.pile = [];
    this.pileWho = [];
    this.trick = [];
    this.trickWho = [];
    this.anims = {};
    this.pileID = -1;
    this.trickTaker = "";
    this.settleTimer = 0;
    this.trickColor = {
      r: 1,
      g: 1,
      b: 0,
      a: 1
    };
    this.playerCount = 2;
    this.scale = 0.6;
    centerX = this.game.center.x;
    centerY = this.game.center.y;
    offsetX = this.hand.cardWidth * this.scale;
    offsetY = this.hand.cardHalfHeight * this.scale;
    this.pileLocations = {
      2: [
        {
          x: centerX,
          y: centerY + offsetY
        }, {
          x: centerX,
          y: centerY - offsetY
        }
      ],
      3: [
        {
          x: centerX,
          y: centerY + offsetY
        }, {
          x: centerX - offsetX,
          y: centerY
        }, {
          x: centerX + offsetX,
          y: centerY
        }
      ],
      4: [
        {
          x: centerX,
          y: centerY + offsetY
        }, {
          x: centerX - offsetX,
          y: centerY
        }, {
          x: centerX,
          y: centerY - offsetY
        }, {
          x: centerX + offsetX,
          y: centerY
        }
      ]
    };
    this.throwLocations = {
      2: [
        {
          x: centerX,
          y: this.game.height
        }, {
          x: centerX,
          y: 0
        }
      ],
      3: [
        {
          x: centerX,
          y: this.game.height
        }, {
          x: 0,
          y: centerY + offsetY
        }, {
          x: this.game.width,
          y: centerY + offsetY
        }
      ],
      4: [
        {
          x: centerX,
          y: this.game.height
        }, {
          x: 0,
          y: centerY + offsetY
        }, {
          x: centerX,
          y: 0
        }, {
          x: this.game.width,
          y: centerY + offsetY
        }
      ]
    };
  }

  Pile.prototype.set = function(pileID, pile, pileWho, trick, trickWho, trickTaker, playerCount, firstThrow) {
    this.playerCount = playerCount;
    if ((this.pileID !== pileID) && (trick.length > 0)) {
      this.pile = trick.slice(0);
      this.pileWho = trickWho.slice(0);
      this.pileID = pileID;
      this.settleTimer = SETTLE_MS;
    }
    if (this.settleTimer === 0) {
      this.pile = pile.slice(0);
      this.pileWho = pileWho.slice(0);
      this.trick = trick.slice(0);
      this.trickWho = trickWho.slice(0);
      this.trickTaker = trickTaker;
    }
    return this.syncAnims();
  };

  Pile.prototype.hint = function(v, x, y, r) {
    return this.anims[v] = new Animation({
      speed: this.hand.cardSpeed,
      x: x,
      y: y,
      r: r,
      s: 1
    });
  };

  Pile.prototype.syncAnims = function() {
    var anim, card, index, j, k, l, len, len1, len2, location, locations, ref, ref1, ref2, seen, toRemove, who;
    seen = {};
    locations = this.throwLocations[this.playerCount];
    ref = this.pile;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      card = ref[index];
      seen[card]++;
      if (!this.anims[card]) {
        who = this.pileWho[index];
        location = locations[who];
        this.anims[card] = new Animation({
          speed: this.hand.cardSpeed,
          x: location.x,
          y: location.y,
          r: -1 * Math.PI / 4,
          s: this.scale
        });
      }
    }
    ref1 = this.trick;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      card = ref1[k];
      seen[card]++;
      if (!this.anims[card]) {
        this.anims[card] = new Animation({
          speed: this.hand.cardSpeed,
          x: -1 * this.hand.cardHalfWidth,
          y: -1 * this.hand.cardHalfWidth,
          r: -1 * Math.PI / 2,
          s: 1
        });
      }
    }
    toRemove = [];
    ref2 = this.anims;
    for (card in ref2) {
      anim = ref2[card];
      if (!seen.hasOwnProperty(card)) {
        toRemove.push(card);
      }
    }
    for (l = 0, len2 = toRemove.length; l < len2; l++) {
      card = toRemove[l];
      delete this.anims[card];
    }
    return this.updatePositions();
  };

  Pile.prototype.updatePositions = function() {
    var _, anim, i, index, j, k, len, len1, loc, locations, ref, ref1, results, v;
    locations = this.pileLocations[this.playerCount];
    ref = this.pile;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      v = ref[index];
      anim = this.anims[v];
      loc = this.pileWho[index];
      anim.req.x = locations[loc].x;
      anim.req.y = locations[loc].y;
      anim.req.r = 0;
      anim.req.s = this.scale;
    }
    ref1 = this.trick;
    results = [];
    for (index = k = 0, len1 = ref1.length; k < len1; index = ++k) {
      _ = ref1[index];
      i = this.trick.length - index - 1;
      v = this.trick[i];
      anim = this.anims[v];
      anim.req.x = (this.game.width + this.hand.cardHalfWidth) - ((index + 1) * (this.hand.cardWidth / 5));
      anim.req.y = (this.game.pauseButtonSize * 1.5) + this.hand.cardHalfHeight;
      anim.req.r = 0;
      results.push(anim.req.s = 1);
    }
    return results;
  };

  Pile.prototype.readyForNextTrick = function() {
    return this.settleTimer === 0;
  };

  Pile.prototype.update = function(dt) {
    var anim, card, ref, updated;
    updated = false;
    if (this.settleTimer > 0) {
      updated = true;
      this.settleTimer -= dt;
      if (this.settleTimer < 0) {
        this.settleTimer = 0;
      }
    }
    ref = this.anims;
    for (card in ref) {
      anim = ref[card];
      if (anim.update(dt)) {
        updated = true;
      }
    }
    return updated;
  };

  Pile.prototype.resting = function() {
    var anim, card, ref;
    ref = this.anims;
    for (card in ref) {
      anim = ref[card];
      if (anim.animating()) {
        return false;
      }
    }
    if (this.settleTimer > 0) {
      return false;
    }
    return true;
  };

  Pile.prototype.render = function() {
    var anim, index, j, k, len, len1, ref, ref1, v;
    ref = this.pile;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      v = ref[index];
      anim = this.anims[v];
      this.hand.renderCard(v, anim.cur.x, anim.cur.y, anim.cur.r, anim.cur.s);
    }
    ref1 = this.trick;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      v = ref1[k];
      anim = this.anims[v];
      this.hand.renderCard(v, anim.cur.x, anim.cur.y, anim.cur.r, anim.cur.s);
    }
    if ((this.trick.length > 0) && (this.trickTaker.length > 0)) {
      anim = this.anims[this.trick[0]];
      if (anim != null) {
        return this.game.fontRenderer.render(this.game.font, this.game.aaHeight / 30, this.trickTaker, this.game.width, anim.cur.y + this.hand.cardHalfHeight, 1, 0, this.trickColor);
      }
    }
  };

  return Pile;

})();

module.exports = Pile;


},{"./Animation":1}],9:[function(require,module,exports){
var SpriteRenderer;

SpriteRenderer = (function() {
  function SpriteRenderer(game) {
    this.game = game;
    this.sprites = {
      solid: {
        texture: "chars",
        x: 55,
        y: 723,
        w: 10,
        h: 10
      },
      pause: {
        texture: "chars",
        x: 602,
        y: 707,
        w: 122,
        h: 125
      },
      button0: {
        texture: "chars",
        x: 140,
        y: 777,
        w: 422,
        h: 65
      },
      button1: {
        texture: "chars",
        x: 140,
        y: 698,
        w: 422,
        h: 65
      },
      plus0: {
        texture: "chars",
        x: 745,
        y: 664,
        w: 116,
        h: 118
      },
      plus1: {
        texture: "chars",
        x: 745,
        y: 820,
        w: 116,
        h: 118
      },
      minus0: {
        texture: "chars",
        x: 895,
        y: 664,
        w: 116,
        h: 118
      },
      minus1: {
        texture: "chars",
        x: 895,
        y: 820,
        w: 116,
        h: 118
      },
      arrowL: {
        texture: "chars",
        x: 33,
        y: 858,
        w: 204,
        h: 156
      },
      arrowR: {
        texture: "chars",
        x: 239,
        y: 852,
        w: 208,
        h: 155
      },
      mainmenu: {
        texture: "mainmenu",
        x: 0,
        y: 0,
        w: 1280,
        h: 720
      },
      pausemenu: {
        texture: "pausemenu",
        x: 0,
        y: 0,
        w: 1280,
        h: 720
      },
      howto1: {
        texture: "howto1",
        x: 0,
        y: 0,
        w: 1920,
        h: 1080
      },
      howto2: {
        texture: "howto2",
        x: 0,
        y: 0,
        w: 1920,
        h: 1080
      },
      howto3: {
        texture: "howto3",
        x: 0,
        y: 0,
        w: 1920,
        h: 1080
      },
      mario: {
        texture: "chars",
        x: 20,
        y: 0,
        w: 151,
        h: 308
      },
      luigi: {
        texture: "chars",
        x: 171,
        y: 0,
        w: 151,
        h: 308
      },
      peach: {
        texture: "chars",
        x: 335,
        y: 0,
        w: 164,
        h: 308
      },
      daisy: {
        texture: "chars",
        x: 504,
        y: 0,
        w: 164,
        h: 308
      },
      yoshi: {
        texture: "chars",
        x: 668,
        y: 0,
        w: 180,
        h: 308
      },
      toad: {
        texture: "chars",
        x: 849,
        y: 0,
        w: 157,
        h: 308
      },
      bowser: {
        texture: "chars",
        x: 11,
        y: 322,
        w: 151,
        h: 308
      },
      bowserjr: {
        texture: "chars",
        x: 225,
        y: 322,
        w: 144,
        h: 308
      },
      koopa: {
        texture: "chars",
        x: 372,
        y: 322,
        w: 128,
        h: 308
      },
      rosalina: {
        texture: "chars",
        x: 500,
        y: 322,
        w: 173,
        h: 308
      },
      shyguy: {
        texture: "chars",
        x: 691,
        y: 322,
        w: 154,
        h: 308
      },
      toadette: {
        texture: "chars",
        x: 847,
        y: 322,
        w: 158,
        h: 308
      }
    };
  }

  SpriteRenderer.prototype.calcWidth = function(spriteName, height) {
    var sprite;
    sprite = this.sprites[spriteName];
    if (!sprite) {
      return 1;
    }
    return height * sprite.w / sprite.h;
  };

  SpriteRenderer.prototype.render = function(spriteName, dx, dy, dw, dh, rot, anchorx, anchory, color, cb) {
    var sprite;
    sprite = this.sprites[spriteName];
    if (!sprite) {
      return;
    }
    if ((dw === 0) && (dh === 0)) {
      dw = sprite.x;
      dh = sprite.y;
    } else if (dw === 0) {
      dw = dh * sprite.w / sprite.h;
    } else if (dh === 0) {
      dh = dw * sprite.h / sprite.w;
    }
    this.game.drawImage(sprite.texture, sprite.x, sprite.y, sprite.w, sprite.h, dx, dy, dw, dh, rot, anchorx, anchory, color.r, color.g, color.b, color.a, cb);
  };

  return SpriteRenderer;

})();

module.exports = SpriteRenderer;


},{}],10:[function(require,module,exports){
module.exports = {
  darkforest: {
    height: 72,
    glyphs: {
      '97': {
        x: 8,
        y: 8,
        width: 34,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '98': {
        x: 8,
        y: 58,
        width: 35,
        height: 52,
        xoffset: 1,
        yoffset: 20,
        xadvance: 34
      },
      '99': {
        x: 50,
        y: 8,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '100': {
        x: 8,
        y: 118,
        width: 35,
        height: 52,
        xoffset: 1,
        yoffset: 20,
        xadvance: 34
      },
      '101': {
        x: 8,
        y: 178,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '102': {
        x: 8,
        y: 228,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 33
      },
      '103': {
        x: 8,
        y: 278,
        width: 36,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 35
      },
      '104': {
        x: 8,
        y: 328,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '105': {
        x: 8,
        y: 378,
        width: 12,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 11
      },
      '106': {
        x: 8,
        y: 428,
        width: 35,
        height: 41,
        xoffset: 2,
        yoffset: 31,
        xadvance: 34
      },
      '107': {
        x: 28,
        y: 378,
        width: 35,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '108': {
        x: 51,
        y: 328,
        width: 34,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 33
      },
      '109': {
        x: 51,
        y: 427,
        width: 38,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 37
      },
      '110': {
        x: 71,
        y: 377,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '111': {
        x: 97,
        y: 427,
        width: 35,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '112': {
        x: 51,
        y: 58,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '113': {
        x: 51,
        y: 108,
        width: 35,
        height: 45,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '114': {
        x: 93,
        y: 8,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 35
      },
      '115': {
        x: 51,
        y: 161,
        width: 35,
        height: 42,
        xoffset: 2,
        yoffset: 31,
        xadvance: 35
      },
      '116': {
        x: 51,
        y: 211,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 33
      },
      '117': {
        x: 52,
        y: 261,
        width: 35,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '118': {
        x: 93,
        y: 311,
        width: 34,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 32
      },
      '119': {
        x: 114,
        y: 360,
        width: 38,
        height: 42,
        xoffset: 1,
        yoffset: 31,
        xadvance: 38
      },
      '120': {
        x: 140,
        y: 410,
        width: 36,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 37
      },
      '121': {
        x: 140,
        y: 459,
        width: 35,
        height: 41,
        xoffset: 1,
        yoffset: 31,
        xadvance: 34
      },
      '122': {
        x: 183,
        y: 459,
        width: 36,
        height: 42,
        xoffset: 2,
        yoffset: 31,
        xadvance: 35
      },
      '65': {
        x: 94,
        y: 58,
        width: 34,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '66': {
        x: 94,
        y: 119,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 37
      },
      '67': {
        x: 94,
        y: 180,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '68': {
        x: 95,
        y: 241,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 37
      },
      '69': {
        x: 136,
        y: 8,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '70': {
        x: 137,
        y: 69,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 34
      },
      '71': {
        x: 179,
        y: 8,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '72': {
        x: 137,
        y: 130,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '73': {
        x: 138,
        y: 191,
        width: 12,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 13
      },
      '74': {
        x: 138,
        y: 252,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '75': {
        x: 158,
        y: 191,
        width: 35,
        height: 52,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '76': {
        x: 160,
        y: 313,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 34
      },
      '77': {
        x: 181,
        y: 251,
        width: 38,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 39
      },
      '78': {
        x: 184,
        y: 374,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '79': {
        x: 203,
        y: 312,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '80': {
        x: 180,
        y: 69,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 34
      },
      '81': {
        x: 201,
        y: 130,
        width: 35,
        height: 56,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '82': {
        x: 222,
        y: 8,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '83': {
        x: 223,
        y: 69,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '84': {
        x: 265,
        y: 8,
        width: 35,
        height: 53,
        xoffset: 1,
        yoffset: 20,
        xadvance: 33
      },
      '85': {
        x: 227,
        y: 194,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '86': {
        x: 244,
        y: 130,
        width: 41,
        height: 52,
        xoffset: 1,
        yoffset: 19,
        xadvance: 39
      },
      '87': {
        x: 266,
        y: 69,
        width: 38,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 37
      },
      '88': {
        x: 308,
        y: 8,
        width: 35,
        height: 52,
        xoffset: 1,
        yoffset: 19,
        xadvance: 35
      },
      '89': {
        x: 227,
        y: 373,
        width: 35,
        height: 52,
        xoffset: 1,
        yoffset: 19,
        xadvance: 34
      },
      '90': {
        x: 227,
        y: 433,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '33': {
        x: 246,
        y: 255,
        width: 14,
        height: 53,
        xoffset: 0,
        yoffset: 20,
        xadvance: 11
      },
      '59': {
        x: 180,
        y: 130,
        width: 13,
        height: 37,
        xoffset: 0,
        yoffset: 56,
        xadvance: 13
      },
      '37': {
        x: 95,
        y: 302,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '58': {
        x: 160,
        y: 374,
        width: 13,
        height: 23,
        xoffset: 0,
        yoffset: 50,
        xadvance: 13
      },
      '63': {
        x: 268,
        y: 255,
        width: 35,
        height: 53,
        xoffset: 0,
        yoffset: 20,
        xadvance: 33
      },
      '42': {
        x: 103,
        y: 302,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '40': {
        x: 270,
        y: 190,
        width: 23,
        height: 52,
        xoffset: 0,
        yoffset: 20,
        xadvance: 21
      },
      '41': {
        x: 293,
        y: 130,
        width: 23,
        height: 52,
        xoffset: 1,
        yoffset: 20,
        xadvance: 21
      },
      '95': {
        x: 111,
        y: 302,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '43': {
        x: 246,
        y: 316,
        width: 35,
        height: 34,
        xoffset: 0,
        yoffset: 39,
        xadvance: 32
      },
      '45': {
        x: 184,
        y: 435,
        width: 26,
        height: 11,
        xoffset: 1,
        yoffset: 44,
        xadvance: 25
      },
      '61': {
        x: 312,
        y: 68,
        width: 35,
        height: 30,
        xoffset: 1,
        yoffset: 42,
        xadvance: 33
      },
      '46': {
        x: 135,
        y: 313,
        width: 14,
        height: 11,
        xoffset: 0,
        yoffset: 61,
        xadvance: 14
      },
      '44': {
        x: 227,
        y: 255,
        width: 10,
        height: 21,
        xoffset: 0,
        yoffset: 68,
        xadvance: 11
      },
      '47': {
        x: 351,
        y: 8,
        width: 28,
        height: 52,
        xoffset: 0,
        yoffset: 19,
        xadvance: 26
      },
      '124': {
        x: 119,
        y: 302,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '34': {
        x: 127,
        y: 302,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '39': {
        x: 201,
        y: 194,
        width: 18,
        height: 19,
        xoffset: 0,
        yoffset: 0,
        xadvance: 21
      },
      '64': {
        x: 218,
        y: 435,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '35': {
        x: 218,
        y: 443,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '36': {
        x: 301,
        y: 190,
        width: 32,
        height: 53,
        xoffset: 0,
        yoffset: 22,
        xadvance: 29
      },
      '94': {
        x: 218,
        y: 451,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '38': {
        x: 246,
        y: 358,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 70,
        xadvance: 22
      },
      '123': {
        x: 324,
        y: 106,
        width: 27,
        height: 52,
        xoffset: 0,
        yoffset: 20,
        xadvance: 26
      },
      '125': {
        x: 270,
        y: 358,
        width: 27,
        height: 52,
        xoffset: 2,
        yoffset: 20,
        xadvance: 27
      },
      '91': {
        x: 270,
        y: 418,
        width: 22,
        height: 53,
        xoffset: 0,
        yoffset: 20,
        xadvance: 21
      },
      '93': {
        x: 300,
        y: 418,
        width: 22,
        height: 53,
        xoffset: 1,
        yoffset: 20,
        xadvance: 20
      },
      '48': {
        x: 305,
        y: 316,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '49': {
        x: 311,
        y: 251,
        width: 34,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 35
      },
      '50': {
        x: 341,
        y: 166,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 37
      },
      '51': {
        x: 359,
        y: 68,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 36
      },
      '52': {
        x: 330,
        y: 377,
        width: 35,
        height: 53,
        xoffset: 1,
        yoffset: 20,
        xadvance: 35
      },
      '53': {
        x: 348,
        y: 312,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 37
      },
      '54': {
        x: 330,
        y: 438,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '55': {
        x: 353,
        y: 227,
        width: 35,
        height: 53,
        xoffset: 1,
        yoffset: 20,
        xadvance: 34
      },
      '56': {
        x: 384,
        y: 129,
        width: 35,
        height: 53,
        xoffset: 2,
        yoffset: 20,
        xadvance: 36
      },
      '57': {
        x: 402,
        y: 8,
        width: 35,
        height: 53,
        xoffset: 3,
        yoffset: 20,
        xadvance: 36
      },
      '32': {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xoffset: 3,
        yoffset: 20,
        xadvance: 22
      }
    }
  }
};


},{}],11:[function(require,module,exports){
var Game, NativeApp, SAVE_TIMER_MS, app, componentToHex, resizeScreen, rgbToHex, screen;

console.log('web startup');

Game = require('./Game');

componentToHex = function(c) {
  var hex;
  hex = Math.floor(c * 255).toString(16);
  if (hex.length === 1) {
    return "0" + hex;
  } else {
    return hex;
  }
};

rgbToHex = function(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

SAVE_TIMER_MS = 3000;

NativeApp = (function() {
  function NativeApp(screen1, width, height) {
    var imageUrl, img, j, len, loadedTextures, ref, state;
    this.screen = screen1;
    this.width = width;
    this.height = height;
    this.tintedTextureCache = [];
    this.lastTime = new Date().getTime();
    this.lastInteractTime = new Date().getTime();
    this.heardOneTouch = false;
    this.touchMouse = null;
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.context = this.screen.getContext("2d");
    this.textures = ["../images/cards.png", "../images/darkforest.png", "../images/chars.png", "../images/howto1.png", "../images/howto2.png", "../images/howto3.png"];
    this.game = new Game(this, this.width, this.height);
    if (typeof Storage !== "undefined") {
      state = localStorage.getItem("state");
      if (state) {
        this.game.load(state);
      }
    }
    this.pendingImages = 0;
    loadedTextures = [];
    ref = this.textures;
    for (j = 0, len = ref.length; j < len; j++) {
      imageUrl = ref[j];
      this.pendingImages++;
      console.log("loading image " + this.pendingImages + ": " + imageUrl);
      img = new Image();
      img.onload = this.onImageLoaded.bind(this);
      img.src = imageUrl;
      loadedTextures.push(img);
    }
    this.textures = loadedTextures;
    this.saveTimer = SAVE_TIMER_MS;
  }

  NativeApp.prototype.onImageLoaded = function(info) {
    this.pendingImages--;
    if (this.pendingImages === 0) {
      console.log('All images loaded. Beginning render loop.');
      return requestAnimationFrame((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    }
  };

  NativeApp.prototype.log = function(s) {
    return console.log("NativeApp.log(): " + s);
  };

  NativeApp.prototype.updateSave = function(dt) {
    var state;
    if (typeof Storage === "undefined") {
      return;
    }
    this.saveTimer -= dt;
    if (this.saveTimer <= 0) {
      this.saveTimer = SAVE_TIMER_MS;
      state = this.game.save();
      return localStorage.setItem("state", state);
    }
  };

  NativeApp.prototype.generateTintImage = function(textureIndex, red, green, blue) {
    var buff, ctx, fillColor, img, imgComp;
    img = this.textures[textureIndex];
    buff = document.createElement("canvas");
    buff.width = img.width;
    buff.height = img.height;
    ctx = buff.getContext("2d");
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(img, 0, 0);
    fillColor = "rgb(" + (Math.floor(red * 255)) + ", " + (Math.floor(green * 255)) + ", " + (Math.floor(blue * 255)) + ")";
    ctx.fillStyle = fillColor;
    console.log("fillColor " + fillColor);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillRect(0, 0, buff.width, buff.height);
    ctx.globalCompositeOperation = 'copy';
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, 0, 0);
    imgComp = new Image();
    imgComp.src = buff.toDataURL();
    return imgComp;
  };

  NativeApp.prototype.drawImage = function(textureIndex, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rot, anchorX, anchorY, r, g, b, a) {
    var anchorOffsetX, anchorOffsetY, texture, tintedTexture, tintedTextureKey;
    texture = this.textures[textureIndex];
    if ((r !== 1) || (g !== 1) || (b !== 1)) {
      tintedTextureKey = textureIndex + "-" + r + "-" + g + "-" + b;
      tintedTexture = this.tintedTextureCache[tintedTextureKey];
      if (!tintedTexture) {
        tintedTexture = this.generateTintImage(textureIndex, r, g, b);
        this.tintedTextureCache[tintedTextureKey] = tintedTexture;
      }
      texture = tintedTexture;
    }
    this.context.save();
    this.context.translate(dstX, dstY);
    this.context.rotate(rot);
    anchorOffsetX = -1 * anchorX * dstW;
    anchorOffsetY = -1 * anchorY * dstH;
    this.context.translate(anchorOffsetX, anchorOffsetY);
    this.context.globalAlpha = a;
    this.context.drawImage(texture, srcX, srcY, srcW, srcH, 0, 0, dstW, dstH);
    return this.context.restore();
  };

  NativeApp.prototype.update = function() {
    var drawCall, dt, fpsInterval, goalFPS, i, n, now, renderCommands, timeSinceInteract;
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.update();
      };
    })(this));
    now = new Date().getTime();
    dt = now - this.lastTime;
    timeSinceInteract = now - this.lastInteractTime;
    if (timeSinceInteract > 5000) {
      goalFPS = 5;
    } else {
      goalFPS = 200;
    }
    if (this.lastGoalFPS !== goalFPS) {
      console.log("switching to " + goalFPS + " FPS");
      this.lastGoalFPS = goalFPS;
    }
    fpsInterval = 1000 / goalFPS;
    if (dt < fpsInterval) {
      return;
    }
    this.lastTime = now;
    this.context.clearRect(0, 0, this.width, this.height);
    this.game.update(dt);
    renderCommands = this.game.render();
    i = 0;
    n = renderCommands.length;
    while (i < n) {
      drawCall = renderCommands.slice(i, i += 16);
      this.drawImage.apply(this, drawCall);
    }
    return this.updateSave(dt);
  };

  NativeApp.prototype.onTouchStart = function(evt) {
    var j, len, results, touch, touches;
    this.lastInteractTime = new Date().getTime();
    this.heardOneTouch = true;
    touches = evt.changedTouches;
    results = [];
    for (j = 0, len = touches.length; j < len; j++) {
      touch = touches[j];
      if (this.touchMouse === null) {
        this.touchMouse = touch.identifier;
      }
      if (this.touchMouse === touch.identifier) {
        results.push(this.game.touchDown(touch.clientX, touch.clientY));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  NativeApp.prototype.onTouchMove = function(evt) {
    var j, len, results, touch, touches;
    this.lastInteractTime = new Date().getTime();
    touches = evt.changedTouches;
    results = [];
    for (j = 0, len = touches.length; j < len; j++) {
      touch = touches[j];
      if (this.touchMouse === touch.identifier) {
        results.push(this.game.touchMove(touch.clientX, touch.clientY));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  NativeApp.prototype.onTouchEnd = function(evt) {
    var j, len, touch, touches;
    this.lastInteractTime = new Date().getTime();
    touches = evt.changedTouches;
    for (j = 0, len = touches.length; j < len; j++) {
      touch = touches[j];
      if (this.touchMouse === touch.identifier) {
        this.game.touchUp(touch.clientX, touch.clientY);
        this.touchMouse = null;
      }
    }
    if (evt.touches.length === 0) {
      return this.touchMouse = null;
    }
  };

  NativeApp.prototype.onMouseDown = function(evt) {
    if (this.heardOneTouch) {
      return;
    }
    this.lastInteractTime = new Date().getTime();
    return this.game.touchDown(evt.clientX, evt.clientY);
  };

  NativeApp.prototype.onMouseMove = function(evt) {
    if (this.heardOneTouch) {
      return;
    }
    this.lastInteractTime = new Date().getTime();
    return this.game.touchMove(evt.clientX, evt.clientY);
  };

  NativeApp.prototype.onMouseUp = function(evt) {
    if (this.heardOneTouch) {
      return;
    }
    this.lastInteractTime = new Date().getTime();
    return this.game.touchUp(evt.clientX, evt.clientY);
  };

  return NativeApp;

})();

screen = document.getElementById('screen');

resizeScreen = function() {
  var currentAspectRatio, desiredAspectRatio;
  desiredAspectRatio = 16 / 9;
  currentAspectRatio = window.innerWidth / window.innerHeight;
  if (currentAspectRatio < desiredAspectRatio) {
    screen.width = window.innerWidth;
    return screen.height = Math.floor(window.innerWidth * (1 / desiredAspectRatio));
  } else {
    screen.width = Math.floor(window.innerHeight * desiredAspectRatio);
    return screen.height = window.innerHeight;
  }
};

resizeScreen();

app = new NativeApp(screen, screen.width, screen.height);


},{"./Game":5}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL0FuaW1hdGlvbi5jb2ZmZWUiLCJnYW1lL0JsYWNrb3V0LmNvZmZlZSIsImdhbWUvQnV0dG9uLmNvZmZlZSIsImdhbWUvRm9udFJlbmRlcmVyLmNvZmZlZSIsImdhbWUvR2FtZS5jb2ZmZWUiLCJnYW1lL0hhbmQuY29mZmVlIiwiZ2FtZS9NZW51LmNvZmZlZSIsImdhbWUvUGlsZS5jb2ZmZWUiLCJnYW1lL1Nwcml0ZVJlbmRlcmVyLmNvZmZlZSIsImdhbWUvZm9udG1ldHJpY3MuY29mZmVlIiwiZ2FtZS9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLFNBQUMsQ0FBRDtFQUNULElBQUcsQ0FBQSxLQUFLLENBQVI7QUFDRSxXQUFPLEVBRFQ7R0FBQSxNQUVLLElBQUcsQ0FBQSxHQUFJLENBQVA7QUFDSCxXQUFPLENBQUMsRUFETDs7QUFFTCxTQUFPO0FBTEU7O0FBT0w7RUFDUyxtQkFBQyxJQUFEO0FBQ1gsUUFBQTtJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDO0lBQ2QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxHQUFELEdBQU87QUFDUCxTQUFBLFNBQUE7O01BQ0UsSUFBRyxDQUFBLEtBQUssT0FBUjtRQUNFLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFMLEdBQVU7UUFDVixJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBTCxHQUFVLEVBRlo7O0FBREY7RUFKVzs7c0JBVWIsSUFBQSxHQUFNLFNBQUE7SUFDSixJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQURoQjs7SUFFQSxJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcs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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjYWxjU2lnbiA9ICh2KSAtPlxuICBpZiB2ID09IDBcbiAgICByZXR1cm4gMFxuICBlbHNlIGlmIHYgPCAwXG4gICAgcmV0dXJuIC0xXG4gIHJldHVybiAxXG5cbmNsYXNzIEFuaW1hdGlvblxuICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgQHNwZWVkID0gZGF0YS5zcGVlZFxuICAgIEByZXEgPSB7fVxuICAgIEBjdXIgPSB7fVxuICAgIGZvciBrLHYgb2YgZGF0YVxuICAgICAgaWYgayAhPSAnc3BlZWQnXG4gICAgICAgIEByZXFba10gPSB2XG4gICAgICAgIEBjdXJba10gPSB2XG5cbiAgIyAnZmluaXNoZXMnIGFsbCBhbmltYXRpb25zXG4gIHdhcnA6IC0+XG4gICAgaWYgQGN1ci5yP1xuICAgICAgQGN1ci5yID0gQHJlcS5yXG4gICAgaWYgQGN1ci5zP1xuICAgICAgQGN1ci5zID0gQHJlcS5zXG4gICAgaWYgQGN1ci54PyBhbmQgQGN1ci55P1xuICAgICAgQGN1ci54ID0gQHJlcS54XG4gICAgICBAY3VyLnkgPSBAcmVxLnlcblxuICBhbmltYXRpbmc6IC0+XG4gICAgaWYgQGN1ci5yP1xuICAgICAgaWYgQHJlcS5yICE9IEBjdXIuclxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGlmIEBjdXIucz9cbiAgICAgIGlmIEByZXEucyAhPSBAY3VyLnNcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICBpZiBAY3VyLng/IGFuZCBAY3VyLnk/XG4gICAgICBpZiAoQHJlcS54ICE9IEBjdXIueCkgb3IgKEByZXEueSAhPSBAY3VyLnkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgdXBkYXRlOiAoZHQpIC0+XG4gICAgdXBkYXRlZCA9IGZhbHNlXG4gICAgIyByb3RhdGlvblxuICAgIGlmIEBjdXIucj9cbiAgICAgIGlmIEByZXEuciAhPSBAY3VyLnJcbiAgICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICAgICAgIyBzYW5pdGl6ZSByZXF1ZXN0ZWQgcm90YXRpb25cbiAgICAgICAgdHdvUGkgPSBNYXRoLlBJICogMlxuICAgICAgICBuZWdUd29QaSA9IC0xICogdHdvUGlcbiAgICAgICAgQHJlcS5yIC09IHR3b1BpIHdoaWxlIEByZXEuciA+PSB0d29QaVxuICAgICAgICBAcmVxLnIgKz0gdHdvUGkgd2hpbGUgQHJlcS5yIDw9IG5lZ1R3b1BpXG4gICAgICAgICMgcGljayBhIGRpcmVjdGlvbiBhbmQgdHVyblxuICAgICAgICBkciA9IEByZXEuciAtIEBjdXIuclxuICAgICAgICBkaXN0ID0gTWF0aC5hYnMoZHIpXG4gICAgICAgIHNpZ24gPSBjYWxjU2lnbihkcilcbiAgICAgICAgaWYgZGlzdCA+IE1hdGguUElcbiAgICAgICAgICAjIHNwaW4gdGhlIG90aGVyIGRpcmVjdGlvbiwgaXQgaXMgY2xvc2VyXG4gICAgICAgICAgZGlzdCA9IHR3b1BpIC0gZGlzdFxuICAgICAgICAgIHNpZ24gKj0gLTFcbiAgICAgICAgbWF4RGlzdCA9IGR0ICogQHNwZWVkLnIgLyAxMDAwXG4gICAgICAgIGlmIGRpc3QgPCBtYXhEaXN0XG4gICAgICAgICAgIyB3ZSBjYW4gZmluaXNoIHRoaXMgZnJhbWVcbiAgICAgICAgICBAY3VyLnIgPSBAcmVxLnJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBjdXIuciArPSBtYXhEaXN0ICogc2lnblxuXG4gICAgIyBzY2FsZVxuICAgIGlmIEBjdXIucz9cbiAgICAgIGlmIEByZXEucyAhPSBAY3VyLnNcbiAgICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICAgICAgIyBwaWNrIGEgZGlyZWN0aW9uIGFuZCB0dXJuXG4gICAgICAgIGRzID0gQHJlcS5zIC0gQGN1ci5zXG4gICAgICAgIGRpc3QgPSBNYXRoLmFicyhkcylcbiAgICAgICAgc2lnbiA9IGNhbGNTaWduKGRzKVxuICAgICAgICBtYXhEaXN0ID0gZHQgKiBAc3BlZWQucyAvIDEwMDBcbiAgICAgICAgaWYgZGlzdCA8IG1heERpc3RcbiAgICAgICAgICAjIHdlIGNhbiBmaW5pc2ggdGhpcyBmcmFtZVxuICAgICAgICAgIEBjdXIucyA9IEByZXEuc1xuICAgICAgICBlbHNlXG4gICAgICAgICAgQGN1ci5zICs9IG1heERpc3QgKiBzaWduXG5cbiAgICAjIHRyYW5zbGF0aW9uXG4gICAgaWYgQGN1ci54PyBhbmQgQGN1ci55P1xuICAgICAgaWYgKEByZXEueCAhPSBAY3VyLngpIG9yIChAcmVxLnkgIT0gQGN1ci55KVxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxuICAgICAgICB2ZWNYID0gQHJlcS54IC0gQGN1ci54XG4gICAgICAgIHZlY1kgPSBAcmVxLnkgLSBAY3VyLnlcbiAgICAgICAgZGlzdCA9IE1hdGguc3FydCgodmVjWCAqIHZlY1gpICsgKHZlY1kgKiB2ZWNZKSlcbiAgICAgICAgbWF4RGlzdCA9IGR0ICogQHNwZWVkLnQgLyAxMDAwXG4gICAgICAgIGlmIGRpc3QgPCBtYXhEaXN0XG4gICAgICAgICAgIyB3ZSBjYW4gZmluaXNoIHRoaXMgZnJhbWVcbiAgICAgICAgICBAY3VyLnggPSBAcmVxLnhcbiAgICAgICAgICBAY3VyLnkgPSBAcmVxLnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgbW92ZSBhcyBtdWNoIGFzIHBvc3NpYmxlXG4gICAgICAgICAgQGN1ci54ICs9ICh2ZWNYIC8gZGlzdCkgKiBtYXhEaXN0XG4gICAgICAgICAgQGN1ci55ICs9ICh2ZWNZIC8gZGlzdCkgKiBtYXhEaXN0XG5cbiAgICByZXR1cm4gdXBkYXRlZFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvblxuIiwiTUlOX1BMQVlFUlMgPSAzXG5NQVhfTE9HX0xJTkVTID0gN1xuT0sgPSAnT0snXG5TdGF0ZSA9XG4gIExPQkJZOiAnbG9iYnknXG4gIEJJRDogJ2JpZCdcbiAgVFJJQ0s6ICd0cmljaydcbiAgUk9VTkRTVU1NQVJZOiAncm91bmRTdW1tYXJ5J1xuICBQT1NUR0FNRVNVTU1BUlk6ICdwb3N0R2FtZVN1bW1hcnknXG5cblN1aXQgPVxuICBOT05FOiAtMVxuICBDTFVCUzogMFxuICBESUFNT05EUzogMVxuICBIRUFSVFM6IDJcbiAgU1BBREVTOiAzXG5cblN1aXROYW1lID0gWydDbHVicycsICdEaWFtb25kcycsICdIZWFydHMnLCAnU3BhZGVzJ11cblNob3J0U3VpdE5hbWUgPSBbJ0MnLCAnRCcsICdIJywgJ1MnXVxuXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBBSSBOYW1lIEdlbmVyYXRvclxuXG5haUNoYXJhY3Rlckxpc3QgPSBbXG4gIHsgaWQ6IFwibWFyaW9cIiwgICAgbmFtZTogXCJNYXJpb1wiLCAgICAgIHNwcml0ZTogXCJtYXJpb1wiLCAgICBicmFpbjogXCJub3JtYWxcIiB9XG4gIHsgaWQ6IFwibHVpZ2lcIiwgICAgbmFtZTogXCJMdWlnaVwiLCAgICAgIHNwcml0ZTogXCJsdWlnaVwiLCAgICBicmFpbjogXCJjaGFvc1wiIH1cbiAgeyBpZDogXCJwZWFjaFwiLCAgICBuYW1lOiBcIlBlYWNoXCIsICAgICAgc3ByaXRlOiBcInBlYWNoXCIsICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cbiAgeyBpZDogXCJkYWlzeVwiLCAgICBuYW1lOiBcIkRhaXN5XCIsICAgICAgc3ByaXRlOiBcImRhaXN5XCIsICAgIGJyYWluOiBcImNvbnNlcnZhdGl2ZU1vcm9uXCIgfVxuICB7IGlkOiBcInlvc2hpXCIsICAgIG5hbWU6IFwiWW9zaGlcIiwgICAgICBzcHJpdGU6IFwieW9zaGlcIiwgICAgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcInRvYWRcIiwgICAgIG5hbWU6IFwiVG9hZFwiLCAgICAgICBzcHJpdGU6IFwidG9hZFwiLCAgICAgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcImJvd3NlclwiLCAgIG5hbWU6IFwiQm93c2VyXCIsICAgICBzcHJpdGU6IFwiYm93c2VyXCIsICAgYnJhaW46IFwiYWdncmVzc2l2ZU1vcm9uXCIgfVxuICB7IGlkOiBcImJvd3NlcmpyXCIsIG5hbWU6IFwiQm93c2VyIEpyXCIsICBzcHJpdGU6IFwiYm93c2VyanJcIiwgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcImtvb3BhXCIsICAgIG5hbWU6IFwiS29vcGFcIiwgICAgICBzcHJpdGU6IFwia29vcGFcIiwgICAgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcInJvc2FsaW5hXCIsIG5hbWU6IFwiUm9zYWxpbmFcIiwgICBzcHJpdGU6IFwicm9zYWxpbmFcIiwgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcInNoeWd1eVwiLCAgIG5hbWU6IFwiU2h5Z3V5XCIsICAgICBzcHJpdGU6IFwic2h5Z3V5XCIsICAgYnJhaW46IFwibm9ybWFsXCIgfVxuICB7IGlkOiBcInRvYWRldHRlXCIsIG5hbWU6IFwiVG9hZGV0dGVcIiwgICBzcHJpdGU6IFwidG9hZGV0dGVcIiwgYnJhaW46IFwibm9ybWFsXCIgfVxuXVxuXG5haUNoYXJhY3RlcnMgPSB7fVxuZm9yIGNoYXJhY3RlciBpbiBhaUNoYXJhY3Rlckxpc3RcbiAgYWlDaGFyYWN0ZXJzW2NoYXJhY3Rlci5pZF0gPSBjaGFyYWN0ZXJcblxucmFuZG9tQ2hhcmFjdGVyID0gLT5cbiAgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFpQ2hhcmFjdGVyTGlzdC5sZW5ndGgpXG4gIHJldHVybiBhaUNoYXJhY3Rlckxpc3Rbcl1cblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQ2FyZFxuXG5jbGFzcyBDYXJkXG4gIGNvbnN0cnVjdG9yOiAoeCkgLT5cbiAgICBAc3VpdCAgPSBNYXRoLmZsb29yKHggLyAxMylcbiAgICBAdmFsdWUgPSBNYXRoLmZsb29yKHggJSAxMylcbiAgICBzd2l0Y2ggQHZhbHVlXG4gICAgICB3aGVuIDkgIHRoZW4gQHZhbHVlTmFtZSA9ICdKJ1xuICAgICAgd2hlbiAxMCB0aGVuIEB2YWx1ZU5hbWUgPSAnUSdcbiAgICAgIHdoZW4gMTEgdGhlbiBAdmFsdWVOYW1lID0gJ0snXG4gICAgICB3aGVuIDEyIHRoZW4gQHZhbHVlTmFtZSA9ICdBJ1xuICAgICAgZWxzZSAgICAgICAgIEB2YWx1ZU5hbWUgPSBTdHJpbmcoQHZhbHVlICsgMilcblxuICAgIEBuYW1lID0gQHZhbHVlTmFtZSArIFNob3J0U3VpdE5hbWVbQHN1aXRdXG5cbmNhcmRCZWF0cyA9IChjaGFsbGVuZ2VyWCwgY2hhbXBpb25YLCBjdXJyZW50U3VpdCkgLT5cbiAgY2hhbGxlbmdlciA9IG5ldyBDYXJkKGNoYWxsZW5nZXJYKVxuICBjaGFtcGlvbiA9IG5ldyBDYXJkKGNoYW1waW9uWClcblxuICBpZiBjaGFsbGVuZ2VyLnN1aXQgPT0gY2hhbXBpb24uc3VpdFxuICAgICMgRWFzeSBjYXNlLi4uIHNhbWUgc3VpdCwganVzdCB0ZXN0IHZhbHVlXG4gICAgcmV0dXJuIChjaGFsbGVuZ2VyLnZhbHVlID4gY2hhbXBpb24udmFsdWUpXG4gIGVsc2VcbiAgICBpZiBjaGFsbGVuZ2VyLnN1aXQgPT0gU3VpdC5TUEFERVNcbiAgICAgICMgVHJ1bXAgZ3VhcmFudGVlZCB3aW5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgIyBEdW1wIGd1YXJhbnRlZWQgbG9zc1xuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgcmV0dXJuIGZhbHNlXG5cbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIERlY2tcblxuY2xhc3MgU2h1ZmZsZWREZWNrXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgICMgZGF0IGluc2lkZS1vdXQgc2h1ZmZsZSFcbiAgICBAY2FyZHMgPSBbIDAgXVxuICAgIGZvciBpIGluIFsxLi4uNTJdXG4gICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSlcbiAgICAgIEBjYXJkcy5wdXNoKEBjYXJkc1tqXSlcbiAgICAgIEBjYXJkc1tqXSA9IGlcblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQmxhY2tvdXRcblxuY2xhc3MgQmxhY2tvdXRcbiAgY29uc3RydWN0b3I6IChAZ2FtZSwgcGFyYW1zKSAtPlxuICAgIHJldHVybiBpZiBub3QgcGFyYW1zXG5cbiAgICBpZiBwYXJhbXMuc3RhdGVcbiAgICAgIGZvciBrLHYgb2YgcGFyYW1zLnN0YXRlXG4gICAgICAgIGlmIHBhcmFtcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShrKVxuICAgICAgICAgIHRoaXNba10gPSBwYXJhbXMuc3RhdGVba11cblxuICAgICAgIyB0aGlzIGNhbiBiZSByZW1vdmVkIGF0IHNvbWUgcG9pbnRcbiAgICAgIGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcbiAgICAgICAgaWYgcGxheWVyLmNoYXJhY3RlclxuICAgICAgICAgIHBsYXllci5jaGFySUQgPSBwbGF5ZXIuY2hhcmFjdGVyLnNwcml0ZVxuICAgICAgICAgIGRlbGV0ZSBwbGF5ZXJbXCJjaGFyYWN0ZXJcIl1cbiAgICBlbHNlXG4gICAgICAjIG5ldyBnYW1lXG4gICAgICBAc3RhdGUgPSBTdGF0ZS5MT0JCWVxuICAgICAgQHBsYXllcnMgPSBwYXJhbXMucGxheWVyc1xuICAgICAgQGxvZyA9IFtdXG4gICAgICBpZiBwYXJhbXMucm91bmRzID09ICdNJ1xuICAgICAgICAjIG1hcmF0aG9uIG1vZGUhXG4gICAgICAgIEByb3VuZHMgPSBbJ00nXVxuICAgICAgZWxzZVxuICAgICAgICBAcm91bmRzID0gKE51bWJlcih2KSBmb3IgdiBpbiBwYXJhbXMucm91bmRzLnNwbGl0KFwifFwiKSlcblxuICAgICAgQHBsYXllcnNbMF0uYmlkID0gMFxuICAgICAgQHBsYXllcnNbMF0udHJpY2tzID0gMFxuICAgICAgQHBsYXllcnNbMF0uc2NvcmUgPSAwXG4gICAgICBAcGxheWVyc1swXS5pbmRleCA9IDBcblxuICAgICAgQG91dHB1dChAcGxheWVyc1swXS5uYW1lICsgJyBjcmVhdGVzIGdhbWUnKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgQmxhY2tvdXQgbWV0aG9kc1xuXG4gIG1hcmF0aG9uTW9kZTogLT5cbiAgICByZXR1cm4gKEByb3VuZHNbMF0gPT0gJ00nKVxuXG4gIHNhdmU6IC0+XG4gICAgbmFtZXMgPSBcImJpZHMgZGVhbGVyIGxvZyBsb3dlc3RSZXF1aXJlZCBuZXh0Um91bmQgcGlsZSBwaWxlV2hvIHBsYXllcnMgcHJldiBwcmV2VHJpY2tUYWtlciBwcmV2V2hvIHJvdW5kcyBzdGF0ZSB0cmlja0lEIHRyaWNrVGFrZXIgdHJpY2tzIHRydW1wQnJva2VuIHR1cm5cIi5zcGxpdChcIiBcIilcbiAgICBzdGF0ZSA9IHt9XG4gICAgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICAgIHN0YXRlW25hbWVdID0gdGhpc1tuYW1lXVxuICAgIHJldHVybiBzdGF0ZVxuXG4gIGZpbmRQbGF5ZXI6IChpZCkgLT5cbiAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXG4gICAgICBpZiBwbGF5ZXIuaWQgPT0gaWRcbiAgICAgICAgcmV0dXJuIHBsYXllclxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBmaW5kT3duZXI6IC0+XG4gICAgcmV0dXJuIEBwbGF5ZXJzWzBdXG5cbiAgY3VycmVudFBsYXllcjogLT5cbiAgICByZXR1cm4gQHBsYXllcnNbQHR1cm5dXG5cbiAgY3VycmVudFN1aXQ6IC0+XG4gICAgaWYgQHBpbGUubGVuZ3RoID09IDBcbiAgICAgIHJldHVybiBTdWl0Lk5PTkVcblxuICAgIGNhcmQgPSBuZXcgQ2FyZChAcGlsZVswXSlcbiAgICByZXR1cm4gY2FyZC5zdWl0XG5cbiAgcmVuYW1lOiAoaWQsIG5hbWUpIC0+XG4gICAgcGxheWVyID0gQGZpbmRQbGF5ZXIoaWQpXG4gICAgaWYgcGxheWVyXG4gICAgICBAb3V0cHV0KHBsYXllci5uYW1lICsgJyByZW5hbWVkIHRvICcgKyBuYW1lKVxuICAgICAgcGxheWVyLm5hbWUgPSBuYW1lXG5cbiAgcGxheWVySGFzU3VpdDogKHBsYXllciwgc3VpdCkgLT5cbiAgICBmb3IgdiBpbiBwbGF5ZXIuaGFuZFxuICAgICAgY2FyZCA9IG5ldyBDYXJkKHYpXG4gICAgICBpZiBjYXJkLnN1aXQgPT0gc3VpdFxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHBsYXllckhhc09ubHlTcGFkZXM6IChwbGF5ZXIpIC0+XG4gICAgZm9yIHYgaW4gcGxheWVyLmhhbmRcbiAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxuICAgICAgaWYgY2FyZC5zdWl0ICE9IFN1aXQuU1BBREVTXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGxheWVyQ2FuV2luSW5TdWl0OiAocGxheWVyLCBjaGFtcGlvbkNhcmQpIC0+XG4gICAgZm9yIHYgaW4gcGxheWVyLmhhbmRcbiAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxuICAgICAgaWYgY2FyZC5zdWl0ID09IGNoYW1waW9uQ2FyZC5zdWl0XG4gICAgICAgIGlmIGNhcmQudmFsdWUgPiBjaGFtcGlvbkNhcmQudmFsdWVcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGJlc3RJblBpbGU6IC0+XG4gICAgaWYgQHBpbGUubGVuZ3RoID09IDBcbiAgICAgIHJldHVybiAtMVxuICAgIGN1cnJlbnRTdWl0ID0gQGN1cnJlbnRTdWl0KClcbiAgICBiZXN0ID0gMFxuICAgIGZvciBpIGluIFsxLi4uQHBpbGUubGVuZ3RoXVxuICAgICAgaWYgY2FyZEJlYXRzKEBwaWxlW2ldLCBAcGlsZVtiZXN0XSwgY3VycmVudFN1aXQpXG4gICAgICAgIGJlc3QgPSBpXG4gICAgcmV0dXJuIGJlc3RcblxuICBwbGF5ZXJBZnRlcjogKGluZGV4KSAtPlxuICAgIHJldHVybiAoaW5kZXggKyAxKSAlIEBwbGF5ZXJzLmxlbmd0aFxuXG4gIG91dHB1dDogKHRleHQpIC0+XG4gICAgQGxvZy5wdXNoIHRleHRcbiAgICBpZiBAbG9nLmxlbmd0aCA+IE1BWF9MT0dfTElORVNcbiAgICAgIEBsb2cuc2hpZnQoKVxuXG4gIHJlc2V0OiAocGFyYW1zKSAtPlxuICAgIGlmIEBwbGF5ZXJzLmxlbmd0aCA8IE1JTl9QTEFZRVJTXG4gICAgICByZXR1cm4gJ25vdEVub3VnaFBsYXllcnMnXG5cbiAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXG4gICAgICBwbGF5ZXIuc2NvcmUgPSAwXG4gICAgICBwbGF5ZXIuaGFuZCA9IFtdXG5cbiAgICBAbmV4dFJvdW5kID0gMFxuICAgIEB0cnVtcEJyb2tlbiA9IGZhbHNlXG4gICAgQHByZXYgPSBbXVxuICAgIEBwaWxlID0gW11cbiAgICBAcGlsZVdobyA9IFtdXG4gICAgQHByZXZXaG8gPSBbXVxuICAgIEBwcmV2VHJpY2tUYWtlciA9IC0xXG5cbiAgICBpZiBAbWFyYXRob25Nb2RlKClcbiAgICAgIHJvdW5kQ291bnQgPSBcIk1hcmF0aG9uIG1vZGVcIlxuICAgIGVsc2VcbiAgICAgIHJvdW5kQ291bnQgPSBcIiN7QHJvdW5kcy5sZW5ndGh9IHJvdW5kc1wiXG4gICAgQG91dHB1dChcIk5ldyBnYW1lISAoI3tAcGxheWVycy5sZW5ndGh9IHBsYXllcnMsICN7cm91bmRDb3VudH0pXCIpXG5cbiAgICBAc3RhcnRCaWQoKVxuXG4gICAgcmV0dXJuIE9LXG5cbiAgc3RhcnRCaWQ6IChwYXJhbXMpIC0+XG4gICAgaWYgQG1hcmF0aG9uTW9kZSgpXG4gICAgICBpZiBAcGxheWVyc1swXS5zY29yZSA+IDBcbiAgICAgICAgcmV0dXJuICdnYW1lT3ZlcidcbiAgICAgIEB0cmlja3MgPSAxM1xuICAgIGVsc2VcbiAgICAgIGlmKEBuZXh0Um91bmQgPj0gQHJvdW5kcy5sZW5ndGgpXG4gICAgICAgIHJldHVybiAnZ2FtZU92ZXInXG4gICAgICBAdHJpY2tzID0gQHJvdW5kc1tAbmV4dFJvdW5kXVxuXG4gICAgQG5leHRSb3VuZCsrXG5cbiAgICBpZiBAcHJldlRyaWNrVGFrZXIgPT0gLTFcbiAgICAgIEBkZWFsZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBAcGxheWVycy5sZW5ndGgpXG4gICAgICBAb3V0cHV0IFwiUmFuZG9tbHkgYXNzaWduaW5nIGRlYWxlciB0byAje0BwbGF5ZXJzW0BkZWFsZXJdLm5hbWV9XCJcbiAgICBlbHNlXG4gICAgICBAZGVhbGVyID0gQHByZXZUcmlja1Rha2VyXG4gICAgICBAb3V0cHV0IFwiI3tAcGxheWVyc1tAZGVhbGVyXS5uYW1lfSBjbGFpbWVkIGxhc3QgdHJpY2ssIGRlYWxzXCJcblxuICAgIGRlY2sgPSBuZXcgU2h1ZmZsZWREZWNrKClcbiAgICBmb3IgcGxheWVyLCBpIGluIEBwbGF5ZXJzXG4gICAgICBwbGF5ZXIuYmlkID0gLTFcbiAgICAgIHBsYXllci50cmlja3MgPSAwXG5cbiAgICAgIEBnYW1lLmxvZyBcImRlYWxpbmcgI3tAdHJpY2tzfSBjYXJkcyB0byBwbGF5ZXIgI3tpfVwiXG5cbiAgICAgIHBsYXllci5oYW5kID0gW11cbiAgICAgIGZvciBqIGluIFswLi4uQHRyaWNrc11cbiAgICAgICAgcGxheWVyLmhhbmQucHVzaChkZWNrLmNhcmRzLnNoaWZ0KCkpXG5cbiAgICAgIHBsYXllci5oYW5kLnNvcnQgKGEsYikgLT4gcmV0dXJuIGEgLSBiXG5cbiAgICBAc3RhdGUgPSBTdGF0ZS5CSURcbiAgICBAdHVybiA9IEBwbGF5ZXJBZnRlcihAZGVhbGVyKVxuICAgIEBiaWRzID0gMFxuICAgIEBwaWxlID0gW11cbiAgICBAcGlsZVdobyA9IFtdXG4gICAgQHByZXYgPSBbXVxuICAgIEBwcmV2V2hvID0gW11cbiAgICBAcHJldlRyaWNrVGFrZXIgPSAtMVxuXG4gICAgQG91dHB1dCgnUm91bmQgJyArIEBuZXh0Um91bmQgKyAnIGJlZ2lucyAnICsgQHBsYXllcnNbQHR1cm5dLm5hbWUgKyAnIGJpZHMgZmlyc3QnKVxuXG4gICAgcmV0dXJuIE9LXG5cbiAgZW5kQmlkOiAtPlxuICAgIGxvd2VzdFBsYXllciA9IDBcbiAgICBsb3dlc3RDYXJkID0gQHBsYXllcnNbMF0uaGFuZFswXSAjIGhhbmQgaXMgc29ydGVkLCB0aGVyZWZvcmUgaGFuZFswXSBpcyB0aGUgbG93ZXN0XG4gICAgZm9yIGkgaW4gWzEuLi5AcGxheWVycy5sZW5ndGhdXG4gICAgICBwbGF5ZXIgPSBAcGxheWVyc1tpXVxuICAgICAgaWYgcGxheWVyLmhhbmRbMF0gPCBsb3dlc3RDYXJkXG4gICAgICAgIGxvd2VzdFBsYXllciA9IGlcbiAgICAgICAgbG93ZXN0Q2FyZCA9IHBsYXllci5oYW5kWzBdXG5cbiAgICBAbG93ZXN0UmVxdWlyZWQgPSB0cnVlICMgTmV4dCBwbGF5ZXIgaXMgb2JsaWdhdGVkIHRvIHRocm93IHRoZSBsb3dlc3QgY2FyZFxuICAgIEB0dXJuID0gbG93ZXN0UGxheWVyXG4gICAgQHRydW1wQnJva2VuID0gZmFsc2VcbiAgICBAdHJpY2tJRCA9IDBcbiAgICBAc3RhcnRUcmljaygpXG5cbiAgc3RhcnRUcmljazogKCkgLT5cbiAgICAjIEB0dXJuIHNob3VsZCBhbHJlYWR5IGJlIGNvcnJlY3QsIGVpdGhlciBmcm9tIGVuZEJpZCAobG93ZXN0IGNsdWIpIG9yIGVuZFRyaWNrIChsYXN0IHRyaWNrVGFrZXIpXG5cbiAgICBAdHJpY2tUYWtlciA9IC0xXG4gICAgQHN0YXRlID0gU3RhdGUuVFJJQ0tcblxuICAgIHJldHVybiBPS1xuXG4gIGVuZFRyaWNrOiAtPlxuICAgIHRha2VyID0gQHBsYXllcnNbQHRyaWNrVGFrZXJdXG4gICAgdGFrZXIudHJpY2tzKytcblxuICAgIEBvdXRwdXQodGFrZXIubmFtZSArICcgcG9ja2V0cyB0aGUgdHJpY2sgWycgKyB0YWtlci50cmlja3MgKyAnXScpXG4gICAgQHByZXZUcmlja1Rha2VyID0gQHRyaWNrVGFrZXJcbiAgICBAdHVybiA9IEB0cmlja1Rha2VyXG4gICAgQHByZXYgPSBAcGlsZVxuICAgIEBwcmV2V2hvID0gQHBpbGVXaG9cbiAgICBAcGlsZSA9IFtdXG4gICAgQHBpbGVXaG8gPSBbXVxuICAgIEB0cmlja0lEKytcblxuICAgIGlmIEBwbGF5ZXJzWzBdLmhhbmQubGVuZ3RoID4gMFxuICAgICAgQHN0YXJ0VHJpY2soKVxuICAgIGVsc2VcbiAgICAgIHJvdW5kQ291bnQgPSBAcm91bmRzLmxlbmd0aFxuICAgICAgaWYgQG1hcmF0aG9uTW9kZSgpXG4gICAgICAgIHJvdW5kQ291bnQgPSBcIk1cIlxuICAgICAgQG91dHB1dCgnUm91bmQgZW5kcyBbJyArIEBuZXh0Um91bmQgKyAnLycgKyByb3VuZENvdW50ICsgJ10nKVxuXG4gICAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXG4gICAgICAgIG92ZXJVbmRlciA9IHBsYXllci5iaWQgLSBwbGF5ZXIudHJpY2tzXG4gICAgICAgIGlmIG92ZXJVbmRlciA8IDBcbiAgICAgICAgICBvdmVyVW5kZXIgKj0gLTFcblxuICAgICAgICBwZW5hbHR5UG9pbnRzID0gMFxuICAgICAgICBzdGVwID0gMVxuICAgICAgICB3aGlsZSBvdmVyVW5kZXIgPiAwXG4gICAgICAgICAgcGVuYWx0eVBvaW50cyArPSBzdGVwKysgIyBkYXQgcXVhZHJhdGljXG4gICAgICAgICAgb3ZlclVuZGVyLS1cblxuICAgICAgICBwbGF5ZXIuc2NvcmUgKz0gcGVuYWx0eVBvaW50c1xuXG4gICAgICAgIHBsYXllci5sYXN0V2VudCA9IFN0cmluZyhwbGF5ZXIudHJpY2tzKSArICcvJyArIFN0cmluZyhwbGF5ZXIuYmlkKVxuICAgICAgICBwbGF5ZXIubGFzdFBvaW50cyA9IHBlbmFsdHlQb2ludHNcblxuICAgICAgZ2FtZUVuZGluZyA9IGZhbHNlXG4gICAgICBpZiBAbWFyYXRob25Nb2RlKClcbiAgICAgICAgZ2FtZUVuZGluZyA9IChAcGxheWVyc1swXS5zY29yZSA+IDApXG4gICAgICBlbHNlXG4gICAgICAgIGdhbWVFbmRpbmcgPSAoQG5leHRSb3VuZCA+PSBAcm91bmRzLmxlbmd0aClcblxuICAgICAgaWYgZ2FtZUVuZGluZ1xuICAgICAgICBAc3RhdGUgPSBTdGF0ZS5QT1NUR0FNRVNVTU1BUllcbiAgICAgIGVsc2VcbiAgICAgICAgQHN0YXRlID0gU3RhdGUuUk9VTkRTVU1NQVJZXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBCbGFja291dCBhY3Rpb25zXG5cbiAgcXVpdDogKHBhcmFtcykgLT5cbiAgICBAc3RhdGUgPSBTdGF0ZS5QT1NUR0FNRVNVTU1BUllcbiAgICBAb3V0cHV0KCdTb21lb25lIHF1aXQgQmxhY2tvdXQgb3ZlcicpXG5cbiAgbmV4dDogKHBhcmFtcykgLT5cbiAgICBzd2l0Y2ggQHN0YXRlXG4gICAgICB3aGVuIFN0YXRlLkxPQkJZICAgICAgICAgICB0aGVuIHJldHVybiBAcmVzZXQocGFyYW1zKVxuICAgICAgd2hlbiBTdGF0ZS5CSURTVU1NQVJZICAgICAgdGhlbiByZXR1cm4gQHN0YXJ0VHJpY2soKVxuICAgICAgd2hlbiBTdGF0ZS5ST1VORFNVTU1BUlkgICAgdGhlbiByZXR1cm4gQHN0YXJ0QmlkKClcbiAgICAgIHdoZW4gU3RhdGUuUE9TVEdBTUVTVU1NQVJZIHRoZW4gcmV0dXJuICdnYW1lT3ZlcidcbiAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnbm9OZXh0J1xuICAgIHJldHVybiAnbmV4dElzQ29uZnVzZWQnXG5cbiAgYmlkOiAocGFyYW1zKSAtPlxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5CSURcbiAgICAgIHJldHVybiAnbm90QmlkZGluZ05vdydcblxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXG4gICAgaWYgcGFyYW1zLmlkICE9IGN1cnJlbnRQbGF5ZXIuaWRcbiAgICAgIHJldHVybiAnbm90WW91clR1cm4nXG5cbiAgICBwYXJhbXMuYmlkID0gTnVtYmVyKHBhcmFtcy5iaWQpXG5cbiAgICBpZiAocGFyYW1zLmJpZCA8IDApIHx8IChwYXJhbXMuYmlkID4gQHRyaWNrcylcbiAgICAgIHJldHVybiAnYmlkT3V0T2ZSYW5nZSdcblxuICAgIGlmIEB0dXJuID09IEBkZWFsZXJcbiAgICAgIGlmIChAYmlkcyArIHBhcmFtcy5iaWQpID09IEB0cmlja3NcbiAgICAgICAgcmV0dXJuICdkZWFsZXJGdWNrZWQnXG5cbiAgICAgIEBlbmRCaWQoKVxuICAgIGVsc2VcbiAgICAgIEB0dXJuID0gQHBsYXllckFmdGVyKEB0dXJuKVxuXG4gICAgY3VycmVudFBsYXllci5iaWQgPSBwYXJhbXMuYmlkXG4gICAgQGJpZHMgKz0gY3VycmVudFBsYXllci5iaWRcbiAgICBAb3V0cHV0KGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIGJpZHMgXCIgKyBjdXJyZW50UGxheWVyLmJpZClcblxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5CSURcbiAgICAgICMgQmlkZGluZyBlbmRlZFxuICAgICAgQG91dHB1dCgnQmlkZGluZyBlbmRzICcgKyBAYmlkcyArICcvJyArIEB0cmlja3MgKyAnICcgKyBAcGxheWVyc1tAdHVybl0ubmFtZSArICcgdGhyb3dzIGZpcnN0JylcblxuICAgIHJldHVybiBPS1xuXG4gIGFkZFBsYXllcjogKHBsYXllcikgLT5cbiAgICBwbGF5ZXIuYmlkID0gMFxuICAgIHBsYXllci50cmlja3MgPSAwXG4gICAgcGxheWVyLnNjb3JlID0gMFxuICAgIGlmIG5vdCBwbGF5ZXIuYWlcbiAgICAgIHBsYXllci5haSA9IGZhbHNlXG5cbiAgICBAcGxheWVycy5wdXNoIHBsYXllclxuICAgIHBsYXllci5pbmRleCA9IEBwbGF5ZXJzLmxlbmd0aCAtIDFcbiAgICAjIEBvdXRwdXQocGxheWVyLm5hbWUgKyBcIiBqb2lucyBnYW1lIChcIiArIEBwbGF5ZXJzLmxlbmd0aCArIFwiKVwiKVxuXG4gIG5hbWVQcmVzZW50OiAobmFtZSkgLT5cbiAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXG4gICAgICBpZiBwbGF5ZXIubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICBhZGRBSTogLT5cbiAgICBsb29wXG4gICAgICBjaGFyYWN0ZXIgPSByYW5kb21DaGFyYWN0ZXIoKVxuICAgICAgaWYgbm90IEBuYW1lUHJlc2VudChjaGFyYWN0ZXIubmFtZSlcbiAgICAgICAgYnJlYWtcblxuICAgIGFpID1cbiAgICAgIGNoYXJJRDogY2hhcmFjdGVyLmlkXG4gICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZVxuICAgICAgaWQ6ICdhaScgKyBTdHJpbmcoQHBsYXllcnMubGVuZ3RoKVxuICAgICAgYWk6IHRydWVcblxuICAgIEBhZGRQbGF5ZXIoYWkpXG5cbiAgICBAZ2FtZS5sb2coXCJhZGRlZCBBSSBwbGF5ZXJcIilcbiAgICByZXR1cm4gT0tcblxuICBjYW5QbGF5OiAocGFyYW1zKSAtPlxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5UUklDS1xuICAgICAgcmV0dXJuICdub3RJblRyaWNrJ1xuXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcbiAgICBpZiBwYXJhbXMuaWQgIT0gY3VycmVudFBsYXllci5pZFxuICAgICAgcmV0dXJuICdub3RZb3VyVHVybidcblxuICAgIGlmIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnd2hpY2gnKVxuICAgICAgcGFyYW1zLndoaWNoID0gTnVtYmVyKHBhcmFtcy53aGljaClcbiAgICAgIHBhcmFtcy5pbmRleCA9IC0xXG4gICAgICBmb3IgY2FyZCwgaSBpbiBjdXJyZW50UGxheWVyLmhhbmRcbiAgICAgICAgaWYgY2FyZCA9PSBwYXJhbXMud2hpY2hcbiAgICAgICAgICBwYXJhbXMuaW5kZXggPSBpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgaWYgcGFyYW1zLmluZGV4ID09IC0xXG4gICAgICAgIHJldHVybiAnZG9Ob3RIYXZlJ1xuICAgIGVsc2VcbiAgICAgIHBhcmFtcy5pbmRleCA9IE51bWJlcihwYXJhbXMuaW5kZXgpXG5cbiAgICBpZiAocGFyYW1zLmluZGV4IDwgMCkgfHwgKHBhcmFtcy5pbmRleCA+PSBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoKVxuICAgICAgcmV0dXJuICdpbmRleE91dE9mUmFuZ2UnXG5cbiAgICBpZiBAbG93ZXN0UmVxdWlyZWQgJiYgKHBhcmFtcy5pbmRleCAhPSAwKVxuICAgICAgcmV0dXJuICdsb3dlc3RDYXJkUmVxdWlyZWQnXG5cbiAgICBjaG9zZW5DYXJkWCA9IGN1cnJlbnRQbGF5ZXIuaGFuZFtwYXJhbXMuaW5kZXhdXG4gICAgY2hvc2VuQ2FyZCA9IG5ldyBDYXJkKGNob3NlbkNhcmRYKVxuXG4gICAgaWYoKCFAdHJ1bXBCcm9rZW4pICYmICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGF0IHRydW1wIGlzIGJyb2tlblxuICAgIChAcGlsZS5sZW5ndGggPT0gMCkgJiYgICAgICAgICAgICAgICAgICAgIyBiZWZvcmUgYWxsb3dpbmcgc29tZW9uZSB0byBsZWFkXG4gICAgKGNob3NlbkNhcmQuc3VpdCA9PSBTdWl0LlNQQURFUykgJiYgICAgICAjIHdpdGggc3BhZGVzXG4gICAgKCFAcGxheWVySGFzT25seVNwYWRlcyhjdXJyZW50UGxheWVyKSkpICAjIHVubGVzcyBpdCBpcyBhbGwgdGhleSBoYXZlXG4gICAgICByZXR1cm4gJ3RydW1wTm90QnJva2VuJ1xuXG4gICAgYmVzdEluZGV4ID0gQGJlc3RJblBpbGUoKVxuICAgIGZvcmNlZFN1aXQgPSBAY3VycmVudFN1aXQoKVxuICAgIGlmIGZvcmNlZFN1aXQgIT0gU3VpdC5OT05FICMgc2FmZSB0byBhc3N1bWUgKGJlc3RJbmRleCAhPSAtMSkgaW4gdGhpcyBibG9ja1xuICAgICAgaWYgQHBsYXllckhhc1N1aXQoY3VycmVudFBsYXllciwgZm9yY2VkU3VpdClcbiAgICAgICAgIyBZb3UgbXVzdCB0aHJvdyBpbi1zdWl0IGlmIHlvdSBoYXZlIG9uZSBvZiB0aGF0IHN1aXRcbiAgICAgICAgaWYgY2hvc2VuQ2FyZC5zdWl0ICE9IGZvcmNlZFN1aXRcbiAgICAgICAgICByZXR1cm4gJ2ZvcmNlZEluU3VpdCdcblxuICAgICAgICAjIElmIHRoZSBjdXJyZW50IHdpbm5lciBpcyB3aW5uaW5nIGluLXN1aXQsIHlvdSBtdXN0IHRyeSB0byBiZWF0IHRoZW0gaW4tc3VpdFxuICAgICAgICBjdXJyZW50V2lubmluZ0NhcmRYID0gQHBpbGVbYmVzdEluZGV4XVxuICAgICAgICBjdXJyZW50V2lubmluZ0NhcmQgPSBuZXcgQ2FyZChjdXJyZW50V2lubmluZ0NhcmRYKVxuICAgICAgICBpZiBjdXJyZW50V2lubmluZ0NhcmQuc3VpdCA9PSBmb3JjZWRTdWl0XG4gICAgICAgICAgaWYoKCFjYXJkQmVhdHMoY2hvc2VuQ2FyZFgsIGN1cnJlbnRXaW5uaW5nQ2FyZFgsIGZvcmNlZFN1aXQpKSAmJlxuICAgICAgICAgIChAcGxheWVyQ2FuV2luSW5TdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRXaW5uaW5nQ2FyZCkpKVxuICAgICAgICAgICAgcmV0dXJuICdmb3JjZWRIaWdoZXJJblN1aXQnXG4gICAgICBlbHNlXG4gICAgICAgICMgQ3VycmVudCBwbGF5ZXIgZG9lc24ndCBoYXZlIHRoYXQgc3VpdCwgZG9uJ3QgYm90aGVyXG4gICAgICAgIGZvcmNlZFN1aXQgPSBTdWl0Lk5PTkVcblxuICAgIHJldHVybiBPS1xuXG4gIHBsYXk6IChwYXJhbXMpIC0+XG4gICAgY2FuUGxheUNhcmQgPSBAY2FuUGxheShwYXJhbXMpXG4gICAgaWYgY2FuUGxheUNhcmQgIT0gT0tcbiAgICAgIHJldHVybiBjYW5QbGF5Q2FyZFxuXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcblxuICAgIGlmIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnd2hpY2gnKVxuICAgICAgcGFyYW1zLndoaWNoID0gTnVtYmVyKHBhcmFtcy53aGljaClcbiAgICAgIHBhcmFtcy5pbmRleCA9IC0xXG4gICAgICBmb3IgY2FyZCwgaSBpbiBjdXJyZW50UGxheWVyLmhhbmRcbiAgICAgICAgaWYgY2FyZCA9PSBwYXJhbXMud2hpY2hcbiAgICAgICAgICBwYXJhbXMuaW5kZXggPSBpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgaWYgcGFyYW1zLmluZGV4ID09IC0xXG4gICAgICAgIHJldHVybiAnZG9Ob3RIYXZlJ1xuICAgIGVsc2VcbiAgICAgIHBhcmFtcy5pbmRleCA9IE51bWJlcihwYXJhbXMuaW5kZXgpXG5cbiAgICBjaG9zZW5DYXJkWCA9IGN1cnJlbnRQbGF5ZXIuaGFuZFtwYXJhbXMuaW5kZXhdXG4gICAgY2hvc2VuQ2FyZCA9IG5ldyBDYXJkKGNob3NlbkNhcmRYKVxuXG4gICAgIyBJZiB5b3UgZ2V0IGhlcmUsIHlvdSBjYW4gdGhyb3cgd2hhdGV2ZXIgeW91IHdhbnQsIGFuZCBpdFxuICAgICMgd2lsbCBlaXRoZXIgcHV0IHlvdSBpbiB0aGUgbGVhZCwgdHJ1bXAsIG9yIGR1bXAuXG5cbiAgICBAbG93ZXN0UmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgIyBUaHJvdyB0aGUgY2FyZCBvbiB0aGUgcGlsZSwgYWR2YW5jZSB0aGUgdHVyblxuICAgIEBwaWxlLnB1c2goY3VycmVudFBsYXllci5oYW5kW3BhcmFtcy5pbmRleF0pXG4gICAgQHBpbGVXaG8ucHVzaChAdHVybilcbiAgICBjdXJyZW50UGxheWVyLmhhbmQuc3BsaWNlKHBhcmFtcy5pbmRleCwgMSlcblxuICAgICMgUmVjYWxjdWxhdGUgYmVzdCBpbmRleFxuICAgIGJlc3RJbmRleCA9IEBiZXN0SW5QaWxlKClcbiAgICBpZiBiZXN0SW5kZXggPT0gKEBwaWxlLmxlbmd0aCAtIDEpXG4gICAgICAjIFRoZSBjYXJkIHRoaXMgcGxheWVyIGp1c3QgdGhyZXcgaXMgdGhlIGJlc3QgY2FyZC4gQ2xhaW0gdGhlIHRyaWNrLlxuICAgICAgQHRyaWNrVGFrZXIgPSBAdHVyblxuXG4gICAgaWYgQHBpbGUubGVuZ3RoID09IDFcbiAgICAgIG1zZyA9IGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIGxlYWRzIHdpdGggXCIgKyBjaG9zZW5DYXJkLm5hbWVcbiAgICBlbHNlXG4gICAgICBpZiBAdHJpY2tUYWtlciA9PSBAdHVyblxuICAgICAgICBtc2cgPSBjdXJyZW50UGxheWVyLm5hbWUgKyBcIiBjbGFpbXMgdGhlIHRyaWNrIHdpdGggXCIgKyBjaG9zZW5DYXJkLm5hbWVcbiAgICAgIGVsc2VcbiAgICAgICAgbXNnID0gY3VycmVudFBsYXllci5uYW1lICsgXCIgZHVtcHMgXCIgKyBjaG9zZW5DYXJkLm5hbWVcblxuICAgIGlmKCghQHRydW1wQnJva2VuKSAmJiAoY2hvc2VuQ2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKSlcbiAgICAgIG1zZyArPSBcIiAodHJ1bXAgYnJva2VuKVwiXG4gICAgICBAdHJ1bXBCcm9rZW4gPSB0cnVlXG5cbiAgICBAb3V0cHV0KG1zZylcblxuICAgIGlmIEBwaWxlLmxlbmd0aCA9PSBAcGxheWVycy5sZW5ndGhcbiAgICAgIEBlbmRUcmljaygpXG4gICAgZWxzZVxuICAgICAgQHR1cm4gPSBAcGxheWVyQWZ0ZXIoQHR1cm4pXG5cbiAgICByZXR1cm4gT0tcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIEFJXG5cbiAgIyBIZWxwZXIgZnVuY3Rpb24gdG8gYmlkIHJlYXNvbmluZyBmb3IgYmlkZGluZyBpIHRyaWNrc1xuICBhaUxvZ0JpZDogKGksIHdoeSkgLT5cbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXG4gICAgQGFpTG9nKCdwb3RlbnRpYWwgd2lubmVyOiAnICsgY2FyZC5uYW1lICsgJyBbJyArIHdoeSArICddJylcblxuICAjIEhlbHBlciBmdW5jdGlvbiB0byBiaWQgcmVhc29uaW5nIGZvciBwbGF5aW5nIGNhcmQgaW5kZXggaVxuICBhaUxvZ1BsYXk6IChpLCB3aHkpIC0+XG4gICAgaWYgaSA9PSAtMVxuICAgICAgcmV0dXJuXG5cbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXG4gICAgQGFpTG9nKCdiZXN0UGxheTogJyArIGNhcmQubmFtZSArICcgWycgKyB3aHkgKyAnXScpXG5cbiAgIyBBdHRlbXB0cyB0byBiaWQgaSB0cmlja3NcbiAgYWlCaWQ6IChjdXJyZW50UGxheWVyLCBpKSAtPlxuICAgIHJlcGx5ID0gQGJpZCh7J2lkJzpjdXJyZW50UGxheWVyLmlkLCAnYmlkJzppfSlcbiAgICBpZiByZXBseSA9PSBPS1xuICAgICAgQGdhbWUubG9nKFwiQUk6IFwiICsgY3VycmVudFBsYXllci5uYW1lICsgXCIgYmlkcyBcIiArIFN0cmluZyhpKSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgIyBBdHRlbXB0cyB0byBwbGF5IGNhcmQgaW5kZXggaVxuICBhaVBsYXk6IChjdXJyZW50UGxheWVyLCBpKSAtPlxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXG4gICAgIyBAZ2FtZS5sb2cgXCJhaVBsYXk6ICN7aX1cIlxuICAgIHJlcGx5ID0gQHBsYXkoeydpZCc6Y3VycmVudFBsYXllci5pZCwgJ2luZGV4JzppfSlcbiAgICBpZiByZXBseSA9PSBPS1xuICAgICAgQGdhbWUubG9nKFwiQUk6IFwiICsgY3VycmVudFBsYXllci5uYW1lICsgXCIgcGxheXMgXCIgKyBjYXJkLm5hbWUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGlmIHJlcGx5ID09ICdkZWFsZXJGdWNrZWQnXG4gICAgICAgIEBvdXRwdXQoY3VycmVudFBsYXllci5uYW1lICsgJyBzYXlzIFwiSSBoYXRlIGJlaW5nIHRoZSBkZWFsZXIuXCInKVxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgVHJpZXMgdG8gcGxheSBsb3dlc3QgY2FyZHMgZmlyc3QgKG1vdmVzIHJpZ2h0KVxuICBhaVBsYXlMb3c6IChjdXJyZW50UGxheWVyLCBzdGFydGluZ1BvaW50KSAtPlxuICAgIGZvciBpIGluIFtzdGFydGluZ1BvaW50Li4uY3VycmVudFBsYXllci5oYW5kLmxlbmd0aF1cbiAgICAgIGlmIEBhaVBsYXkoY3VycmVudFBsYXllciwgaSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICBmb3IgaSBpbiBbMC4uLnN0YXJ0aW5nUG9pbnRdXG4gICAgICBpZiBAYWlQbGF5KGN1cnJlbnRQbGF5ZXIsIGkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgIyBUcmllcyB0byBwbGF5IGhpZ2hlc3QgY2FyZHMgZmlyc3QgKG1vdmVzIGxlZnQpXG4gIGFpUGxheUhpZ2g6IChjdXJyZW50UGxheWVyLCBzdGFydGluZ1BvaW50KSAtPlxuICAgIGZvciBpIGluIFtzdGFydGluZ1BvaW50Li4wXSBieSAtMVxuICAgICAgaWYoQGFpUGxheShjdXJyZW50UGxheWVyLCBpKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICBmb3IgaSBpbiBbY3VycmVudFBsYXllci5oYW5kLmxlbmd0aC0xLi4uc3RhcnRpbmdQb2ludF0gYnkgLTFcbiAgICAgIGlmIEBhaVBsYXkoY3VycmVudFBsYXllciwgaSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICAjIEdlbmVyaWMgbG9nZ2luZyBmdW5jdGlvbjsgcHJlcGVuZHMgY3VycmVudCBBSSBwbGF5ZXIncyBndXRzIGJlZm9yZSBwcmludGluZyB0ZXh0XG4gIGFpTG9nOiAodGV4dCkgLT5cbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1tjdXJyZW50UGxheWVyLmNoYXJJRF1cbiAgICBAZ2FtZS5sb2coJ0FJWycrY3VycmVudFBsYXllci5uYW1lKycgJytjdXJyZW50UGxheWVyLnRyaWNrcysnLycrY3VycmVudFBsYXllci5iaWQrJyAnK2NoYXJhY3Rlci5icmFpbisnXTogaGFuZDonK3N0cmluZ2lmeUNhcmRzKGN1cnJlbnRQbGF5ZXIuaGFuZCkrJyBwaWxlOicrc3RyaW5naWZ5Q2FyZHMoQHBpbGUpKycgJyt0ZXh0KVxuXG4gICMgRGV0ZWN0cyBpZiB0aGUgY3VycmVudCBwbGF5ZXIgaXMgQUkgZHVyaW5nIGEgQklEIG9yIFRSSUNLIHBoYXNlIGFuZCBhY3RzIGFjY29yZGluZyB0byB0aGVpciAnYnJhaW4nXG4gIGFpVGljazogLT5cbiAgICBpZiAoQHN0YXRlICE9IFN0YXRlLkJJRCkgJiYgKEBzdGF0ZSAhPSBTdGF0ZS5UUklDSylcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcbiAgICBpZiBub3QgY3VycmVudFBsYXllci5haVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgQmlkZGluZ1xuXG4gICAgaWYgQHN0YXRlID09IFN0YXRlLkJJRFxuICAgICAgQGFpTG9nKFwiYWJvdXQgdG8gY2FsbCBicmFpbi5iaWRcIilcbiAgICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1tjdXJyZW50UGxheWVyLmNoYXJJRF1cbiAgICAgIGJpZCA9IEBicmFpbnNbY2hhcmFjdGVyLmJyYWluXS5iaWQuYXBwbHkodGhpcywgW2N1cnJlbnRQbGF5ZXJdKVxuXG4gICAgICAjIFRyeSB0byBiaWQgYXMgY2xvc2UgYXMgeW91IGNhbiB0byB0aGUgJ2Jlc3QgYmlkJ1xuICAgICAgQGFpTG9nKCdiaWQ6JytTdHJpbmcoYmlkKSlcbiAgICAgIGlmIEBhaUJpZChjdXJyZW50UGxheWVyLCBiaWQpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkLTEpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkKzEpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkLTIpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkKzIpXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICMgR2l2ZSB1cCBhbmQgYmlkIHdoYXRldmVyIGlzIGFsbG93ZWRcbiAgICAgIGZvciBpIGluIFswLi4uY3VycmVudFBsYXllci5oYW5kLmxlbmd0aF1cbiAgICAgICAgaWYgQGFpQmlkKGN1cnJlbnRQbGF5ZXIsIGkpXG4gICAgICAgICAgQGFpTG9nKCdnYXZlIHVwIGFuZCBiaWQ6JytTdHJpbmcoaSkpXG4gICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBQbGF5aW5nXG5cbiAgICBpZiBAc3RhdGUgPT0gU3RhdGUuVFJJQ0tcbiAgICAgIEBhaUxvZyhcImFib3V0IHRvIGNhbGwgYnJhaW4ucGxheVwiKVxuICAgICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2N1cnJlbnRQbGF5ZXIuY2hhcklEXVxuICAgICAgcGxheWVkQ2FyZCA9IEBicmFpbnNbY2hhcmFjdGVyLmJyYWluXS5wbGF5LmFwcGx5KHRoaXMsIFtjdXJyZW50UGxheWVyXSlcbiAgICAgIGlmIHBsYXllZENhcmRcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgQGFpTG9nKCdicmFpbiBmYWlsZWQgdG8gcGxheSBjYXJkOiBwaWNraW5nIHJhbmRvbSBjYXJkIHRvIHBsYXknKVxuICAgICAgICBzdGFydGluZ1BvaW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudFBsYXllci5oYW5kLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIEBhaVBsYXlMb3coY3VycmVudFBsYXllciwgc3RhcnRpbmdQb2ludClcblxuICAgIHJldHVybiBmYWxzZVxuXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBBSSBCcmFpbnNcblxuICAjIEJyYWlucyBtdXN0IGhhdmU6XG4gICMgKiBpZDogaW50ZXJuYWwgaWRlbnRpZmllciBmb3IgdGhlIGJyYWluXG4gICMgKiBuYW1lOiBwcmV0dHkgbmFtZVxuICAjICogYmlkKGN1cnJlbnRQbGF5ZXIpIHJldHVybnMgdGhlIGJpZCB2YWx1ZSBiZXR3ZWVuIFswIC0gaGFuZFNpemVdLlxuICAjICogcGxheShjdXJyZW50UGxheWVyKSBhdHRlbXB0cyB0byBwbGF5IGEgY2FyZCBieSBjYWxsaW5nIGFpUGxheSgpLiBTaG91bGQgcmV0dXJuIHRydWUgaWYgaXQgc3VjY2Vzc2Z1bGx5IHBsYXllZCBhIGNhcmQgKGFpUGxheSgpIHJldHVybmVkIHRydWUpXG4gIGJyYWluczpcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBOb3JtYWw6IEludGVuZGVkIHRvIGJlIHVzZWQgYnkgbW9zdCBjaGFyYWN0ZXJzLlxuICAgICMgICAgICAgICBOb3QgdG9vIGR1bWIsIG5vdCB0b28gc21hcnQuXG4gICAgbm9ybWFsOlxuICAgICAgaWQ6ICAgXCJub3JtYWxcIlxuICAgICAgbmFtZTogXCJOb3JtYWxcIlxuXG4gICAgICAjIG5vcm1hbFxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cbiAgICAgICAgIyBDYXJkcyBSZXByZXNlbnRlZCAoaG93IG1hbnkgb3V0IG9mIHRoZSBkZWNrIGFyZSBpbiBwbGF5PylcbiAgICAgICAgaGFuZFNpemUgPSBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoXG4gICAgICAgIGNyID0gQHBsYXllcnMubGVuZ3RoICogaGFuZFNpemVcbiAgICAgICAgI2NycCA9IE1hdGguZmxvb3IoKGNyICogMTAwKSAvIDUyKVxuXG4gICAgICAgIGJpZCA9IDBcbiAgICAgICAgcGFydGlhbFNwYWRlcyA9IDBcbiAgICAgICAgcGFydGlhbEZhY2VzID0gMCAjIG5vbiBzcGFkZSBmYWNlIGNhcmRzXG4gICAgICAgIGZvciB2LCBpIGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxuICAgICAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxuICAgICAgICAgIGlmIGNhcmQuc3VpdCA9PSBTdWl0LlNQQURFU1xuICAgICAgICAgICAgaWYgY3IgPiA0MCAjIEFsbW9zdCBhbGwgY2FyZHMgaW4gcGxheVxuICAgICAgICAgICAgICBpZiBjYXJkLnZhbHVlID49IDYgIyA4UyBvciBoaWdoZXJcbiAgICAgICAgICAgICAgICBiaWQrK1xuICAgICAgICAgICAgICAgIEBhaUxvZ0JpZChpLCAnOFMgb3IgYmlnZ2VyJylcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFydGlhbFNwYWRlcysrXG4gICAgICAgICAgICAgICAgaWYgcGFydGlhbFNwYWRlcyA+IDFcbiAgICAgICAgICAgICAgICAgIGJpZCsrXG4gICAgICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ2EgY291cGxlIG9mIGxvdyBzcGFkZXMnKVxuICAgICAgICAgICAgICAgICAgcGFydGlhbFNwYWRlcyA9IDBcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJpZCsrXG4gICAgICAgICAgICAgIEBhaUxvZ0JpZChpLCAnc3BhZGUnKVxuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIChjYXJkLnZhbHVlID49IDkpICYmIChjYXJkLnZhbHVlIDw9IDExKSAjIEpRSyBvZiBub24gc3BhZGVcbiAgICAgICAgICAgICAgcGFydGlhbEZhY2VzKytcbiAgICAgICAgICAgICAgaWYgcGFydGlhbEZhY2VzID4gMlxuICAgICAgICAgICAgICAgIHBhcnRpYWxGYWNlcyA9IDBcbiAgICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ2EgY291cGxlIEpRSyBub24tc3BhZGVzJylcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgaWYgY3IgPiA0MFxuICAgICAgICAgICAgIyAqIEFjZXMgYW5kIEtpbmdzIGFyZSBwcm9iYWJseSB3aW5uZXJzXG4gICAgICAgICAgICBpZigoY2FyZC52YWx1ZSA+PSAxMSkgJiYgICAjIEFjZSBvciBLaW5nXG4gICAgICAgICAgICAoY2FyZC5zdWl0ICE9IFN1aXQuQ0xVQlMpKSAjIE5vdCBhIGNsdWJcbiAgICAgICAgICAgICAgYmlkKytcbiAgICAgICAgICAgICAgQGFpTG9nQmlkKGksICdub24tY2x1YiBhY2Ugb3Iga2luZycpXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgaWYgaGFuZFNpemUgPj0gNlxuICAgICAgICAgICMgKiBUaGUgQWNlIG9mIGNsdWJzIGlzIGEgd2lubmVyIHVubGVzcyB5b3UgYWxzbyBoYXZlIGEgbG93IGNsdWJcbiAgICAgICAgICBjbHViVmFsdWVzID0gdmFsdWVzT2ZTdWl0KGN1cnJlbnRQbGF5ZXIuaGFuZCwgU3VpdC5DTFVCUylcbiAgICAgICAgICBpZiBjbHViVmFsdWVzLmxlbmd0aCA+IDAgIyBoYXMgY2x1YnNcbiAgICAgICAgICAgIGlmIGNsdWJWYWx1ZXNbY2x1YlZhbHVlcy5sZW5ndGggLSAxXSA9PSAxMiAjIGhhcyBBQ1xuICAgICAgICAgICAgICBpZiBjbHViVmFsdWVzWzBdID4gMCAjIDJDIG5vdCBpbiBoYW5kXG4gICAgICAgICAgICAgICAgYmlkKytcbiAgICAgICAgICAgICAgICBAYWlMb2dCaWQoMCwgJ0FDIHdpdGggbm8gMkMnKVxuXG4gICAgICAgIHJldHVybiBiaWRcblxuICAgICAgIyBub3JtYWxcbiAgICAgIHBsYXk6IChjdXJyZW50UGxheWVyKSAtPlxuICAgICAgICB0cmlja3NOZWVkZWQgPSBjdXJyZW50UGxheWVyLmJpZCAtIGN1cnJlbnRQbGF5ZXIudHJpY2tzXG4gICAgICAgIHdhbnRUb1dpbiA9ICh0cmlja3NOZWVkZWQgPiAwKVxuICAgICAgICBiZXN0UGxheSA9IC0xXG4gICAgICAgIGN1cnJlbnRTdWl0ID0gQGN1cnJlbnRTdWl0KClcbiAgICAgICAgd2lubmluZ0luZGV4ID0gQGJlc3RJblBpbGUoKVxuXG4gICAgICAgIGlmIEBwaWxlLmxlbmd0aCA9PSBAcGxheWVycy5sZW5ndGhcbiAgICAgICAgICBjdXJyZW50U3VpdCA9IFN1aXQuTk9ORVxuICAgICAgICAgIHdpbm5pbmdJbmRleCA9IC0xXG5cbiAgICAgICAgd2lubmluZ0NhcmQgPSBmYWxzZVxuICAgICAgICBpZiB3aW5uaW5nSW5kZXggIT0gLTFcbiAgICAgICAgICB3aW5uaW5nQ2FyZCA9IG5ldyBDYXJkKEBwaWxlW3dpbm5pbmdJbmRleF0pXG5cbiAgICAgICAgaWYgd2FudFRvV2luXG4gICAgICAgICAgaWYgY3VycmVudFN1aXQgPT0gU3VpdC5OT05FICMgQXJlIHlvdSBsZWFkaW5nP1xuICAgICAgICAgICAgIyBMZWFkIHdpdGggeW91ciBoaWdoZXN0IG5vbi1zcGFkZVxuICAgICAgICAgICAgcGxheSA9IGhpZ2hlc3RWYWx1ZU5vblNwYWRlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCBTdWl0Lk5PTkUpXG4gICAgICAgICAgICBAYWlMb2dQbGF5KHBsYXksICdoaWdoZXN0IG5vbi1zcGFkZSAodHJ5aW5nIHRvIHdpbiknKVxuXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxuICAgICAgICAgICAgICAjIE9ubHkgc3BhZGVzIGxlZnQhIFRpbWUgdG8gYmxlZWQgdGhlIHRhYmxlLlxuICAgICAgICAgICAgICBiZXN0UGxheSA9IDBcbiAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2xvd2VzdCBzcGFkZSAodHJ5aW5nIHRvIHdpbiBibGVlZGluZyB0aGUgdGFibGUgZm9yIGEgZnV0dXJlIHdpbiknKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIEBwbGF5ZXJIYXNTdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRTdWl0KSAjIEFyZSB5b3Ugc3R1Y2sgd2l0aCBmb3JjZWQgcGxheT9cbiAgICAgICAgICAgICAgaWYgQHBsYXllckNhbldpbkluU3VpdChjdXJyZW50UGxheWVyLCB3aW5uaW5nQ2FyZCkgIyBDYW4geW91IHdpbj9cbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGhpZ2hlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2hpZ2hlc3QgaW4gc3VpdCAodHJ5aW5nIHRvIHdpbiBmb3JjZWQgaW4gc3VpdCknKVxuICAgICAgICAgICAgICAgIGlmIGJlc3RQbGF5ICE9IC0xXG4gICAgICAgICAgICAgICAgICByZXR1cm4gQGFpUGxheUhpZ2goY3VycmVudFBsYXllciwgYmVzdFBsYXkpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGxvd2VzdEluZGV4SW5TdWl0KGN1cnJlbnRQbGF5ZXIuaGFuZCwgd2lubmluZ0NhcmQuc3VpdClcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnbG93ZXN0IGluIHN1aXQgKHRyeWluZyB0byB3aW4gZm9yY2VkIGluIHN1aXQsIGNhbnQgd2luKScpXG4gICAgICAgICAgICAgICAgaWYgYmVzdFBsYXkgIT0gLTFcbiAgICAgICAgICAgICAgICAgIHJldHVybiBAYWlQbGF5TG93KGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KVxuXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxuICAgICAgICAgICAgICBsYXN0Q2FyZCA9IG5ldyBDYXJkKGN1cnJlbnRQbGF5ZXIuaGFuZFtjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoIC0gMV0pXG4gICAgICAgICAgICAgIGlmIGxhc3RDYXJkLnN1aXQgPT0gU3VpdC5TUEFERVNcbiAgICAgICAgICAgICAgICAjIFRyeSB0byB0cnVtcCwgaGFyZFxuICAgICAgICAgICAgICAgIGJlc3RQbGF5ID0gY3VycmVudFBsYXllci5oYW5kLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAndHJ1bXAgKHRyeWluZyB0byB3aW4pJylcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICMgTm8gbW9yZSBzcGFkZXMgbGVmdCBhbmQgbm9uZSBvZiB0aGlzIHN1aXQuIER1bXAgeW91ciBsb3dlc3QgY2FyZC5cbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGxvd2VzdFZhbHVlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCBTdWl0Lk5PTkUpXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2R1bXAgKHRyeWluZyB0byB3aW4sIHRocm93aW5nIGxvd2VzdCknKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgIyBQbGFuOiBUcnkgdG8gZHVtcCBzb21ldGhpbmcgYXdlc29tZVxuXG4gICAgICAgICAgaWYgY3VycmVudFN1aXQgPT0gU3VpdC5OT05FICMgQXJlIHlvdSBsZWFkaW5nP1xuICAgICAgICAgICAgIyBMZWFkIHdpdGggeW91ciBsb3dlc3QgdmFsdWUgKHRyeSB0byBub3QgdGhyb3cgYSBzcGFkZSBpZiB5b3UgY2FuIGhlbHAgaXQpXG4gICAgICAgICAgICBiZXN0UGxheSA9IGxvd2VzdFZhbHVlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCBTdWl0LlNQQURFUylcbiAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICdsb3dlc3QgdmFsdWUgKHRyeWluZyB0byBsb3NlIGF2b2lkaW5nIHNwYWRlcyknKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIEBwbGF5ZXJIYXNTdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRTdWl0KSAjIEFyZSB5b3Ugc3R1Y2sgd2l0aCBmb3JjZWQgcGxheT9cbiAgICAgICAgICAgICAgaWYgQHBsYXllckNhbldpbkluU3VpdChjdXJyZW50UGxheWVyLCB3aW5uaW5nQ2FyZCkgIyBBcmUgeW91IHN0dWNrIHdpbm5pbmc/XG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBsb3dlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2xvd2VzdCBpbiBzdWl0ICh0cnlpbmcgdG8gbG9zZSBmb3JjZWQgdG8gd2luKScpXG4gICAgICAgICAgICAgICAgaWYgYmVzdFBsYXkgIT0gLTFcbiAgICAgICAgICAgICAgICAgIHJldHVybiBAYWlQbGF5TG93KGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBoaWdoZXN0SW5kZXhJblN1aXQoY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZC5zdWl0KVxuICAgICAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICdoaWdoZXN0IGluIHN1aXQgKHRyeWluZyB0byBsb3NlIGZvcmNlZCBpbiBzdWl0LCBidXQgY2FudCB3aW4pJylcbiAgICAgICAgICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIEBhaVBsYXlIaWdoKGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KVxuXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxuICAgICAgICAgICAgICAjIFRyeSB0byBkdW1wIHlvdXIgaGlnaGVzdCBzcGFkZSwgaWYgeW91IGNhbiB0aHJvdyBhbnl0aGluZ1xuICAgICAgICAgICAgICBpZiAoY3VycmVudFN1aXQgIT0gU3VpdC5TUEFERVMpICYmICh3aW5uaW5nQ2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKVxuICAgICAgICAgICAgICAgICMgQ3VycmVudCB3aW5uZXIgaXMgdHJ1bXBpbmcgdGhlIHN1aXQuIFRocm93IHlvdXIgaGlnaGVzdCBzcGFkZSBsb3dlciB0aGFuIHRoZSB3aW5uZXJcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGhpZ2hlc3RWYWx1ZUluZGV4SW5TdWl0TG93ZXJUaGFuKGN1cnJlbnRQbGF5ZXIuaGFuZCwgd2lubmluZ0NhcmQpXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ3RyeWluZyB0byBsb3NlIGhpZ2hlc3QgZHVtcGFibGUgc3BhZGUnKVxuXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxuICAgICAgICAgICAgICAjIFRyeSB0byBkdW1wIHlvdXIgaGlnaGVzdCBub24tc3BhZGVcbiAgICAgICAgICAgICAgYmVzdFBsYXkgPSBoaWdoZXN0VmFsdWVOb25TcGFkZUluZGV4KGN1cnJlbnRQbGF5ZXIuaGFuZCwgd2lubmluZ0NhcmQuc3VpdClcbiAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ3RyeWluZyB0byBsb3NlIGhpZ2hlc3QgZHVtcGFibGUgbm9uLXNwYWRlJylcblxuICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxuICAgICAgICAgIGlmKEBhaVBsYXkoY3VycmVudFBsYXllciwgYmVzdFBsYXkpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAYWlMb2coJ25vdCBhbGxvd2VkIHRvIHBsYXkgbXkgYmVzdCBwbGF5JylcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBDaGFvczogQ29tcGxldGVseSByYW5kb20uIFByb2JhYmx5IGF3ZnVsIHRvIHBsYXkgYWdhaW5zdC5cbiAgICBjaGFvczpcbiAgICAgIGlkOiAgIFwiY2hhb3NcIlxuICAgICAgbmFtZTogXCJDaGFvc1wiXG5cbiAgICAgICMgY2hhb3NcbiAgICAgIGJpZDogKGN1cnJlbnRQbGF5ZXIpIC0+XG4gICAgICAgICMgcGljayBhIGJpZCBzb21ld2hlcmUgaW4gdGhlIGZpcnN0IDUwJVxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudFBsYXllci5oYW5kLmxlbmd0aCAqIDAuNSlcblxuICAgICAgIyBjaGFvc1xuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XG4gICAgICAgIGxlZ2FsSW5kaWNlcyA9IFtdXG4gICAgICAgIGZvciB2LCBpIGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxuICAgICAgICAgIGNhblBsYXlDYXJkID0gQGNhblBsYXkoeyBpZDogY3VycmVudFBsYXllci5pZCwgaW5kZXg6IGkgfSlcbiAgICAgICAgICBpZiBjYW5QbGF5Q2FyZCA9PSBPS1xuICAgICAgICAgICAgbGVnYWxJbmRpY2VzLnB1c2ggaVxuICAgICAgICAgICMgZWxzZVxuICAgICAgICAgICMgICBAYWlMb2cgXCJjYW5QbGF5Q2FyZCAje2l9IHJldHVybmVkICN7Y2FuUGxheUNhcmR9XCJcbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsZWdhbEluZGljZXMubGVuZ3RoKVxuICAgICAgICBAYWlMb2cgXCJsZWdhbCBpbmRpY2VzOiAje0pTT04uc3RyaW5naWZ5KGxlZ2FsSW5kaWNlcyl9LCBjaG9vc2luZyBpbmRleCAje2xlZ2FsSW5kaWNlc1tyYW5kb21JbmRleF19XCJcbiAgICAgICAgcmV0dXJuIEBhaVBsYXkoY3VycmVudFBsYXllciwgbGVnYWxJbmRpY2VzW3JhbmRvbUluZGV4XSlcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBDb25zZXJ2YXRpdmUgTW9yb246IEJpZHMgc3BhZGUgY291bnQsIGFuZCBwbGF5cyBsb3cgY2FyZHMuXG4gICAgY29uc2VydmF0aXZlTW9yb246XG4gICAgICBpZDogICBcImNvbnNlcnZhdGl2ZU1vcm9uXCJcbiAgICAgIG5hbWU6IFwiQ29uc2VydmF0aXZlIE1vcm9uXCJcblxuICAgICAgIyBjb25zZXJ2YXRpdmVNb3JvblxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cbiAgICAgICAgYmlkID0gMFxuICAgICAgICBmb3IgdiBpbiBjdXJyZW50UGxheWVyLmhhbmRcbiAgICAgICAgICBjYXJkID0gbmV3IENhcmQodilcbiAgICAgICAgICBiaWQrKyBpZiBjYXJkLnN1aXQgPT0gU3VpdC5TUEFERVNcbiAgICAgICAgQGFpTG9nIFwiSSBhbSBhIG1vcm9uIGFuZCBJIGhhdmUgI3tiaWR9IHNwYWRlcy4gTGV0J3Mgcm9sbCB3aXRoIGl0LlwiXG4gICAgICAgIHJldHVybiBiaWRcblxuICAgICAgIyBjb25zZXJ2YXRpdmVNb3JvblxuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XG4gICAgICAgIEBhaUxvZyBcInBsYXlpbmcgbG93ZXN0IHBvc3NpYmxlIGNhcmRcIlxuICAgICAgICByZXR1cm4gQGFpUGxheUxvdyhjdXJyZW50UGxheWVyLCAwKVxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjIEFnZ3Jlc3NpdmUgTW9yb246IEJpZHMgc3BhZGVzIGFuZCBhY2VzLCBhbmQgcGxheXMgaGlnaCBjYXJkcy5cbiAgICBhZ2dyZXNzaXZlTW9yb246XG4gICAgICBpZDogICBcImFnZ3Jlc3NpdmVNb3JvblwiXG4gICAgICBuYW1lOiBcIkFnZ3Jlc3NpdmUgTW9yb25cIlxuXG4gICAgICAjIGFnZ3Jlc3NpdmVNb3JvblxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cbiAgICAgICAgYmlkID0gMFxuICAgICAgICBmb3IgdiBpbiBjdXJyZW50UGxheWVyLmhhbmRcbiAgICAgICAgICBjYXJkID0gbmV3IENhcmQodilcbiAgICAgICAgICBiaWQrKyBpZiAoY2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKSBvciAoY2FyZC52YWx1ZSA9PSAxMilcbiAgICAgICAgQGFpTG9nIFwiSSBhbSBhIG1vcm9uIGFuZCBJIGhhdmUgI3tiaWR9IHNwYWRlcyBhbmQvb3IgYWNlcy4gRmFydC5cIlxuICAgICAgICByZXR1cm4gYmlkXG5cbiAgICAgICMgYWdncmVzc2l2ZU1vcm9uXG4gICAgICBwbGF5OiAoY3VycmVudFBsYXllcikgLT5cbiAgICAgICAgQGFpTG9nIFwicGxheWluZyBoaWdoZXN0IHBvc3NpYmxlIGNhcmRcIlxuICAgICAgICByZXR1cm4gQGFpUGxheUhpZ2goY3VycmVudFBsYXllciwgY3VycmVudFBsYXllci5oYW5kLmxlbmd0aCAtIDEpXG5cbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEFJIGNhcmQgaGVscGVyc1xuXG52YWx1ZXNPZlN1aXQgPSAoaGFuZCwgc3VpdCkgLT5cbiAgdmFsdWVzID0gW11cbiAgZm9yIHYgaW4gaGFuZFxuICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxuICAgIGlmIGNhcmQuc3VpdCA9PSBzdWl0XG4gICAgICB2YWx1ZXMucHVzaChjYXJkLnZhbHVlKVxuICByZXR1cm4gdmFsdWVzXG5cbnN0cmluZ2lmeUNhcmRzID0gKGNhcmRzKSAtPlxuICB0ID0gJydcbiAgZm9yIHYgaW4gY2FyZHNcbiAgICBjYXJkID0gbmV3IENhcmQodilcbiAgICBpZih0KVxuICAgICAgdCArPSAnLCdcbiAgICB0ICs9IGNhcmQubmFtZVxuXG4gIHJldHVybiAnWycrdCsnXSdcblxubG93ZXN0SW5kZXhJblN1aXQgPSAoaGFuZCwgc3VpdCkgLT5cbiAgZm9yIHYsaSBpbiBoYW5kXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXG4gICAgaWYgY2FyZC5zdWl0ID09IHN1aXRcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxuXG5oaWdoZXN0SW5kZXhJblN1aXQgPSAoaGFuZCwgc3VpdCkgLT5cbiAgZm9yIHYsaSBpbiBoYW5kIGJ5IC0xXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXG4gICAgaWYgY2FyZC5zdWl0ID09IHN1aXRcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxuXG5sb3dlc3RWYWx1ZUluZGV4ID0gKGhhbmQsIGF2b2lkU3VpdCkgLT4gIyB1c2UgU3VpdC5OT05FIHRvIHJldHVybiBhbnkgc3VpdFxuICBjYXJkID0gbmV3IENhcmQoaGFuZFswXSlcbiAgbG93ZXN0SW5kZXggPSAwXG4gIGxvd2VzdFZhbHVlID0gY2FyZC52YWx1ZVxuICBmb3IgaSBpbiBbMS4uLmhhbmQubGVuZ3RoXVxuICAgIGNhcmQgPSBuZXcgQ2FyZChoYW5kW2ldKVxuICAgIGlmIGNhcmQuc3VpdCAhPSBhdm9pZFN1aXRcbiAgICAgIGlmIGNhcmQudmFsdWUgPCBsb3dlc3RWYWx1ZVxuICAgICAgICBsb3dlc3RWYWx1ZSA9IGNhcmQudmFsdWVcbiAgICAgICAgbG93ZXN0SW5kZXggPSBpXG4gIHJldHVybiBsb3dlc3RJbmRleFxuXG5oaWdoZXN0VmFsdWVOb25TcGFkZUluZGV4ID0gKGhhbmQsIGF2b2lkU3VpdCkgLT5cbiAgaGlnaGVzdEluZGV4ID0gLTFcbiAgaGlnaGVzdFZhbHVlID0gLTFcbiAgZm9yIGkgaW4gW2hhbmQubGVuZ3RoLTEuLjBdIGJ5IC0xXG4gICAgY2FyZCA9IG5ldyBDYXJkKGhhbmRbaV0pXG4gICAgaWYgKGNhcmQuc3VpdCAhPSBhdm9pZFN1aXQpICYmIChjYXJkLnN1aXQgIT0gU3VpdC5TUEFERVMpXG4gICAgICBpZiBjYXJkLnZhbHVlID4gaGlnaGVzdFZhbHVlXG4gICAgICAgIGhpZ2hlc3RWYWx1ZSA9IGNhcmQudmFsdWVcbiAgICAgICAgaGlnaGVzdEluZGV4ID0gaVxuICByZXR1cm4gaGlnaGVzdEluZGV4XG5cbmhpZ2hlc3RWYWx1ZUluZGV4SW5TdWl0TG93ZXJUaGFuID0gKGhhbmQsIHdpbm5pbmdDYXJkKSAtPlxuICBmb3IgaSBpbiBbaGFuZC5sZW5ndGgtMS4uMF0gYnkgLTFcbiAgICBjYXJkID0gbmV3IENhcmQoaGFuZFtpXSlcbiAgICBpZiAoY2FyZC5zdWl0ID09IHdpbm5pbmdDYXJkLnN1aXQpICYmIChjYXJkLnZhbHVlIDwgd2lubmluZ0NhcmQudmFsdWUpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgRXhwb3J0c1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIENhcmQ6IENhcmRcbiAgQmxhY2tvdXQ6IEJsYWNrb3V0XG4gIFN0YXRlOiBTdGF0ZVxuICBPSzogT0tcbiAgYWlDaGFyYWN0ZXJzOiBhaUNoYXJhY3RlcnNcblxuIiwiQW5pbWF0aW9uID0gcmVxdWlyZSAnLi9BbmltYXRpb24nXG5cbmNsYXNzIEJ1dHRvblxuICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAc3ByaXRlTmFtZXMsIEBmb250LCBAdGV4dEhlaWdodCwgQHgsIEB5LCBAY2IpIC0+XG4gICAgQGFuaW0gPSBuZXcgQW5pbWF0aW9uIHtcbiAgICAgIHNwZWVkOiB7IHM6IDMgfVxuICAgICAgczogMFxuICAgIH1cbiAgICBAY29sb3IgPSB7IHI6IDEsIGc6IDEsIGI6IDEsIGE6IDAgfVxuXG4gIHVwZGF0ZTogKGR0KSAtPlxuICAgIHJldHVybiBAYW5pbS51cGRhdGUoZHQpXG5cbiAgcmVuZGVyOiAtPlxuICAgIEBjb2xvci5hID0gQGFuaW0uY3VyLnNcbiAgICBAZ2FtZS5zcHJpdGVSZW5kZXJlci5yZW5kZXIgQHNwcml0ZU5hbWVzWzBdLCBAeCwgQHksIDAsIEB0ZXh0SGVpZ2h0ICogMS41LCAwLCAwLjUsIDAuNSwgQGdhbWUuY29sb3JzLndoaXRlLCA9PlxuICAgICAgIyBwdWxzZSBidXR0b24gYW5pbSxcbiAgICAgIEBhbmltLmN1ci5zID0gMVxuICAgICAgQGFuaW0ucmVxLnMgPSAwXG4gICAgICAjIHRoZW4gY2FsbCBjYWxsYmFja1xuICAgICAgQGNiKHRydWUpXG4gICAgQGdhbWUuc3ByaXRlUmVuZGVyZXIucmVuZGVyIEBzcHJpdGVOYW1lc1sxXSwgQHgsIEB5LCAwLCBAdGV4dEhlaWdodCAqIDEuNSwgMCwgMC41LCAwLjUsIEBjb2xvclxuICAgIHRleHQgPSBAY2IoZmFsc2UpXG4gICAgQGdhbWUuZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgQHRleHRIZWlnaHQsIHRleHQsIEB4LCBAeSwgMC41LCAwLjUsIEBnYW1lLmNvbG9ycy5idXR0b250ZXh0XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uXG4iLCJmb250bWV0cmljcyA9IHJlcXVpcmUgJy4vZm9udG1ldHJpY3MnXG5cbiMgdGFrZW4gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MjM4MzgvcmdiLXRvLWhleC1hbmQtaGV4LXRvLXJnYlxuaGV4VG9SZ2IgPSAoaGV4LCBhKSAtPlxuICAgIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpXG4gICAgcmV0dXJuIG51bGwgaWYgbm90IHJlc3VsdFxuICAgIHJldHVybiB7XG4gICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpIC8gMjU1LFxuICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSAvIDI1NSxcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNikgLyAyNTVcbiAgICAgICAgYTogYVxuICAgIH1cblxuY2xhc3MgRm9udFJlbmRlcmVyXG4gIGNvbnN0cnVjdG9yOiAgKEBnYW1lKSAtPlxuICAgIEB3aGl0ZSA9IHsgcjogMSwgZzogMSwgYjogMSwgYTogMSB9XG5cbiAgc2l6ZTogKGZvbnQsIGhlaWdodCwgc3RyKSAtPlxuICAgIG1ldHJpY3MgPSBmb250bWV0cmljc1tmb250XVxuICAgIHJldHVybiBpZiBub3QgbWV0cmljc1xuICAgIHNjYWxlID0gaGVpZ2h0IC8gbWV0cmljcy5oZWlnaHRcblxuICAgIHRvdGFsV2lkdGggPSAwXG4gICAgdG90YWxIZWlnaHQgPSBtZXRyaWNzLmhlaWdodCAqIHNjYWxlXG4gICAgZm9yIGNoLCBpIGluIHN0clxuICAgICAgY29kZSA9IGNoLmNoYXJDb2RlQXQoMClcbiAgICAgIGdseXBoID0gbWV0cmljcy5nbHlwaHNbY29kZV1cbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBnbHlwaFxuICAgICAgdG90YWxXaWR0aCArPSBnbHlwaC54YWR2YW5jZSAqIHNjYWxlXG5cbiAgICByZXR1cm4ge1xuICAgICAgdzogdG90YWxXaWR0aFxuICAgICAgaDogdG90YWxIZWlnaHRcbiAgICB9XG5cbiAgcmVuZGVyOiAoZm9udCwgaGVpZ2h0LCBzdHIsIHgsIHksIGFuY2hvcngsIGFuY2hvcnksIGNvbG9yLCBjYikgLT5cbiAgICBtZXRyaWNzID0gZm9udG1ldHJpY3NbZm9udF1cbiAgICByZXR1cm4gaWYgbm90IG1ldHJpY3NcbiAgICBzY2FsZSA9IGhlaWdodCAvIG1ldHJpY3MuaGVpZ2h0XG5cbiAgICB0b3RhbFdpZHRoID0gMFxuICAgIHRvdGFsSGVpZ2h0ID0gbWV0cmljcy5oZWlnaHQgKiBzY2FsZVxuICAgIHNraXBDb2xvciA9IGZhbHNlXG4gICAgZm9yIGNoLCBpIGluIHN0clxuICAgICAgaWYgY2ggPT0gJ2AnXG4gICAgICAgIHNraXBDb2xvciA9ICFza2lwQ29sb3JcbiAgICAgIGNvbnRpbnVlIGlmIHNraXBDb2xvclxuICAgICAgY29kZSA9IGNoLmNoYXJDb2RlQXQoMClcbiAgICAgIGdseXBoID0gbWV0cmljcy5nbHlwaHNbY29kZV1cbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBnbHlwaFxuICAgICAgdG90YWxXaWR0aCArPSBnbHlwaC54YWR2YW5jZSAqIHNjYWxlXG5cbiAgICBhbmNob3JPZmZzZXRYID0gLTEgKiBhbmNob3J4ICogdG90YWxXaWR0aFxuICAgIGFuY2hvck9mZnNldFkgPSAtMSAqIGFuY2hvcnkgKiB0b3RhbEhlaWdodFxuICAgIGN1cnJYID0geFxuXG4gICAgaWYgY29sb3JcbiAgICAgIHN0YXJ0aW5nQ29sb3IgPSBjb2xvclxuICAgIGVsc2VcbiAgICAgIHN0YXJ0aW5nQ29sb3IgPSBAd2hpdGVcbiAgICBjdXJyZW50Q29sb3IgPSBzdGFydGluZ0NvbG9yXG5cbiAgICBjb2xvclN0YXJ0ID0gLTFcbiAgICBmb3IgY2gsIGkgaW4gc3RyXG4gICAgICBpZiBjaCA9PSAnYCdcbiAgICAgICAgaWYgY29sb3JTdGFydCA9PSAtMVxuICAgICAgICAgIGNvbG9yU3RhcnQgPSBpICsgMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbGVuID0gaSAtIGNvbG9yU3RhcnRcbiAgICAgICAgICBpZiBsZW5cbiAgICAgICAgICAgIGN1cnJlbnRDb2xvciA9IGhleFRvUmdiKHN0ci5zdWJzdHIoY29sb3JTdGFydCwgaSAtIGNvbG9yU3RhcnQpLCBzdGFydGluZ0NvbG9yLmEpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3VycmVudENvbG9yID0gc3RhcnRpbmdDb2xvclxuICAgICAgICAgIGNvbG9yU3RhcnQgPSAtMVxuXG4gICAgICBjb250aW51ZSBpZiBjb2xvclN0YXJ0ICE9IC0xXG4gICAgICBjb2RlID0gY2guY2hhckNvZGVBdCgwKVxuICAgICAgZ2x5cGggPSBtZXRyaWNzLmdseXBoc1tjb2RlXVxuICAgICAgY29udGludWUgaWYgbm90IGdseXBoXG4gICAgICBAZ2FtZS5kcmF3SW1hZ2UgZm9udCxcbiAgICAgIGdseXBoLngsIGdseXBoLnksIGdseXBoLndpZHRoLCBnbHlwaC5oZWlnaHQsXG4gICAgICBjdXJyWCArIChnbHlwaC54b2Zmc2V0ICogc2NhbGUpICsgYW5jaG9yT2Zmc2V0WCwgeSArIChnbHlwaC55b2Zmc2V0ICogc2NhbGUpICsgYW5jaG9yT2Zmc2V0WSwgZ2x5cGgud2lkdGggKiBzY2FsZSwgZ2x5cGguaGVpZ2h0ICogc2NhbGUsXG4gICAgICAwLCAwLCAwLFxuICAgICAgY3VycmVudENvbG9yLnIsIGN1cnJlbnRDb2xvci5nLCBjdXJyZW50Q29sb3IuYiwgY3VycmVudENvbG9yLmEsIGNiXG4gICAgICBjdXJyWCArPSBnbHlwaC54YWR2YW5jZSAqIHNjYWxlXG5cbm1vZHVsZS5leHBvcnRzID0gRm9udFJlbmRlcmVyXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcbkJ1dHRvbiA9IHJlcXVpcmUgJy4vQnV0dG9uJ1xuRm9udFJlbmRlcmVyID0gcmVxdWlyZSAnLi9Gb250UmVuZGVyZXInXG5TcHJpdGVSZW5kZXJlciA9IHJlcXVpcmUgJy4vU3ByaXRlUmVuZGVyZXInXG5NZW51ID0gcmVxdWlyZSAnLi9NZW51J1xuSGFuZCA9IHJlcXVpcmUgJy4vSGFuZCdcblBpbGUgPSByZXF1aXJlICcuL1BpbGUnXG57QmxhY2tvdXQsIFN0YXRlLCBPSywgYWlDaGFyYWN0ZXJzfSA9IHJlcXVpcmUgJy4vQmxhY2tvdXQnXG5cbiMgdGVtcFxuQlVJTERfVElNRVNUQU1QID0gXCIwLjAuMVwiXG5cbmNsYXNzIEdhbWVcbiAgY29uc3RydWN0b3I6IChAbmF0aXZlLCBAd2lkdGgsIEBoZWlnaHQpIC0+XG4gICAgQHZlcnNpb24gPSBCVUlMRF9USU1FU1RBTVBcbiAgICBAbG9nKFwiR2FtZSBjb25zdHJ1Y3RlZDogI3tAd2lkdGh9eCN7QGhlaWdodH1cIilcbiAgICBAZm9udFJlbmRlcmVyID0gbmV3IEZvbnRSZW5kZXJlciB0aGlzXG4gICAgQHNwcml0ZVJlbmRlcmVyID0gbmV3IFNwcml0ZVJlbmRlcmVyIHRoaXNcbiAgICBAZm9udCA9IFwiZGFya2ZvcmVzdFwiXG4gICAgQHpvbmVzID0gW11cbiAgICBAbmV4dEFJVGljayA9IDEwMDAgIyB3aWxsIGJlIHNldCBieSBvcHRpb25zXG4gICAgQGNlbnRlciA9XG4gICAgICB4OiBAd2lkdGggLyAyXG4gICAgICB5OiBAaGVpZ2h0IC8gMlxuICAgIEBhYUhlaWdodCA9IEB3aWR0aCAqIDkgLyAxNlxuICAgIEBsb2cgXCJoZWlnaHQ6ICN7QGhlaWdodH0uIGhlaWdodCBpZiBzY3JlZW4gd2FzIDE2OjkgKGFzcGVjdCBhZGp1c3RlZCk6ICN7QGFhSGVpZ2h0fVwiXG4gICAgQHBhdXNlQnV0dG9uU2l6ZSA9IEBhYUhlaWdodCAvIDE1XG4gICAgQGNvbG9ycyA9XG4gICAgICB3aGl0ZTogICAgICB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XG4gICAgICBibGFjazogICAgICB7IHI6ICAgMCwgZzogICAwLCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICByZWQ6ICAgICAgICB7IHI6ICAgMSwgZzogICAwLCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICBvcmFuZ2U6ICAgICB7IHI6ICAgMSwgZzogMC41LCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICBnb2xkOiAgICAgICB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICBidXR0b250ZXh0OiB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XG4gICAgICBsaWdodGdyYXk6ICB7IHI6IDAuNSwgZzogMC41LCBiOiAwLjUsIGE6ICAgMSB9XG4gICAgICBiYWNrZ3JvdW5kOiB7IHI6ICAgMCwgZzogMC4yLCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICBsb2diZzogICAgICB7IHI6IDAuMSwgZzogICAwLCBiOiAgIDAsIGE6ICAgMSB9XG4gICAgICBhcnJvdzogICAgICB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XG4gICAgICBhcnJvd2Nsb3NlOiB7IHI6ICAgMSwgZzogMC41LCBiOiAgIDAsIGE6IDAuMyB9XG4gICAgICBoYW5kYXJlYTogICB7IHI6ICAgMCwgZzogMC4xLCBiOiAgIDAsIGE6IDEuMCB9XG4gICAgICBvdmVybGF5OiAgICB7IHI6ICAgMCwgZzogICAwLCBiOiAgIDAsIGE6IDAuNiB9XG4gICAgICBtYWlubWVudTogICB7IHI6IDAuMSwgZzogMC4xLCBiOiAwLjEsIGE6ICAgMSB9XG4gICAgICBwYXVzZW1lbnU6ICB7IHI6IDAuMSwgZzogMC4wLCBiOiAwLjEsIGE6ICAgMSB9XG4gICAgICBiaWQ6ICAgICAgICB7IHI6ICAgMCwgZzogMC42LCBiOiAgIDAsIGE6ICAgMSB9XG5cbiAgICBAdGV4dHVyZXMgPVxuICAgICAgXCJjYXJkc1wiOiAwXG4gICAgICBcImRhcmtmb3Jlc3RcIjogMVxuICAgICAgXCJjaGFyc1wiOiAyXG4gICAgICBcImhvd3RvMVwiOiAzXG4gICAgICBcImhvd3RvMlwiOiA0XG4gICAgICBcImhvd3RvM1wiOiA1XG5cbiAgICBAYmxhY2tvdXQgPSBudWxsICMgZG9uJ3Qgc3RhcnQgaW4gYSBnYW1lXG4gICAgQGxhc3RFcnIgPSAnJ1xuICAgIEBwYXVzZWQgPSBmYWxzZVxuICAgIEBob3d0byA9IDBcbiAgICBAcmVuZGVyQ29tbWFuZHMgPSBbXVxuXG4gICAgQGJpZCA9IDBcbiAgICBAYmlkQnV0dG9uU2l6ZSA9IEBhYUhlaWdodCAvIDhcbiAgICBAYmlkVGV4dFNpemUgPSBAYWFIZWlnaHQgLyA2XG4gICAgYmlkQnV0dG9uRGlzdGFuY2UgPSBAYmlkQnV0dG9uU2l6ZSAqIDNcbiAgICBAYmlkQnV0dG9uWSA9IEBjZW50ZXIueSAtIChAYmlkQnV0dG9uU2l6ZSlcbiAgICBAYmlkVUkgPSAjKEBnYW1lLCBAc3ByaXRlTmFtZXMsIEBmb250LCBAdGV4dEhlaWdodCwgQHgsIEB5LCBAdGV4dCwgQGNiKVxuICAgICAgbWludXM6IG5ldyBCdXR0b24gdGhpcywgWydtaW51czAnLCAnbWludXMxJ10sIEBmb250LCBAYmlkQnV0dG9uU2l6ZSwgQGNlbnRlci54IC0gYmlkQnV0dG9uRGlzdGFuY2UsIEBiaWRCdXR0b25ZLCAoY2xpY2spID0+XG4gICAgICAgIGlmIGNsaWNrXG4gICAgICAgICAgQGFkanVzdEJpZCgtMSlcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICBwbHVzOiAgbmV3IEJ1dHRvbiB0aGlzLCBbJ3BsdXMwJywgJ3BsdXMxJ10sICAgQGZvbnQsIEBiaWRCdXR0b25TaXplLCBAY2VudGVyLnggKyBiaWRCdXR0b25EaXN0YW5jZSwgQGJpZEJ1dHRvblksIChjbGljaykgPT5cbiAgICAgICAgaWYgY2xpY2tcbiAgICAgICAgICBAYWRqdXN0QmlkKDEpXG4gICAgICAgIHJldHVybiAnJ1xuXG4gICAgQG9wdGlvbk1lbnVzID1cbiAgICAgIHJvdW5kczogW1xuICAgICAgICB7IHRleHQ6IFwiOCByb3VuZHMgb2YgMTNcIiwgZGF0YTogXCIxM3wxM3wxM3wxM3wxM3wxM3wxM3wxM1wiIH1cbiAgICAgICAgeyB0ZXh0OiBcIjQgcm91bmRzIG9mIDEzXCIsIGRhdGE6IFwiMTN8MTN8MTN8MTNcIiB9XG4gICAgICAgIHsgdGV4dDogXCIzIHRvIDEzXCIsIGRhdGE6IFwiM3w0fDV8Nnw3fDh8OXwxMHwxMXwxMnwxM1wiIH1cbiAgICAgICAgeyB0ZXh0OiBcIjMgdG8gMTMgYnkgb2Rkc1wiLCBkYXRhOiBcIjN8NXw3fDl8MTF8MTNcIiB9XG4gICAgICAgIHsgdGV4dDogXCJNYXJhdGhvblwiLCBkYXRhOiBcIk1cIiB9XG4gICAgICBdXG4gICAgICBzcGVlZHM6IFtcbiAgICAgICAgeyB0ZXh0OiBcIkFJIFNwZWVkOiBTbG93XCIsIHNwZWVkOiAyMDAwIH1cbiAgICAgICAgeyB0ZXh0OiBcIkFJIFNwZWVkOiBNZWRpdW1cIiwgc3BlZWQ6IDEwMDAgfVxuICAgICAgICB7IHRleHQ6IFwiQUkgU3BlZWQ6IEZhc3RcIiwgc3BlZWQ6IDUwMCB9XG4gICAgICAgIHsgdGV4dDogXCJBSSBTcGVlZDogVWx0cmFcIiwgc3BlZWQ6IDI1MCB9XG4gICAgICBdXG4gICAgQG9wdGlvbnMgPVxuICAgICAgcGxheWVyczogNFxuICAgICAgcm91bmRJbmRleDogMFxuICAgICAgc3BlZWRJbmRleDogMVxuICAgICAgc291bmQ6IHRydWVcblxuICAgIEBtYWluTWVudSA9IG5ldyBNZW51IHRoaXMsIFwiQmxhY2tvdXQhXCIsIFwic29saWRcIiwgQGNvbG9ycy5tYWlubWVudSwgW1xuICAgICAgKGNsaWNrKSA9PlxuICAgICAgICBpZiBjbGlja1xuICAgICAgICAgIEBob3d0byA9IDFcbiAgICAgICAgcmV0dXJuIFwiSG93IFRvIFBsYXlcIlxuICAgICAgKGNsaWNrKSA9PlxuICAgICAgICBpZiBjbGlja1xuICAgICAgICAgIEBvcHRpb25zLnJvdW5kSW5kZXggPSAoQG9wdGlvbnMucm91bmRJbmRleCArIDEpICUgQG9wdGlvbk1lbnVzLnJvdW5kcy5sZW5ndGhcbiAgICAgICAgcmV0dXJuIEBvcHRpb25NZW51cy5yb3VuZHNbQG9wdGlvbnMucm91bmRJbmRleF0udGV4dFxuICAgICAgKGNsaWNrKSA9PlxuICAgICAgICBpZiBjbGlja1xuICAgICAgICAgIEBvcHRpb25zLnBsYXllcnMrK1xuICAgICAgICAgIGlmIEBvcHRpb25zLnBsYXllcnMgPiA0XG4gICAgICAgICAgICBAb3B0aW9ucy5wbGF5ZXJzID0gM1xuICAgICAgICByZXR1cm4gXCIje0BvcHRpb25zLnBsYXllcnN9IFBsYXllcnNcIlxuICAgICAgKGNsaWNrKSA9PlxuICAgICAgICBpZiBjbGlja1xuICAgICAgICAgIEBvcHRpb25zLnNwZWVkSW5kZXggPSAoQG9wdGlvbnMuc3BlZWRJbmRleCArIDEpICUgQG9wdGlvbk1lbnVzLnNwZWVkcy5sZW5ndGhcbiAgICAgICAgcmV0dXJuIEBvcHRpb25NZW51cy5zcGVlZHNbQG9wdGlvbnMuc3BlZWRJbmRleF0udGV4dFxuICAgICAgIyAoY2xpY2spID0+XG4gICAgICAjICAgaWYgY2xpY2tcbiAgICAgICMgICAgIEBvcHRpb25zLnNvdW5kID0gIUBvcHRpb25zLnNvdW5kXG4gICAgICAjICAgcmV0dXJuIFwiU291bmQ6ICN7aWYgQG9wdGlvbnMuc291bmQgdGhlbiBcIkVuYWJsZWRcIiBlbHNlIFwiRGlzYWJsZWRcIn1cIlxuICAgICAgKGNsaWNrKSA9PlxuICAgICAgICBpZiBjbGlja1xuICAgICAgICAgIEBuZXdHYW1lKClcbiAgICAgICAgcmV0dXJuIFwiU3RhcnRcIlxuICAgIF1cblxuICAgIEBwYXVzZU1lbnUgPSBuZXcgTWVudSB0aGlzLCBcIlBhdXNlZFwiLCBcInNvbGlkXCIsIEBjb2xvcnMucGF1c2VtZW51LCBbXG4gICAgICAoY2xpY2spID0+XG4gICAgICAgIGlmIGNsaWNrXG4gICAgICAgICAgQHBhdXNlZCA9IGZhbHNlXG4gICAgICAgIHJldHVybiBcIlJlc3VtZSBHYW1lXCJcbiAgICAgIChjbGljaykgPT5cbiAgICAgICAgaWYgY2xpY2tcbiAgICAgICAgICBAaG93dG8gPSAxXG4gICAgICAgIHJldHVybiBcIkhvdyBUbyBQbGF5XCJcbiAgICAgIChjbGljaykgPT5cbiAgICAgICAgaWYgY2xpY2tcbiAgICAgICAgICBAb3B0aW9ucy5zcGVlZEluZGV4ID0gKEBvcHRpb25zLnNwZWVkSW5kZXggKyAxKSAlIEBvcHRpb25NZW51cy5zcGVlZHMubGVuZ3RoXG4gICAgICAgIHJldHVybiBAb3B0aW9uTWVudXMuc3BlZWRzW0BvcHRpb25zLnNwZWVkSW5kZXhdLnRleHRcbiAgICAgICMgKGNsaWNrKSA9PlxuICAgICAgIyAgIGlmIGNsaWNrXG4gICAgICAjICAgICBAb3B0aW9ucy5zb3VuZCA9ICFAb3B0aW9ucy5zb3VuZFxuICAgICAgIyAgIHJldHVybiBcIlNvdW5kOiAje2lmIEBvcHRpb25zLnNvdW5kIHRoZW4gXCJFbmFibGVkXCIgZWxzZSBcIkRpc2FibGVkXCJ9XCJcbiAgICAgIChjbGljaykgPT5cbiAgICAgICAgaWYgY2xpY2tcbiAgICAgICAgICBAYmxhY2tvdXQgPSBudWxsXG4gICAgICAgICAgQHBhdXNlZCA9IGZhbHNlXG4gICAgICAgIHJldHVybiBcIlF1aXQgR2FtZVwiXG4gICAgXVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBsb2dnaW5nXG5cbiAgbG9nOiAocykgLT5cbiAgICBAbmF0aXZlLmxvZyhzKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBsb2FkIC8gc2F2ZVxuXG4gIGxvYWQ6IChqc29uKSAtPlxuICAgIEBsb2cgXCIoQ1MpIGxvYWRpbmcgc3RhdGVcIlxuICAgIHRyeVxuICAgICAgc3RhdGUgPSBKU09OLnBhcnNlIGpzb25cbiAgICBjYXRjaFxuICAgICAgQGxvZyBcImxvYWQgZmFpbGVkIHRvIHBhcnNlIHN0YXRlOiAje2pzb259XCJcbiAgICAgIHJldHVyblxuICAgIGlmIHN0YXRlLm9wdGlvbnNcbiAgICAgIGZvciBrLCB2IG9mIHN0YXRlLm9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba10gPSB2XG5cbiAgICBpZiBzdGF0ZS5ibGFja291dFxuICAgICAgQGxvZyBcInJlY3JlYXRpbmcgZ2FtZSBmcm9tIHNhdmVkYXRhXCJcbiAgICAgIEBibGFja291dCA9IG5ldyBCbGFja291dCB0aGlzLCB7XG4gICAgICAgIHN0YXRlOiBzdGF0ZS5ibGFja291dFxuICAgICAgfVxuICAgICAgQHByZXBhcmVHYW1lKClcblxuICBzYXZlOiAtPlxuICAgICMgQGxvZyBcIihDUykgc2F2aW5nIHN0YXRlXCJcbiAgICBzdGF0ZSA9IHtcbiAgICAgIG9wdGlvbnM6IEBvcHRpb25zXG4gICAgfVxuICAgIGlmIEBibGFja291dD9cbiAgICAgIHN0YXRlLmJsYWNrb3V0ID0gQGJsYWNrb3V0LnNhdmUoKVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSBzdGF0ZVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBhaVRpY2tSYXRlOiAtPlxuICAgIHJldHVybiBAb3B0aW9uTWVudXMuc3BlZWRzW0BvcHRpb25zLnNwZWVkSW5kZXhdLnNwZWVkXG5cbiAgbmV3R2FtZTogLT5cbiAgICBAYmxhY2tvdXQgPSBuZXcgQmxhY2tvdXQgdGhpcywge1xuICAgICAgcm91bmRzOiBAb3B0aW9uTWVudXMucm91bmRzW0BvcHRpb25zLnJvdW5kSW5kZXhdLmRhdGFcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1BsYXllcicgfVxuICAgICAgXVxuICAgIH1cbiAgICBmb3IgcCBpbiBbMS4uLkBvcHRpb25zLnBsYXllcnNdXG4gICAgICBAYmxhY2tvdXQuYWRkQUkoKVxuICAgIEBsb2cgXCJuZXh0OiBcIiArIEBibGFja291dC5uZXh0KClcbiAgICBAbG9nIFwicGxheWVyIDAncyBoYW5kOiBcIiArIEpTT04uc3RyaW5naWZ5KEBibGFja291dC5wbGF5ZXJzWzBdLmhhbmQpXG5cbiAgICBAcHJlcGFyZUdhbWUoKVxuXG4gIHByZXBhcmVHYW1lOiAtPlxuICAgIEBoYW5kID0gbmV3IEhhbmQgdGhpc1xuICAgIEBwaWxlID0gbmV3IFBpbGUgdGhpcywgQGhhbmRcbiAgICBAaGFuZC5zZXQgQGJsYWNrb3V0LnBsYXllcnNbMF0uaGFuZFxuXG4gIG1ha2VIYW5kOiAoaW5kZXgpIC0+XG4gICAgZm9yIHYgaW4gWzAuLi4xM11cbiAgICAgIGlmIHYgPT0gaW5kZXhcbiAgICAgICAgQGhhbmRbdl0gPSAxM1xuICAgICAgZWxzZVxuICAgICAgICBAaGFuZFt2XSA9IHZcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgaW5wdXQgaGFuZGxpbmdcblxuICB0b3VjaERvd246ICh4LCB5KSAtPlxuICAgICMgQGxvZyhcInRvdWNoRG93biAje3h9LCN7eX1cIilcbiAgICBAY2hlY2tab25lcyh4LCB5KVxuXG4gIHRvdWNoTW92ZTogKHgsIHkpIC0+XG4gICAgIyBAbG9nKFwidG91Y2hNb3ZlICN7eH0sI3t5fVwiKVxuICAgIGlmIEBibGFja291dCAhPSBudWxsXG4gICAgICBAaGFuZC5tb3ZlKHgsIHkpXG5cbiAgdG91Y2hVcDogKHgsIHkpIC0+XG4gICAgIyBAbG9nKFwidG91Y2hVcCAje3h9LCN7eX1cIilcbiAgICBpZiBAYmxhY2tvdXQgIT0gbnVsbFxuICAgICAgQGhhbmQudXAoeCwgeSlcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgYmlkIGhhbmRsaW5nXG5cbiAgYWRqdXN0QmlkOiAoYW1vdW50KSAtPlxuICAgIHJldHVybiBpZiBAYmxhY2tvdXQgPT0gbnVsbFxuICAgIEBiaWQgPSBAYmlkICsgYW1vdW50XG4gICAgaWYgQGJpZCA8IDBcbiAgICAgIEBiaWQgPSAwXG4gICAgaWYgQGJpZCA+IEBibGFja291dC50cmlja3NcbiAgICAgIEBiaWQgPSBAYmxhY2tvdXQudHJpY2tzXG5cbiAgYXR0ZW1wdEJpZDogLT5cbiAgICByZXR1cm4gaWYgQGJsYWNrb3V0ID09IG51bGxcbiAgICBAYWRqdXN0QmlkKDApXG4gICAgaWYgQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLkJJRFxuICAgICAgaWYgQGJsYWNrb3V0LnR1cm4gPT0gMFxuICAgICAgICBAbG9nIFwiYmlkZGluZyAje0BiaWR9XCJcbiAgICAgICAgQGxhc3RFcnIgPSBAYmxhY2tvdXQuYmlkIHtcbiAgICAgICAgICBpZDogMVxuICAgICAgICAgIGJpZDogQGJpZFxuICAgICAgICAgIGFpOiBmYWxzZVxuICAgICAgICB9XG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIGhlYWRsaW5lIChnYW1lIHN0YXRlIGluIHRvcCBsZWZ0KVxuXG4gIHByZXR0eUVycm9yVGFibGU6IHtcbiAgICBiaWRPdXRPZlJhbmdlOiAgICAgIFwiWW91IGFyZSBzb21laG93IGJpZGRpbmcgYW4gaW1wb3NzaWJsZSB2YWx1ZS4gVGhlIGdhbWUgbXVzdCBiZSBicm9rZW4uXCJcbiAgICBkZWFsZXJGdWNrZWQ6ICAgICAgIFwiRGVhbGVyIHJlc3RyaWN0aW9uOiBZb3UgbWF5IG5vdCBtYWtlIHRvdGFsIGJpZHMgbWF0Y2ggdG90YWwgdHJpY2tzLlwiXG4gICAgZG9Ob3RIYXZlOiAgICAgICAgICBcIllvdSBhcmUgc29tZWhvdyBhdHRlbXB0aW5nIHRvIHBsYXkgYSBjYXJkIHlvdSBkb24ndCBvd24uIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXG4gICAgZm9yY2VkSGlnaGVySW5TdWl0OiBcIllvdSBoYXZlIGEgaGlnaGVyIHZhbHVlIGluIHRoZSBsZWFkIHN1aXQuIFlvdSBtdXN0IHBsYXkgaXQuIChSdWxlIDIpXCJcbiAgICBmb3JjZWRJblN1aXQ6ICAgICAgIFwiWW91IGhhdmUgYXQgbGVhc3Qgb25lIG9mIHRoZSBsZWFkIHN1aXQuIFlvdSBtdXN0IHBsYXkgaXQuIChSdWxlIDEpXCJcbiAgICBnYW1lT3ZlcjogICAgICAgICAgIFwiVGhlIGdhbWUgaXMgb3Zlci4gIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXG4gICAgaW5kZXhPdXRPZlJhbmdlOiAgICBcIllvdSBkb24ndCBoYXZlIHRoYXQgaW5kZXguIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXG4gICAgbG93ZXN0Q2FyZFJlcXVpcmVkOiBcIllvdSBtdXN0IHN0YXJ0IHRoZSByb3VuZCB3aXRoIHRoZSBsb3dlc3QgY2FyZCB5b3UgaGF2ZS5cIlxuICAgIG5leHRJc0NvbmZ1c2VkOiAgICAgXCJJbnRlcmFsIGVycm9yLiBUaGUgZ2FtZSBtdXN0IGJlIGJyb2tlbi5cIlxuICAgIG5vTmV4dDogICAgICAgICAgICAgXCJJbnRlcmFsIGVycm9yLiBUaGUgZ2FtZSBtdXN0IGJlIGJyb2tlbi5cIlxuICAgIG5vdEJpZGRpbmdOb3c6ICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBiaWQgZHVyaW5nIHRoZSB3cm9uZyBwaGFzZS5cIlxuICAgIG5vdEVub3VnaFBsYXllcnM6ICAgXCJDYW5ub3Qgc3RhcnQgdGhlIGdhbWUgd2l0aG91dCBtb3JlIHBsYXllcnMuXCJcbiAgICBub3RJblRyaWNrOiAgICAgICAgIFwiWW91IGFyZSB0cnlpbmcgdG8gcGxheSBhIGNhcmQgZHVyaW5nIHRoZSB3cm9uZyBwaGFzZS5cIlxuICAgIG5vdFlvdXJUdXJuOiAgICAgICAgXCJJdCBpc24ndCB5b3VyIHR1cm4uXCJcbiAgICB0cnVtcE5vdEJyb2tlbjogICAgIFwiVHJ1bXAgaXNuJ3QgYnJva2VuIHlldC4gTGVhZCB3aXRoIGEgbm9uLXNwYWRlLlwiXG4gIH1cblxuICBwcmV0dHlFcnJvcjogLT5cbiAgICBwcmV0dHkgPSBAcHJldHR5RXJyb3JUYWJsZVtAbGFzdEVycl1cbiAgICByZXR1cm4gcHJldHR5IGlmIHByZXR0eVxuICAgIHJldHVybiBAbGFzdEVyclxuXG4gIGNhbGNIZWFkbGluZTogLT5cbiAgICByZXR1cm4gXCJcIiBpZiBAYmxhY2tvdXQgPT0gbnVsbFxuXG4gICAgaGVhZGxpbmUgPSBcIlwiXG4gICAgc3dpdGNoIEBibGFja291dC5zdGF0ZVxuICAgICAgd2hlbiBTdGF0ZS5CSURcbiAgICAgICAgaGVhZGxpbmUgPSBcIldhaXRpbmcgZm9yIGBmZjc3MDBgI3tAYmxhY2tvdXQucGxheWVyc1tAYmxhY2tvdXQudHVybl0ubmFtZX1gYCB0byBgZmZmZjAwYGJpZGBgXCJcbiAgICAgIHdoZW4gU3RhdGUuVFJJQ0tcbiAgICAgICAgaGVhZGxpbmUgPSBcIldhaXRpbmcgZm9yIGBmZjc3MDBgI3tAYmxhY2tvdXQucGxheWVyc1tAYmxhY2tvdXQudHVybl0ubmFtZX1gYCB0byBgZmZmZjAwYHBsYXlgYFwiXG4gICAgICB3aGVuIFN0YXRlLlJPVU5EU1VNTUFSWVxuICAgICAgICBoZWFkbGluZSA9IFwiV2FpdGluZyBmb3IgbmV4dCByb3VuZC4uLlwiXG4gICAgICB3aGVuIFN0YXRlLlBPU1RHQU1FU1VNTUFSWVxuICAgICAgICBoZWFkbGluZSA9IFwiR2FtZSBvdmVyIVwiXG5cbiAgICBlcnJUZXh0ID0gXCJcIlxuICAgIGlmIChAbGFzdEVyci5sZW5ndGggPiAwKSBhbmQgKEBsYXN0RXJyICE9IE9LKVxuICAgICAgZXJyVGV4dCA9IFwiICBFUlJPUjogYGZmMDAwMGAje0BwcmV0dHlFcnJvcigpfVwiXG4gICAgICBoZWFkbGluZSArPSBlcnJUZXh0XG5cbiAgICByZXR1cm4gaGVhZGxpbmVcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgZ2FtZSBvdmVyIGluZm9ybWF0aW9uXG5cbiAgZ2FtZU92ZXJUZXh0OiAtPlxuICAgIHJldHVybiBbXCJHYW1lIE92ZXIhXCJdIGlmIEBibGFja291dCA9PSBudWxsXG5cbiAgICBpZiBAYmxhY2tvdXQubWFyYXRob25Nb2RlKClcbiAgICAgIHJldHVybiBbXCJNYXJhdGhvbiBvdmVyIVwiLCBcIlN1cnZpdmVkICN7QGJsYWNrb3V0Lm5leHRSb3VuZCAtIDF9IHJvdW5kc1wiXVxuXG4gICAgbG93ZXN0U2NvcmUgPSBAYmxhY2tvdXQucGxheWVyc1swXS5zY29yZVxuICAgIGZvciBwbGF5ZXIgaW4gQGJsYWNrb3V0LnBsYXllcnNcbiAgICAgIGlmIGxvd2VzdFNjb3JlID4gcGxheWVyLnNjb3JlXG4gICAgICAgIGxvd2VzdFNjb3JlID0gcGxheWVyLnNjb3JlXG5cbiAgICB3aW5uZXJzID0gW11cbiAgICBmb3IgcGxheWVyIGluIEBibGFja291dC5wbGF5ZXJzXG4gICAgICBpZiBwbGF5ZXIuc2NvcmUgPT0gbG93ZXN0U2NvcmVcbiAgICAgICAgd2lubmVycy5wdXNoIHBsYXllci5uYW1lXG5cbiAgICBpZiB3aW5uZXJzLmxlbmd0aCA9PSAxXG4gICAgICByZXR1cm4gW1wiI3t3aW5uZXJzWzBdfSB3aW5zIVwiXVxuXG4gICAgcmV0dXJuIFtcIlRpZTogI3t3aW5uZXJzLmpvaW4oJywnKX1cIl1cblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgY2FyZCBoYW5kbGluZ1xuXG4gIHBsYXk6IChjYXJkVG9QbGF5LCB4LCB5LCByLCBjYXJkSW5kZXgpIC0+XG4gICAgaWYgQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLlRSSUNLXG4gICAgICBAbG9nIFwiKGdhbWUpIHBsYXlpbmcgY2FyZCAje2NhcmRUb1BsYXl9XCJcbiAgICAgIHJldCA9IEBibGFja291dC5wbGF5IHtcbiAgICAgICAgaWQ6IDFcbiAgICAgICAgd2hpY2g6IGNhcmRUb1BsYXlcbiAgICAgIH1cbiAgICAgIEBsYXN0RXJyID0gcmV0XG4gICAgICBpZiByZXQgPT0gT0tcbiAgICAgICAgQGhhbmQuc2V0IEBibGFja291dC5wbGF5ZXJzWzBdLmhhbmRcbiAgICAgICAgQHBpbGUuaGludCBjYXJkVG9QbGF5LCB4LCB5LCByXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIG1haW4gbG9vcFxuXG4gIHVwZGF0ZTogKGR0KSAtPlxuICAgIEB6b25lcy5sZW5ndGggPSAwICMgZm9yZ2V0IGFib3V0IHpvbmVzIGZyb20gdGhlIGxhc3QgZnJhbWUuIHdlJ3JlIGFib3V0IHRvIG1ha2Ugc29tZSBuZXcgb25lcyFcblxuICAgIHVwZGF0ZWQgPSBmYWxzZVxuICAgIGlmIEB1cGRhdGVNYWluTWVudShkdClcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXG4gICAgaWYgQHVwZGF0ZUdhbWUoZHQpXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxuXG4gICAgcmV0dXJuIHVwZGF0ZWRcblxuICB1cGRhdGVNYWluTWVudTogKGR0KSAtPlxuICAgIHVwZGF0ZWQgPSBmYWxzZVxuICAgIGlmIEBtYWluTWVudS51cGRhdGUoZHQpXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxuICAgIHJldHVybiB1cGRhdGVkXG5cbiAgdXBkYXRlR2FtZTogKGR0KSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiBAYmxhY2tvdXQgPT0gbnVsbFxuXG4gICAgdXBkYXRlZCA9IGZhbHNlXG4gICAgaWYgQHBpbGUudXBkYXRlKGR0KVxuICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICBpZiBAcGlsZS5yZWFkeUZvck5leHRUcmljaygpXG4gICAgICBAbmV4dEFJVGljayAtPSBkdFxuICAgICAgaWYgQG5leHRBSVRpY2sgPD0gMFxuICAgICAgICBAbmV4dEFJVGljayA9IEBhaVRpY2tSYXRlKClcbiAgICAgICAgaWYgQGJsYWNrb3V0LmFpVGljaygpXG4gICAgICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICBpZiBAaGFuZC51cGRhdGUoZHQpXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxuXG4gICAgdHJpY2tUYWtlck5hbWUgPSBcIlwiXG4gICAgaWYgQGJsYWNrb3V0LnByZXZUcmlja1Rha2VyICE9IC0xXG4gICAgICB0cmlja1Rha2VyTmFtZSA9IEBibGFja291dC5wbGF5ZXJzW0BibGFja291dC5wcmV2VHJpY2tUYWtlcl0ubmFtZVxuICAgIEBwaWxlLnNldCBAYmxhY2tvdXQudHJpY2tJRCwgQGJsYWNrb3V0LnBpbGUsIEBibGFja291dC5waWxlV2hvLCBAYmxhY2tvdXQucHJldiwgQGJsYWNrb3V0LnByZXZXaG8sIHRyaWNrVGFrZXJOYW1lLCBAYmxhY2tvdXQucGxheWVycy5sZW5ndGgsIEBibGFja291dC50dXJuXG5cbiAgICBpZiBAcGF1c2VNZW51LnVwZGF0ZShkdClcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXG5cbiAgICBAYWRqdXN0QmlkKDApXG4gICAgaWYgQGJpZFVJLm1pbnVzLnVwZGF0ZShkdClcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXG4gICAgaWYgQGJpZFVJLnBsdXMudXBkYXRlKGR0KVxuICAgICAgdXBkYXRlZCA9IHRydWVcblxuICAgIHJldHVybiB1cGRhdGVkXG5cbiAgcmVuZGVyOiAtPlxuICAgICMgUmVzZXQgcmVuZGVyIGNvbW1hbmRzXG4gICAgQHJlbmRlckNvbW1hbmRzLmxlbmd0aCA9IDBcblxuICAgIGlmIEBob3d0byA+IDBcbiAgICAgIEByZW5kZXJIb3d0bygpXG4gICAgZWxzZSBpZiBAYmxhY2tvdXQgPT0gbnVsbFxuICAgICAgQHJlbmRlck1haW5NZW51KClcbiAgICBlbHNlXG4gICAgICBAcmVuZGVyR2FtZSgpXG5cbiAgICByZXR1cm4gQHJlbmRlckNvbW1hbmRzXG5cbiAgcmVuZGVySG93dG86IC0+XG4gICAgaG93dG9UZXh0dXJlID0gXCJob3d0byN7QGhvd3RvfVwiXG4gICAgQGxvZyBcInJlbmRlcmluZyAje2hvd3RvVGV4dHVyZX1cIlxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCAwLCAwLCBAd2lkdGgsIEBoZWlnaHQsIDAsIDAsIDAsIEBjb2xvcnMuYmxhY2tcbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIGhvd3RvVGV4dHVyZSwgMCwgMCwgQHdpZHRoLCBAYWFIZWlnaHQsIDAsIDAsIDAsIEBjb2xvcnMud2hpdGVcbiAgICBhcnJvd1dpZHRoID0gQHdpZHRoIC8gMjBcbiAgICBhcnJvd09mZnNldCA9IGFycm93V2lkdGggKiA0XG4gICAgY29sb3IgPSBpZiBAaG93dG8gPT0gMSB0aGVuIEBjb2xvcnMuYXJyb3djbG9zZSBlbHNlIEBjb2xvcnMuYXJyb3dcbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwiYXJyb3dMXCIsIEBjZW50ZXIueCAtIGFycm93T2Zmc2V0LCBAaGVpZ2h0LCBhcnJvd1dpZHRoLCAwLCAwLCAwLjUsIDEsIGNvbG9yLCA9PlxuICAgICAgQGhvd3RvLS1cbiAgICAgIGlmIEBob3d0byA8IDBcbiAgICAgICAgQGhvd3RvID0gMFxuICAgIGNvbG9yID0gaWYgQGhvd3RvID09IDMgdGhlbiBAY29sb3JzLmFycm93Y2xvc2UgZWxzZSBAY29sb3JzLmFycm93XG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcImFycm93UlwiLCBAY2VudGVyLnggKyBhcnJvd09mZnNldCwgQGhlaWdodCwgYXJyb3dXaWR0aCwgMCwgMCwgMC41LCAxLCBjb2xvciwgPT5cbiAgICAgIEBob3d0bysrXG4gICAgICBpZiBAaG93dG8gPiAzXG4gICAgICAgIEBob3d0byA9IDBcblxuICByZW5kZXJNYWluTWVudTogLT5cbiAgICBAbWFpbk1lbnUucmVuZGVyKClcblxuICByZW5kZXJHYW1lOiAtPlxuXG4gICAgIyBiYWNrZ3JvdW5kXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIDAsIDAsIEB3aWR0aCwgQGhlaWdodCwgMCwgMCwgMCwgQGNvbG9ycy5iYWNrZ3JvdW5kXG5cbiAgICB0ZXh0SGVpZ2h0ID0gQGFhSGVpZ2h0IC8gMjVcbiAgICB0ZXh0UGFkZGluZyA9IHRleHRIZWlnaHQgLyA1XG4gICAgY2hhcmFjdGVySGVpZ2h0ID0gQGFhSGVpZ2h0IC8gNVxuICAgIHNjb3JlSGVpZ2h0ID0gdGV4dEhlaWdodFxuXG4gICAgIyBMb2dcbiAgICBmb3IgbGluZSwgaSBpbiBAYmxhY2tvdXQubG9nXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgdGV4dEhlaWdodCwgbGluZSwgMCwgKGkrMSkgKiAodGV4dEhlaWdodCArIHRleHRQYWRkaW5nKSwgMCwgMCwgQGNvbG9ycy53aGl0ZVxuXG4gICAgaWYgQGJsYWNrb3V0Lm1hcmF0aG9uTW9kZSgpXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgdGV4dEhlaWdodCwgXCJNQVJBVEhPTiBNT0RFXCIsIEB3aWR0aCAtIEBwYXVzZUJ1dHRvblNpemUsIDAsIDEsIDAsIEBjb2xvcnMub3JhbmdlXG5cbiAgICBhaVBsYXllcnMgPSBbbnVsbCwgbnVsbCwgbnVsbF1cbiAgICBpZiBAYmxhY2tvdXQucGxheWVycy5sZW5ndGggPT0gMlxuICAgICAgYWlQbGF5ZXJzWzFdID0gQGJsYWNrb3V0LnBsYXllcnNbMV1cbiAgICBlbHNlIGlmIEBibGFja291dC5wbGF5ZXJzLmxlbmd0aCA9PSAzXG4gICAgICBhaVBsYXllcnNbMF0gPSBAYmxhY2tvdXQucGxheWVyc1sxXVxuICAgICAgYWlQbGF5ZXJzWzJdID0gQGJsYWNrb3V0LnBsYXllcnNbMl1cbiAgICBlbHNlICMgNCBwbGF5ZXJcbiAgICAgIGFpUGxheWVyc1swXSA9IEBibGFja291dC5wbGF5ZXJzWzFdXG4gICAgICBhaVBsYXllcnNbMV0gPSBAYmxhY2tvdXQucGxheWVyc1syXVxuICAgICAgYWlQbGF5ZXJzWzJdID0gQGJsYWNrb3V0LnBsYXllcnNbM11cblxuICAgIGNoYXJhY3Rlck1hcmdpbiA9IGNoYXJhY3RlckhlaWdodCAvIDJcblxuICAgICMgbGVmdCBzaWRlXG4gICAgaWYgYWlQbGF5ZXJzWzBdICE9IG51bGxcbiAgICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1thaVBsYXllcnNbMF0uY2hhcklEXVxuICAgICAgY2hhcmFjdGVyV2lkdGggPSBAc3ByaXRlUmVuZGVyZXIuY2FsY1dpZHRoKGNoYXJhY3Rlci5zcHJpdGUsIGNoYXJhY3RlckhlaWdodClcbiAgICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgY2hhcmFjdGVyLnNwcml0ZSwgY2hhcmFjdGVyTWFyZ2luLCBAaGFuZC5wbGF5Q2VpbGluZywgMCwgY2hhcmFjdGVySGVpZ2h0LCAwLCAwLCAxLCBAY29sb3JzLndoaXRlXG4gICAgICBAcmVuZGVyU2NvcmUgYWlQbGF5ZXJzWzBdLCBhaVBsYXllcnNbMF0uaW5kZXggPT0gQGJsYWNrb3V0LnR1cm4sIHNjb3JlSGVpZ2h0LCBjaGFyYWN0ZXJNYXJnaW4gKyAoY2hhcmFjdGVyV2lkdGggLyAyKSwgQGhhbmQucGxheUNlaWxpbmcgLSB0ZXh0UGFkZGluZywgMC41LCAwXG4gICAgIyB0b3Agc2lkZVxuICAgIGlmIGFpUGxheWVyc1sxXSAhPSBudWxsXG4gICAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbYWlQbGF5ZXJzWzFdLmNoYXJJRF1cbiAgICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgY2hhcmFjdGVyLnNwcml0ZSwgQGNlbnRlci54LCAwLCAwLCBjaGFyYWN0ZXJIZWlnaHQsIDAsIDAuNSwgMCwgQGNvbG9ycy53aGl0ZVxuICAgICAgQHJlbmRlclNjb3JlIGFpUGxheWVyc1sxXSwgYWlQbGF5ZXJzWzFdLmluZGV4ID09IEBibGFja291dC50dXJuLCBzY29yZUhlaWdodCwgQGNlbnRlci54LCBjaGFyYWN0ZXJIZWlnaHQsIDAuNSwgMFxuICAgICMgcmlnaHQgc2lkZVxuICAgIGlmIGFpUGxheWVyc1syXSAhPSBudWxsXG4gICAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbYWlQbGF5ZXJzWzJdLmNoYXJJRF1cbiAgICAgIGNoYXJhY3RlcldpZHRoID0gQHNwcml0ZVJlbmRlcmVyLmNhbGNXaWR0aChjaGFyYWN0ZXIuc3ByaXRlLCBjaGFyYWN0ZXJIZWlnaHQpXG4gICAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIGNoYXJhY3Rlci5zcHJpdGUsIEB3aWR0aCAtIGNoYXJhY3Rlck1hcmdpbiwgQGhhbmQucGxheUNlaWxpbmcsIDAsIGNoYXJhY3RlckhlaWdodCwgMCwgMSwgMSwgQGNvbG9ycy53aGl0ZVxuICAgICAgQHJlbmRlclNjb3JlIGFpUGxheWVyc1syXSwgYWlQbGF5ZXJzWzJdLmluZGV4ID09IEBibGFja291dC50dXJuLCBzY29yZUhlaWdodCwgQHdpZHRoIC0gKGNoYXJhY3Rlck1hcmdpbiArIChjaGFyYWN0ZXJXaWR0aCAvIDIpKSwgQGhhbmQucGxheUNlaWxpbmcgLSB0ZXh0UGFkZGluZywgMC41LCAwXG5cbiAgICBAcGlsZS5yZW5kZXIoKVxuXG4gICAgaWYgKEBibGFja291dC5zdGF0ZSA9PSBTdGF0ZS5QT1NUR0FNRVNVTU1BUlkpIGFuZCBAcGlsZS5yZXN0aW5nKClcbiAgICAgIGxpbmVzID0gQGdhbWVPdmVyVGV4dCgpXG4gICAgICBnYW1lT3ZlclNpemUgPSBAYWFIZWlnaHQgLyA4XG4gICAgICBnYW1lT3ZlclkgPSBAY2VudGVyLnlcbiAgICAgIGlmIGxpbmVzLmxlbmd0aCA+IDFcbiAgICAgICAgZ2FtZU92ZXJZIC09IChnYW1lT3ZlclNpemUgPj4gMSlcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBnYW1lT3ZlclNpemUsIGxpbmVzWzBdLCBAY2VudGVyLngsIGdhbWVPdmVyWSwgMC41LCAwLjUsIEBjb2xvcnMub3JhbmdlXG4gICAgICBpZiBsaW5lcy5sZW5ndGggPiAxXG4gICAgICAgIGdhbWVPdmVyWSArPSBnYW1lT3ZlclNpemVcbiAgICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIGdhbWVPdmVyU2l6ZSwgbGluZXNbMV0sIEBjZW50ZXIueCwgZ2FtZU92ZXJZLCAwLjUsIDAuNSwgQGNvbG9ycy5vcmFuZ2VcblxuICAgICAgcmVzdGFydFF1aXRTaXplID0gQGFhSGVpZ2h0IC8gMTJcbiAgICAgIHNoYWRvd0Rpc3RhbmNlID0gcmVzdGFydFF1aXRTaXplIC8gOFxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHJlc3RhcnRRdWl0U2l6ZSwgXCJSZXN0YXJ0XCIsIHNoYWRvd0Rpc3RhbmNlICsgQGNlbnRlci54IC8gMiwgc2hhZG93RGlzdGFuY2UgKyBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuYmxhY2ssID0+XG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgcmVzdGFydFF1aXRTaXplLCBcIlJlc3RhcnRcIiwgQGNlbnRlci54IC8gMiwgQGhlaWdodCAtIHJlc3RhcnRRdWl0U2l6ZSwgMC41LCAxLCBAY29sb3JzLmdvbGQsID0+XG4gICAgICAgIEBuZXdHYW1lKClcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCByZXN0YXJ0UXVpdFNpemUsIFwiUXVpdFwiLCBzaGFkb3dEaXN0YW5jZSArIEBjZW50ZXIueCArIChAY2VudGVyLnggLyAyKSwgc2hhZG93RGlzdGFuY2UgKyBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuYmxhY2ssID0+XG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgcmVzdGFydFF1aXRTaXplLCBcIlF1aXRcIiwgQGNlbnRlci54ICsgKEBjZW50ZXIueCAvIDIpLCBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuZ29sZCwgPT5cbiAgICAgICAgQGJsYWNrb3V0ID0gbnVsbFxuXG4gICAgaWYgKEBibGFja291dC5zdGF0ZSA9PSBTdGF0ZS5ST1VORFNVTU1BUlkpIGFuZCBAcGlsZS5yZXN0aW5nKClcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBAYWFIZWlnaHQgLyA4LCBcIlRhcCBmb3IgbmV4dCByb3VuZCAuLi5cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIDAuNSwgMC41LCBAY29sb3JzLm9yYW5nZSwgPT5cbiAgICAgICAgaWYgQGJsYWNrb3V0Lm5leHQoKSA9PSBPS1xuICAgICAgICAgIEBoYW5kLnNldCBAYmxhY2tvdXQucGxheWVyc1swXS5oYW5kXG5cbiAgICBpZiAoQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLkJJRCkgYW5kIChAYmxhY2tvdXQudHVybiA9PSAwKVxuICAgICAgQGJpZFVJLm1pbnVzLnJlbmRlcigpXG4gICAgICBAYmlkVUkucGx1cy5yZW5kZXIoKVxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIEBiaWRUZXh0U2l6ZSwgXCIje0BiaWR9XCIsIEBjZW50ZXIueCwgQGJpZEJ1dHRvblkgLSAoQGJpZFRleHRTaXplICogMC4xKSwgMC41LCAwLjUsIEBjb2xvcnMud2hpdGUsID0+XG4gICAgICAgIEBhdHRlbXB0QmlkKClcbiAgICAgIGJpZEJ1dHRvbkhlaWdodCA9IEBhYUhlaWdodCAvIDEyXG4gICAgICBiaWRTaXplID0gQGZvbnRSZW5kZXJlci5zaXplKEBmb250LCBiaWRCdXR0b25IZWlnaHQsIFwiQmlkXCIpXG4gICAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwic29saWRcIiwgQGNlbnRlci54LCAoQGJpZEJ1dHRvblkgKyBAYmlkVGV4dFNpemUpICsgKGJpZFNpemUuaCAqIDAuMiksIGJpZFNpemUudyAqIDMsIGJpZFNpemUuaCAqIDEuNSwgMCwgMC41LCAwLjUsIEBjb2xvcnMuYmlkLCA9PlxuICAgICAgICBAYXR0ZW1wdEJpZCgpXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgYmlkQnV0dG9uSGVpZ2h0LCBcIkJpZFwiLCBAY2VudGVyLngsIEBiaWRCdXR0b25ZICsgQGJpZFRleHRTaXplLCAwLjUsIDAuNSwgQGNvbG9ycy53aGl0ZVxuXG4gICAgIyBjYXJkIGFyZWFcbiAgICAjIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCAwLCBAaGVpZ2h0LCBAd2lkdGgsIEBoZWlnaHQgLSBAaGFuZC5wbGF5Q2VpbGluZywgMCwgMCwgMSwgQGNvbG9ycy5oYW5kYXJlYVxuICAgIEBoYW5kLnJlbmRlcigpXG4gICAgQHJlbmRlclNjb3JlIEBibGFja291dC5wbGF5ZXJzWzBdLCAwID09IEBibGFja291dC50dXJuLCBzY29yZUhlaWdodCwgQGNlbnRlci54LCBAaGVpZ2h0LCAwLjUsIDFcblxuICAgICMgSGVhZGxpbmUgKGluY2x1ZGVzIGVycm9yKVxuICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCB0ZXh0SGVpZ2h0LCBAY2FsY0hlYWRsaW5lKCksIDAsIDAsIDAsIDAsIEBjb2xvcnMubGlnaHRncmF5XG5cbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwicGF1c2VcIiwgQHdpZHRoLCAwLCAwLCBAcGF1c2VCdXR0b25TaXplLCAwLCAxLCAwLCBAY29sb3JzLndoaXRlLCA9PlxuICAgICAgQHBhdXNlZCA9IHRydWVcblxuICAgIGlmIEBwYXVzZWRcbiAgICAgIEBwYXVzZU1lbnUucmVuZGVyKClcblxuICAgIHJldHVyblxuXG4gIHJlbmRlclNjb3JlOiAocGxheWVyLCBteVR1cm4sIHNjb3JlSGVpZ2h0LCB4LCB5LCBhbmNob3J4LCBhbmNob3J5KSAtPlxuICAgIGlmIG15VHVyblxuICAgICAgbmFtZUNvbG9yID0gXCJgZmY3NzAwYFwiXG4gICAgZWxzZVxuICAgICAgbmFtZUNvbG9yID0gXCJcIlxuICAgIG5hbWVTdHJpbmcgPSBcIiAje25hbWVDb2xvcn0je3BsYXllci5uYW1lfWBgOiAje3BsYXllci5zY29yZX0gXCJcbiAgICBpZiBwbGF5ZXIuYmlkID09IC0xXG4gICAgICBzY29yZVN0cmluZyA9IFwiWyAtLSBdXCJcbiAgICBlbHNlXG4gICAgICBpZiBwbGF5ZXIudHJpY2tzIDwgcGxheWVyLmJpZFxuICAgICAgICB0cmlja0NvbG9yID0gXCJmZmZmMzNcIlxuICAgICAgZWxzZSBpZiBwbGF5ZXIudHJpY2tzID09IHBsYXllci5iaWRcbiAgICAgICAgdHJpY2tDb2xvciA9IFwiMzNmZjMzXCJcbiAgICAgIGVsc2VcbiAgICAgICAgdHJpY2tDb2xvciA9IFwiZmYzMzMzXCJcbiAgICAgIHNjb3JlU3RyaW5nID0gXCJbIGAje3RyaWNrQ29sb3J9YCN7cGxheWVyLnRyaWNrc31gYC8je3BsYXllci5iaWR9IF1cIlxuXG4gICAgbmFtZVNpemUgPSBAZm9udFJlbmRlcmVyLnNpemUoQGZvbnQsIHNjb3JlSGVpZ2h0LCBuYW1lU3RyaW5nKVxuICAgIHNjb3JlU2l6ZSA9IEBmb250UmVuZGVyZXIuc2l6ZShAZm9udCwgc2NvcmVIZWlnaHQsIHNjb3JlU3RyaW5nKVxuICAgIGlmIG5hbWVTaXplLncgPiBzY29yZVNpemUud1xuICAgICAgc2NvcmVTaXplLncgPSBuYW1lU2l6ZS53XG4gICAgbmFtZVkgPSB5XG4gICAgc2NvcmVZID0geVxuICAgIGlmIGFuY2hvcnkgPiAwXG4gICAgICBuYW1lWSAtPSBzY29yZUhlaWdodFxuICAgIGVsc2VcbiAgICAgIHNjb3JlWSArPSBzY29yZUhlaWdodFxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCB4LCB5LCBzY29yZVNpemUudywgc2NvcmVTaXplLmggKiAyLCAwLCBhbmNob3J4LCBhbmNob3J5LCBAY29sb3JzLm92ZXJsYXlcbiAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgc2NvcmVIZWlnaHQsIG5hbWVTdHJpbmcsIHgsIG5hbWVZLCBhbmNob3J4LCBhbmNob3J5LCBAY29sb3JzLndoaXRlXG4gICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHNjb3JlSGVpZ2h0LCBzY29yZVN0cmluZywgeCwgc2NvcmVZLCBhbmNob3J4LCBhbmNob3J5LCBAY29sb3JzLndoaXRlXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIHJlbmRlcmluZyBhbmQgem9uZXNcblxuICBkcmF3SW1hZ2U6ICh0ZXh0dXJlLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgciwgZywgYiwgYSwgY2IpIC0+XG4gICAgQHJlbmRlckNvbW1hbmRzLnB1c2ggQHRleHR1cmVzW3RleHR1cmVdLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgciwgZywgYiwgYVxuXG4gICAgaWYgY2I/XG4gICAgICAjIGNhbGxlciB3YW50cyB0byByZW1lbWJlciB3aGVyZSB0aGlzIHdhcyBkcmF3biwgYW5kIHdhbnRzIHRvIGJlIGNhbGxlZCBiYWNrIGlmIGl0IGlzIGV2ZXIgdG91Y2hlZFxuICAgICAgIyBUaGlzIGlzIGNhbGxlZCBhIFwiem9uZVwiLiBTaW5jZSB6b25lcyBhcmUgdHJhdmVyc2VkIGluIHJldmVyc2Ugb3JkZXIsIHRoZSBuYXR1cmFsIG92ZXJsYXAgb2ZcbiAgICAgICMgYSBzZXJpZXMgb2YgcmVuZGVycyBpcyByZXNwZWN0ZWQgYWNjb3JkaW5nbHkuXG4gICAgICBhbmNob3JPZmZzZXRYID0gLTEgKiBhbmNob3J4ICogZHdcbiAgICAgIGFuY2hvck9mZnNldFkgPSAtMSAqIGFuY2hvcnkgKiBkaFxuICAgICAgem9uZSA9XG4gICAgICAgICMgY2VudGVyIChYLFkpIGFuZCByZXZlcnNlZCByb3RhdGlvbiwgdXNlZCB0byBwdXQgdGhlIGNvb3JkaW5hdGUgaW4gbG9jYWwgc3BhY2UgdG8gdGhlIHpvbmVcbiAgICAgICAgY3g6ICBkeFxuICAgICAgICBjeTogIGR5XG4gICAgICAgIHJvdDogcm90ICogLTFcbiAgICAgICAgIyB0aGUgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveCB1c2VkIGZvciBkZXRlY3Rpb24gb2YgYSBsb2NhbHNwYWNlIGNvb3JkXG4gICAgICAgIGw6ICAgYW5jaG9yT2Zmc2V0WFxuICAgICAgICB0OiAgIGFuY2hvck9mZnNldFlcbiAgICAgICAgcjogICBhbmNob3JPZmZzZXRYICsgZHdcbiAgICAgICAgYjogICBhbmNob3JPZmZzZXRZICsgZGhcbiAgICAgICAgIyBjYWxsYmFjayB0byBjYWxsIGlmIHRoZSB6b25lIGlzIGNsaWNrZWQgb25cbiAgICAgICAgY2I6ICBjYlxuICAgICAgQHpvbmVzLnB1c2ggem9uZVxuXG4gIGNoZWNrWm9uZXM6ICh4LCB5KSAtPlxuICAgIGZvciB6b25lIGluIEB6b25lcyBieSAtMVxuICAgICAgIyBtb3ZlIGNvb3JkIGludG8gc3BhY2UgcmVsYXRpdmUgdG8gdGhlIHF1YWQsIHRoZW4gcm90YXRlIGl0IHRvIG1hdGNoXG4gICAgICB1bnJvdGF0ZWRMb2NhbFggPSB4IC0gem9uZS5jeFxuICAgICAgdW5yb3RhdGVkTG9jYWxZID0geSAtIHpvbmUuY3lcbiAgICAgIGxvY2FsWCA9IHVucm90YXRlZExvY2FsWCAqIE1hdGguY29zKHpvbmUucm90KSAtIHVucm90YXRlZExvY2FsWSAqIE1hdGguc2luKHpvbmUucm90KVxuICAgICAgbG9jYWxZID0gdW5yb3RhdGVkTG9jYWxYICogTWF0aC5zaW4oem9uZS5yb3QpICsgdW5yb3RhdGVkTG9jYWxZICogTWF0aC5jb3Moem9uZS5yb3QpXG4gICAgICBpZiAobG9jYWxYIDwgem9uZS5sKSBvciAobG9jYWxYID4gem9uZS5yKSBvciAobG9jYWxZIDwgem9uZS50KSBvciAobG9jYWxZID4gem9uZS5iKVxuICAgICAgICAjIG91dHNpZGUgb2Ygb3JpZW50ZWQgYm91bmRpbmcgYm94XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB6b25lLmNiKHgsIHkpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcblxuQ0FSRF9JTUFHRV9XID0gMTIwXG5DQVJEX0lNQUdFX0ggPSAxNjJcbkNBUkRfSU1BR0VfT0ZGX1ggPSA0XG5DQVJEX0lNQUdFX09GRl9ZID0gNFxuQ0FSRF9JTUFHRV9BRFZfWCA9IENBUkRfSU1BR0VfV1xuQ0FSRF9JTUFHRV9BRFZfWSA9IENBUkRfSU1BR0VfSFxuQ0FSRF9SRU5ERVJfU0NBTEUgPSAwLjM1ICAgICAgICAgICAgICAgICAgIyBjYXJkIGhlaWdodCBjb2VmZmljaWVudCBmcm9tIHRoZSBzY3JlZW4ncyBoZWlnaHRcbkNBUkRfSEFORF9DVVJWRV9ESVNUX0ZBQ1RPUiA9IDMuNSAgICAgICAgICMgZmFjdG9yIHdpdGggc2NyZWVuIGhlaWdodCB0byBmaWd1cmUgb3V0IGNlbnRlciBvZiBhcmMuIGJpZ2dlciBudW1iZXIgaXMgbGVzcyBhcmNcbkNBUkRfSE9MRElOR19ST1RfT1JERVIgPSBNYXRoLlBJIC8gMTIgICAgICMgZGVzaXJlZCByb3RhdGlvbiBvZiB0aGUgY2FyZCB3aGVuIGJlaW5nIGRyYWdnZWQgYXJvdW5kIGZvciBvcmRlcmluZydzIHNha2VcbkNBUkRfSE9MRElOR19ST1RfUExBWSA9IC0xICogTWF0aC5QSSAvIDEyICMgZGVzaXJlZCByb3RhdGlvbiBvZiB0aGUgY2FyZCB3aGVuIGJlaW5nIGRyYWdnZWQgYXJvdW5kIHdpdGggaW50ZW50IHRvIHBsYXlcbkNBUkRfUExBWV9DRUlMSU5HID0gMC42NSAgICAgICAgICAgICAgICAgICMgaG93IG11Y2ggb2YgdGhlIHRvcCBvZiB0aGUgc2NyZWVuIHJlcHJlc2VudHMgXCJJIHdhbnQgdG8gcGxheSB0aGlzXCIgdnMgXCJJIHdhbnQgdG8gcmVvcmRlclwiXG5cbk5PX0NBUkQgPSAtMVxuXG4jIHRha2VuIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjExMjEyL2hvdy10by1jYWxjdWxhdGUtYW4tYW5nbGUtZnJvbS10aHJlZS1wb2ludHNcbiMgdXNlcyBsYXcgb2YgY29zaW5lcyB0byBmaWd1cmUgb3V0IHRoZSBoYW5kIGFyYyBhbmdsZVxuZmluZEFuZ2xlID0gKHAwLCBwMSwgcDIpIC0+XG4gICAgYSA9IE1hdGgucG93KHAxLnggLSBwMi54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMi55LCAyKVxuICAgIGIgPSBNYXRoLnBvdyhwMS54IC0gcDAueCwgMikgKyBNYXRoLnBvdyhwMS55IC0gcDAueSwgMilcbiAgICBjID0gTWF0aC5wb3cocDIueCAtIHAwLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAwLnksIDIpXG4gICAgcmV0dXJuIE1hdGguYWNvcyggKGErYi1jKSAvIE1hdGguc3FydCg0KmEqYikgKVxuXG5jYWxjRGlzdGFuY2UgPSAocDAsIHAxKSAtPlxuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHAxLnggLSBwMC54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMC55LCAyKSlcblxuY2FsY0Rpc3RhbmNlU3F1YXJlZCA9ICh4MCwgeTAsIHgxLCB5MSkgLT5cbiAgcmV0dXJuIE1hdGgucG93KHgxIC0geDAsIDIpICsgTWF0aC5wb3coeTEgLSB5MCwgMilcblxuY2xhc3MgSGFuZFxuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgIEBjYXJkcyA9IFtdXG4gICAgQGFuaW1zID0ge31cbiAgICBAcG9zaXRpb25DYWNoZSA9IHt9XG5cbiAgICBAZHJhZ0luZGV4U3RhcnQgPSBOT19DQVJEXG4gICAgQGRyYWdJbmRleEN1cnJlbnQgPSBOT19DQVJEXG4gICAgQGRyYWdYID0gMFxuICAgIEBkcmFnWSA9IDBcblxuICAgICMgcmVuZGVyIC8gYW5pbSBtZXRyaWNzXG4gICAgQGNhcmRTcGVlZCA9XG4gICAgICByOiBNYXRoLlBJICogMlxuICAgICAgczogMi41XG4gICAgICB0OiAyICogQGdhbWUud2lkdGhcbiAgICBAcGxheUNlaWxpbmcgPSBDQVJEX1BMQVlfQ0VJTElORyAqIEBnYW1lLmhlaWdodFxuICAgIEBjYXJkSGVpZ2h0ID0gTWF0aC5mbG9vcihAZ2FtZS5oZWlnaHQgKiBDQVJEX1JFTkRFUl9TQ0FMRSlcbiAgICBAY2FyZFdpZHRoICA9IE1hdGguZmxvb3IoQGNhcmRIZWlnaHQgKiBDQVJEX0lNQUdFX1cgLyBDQVJEX0lNQUdFX0gpXG4gICAgQGNhcmRIYWxmSGVpZ2h0ID0gQGNhcmRIZWlnaHQgPj4gMVxuICAgIEBjYXJkSGFsZldpZHRoICA9IEBjYXJkV2lkdGggPj4gMVxuICAgIGFyY01hcmdpbiA9IEBjYXJkV2lkdGggLyAyXG4gICAgYXJjVmVydGljYWxCaWFzID0gQGNhcmRIZWlnaHQgLyA1MFxuICAgIGJvdHRvbUxlZnQgID0geyB4OiBhcmNNYXJnaW4sICAgICAgICAgICAgICAgIHk6IGFyY1ZlcnRpY2FsQmlhcyArIEBnYW1lLmhlaWdodCB9XG4gICAgYm90dG9tUmlnaHQgPSB7IHg6IEBnYW1lLndpZHRoIC0gYXJjTWFyZ2luLCB5OiBhcmNWZXJ0aWNhbEJpYXMgKyBAZ2FtZS5oZWlnaHQgfVxuICAgIEBoYW5kQ2VudGVyID0geyB4OiBAZ2FtZS53aWR0aCAvIDIsICAgICAgICAgeTogYXJjVmVydGljYWxCaWFzICsgQGdhbWUuaGVpZ2h0ICsgKENBUkRfSEFORF9DVVJWRV9ESVNUX0ZBQ1RPUiAqIEBnYW1lLmhlaWdodCkgfVxuICAgIEBoYW5kQW5nbGUgPSBmaW5kQW5nbGUoYm90dG9tTGVmdCwgQGhhbmRDZW50ZXIsIGJvdHRvbVJpZ2h0KVxuICAgIEBoYW5kRGlzdGFuY2UgPSBjYWxjRGlzdGFuY2UoYm90dG9tTGVmdCwgQGhhbmRDZW50ZXIpXG4gICAgQGhhbmRBbmdsZUFkdmFuY2VNYXggPSBAaGFuZEFuZ2xlIC8gNyAjIG5ldmVyIHNwYWNlIHRoZSBjYXJkcyBtb3JlIHRoYW4gd2hhdCB0aGV5J2QgbG9vayBsaWtlIHdpdGggdGhpcyBoYW5kc2l6ZVxuICAgIEBnYW1lLmxvZyBcIkhhbmQgZGlzdGFuY2UgI3tAaGFuZERpc3RhbmNlfSwgYW5nbGUgI3tAaGFuZEFuZ2xlfSAoc2NyZWVuIGhlaWdodCAje0BnYW1lLmhlaWdodH0pXCJcblxuICBzZXQ6IChjYXJkcykgLT5cbiAgICBAY2FyZHMgPSBjYXJkcy5zbGljZSgwKVxuICAgIEBzeW5jQW5pbXMoKVxuICAgIEB3YXJwKClcblxuICBzeW5jQW5pbXM6IC0+XG4gICAgc2VlbiA9IHt9XG4gICAgZm9yIGNhcmQgaW4gQGNhcmRzXG4gICAgICBzZWVuW2NhcmRdKytcbiAgICAgIGlmIG5vdCBAYW5pbXNbY2FyZF1cbiAgICAgICAgQGFuaW1zW2NhcmRdID0gbmV3IEFuaW1hdGlvbiB7XG4gICAgICAgICAgc3BlZWQ6IEBjYXJkU3BlZWRcbiAgICAgICAgICB4OiAwXG4gICAgICAgICAgeTogMFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgfVxuICAgIHRvUmVtb3ZlID0gW11cbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xuICAgICAgaWYgbm90IHNlZW4uaGFzT3duUHJvcGVydHkoY2FyZClcbiAgICAgICAgdG9SZW1vdmUucHVzaCBjYXJkXG4gICAgZm9yIGNhcmQgaW4gdG9SZW1vdmVcbiAgICAgICMgQGdhbWUubG9nIFwicmVtb3ZpbmcgYW5pbSBmb3IgI3tjYXJkfVwiXG4gICAgICBkZWxldGUgQGFuaW1zW2NhcmRdXG5cbiAgICBAdXBkYXRlUG9zaXRpb25zKClcblxuICBjYWxjRHJhd25IYW5kOiAtPlxuICAgIGRyYXduSGFuZCA9IFtdXG4gICAgZm9yIGNhcmQsaSBpbiBAY2FyZHNcbiAgICAgIGlmIGkgIT0gQGRyYWdJbmRleFN0YXJ0XG4gICAgICAgIGRyYXduSGFuZC5wdXNoIGNhcmRcblxuICAgIGlmIEBkcmFnSW5kZXhDdXJyZW50ICE9IE5PX0NBUkRcbiAgICAgIGRyYXduSGFuZC5zcGxpY2UgQGRyYWdJbmRleEN1cnJlbnQsIDAsIEBjYXJkc1tAZHJhZ0luZGV4U3RhcnRdXG4gICAgcmV0dXJuIGRyYXduSGFuZFxuXG4gIHdhbnRzVG9QbGF5RHJhZ2dlZENhcmQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBkcmFnSW5kZXhTdGFydCA9PSBOT19DQVJEXG4gICAgcmV0dXJuIEBkcmFnWSA8IEBwbGF5Q2VpbGluZ1xuXG4gIHVwZGF0ZVBvc2l0aW9uczogLT5cbiAgICBkcmF3bkhhbmQgPSBAY2FsY0RyYXduSGFuZCgpXG4gICAgd2FudHNUb1BsYXkgPSBAd2FudHNUb1BsYXlEcmFnZ2VkQ2FyZCgpXG4gICAgZGVzaXJlZFJvdGF0aW9uID0gQ0FSRF9IT0xESU5HX1JPVF9PUkRFUlxuICAgIHBvc2l0aW9uQ291bnQgPSBkcmF3bkhhbmQubGVuZ3RoXG4gICAgaWYgd2FudHNUb1BsYXlcbiAgICAgIGRlc2lyZWRSb3RhdGlvbiA9IENBUkRfSE9MRElOR19ST1RfUExBWVxuICAgICAgcG9zaXRpb25Db3VudC0tXG4gICAgcG9zaXRpb25zID0gQGNhbGNQb3NpdGlvbnMocG9zaXRpb25Db3VudClcbiAgICBkcmF3SW5kZXggPSAwXG4gICAgZm9yIGNhcmQsaSBpbiBkcmF3bkhhbmRcbiAgICAgIGFuaW0gPSBAYW5pbXNbY2FyZF1cbiAgICAgIGlmIGkgPT0gQGRyYWdJbmRleEN1cnJlbnRcbiAgICAgICAgYW5pbS5yZXEueCA9IEBkcmFnWFxuICAgICAgICBhbmltLnJlcS55ID0gQGRyYWdZXG4gICAgICAgIGFuaW0ucmVxLnIgPSBkZXNpcmVkUm90YXRpb25cbiAgICAgICAgaWYgbm90IHdhbnRzVG9QbGF5XG4gICAgICAgICAgZHJhd0luZGV4KytcbiAgICAgIGVsc2VcbiAgICAgICAgcG9zID0gcG9zaXRpb25zW2RyYXdJbmRleF1cbiAgICAgICAgYW5pbS5yZXEueCA9IHBvcy54XG4gICAgICAgIGFuaW0ucmVxLnkgPSBwb3MueVxuICAgICAgICBhbmltLnJlcS5yID0gcG9zLnJcbiAgICAgICAgZHJhd0luZGV4KytcblxuICAjIGltbWVkaWF0ZWx5IHdhcnAgYWxsIGNhcmRzIHRvIHdoZXJlIHRoZXkgc2hvdWxkIGJlXG4gIHdhcnA6IC0+XG4gICAgZm9yIGNhcmQsYW5pbSBvZiBAYW5pbXNcbiAgICAgIGFuaW0ud2FycCgpXG5cbiAgIyByZW9yZGVyIHRoZSBoYW5kIGJhc2VkIG9uIHRoZSBkcmFnIGxvY2F0aW9uIG9mIHRoZSBoZWxkIGNhcmRcbiAgcmVvcmRlcjogLT5cbiAgICByZXR1cm4gaWYgQGRyYWdJbmRleFN0YXJ0ID09IE5PX0NBUkRcbiAgICByZXR1cm4gaWYgQGNhcmRzLmxlbmd0aCA8IDIgIyBub3RoaW5nIHRvIHJlb3JkZXJcbiAgICBwb3NpdGlvbnMgPSBAY2FsY1Bvc2l0aW9ucyhAY2FyZHMubGVuZ3RoKVxuICAgIGNsb3Nlc3RJbmRleCA9IDBcbiAgICBjbG9zZXN0RGlzdCA9IEBnYW1lLndpZHRoICogQGdhbWUuaGVpZ2h0ICMgc29tZXRoaW5nIGltcG9zc2libHkgbGFyZ2VcbiAgICBmb3IgcG9zLCBpbmRleCBpbiBwb3NpdGlvbnNcbiAgICAgIGRpc3QgPSBjYWxjRGlzdGFuY2VTcXVhcmVkKHBvcy54LCBwb3MueSwgQGRyYWdYLCBAZHJhZ1kpXG4gICAgICBpZiBjbG9zZXN0RGlzdCA+IGRpc3RcbiAgICAgICAgY2xvc2VzdERpc3QgPSBkaXN0XG4gICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XG4gICAgQGRyYWdJbmRleEN1cnJlbnQgPSBjbG9zZXN0SW5kZXhcblxuICBkb3duOiAoQGRyYWdYLCBAZHJhZ1ksIGluZGV4KSAtPlxuICAgIEB1cChAZHJhZ1gsIEBkcmFnWSkgIyBlbnN1cmUgd2UgbGV0IGdvIG9mIHRoZSBwcmV2aW91cyBjYXJkIGluIGNhc2UgdGhlIGV2ZW50cyBhcmUgZHVtYlxuICAgIEBnYW1lLmxvZyBcInBpY2tpbmcgdXAgY2FyZCBpbmRleCAje2luZGV4fVwiXG4gICAgQGRyYWdJbmRleFN0YXJ0ID0gaW5kZXhcbiAgICBAZHJhZ0luZGV4Q3VycmVudCA9IGluZGV4XG4gICAgQHVwZGF0ZVBvc2l0aW9ucygpXG5cbiAgbW92ZTogKEBkcmFnWCwgQGRyYWdZKSAtPlxuICAgIHJldHVybiBpZiBAZHJhZ0luZGV4U3RhcnQgPT0gTk9fQ0FSRFxuICAgICNAZ2FtZS5sb2cgXCJkcmFnZ2luZyBhcm91bmQgY2FyZCBpbmRleCAje0BkcmFnSW5kZXhDdXJyZW50fVwiXG4gICAgQHJlb3JkZXIoKVxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxuXG4gIHVwOiAoQGRyYWdYLCBAZHJhZ1kpIC0+XG4gICAgcmV0dXJuIGlmIEBkcmFnSW5kZXhTdGFydCA9PSBOT19DQVJEXG4gICAgQHJlb3JkZXIoKVxuICAgIGlmIEB3YW50c1RvUGxheURyYWdnZWRDYXJkKClcbiAgICAgIEBnYW1lLmxvZyBcInRyeWluZyB0byBwbGF5IGEgI3tAY2FyZHNbQGRyYWdJbmRleFN0YXJ0XX0gZnJvbSBpbmRleCAje0BkcmFnSW5kZXhTdGFydH1cIlxuICAgICAgY2FyZEluZGV4ID0gQGRyYWdJbmRleFN0YXJ0XG4gICAgICBjYXJkID0gQGNhcmRzW2NhcmRJbmRleF1cbiAgICAgIGFuaW0gPSBAYW5pbXNbY2FyZF1cbiAgICAgIEBkcmFnSW5kZXhTdGFydCA9IE5PX0NBUkRcbiAgICAgIEBkcmFnSW5kZXhDdXJyZW50ID0gTk9fQ0FSRFxuICAgICAgQGdhbWUucGxheSBjYXJkLCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCBjYXJkSW5kZXhcbiAgICBlbHNlXG4gICAgICBAZ2FtZS5sb2cgXCJ0cnlpbmcgdG8gcmVvcmRlciAje0BjYXJkc1tAZHJhZ0luZGV4U3RhcnRdfSBpbnRvIGluZGV4ICN7QGRyYWdJbmRleEN1cnJlbnR9XCJcbiAgICAgIEBjYXJkcyA9IEBjYWxjRHJhd25IYW5kKCkgIyBpcyB0aGlzIHJpZ2h0P1xuXG4gICAgQGRyYWdJbmRleFN0YXJ0ID0gTk9fQ0FSRFxuICAgIEBkcmFnSW5kZXhDdXJyZW50ID0gTk9fQ0FSRFxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxuXG4gIHVwZGF0ZTogKGR0KSAtPlxuICAgIHVwZGF0ZWQgPSBmYWxzZVxuICAgIGZvciBjYXJkLGFuaW0gb2YgQGFuaW1zXG4gICAgICBpZiBhbmltLnVwZGF0ZShkdClcbiAgICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICByZXR1cm4gdXBkYXRlZFxuXG4gIHJlbmRlcjogLT5cbiAgICByZXR1cm4gaWYgQGNhcmRzLmxlbmd0aCA9PSAwXG4gICAgZHJhd25IYW5kID0gQGNhbGNEcmF3bkhhbmQoKVxuICAgIGZvciB2LCBpbmRleCBpbiBkcmF3bkhhbmRcbiAgICAgIGNvbnRpbnVlIGlmIHYgPT0gTk9fQ0FSRFxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxuICAgICAgZG8gKGFuaW0sIGluZGV4KSA9PlxuICAgICAgICBAcmVuZGVyQ2FyZCB2LCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCAxLCAoY2xpY2tYLCBjbGlja1kpID0+XG4gICAgICAgICAgQGRvd24oY2xpY2tYLCBjbGlja1ksIGluZGV4KVxuXG4gIHJlbmRlckNhcmQ6ICh2LCB4LCB5LCByb3QsIHNjYWxlLCBjYikgLT5cbiAgICByb3QgPSAwIGlmIG5vdCByb3RcbiAgICByYW5rID0gTWF0aC5mbG9vcih2ICUgMTMpXG4gICAgc3VpdCA9IE1hdGguZmxvb3IodiAvIDEzKVxuXG4gICAgQGdhbWUuZHJhd0ltYWdlIFwiY2FyZHNcIixcbiAgICBDQVJEX0lNQUdFX09GRl9YICsgKENBUkRfSU1BR0VfQURWX1ggKiByYW5rKSwgQ0FSRF9JTUFHRV9PRkZfWSArIChDQVJEX0lNQUdFX0FEVl9ZICogc3VpdCksIENBUkRfSU1BR0VfVywgQ0FSRF9JTUFHRV9ILFxuICAgIHgsIHksIEBjYXJkV2lkdGggKiBzY2FsZSwgQGNhcmRIZWlnaHQgKiBzY2FsZSxcbiAgICByb3QsIDAuNSwgMC41LCAxLDEsMSwxLCBjYlxuXG4gIGNhbGNQb3NpdGlvbnM6IChoYW5kU2l6ZSkgLT5cbiAgICBpZiBAcG9zaXRpb25DYWNoZS5oYXNPd25Qcm9wZXJ0eShoYW5kU2l6ZSlcbiAgICAgIHJldHVybiBAcG9zaXRpb25DYWNoZVtoYW5kU2l6ZV1cbiAgICByZXR1cm4gW10gaWYgaGFuZFNpemUgPT0gMFxuXG4gICAgYWR2YW5jZSA9IEBoYW5kQW5nbGUgLyBoYW5kU2l6ZVxuICAgIGlmIGFkdmFuY2UgPiBAaGFuZEFuZ2xlQWR2YW5jZU1heFxuICAgICAgYWR2YW5jZSA9IEBoYW5kQW5nbGVBZHZhbmNlTWF4XG4gICAgYW5nbGVTcHJlYWQgPSBhZHZhbmNlICogaGFuZFNpemUgICAgICAgICAgICAgICAgIyBob3cgbXVjaCBvZiB0aGUgYW5nbGUgd2UgcGxhbiBvbiB1c2luZ1xuICAgIGFuZ2xlTGVmdG92ZXIgPSBAaGFuZEFuZ2xlIC0gYW5nbGVTcHJlYWQgICAgICAgICMgYW1vdW50IG9mIGFuZ2xlIHdlJ3JlIG5vdCB1c2luZywgYW5kIG5lZWQgdG8gcGFkIHNpZGVzIHdpdGggZXZlbmx5XG4gICAgY3VycmVudEFuZ2xlID0gLTEgKiAoQGhhbmRBbmdsZSAvIDIpICAgICAgICAgICAgIyBtb3ZlIHRvIHRoZSBsZWZ0IHNpZGUgb2Ygb3VyIGFuZ2xlXG4gICAgY3VycmVudEFuZ2xlICs9IGFuZ2xlTGVmdG92ZXIgLyAyICAgICAgICAgICAgICAgIyAuLi4gYW5kIGFkdmFuY2UgcGFzdCBoYWxmIG9mIHRoZSBwYWRkaW5nXG4gICAgY3VycmVudEFuZ2xlICs9IGFkdmFuY2UgLyAyICAgICAgICAgICAgICAgICAgICAgIyAuLi4gYW5kIGNlbnRlciB0aGUgY2FyZHMgaW4gdGhlIGFuZ2xlXG5cbiAgICBwb3NpdGlvbnMgPSBbXVxuICAgIGZvciBpIGluIFswLi4uaGFuZFNpemVdXG4gICAgICB4ID0gQGhhbmRDZW50ZXIueCAtIE1hdGguY29zKChNYXRoLlBJIC8gMikgKyBjdXJyZW50QW5nbGUpICogQGhhbmREaXN0YW5jZVxuICAgICAgeSA9IEBoYW5kQ2VudGVyLnkgLSBNYXRoLnNpbigoTWF0aC5QSSAvIDIpICsgY3VycmVudEFuZ2xlKSAqIEBoYW5kRGlzdGFuY2VcbiAgICAgIGN1cnJlbnRBbmdsZSArPSBhZHZhbmNlXG4gICAgICBwb3NpdGlvbnMucHVzaCB7XG4gICAgICAgIHg6IHhcbiAgICAgICAgeTogeVxuICAgICAgICByOiBjdXJyZW50QW5nbGUgLSBhZHZhbmNlXG4gICAgICB9XG5cbiAgICBAcG9zaXRpb25DYWNoZVtoYW5kU2l6ZV0gPSBwb3NpdGlvbnNcbiAgICByZXR1cm4gcG9zaXRpb25zXG5cbiAgcmVuZGVySGFuZDogLT5cbiAgICByZXR1cm4gaWYgQGhhbmQubGVuZ3RoID09IDBcbiAgICBmb3IgdixpbmRleCBpbiBAaGFuZFxuICAgICAgZG8gKGluZGV4KSA9PlxuICAgICAgICBAcmVuZGVyQ2FyZCB2LCB4LCB5LCBjdXJyZW50QW5nbGUsIDEsIChjbGlja1gsIGNsaWNrWSkgPT5cbiAgICAgICAgICBAZG93bihjbGlja1gsIGNsaWNrWSwgaW5kZXgpXG5cbm1vZHVsZS5leHBvcnRzID0gSGFuZFxuIiwiQnV0dG9uID0gcmVxdWlyZSAnLi9CdXR0b24nXG5cbmNsYXNzIE1lbnVcbiAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHRpdGxlLCBAYmFja2dyb3VuZCwgQGNvbG9yLCBAYWN0aW9ucykgLT5cbiAgICBAYnV0dG9ucyA9IFtdXG4gICAgQGJ1dHRvbk5hbWVzID0gW1wiYnV0dG9uMFwiLCBcImJ1dHRvbjFcIl1cblxuICAgIGJ1dHRvblNpemUgPSBAZ2FtZS5oZWlnaHQgLyAxNVxuICAgIEBidXR0b25TdGFydFkgPSBAZ2FtZS5oZWlnaHQgLyA1XG5cbiAgICBzbGljZSA9IChAZ2FtZS5oZWlnaHQgLSBAYnV0dG9uU3RhcnRZKSAvIChAYWN0aW9ucy5sZW5ndGggKyAxKVxuICAgIGN1cnJZID0gQGJ1dHRvblN0YXJ0WSArIHNsaWNlXG4gICAgZm9yIGFjdGlvbiBpbiBAYWN0aW9uc1xuICAgICAgYnV0dG9uID0gbmV3IEJ1dHRvbihAZ2FtZSwgQGJ1dHRvbk5hbWVzLCBAZ2FtZS5mb250LCBidXR0b25TaXplLCBAZ2FtZS5jZW50ZXIueCwgY3VyclksIGFjdGlvbilcbiAgICAgIEBidXR0b25zLnB1c2ggYnV0dG9uXG4gICAgICBjdXJyWSArPSBzbGljZVxuXG4gIHVwZGF0ZTogKGR0KSAtPlxuICAgIHVwZGF0ZWQgPSBmYWxzZVxuICAgIGZvciBidXR0b24gaW4gQGJ1dHRvbnNcbiAgICAgIGlmIGJ1dHRvbi51cGRhdGUoZHQpXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXG4gICAgcmV0dXJuIHVwZGF0ZWRcblxuICByZW5kZXI6IC0+XG4gICAgQGdhbWUuc3ByaXRlUmVuZGVyZXIucmVuZGVyIEBiYWNrZ3JvdW5kLCAwLCAwLCBAZ2FtZS53aWR0aCwgQGdhbWUuaGVpZ2h0LCAwLCAwLCAwLCBAY29sb3JcbiAgICBAZ2FtZS5mb250UmVuZGVyZXIucmVuZGVyIEBnYW1lLmZvbnQsIEBnYW1lLmhlaWdodCAvIDI1LCBcIkJ1aWxkOiAje0BnYW1lLnZlcnNpb259XCIsIDAsIEBnYW1lLmhlaWdodCwgMCwgMSwgQGdhbWUuY29sb3JzLmxpZ2h0Z3JheVxuICAgIHRpdGxlSGVpZ2h0ID0gQGdhbWUuaGVpZ2h0IC8gOFxuICAgIHRpdGxlT2Zmc2V0ID0gQGJ1dHRvblN0YXJ0WSA+PiAxXG4gICAgQGdhbWUuZm9udFJlbmRlcmVyLnJlbmRlciBAZ2FtZS5mb250LCB0aXRsZUhlaWdodCwgQHRpdGxlLCBAZ2FtZS5jZW50ZXIueCwgdGl0bGVPZmZzZXQsIDAuNSwgMC41LCBAZ2FtZS5jb2xvcnMud2hpdGVcbiAgICBmb3IgYnV0dG9uIGluIEBidXR0b25zXG4gICAgICBidXR0b24ucmVuZGVyKClcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51XG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcblxuU0VUVExFX01TID0gMTAwMFxuXG5jbGFzcyBQaWxlXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBoYW5kKSAtPlxuICAgIEBwaWxlID0gW11cbiAgICBAcGlsZVdobyA9IFtdXG4gICAgQHRyaWNrID0gW11cbiAgICBAdHJpY2tXaG8gPSBbXVxuICAgIEBhbmltcyA9IHt9XG4gICAgQHBpbGVJRCA9IC0xXG4gICAgQHRyaWNrVGFrZXIgPSBcIlwiXG4gICAgQHNldHRsZVRpbWVyID0gMFxuICAgIEB0cmlja0NvbG9yID0geyByOiAxLCBnOiAxLCBiOiAwLCBhOiAxfVxuICAgIEBwbGF5ZXJDb3VudCA9IDJcbiAgICBAc2NhbGUgPSAwLjZcblxuICAgIGNlbnRlclggPSBAZ2FtZS5jZW50ZXIueFxuICAgIGNlbnRlclkgPSBAZ2FtZS5jZW50ZXIueVxuICAgIG9mZnNldFggPSBAaGFuZC5jYXJkV2lkdGggKiBAc2NhbGVcbiAgICBvZmZzZXRZID0gQGhhbmQuY2FyZEhhbGZIZWlnaHQgKiBAc2NhbGVcbiAgICBAcGlsZUxvY2F0aW9ucyA9XG4gICAgICAyOiBbXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGJvdHRvbVxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IGNlbnRlclkgLSBvZmZzZXRZIH0gIyB0b3BcbiAgICAgIF1cbiAgICAgIDM6IFtcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgYm90dG9tXG4gICAgICAgIHsgeDogY2VudGVyWCAtIG9mZnNldFgsIHk6IGNlbnRlclkgfSAjIGxlZnRcbiAgICAgICAgeyB4OiBjZW50ZXJYICsgb2Zmc2V0WCwgeTogY2VudGVyWSB9ICMgcmlnaHRcbiAgICAgIF1cbiAgICAgIDQ6IFtcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgYm90dG9tXG4gICAgICAgIHsgeDogY2VudGVyWCAtIG9mZnNldFgsIHk6IGNlbnRlclkgfSAjIGxlZnRcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZIC0gb2Zmc2V0WSB9ICMgdG9wXG4gICAgICAgIHsgeDogY2VudGVyWCArIG9mZnNldFgsIHk6IGNlbnRlclkgfSAjIHJpZ2h0XG4gICAgICBdXG4gICAgQHRocm93TG9jYXRpb25zID1cbiAgICAgIDI6IFtcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBAZ2FtZS5oZWlnaHQgfSAjIGJvdHRvbVxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IDAgfSAjIHRvcFxuICAgICAgXVxuICAgICAgMzogW1xuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IEBnYW1lLmhlaWdodCB9ICMgYm90dG9tXG4gICAgICAgIHsgeDogMCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGxlZnRcbiAgICAgICAgeyB4OiBAZ2FtZS53aWR0aCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIHJpZ2h0XG4gICAgICBdXG4gICAgICA0OiBbXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogQGdhbWUuaGVpZ2h0IH0gIyBib3R0b21cbiAgICAgICAgeyB4OiAwLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgbGVmdFxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IDAgfSAjIHRvcFxuICAgICAgICB7IHg6IEBnYW1lLndpZHRoLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgcmlnaHRcbiAgICAgIF1cblxuICBzZXQ6IChwaWxlSUQsIHBpbGUsIHBpbGVXaG8sIHRyaWNrLCB0cmlja1dobywgdHJpY2tUYWtlciwgQHBsYXllckNvdW50LCBmaXJzdFRocm93KSAtPlxuICAgIGlmIChAcGlsZUlEICE9IHBpbGVJRCkgYW5kICh0cmljay5sZW5ndGggPiAwKVxuICAgICAgQHBpbGUgPSB0cmljay5zbGljZSgwKSAjIHRoZSBwaWxlIGhhcyBiZWNvbWUgdGhlIHRyaWNrLCBzdGFzaCBpdCBvZmYgb25lIGxhc3QgdGltZVxuICAgICAgQHBpbGVXaG8gPSB0cmlja1doby5zbGljZSgwKVxuICAgICAgQHBpbGVJRCA9IHBpbGVJRFxuICAgICAgQHNldHRsZVRpbWVyID0gU0VUVExFX01TXG5cbiAgICAjIGRvbid0IHN0b21wIHRoZSBwaWxlIHdlJ3JlIGRyYXdpbmcgdW50aWwgaXQgaXMgZG9uZSBzZXR0bGluZyBhbmQgY2FuIGZseSBvZmYgdGhlIHNjcmVlblxuICAgIGlmIEBzZXR0bGVUaW1lciA9PSAwXG4gICAgICBAcGlsZSA9IHBpbGUuc2xpY2UoMClcbiAgICAgIEBwaWxlV2hvID0gcGlsZVdoby5zbGljZSgwKVxuICAgICAgQHRyaWNrID0gdHJpY2suc2xpY2UoMClcbiAgICAgIEB0cmlja1dobyA9IHRyaWNrV2hvLnNsaWNlKDApXG4gICAgICBAdHJpY2tUYWtlciA9IHRyaWNrVGFrZXJcblxuICAgIEBzeW5jQW5pbXMoKVxuXG4gIGhpbnQ6ICh2LCB4LCB5LCByKSAtPlxuICAgIEBhbmltc1t2XSA9IG5ldyBBbmltYXRpb24ge1xuICAgICAgc3BlZWQ6IEBoYW5kLmNhcmRTcGVlZFxuICAgICAgeDogeFxuICAgICAgeTogeVxuICAgICAgcjogclxuICAgICAgczogMVxuICAgIH1cblxuICBzeW5jQW5pbXM6IC0+XG4gICAgc2VlbiA9IHt9XG4gICAgbG9jYXRpb25zID0gQHRocm93TG9jYXRpb25zW0BwbGF5ZXJDb3VudF1cbiAgICBmb3IgY2FyZCwgaW5kZXggaW4gQHBpbGVcbiAgICAgIHNlZW5bY2FyZF0rK1xuICAgICAgaWYgbm90IEBhbmltc1tjYXJkXVxuICAgICAgICB3aG8gPSBAcGlsZVdob1tpbmRleF1cbiAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbnNbd2hvXVxuICAgICAgICBAYW5pbXNbY2FyZF0gPSBuZXcgQW5pbWF0aW9uIHtcbiAgICAgICAgICBzcGVlZDogQGhhbmQuY2FyZFNwZWVkXG4gICAgICAgICAgeDogbG9jYXRpb24ueFxuICAgICAgICAgIHk6IGxvY2F0aW9uLnlcbiAgICAgICAgICByOiAtMSAqIE1hdGguUEkgLyA0XG4gICAgICAgICAgczogQHNjYWxlXG4gICAgICAgIH1cbiAgICBmb3IgY2FyZCBpbiBAdHJpY2tcbiAgICAgIHNlZW5bY2FyZF0rK1xuICAgICAgaWYgbm90IEBhbmltc1tjYXJkXVxuICAgICAgICBAYW5pbXNbY2FyZF0gPSBuZXcgQW5pbWF0aW9uIHtcbiAgICAgICAgICBzcGVlZDogQGhhbmQuY2FyZFNwZWVkXG4gICAgICAgICAgeDogLTEgKiBAaGFuZC5jYXJkSGFsZldpZHRoXG4gICAgICAgICAgeTogLTEgKiBAaGFuZC5jYXJkSGFsZldpZHRoXG4gICAgICAgICAgcjogLTEgKiBNYXRoLlBJIC8gMlxuICAgICAgICAgIHM6IDFcbiAgICAgICAgfVxuICAgIHRvUmVtb3ZlID0gW11cbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xuICAgICAgaWYgbm90IHNlZW4uaGFzT3duUHJvcGVydHkoY2FyZClcbiAgICAgICAgdG9SZW1vdmUucHVzaCBjYXJkXG4gICAgZm9yIGNhcmQgaW4gdG9SZW1vdmVcbiAgICAgICMgQGdhbWUubG9nIFwicmVtb3ZpbmcgYW5pbSBmb3IgI3tjYXJkfVwiXG4gICAgICBkZWxldGUgQGFuaW1zW2NhcmRdXG5cbiAgICBAdXBkYXRlUG9zaXRpb25zKClcblxuICB1cGRhdGVQb3NpdGlvbnM6IC0+XG4gICAgbG9jYXRpb25zID0gQHBpbGVMb2NhdGlvbnNbQHBsYXllckNvdW50XVxuICAgIGZvciB2LCBpbmRleCBpbiBAcGlsZVxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxuICAgICAgbG9jID0gQHBpbGVXaG9baW5kZXhdXG4gICAgICBhbmltLnJlcS54ID0gbG9jYXRpb25zW2xvY10ueFxuICAgICAgYW5pbS5yZXEueSA9IGxvY2F0aW9uc1tsb2NdLnlcbiAgICAgIGFuaW0ucmVxLnIgPSAwXG4gICAgICBhbmltLnJlcS5zID0gQHNjYWxlXG5cbiAgICBmb3IgXywgaW5kZXggaW4gQHRyaWNrXG4gICAgICBpID0gQHRyaWNrLmxlbmd0aCAtIGluZGV4IC0gMVxuICAgICAgdiA9IEB0cmlja1tpXVxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxuICAgICAgYW5pbS5yZXEueCA9IChAZ2FtZS53aWR0aCArIEBoYW5kLmNhcmRIYWxmV2lkdGgpIC0gKChpbmRleCsxKSAqIChAaGFuZC5jYXJkV2lkdGggLyA1KSlcbiAgICAgIGFuaW0ucmVxLnkgPSAoQGdhbWUucGF1c2VCdXR0b25TaXplICogMS41KSArIEBoYW5kLmNhcmRIYWxmSGVpZ2h0XG4gICAgICBhbmltLnJlcS5yID0gMFxuICAgICAgYW5pbS5yZXEucyA9IDFcblxuICByZWFkeUZvck5leHRUcmljazogLT5cbiAgICByZXR1cm4gKEBzZXR0bGVUaW1lciA9PSAwKVxuXG4gIHVwZGF0ZTogKGR0KSAtPlxuICAgIHVwZGF0ZWQgPSBmYWxzZVxuXG4gICAgaWYgQHNldHRsZVRpbWVyID4gMFxuICAgICAgdXBkYXRlZCA9IHRydWVcbiAgICAgIEBzZXR0bGVUaW1lciAtPSBkdFxuICAgICAgaWYgQHNldHRsZVRpbWVyIDwgMFxuICAgICAgICBAc2V0dGxlVGltZXIgPSAwXG5cbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xuICAgICAgaWYgYW5pbS51cGRhdGUoZHQpXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXG5cbiAgICByZXR1cm4gdXBkYXRlZFxuXG4gICMgdXNlZCBieSB0aGUgZ2FtZSBvdmVyIHNjcmVlbi4gSXQgcmV0dXJucyB0cnVlIHdoZW4gbmVpdGhlciB0aGUgcGlsZSBub3IgdGhlIGxhc3QgdHJpY2sgYXJlIG1vdmluZ1xuICByZXN0aW5nOiAtPlxuICAgIGZvciBjYXJkLGFuaW0gb2YgQGFuaW1zXG4gICAgICBpZiBhbmltLmFuaW1hdGluZygpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIEBzZXR0bGVUaW1lciA+IDBcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcmVuZGVyOiAtPlxuICAgIGZvciB2LCBpbmRleCBpbiBAcGlsZVxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxuICAgICAgQGhhbmQucmVuZGVyQ2FyZCB2LCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCBhbmltLmN1ci5zXG5cbiAgICBmb3IgdiBpbiBAdHJpY2tcbiAgICAgIGFuaW0gPSBAYW5pbXNbdl1cbiAgICAgIEBoYW5kLnJlbmRlckNhcmQgdiwgYW5pbS5jdXIueCwgYW5pbS5jdXIueSwgYW5pbS5jdXIuciwgYW5pbS5jdXIuc1xuXG4gICAgaWYgKEB0cmljay5sZW5ndGggPiAwKSBhbmQgKEB0cmlja1Rha2VyLmxlbmd0aCA+IDApXG4gICAgICBhbmltID0gQGFuaW1zW0B0cmlja1swXV1cbiAgICAgIGlmIGFuaW0/XG4gICAgICAgIEBnYW1lLmZvbnRSZW5kZXJlci5yZW5kZXIgQGdhbWUuZm9udCwgQGdhbWUuYWFIZWlnaHQgLyAzMCwgQHRyaWNrVGFrZXIsIEBnYW1lLndpZHRoLCBhbmltLmN1ci55ICsgQGhhbmQuY2FyZEhhbGZIZWlnaHQsIDEsIDAsIEB0cmlja0NvbG9yXG5cbm1vZHVsZS5leHBvcnRzID0gUGlsZVxuIiwiY2xhc3MgU3ByaXRlUmVuZGVyZXJcbiAgY29uc3RydWN0b3I6IChAZ2FtZSkgLT5cbiAgICBAc3ByaXRlcyA9XG4gICAgICAjIGdlbmVyaWMgc3ByaXRlc1xuICAgICAgc29saWQ6ICAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogIDU1LCB5OiA3MjMsIHc6ICAxMCwgaDogIDEwIH1cbiAgICAgIHBhdXNlOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDYwMiwgeTogNzA3LCB3OiAxMjIsIGg6IDEyNSB9XG4gICAgICBidXR0b24wOiAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAxNDAsIHk6IDc3NywgdzogNDIyLCBoOiAgNjUgfVxuICAgICAgYnV0dG9uMTogICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogMTQwLCB5OiA2OTgsIHc6IDQyMiwgaDogIDY1IH1cbiAgICAgIHBsdXMwOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDc0NSwgeTogNjY0LCB3OiAxMTYsIGg6IDExOCB9XG4gICAgICBwbHVzMTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA3NDUsIHk6IDgyMCwgdzogMTE2LCBoOiAxMTggfVxuICAgICAgbWludXMwOiAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogODk1LCB5OiA2NjQsIHc6IDExNiwgaDogMTE4IH1cbiAgICAgIG1pbnVzMTogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDg5NSwgeTogODIwLCB3OiAxMTYsIGg6IDExOCB9XG4gICAgICBhcnJvd0w6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAgMzMsIHk6IDg1OCwgdzogMjA0LCBoOiAxNTYgfVxuICAgICAgYXJyb3dSOiAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogMjM5LCB5OiA4NTIsIHc6IDIwOCwgaDogMTU1IH1cblxuICAgICAgIyBtZW51IGJhY2tncm91bmRzXG4gICAgICBtYWlubWVudTogIHsgdGV4dHVyZTogXCJtYWlubWVudVwiLCAgeDogMCwgeTogMCwgdzogMTI4MCwgaDogNzIwIH1cbiAgICAgIHBhdXNlbWVudTogeyB0ZXh0dXJlOiBcInBhdXNlbWVudVwiLCB4OiAwLCB5OiAwLCB3OiAxMjgwLCBoOiA3MjAgfVxuXG4gICAgICAjIGhvd3RvXG4gICAgICBob3d0bzE6ICAgIHsgdGV4dHVyZTogXCJob3d0bzFcIiwgIHg6IDAsIHk6ICAwLCB3OiAxOTIwLCBoOiAxMDgwIH1cbiAgICAgIGhvd3RvMjogICAgeyB0ZXh0dXJlOiBcImhvd3RvMlwiLCAgeDogMCwgeTogIDAsIHc6IDE5MjAsIGg6IDEwODAgfVxuICAgICAgaG93dG8zOiAgICB7IHRleHR1cmU6IFwiaG93dG8zXCIsICB4OiAwLCB5OiAgMCwgdzogMTkyMCwgaDogMTA4MCB9XG5cbiAgICAgICMgY2hhcmFjdGVyc1xuICAgICAgbWFyaW86ICAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogIDIwLCB5OiAgIDAsIHc6IDE1MSwgaDogMzA4IH1cbiAgICAgIGx1aWdpOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDE3MSwgeTogICAwLCB3OiAxNTEsIGg6IDMwOCB9XG4gICAgICBwZWFjaDogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAzMzUsIHk6ICAgMCwgdzogMTY0LCBoOiAzMDggfVxuICAgICAgZGFpc3k6ICAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogNTA0LCB5OiAgIDAsIHc6IDE2NCwgaDogMzA4IH1cbiAgICAgIHlvc2hpOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDY2OCwgeTogICAwLCB3OiAxODAsIGg6IDMwOCB9XG4gICAgICB0b2FkOiAgICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4NDksIHk6ICAgMCwgdzogMTU3LCBoOiAzMDggfVxuICAgICAgYm93c2VyOiAgICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogIDExLCB5OiAzMjIsIHc6IDE1MSwgaDogMzA4IH1cbiAgICAgIGJvd3NlcmpyOiAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDIyNSwgeTogMzIyLCB3OiAxNDQsIGg6IDMwOCB9XG4gICAgICBrb29wYTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAzNzIsIHk6IDMyMiwgdzogMTI4LCBoOiAzMDggfVxuICAgICAgcm9zYWxpbmE6ICB7IHRleHR1cmU6IFwiY2hhcnNcIiwgeDogNTAwLCB5OiAzMjIsIHc6IDE3MywgaDogMzA4IH1cbiAgICAgIHNoeWd1eTogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDY5MSwgeTogMzIyLCB3OiAxNTQsIGg6IDMwOCB9XG4gICAgICB0b2FkZXR0ZTogIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4NDcsIHk6IDMyMiwgdzogMTU4LCBoOiAzMDggfVxuXG4gIGNhbGNXaWR0aDogKHNwcml0ZU5hbWUsIGhlaWdodCkgLT5cbiAgICBzcHJpdGUgPSBAc3ByaXRlc1tzcHJpdGVOYW1lXVxuICAgIHJldHVybiAxIGlmIG5vdCBzcHJpdGVcbiAgICByZXR1cm4gaGVpZ2h0ICogc3ByaXRlLncgLyBzcHJpdGUuaFxuXG4gIHJlbmRlcjogKHNwcml0ZU5hbWUsIGR4LCBkeSwgZHcsIGRoLCByb3QsIGFuY2hvcngsIGFuY2hvcnksIGNvbG9yLCBjYikgLT5cbiAgICBzcHJpdGUgPSBAc3ByaXRlc1tzcHJpdGVOYW1lXVxuICAgIHJldHVybiBpZiBub3Qgc3ByaXRlXG4gICAgaWYgKGR3ID09IDApIGFuZCAoZGggPT0gMClcbiAgICAgICMgdGhpcyBwcm9iYWJseSBzaG91bGRuJ3QgZXZlciBiZSB1c2VkLlxuICAgICAgZHcgPSBzcHJpdGUueFxuICAgICAgZGggPSBzcHJpdGUueVxuICAgIGVsc2UgaWYgZHcgPT0gMFxuICAgICAgZHcgPSBkaCAqIHNwcml0ZS53IC8gc3ByaXRlLmhcbiAgICBlbHNlIGlmIGRoID09IDBcbiAgICAgIGRoID0gZHcgKiBzcHJpdGUuaCAvIHNwcml0ZS53XG4gICAgQGdhbWUuZHJhd0ltYWdlIHNwcml0ZS50ZXh0dXJlLCBzcHJpdGUueCwgc3ByaXRlLnksIHNwcml0ZS53LCBzcHJpdGUuaCwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSwgY2JcbiAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGVSZW5kZXJlclxuIiwibW9kdWxlLmV4cG9ydHMgPVxuICBkYXJrZm9yZXN0OlxuICAgIGhlaWdodDogNzJcbiAgICBnbHlwaHM6XG4gICAgICAnOTcnIDogeyB4OiAgIDgsIHk6ICAgOCwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cbiAgICAgICc5OCcgOiB7IHg6ICAgOCwgeTogIDU4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzk5JyA6IHsgeDogIDUwLCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnMTAwJzogeyB4OiAgIDgsIHk6IDExOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM0IH1cbiAgICAgICcxMDEnOiB7IHg6ICAgOCwgeTogMTc4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzEwMic6IHsgeDogICA4LCB5OiAyMjgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzMyB9XG4gICAgICAnMTAzJzogeyB4OiAgIDgsIHk6IDI3OCwgd2lkdGg6ICAzNiwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM1IH1cbiAgICAgICcxMDQnOiB7IHg6ICAgOCwgeTogMzI4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzEwNSc6IHsgeDogICA4LCB5OiAzNzgsIHdpZHRoOiAgMTIsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAxMSB9XG4gICAgICAnMTA2JzogeyB4OiAgIDgsIHk6IDQyOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cbiAgICAgICcxMDcnOiB7IHg6ICAyOCwgeTogMzc4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzEwOCc6IHsgeDogIDUxLCB5OiAzMjgsIHdpZHRoOiAgMzQsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzMyB9XG4gICAgICAnMTA5JzogeyB4OiAgNTEsIHk6IDQyNywgd2lkdGg6ICAzOCwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM3IH1cbiAgICAgICcxMTAnOiB7IHg6ICA3MSwgeTogMzc3LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzExMSc6IHsgeDogIDk3LCB5OiA0MjcsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnMTEyJzogeyB4OiAgNTEsIHk6ICA1OCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cbiAgICAgICcxMTMnOiB7IHg6ICA1MSwgeTogMTA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0NSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzExNCc6IHsgeDogIDkzLCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNSB9XG4gICAgICAnMTE1JzogeyB4OiAgNTEsIHk6IDE2MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM1IH1cbiAgICAgICcxMTYnOiB7IHg6ICA1MSwgeTogMjExLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzMgfVxuICAgICAgJzExNyc6IHsgeDogIDUyLCB5OiAyNjEsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnMTE4JzogeyB4OiAgOTMsIHk6IDMxMSwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDMyIH1cbiAgICAgICcxMTknOiB7IHg6IDExNCwgeTogMzYwLCB3aWR0aDogIDM4LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzggfVxuICAgICAgJzEyMCc6IHsgeDogMTQwLCB5OiA0MTAsIHdpZHRoOiAgMzYsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNyB9XG4gICAgICAnMTIxJzogeyB4OiAxNDAsIHk6IDQ1OSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cbiAgICAgICcxMjInOiB7IHg6IDE4MywgeTogNDU5LCB3aWR0aDogIDM2LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzUgfVxuICAgICAgJzY1JyA6IHsgeDogIDk0LCB5OiAgNTgsIHdpZHRoOiAgMzQsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XG4gICAgICAnNjYnIDogeyB4OiAgOTQsIHk6IDExOSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cbiAgICAgICc2NycgOiB7IHg6ICA5NCwgeTogMTgwLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzY4JyA6IHsgeDogIDk1LCB5OiAyNDEsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNyB9XG4gICAgICAnNjknIDogeyB4OiAxMzYsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cbiAgICAgICc3MCcgOiB7IHg6IDEzNywgeTogIDY5LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzcxJyA6IHsgeDogMTc5LCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XG4gICAgICAnNzInIDogeyB4OiAxMzcsIHk6IDEzMCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cbiAgICAgICc3MycgOiB7IHg6IDEzOCwgeTogMTkxLCB3aWR0aDogIDEyLCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMTMgfVxuICAgICAgJzc0JyA6IHsgeDogMTM4LCB5OiAyNTIsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XG4gICAgICAnNzUnIDogeyB4OiAxNTgsIHk6IDE5MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cbiAgICAgICc3NicgOiB7IHg6IDE2MCwgeTogMzEzLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxuICAgICAgJzc3JyA6IHsgeDogMTgxLCB5OiAyNTEsIHdpZHRoOiAgMzgsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzOSB9XG4gICAgICAnNzgnIDogeyB4OiAxODQsIHk6IDM3NCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cbiAgICAgICc3OScgOiB7IHg6IDIwMywgeTogMzEyLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxuICAgICAgJzgwJyA6IHsgeDogMTgwLCB5OiAgNjksIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnODEnIDogeyB4OiAyMDEsIHk6IDEzMCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTYsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cbiAgICAgICc4MicgOiB7IHg6IDIyMiwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzgzJyA6IHsgeDogMjIzLCB5OiAgNjksIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XG4gICAgICAnODQnIDogeyB4OiAyNjUsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDMzIH1cbiAgICAgICc4NScgOiB7IHg6IDIyNywgeTogMTk0LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxuICAgICAgJzg2JyA6IHsgeDogMjQ0LCB5OiAxMzAsIHdpZHRoOiAgNDEsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAxOSwgeGFkdmFuY2U6ICAzOSB9XG4gICAgICAnODcnIDogeyB4OiAyNjYsIHk6ICA2OSwgd2lkdGg6ICAzOCwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cbiAgICAgICc4OCcgOiB7IHg6IDMwOCwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMTksIHhhZHZhbmNlOiAgMzUgfVxuICAgICAgJzg5JyA6IHsgeDogMjI3LCB5OiAzNzMsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAxOSwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnOTAnIDogeyB4OiAyMjcsIHk6IDQzMywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cbiAgICAgICczMycgOiB7IHg6IDI0NiwgeTogMjU1LCB3aWR0aDogIDE0LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMTEgfVxuICAgICAgJzU5JyA6IHsgeDogMTgwLCB5OiAxMzAsIHdpZHRoOiAgMTMsIGhlaWdodDogIDM3LCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA1NiwgeGFkdmFuY2U6ICAxMyB9XG4gICAgICAnMzcnIDogeyB4OiAgOTUsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cbiAgICAgICc1OCcgOiB7IHg6IDE2MCwgeTogMzc0LCB3aWR0aDogIDEzLCBoZWlnaHQ6ICAyMywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNTAsIHhhZHZhbmNlOiAgMTMgfVxuICAgICAgJzYzJyA6IHsgeDogMjY4LCB5OiAyNTUsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzMyB9XG4gICAgICAnNDInIDogeyB4OiAxMDMsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cbiAgICAgICc0MCcgOiB7IHg6IDI3MCwgeTogMTkwLCB3aWR0aDogIDIzLCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjEgfVxuICAgICAgJzQxJyA6IHsgeDogMjkzLCB5OiAxMzAsIHdpZHRoOiAgMjMsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyMSB9XG4gICAgICAnOTUnIDogeyB4OiAxMTEsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cbiAgICAgICc0MycgOiB7IHg6IDI0NiwgeTogMzE2LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICAzNCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMzksIHhhZHZhbmNlOiAgMzIgfVxuICAgICAgJzQ1JyA6IHsgeDogMTg0LCB5OiA0MzUsIHdpZHRoOiAgMjYsIGhlaWdodDogIDExLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICA0NCwgeGFkdmFuY2U6ICAyNSB9XG4gICAgICAnNjEnIDogeyB4OiAzMTIsIHk6ICA2OCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgMzAsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDQyLCB4YWR2YW5jZTogIDMzIH1cbiAgICAgICc0NicgOiB7IHg6IDEzNSwgeTogMzEzLCB3aWR0aDogIDE0LCBoZWlnaHQ6ICAxMSwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNjEsIHhhZHZhbmNlOiAgMTQgfVxuICAgICAgJzQ0JyA6IHsgeDogMjI3LCB5OiAyNTUsIHdpZHRoOiAgMTAsIGhlaWdodDogIDIxLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA2OCwgeGFkdmFuY2U6ICAxMSB9XG4gICAgICAnNDcnIDogeyB4OiAzNTEsIHk6ICAgOCwgd2lkdGg6ICAyOCwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDE5LCB4YWR2YW5jZTogIDI2IH1cbiAgICAgICcxMjQnOiB7IHg6IDExOSwgeTogMzAyLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxuICAgICAgJzM0JyA6IHsgeDogMTI3LCB5OiAzMDIsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XG4gICAgICAnMzknIDogeyB4OiAyMDEsIHk6IDE5NCwgd2lkdGg6ICAxOCwgaGVpZ2h0OiAgMTksIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogICAwLCB4YWR2YW5jZTogIDIxIH1cbiAgICAgICc2NCcgOiB7IHg6IDIxOCwgeTogNDM1LCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxuICAgICAgJzM1JyA6IHsgeDogMjE4LCB5OiA0NDMsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XG4gICAgICAnMzYnIDogeyB4OiAzMDEsIHk6IDE5MCwgd2lkdGg6ICAzMiwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIyLCB4YWR2YW5jZTogIDI5IH1cbiAgICAgICc5NCcgOiB7IHg6IDIxOCwgeTogNDUxLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxuICAgICAgJzM4JyA6IHsgeDogMjQ2LCB5OiAzNTgsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XG4gICAgICAnMTIzJzogeyB4OiAzMjQsIHk6IDEwNiwgd2lkdGg6ICAyNywgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDI2IH1cbiAgICAgICcxMjUnOiB7IHg6IDI3MCwgeTogMzU4LCB3aWR0aDogIDI3LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjcgfVxuICAgICAgJzkxJyA6IHsgeDogMjcwLCB5OiA0MTgsIHdpZHRoOiAgMjIsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyMSB9XG4gICAgICAnOTMnIDogeyB4OiAzMDAsIHk6IDQxOCwgd2lkdGg6ICAyMiwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDIwIH1cbiAgICAgICc0OCcgOiB7IHg6IDMwNSwgeTogMzE2LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzQ5JyA6IHsgeDogMzExLCB5OiAyNTEsIHdpZHRoOiAgMzQsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XG4gICAgICAnNTAnIDogeyB4OiAzNDEsIHk6IDE2Niwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cbiAgICAgICc1MScgOiB7IHg6IDM1OSwgeTogIDY4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzUyJyA6IHsgeDogMzMwLCB5OiAzNzcsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XG4gICAgICAnNTMnIDogeyB4OiAzNDgsIHk6IDMxMiwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cbiAgICAgICc1NCcgOiB7IHg6IDMzMCwgeTogNDM4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzU1JyA6IHsgeDogMzUzLCB5OiAyMjcsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XG4gICAgICAnNTYnIDogeyB4OiAzODQsIHk6IDEyOSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cbiAgICAgICc1NycgOiB7IHg6IDQwMiwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxuICAgICAgJzMyJyA6IHsgeDogICAwLCB5OiAgIDAsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyMiB9XG4iLCIjIFRoaXMgZmlsZSBwcm92aWRlcyB0aGUgcmVuZGVyaW5nIGVuZ2luZSBmb3IgdGhlIHdlYiB2ZXJzaW9uLiBOb25lIG9mIHRoaXMgY29kZSBpcyBpbmNsdWRlZCBpbiB0aGUgSmF2YSB2ZXJzaW9uLlxuXG5jb25zb2xlLmxvZyAnd2ViIHN0YXJ0dXAnXG5cbkdhbWUgPSByZXF1aXJlICcuL0dhbWUnXG5cbiMgdGFrZW4gZnJvbSBodHRwOiNzdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiXG5jb21wb25lbnRUb0hleCA9IChjKSAtPlxuICBoZXggPSBNYXRoLmZsb29yKGMgKiAyNTUpLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gaWYgaGV4Lmxlbmd0aCA9PSAxIHRoZW4gXCIwXCIgKyBoZXggZWxzZSBoZXhcbnJnYlRvSGV4ID0gKHIsIGcsIGIpIC0+XG4gIHJldHVybiBcIiNcIiArIGNvbXBvbmVudFRvSGV4KHIpICsgY29tcG9uZW50VG9IZXgoZykgKyBjb21wb25lbnRUb0hleChiKVxuXG5TQVZFX1RJTUVSX01TID0gMzAwMFxuXG5jbGFzcyBOYXRpdmVBcHBcbiAgY29uc3RydWN0b3I6IChAc2NyZWVuLCBAd2lkdGgsIEBoZWlnaHQpIC0+XG4gICAgQHRpbnRlZFRleHR1cmVDYWNoZSA9IFtdXG4gICAgQGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICBAbGFzdEludGVyYWN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgQGhlYXJkT25lVG91Y2ggPSBmYWxzZVxuICAgIEB0b3VjaE1vdXNlID0gbnVsbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZWRvd24nLCAgQG9uTW91c2VEb3duLmJpbmQodGhpcyksIGZhbHNlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsICBAb25Nb3VzZU1vdmUuYmluZCh0aGlzKSwgZmFsc2VcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsICAgIEBvbk1vdXNlVXAuYmluZCh0aGlzKSwgZmFsc2VcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hzdGFydCcsIEBvblRvdWNoU3RhcnQuYmluZCh0aGlzKSwgZmFsc2VcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2htb3ZlJywgIEBvblRvdWNoTW92ZS5iaW5kKHRoaXMpLCBmYWxzZVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICd0b3VjaGVuZCcsICAgQG9uVG91Y2hFbmQuYmluZCh0aGlzKSwgZmFsc2VcbiAgICBAY29udGV4dCA9IEBzY3JlZW4uZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQHRleHR1cmVzID0gW1xuICAgICAgIyBhbGwgY2FyZCBhcnRcbiAgICAgIFwiLi4vaW1hZ2VzL2NhcmRzLnBuZ1wiXG4gICAgICAjIGZvbnRzXG4gICAgICBcIi4uL2ltYWdlcy9kYXJrZm9yZXN0LnBuZ1wiXG4gICAgICAjIGNoYXJhY3RlcnMgLyBvdGhlclxuICAgICAgXCIuLi9pbWFnZXMvY2hhcnMucG5nXCJcbiAgICAgICMgaGVscFxuICAgICAgXCIuLi9pbWFnZXMvaG93dG8xLnBuZ1wiXG4gICAgICBcIi4uL2ltYWdlcy9ob3d0bzIucG5nXCJcbiAgICAgIFwiLi4vaW1hZ2VzL2hvd3RvMy5wbmdcIlxuICAgIF1cblxuICAgIEBnYW1lID0gbmV3IEdhbWUodGhpcywgQHdpZHRoLCBAaGVpZ2h0KVxuXG4gICAgaWYgdHlwZW9mIFN0b3JhZ2UgIT0gXCJ1bmRlZmluZWRcIlxuICAgICAgc3RhdGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSBcInN0YXRlXCJcbiAgICAgIGlmIHN0YXRlXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJsb2FkaW5nIHN0YXRlOiAje3N0YXRlfVwiXG4gICAgICAgIEBnYW1lLmxvYWQgc3RhdGVcblxuICAgIEBwZW5kaW5nSW1hZ2VzID0gMFxuICAgIGxvYWRlZFRleHR1cmVzID0gW11cbiAgICBmb3IgaW1hZ2VVcmwgaW4gQHRleHR1cmVzXG4gICAgICBAcGVuZGluZ0ltYWdlcysrXG4gICAgICBjb25zb2xlLmxvZyBcImxvYWRpbmcgaW1hZ2UgI3tAcGVuZGluZ0ltYWdlc306ICN7aW1hZ2VVcmx9XCJcbiAgICAgIGltZyA9IG5ldyBJbWFnZSgpXG4gICAgICBpbWcub25sb2FkID0gQG9uSW1hZ2VMb2FkZWQuYmluZCh0aGlzKVxuICAgICAgaW1nLnNyYyA9IGltYWdlVXJsXG4gICAgICBsb2FkZWRUZXh0dXJlcy5wdXNoIGltZ1xuICAgIEB0ZXh0dXJlcyA9IGxvYWRlZFRleHR1cmVzXG5cbiAgICBAc2F2ZVRpbWVyID0gU0FWRV9USU1FUl9NU1xuXG4gIG9uSW1hZ2VMb2FkZWQ6IChpbmZvKSAtPlxuICAgIEBwZW5kaW5nSW1hZ2VzLS1cbiAgICBpZiBAcGVuZGluZ0ltYWdlcyA9PSAwXG4gICAgICBjb25zb2xlLmxvZyAnQWxsIGltYWdlcyBsb2FkZWQuIEJlZ2lubmluZyByZW5kZXIgbG9vcC4nXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gQHVwZGF0ZSgpXG5cbiAgbG9nOiAocykgLT5cbiAgICBjb25zb2xlLmxvZyBcIk5hdGl2ZUFwcC5sb2coKTogI3tzfVwiXG5cbiAgdXBkYXRlU2F2ZTogKGR0KSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgU3RvcmFnZSA9PSBcInVuZGVmaW5lZFwiXG4gICAgQHNhdmVUaW1lciAtPSBkdFxuICAgIGlmIEBzYXZlVGltZXIgPD0gMFxuICAgICAgQHNhdmVUaW1lciA9IFNBVkVfVElNRVJfTVNcbiAgICAgIHN0YXRlID0gQGdhbWUuc2F2ZSgpXG4gICAgICAjIGNvbnNvbGUubG9nIFwic2F2aW5nOiAje3N0YXRlfVwiXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSBcInN0YXRlXCIsIHN0YXRlXG5cbiAgZ2VuZXJhdGVUaW50SW1hZ2U6ICh0ZXh0dXJlSW5kZXgsIHJlZCwgZ3JlZW4sIGJsdWUpIC0+XG4gICAgaW1nID0gQHRleHR1cmVzW3RleHR1cmVJbmRleF1cbiAgICBidWZmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImNhbnZhc1wiXG4gICAgYnVmZi53aWR0aCAgPSBpbWcud2lkdGhcbiAgICBidWZmLmhlaWdodCA9IGltZy5oZWlnaHRcblxuICAgIGN0eCA9IGJ1ZmYuZ2V0Q29udGV4dCBcIjJkXCJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2NvcHknXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApXG4gICAgZmlsbENvbG9yID0gXCJyZ2IoI3tNYXRoLmZsb29yKHJlZCoyNTUpfSwgI3tNYXRoLmZsb29yKGdyZWVuKjI1NSl9LCAje01hdGguZmxvb3IoYmx1ZSoyNTUpfSlcIlxuICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcbiAgICBjb25zb2xlLmxvZyBcImZpbGxDb2xvciAje2ZpbGxDb2xvcn1cIlxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbXVsdGlwbHknXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJ1ZmYud2lkdGgsIGJ1ZmYuaGVpZ2h0KVxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnY29weSdcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxLjBcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLWluJ1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKVxuXG4gICAgaW1nQ29tcCA9IG5ldyBJbWFnZSgpXG4gICAgaW1nQ29tcC5zcmMgPSBidWZmLnRvRGF0YVVSTCgpXG4gICAgcmV0dXJuIGltZ0NvbXBcblxuICBkcmF3SW1hZ2U6ICh0ZXh0dXJlSW5kZXgsIHNyY1gsIHNyY1ksIHNyY1csIHNyY0gsIGRzdFgsIGRzdFksIGRzdFcsIGRzdEgsIHJvdCwgYW5jaG9yWCwgYW5jaG9yWSwgciwgZywgYiwgYSkgLT5cbiAgICB0ZXh0dXJlID0gQHRleHR1cmVzW3RleHR1cmVJbmRleF1cbiAgICBpZiAociAhPSAxKSBvciAoZyAhPSAxKSBvciAoYiAhPSAxKVxuICAgICAgdGludGVkVGV4dHVyZUtleSA9IFwiI3t0ZXh0dXJlSW5kZXh9LSN7cn0tI3tnfS0je2J9XCJcbiAgICAgIHRpbnRlZFRleHR1cmUgPSBAdGludGVkVGV4dHVyZUNhY2hlW3RpbnRlZFRleHR1cmVLZXldXG4gICAgICBpZiBub3QgdGludGVkVGV4dHVyZVxuICAgICAgICB0aW50ZWRUZXh0dXJlID0gQGdlbmVyYXRlVGludEltYWdlIHRleHR1cmVJbmRleCwgciwgZywgYlxuICAgICAgICBAdGludGVkVGV4dHVyZUNhY2hlW3RpbnRlZFRleHR1cmVLZXldID0gdGludGVkVGV4dHVyZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZ2VuZXJhdGVkIGNhY2hlZCB0ZXh0dXJlICN7dGludGVkVGV4dHVyZUtleX1cIlxuICAgICAgdGV4dHVyZSA9IHRpbnRlZFRleHR1cmVcblxuICAgIEBjb250ZXh0LnNhdmUoKVxuICAgIEBjb250ZXh0LnRyYW5zbGF0ZSBkc3RYLCBkc3RZXG4gICAgQGNvbnRleHQucm90YXRlIHJvdCAjICogMy4xNDE1OTIgLyAxODAuMFxuICAgIGFuY2hvck9mZnNldFggPSAtMSAqIGFuY2hvclggKiBkc3RXXG4gICAgYW5jaG9yT2Zmc2V0WSA9IC0xICogYW5jaG9yWSAqIGRzdEhcbiAgICBAY29udGV4dC50cmFuc2xhdGUgYW5jaG9yT2Zmc2V0WCwgYW5jaG9yT2Zmc2V0WVxuICAgIEBjb250ZXh0Lmdsb2JhbEFscGhhID0gYVxuICAgIEBjb250ZXh0LmRyYXdJbWFnZSh0ZXh0dXJlLCBzcmNYLCBzcmNZLCBzcmNXLCBzcmNILCAwLCAwLCBkc3RXLCBkc3RIKVxuICAgIEBjb250ZXh0LnJlc3RvcmUoKVxuXG4gIHVwZGF0ZTogLT5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gQHVwZGF0ZSgpXG5cbiAgICBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgIGR0ID0gbm93IC0gQGxhc3RUaW1lXG5cbiAgICB0aW1lU2luY2VJbnRlcmFjdCA9IG5vdyAtIEBsYXN0SW50ZXJhY3RUaW1lXG4gICAgaWYgdGltZVNpbmNlSW50ZXJhY3QgPiA1MDAwXG4gICAgICBnb2FsRlBTID0gNSAjIGNhbG0gZG93biwgbm9ib2R5IGlzIGRvaW5nIGFueXRoaW5nIGZvciA1IHNlY29uZHNcbiAgICBlbHNlXG4gICAgICBnb2FsRlBTID0gMjAwICMgYXMgZmFzdCBhcyBwb3NzaWJsZVxuICAgIGlmIEBsYXN0R29hbEZQUyAhPSBnb2FsRlBTXG4gICAgICBjb25zb2xlLmxvZyBcInN3aXRjaGluZyB0byAje2dvYWxGUFN9IEZQU1wiXG4gICAgICBAbGFzdEdvYWxGUFMgPSBnb2FsRlBTXG5cbiAgICBmcHNJbnRlcnZhbCA9IDEwMDAgLyBnb2FsRlBTXG4gICAgaWYgZHQgPCBmcHNJbnRlcnZhbFxuICAgICAgcmV0dXJuXG4gICAgQGxhc3RUaW1lID0gbm93XG5cbiAgICBAY29udGV4dC5jbGVhclJlY3QoMCwgMCwgQHdpZHRoLCBAaGVpZ2h0KVxuICAgIEBnYW1lLnVwZGF0ZShkdClcbiAgICByZW5kZXJDb21tYW5kcyA9IEBnYW1lLnJlbmRlcigpXG5cbiAgICBpID0gMFxuICAgIG4gPSByZW5kZXJDb21tYW5kcy5sZW5ndGhcbiAgICB3aGlsZSAoaSA8IG4pXG4gICAgICBkcmF3Q2FsbCA9IHJlbmRlckNvbW1hbmRzLnNsaWNlKGksIGkgKz0gMTYpXG4gICAgICBAZHJhd0ltYWdlLmFwcGx5KHRoaXMsIGRyYXdDYWxsKVxuXG4gICAgQHVwZGF0ZVNhdmUoZHQpXG5cbiAgb25Ub3VjaFN0YXJ0OiAoZXZ0KSAtPlxuICAgIEBsYXN0SW50ZXJhY3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICBAaGVhcmRPbmVUb3VjaCA9IHRydWVcbiAgICB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzXG4gICAgZm9yIHRvdWNoIGluIHRvdWNoZXNcbiAgICAgIGlmIEB0b3VjaE1vdXNlID09IG51bGxcbiAgICAgICAgQHRvdWNoTW91c2UgPSB0b3VjaC5pZGVudGlmaWVyXG4gICAgICBpZiBAdG91Y2hNb3VzZSA9PSB0b3VjaC5pZGVudGlmaWVyXG4gICAgICAgIEBnYW1lLnRvdWNoRG93bih0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKVxuXG4gIG9uVG91Y2hNb3ZlOiAoZXZ0KSAtPlxuICAgIEBsYXN0SW50ZXJhY3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzXG4gICAgZm9yIHRvdWNoIGluIHRvdWNoZXNcbiAgICAgIGlmIEB0b3VjaE1vdXNlID09IHRvdWNoLmlkZW50aWZpZXJcbiAgICAgICAgQGdhbWUudG91Y2hNb3ZlKHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpXG5cbiAgb25Ub3VjaEVuZDogKGV2dCkgLT5cbiAgICBAbGFzdEludGVyYWN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlc1xuICAgIGZvciB0b3VjaCBpbiB0b3VjaGVzXG4gICAgICBpZiBAdG91Y2hNb3VzZSA9PSB0b3VjaC5pZGVudGlmaWVyXG4gICAgICAgIEBnYW1lLnRvdWNoVXAodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSlcbiAgICAgICAgQHRvdWNoTW91c2UgPSBudWxsXG4gICAgaWYgZXZ0LnRvdWNoZXMubGVuZ3RoID09IDBcbiAgICAgIEB0b3VjaE1vdXNlID0gbnVsbFxuXG4gIG9uTW91c2VEb3duOiAoZXZ0KSAtPlxuICAgIGlmIEBoZWFyZE9uZVRvdWNoXG4gICAgICByZXR1cm5cbiAgICBAbGFzdEludGVyYWN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgQGdhbWUudG91Y2hEb3duKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSlcblxuICBvbk1vdXNlTW92ZTogKGV2dCkgLT5cbiAgICBpZiBAaGVhcmRPbmVUb3VjaFxuICAgICAgcmV0dXJuXG4gICAgQGxhc3RJbnRlcmFjdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgIEBnYW1lLnRvdWNoTW92ZShldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXG5cbiAgb25Nb3VzZVVwOiAoZXZ0KSAtPlxuICAgIGlmIEBoZWFyZE9uZVRvdWNoXG4gICAgICByZXR1cm5cbiAgICBAbGFzdEludGVyYWN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgQGdhbWUudG91Y2hVcChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXG5cbnNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICdzY3JlZW4nXG5yZXNpemVTY3JlZW4gPSAtPlxuICBkZXNpcmVkQXNwZWN0UmF0aW8gPSAxNiAvIDlcbiAgY3VycmVudEFzcGVjdFJhdGlvID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgaWYgY3VycmVudEFzcGVjdFJhdGlvIDwgZGVzaXJlZEFzcGVjdFJhdGlvXG4gICAgc2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBzY3JlZW4uaGVpZ2h0ID0gTWF0aC5mbG9vcih3aW5kb3cuaW5uZXJXaWR0aCAqICgxIC8gZGVzaXJlZEFzcGVjdFJhdGlvKSlcbiAgZWxzZVxuICAgIHNjcmVlbi53aWR0aCA9IE1hdGguZmxvb3Iod2luZG93LmlubmVySGVpZ2h0ICogZGVzaXJlZEFzcGVjdFJhdGlvKVxuICAgIHNjcmVlbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbnJlc2l6ZVNjcmVlbigpXG4jIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVTY3JlZW4sIGZhbHNlXG5cbmFwcCA9IG5ldyBOYXRpdmVBcHAoc2NyZWVuLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4iXX0=
