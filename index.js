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
    this.rgbkCache = [];
    this.tintedTextureCache = [];
    this.lastTime = new Date().getTime();
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
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

  NativeApp.prototype.generateRGBKs = function(img) {
    var canvas, ctx, h, i, imgComp, j, k, pixels, ref, rgbI, rgbks, to, toData, w;
    w = img.width;
    h = img.height;
    rgbks = [];
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    pixels = ctx.getImageData(0, 0, w, h).data;
    for (rgbI = j = 0; j < 4; rgbI = ++j) {
      canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      to = ctx.getImageData(0, 0, w, h);
      toData = to.data;
      for (i = k = 0, ref = pixels.length; k < ref; i = k += 4) {
        toData[i] = rgbI === 0 ? pixels[i] : 0;
        toData[i + 1] = rgbI === 1 ? pixels[i + 1] : 0;
        toData[i + 2] = rgbI === 2 ? pixels[i + 2] : 0;
        toData[i + 3] = pixels[i + 3];
      }
      ctx.putImageData(to, 0, 0);
      imgComp = new Image();
      imgComp.src = canvas.toDataURL();
      rgbks.push(imgComp);
    }
    return rgbks;
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

  NativeApp.prototype.generateTintImage2 = function(textureIndex, red, green, blue) {
    var buff, ctx, img, imgComp, rgbks;
    img = this.textures[textureIndex];
    rgbks = this.rgbkCache[textureIndex];
    if (!rgbks) {
      rgbks = this.generateRGBKs(img);
      this.rgbkCache[textureIndex] = rgbks;
    }
    buff = document.createElement("canvas");
    buff.width = img.width;
    buff.height = img.height;
    ctx = buff.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(rgbks[3], 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    if (red > 0) {
      ctx.globalAlpha = red;
      ctx.drawImage(rgbks[0], 0, 0);
    }
    if (green > 0) {
      ctx.globalAlpha = green;
      ctx.drawImage(rgbks[1], 0, 0);
    }
    if (blue > 0) {
      ctx.globalAlpha = blue;
      ctx.drawImage(rgbks[2], 0, 0);
    }
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
    var drawCall, dt, i, n, now, renderCommands;
    now = new Date().getTime();
    dt = now - this.lastTime;
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
    this.updateSave(dt);
    return requestAnimationFrame((function(_this) {
      return function() {
        return _this.update();
      };
    })(this));
  };

  NativeApp.prototype.onMouseDown = function(evt) {
    return this.game.touchDown(evt.clientX, evt.clientY);
  };

  NativeApp.prototype.onMouseMove = function(evt) {
    return this.game.touchMove(evt.clientX, evt.clientY);
  };

  NativeApp.prototype.onMouseUp = function(evt) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL0FuaW1hdGlvbi5jb2ZmZWUiLCJnYW1lL0JsYWNrb3V0LmNvZmZlZSIsImdhbWUvQnV0dG9uLmNvZmZlZSIsImdhbWUvRm9udFJlbmRlcmVyLmNvZmZlZSIsImdhbWUvR2FtZS5jb2ZmZWUiLCJnYW1lL0hhbmQuY29mZmVlIiwiZ2FtZS9NZW51LmNvZmZlZSIsImdhbWUvUGlsZS5jb2ZmZWUiLCJnYW1lL1Nwcml0ZVJlbmRlcmVyLmNvZmZlZSIsImdhbWUvZm9udG1ldHJpY3MuY29mZmVlIiwiZ2FtZS9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLFNBQUMsQ0FBRDtFQUNULElBQUcsQ0FBQSxLQUFLLENBQVI7QUFDRSxXQUFPLEVBRFQ7R0FBQSxNQUVLLElBQUcsQ0FBQSxHQUFJLENBQVA7QUFDSCxXQUFPLENBQUMsRUFETDs7QUFFTCxTQUFPO0FBTEU7O0FBT0w7RUFDUyxtQkFBQyxJQUFEO0FBQ1gsUUFBQTtJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDO0lBQ2QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxHQUFELEdBQU87QUFDUCxTQUFBLFNBQUE7O01BQ0UsSUFBRyxDQUFBLEtBQUssT0FBUjtRQUNFLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFMLEdBQVU7UUFDVixJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBTCxHQUFVLEVBRlo7O0FBREY7RUFKVzs7c0JBVWIsSUFBQSxHQUFNLFNBQUE7SUFDSixJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQURoQjs7SUFFQSxJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcs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QUFMLENBQS9CLEVBRmxCO0dBQUEsTUFBQTtJQUlFLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFNLENBQUMsV0FBUCxHQUFxQixrQkFBaEM7V0FDZixNQUFNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUMsWUFMekI7O0FBSGE7O0FBU2YsWUFBQSxDQUFBOztBQUdBLEdBQUEsR0FBTSxJQUFJLFNBQUosQ0FBYyxNQUFkLEVBQXNCLE1BQU0sQ0FBQyxLQUE3QixFQUFvQyxNQUFNLENBQUMsTUFBM0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjYWxjU2lnbiA9ICh2KSAtPlxyXG4gIGlmIHYgPT0gMFxyXG4gICAgcmV0dXJuIDBcclxuICBlbHNlIGlmIHYgPCAwXHJcbiAgICByZXR1cm4gLTFcclxuICByZXR1cm4gMVxyXG5cclxuY2xhc3MgQW5pbWF0aW9uXHJcbiAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxyXG4gICAgQHNwZWVkID0gZGF0YS5zcGVlZFxyXG4gICAgQHJlcSA9IHt9XHJcbiAgICBAY3VyID0ge31cclxuICAgIGZvciBrLHYgb2YgZGF0YVxyXG4gICAgICBpZiBrICE9ICdzcGVlZCdcclxuICAgICAgICBAcmVxW2tdID0gdlxyXG4gICAgICAgIEBjdXJba10gPSB2XHJcblxyXG4gICMgJ2ZpbmlzaGVzJyBhbGwgYW5pbWF0aW9uc1xyXG4gIHdhcnA6IC0+XHJcbiAgICBpZiBAY3VyLnI/XHJcbiAgICAgIEBjdXIuciA9IEByZXEuclxyXG4gICAgaWYgQGN1ci5zP1xyXG4gICAgICBAY3VyLnMgPSBAcmVxLnNcclxuICAgIGlmIEBjdXIueD8gYW5kIEBjdXIueT9cclxuICAgICAgQGN1ci54ID0gQHJlcS54XHJcbiAgICAgIEBjdXIueSA9IEByZXEueVxyXG5cclxuICBhbmltYXRpbmc6IC0+XHJcbiAgICBpZiBAY3VyLnI/XHJcbiAgICAgIGlmIEByZXEuciAhPSBAY3VyLnJcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgaWYgQGN1ci5zP1xyXG4gICAgICBpZiBAcmVxLnMgIT0gQGN1ci5zXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIGlmIEBjdXIueD8gYW5kIEBjdXIueT9cclxuICAgICAgaWYgKEByZXEueCAhPSBAY3VyLngpIG9yIChAcmVxLnkgIT0gQGN1ci55KVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgdXBkYXRlOiAoZHQpIC0+XHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuICAgICMgcm90YXRpb25cclxuICAgIGlmIEBjdXIucj9cclxuICAgICAgaWYgQHJlcS5yICE9IEBjdXIuclxyXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICAgICAgIyBzYW5pdGl6ZSByZXF1ZXN0ZWQgcm90YXRpb25cclxuICAgICAgICB0d29QaSA9IE1hdGguUEkgKiAyXHJcbiAgICAgICAgbmVnVHdvUGkgPSAtMSAqIHR3b1BpXHJcbiAgICAgICAgQHJlcS5yIC09IHR3b1BpIHdoaWxlIEByZXEuciA+PSB0d29QaVxyXG4gICAgICAgIEByZXEuciArPSB0d29QaSB3aGlsZSBAcmVxLnIgPD0gbmVnVHdvUGlcclxuICAgICAgICAjIHBpY2sgYSBkaXJlY3Rpb24gYW5kIHR1cm5cclxuICAgICAgICBkciA9IEByZXEuciAtIEBjdXIuclxyXG4gICAgICAgIGRpc3QgPSBNYXRoLmFicyhkcilcclxuICAgICAgICBzaWduID0gY2FsY1NpZ24oZHIpXHJcbiAgICAgICAgaWYgZGlzdCA+IE1hdGguUElcclxuICAgICAgICAgICMgc3BpbiB0aGUgb3RoZXIgZGlyZWN0aW9uLCBpdCBpcyBjbG9zZXJcclxuICAgICAgICAgIGRpc3QgPSB0d29QaSAtIGRpc3RcclxuICAgICAgICAgIHNpZ24gKj0gLTFcclxuICAgICAgICBtYXhEaXN0ID0gZHQgKiBAc3BlZWQuciAvIDEwMDBcclxuICAgICAgICBpZiBkaXN0IDwgbWF4RGlzdFxyXG4gICAgICAgICAgIyB3ZSBjYW4gZmluaXNoIHRoaXMgZnJhbWVcclxuICAgICAgICAgIEBjdXIuciA9IEByZXEuclxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBjdXIuciArPSBtYXhEaXN0ICogc2lnblxyXG5cclxuICAgICMgc2NhbGVcclxuICAgIGlmIEBjdXIucz9cclxuICAgICAgaWYgQHJlcS5zICE9IEBjdXIuc1xyXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICAgICAgIyBwaWNrIGEgZGlyZWN0aW9uIGFuZCB0dXJuXHJcbiAgICAgICAgZHMgPSBAcmVxLnMgLSBAY3VyLnNcclxuICAgICAgICBkaXN0ID0gTWF0aC5hYnMoZHMpXHJcbiAgICAgICAgc2lnbiA9IGNhbGNTaWduKGRzKVxyXG4gICAgICAgIG1heERpc3QgPSBkdCAqIEBzcGVlZC5zIC8gMTAwMFxyXG4gICAgICAgIGlmIGRpc3QgPCBtYXhEaXN0XHJcbiAgICAgICAgICAjIHdlIGNhbiBmaW5pc2ggdGhpcyBmcmFtZVxyXG4gICAgICAgICAgQGN1ci5zID0gQHJlcS5zXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGN1ci5zICs9IG1heERpc3QgKiBzaWduXHJcblxyXG4gICAgIyB0cmFuc2xhdGlvblxyXG4gICAgaWYgQGN1ci54PyBhbmQgQGN1ci55P1xyXG4gICAgICBpZiAoQHJlcS54ICE9IEBjdXIueCkgb3IgKEByZXEueSAhPSBAY3VyLnkpXHJcbiAgICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgICAgICB2ZWNYID0gQHJlcS54IC0gQGN1ci54XHJcbiAgICAgICAgdmVjWSA9IEByZXEueSAtIEBjdXIueVxyXG4gICAgICAgIGRpc3QgPSBNYXRoLnNxcnQoKHZlY1ggKiB2ZWNYKSArICh2ZWNZICogdmVjWSkpXHJcbiAgICAgICAgbWF4RGlzdCA9IGR0ICogQHNwZWVkLnQgLyAxMDAwXHJcbiAgICAgICAgaWYgZGlzdCA8IG1heERpc3RcclxuICAgICAgICAgICMgd2UgY2FuIGZpbmlzaCB0aGlzIGZyYW1lXHJcbiAgICAgICAgICBAY3VyLnggPSBAcmVxLnhcclxuICAgICAgICAgIEBjdXIueSA9IEByZXEueVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgbW92ZSBhcyBtdWNoIGFzIHBvc3NpYmxlXHJcbiAgICAgICAgICBAY3VyLnggKz0gKHZlY1ggLyBkaXN0KSAqIG1heERpc3RcclxuICAgICAgICAgIEBjdXIueSArPSAodmVjWSAvIGRpc3QpICogbWF4RGlzdFxyXG5cclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvblxyXG4iLCJNSU5fUExBWUVSUyA9IDNcclxuTUFYX0xPR19MSU5FUyA9IDdcclxuT0sgPSAnT0snXHJcblN0YXRlID1cclxuICBMT0JCWTogJ2xvYmJ5J1xyXG4gIEJJRDogJ2JpZCdcclxuICBUUklDSzogJ3RyaWNrJ1xyXG4gIFJPVU5EU1VNTUFSWTogJ3JvdW5kU3VtbWFyeSdcclxuICBQT1NUR0FNRVNVTU1BUlk6ICdwb3N0R2FtZVN1bW1hcnknXHJcblxyXG5TdWl0ID1cclxuICBOT05FOiAtMVxyXG4gIENMVUJTOiAwXHJcbiAgRElBTU9ORFM6IDFcclxuICBIRUFSVFM6IDJcclxuICBTUEFERVM6IDNcclxuXHJcblN1aXROYW1lID0gWydDbHVicycsICdEaWFtb25kcycsICdIZWFydHMnLCAnU3BhZGVzJ11cclxuU2hvcnRTdWl0TmFtZSA9IFsnQycsICdEJywgJ0gnLCAnUyddXHJcblxyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIEFJIE5hbWUgR2VuZXJhdG9yXHJcblxyXG5haUNoYXJhY3Rlckxpc3QgPSBbXHJcbiAgeyBpZDogXCJtYXJpb1wiLCAgICBuYW1lOiBcIk1hcmlvXCIsICAgICAgc3ByaXRlOiBcIm1hcmlvXCIsICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcImx1aWdpXCIsICAgIG5hbWU6IFwiTHVpZ2lcIiwgICAgICBzcHJpdGU6IFwibHVpZ2lcIiwgICAgYnJhaW46IFwiY2hhb3NcIiB9XHJcbiAgeyBpZDogXCJwZWFjaFwiLCAgICBuYW1lOiBcIlBlYWNoXCIsICAgICAgc3ByaXRlOiBcInBlYWNoXCIsICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcImRhaXN5XCIsICAgIG5hbWU6IFwiRGFpc3lcIiwgICAgICBzcHJpdGU6IFwiZGFpc3lcIiwgICAgYnJhaW46IFwiY29uc2VydmF0aXZlTW9yb25cIiB9XHJcbiAgeyBpZDogXCJ5b3NoaVwiLCAgICBuYW1lOiBcIllvc2hpXCIsICAgICAgc3ByaXRlOiBcInlvc2hpXCIsICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcInRvYWRcIiwgICAgIG5hbWU6IFwiVG9hZFwiLCAgICAgICBzcHJpdGU6IFwidG9hZFwiLCAgICAgYnJhaW46IFwibm9ybWFsXCIgfVxyXG4gIHsgaWQ6IFwiYm93c2VyXCIsICAgbmFtZTogXCJCb3dzZXJcIiwgICAgIHNwcml0ZTogXCJib3dzZXJcIiwgICBicmFpbjogXCJhZ2dyZXNzaXZlTW9yb25cIiB9XHJcbiAgeyBpZDogXCJib3dzZXJqclwiLCBuYW1lOiBcIkJvd3NlciBKclwiLCAgc3ByaXRlOiBcImJvd3NlcmpyXCIsIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcImtvb3BhXCIsICAgIG5hbWU6IFwiS29vcGFcIiwgICAgICBzcHJpdGU6IFwia29vcGFcIiwgICAgYnJhaW46IFwibm9ybWFsXCIgfVxyXG4gIHsgaWQ6IFwicm9zYWxpbmFcIiwgbmFtZTogXCJSb3NhbGluYVwiLCAgIHNwcml0ZTogXCJyb3NhbGluYVwiLCBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJzaHlndXlcIiwgICBuYW1lOiBcIlNoeWd1eVwiLCAgICAgc3ByaXRlOiBcInNoeWd1eVwiLCAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcInRvYWRldHRlXCIsIG5hbWU6IFwiVG9hZGV0dGVcIiwgICBzcHJpdGU6IFwidG9hZGV0dGVcIiwgYnJhaW46IFwibm9ybWFsXCIgfVxyXG5dXHJcblxyXG5haUNoYXJhY3RlcnMgPSB7fVxyXG5mb3IgY2hhcmFjdGVyIGluIGFpQ2hhcmFjdGVyTGlzdFxyXG4gIGFpQ2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5yYW5kb21DaGFyYWN0ZXIgPSAtPlxyXG4gIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhaUNoYXJhY3Rlckxpc3QubGVuZ3RoKVxyXG4gIHJldHVybiBhaUNoYXJhY3Rlckxpc3Rbcl1cclxuXHJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgQ2FyZFxyXG5cclxuY2xhc3MgQ2FyZFxyXG4gIGNvbnN0cnVjdG9yOiAoeCkgLT5cclxuICAgIEBzdWl0ICA9IE1hdGguZmxvb3IoeCAvIDEzKVxyXG4gICAgQHZhbHVlID0gTWF0aC5mbG9vcih4ICUgMTMpXHJcbiAgICBzd2l0Y2ggQHZhbHVlXHJcbiAgICAgIHdoZW4gOSAgdGhlbiBAdmFsdWVOYW1lID0gJ0onXHJcbiAgICAgIHdoZW4gMTAgdGhlbiBAdmFsdWVOYW1lID0gJ1EnXHJcbiAgICAgIHdoZW4gMTEgdGhlbiBAdmFsdWVOYW1lID0gJ0snXHJcbiAgICAgIHdoZW4gMTIgdGhlbiBAdmFsdWVOYW1lID0gJ0EnXHJcbiAgICAgIGVsc2UgICAgICAgICBAdmFsdWVOYW1lID0gU3RyaW5nKEB2YWx1ZSArIDIpXHJcblxyXG4gICAgQG5hbWUgPSBAdmFsdWVOYW1lICsgU2hvcnRTdWl0TmFtZVtAc3VpdF1cclxuXHJcbmNhcmRCZWF0cyA9IChjaGFsbGVuZ2VyWCwgY2hhbXBpb25YLCBjdXJyZW50U3VpdCkgLT5cclxuICBjaGFsbGVuZ2VyID0gbmV3IENhcmQoY2hhbGxlbmdlclgpXHJcbiAgY2hhbXBpb24gPSBuZXcgQ2FyZChjaGFtcGlvblgpXHJcblxyXG4gIGlmIGNoYWxsZW5nZXIuc3VpdCA9PSBjaGFtcGlvbi5zdWl0XHJcbiAgICAjIEVhc3kgY2FzZS4uLiBzYW1lIHN1aXQsIGp1c3QgdGVzdCB2YWx1ZVxyXG4gICAgcmV0dXJuIChjaGFsbGVuZ2VyLnZhbHVlID4gY2hhbXBpb24udmFsdWUpXHJcbiAgZWxzZVxyXG4gICAgaWYgY2hhbGxlbmdlci5zdWl0ID09IFN1aXQuU1BBREVTXHJcbiAgICAgICMgVHJ1bXAgZ3VhcmFudGVlZCB3aW5cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIGVsc2VcclxuICAgICAgIyBEdW1wIGd1YXJhbnRlZWQgbG9zc1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgcmV0dXJuIGZhbHNlXHJcblxyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIERlY2tcclxuXHJcbmNsYXNzIFNodWZmbGVkRGVja1xyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgIyBkYXQgaW5zaWRlLW91dCBzaHVmZmxlIVxyXG4gICAgQGNhcmRzID0gWyAwIF1cclxuICAgIGZvciBpIGluIFsxLi4uNTJdXHJcbiAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKVxyXG4gICAgICBAY2FyZHMucHVzaChAY2FyZHNbal0pXHJcbiAgICAgIEBjYXJkc1tqXSA9IGlcclxuXHJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgQmxhY2tvdXRcclxuXHJcbmNsYXNzIEJsYWNrb3V0XHJcbiAgY29uc3RydWN0b3I6IChAZ2FtZSwgcGFyYW1zKSAtPlxyXG4gICAgcmV0dXJuIGlmIG5vdCBwYXJhbXNcclxuXHJcbiAgICBpZiBwYXJhbXMuc3RhdGVcclxuICAgICAgZm9yIGssdiBvZiBwYXJhbXMuc3RhdGVcclxuICAgICAgICBpZiBwYXJhbXMuc3RhdGUuaGFzT3duUHJvcGVydHkoaylcclxuICAgICAgICAgIHRoaXNba10gPSBwYXJhbXMuc3RhdGVba11cclxuXHJcbiAgICAgICMgdGhpcyBjYW4gYmUgcmVtb3ZlZCBhdCBzb21lIHBvaW50XHJcbiAgICAgIGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuICAgICAgICBpZiBwbGF5ZXIuY2hhcmFjdGVyXHJcbiAgICAgICAgICBwbGF5ZXIuY2hhcklEID0gcGxheWVyLmNoYXJhY3Rlci5zcHJpdGVcclxuICAgICAgICAgIGRlbGV0ZSBwbGF5ZXJbXCJjaGFyYWN0ZXJcIl1cclxuICAgIGVsc2VcclxuICAgICAgIyBuZXcgZ2FtZVxyXG4gICAgICBAc3RhdGUgPSBTdGF0ZS5MT0JCWVxyXG4gICAgICBAcGxheWVycyA9IHBhcmFtcy5wbGF5ZXJzXHJcbiAgICAgIEBsb2cgPSBbXVxyXG4gICAgICBpZiBwYXJhbXMucm91bmRzID09ICdNJ1xyXG4gICAgICAgICMgbWFyYXRob24gbW9kZSFcclxuICAgICAgICBAcm91bmRzID0gWydNJ11cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEByb3VuZHMgPSAoTnVtYmVyKHYpIGZvciB2IGluIHBhcmFtcy5yb3VuZHMuc3BsaXQoXCJ8XCIpKVxyXG5cclxuICAgICAgQHBsYXllcnNbMF0uYmlkID0gMFxyXG4gICAgICBAcGxheWVyc1swXS50cmlja3MgPSAwXHJcbiAgICAgIEBwbGF5ZXJzWzBdLnNjb3JlID0gMFxyXG4gICAgICBAcGxheWVyc1swXS5pbmRleCA9IDBcclxuXHJcbiAgICAgIEBvdXRwdXQoQHBsYXllcnNbMF0ubmFtZSArICcgY3JlYXRlcyBnYW1lJylcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEJsYWNrb3V0IG1ldGhvZHNcclxuXHJcbiAgbWFyYXRob25Nb2RlOiAtPlxyXG4gICAgcmV0dXJuIChAcm91bmRzWzBdID09ICdNJylcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgIG5hbWVzID0gXCJiaWRzIGRlYWxlciBsb2cgbG93ZXN0UmVxdWlyZWQgbmV4dFJvdW5kIHBpbGUgcGlsZVdobyBwbGF5ZXJzIHByZXYgcHJldlRyaWNrVGFrZXIgcHJldldobyByb3VuZHMgc3RhdGUgdHJpY2tJRCB0cmlja1Rha2VyIHRyaWNrcyB0cnVtcEJyb2tlbiB0dXJuXCIuc3BsaXQoXCIgXCIpXHJcbiAgICBzdGF0ZSA9IHt9XHJcbiAgICBmb3IgbmFtZSBpbiBuYW1lc1xyXG4gICAgICBzdGF0ZVtuYW1lXSA9IHRoaXNbbmFtZV1cclxuICAgIHJldHVybiBzdGF0ZVxyXG5cclxuICBmaW5kUGxheWVyOiAoaWQpIC0+XHJcbiAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXHJcbiAgICAgIGlmIHBsYXllci5pZCA9PSBpZFxyXG4gICAgICAgIHJldHVybiBwbGF5ZXJcclxuICAgIHJldHVybiB1bmRlZmluZWRcclxuXHJcbiAgZmluZE93bmVyOiAtPlxyXG4gICAgcmV0dXJuIEBwbGF5ZXJzWzBdXHJcblxyXG4gIGN1cnJlbnRQbGF5ZXI6IC0+XHJcbiAgICByZXR1cm4gQHBsYXllcnNbQHR1cm5dXHJcblxyXG4gIGN1cnJlbnRTdWl0OiAtPlxyXG4gICAgaWYgQHBpbGUubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuIFN1aXQuTk9ORVxyXG5cclxuICAgIGNhcmQgPSBuZXcgQ2FyZChAcGlsZVswXSlcclxuICAgIHJldHVybiBjYXJkLnN1aXRcclxuXHJcbiAgcmVuYW1lOiAoaWQsIG5hbWUpIC0+XHJcbiAgICBwbGF5ZXIgPSBAZmluZFBsYXllcihpZClcclxuICAgIGlmIHBsYXllclxyXG4gICAgICBAb3V0cHV0KHBsYXllci5uYW1lICsgJyByZW5hbWVkIHRvICcgKyBuYW1lKVxyXG4gICAgICBwbGF5ZXIubmFtZSA9IG5hbWVcclxuXHJcbiAgcGxheWVySGFzU3VpdDogKHBsYXllciwgc3VpdCkgLT5cclxuICAgIGZvciB2IGluIHBsYXllci5oYW5kXHJcbiAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgICBpZiBjYXJkLnN1aXQgPT0gc3VpdFxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgcGxheWVySGFzT25seVNwYWRlczogKHBsYXllcikgLT5cclxuICAgIGZvciB2IGluIHBsYXllci5oYW5kXHJcbiAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgICBpZiBjYXJkLnN1aXQgIT0gU3VpdC5TUEFERVNcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBsYXllckNhbldpbkluU3VpdDogKHBsYXllciwgY2hhbXBpb25DYXJkKSAtPlxyXG4gICAgZm9yIHYgaW4gcGxheWVyLmhhbmRcclxuICAgICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICAgIGlmIGNhcmQuc3VpdCA9PSBjaGFtcGlvbkNhcmQuc3VpdFxyXG4gICAgICAgIGlmIGNhcmQudmFsdWUgPiBjaGFtcGlvbkNhcmQudmFsdWVcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgYmVzdEluUGlsZTogLT5cclxuICAgIGlmIEBwaWxlLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVybiAtMVxyXG4gICAgY3VycmVudFN1aXQgPSBAY3VycmVudFN1aXQoKVxyXG4gICAgYmVzdCA9IDBcclxuICAgIGZvciBpIGluIFsxLi4uQHBpbGUubGVuZ3RoXVxyXG4gICAgICBpZiBjYXJkQmVhdHMoQHBpbGVbaV0sIEBwaWxlW2Jlc3RdLCBjdXJyZW50U3VpdClcclxuICAgICAgICBiZXN0ID0gaVxyXG4gICAgcmV0dXJuIGJlc3RcclxuXHJcbiAgcGxheWVyQWZ0ZXI6IChpbmRleCkgLT5cclxuICAgIHJldHVybiAoaW5kZXggKyAxKSAlIEBwbGF5ZXJzLmxlbmd0aFxyXG5cclxuICBvdXRwdXQ6ICh0ZXh0KSAtPlxyXG4gICAgQGxvZy5wdXNoIHRleHRcclxuICAgIGlmIEBsb2cubGVuZ3RoID4gTUFYX0xPR19MSU5FU1xyXG4gICAgICBAbG9nLnNoaWZ0KClcclxuXHJcbiAgcmVzZXQ6IChwYXJhbXMpIC0+XHJcbiAgICBpZiBAcGxheWVycy5sZW5ndGggPCBNSU5fUExBWUVSU1xyXG4gICAgICByZXR1cm4gJ25vdEVub3VnaFBsYXllcnMnXHJcblxyXG4gICAgZm9yIHBsYXllciBpbiBAcGxheWVyc1xyXG4gICAgICBwbGF5ZXIuc2NvcmUgPSAwXHJcbiAgICAgIHBsYXllci5oYW5kID0gW11cclxuXHJcbiAgICBAbmV4dFJvdW5kID0gMFxyXG4gICAgQHRydW1wQnJva2VuID0gZmFsc2VcclxuICAgIEBwcmV2ID0gW11cclxuICAgIEBwaWxlID0gW11cclxuICAgIEBwaWxlV2hvID0gW11cclxuICAgIEBwcmV2V2hvID0gW11cclxuICAgIEBwcmV2VHJpY2tUYWtlciA9IC0xXHJcblxyXG4gICAgaWYgQG1hcmF0aG9uTW9kZSgpXHJcbiAgICAgIHJvdW5kQ291bnQgPSBcIk1hcmF0aG9uIG1vZGVcIlxyXG4gICAgZWxzZVxyXG4gICAgICByb3VuZENvdW50ID0gXCIje0Byb3VuZHMubGVuZ3RofSByb3VuZHNcIlxyXG4gICAgQG91dHB1dChcIk5ldyBnYW1lISAoI3tAcGxheWVycy5sZW5ndGh9IHBsYXllcnMsICN7cm91bmRDb3VudH0pXCIpXHJcblxyXG4gICAgQHN0YXJ0QmlkKClcclxuXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgc3RhcnRCaWQ6IChwYXJhbXMpIC0+XHJcbiAgICBpZiBAbWFyYXRob25Nb2RlKClcclxuICAgICAgaWYgQHBsYXllcnNbMF0uc2NvcmUgPiAwXHJcbiAgICAgICAgcmV0dXJuICdnYW1lT3ZlcidcclxuICAgICAgQHRyaWNrcyA9IDEzXHJcbiAgICBlbHNlXHJcbiAgICAgIGlmKEBuZXh0Um91bmQgPj0gQHJvdW5kcy5sZW5ndGgpXHJcbiAgICAgICAgcmV0dXJuICdnYW1lT3ZlcidcclxuICAgICAgQHRyaWNrcyA9IEByb3VuZHNbQG5leHRSb3VuZF1cclxuXHJcbiAgICBAbmV4dFJvdW5kKytcclxuXHJcbiAgICBpZiBAcHJldlRyaWNrVGFrZXIgPT0gLTFcclxuICAgICAgQGRlYWxlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEBwbGF5ZXJzLmxlbmd0aClcclxuICAgICAgQG91dHB1dCBcIlJhbmRvbWx5IGFzc2lnbmluZyBkZWFsZXIgdG8gI3tAcGxheWVyc1tAZGVhbGVyXS5uYW1lfVwiXHJcbiAgICBlbHNlXHJcbiAgICAgIEBkZWFsZXIgPSBAcHJldlRyaWNrVGFrZXJcclxuICAgICAgQG91dHB1dCBcIiN7QHBsYXllcnNbQGRlYWxlcl0ubmFtZX0gY2xhaW1lZCBsYXN0IHRyaWNrLCBkZWFsc1wiXHJcblxyXG4gICAgZGVjayA9IG5ldyBTaHVmZmxlZERlY2soKVxyXG4gICAgZm9yIHBsYXllciwgaSBpbiBAcGxheWVyc1xyXG4gICAgICBwbGF5ZXIuYmlkID0gLTFcclxuICAgICAgcGxheWVyLnRyaWNrcyA9IDBcclxuXHJcbiAgICAgIEBnYW1lLmxvZyBcImRlYWxpbmcgI3tAdHJpY2tzfSBjYXJkcyB0byBwbGF5ZXIgI3tpfVwiXHJcblxyXG4gICAgICBwbGF5ZXIuaGFuZCA9IFtdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQHRyaWNrc11cclxuICAgICAgICBwbGF5ZXIuaGFuZC5wdXNoKGRlY2suY2FyZHMuc2hpZnQoKSlcclxuXHJcbiAgICAgIHBsYXllci5oYW5kLnNvcnQgKGEsYikgLT4gcmV0dXJuIGEgLSBiXHJcblxyXG4gICAgQHN0YXRlID0gU3RhdGUuQklEXHJcbiAgICBAdHVybiA9IEBwbGF5ZXJBZnRlcihAZGVhbGVyKVxyXG4gICAgQGJpZHMgPSAwXHJcbiAgICBAcGlsZSA9IFtdXHJcbiAgICBAcGlsZVdobyA9IFtdXHJcbiAgICBAcHJldiA9IFtdXHJcbiAgICBAcHJldldobyA9IFtdXHJcbiAgICBAcHJldlRyaWNrVGFrZXIgPSAtMVxyXG5cclxuICAgIEBvdXRwdXQoJ1JvdW5kICcgKyBAbmV4dFJvdW5kICsgJyBiZWdpbnMgJyArIEBwbGF5ZXJzW0B0dXJuXS5uYW1lICsgJyBiaWRzIGZpcnN0JylcclxuXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgZW5kQmlkOiAtPlxyXG4gICAgbG93ZXN0UGxheWVyID0gMFxyXG4gICAgbG93ZXN0Q2FyZCA9IEBwbGF5ZXJzWzBdLmhhbmRbMF0gIyBoYW5kIGlzIHNvcnRlZCwgdGhlcmVmb3JlIGhhbmRbMF0gaXMgdGhlIGxvd2VzdFxyXG4gICAgZm9yIGkgaW4gWzEuLi5AcGxheWVycy5sZW5ndGhdXHJcbiAgICAgIHBsYXllciA9IEBwbGF5ZXJzW2ldXHJcbiAgICAgIGlmIHBsYXllci5oYW5kWzBdIDwgbG93ZXN0Q2FyZFxyXG4gICAgICAgIGxvd2VzdFBsYXllciA9IGlcclxuICAgICAgICBsb3dlc3RDYXJkID0gcGxheWVyLmhhbmRbMF1cclxuXHJcbiAgICBAbG93ZXN0UmVxdWlyZWQgPSB0cnVlICMgTmV4dCBwbGF5ZXIgaXMgb2JsaWdhdGVkIHRvIHRocm93IHRoZSBsb3dlc3QgY2FyZFxyXG4gICAgQHR1cm4gPSBsb3dlc3RQbGF5ZXJcclxuICAgIEB0cnVtcEJyb2tlbiA9IGZhbHNlXHJcbiAgICBAdHJpY2tJRCA9IDBcclxuICAgIEBzdGFydFRyaWNrKClcclxuXHJcbiAgc3RhcnRUcmljazogKCkgLT5cclxuICAgICMgQHR1cm4gc2hvdWxkIGFscmVhZHkgYmUgY29ycmVjdCwgZWl0aGVyIGZyb20gZW5kQmlkIChsb3dlc3QgY2x1Yikgb3IgZW5kVHJpY2sgKGxhc3QgdHJpY2tUYWtlcilcclxuXHJcbiAgICBAdHJpY2tUYWtlciA9IC0xXHJcbiAgICBAc3RhdGUgPSBTdGF0ZS5UUklDS1xyXG5cclxuICAgIHJldHVybiBPS1xyXG5cclxuICBlbmRUcmljazogLT5cclxuICAgIHRha2VyID0gQHBsYXllcnNbQHRyaWNrVGFrZXJdXHJcbiAgICB0YWtlci50cmlja3MrK1xyXG5cclxuICAgIEBvdXRwdXQodGFrZXIubmFtZSArICcgcG9ja2V0cyB0aGUgdHJpY2sgWycgKyB0YWtlci50cmlja3MgKyAnXScpXHJcbiAgICBAcHJldlRyaWNrVGFrZXIgPSBAdHJpY2tUYWtlclxyXG4gICAgQHR1cm4gPSBAdHJpY2tUYWtlclxyXG4gICAgQHByZXYgPSBAcGlsZVxyXG4gICAgQHByZXZXaG8gPSBAcGlsZVdob1xyXG4gICAgQHBpbGUgPSBbXVxyXG4gICAgQHBpbGVXaG8gPSBbXVxyXG4gICAgQHRyaWNrSUQrK1xyXG5cclxuICAgIGlmIEBwbGF5ZXJzWzBdLmhhbmQubGVuZ3RoID4gMFxyXG4gICAgICBAc3RhcnRUcmljaygpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJvdW5kQ291bnQgPSBAcm91bmRzLmxlbmd0aFxyXG4gICAgICBpZiBAbWFyYXRob25Nb2RlKClcclxuICAgICAgICByb3VuZENvdW50ID0gXCJNXCJcclxuICAgICAgQG91dHB1dCgnUm91bmQgZW5kcyBbJyArIEBuZXh0Um91bmQgKyAnLycgKyByb3VuZENvdW50ICsgJ10nKVxyXG5cclxuICAgICAgZm9yIHBsYXllciBpbiBAcGxheWVyc1xyXG4gICAgICAgIG92ZXJVbmRlciA9IHBsYXllci5iaWQgLSBwbGF5ZXIudHJpY2tzXHJcbiAgICAgICAgaWYgb3ZlclVuZGVyIDwgMFxyXG4gICAgICAgICAgb3ZlclVuZGVyICo9IC0xXHJcblxyXG4gICAgICAgIHBlbmFsdHlQb2ludHMgPSAwXHJcbiAgICAgICAgc3RlcCA9IDFcclxuICAgICAgICB3aGlsZSBvdmVyVW5kZXIgPiAwXHJcbiAgICAgICAgICBwZW5hbHR5UG9pbnRzICs9IHN0ZXArKyAjIGRhdCBxdWFkcmF0aWNcclxuICAgICAgICAgIG92ZXJVbmRlci0tXHJcblxyXG4gICAgICAgIHBsYXllci5zY29yZSArPSBwZW5hbHR5UG9pbnRzXHJcblxyXG4gICAgICAgIHBsYXllci5sYXN0V2VudCA9IFN0cmluZyhwbGF5ZXIudHJpY2tzKSArICcvJyArIFN0cmluZyhwbGF5ZXIuYmlkKVxyXG4gICAgICAgIHBsYXllci5sYXN0UG9pbnRzID0gcGVuYWx0eVBvaW50c1xyXG5cclxuICAgICAgZ2FtZUVuZGluZyA9IGZhbHNlXHJcbiAgICAgIGlmIEBtYXJhdGhvbk1vZGUoKVxyXG4gICAgICAgIGdhbWVFbmRpbmcgPSAoQHBsYXllcnNbMF0uc2NvcmUgPiAwKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZ2FtZUVuZGluZyA9IChAbmV4dFJvdW5kID49IEByb3VuZHMubGVuZ3RoKVxyXG5cclxuICAgICAgaWYgZ2FtZUVuZGluZ1xyXG4gICAgICAgIEBzdGF0ZSA9IFN0YXRlLlBPU1RHQU1FU1VNTUFSWVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQHN0YXRlID0gU3RhdGUuUk9VTkRTVU1NQVJZXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBCbGFja291dCBhY3Rpb25zXHJcblxyXG4gIHF1aXQ6IChwYXJhbXMpIC0+XHJcbiAgICBAc3RhdGUgPSBTdGF0ZS5QT1NUR0FNRVNVTU1BUllcclxuICAgIEBvdXRwdXQoJ1NvbWVvbmUgcXVpdCBCbGFja291dCBvdmVyJylcclxuXHJcbiAgbmV4dDogKHBhcmFtcykgLT5cclxuICAgIHN3aXRjaCBAc3RhdGVcclxuICAgICAgd2hlbiBTdGF0ZS5MT0JCWSAgICAgICAgICAgdGhlbiByZXR1cm4gQHJlc2V0KHBhcmFtcylcclxuICAgICAgd2hlbiBTdGF0ZS5CSURTVU1NQVJZICAgICAgdGhlbiByZXR1cm4gQHN0YXJ0VHJpY2soKVxyXG4gICAgICB3aGVuIFN0YXRlLlJPVU5EU1VNTUFSWSAgICB0aGVuIHJldHVybiBAc3RhcnRCaWQoKVxyXG4gICAgICB3aGVuIFN0YXRlLlBPU1RHQU1FU1VNTUFSWSB0aGVuIHJldHVybiAnZ2FtZU92ZXInXHJcbiAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnbm9OZXh0J1xyXG4gICAgcmV0dXJuICduZXh0SXNDb25mdXNlZCdcclxuXHJcbiAgYmlkOiAocGFyYW1zKSAtPlxyXG4gICAgaWYgQHN0YXRlICE9IFN0YXRlLkJJRFxyXG4gICAgICByZXR1cm4gJ25vdEJpZGRpbmdOb3cnXHJcblxyXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcclxuICAgIGlmIHBhcmFtcy5pZCAhPSBjdXJyZW50UGxheWVyLmlkXHJcbiAgICAgIHJldHVybiAnbm90WW91clR1cm4nXHJcblxyXG4gICAgcGFyYW1zLmJpZCA9IE51bWJlcihwYXJhbXMuYmlkKVxyXG5cclxuICAgIGlmIChwYXJhbXMuYmlkIDwgMCkgfHwgKHBhcmFtcy5iaWQgPiBAdHJpY2tzKVxyXG4gICAgICByZXR1cm4gJ2JpZE91dE9mUmFuZ2UnXHJcblxyXG4gICAgaWYgQHR1cm4gPT0gQGRlYWxlclxyXG4gICAgICBpZiAoQGJpZHMgKyBwYXJhbXMuYmlkKSA9PSBAdHJpY2tzXHJcbiAgICAgICAgcmV0dXJuICdkZWFsZXJGdWNrZWQnXHJcblxyXG4gICAgICBAZW5kQmlkKClcclxuICAgIGVsc2VcclxuICAgICAgQHR1cm4gPSBAcGxheWVyQWZ0ZXIoQHR1cm4pXHJcblxyXG4gICAgY3VycmVudFBsYXllci5iaWQgPSBwYXJhbXMuYmlkXHJcbiAgICBAYmlkcyArPSBjdXJyZW50UGxheWVyLmJpZFxyXG4gICAgQG91dHB1dChjdXJyZW50UGxheWVyLm5hbWUgKyBcIiBiaWRzIFwiICsgY3VycmVudFBsYXllci5iaWQpXHJcblxyXG4gICAgaWYgQHN0YXRlICE9IFN0YXRlLkJJRFxyXG4gICAgICAjIEJpZGRpbmcgZW5kZWRcclxuICAgICAgQG91dHB1dCgnQmlkZGluZyBlbmRzICcgKyBAYmlkcyArICcvJyArIEB0cmlja3MgKyAnICcgKyBAcGxheWVyc1tAdHVybl0ubmFtZSArICcgdGhyb3dzIGZpcnN0JylcclxuXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgYWRkUGxheWVyOiAocGxheWVyKSAtPlxyXG4gICAgcGxheWVyLmJpZCA9IDBcclxuICAgIHBsYXllci50cmlja3MgPSAwXHJcbiAgICBwbGF5ZXIuc2NvcmUgPSAwXHJcbiAgICBpZiBub3QgcGxheWVyLmFpXHJcbiAgICAgIHBsYXllci5haSA9IGZhbHNlXHJcblxyXG4gICAgQHBsYXllcnMucHVzaCBwbGF5ZXJcclxuICAgIHBsYXllci5pbmRleCA9IEBwbGF5ZXJzLmxlbmd0aCAtIDFcclxuICAgICMgQG91dHB1dChwbGF5ZXIubmFtZSArIFwiIGpvaW5zIGdhbWUgKFwiICsgQHBsYXllcnMubGVuZ3RoICsgXCIpXCIpXHJcblxyXG4gIG5hbWVQcmVzZW50OiAobmFtZSkgLT5cclxuICAgIGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuICAgICAgaWYgcGxheWVyLm5hbWUgPT0gbmFtZVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIGFkZEFJOiAtPlxyXG4gICAgbG9vcFxyXG4gICAgICBjaGFyYWN0ZXIgPSByYW5kb21DaGFyYWN0ZXIoKVxyXG4gICAgICBpZiBub3QgQG5hbWVQcmVzZW50KGNoYXJhY3Rlci5uYW1lKVxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgYWkgPVxyXG4gICAgICBjaGFySUQ6IGNoYXJhY3Rlci5pZFxyXG4gICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZVxyXG4gICAgICBpZDogJ2FpJyArIFN0cmluZyhAcGxheWVycy5sZW5ndGgpXHJcbiAgICAgIGFpOiB0cnVlXHJcblxyXG4gICAgQGFkZFBsYXllcihhaSlcclxuXHJcbiAgICBAZ2FtZS5sb2coXCJhZGRlZCBBSSBwbGF5ZXJcIilcclxuICAgIHJldHVybiBPS1xyXG5cclxuICBjYW5QbGF5OiAocGFyYW1zKSAtPlxyXG4gICAgaWYgQHN0YXRlICE9IFN0YXRlLlRSSUNLXHJcbiAgICAgIHJldHVybiAnbm90SW5UcmljaydcclxuXHJcbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxyXG4gICAgaWYgcGFyYW1zLmlkICE9IGN1cnJlbnRQbGF5ZXIuaWRcclxuICAgICAgcmV0dXJuICdub3RZb3VyVHVybidcclxuXHJcbiAgICBpZiBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3doaWNoJylcclxuICAgICAgcGFyYW1zLndoaWNoID0gTnVtYmVyKHBhcmFtcy53aGljaClcclxuICAgICAgcGFyYW1zLmluZGV4ID0gLTFcclxuICAgICAgZm9yIGNhcmQsIGkgaW4gY3VycmVudFBsYXllci5oYW5kXHJcbiAgICAgICAgaWYgY2FyZCA9PSBwYXJhbXMud2hpY2hcclxuICAgICAgICAgIHBhcmFtcy5pbmRleCA9IGlcclxuICAgICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBpZiBwYXJhbXMuaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm4gJ2RvTm90SGF2ZSdcclxuICAgIGVsc2VcclxuICAgICAgcGFyYW1zLmluZGV4ID0gTnVtYmVyKHBhcmFtcy5pbmRleClcclxuXHJcbiAgICBpZiAocGFyYW1zLmluZGV4IDwgMCkgfHwgKHBhcmFtcy5pbmRleCA+PSBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoKVxyXG4gICAgICByZXR1cm4gJ2luZGV4T3V0T2ZSYW5nZSdcclxuXHJcbiAgICBpZiBAbG93ZXN0UmVxdWlyZWQgJiYgKHBhcmFtcy5pbmRleCAhPSAwKVxyXG4gICAgICByZXR1cm4gJ2xvd2VzdENhcmRSZXF1aXJlZCdcclxuXHJcbiAgICBjaG9zZW5DYXJkWCA9IGN1cnJlbnRQbGF5ZXIuaGFuZFtwYXJhbXMuaW5kZXhdXHJcbiAgICBjaG9zZW5DYXJkID0gbmV3IENhcmQoY2hvc2VuQ2FyZFgpXHJcblxyXG4gICAgaWYoKCFAdHJ1bXBCcm9rZW4pICYmICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGF0IHRydW1wIGlzIGJyb2tlblxyXG4gICAgKEBwaWxlLmxlbmd0aCA9PSAwKSAmJiAgICAgICAgICAgICAgICAgICAjIGJlZm9yZSBhbGxvd2luZyBzb21lb25lIHRvIGxlYWRcclxuICAgIChjaG9zZW5DYXJkLnN1aXQgPT0gU3VpdC5TUEFERVMpICYmICAgICAgIyB3aXRoIHNwYWRlc1xyXG4gICAgKCFAcGxheWVySGFzT25seVNwYWRlcyhjdXJyZW50UGxheWVyKSkpICAjIHVubGVzcyBpdCBpcyBhbGwgdGhleSBoYXZlXHJcbiAgICAgIHJldHVybiAndHJ1bXBOb3RCcm9rZW4nXHJcblxyXG4gICAgYmVzdEluZGV4ID0gQGJlc3RJblBpbGUoKVxyXG4gICAgZm9yY2VkU3VpdCA9IEBjdXJyZW50U3VpdCgpXHJcbiAgICBpZiBmb3JjZWRTdWl0ICE9IFN1aXQuTk9ORSAjIHNhZmUgdG8gYXNzdW1lIChiZXN0SW5kZXggIT0gLTEpIGluIHRoaXMgYmxvY2tcclxuICAgICAgaWYgQHBsYXllckhhc1N1aXQoY3VycmVudFBsYXllciwgZm9yY2VkU3VpdClcclxuICAgICAgICAjIFlvdSBtdXN0IHRocm93IGluLXN1aXQgaWYgeW91IGhhdmUgb25lIG9mIHRoYXQgc3VpdFxyXG4gICAgICAgIGlmIGNob3NlbkNhcmQuc3VpdCAhPSBmb3JjZWRTdWl0XHJcbiAgICAgICAgICByZXR1cm4gJ2ZvcmNlZEluU3VpdCdcclxuXHJcbiAgICAgICAgIyBJZiB0aGUgY3VycmVudCB3aW5uZXIgaXMgd2lubmluZyBpbi1zdWl0LCB5b3UgbXVzdCB0cnkgdG8gYmVhdCB0aGVtIGluLXN1aXRcclxuICAgICAgICBjdXJyZW50V2lubmluZ0NhcmRYID0gQHBpbGVbYmVzdEluZGV4XVxyXG4gICAgICAgIGN1cnJlbnRXaW5uaW5nQ2FyZCA9IG5ldyBDYXJkKGN1cnJlbnRXaW5uaW5nQ2FyZFgpXHJcbiAgICAgICAgaWYgY3VycmVudFdpbm5pbmdDYXJkLnN1aXQgPT0gZm9yY2VkU3VpdFxyXG4gICAgICAgICAgaWYoKCFjYXJkQmVhdHMoY2hvc2VuQ2FyZFgsIGN1cnJlbnRXaW5uaW5nQ2FyZFgsIGZvcmNlZFN1aXQpKSAmJlxyXG4gICAgICAgICAgKEBwbGF5ZXJDYW5XaW5JblN1aXQoY3VycmVudFBsYXllciwgY3VycmVudFdpbm5pbmdDYXJkKSkpXHJcbiAgICAgICAgICAgIHJldHVybiAnZm9yY2VkSGlnaGVySW5TdWl0J1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBDdXJyZW50IHBsYXllciBkb2Vzbid0IGhhdmUgdGhhdCBzdWl0LCBkb24ndCBib3RoZXJcclxuICAgICAgICBmb3JjZWRTdWl0ID0gU3VpdC5OT05FXHJcblxyXG4gICAgcmV0dXJuIE9LXHJcblxyXG4gIHBsYXk6IChwYXJhbXMpIC0+XHJcbiAgICBjYW5QbGF5Q2FyZCA9IEBjYW5QbGF5KHBhcmFtcylcclxuICAgIGlmIGNhblBsYXlDYXJkICE9IE9LXHJcbiAgICAgIHJldHVybiBjYW5QbGF5Q2FyZFxyXG5cclxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXHJcblxyXG4gICAgaWYgcGFyYW1zLmhhc093blByb3BlcnR5KCd3aGljaCcpXHJcbiAgICAgIHBhcmFtcy53aGljaCA9IE51bWJlcihwYXJhbXMud2hpY2gpXHJcbiAgICAgIHBhcmFtcy5pbmRleCA9IC0xXHJcbiAgICAgIGZvciBjYXJkLCBpIGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxyXG4gICAgICAgIGlmIGNhcmQgPT0gcGFyYW1zLndoaWNoXHJcbiAgICAgICAgICBwYXJhbXMuaW5kZXggPSBpXHJcbiAgICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgcGFyYW1zLmluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuICdkb05vdEhhdmUnXHJcbiAgICBlbHNlXHJcbiAgICAgIHBhcmFtcy5pbmRleCA9IE51bWJlcihwYXJhbXMuaW5kZXgpXHJcblxyXG4gICAgY2hvc2VuQ2FyZFggPSBjdXJyZW50UGxheWVyLmhhbmRbcGFyYW1zLmluZGV4XVxyXG4gICAgY2hvc2VuQ2FyZCA9IG5ldyBDYXJkKGNob3NlbkNhcmRYKVxyXG5cclxuICAgICMgSWYgeW91IGdldCBoZXJlLCB5b3UgY2FuIHRocm93IHdoYXRldmVyIHlvdSB3YW50LCBhbmQgaXRcclxuICAgICMgd2lsbCBlaXRoZXIgcHV0IHlvdSBpbiB0aGUgbGVhZCwgdHJ1bXAsIG9yIGR1bXAuXHJcblxyXG4gICAgQGxvd2VzdFJlcXVpcmVkID0gZmFsc2VcclxuXHJcbiAgICAjIFRocm93IHRoZSBjYXJkIG9uIHRoZSBwaWxlLCBhZHZhbmNlIHRoZSB0dXJuXHJcbiAgICBAcGlsZS5wdXNoKGN1cnJlbnRQbGF5ZXIuaGFuZFtwYXJhbXMuaW5kZXhdKVxyXG4gICAgQHBpbGVXaG8ucHVzaChAdHVybilcclxuICAgIGN1cnJlbnRQbGF5ZXIuaGFuZC5zcGxpY2UocGFyYW1zLmluZGV4LCAxKVxyXG5cclxuICAgICMgUmVjYWxjdWxhdGUgYmVzdCBpbmRleFxyXG4gICAgYmVzdEluZGV4ID0gQGJlc3RJblBpbGUoKVxyXG4gICAgaWYgYmVzdEluZGV4ID09IChAcGlsZS5sZW5ndGggLSAxKVxyXG4gICAgICAjIFRoZSBjYXJkIHRoaXMgcGxheWVyIGp1c3QgdGhyZXcgaXMgdGhlIGJlc3QgY2FyZC4gQ2xhaW0gdGhlIHRyaWNrLlxyXG4gICAgICBAdHJpY2tUYWtlciA9IEB0dXJuXHJcblxyXG4gICAgaWYgQHBpbGUubGVuZ3RoID09IDFcclxuICAgICAgbXNnID0gY3VycmVudFBsYXllci5uYW1lICsgXCIgbGVhZHMgd2l0aCBcIiArIGNob3NlbkNhcmQubmFtZVxyXG4gICAgZWxzZVxyXG4gICAgICBpZiBAdHJpY2tUYWtlciA9PSBAdHVyblxyXG4gICAgICAgIG1zZyA9IGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIGNsYWltcyB0aGUgdHJpY2sgd2l0aCBcIiArIGNob3NlbkNhcmQubmFtZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbXNnID0gY3VycmVudFBsYXllci5uYW1lICsgXCIgZHVtcHMgXCIgKyBjaG9zZW5DYXJkLm5hbWVcclxuXHJcbiAgICBpZigoIUB0cnVtcEJyb2tlbikgJiYgKGNob3NlbkNhcmQuc3VpdCA9PSBTdWl0LlNQQURFUykpXHJcbiAgICAgIG1zZyArPSBcIiAodHJ1bXAgYnJva2VuKVwiXHJcbiAgICAgIEB0cnVtcEJyb2tlbiA9IHRydWVcclxuXHJcbiAgICBAb3V0cHV0KG1zZylcclxuXHJcbiAgICBpZiBAcGlsZS5sZW5ndGggPT0gQHBsYXllcnMubGVuZ3RoXHJcbiAgICAgIEBlbmRUcmljaygpXHJcbiAgICBlbHNlXHJcbiAgICAgIEB0dXJuID0gQHBsYXllckFmdGVyKEB0dXJuKVxyXG5cclxuICAgIHJldHVybiBPS1xyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgQUlcclxuXHJcbiAgIyBIZWxwZXIgZnVuY3Rpb24gdG8gYmlkIHJlYXNvbmluZyBmb3IgYmlkZGluZyBpIHRyaWNrc1xyXG4gIGFpTG9nQmlkOiAoaSwgd2h5KSAtPlxyXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcclxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXHJcbiAgICBAYWlMb2coJ3BvdGVudGlhbCB3aW5uZXI6ICcgKyBjYXJkLm5hbWUgKyAnIFsnICsgd2h5ICsgJ10nKVxyXG5cclxuICAjIEhlbHBlciBmdW5jdGlvbiB0byBiaWQgcmVhc29uaW5nIGZvciBwbGF5aW5nIGNhcmQgaW5kZXggaVxyXG4gIGFpTG9nUGxheTogKGksIHdoeSkgLT5cclxuICAgIGlmIGkgPT0gLTFcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcclxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXHJcbiAgICBAYWlMb2coJ2Jlc3RQbGF5OiAnICsgY2FyZC5uYW1lICsgJyBbJyArIHdoeSArICddJylcclxuXHJcbiAgIyBBdHRlbXB0cyB0byBiaWQgaSB0cmlja3NcclxuICBhaUJpZDogKGN1cnJlbnRQbGF5ZXIsIGkpIC0+XHJcbiAgICByZXBseSA9IEBiaWQoeydpZCc6Y3VycmVudFBsYXllci5pZCwgJ2JpZCc6aX0pXHJcbiAgICBpZiByZXBseSA9PSBPS1xyXG4gICAgICBAZ2FtZS5sb2coXCJBSTogXCIgKyBjdXJyZW50UGxheWVyLm5hbWUgKyBcIiBiaWRzIFwiICsgU3RyaW5nKGkpKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMgQXR0ZW1wdHMgdG8gcGxheSBjYXJkIGluZGV4IGlcclxuICBhaVBsYXk6IChjdXJyZW50UGxheWVyLCBpKSAtPlxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKGN1cnJlbnRQbGF5ZXIuaGFuZFtpXSlcclxuICAgICMgQGdhbWUubG9nIFwiYWlQbGF5OiAje2l9XCJcclxuICAgIHJlcGx5ID0gQHBsYXkoeydpZCc6Y3VycmVudFBsYXllci5pZCwgJ2luZGV4JzppfSlcclxuICAgIGlmIHJlcGx5ID09IE9LXHJcbiAgICAgIEBnYW1lLmxvZyhcIkFJOiBcIiArIGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIHBsYXlzIFwiICsgY2FyZC5uYW1lKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBpZiByZXBseSA9PSAnZGVhbGVyRnVja2VkJ1xyXG4gICAgICAgIEBvdXRwdXQoY3VycmVudFBsYXllci5uYW1lICsgJyBzYXlzIFwiSSBoYXRlIGJlaW5nIHRoZSBkZWFsZXIuXCInKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMgVHJpZXMgdG8gcGxheSBsb3dlc3QgY2FyZHMgZmlyc3QgKG1vdmVzIHJpZ2h0KVxyXG4gIGFpUGxheUxvdzogKGN1cnJlbnRQbGF5ZXIsIHN0YXJ0aW5nUG9pbnQpIC0+XHJcbiAgICBmb3IgaSBpbiBbc3RhcnRpbmdQb2ludC4uLmN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGhdXHJcbiAgICAgIGlmIEBhaVBsYXkoY3VycmVudFBsYXllciwgaSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgZm9yIGkgaW4gWzAuLi5zdGFydGluZ1BvaW50XVxyXG4gICAgICBpZiBAYWlQbGF5KGN1cnJlbnRQbGF5ZXIsIGkpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIFRyaWVzIHRvIHBsYXkgaGlnaGVzdCBjYXJkcyBmaXJzdCAobW92ZXMgbGVmdClcclxuICBhaVBsYXlIaWdoOiAoY3VycmVudFBsYXllciwgc3RhcnRpbmdQb2ludCkgLT5cclxuICAgIGZvciBpIGluIFtzdGFydGluZ1BvaW50Li4wXSBieSAtMVxyXG4gICAgICBpZihAYWlQbGF5KGN1cnJlbnRQbGF5ZXIsIGkpKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICBmb3IgaSBpbiBbY3VycmVudFBsYXllci5oYW5kLmxlbmd0aC0xLi4uc3RhcnRpbmdQb2ludF0gYnkgLTFcclxuICAgICAgaWYgQGFpUGxheShjdXJyZW50UGxheWVyLCBpKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyBHZW5lcmljIGxvZ2dpbmcgZnVuY3Rpb247IHByZXBlbmRzIGN1cnJlbnQgQUkgcGxheWVyJ3MgZ3V0cyBiZWZvcmUgcHJpbnRpbmcgdGV4dFxyXG4gIGFpTG9nOiAodGV4dCkgLT5cclxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXHJcbiAgICBpZiBub3QgY3VycmVudFBsYXllci5haVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbY3VycmVudFBsYXllci5jaGFySURdXHJcbiAgICBAZ2FtZS5sb2coJ0FJWycrY3VycmVudFBsYXllci5uYW1lKycgJytjdXJyZW50UGxheWVyLnRyaWNrcysnLycrY3VycmVudFBsYXllci5iaWQrJyAnK2NoYXJhY3Rlci5icmFpbisnXTogaGFuZDonK3N0cmluZ2lmeUNhcmRzKGN1cnJlbnRQbGF5ZXIuaGFuZCkrJyBwaWxlOicrc3RyaW5naWZ5Q2FyZHMoQHBpbGUpKycgJyt0ZXh0KVxyXG5cclxuICAjIERldGVjdHMgaWYgdGhlIGN1cnJlbnQgcGxheWVyIGlzIEFJIGR1cmluZyBhIEJJRCBvciBUUklDSyBwaGFzZSBhbmQgYWN0cyBhY2NvcmRpbmcgdG8gdGhlaXIgJ2JyYWluJ1xyXG4gIGFpVGljazogLT5cclxuICAgIGlmIChAc3RhdGUgIT0gU3RhdGUuQklEKSAmJiAoQHN0YXRlICE9IFN0YXRlLlRSSUNLKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxyXG4gICAgaWYgbm90IGN1cnJlbnRQbGF5ZXIuYWlcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICMgQmlkZGluZ1xyXG5cclxuICAgIGlmIEBzdGF0ZSA9PSBTdGF0ZS5CSURcclxuICAgICAgQGFpTG9nKFwiYWJvdXQgdG8gY2FsbCBicmFpbi5iaWRcIilcclxuICAgICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2N1cnJlbnRQbGF5ZXIuY2hhcklEXVxyXG4gICAgICBiaWQgPSBAYnJhaW5zW2NoYXJhY3Rlci5icmFpbl0uYmlkLmFwcGx5KHRoaXMsIFtjdXJyZW50UGxheWVyXSlcclxuXHJcbiAgICAgICMgVHJ5IHRvIGJpZCBhcyBjbG9zZSBhcyB5b3UgY2FuIHRvIHRoZSAnYmVzdCBiaWQnXHJcbiAgICAgIEBhaUxvZygnYmlkOicrU3RyaW5nKGJpZCkpXHJcbiAgICAgIGlmIEBhaUJpZChjdXJyZW50UGxheWVyLCBiaWQpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgaWYgQGFpQmlkKGN1cnJlbnRQbGF5ZXIsIGJpZC0xKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIGlmIEBhaUJpZChjdXJyZW50UGxheWVyLCBiaWQrMSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkLTIpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgaWYgQGFpQmlkKGN1cnJlbnRQbGF5ZXIsIGJpZCsyKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAjIEdpdmUgdXAgYW5kIGJpZCB3aGF0ZXZlciBpcyBhbGxvd2VkXHJcbiAgICAgIGZvciBpIGluIFswLi4uY3VycmVudFBsYXllci5oYW5kLmxlbmd0aF1cclxuICAgICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgaSlcclxuICAgICAgICAgIEBhaUxvZygnZ2F2ZSB1cCBhbmQgYmlkOicrU3RyaW5nKGkpKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBQbGF5aW5nXHJcblxyXG4gICAgaWYgQHN0YXRlID09IFN0YXRlLlRSSUNLXHJcbiAgICAgIEBhaUxvZyhcImFib3V0IHRvIGNhbGwgYnJhaW4ucGxheVwiKVxyXG4gICAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbY3VycmVudFBsYXllci5jaGFySURdXHJcbiAgICAgIHBsYXllZENhcmQgPSBAYnJhaW5zW2NoYXJhY3Rlci5icmFpbl0ucGxheS5hcHBseSh0aGlzLCBbY3VycmVudFBsYXllcl0pXHJcbiAgICAgIGlmIHBsYXllZENhcmRcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQGFpTG9nKCdicmFpbiBmYWlsZWQgdG8gcGxheSBjYXJkOiBwaWNraW5nIHJhbmRvbSBjYXJkIHRvIHBsYXknKVxyXG4gICAgICAgIHN0YXJ0aW5nUG9pbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoKVxyXG4gICAgICAgIHJldHVybiBAYWlQbGF5TG93KGN1cnJlbnRQbGF5ZXIsIHN0YXJ0aW5nUG9pbnQpXHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIEFJIEJyYWluc1xyXG5cclxuICAjIEJyYWlucyBtdXN0IGhhdmU6XHJcbiAgIyAqIGlkOiBpbnRlcm5hbCBpZGVudGlmaWVyIGZvciB0aGUgYnJhaW5cclxuICAjICogbmFtZTogcHJldHR5IG5hbWVcclxuICAjICogYmlkKGN1cnJlbnRQbGF5ZXIpIHJldHVybnMgdGhlIGJpZCB2YWx1ZSBiZXR3ZWVuIFswIC0gaGFuZFNpemVdLlxyXG4gICMgKiBwbGF5KGN1cnJlbnRQbGF5ZXIpIGF0dGVtcHRzIHRvIHBsYXkgYSBjYXJkIGJ5IGNhbGxpbmcgYWlQbGF5KCkuIFNob3VsZCByZXR1cm4gdHJ1ZSBpZiBpdCBzdWNjZXNzZnVsbHkgcGxheWVkIGEgY2FyZCAoYWlQbGF5KCkgcmV0dXJuZWQgdHJ1ZSlcclxuICBicmFpbnM6XHJcblxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICMgTm9ybWFsOiBJbnRlbmRlZCB0byBiZSB1c2VkIGJ5IG1vc3QgY2hhcmFjdGVycy5cclxuICAgICMgICAgICAgICBOb3QgdG9vIGR1bWIsIG5vdCB0b28gc21hcnQuXHJcbiAgICBub3JtYWw6XHJcbiAgICAgIGlkOiAgIFwibm9ybWFsXCJcclxuICAgICAgbmFtZTogXCJOb3JtYWxcIlxyXG5cclxuICAgICAgIyBub3JtYWxcclxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICAjIENhcmRzIFJlcHJlc2VudGVkIChob3cgbWFueSBvdXQgb2YgdGhlIGRlY2sgYXJlIGluIHBsYXk/KVxyXG4gICAgICAgIGhhbmRTaXplID0gY3VycmVudFBsYXllci5oYW5kLmxlbmd0aFxyXG4gICAgICAgIGNyID0gQHBsYXllcnMubGVuZ3RoICogaGFuZFNpemVcclxuICAgICAgICAjY3JwID0gTWF0aC5mbG9vcigoY3IgKiAxMDApIC8gNTIpXHJcblxyXG4gICAgICAgIGJpZCA9IDBcclxuICAgICAgICBwYXJ0aWFsU3BhZGVzID0gMFxyXG4gICAgICAgIHBhcnRpYWxGYWNlcyA9IDAgIyBub24gc3BhZGUgZmFjZSBjYXJkc1xyXG4gICAgICAgIGZvciB2LCBpIGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxyXG4gICAgICAgICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICAgICAgICBpZiBjYXJkLnN1aXQgPT0gU3VpdC5TUEFERVNcclxuICAgICAgICAgICAgaWYgY3IgPiA0MCAjIEFsbW9zdCBhbGwgY2FyZHMgaW4gcGxheVxyXG4gICAgICAgICAgICAgIGlmIGNhcmQudmFsdWUgPj0gNiAjIDhTIG9yIGhpZ2hlclxyXG4gICAgICAgICAgICAgICAgYmlkKytcclxuICAgICAgICAgICAgICAgIEBhaUxvZ0JpZChpLCAnOFMgb3IgYmlnZ2VyJylcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcGFydGlhbFNwYWRlcysrXHJcbiAgICAgICAgICAgICAgICBpZiBwYXJ0aWFsU3BhZGVzID4gMVxyXG4gICAgICAgICAgICAgICAgICBiaWQrK1xyXG4gICAgICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ2EgY291cGxlIG9mIGxvdyBzcGFkZXMnKVxyXG4gICAgICAgICAgICAgICAgICBwYXJ0aWFsU3BhZGVzID0gMFxyXG4gICAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgYmlkKytcclxuICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ3NwYWRlJylcclxuICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiAoY2FyZC52YWx1ZSA+PSA5KSAmJiAoY2FyZC52YWx1ZSA8PSAxMSkgIyBKUUsgb2Ygbm9uIHNwYWRlXHJcbiAgICAgICAgICAgICAgcGFydGlhbEZhY2VzKytcclxuICAgICAgICAgICAgICBpZiBwYXJ0aWFsRmFjZXMgPiAyXHJcbiAgICAgICAgICAgICAgICBwYXJ0aWFsRmFjZXMgPSAwXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ2EgY291cGxlIEpRSyBub24tc3BhZGVzJylcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXHJcblxyXG4gICAgICAgICAgaWYgY3IgPiA0MFxyXG4gICAgICAgICAgICAjICogQWNlcyBhbmQgS2luZ3MgYXJlIHByb2JhYmx5IHdpbm5lcnNcclxuICAgICAgICAgICAgaWYoKGNhcmQudmFsdWUgPj0gMTEpICYmICAgIyBBY2Ugb3IgS2luZ1xyXG4gICAgICAgICAgICAoY2FyZC5zdWl0ICE9IFN1aXQuQ0xVQlMpKSAjIE5vdCBhIGNsdWJcclxuICAgICAgICAgICAgICBiaWQrK1xyXG4gICAgICAgICAgICAgIEBhaUxvZ0JpZChpLCAnbm9uLWNsdWIgYWNlIG9yIGtpbmcnKVxyXG4gICAgICAgICAgICAgIGNvbnRpbnVlXHJcblxyXG4gICAgICAgIGlmIGhhbmRTaXplID49IDZcclxuICAgICAgICAgICMgKiBUaGUgQWNlIG9mIGNsdWJzIGlzIGEgd2lubmVyIHVubGVzcyB5b3UgYWxzbyBoYXZlIGEgbG93IGNsdWJcclxuICAgICAgICAgIGNsdWJWYWx1ZXMgPSB2YWx1ZXNPZlN1aXQoY3VycmVudFBsYXllci5oYW5kLCBTdWl0LkNMVUJTKVxyXG4gICAgICAgICAgaWYgY2x1YlZhbHVlcy5sZW5ndGggPiAwICMgaGFzIGNsdWJzXHJcbiAgICAgICAgICAgIGlmIGNsdWJWYWx1ZXNbY2x1YlZhbHVlcy5sZW5ndGggLSAxXSA9PSAxMiAjIGhhcyBBQ1xyXG4gICAgICAgICAgICAgIGlmIGNsdWJWYWx1ZXNbMF0gPiAwICMgMkMgbm90IGluIGhhbmRcclxuICAgICAgICAgICAgICAgIGJpZCsrXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dCaWQoMCwgJ0FDIHdpdGggbm8gMkMnKVxyXG5cclxuICAgICAgICByZXR1cm4gYmlkXHJcblxyXG4gICAgICAjIG5vcm1hbFxyXG4gICAgICBwbGF5OiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICB0cmlja3NOZWVkZWQgPSBjdXJyZW50UGxheWVyLmJpZCAtIGN1cnJlbnRQbGF5ZXIudHJpY2tzXHJcbiAgICAgICAgd2FudFRvV2luID0gKHRyaWNrc05lZWRlZCA+IDApXHJcbiAgICAgICAgYmVzdFBsYXkgPSAtMVxyXG4gICAgICAgIGN1cnJlbnRTdWl0ID0gQGN1cnJlbnRTdWl0KClcclxuICAgICAgICB3aW5uaW5nSW5kZXggPSBAYmVzdEluUGlsZSgpXHJcblxyXG4gICAgICAgIGlmIEBwaWxlLmxlbmd0aCA9PSBAcGxheWVycy5sZW5ndGhcclxuICAgICAgICAgIGN1cnJlbnRTdWl0ID0gU3VpdC5OT05FXHJcbiAgICAgICAgICB3aW5uaW5nSW5kZXggPSAtMVxyXG5cclxuICAgICAgICB3aW5uaW5nQ2FyZCA9IGZhbHNlXHJcbiAgICAgICAgaWYgd2lubmluZ0luZGV4ICE9IC0xXHJcbiAgICAgICAgICB3aW5uaW5nQ2FyZCA9IG5ldyBDYXJkKEBwaWxlW3dpbm5pbmdJbmRleF0pXHJcblxyXG4gICAgICAgIGlmIHdhbnRUb1dpblxyXG4gICAgICAgICAgaWYgY3VycmVudFN1aXQgPT0gU3VpdC5OT05FICMgQXJlIHlvdSBsZWFkaW5nP1xyXG4gICAgICAgICAgICAjIExlYWQgd2l0aCB5b3VyIGhpZ2hlc3Qgbm9uLXNwYWRlXHJcbiAgICAgICAgICAgIHBsYXkgPSBoaWdoZXN0VmFsdWVOb25TcGFkZUluZGV4KGN1cnJlbnRQbGF5ZXIuaGFuZCwgU3VpdC5OT05FKVxyXG4gICAgICAgICAgICBAYWlMb2dQbGF5KHBsYXksICdoaWdoZXN0IG5vbi1zcGFkZSAodHJ5aW5nIHRvIHdpbiknKVxyXG5cclxuICAgICAgICAgICAgaWYgYmVzdFBsYXkgPT0gLTFcclxuICAgICAgICAgICAgICAjIE9ubHkgc3BhZGVzIGxlZnQhIFRpbWUgdG8gYmxlZWQgdGhlIHRhYmxlLlxyXG4gICAgICAgICAgICAgIGJlc3RQbGF5ID0gMFxyXG4gICAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICdsb3dlc3Qgc3BhZGUgKHRyeWluZyB0byB3aW4gYmxlZWRpbmcgdGhlIHRhYmxlIGZvciBhIGZ1dHVyZSB3aW4pJylcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgQHBsYXllckhhc1N1aXQoY3VycmVudFBsYXllciwgY3VycmVudFN1aXQpICMgQXJlIHlvdSBzdHVjayB3aXRoIGZvcmNlZCBwbGF5P1xyXG4gICAgICAgICAgICAgIGlmIEBwbGF5ZXJDYW5XaW5JblN1aXQoY3VycmVudFBsYXllciwgd2lubmluZ0NhcmQpICMgQ2FuIHlvdSB3aW4/XHJcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGhpZ2hlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnaGlnaGVzdCBpbiBzdWl0ICh0cnlpbmcgdG8gd2luIGZvcmNlZCBpbiBzdWl0KScpXHJcbiAgICAgICAgICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gQGFpUGxheUhpZ2goY3VycmVudFBsYXllciwgYmVzdFBsYXkpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBsb3dlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnbG93ZXN0IGluIHN1aXQgKHRyeWluZyB0byB3aW4gZm9yY2VkIGluIHN1aXQsIGNhbnQgd2luKScpXHJcbiAgICAgICAgICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gQGFpUGxheUxvdyhjdXJyZW50UGxheWVyLCBiZXN0UGxheSlcclxuXHJcbiAgICAgICAgICAgIGlmIGJlc3RQbGF5ID09IC0xXHJcbiAgICAgICAgICAgICAgbGFzdENhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbY3VycmVudFBsYXllci5oYW5kLmxlbmd0aCAtIDFdKVxyXG4gICAgICAgICAgICAgIGlmIGxhc3RDYXJkLnN1aXQgPT0gU3VpdC5TUEFERVNcclxuICAgICAgICAgICAgICAgICMgVHJ5IHRvIHRydW1wLCBoYXJkXHJcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGggLSAxXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAndHJ1bXAgKHRyeWluZyB0byB3aW4pJylcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAjIE5vIG1vcmUgc3BhZGVzIGxlZnQgYW5kIG5vbmUgb2YgdGhpcyBzdWl0LiBEdW1wIHlvdXIgbG93ZXN0IGNhcmQuXHJcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGxvd2VzdFZhbHVlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCBTdWl0Lk5PTkUpXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnZHVtcCAodHJ5aW5nIHRvIHdpbiwgdGhyb3dpbmcgbG93ZXN0KScpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIyBQbGFuOiBUcnkgdG8gZHVtcCBzb21ldGhpbmcgYXdlc29tZVxyXG5cclxuICAgICAgICAgIGlmIGN1cnJlbnRTdWl0ID09IFN1aXQuTk9ORSAjIEFyZSB5b3UgbGVhZGluZz9cclxuICAgICAgICAgICAgIyBMZWFkIHdpdGggeW91ciBsb3dlc3QgdmFsdWUgKHRyeSB0byBub3QgdGhyb3cgYSBzcGFkZSBpZiB5b3UgY2FuIGhlbHAgaXQpXHJcbiAgICAgICAgICAgIGJlc3RQbGF5ID0gbG93ZXN0VmFsdWVJbmRleChjdXJyZW50UGxheWVyLmhhbmQsIFN1aXQuU1BBREVTKVxyXG4gICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnbG93ZXN0IHZhbHVlICh0cnlpbmcgdG8gbG9zZSBhdm9pZGluZyBzcGFkZXMpJylcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgQHBsYXllckhhc1N1aXQoY3VycmVudFBsYXllciwgY3VycmVudFN1aXQpICMgQXJlIHlvdSBzdHVjayB3aXRoIGZvcmNlZCBwbGF5P1xyXG4gICAgICAgICAgICAgIGlmIEBwbGF5ZXJDYW5XaW5JblN1aXQoY3VycmVudFBsYXllciwgd2lubmluZ0NhcmQpICMgQXJlIHlvdSBzdHVjayB3aW5uaW5nP1xyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBsb3dlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnbG93ZXN0IGluIHN1aXQgKHRyeWluZyB0byBsb3NlIGZvcmNlZCB0byB3aW4pJylcclxuICAgICAgICAgICAgICAgIGlmIGJlc3RQbGF5ICE9IC0xXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBAYWlQbGF5TG93KGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGJlc3RQbGF5ID0gaGlnaGVzdEluZGV4SW5TdWl0KGN1cnJlbnRQbGF5ZXIuaGFuZCwgd2lubmluZ0NhcmQuc3VpdClcclxuICAgICAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICdoaWdoZXN0IGluIHN1aXQgKHRyeWluZyB0byBsb3NlIGZvcmNlZCBpbiBzdWl0LCBidXQgY2FudCB3aW4pJylcclxuICAgICAgICAgICAgICAgIGlmIGJlc3RQbGF5ICE9IC0xXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBAYWlQbGF5SGlnaChjdXJyZW50UGxheWVyLCBiZXN0UGxheSlcclxuXHJcbiAgICAgICAgICAgIGlmIGJlc3RQbGF5ID09IC0xXHJcbiAgICAgICAgICAgICAgIyBUcnkgdG8gZHVtcCB5b3VyIGhpZ2hlc3Qgc3BhZGUsIGlmIHlvdSBjYW4gdGhyb3cgYW55dGhpbmdcclxuICAgICAgICAgICAgICBpZiAoY3VycmVudFN1aXQgIT0gU3VpdC5TUEFERVMpICYmICh3aW5uaW5nQ2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKVxyXG4gICAgICAgICAgICAgICAgIyBDdXJyZW50IHdpbm5lciBpcyB0cnVtcGluZyB0aGUgc3VpdC4gVGhyb3cgeW91ciBoaWdoZXN0IHNwYWRlIGxvd2VyIHRoYW4gdGhlIHdpbm5lclxyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBoaWdoZXN0VmFsdWVJbmRleEluU3VpdExvd2VyVGhhbihjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkKVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ3RyeWluZyB0byBsb3NlIGhpZ2hlc3QgZHVtcGFibGUgc3BhZGUnKVxyXG5cclxuICAgICAgICAgICAgaWYgYmVzdFBsYXkgPT0gLTFcclxuICAgICAgICAgICAgICAjIFRyeSB0byBkdW1wIHlvdXIgaGlnaGVzdCBub24tc3BhZGVcclxuICAgICAgICAgICAgICBiZXN0UGxheSA9IGhpZ2hlc3RWYWx1ZU5vblNwYWRlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZC5zdWl0KVxyXG4gICAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICd0cnlpbmcgdG8gbG9zZSBoaWdoZXN0IGR1bXBhYmxlIG5vbi1zcGFkZScpXHJcblxyXG4gICAgICAgIGlmIGJlc3RQbGF5ICE9IC0xXHJcbiAgICAgICAgICBpZihAYWlQbGF5KGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgQGFpTG9nKCdub3QgYWxsb3dlZCB0byBwbGF5IG15IGJlc3QgcGxheScpXHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIENoYW9zOiBDb21wbGV0ZWx5IHJhbmRvbS4gUHJvYmFibHkgYXdmdWwgdG8gcGxheSBhZ2FpbnN0LlxyXG4gICAgY2hhb3M6XHJcbiAgICAgIGlkOiAgIFwiY2hhb3NcIlxyXG4gICAgICBuYW1lOiBcIkNoYW9zXCJcclxuXHJcbiAgICAgICMgY2hhb3NcclxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICAjIHBpY2sgYSBiaWQgc29tZXdoZXJlIGluIHRoZSBmaXJzdCA1MCVcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudFBsYXllci5oYW5kLmxlbmd0aCAqIDAuNSlcclxuXHJcbiAgICAgICMgY2hhb3NcclxuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgbGVnYWxJbmRpY2VzID0gW11cclxuICAgICAgICBmb3IgdiwgaSBpbiBjdXJyZW50UGxheWVyLmhhbmRcclxuICAgICAgICAgIGNhblBsYXlDYXJkID0gQGNhblBsYXkoeyBpZDogY3VycmVudFBsYXllci5pZCwgaW5kZXg6IGkgfSlcclxuICAgICAgICAgIGlmIGNhblBsYXlDYXJkID09IE9LXHJcbiAgICAgICAgICAgIGxlZ2FsSW5kaWNlcy5wdXNoIGlcclxuICAgICAgICAgICMgZWxzZVxyXG4gICAgICAgICAgIyAgIEBhaUxvZyBcImNhblBsYXlDYXJkICN7aX0gcmV0dXJuZWQgI3tjYW5QbGF5Q2FyZH1cIlxyXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVnYWxJbmRpY2VzLmxlbmd0aClcclxuICAgICAgICBAYWlMb2cgXCJsZWdhbCBpbmRpY2VzOiAje0pTT04uc3RyaW5naWZ5KGxlZ2FsSW5kaWNlcyl9LCBjaG9vc2luZyBpbmRleCAje2xlZ2FsSW5kaWNlc1tyYW5kb21JbmRleF19XCJcclxuICAgICAgICByZXR1cm4gQGFpUGxheShjdXJyZW50UGxheWVyLCBsZWdhbEluZGljZXNbcmFuZG9tSW5kZXhdKVxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIENvbnNlcnZhdGl2ZSBNb3JvbjogQmlkcyBzcGFkZSBjb3VudCwgYW5kIHBsYXlzIGxvdyBjYXJkcy5cclxuICAgIGNvbnNlcnZhdGl2ZU1vcm9uOlxyXG4gICAgICBpZDogICBcImNvbnNlcnZhdGl2ZU1vcm9uXCJcclxuICAgICAgbmFtZTogXCJDb25zZXJ2YXRpdmUgTW9yb25cIlxyXG5cclxuICAgICAgIyBjb25zZXJ2YXRpdmVNb3JvblxyXG4gICAgICBiaWQ6IChjdXJyZW50UGxheWVyKSAtPlxyXG4gICAgICAgIGJpZCA9IDBcclxuICAgICAgICBmb3IgdiBpbiBjdXJyZW50UGxheWVyLmhhbmRcclxuICAgICAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgICAgICAgYmlkKysgaWYgY2FyZC5zdWl0ID09IFN1aXQuU1BBREVTXHJcbiAgICAgICAgQGFpTG9nIFwiSSBhbSBhIG1vcm9uIGFuZCBJIGhhdmUgI3tiaWR9IHNwYWRlcy4gTGV0J3Mgcm9sbCB3aXRoIGl0LlwiXHJcbiAgICAgICAgcmV0dXJuIGJpZFxyXG5cclxuICAgICAgIyBjb25zZXJ2YXRpdmVNb3JvblxyXG4gICAgICBwbGF5OiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICBAYWlMb2cgXCJwbGF5aW5nIGxvd2VzdCBwb3NzaWJsZSBjYXJkXCJcclxuICAgICAgICByZXR1cm4gQGFpUGxheUxvdyhjdXJyZW50UGxheWVyLCAwKVxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIEFnZ3Jlc3NpdmUgTW9yb246IEJpZHMgc3BhZGVzIGFuZCBhY2VzLCBhbmQgcGxheXMgaGlnaCBjYXJkcy5cclxuICAgIGFnZ3Jlc3NpdmVNb3JvbjpcclxuICAgICAgaWQ6ICAgXCJhZ2dyZXNzaXZlTW9yb25cIlxyXG4gICAgICBuYW1lOiBcIkFnZ3Jlc3NpdmUgTW9yb25cIlxyXG5cclxuICAgICAgIyBhZ2dyZXNzaXZlTW9yb25cclxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICBiaWQgPSAwXHJcbiAgICAgICAgZm9yIHYgaW4gY3VycmVudFBsYXllci5oYW5kXHJcbiAgICAgICAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgICAgICAgIGJpZCsrIGlmIChjYXJkLnN1aXQgPT0gU3VpdC5TUEFERVMpIG9yIChjYXJkLnZhbHVlID09IDEyKVxyXG4gICAgICAgIEBhaUxvZyBcIkkgYW0gYSBtb3JvbiBhbmQgSSBoYXZlICN7YmlkfSBzcGFkZXMgYW5kL29yIGFjZXMuIEZhcnQuXCJcclxuICAgICAgICByZXR1cm4gYmlkXHJcblxyXG4gICAgICAjIGFnZ3Jlc3NpdmVNb3JvblxyXG4gICAgICBwbGF5OiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICBAYWlMb2cgXCJwbGF5aW5nIGhpZ2hlc3QgcG9zc2libGUgY2FyZFwiXHJcbiAgICAgICAgcmV0dXJuIEBhaVBsYXlIaWdoKGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGggLSAxKVxyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBBSSBjYXJkIGhlbHBlcnNcclxuXHJcbnZhbHVlc09mU3VpdCA9IChoYW5kLCBzdWl0KSAtPlxyXG4gIHZhbHVlcyA9IFtdXHJcbiAgZm9yIHYgaW4gaGFuZFxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICBpZiBjYXJkLnN1aXQgPT0gc3VpdFxyXG4gICAgICB2YWx1ZXMucHVzaChjYXJkLnZhbHVlKVxyXG4gIHJldHVybiB2YWx1ZXNcclxuXHJcbnN0cmluZ2lmeUNhcmRzID0gKGNhcmRzKSAtPlxyXG4gIHQgPSAnJ1xyXG4gIGZvciB2IGluIGNhcmRzXHJcbiAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgIGlmKHQpXHJcbiAgICAgIHQgKz0gJywnXHJcbiAgICB0ICs9IGNhcmQubmFtZVxyXG5cclxuICByZXR1cm4gJ1snK3QrJ10nXHJcblxyXG5sb3dlc3RJbmRleEluU3VpdCA9IChoYW5kLCBzdWl0KSAtPlxyXG4gIGZvciB2LGkgaW4gaGFuZFxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICBpZiBjYXJkLnN1aXQgPT0gc3VpdFxyXG4gICAgICByZXR1cm4gaVxyXG4gIHJldHVybiAtMVxyXG5cclxuaGlnaGVzdEluZGV4SW5TdWl0ID0gKGhhbmQsIHN1aXQpIC0+XHJcbiAgZm9yIHYsaSBpbiBoYW5kIGJ5IC0xXHJcbiAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgIGlmIGNhcmQuc3VpdCA9PSBzdWl0XHJcbiAgICAgIHJldHVybiBpXHJcbiAgcmV0dXJuIC0xXHJcblxyXG5sb3dlc3RWYWx1ZUluZGV4ID0gKGhhbmQsIGF2b2lkU3VpdCkgLT4gIyB1c2UgU3VpdC5OT05FIHRvIHJldHVybiBhbnkgc3VpdFxyXG4gIGNhcmQgPSBuZXcgQ2FyZChoYW5kWzBdKVxyXG4gIGxvd2VzdEluZGV4ID0gMFxyXG4gIGxvd2VzdFZhbHVlID0gY2FyZC52YWx1ZVxyXG4gIGZvciBpIGluIFsxLi4uaGFuZC5sZW5ndGhdXHJcbiAgICBjYXJkID0gbmV3IENhcmQoaGFuZFtpXSlcclxuICAgIGlmIGNhcmQuc3VpdCAhPSBhdm9pZFN1aXRcclxuICAgICAgaWYgY2FyZC52YWx1ZSA8IGxvd2VzdFZhbHVlXHJcbiAgICAgICAgbG93ZXN0VmFsdWUgPSBjYXJkLnZhbHVlXHJcbiAgICAgICAgbG93ZXN0SW5kZXggPSBpXHJcbiAgcmV0dXJuIGxvd2VzdEluZGV4XHJcblxyXG5oaWdoZXN0VmFsdWVOb25TcGFkZUluZGV4ID0gKGhhbmQsIGF2b2lkU3VpdCkgLT5cclxuICBoaWdoZXN0SW5kZXggPSAtMVxyXG4gIGhpZ2hlc3RWYWx1ZSA9IC0xXHJcbiAgZm9yIGkgaW4gW2hhbmQubGVuZ3RoLTEuLjBdIGJ5IC0xXHJcbiAgICBjYXJkID0gbmV3IENhcmQoaGFuZFtpXSlcclxuICAgIGlmIChjYXJkLnN1aXQgIT0gYXZvaWRTdWl0KSAmJiAoY2FyZC5zdWl0ICE9IFN1aXQuU1BBREVTKVxyXG4gICAgICBpZiBjYXJkLnZhbHVlID4gaGlnaGVzdFZhbHVlXHJcbiAgICAgICAgaGlnaGVzdFZhbHVlID0gY2FyZC52YWx1ZVxyXG4gICAgICAgIGhpZ2hlc3RJbmRleCA9IGlcclxuICByZXR1cm4gaGlnaGVzdEluZGV4XHJcblxyXG5oaWdoZXN0VmFsdWVJbmRleEluU3VpdExvd2VyVGhhbiA9IChoYW5kLCB3aW5uaW5nQ2FyZCkgLT5cclxuICBmb3IgaSBpbiBbaGFuZC5sZW5ndGgtMS4uMF0gYnkgLTFcclxuICAgIGNhcmQgPSBuZXcgQ2FyZChoYW5kW2ldKVxyXG4gICAgaWYgKGNhcmQuc3VpdCA9PSB3aW5uaW5nQ2FyZC5zdWl0KSAmJiAoY2FyZC52YWx1ZSA8IHdpbm5pbmdDYXJkLnZhbHVlKVxyXG4gICAgICByZXR1cm4gaVxyXG4gIHJldHVybiAtMVxyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBFeHBvcnRzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgQ2FyZDogQ2FyZFxyXG4gIEJsYWNrb3V0OiBCbGFja291dFxyXG4gIFN0YXRlOiBTdGF0ZVxyXG4gIE9LOiBPS1xyXG4gIGFpQ2hhcmFjdGVyczogYWlDaGFyYWN0ZXJzXHJcblxyXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcclxuXHJcbmNsYXNzIEJ1dHRvblxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBzcHJpdGVOYW1lcywgQGZvbnQsIEB0ZXh0SGVpZ2h0LCBAeCwgQHksIEBjYikgLT5cclxuICAgIEBhbmltID0gbmV3IEFuaW1hdGlvbiB7XHJcbiAgICAgIHNwZWVkOiB7IHM6IDMgfVxyXG4gICAgICBzOiAwXHJcbiAgICB9XHJcbiAgICBAY29sb3IgPSB7IHI6IDEsIGc6IDEsIGI6IDEsIGE6IDAgfVxyXG5cclxuICB1cGRhdGU6IChkdCkgLT5cclxuICAgIHJldHVybiBAYW5pbS51cGRhdGUoZHQpXHJcblxyXG4gIHJlbmRlcjogLT5cclxuICAgIEBjb2xvci5hID0gQGFuaW0uY3VyLnNcclxuICAgIEBnYW1lLnNwcml0ZVJlbmRlcmVyLnJlbmRlciBAc3ByaXRlTmFtZXNbMF0sIEB4LCBAeSwgMCwgQHRleHRIZWlnaHQgKiAxLjUsIDAsIDAuNSwgMC41LCBAZ2FtZS5jb2xvcnMud2hpdGUsID0+XHJcbiAgICAgICMgcHVsc2UgYnV0dG9uIGFuaW0sXHJcbiAgICAgIEBhbmltLmN1ci5zID0gMVxyXG4gICAgICBAYW5pbS5yZXEucyA9IDBcclxuICAgICAgIyB0aGVuIGNhbGwgY2FsbGJhY2tcclxuICAgICAgQGNiKHRydWUpXHJcbiAgICBAZ2FtZS5zcHJpdGVSZW5kZXJlci5yZW5kZXIgQHNwcml0ZU5hbWVzWzFdLCBAeCwgQHksIDAsIEB0ZXh0SGVpZ2h0ICogMS41LCAwLCAwLjUsIDAuNSwgQGNvbG9yXHJcbiAgICB0ZXh0ID0gQGNiKGZhbHNlKVxyXG4gICAgQGdhbWUuZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgQHRleHRIZWlnaHQsIHRleHQsIEB4LCBAeSwgMC41LCAwLjUsIEBnYW1lLmNvbG9ycy5idXR0b250ZXh0XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvblxyXG4iLCJmb250bWV0cmljcyA9IHJlcXVpcmUgJy4vZm9udG1ldHJpY3MnXHJcblxyXG4jIHRha2VuIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjIzODM4L3JnYi10by1oZXgtYW5kLWhleC10by1yZ2JcclxuaGV4VG9SZ2IgPSAoaGV4LCBhKSAtPlxyXG4gICAgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleClcclxuICAgIHJldHVybiBudWxsIGlmIG5vdCByZXN1bHRcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNikgLyAyNTUsXHJcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNikgLyAyNTUsXHJcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNikgLyAyNTVcclxuICAgICAgICBhOiBhXHJcbiAgICB9XHJcblxyXG5jbGFzcyBGb250UmVuZGVyZXJcclxuICBjb25zdHJ1Y3RvcjogIChAZ2FtZSkgLT5cclxuICAgIEB3aGl0ZSA9IHsgcjogMSwgZzogMSwgYjogMSwgYTogMSB9XHJcblxyXG4gIHNpemU6IChmb250LCBoZWlnaHQsIHN0cikgLT5cclxuICAgIG1ldHJpY3MgPSBmb250bWV0cmljc1tmb250XVxyXG4gICAgcmV0dXJuIGlmIG5vdCBtZXRyaWNzXHJcbiAgICBzY2FsZSA9IGhlaWdodCAvIG1ldHJpY3MuaGVpZ2h0XHJcblxyXG4gICAgdG90YWxXaWR0aCA9IDBcclxuICAgIHRvdGFsSGVpZ2h0ID0gbWV0cmljcy5oZWlnaHQgKiBzY2FsZVxyXG4gICAgZm9yIGNoLCBpIGluIHN0clxyXG4gICAgICBjb2RlID0gY2guY2hhckNvZGVBdCgwKVxyXG4gICAgICBnbHlwaCA9IG1ldHJpY3MuZ2x5cGhzW2NvZGVdXHJcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBnbHlwaFxyXG4gICAgICB0b3RhbFdpZHRoICs9IGdseXBoLnhhZHZhbmNlICogc2NhbGVcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3OiB0b3RhbFdpZHRoXHJcbiAgICAgIGg6IHRvdGFsSGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gIHJlbmRlcjogKGZvbnQsIGhlaWdodCwgc3RyLCB4LCB5LCBhbmNob3J4LCBhbmNob3J5LCBjb2xvciwgY2IpIC0+XHJcbiAgICBtZXRyaWNzID0gZm9udG1ldHJpY3NbZm9udF1cclxuICAgIHJldHVybiBpZiBub3QgbWV0cmljc1xyXG4gICAgc2NhbGUgPSBoZWlnaHQgLyBtZXRyaWNzLmhlaWdodFxyXG5cclxuICAgIHRvdGFsV2lkdGggPSAwXHJcbiAgICB0b3RhbEhlaWdodCA9IG1ldHJpY3MuaGVpZ2h0ICogc2NhbGVcclxuICAgIHNraXBDb2xvciA9IGZhbHNlXHJcbiAgICBmb3IgY2gsIGkgaW4gc3RyXHJcbiAgICAgIGlmIGNoID09ICdgJ1xyXG4gICAgICAgIHNraXBDb2xvciA9ICFza2lwQ29sb3JcclxuICAgICAgY29udGludWUgaWYgc2tpcENvbG9yXHJcbiAgICAgIGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApXHJcbiAgICAgIGdseXBoID0gbWV0cmljcy5nbHlwaHNbY29kZV1cclxuICAgICAgY29udGludWUgaWYgbm90IGdseXBoXHJcbiAgICAgIHRvdGFsV2lkdGggKz0gZ2x5cGgueGFkdmFuY2UgKiBzY2FsZVxyXG5cclxuICAgIGFuY2hvck9mZnNldFggPSAtMSAqIGFuY2hvcnggKiB0b3RhbFdpZHRoXHJcbiAgICBhbmNob3JPZmZzZXRZID0gLTEgKiBhbmNob3J5ICogdG90YWxIZWlnaHRcclxuICAgIGN1cnJYID0geFxyXG5cclxuICAgIGlmIGNvbG9yXHJcbiAgICAgIHN0YXJ0aW5nQ29sb3IgPSBjb2xvclxyXG4gICAgZWxzZVxyXG4gICAgICBzdGFydGluZ0NvbG9yID0gQHdoaXRlXHJcbiAgICBjdXJyZW50Q29sb3IgPSBzdGFydGluZ0NvbG9yXHJcblxyXG4gICAgY29sb3JTdGFydCA9IC0xXHJcbiAgICBmb3IgY2gsIGkgaW4gc3RyXHJcbiAgICAgIGlmIGNoID09ICdgJ1xyXG4gICAgICAgIGlmIGNvbG9yU3RhcnQgPT0gLTFcclxuICAgICAgICAgIGNvbG9yU3RhcnQgPSBpICsgMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGxlbiA9IGkgLSBjb2xvclN0YXJ0XHJcbiAgICAgICAgICBpZiBsZW5cclxuICAgICAgICAgICAgY3VycmVudENvbG9yID0gaGV4VG9SZ2Ioc3RyLnN1YnN0cihjb2xvclN0YXJ0LCBpIC0gY29sb3JTdGFydCksIHN0YXJ0aW5nQ29sb3IuYSlcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY3VycmVudENvbG9yID0gc3RhcnRpbmdDb2xvclxyXG4gICAgICAgICAgY29sb3JTdGFydCA9IC0xXHJcblxyXG4gICAgICBjb250aW51ZSBpZiBjb2xvclN0YXJ0ICE9IC0xXHJcbiAgICAgIGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApXHJcbiAgICAgIGdseXBoID0gbWV0cmljcy5nbHlwaHNbY29kZV1cclxuICAgICAgY29udGludWUgaWYgbm90IGdseXBoXHJcbiAgICAgIEBnYW1lLmRyYXdJbWFnZSBmb250LFxyXG4gICAgICBnbHlwaC54LCBnbHlwaC55LCBnbHlwaC53aWR0aCwgZ2x5cGguaGVpZ2h0LFxyXG4gICAgICBjdXJyWCArIChnbHlwaC54b2Zmc2V0ICogc2NhbGUpICsgYW5jaG9yT2Zmc2V0WCwgeSArIChnbHlwaC55b2Zmc2V0ICogc2NhbGUpICsgYW5jaG9yT2Zmc2V0WSwgZ2x5cGgud2lkdGggKiBzY2FsZSwgZ2x5cGguaGVpZ2h0ICogc2NhbGUsXHJcbiAgICAgIDAsIDAsIDAsXHJcbiAgICAgIGN1cnJlbnRDb2xvci5yLCBjdXJyZW50Q29sb3IuZywgY3VycmVudENvbG9yLmIsIGN1cnJlbnRDb2xvci5hLCBjYlxyXG4gICAgICBjdXJyWCArPSBnbHlwaC54YWR2YW5jZSAqIHNjYWxlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvbnRSZW5kZXJlclxyXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcclxuQnV0dG9uID0gcmVxdWlyZSAnLi9CdXR0b24nXHJcbkZvbnRSZW5kZXJlciA9IHJlcXVpcmUgJy4vRm9udFJlbmRlcmVyJ1xyXG5TcHJpdGVSZW5kZXJlciA9IHJlcXVpcmUgJy4vU3ByaXRlUmVuZGVyZXInXHJcbk1lbnUgPSByZXF1aXJlICcuL01lbnUnXHJcbkhhbmQgPSByZXF1aXJlICcuL0hhbmQnXHJcblBpbGUgPSByZXF1aXJlICcuL1BpbGUnXHJcbntCbGFja291dCwgU3RhdGUsIE9LLCBhaUNoYXJhY3RlcnN9ID0gcmVxdWlyZSAnLi9CbGFja291dCdcclxuXHJcbiMgdGVtcFxyXG5CVUlMRF9USU1FU1RBTVAgPSBcIjAuMC4xXCJcclxuXHJcbmNsYXNzIEdhbWVcclxuICBjb25zdHJ1Y3RvcjogKEBuYXRpdmUsIEB3aWR0aCwgQGhlaWdodCkgLT5cclxuICAgIEB2ZXJzaW9uID0gQlVJTERfVElNRVNUQU1QXHJcbiAgICBAbG9nKFwiR2FtZSBjb25zdHJ1Y3RlZDogI3tAd2lkdGh9eCN7QGhlaWdodH1cIilcclxuICAgIEBmb250UmVuZGVyZXIgPSBuZXcgRm9udFJlbmRlcmVyIHRoaXNcclxuICAgIEBzcHJpdGVSZW5kZXJlciA9IG5ldyBTcHJpdGVSZW5kZXJlciB0aGlzXHJcbiAgICBAZm9udCA9IFwiZGFya2ZvcmVzdFwiXHJcbiAgICBAem9uZXMgPSBbXVxyXG4gICAgQG5leHRBSVRpY2sgPSAxMDAwICMgd2lsbCBiZSBzZXQgYnkgb3B0aW9uc1xyXG4gICAgQGNlbnRlciA9XHJcbiAgICAgIHg6IEB3aWR0aCAvIDJcclxuICAgICAgeTogQGhlaWdodCAvIDJcclxuICAgIEBhYUhlaWdodCA9IEB3aWR0aCAqIDkgLyAxNlxyXG4gICAgQGxvZyBcImhlaWdodDogI3tAaGVpZ2h0fS4gaGVpZ2h0IGlmIHNjcmVlbiB3YXMgMTY6OSAoYXNwZWN0IGFkanVzdGVkKTogI3tAYWFIZWlnaHR9XCJcclxuICAgIEBwYXVzZUJ1dHRvblNpemUgPSBAYWFIZWlnaHQgLyAxNVxyXG4gICAgQGNvbG9ycyA9XHJcbiAgICAgIHdoaXRlOiAgICAgIHsgcjogICAxLCBnOiAgIDEsIGI6ICAgMSwgYTogICAxIH1cclxuICAgICAgYmxhY2s6ICAgICAgeyByOiAgIDAsIGc6ICAgMCwgYjogICAwLCBhOiAgIDEgfVxyXG4gICAgICByZWQ6ICAgICAgICB7IHI6ICAgMSwgZzogICAwLCBiOiAgIDAsIGE6ICAgMSB9XHJcbiAgICAgIG9yYW5nZTogICAgIHsgcjogICAxLCBnOiAwLjUsIGI6ICAgMCwgYTogICAxIH1cclxuICAgICAgZ29sZDogICAgICAgeyByOiAgIDEsIGc6ICAgMSwgYjogICAwLCBhOiAgIDEgfVxyXG4gICAgICBidXR0b250ZXh0OiB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XHJcbiAgICAgIGxpZ2h0Z3JheTogIHsgcjogMC41LCBnOiAwLjUsIGI6IDAuNSwgYTogICAxIH1cclxuICAgICAgYmFja2dyb3VuZDogeyByOiAgIDAsIGc6IDAuMiwgYjogICAwLCBhOiAgIDEgfVxyXG4gICAgICBsb2diZzogICAgICB7IHI6IDAuMSwgZzogICAwLCBiOiAgIDAsIGE6ICAgMSB9XHJcbiAgICAgIGFycm93OiAgICAgIHsgcjogICAxLCBnOiAgIDEsIGI6ICAgMSwgYTogICAxIH1cclxuICAgICAgYXJyb3djbG9zZTogeyByOiAgIDEsIGc6IDAuNSwgYjogICAwLCBhOiAwLjMgfVxyXG4gICAgICBoYW5kYXJlYTogICB7IHI6ICAgMCwgZzogMC4xLCBiOiAgIDAsIGE6IDEuMCB9XHJcbiAgICAgIG92ZXJsYXk6ICAgIHsgcjogICAwLCBnOiAgIDAsIGI6ICAgMCwgYTogMC42IH1cclxuICAgICAgbWFpbm1lbnU6ICAgeyByOiAwLjEsIGc6IDAuMSwgYjogMC4xLCBhOiAgIDEgfVxyXG4gICAgICBwYXVzZW1lbnU6ICB7IHI6IDAuMSwgZzogMC4wLCBiOiAwLjEsIGE6ICAgMSB9XHJcbiAgICAgIGJpZDogICAgICAgIHsgcjogICAwLCBnOiAwLjYsIGI6ICAgMCwgYTogICAxIH1cclxuXHJcbiAgICBAdGV4dHVyZXMgPVxyXG4gICAgICBcImNhcmRzXCI6IDBcclxuICAgICAgXCJkYXJrZm9yZXN0XCI6IDFcclxuICAgICAgXCJjaGFyc1wiOiAyXHJcbiAgICAgIFwiaG93dG8xXCI6IDNcclxuICAgICAgXCJob3d0bzJcIjogNFxyXG4gICAgICBcImhvd3RvM1wiOiA1XHJcblxyXG4gICAgQGJsYWNrb3V0ID0gbnVsbCAjIGRvbid0IHN0YXJ0IGluIGEgZ2FtZVxyXG4gICAgQGxhc3RFcnIgPSAnJ1xyXG4gICAgQHBhdXNlZCA9IGZhbHNlXHJcbiAgICBAaG93dG8gPSAwXHJcbiAgICBAcmVuZGVyQ29tbWFuZHMgPSBbXVxyXG5cclxuICAgIEBiaWQgPSAwXHJcbiAgICBAYmlkQnV0dG9uU2l6ZSA9IEBhYUhlaWdodCAvIDhcclxuICAgIEBiaWRUZXh0U2l6ZSA9IEBhYUhlaWdodCAvIDZcclxuICAgIGJpZEJ1dHRvbkRpc3RhbmNlID0gQGJpZEJ1dHRvblNpemUgKiAzXHJcbiAgICBAYmlkQnV0dG9uWSA9IEBjZW50ZXIueSAtIChAYmlkQnV0dG9uU2l6ZSlcclxuICAgIEBiaWRVSSA9ICMoQGdhbWUsIEBzcHJpdGVOYW1lcywgQGZvbnQsIEB0ZXh0SGVpZ2h0LCBAeCwgQHksIEB0ZXh0LCBAY2IpXHJcbiAgICAgIG1pbnVzOiBuZXcgQnV0dG9uIHRoaXMsIFsnbWludXMwJywgJ21pbnVzMSddLCBAZm9udCwgQGJpZEJ1dHRvblNpemUsIEBjZW50ZXIueCAtIGJpZEJ1dHRvbkRpc3RhbmNlLCBAYmlkQnV0dG9uWSwgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAYWRqdXN0QmlkKC0xKVxyXG4gICAgICAgIHJldHVybiAnJ1xyXG4gICAgICBwbHVzOiAgbmV3IEJ1dHRvbiB0aGlzLCBbJ3BsdXMwJywgJ3BsdXMxJ10sICAgQGZvbnQsIEBiaWRCdXR0b25TaXplLCBAY2VudGVyLnggKyBiaWRCdXR0b25EaXN0YW5jZSwgQGJpZEJ1dHRvblksIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQGFkanVzdEJpZCgxKVxyXG4gICAgICAgIHJldHVybiAnJ1xyXG5cclxuICAgIEBvcHRpb25NZW51cyA9XHJcbiAgICAgIHJvdW5kczogW1xyXG4gICAgICAgIHsgdGV4dDogXCI4IHJvdW5kcyBvZiAxM1wiLCBkYXRhOiBcIjEzfDEzfDEzfDEzfDEzfDEzfDEzfDEzXCIgfVxyXG4gICAgICAgIHsgdGV4dDogXCI0IHJvdW5kcyBvZiAxM1wiLCBkYXRhOiBcIjEzfDEzfDEzfDEzXCIgfVxyXG4gICAgICAgIHsgdGV4dDogXCIzIHRvIDEzXCIsIGRhdGE6IFwiM3w0fDV8Nnw3fDh8OXwxMHwxMXwxMnwxM1wiIH1cclxuICAgICAgICB7IHRleHQ6IFwiMyB0byAxMyBieSBvZGRzXCIsIGRhdGE6IFwiM3w1fDd8OXwxMXwxM1wiIH1cclxuICAgICAgICB7IHRleHQ6IFwiTWFyYXRob25cIiwgZGF0YTogXCJNXCIgfVxyXG4gICAgICBdXHJcbiAgICAgIHNwZWVkczogW1xyXG4gICAgICAgIHsgdGV4dDogXCJBSSBTcGVlZDogU2xvd1wiLCBzcGVlZDogMjAwMCB9XHJcbiAgICAgICAgeyB0ZXh0OiBcIkFJIFNwZWVkOiBNZWRpdW1cIiwgc3BlZWQ6IDEwMDAgfVxyXG4gICAgICAgIHsgdGV4dDogXCJBSSBTcGVlZDogRmFzdFwiLCBzcGVlZDogNTAwIH1cclxuICAgICAgICB7IHRleHQ6IFwiQUkgU3BlZWQ6IFVsdHJhXCIsIHNwZWVkOiAyNTAgfVxyXG4gICAgICBdXHJcbiAgICBAb3B0aW9ucyA9XHJcbiAgICAgIHBsYXllcnM6IDRcclxuICAgICAgcm91bmRJbmRleDogMFxyXG4gICAgICBzcGVlZEluZGV4OiAxXHJcbiAgICAgIHNvdW5kOiB0cnVlXHJcblxyXG4gICAgQG1haW5NZW51ID0gbmV3IE1lbnUgdGhpcywgXCJCbGFja291dCFcIiwgXCJzb2xpZFwiLCBAY29sb3JzLm1haW5tZW51LCBbXHJcbiAgICAgIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQGhvd3RvID0gMVxyXG4gICAgICAgIHJldHVybiBcIkhvdyBUbyBQbGF5XCJcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAb3B0aW9ucy5yb3VuZEluZGV4ID0gKEBvcHRpb25zLnJvdW5kSW5kZXggKyAxKSAlIEBvcHRpb25NZW51cy5yb3VuZHMubGVuZ3RoXHJcbiAgICAgICAgcmV0dXJuIEBvcHRpb25NZW51cy5yb3VuZHNbQG9wdGlvbnMucm91bmRJbmRleF0udGV4dFxyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBvcHRpb25zLnBsYXllcnMrK1xyXG4gICAgICAgICAgaWYgQG9wdGlvbnMucGxheWVycyA+IDRcclxuICAgICAgICAgICAgQG9wdGlvbnMucGxheWVycyA9IDNcclxuICAgICAgICByZXR1cm4gXCIje0BvcHRpb25zLnBsYXllcnN9IFBsYXllcnNcIlxyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBvcHRpb25zLnNwZWVkSW5kZXggPSAoQG9wdGlvbnMuc3BlZWRJbmRleCArIDEpICUgQG9wdGlvbk1lbnVzLnNwZWVkcy5sZW5ndGhcclxuICAgICAgICByZXR1cm4gQG9wdGlvbk1lbnVzLnNwZWVkc1tAb3B0aW9ucy5zcGVlZEluZGV4XS50ZXh0XHJcbiAgICAgICMgKGNsaWNrKSA9PlxyXG4gICAgICAjICAgaWYgY2xpY2tcclxuICAgICAgIyAgICAgQG9wdGlvbnMuc291bmQgPSAhQG9wdGlvbnMuc291bmRcclxuICAgICAgIyAgIHJldHVybiBcIlNvdW5kOiAje2lmIEBvcHRpb25zLnNvdW5kIHRoZW4gXCJFbmFibGVkXCIgZWxzZSBcIkRpc2FibGVkXCJ9XCJcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAbmV3R2FtZSgpXHJcbiAgICAgICAgcmV0dXJuIFwiU3RhcnRcIlxyXG4gICAgXVxyXG5cclxuICAgIEBwYXVzZU1lbnUgPSBuZXcgTWVudSB0aGlzLCBcIlBhdXNlZFwiLCBcInNvbGlkXCIsIEBjb2xvcnMucGF1c2VtZW51LCBbXHJcbiAgICAgIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQHBhdXNlZCA9IGZhbHNlXHJcbiAgICAgICAgcmV0dXJuIFwiUmVzdW1lIEdhbWVcIlxyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBob3d0byA9IDFcclxuICAgICAgICByZXR1cm4gXCJIb3cgVG8gUGxheVwiXHJcbiAgICAgIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQG9wdGlvbnMuc3BlZWRJbmRleCA9IChAb3B0aW9ucy5zcGVlZEluZGV4ICsgMSkgJSBAb3B0aW9uTWVudXMuc3BlZWRzLmxlbmd0aFxyXG4gICAgICAgIHJldHVybiBAb3B0aW9uTWVudXMuc3BlZWRzW0BvcHRpb25zLnNwZWVkSW5kZXhdLnRleHRcclxuICAgICAgIyAoY2xpY2spID0+XHJcbiAgICAgICMgICBpZiBjbGlja1xyXG4gICAgICAjICAgICBAb3B0aW9ucy5zb3VuZCA9ICFAb3B0aW9ucy5zb3VuZFxyXG4gICAgICAjICAgcmV0dXJuIFwiU291bmQ6ICN7aWYgQG9wdGlvbnMuc291bmQgdGhlbiBcIkVuYWJsZWRcIiBlbHNlIFwiRGlzYWJsZWRcIn1cIlxyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBibGFja291dCA9IG51bGxcclxuICAgICAgICAgIEBwYXVzZWQgPSBmYWxzZVxyXG4gICAgICAgIHJldHVybiBcIlF1aXQgR2FtZVwiXHJcbiAgICBdXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIGxvZ2dpbmdcclxuXHJcbiAgbG9nOiAocykgLT5cclxuICAgIEBuYXRpdmUubG9nKHMpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIGxvYWQgLyBzYXZlXHJcblxyXG4gIGxvYWQ6IChqc29uKSAtPlxyXG4gICAgQGxvZyBcIihDUykgbG9hZGluZyBzdGF0ZVwiXHJcbiAgICB0cnlcclxuICAgICAgc3RhdGUgPSBKU09OLnBhcnNlIGpzb25cclxuICAgIGNhdGNoXHJcbiAgICAgIEBsb2cgXCJsb2FkIGZhaWxlZCB0byBwYXJzZSBzdGF0ZTogI3tqc29ufVwiXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgc3RhdGUub3B0aW9uc1xyXG4gICAgICBmb3IgaywgdiBvZiBzdGF0ZS5vcHRpb25zXHJcbiAgICAgICAgQG9wdGlvbnNba10gPSB2XHJcblxyXG4gICAgaWYgc3RhdGUuYmxhY2tvdXRcclxuICAgICAgQGxvZyBcInJlY3JlYXRpbmcgZ2FtZSBmcm9tIHNhdmVkYXRhXCJcclxuICAgICAgQGJsYWNrb3V0ID0gbmV3IEJsYWNrb3V0IHRoaXMsIHtcclxuICAgICAgICBzdGF0ZTogc3RhdGUuYmxhY2tvdXRcclxuICAgICAgfVxyXG4gICAgICBAcHJlcGFyZUdhbWUoKVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgIyBAbG9nIFwiKENTKSBzYXZpbmcgc3RhdGVcIlxyXG4gICAgc3RhdGUgPSB7XHJcbiAgICAgIG9wdGlvbnM6IEBvcHRpb25zXHJcbiAgICB9XHJcbiAgICBpZiBAYmxhY2tvdXQ/XHJcbiAgICAgIHN0YXRlLmJsYWNrb3V0ID0gQGJsYWNrb3V0LnNhdmUoKVxyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5IHN0YXRlXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgYWlUaWNrUmF0ZTogLT5cclxuICAgIHJldHVybiBAb3B0aW9uTWVudXMuc3BlZWRzW0BvcHRpb25zLnNwZWVkSW5kZXhdLnNwZWVkXHJcblxyXG4gIG5ld0dhbWU6IC0+XHJcbiAgICBAYmxhY2tvdXQgPSBuZXcgQmxhY2tvdXQgdGhpcywge1xyXG4gICAgICByb3VuZHM6IEBvcHRpb25NZW51cy5yb3VuZHNbQG9wdGlvbnMucm91bmRJbmRleF0uZGF0YVxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgeyBpZDogMSwgbmFtZTogJ1BsYXllcicgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgICBmb3IgcCBpbiBbMS4uLkBvcHRpb25zLnBsYXllcnNdXHJcbiAgICAgIEBibGFja291dC5hZGRBSSgpXHJcbiAgICBAbG9nIFwibmV4dDogXCIgKyBAYmxhY2tvdXQubmV4dCgpXHJcbiAgICBAbG9nIFwicGxheWVyIDAncyBoYW5kOiBcIiArIEpTT04uc3RyaW5naWZ5KEBibGFja291dC5wbGF5ZXJzWzBdLmhhbmQpXHJcblxyXG4gICAgQHByZXBhcmVHYW1lKClcclxuXHJcbiAgcHJlcGFyZUdhbWU6IC0+XHJcbiAgICBAaGFuZCA9IG5ldyBIYW5kIHRoaXNcclxuICAgIEBwaWxlID0gbmV3IFBpbGUgdGhpcywgQGhhbmRcclxuICAgIEBoYW5kLnNldCBAYmxhY2tvdXQucGxheWVyc1swXS5oYW5kXHJcblxyXG4gIG1ha2VIYW5kOiAoaW5kZXgpIC0+XHJcbiAgICBmb3IgdiBpbiBbMC4uLjEzXVxyXG4gICAgICBpZiB2ID09IGluZGV4XHJcbiAgICAgICAgQGhhbmRbdl0gPSAxM1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQGhhbmRbdl0gPSB2XHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIGlucHV0IGhhbmRsaW5nXHJcblxyXG4gIHRvdWNoRG93bjogKHgsIHkpIC0+XHJcbiAgICAjIEBsb2coXCJ0b3VjaERvd24gI3t4fSwje3l9XCIpXHJcbiAgICBAY2hlY2tab25lcyh4LCB5KVxyXG5cclxuICB0b3VjaE1vdmU6ICh4LCB5KSAtPlxyXG4gICAgaWYgQGJsYWNrb3V0ICE9IG51bGxcclxuICAgICAgQGhhbmQubW92ZSh4LCB5KVxyXG5cclxuICB0b3VjaFVwOiAoeCwgeSkgLT5cclxuICAgIGlmIEBibGFja291dCAhPSBudWxsXHJcbiAgICAgIEBoYW5kLnVwKHgsIHkpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIGJpZCBoYW5kbGluZ1xyXG5cclxuICBhZGp1c3RCaWQ6IChhbW91bnQpIC0+XHJcbiAgICByZXR1cm4gaWYgQGJsYWNrb3V0ID09IG51bGxcclxuICAgIEBiaWQgPSBAYmlkICsgYW1vdW50XHJcbiAgICBpZiBAYmlkIDwgMFxyXG4gICAgICBAYmlkID0gMFxyXG4gICAgaWYgQGJpZCA+IEBibGFja291dC50cmlja3NcclxuICAgICAgQGJpZCA9IEBibGFja291dC50cmlja3NcclxuXHJcbiAgYXR0ZW1wdEJpZDogLT5cclxuICAgIHJldHVybiBpZiBAYmxhY2tvdXQgPT0gbnVsbFxyXG4gICAgQGFkanVzdEJpZCgwKVxyXG4gICAgaWYgQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLkJJRFxyXG4gICAgICBpZiBAYmxhY2tvdXQudHVybiA9PSAwXHJcbiAgICAgICAgQGxvZyBcImJpZGRpbmcgI3tAYmlkfVwiXHJcbiAgICAgICAgQGxhc3RFcnIgPSBAYmxhY2tvdXQuYmlkIHtcclxuICAgICAgICAgIGlkOiAxXHJcbiAgICAgICAgICBiaWQ6IEBiaWRcclxuICAgICAgICAgIGFpOiBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgaGVhZGxpbmUgKGdhbWUgc3RhdGUgaW4gdG9wIGxlZnQpXHJcblxyXG4gIHByZXR0eUVycm9yVGFibGU6IHtcclxuICAgIGJpZE91dE9mUmFuZ2U6ICAgICAgXCJZb3UgYXJlIHNvbWVob3cgYmlkZGluZyBhbiBpbXBvc3NpYmxlIHZhbHVlLiBUaGUgZ2FtZSBtdXN0IGJlIGJyb2tlbi5cIlxyXG4gICAgZGVhbGVyRnVja2VkOiAgICAgICBcIkRlYWxlciByZXN0cmljdGlvbjogWW91IG1heSBub3QgbWFrZSB0b3RhbCBiaWRzIG1hdGNoIHRvdGFsIHRyaWNrcy5cIlxyXG4gICAgZG9Ob3RIYXZlOiAgICAgICAgICBcIllvdSBhcmUgc29tZWhvdyBhdHRlbXB0aW5nIHRvIHBsYXkgYSBjYXJkIHlvdSBkb24ndCBvd24uIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXHJcbiAgICBmb3JjZWRIaWdoZXJJblN1aXQ6IFwiWW91IGhhdmUgYSBoaWdoZXIgdmFsdWUgaW4gdGhlIGxlYWQgc3VpdC4gWW91IG11c3QgcGxheSBpdC4gKFJ1bGUgMilcIlxyXG4gICAgZm9yY2VkSW5TdWl0OiAgICAgICBcIllvdSBoYXZlIGF0IGxlYXN0IG9uZSBvZiB0aGUgbGVhZCBzdWl0LiBZb3UgbXVzdCBwbGF5IGl0LiAoUnVsZSAxKVwiXHJcbiAgICBnYW1lT3ZlcjogICAgICAgICAgIFwiVGhlIGdhbWUgaXMgb3Zlci4gIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXHJcbiAgICBpbmRleE91dE9mUmFuZ2U6ICAgIFwiWW91IGRvbid0IGhhdmUgdGhhdCBpbmRleC4gVGhlIGdhbWUgbXVzdCBiZSBicm9rZW4uXCJcclxuICAgIGxvd2VzdENhcmRSZXF1aXJlZDogXCJZb3UgbXVzdCBzdGFydCB0aGUgcm91bmQgd2l0aCB0aGUgbG93ZXN0IGNhcmQgeW91IGhhdmUuXCJcclxuICAgIG5leHRJc0NvbmZ1c2VkOiAgICAgXCJJbnRlcmFsIGVycm9yLiBUaGUgZ2FtZSBtdXN0IGJlIGJyb2tlbi5cIlxyXG4gICAgbm9OZXh0OiAgICAgICAgICAgICBcIkludGVyYWwgZXJyb3IuIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXHJcbiAgICBub3RCaWRkaW5nTm93OiAgICAgIFwiWW91IGFyZSB0cnlpbmcgdG8gYmlkIGR1cmluZyB0aGUgd3JvbmcgcGhhc2UuXCJcclxuICAgIG5vdEVub3VnaFBsYXllcnM6ICAgXCJDYW5ub3Qgc3RhcnQgdGhlIGdhbWUgd2l0aG91dCBtb3JlIHBsYXllcnMuXCJcclxuICAgIG5vdEluVHJpY2s6ICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBwbGF5IGEgY2FyZCBkdXJpbmcgdGhlIHdyb25nIHBoYXNlLlwiXHJcbiAgICBub3RZb3VyVHVybjogICAgICAgIFwiSXQgaXNuJ3QgeW91ciB0dXJuLlwiXHJcbiAgICB0cnVtcE5vdEJyb2tlbjogICAgIFwiVHJ1bXAgaXNuJ3QgYnJva2VuIHlldC4gTGVhZCB3aXRoIGEgbm9uLXNwYWRlLlwiXHJcbiAgfVxyXG5cclxuICBwcmV0dHlFcnJvcjogLT5cclxuICAgIHByZXR0eSA9IEBwcmV0dHlFcnJvclRhYmxlW0BsYXN0RXJyXVxyXG4gICAgcmV0dXJuIHByZXR0eSBpZiBwcmV0dHlcclxuICAgIHJldHVybiBAbGFzdEVyclxyXG5cclxuICBjYWxjSGVhZGxpbmU6IC0+XHJcbiAgICByZXR1cm4gXCJcIiBpZiBAYmxhY2tvdXQgPT0gbnVsbFxyXG5cclxuICAgIGhlYWRsaW5lID0gXCJcIlxyXG4gICAgc3dpdGNoIEBibGFja291dC5zdGF0ZVxyXG4gICAgICB3aGVuIFN0YXRlLkJJRFxyXG4gICAgICAgIGhlYWRsaW5lID0gXCJXYWl0aW5nIGZvciBgZmY3NzAwYCN7QGJsYWNrb3V0LnBsYXllcnNbQGJsYWNrb3V0LnR1cm5dLm5hbWV9YGAgdG8gYGZmZmYwMGBiaWRgYFwiXHJcbiAgICAgIHdoZW4gU3RhdGUuVFJJQ0tcclxuICAgICAgICBoZWFkbGluZSA9IFwiV2FpdGluZyBmb3IgYGZmNzcwMGAje0BibGFja291dC5wbGF5ZXJzW0BibGFja291dC50dXJuXS5uYW1lfWBgIHRvIGBmZmZmMDBgcGxheWBgXCJcclxuICAgICAgd2hlbiBTdGF0ZS5ST1VORFNVTU1BUllcclxuICAgICAgICBoZWFkbGluZSA9IFwiV2FpdGluZyBmb3IgbmV4dCByb3VuZC4uLlwiXHJcbiAgICAgIHdoZW4gU3RhdGUuUE9TVEdBTUVTVU1NQVJZXHJcbiAgICAgICAgaGVhZGxpbmUgPSBcIkdhbWUgb3ZlciFcIlxyXG5cclxuICAgIGVyclRleHQgPSBcIlwiXHJcbiAgICBpZiAoQGxhc3RFcnIubGVuZ3RoID4gMCkgYW5kIChAbGFzdEVyciAhPSBPSylcclxuICAgICAgZXJyVGV4dCA9IFwiICBFUlJPUjogYGZmMDAwMGAje0BwcmV0dHlFcnJvcigpfVwiXHJcbiAgICAgIGhlYWRsaW5lICs9IGVyclRleHRcclxuXHJcbiAgICByZXR1cm4gaGVhZGxpbmVcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgZ2FtZSBvdmVyIGluZm9ybWF0aW9uXHJcblxyXG4gIGdhbWVPdmVyVGV4dDogLT5cclxuICAgIHJldHVybiBbXCJHYW1lIE92ZXIhXCJdIGlmIEBibGFja291dCA9PSBudWxsXHJcblxyXG4gICAgaWYgQGJsYWNrb3V0Lm1hcmF0aG9uTW9kZSgpXHJcbiAgICAgIHJldHVybiBbXCJNYXJhdGhvbiBvdmVyIVwiLCBcIlN1cnZpdmVkICN7QGJsYWNrb3V0Lm5leHRSb3VuZCAtIDF9IHJvdW5kc1wiXVxyXG5cclxuICAgIGxvd2VzdFNjb3JlID0gQGJsYWNrb3V0LnBsYXllcnNbMF0uc2NvcmVcclxuICAgIGZvciBwbGF5ZXIgaW4gQGJsYWNrb3V0LnBsYXllcnNcclxuICAgICAgaWYgbG93ZXN0U2NvcmUgPiBwbGF5ZXIuc2NvcmVcclxuICAgICAgICBsb3dlc3RTY29yZSA9IHBsYXllci5zY29yZVxyXG5cclxuICAgIHdpbm5lcnMgPSBbXVxyXG4gICAgZm9yIHBsYXllciBpbiBAYmxhY2tvdXQucGxheWVyc1xyXG4gICAgICBpZiBwbGF5ZXIuc2NvcmUgPT0gbG93ZXN0U2NvcmVcclxuICAgICAgICB3aW5uZXJzLnB1c2ggcGxheWVyLm5hbWVcclxuXHJcbiAgICBpZiB3aW5uZXJzLmxlbmd0aCA9PSAxXHJcbiAgICAgIHJldHVybiBbXCIje3dpbm5lcnNbMF19IHdpbnMhXCJdXHJcblxyXG4gICAgcmV0dXJuIFtcIlRpZTogI3t3aW5uZXJzLmpvaW4oJywnKX1cIl1cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgY2FyZCBoYW5kbGluZ1xyXG5cclxuICBwbGF5OiAoY2FyZFRvUGxheSwgeCwgeSwgciwgY2FyZEluZGV4KSAtPlxyXG4gICAgaWYgQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLlRSSUNLXHJcbiAgICAgIEBsb2cgXCIoZ2FtZSkgcGxheWluZyBjYXJkICN7Y2FyZFRvUGxheX1cIlxyXG4gICAgICByZXQgPSBAYmxhY2tvdXQucGxheSB7XHJcbiAgICAgICAgaWQ6IDFcclxuICAgICAgICB3aGljaDogY2FyZFRvUGxheVxyXG4gICAgICB9XHJcbiAgICAgIEBsYXN0RXJyID0gcmV0XHJcbiAgICAgIGlmIHJldCA9PSBPS1xyXG4gICAgICAgIEBoYW5kLnNldCBAYmxhY2tvdXQucGxheWVyc1swXS5oYW5kXHJcbiAgICAgICAgQHBpbGUuaGludCBjYXJkVG9QbGF5LCB4LCB5LCByXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIG1haW4gbG9vcFxyXG5cclxuICB1cGRhdGU6IChkdCkgLT5cclxuICAgIEB6b25lcy5sZW5ndGggPSAwICMgZm9yZ2V0IGFib3V0IHpvbmVzIGZyb20gdGhlIGxhc3QgZnJhbWUuIHdlJ3JlIGFib3V0IHRvIG1ha2Ugc29tZSBuZXcgb25lcyFcclxuXHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuICAgIGlmIEB1cGRhdGVNYWluTWVudShkdClcclxuICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgIGlmIEB1cGRhdGVHYW1lKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG5cclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG4gIHVwZGF0ZU1haW5NZW51OiAoZHQpIC0+XHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuICAgIGlmIEBtYWluTWVudS51cGRhdGUoZHQpXHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICByZXR1cm4gdXBkYXRlZFxyXG5cclxuICB1cGRhdGVHYW1lOiAoZHQpIC0+XHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQGJsYWNrb3V0ID09IG51bGxcclxuXHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuICAgIGlmIEBwaWxlLnVwZGF0ZShkdClcclxuICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgIGlmIEBwaWxlLnJlYWR5Rm9yTmV4dFRyaWNrKClcclxuICAgICAgQG5leHRBSVRpY2sgLT0gZHRcclxuICAgICAgaWYgQG5leHRBSVRpY2sgPD0gMFxyXG4gICAgICAgIEBuZXh0QUlUaWNrID0gQGFpVGlja1JhdGUoKVxyXG4gICAgICAgIGlmIEBibGFja291dC5haVRpY2soKVxyXG4gICAgICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgIGlmIEBoYW5kLnVwZGF0ZShkdClcclxuICAgICAgdXBkYXRlZCA9IHRydWVcclxuXHJcbiAgICB0cmlja1Rha2VyTmFtZSA9IFwiXCJcclxuICAgIGlmIEBibGFja291dC5wcmV2VHJpY2tUYWtlciAhPSAtMVxyXG4gICAgICB0cmlja1Rha2VyTmFtZSA9IEBibGFja291dC5wbGF5ZXJzW0BibGFja291dC5wcmV2VHJpY2tUYWtlcl0ubmFtZVxyXG4gICAgQHBpbGUuc2V0IEBibGFja291dC50cmlja0lELCBAYmxhY2tvdXQucGlsZSwgQGJsYWNrb3V0LnBpbGVXaG8sIEBibGFja291dC5wcmV2LCBAYmxhY2tvdXQucHJldldobywgdHJpY2tUYWtlck5hbWUsIEBibGFja291dC5wbGF5ZXJzLmxlbmd0aCwgQGJsYWNrb3V0LnR1cm5cclxuXHJcbiAgICBpZiBAcGF1c2VNZW51LnVwZGF0ZShkdClcclxuICAgICAgdXBkYXRlZCA9IHRydWVcclxuXHJcbiAgICBAYWRqdXN0QmlkKDApXHJcbiAgICBpZiBAYmlkVUkubWludXMudXBkYXRlKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgaWYgQGJpZFVJLnBsdXMudXBkYXRlKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG5cclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG4gIHJlbmRlcjogLT5cclxuICAgICMgUmVzZXQgcmVuZGVyIGNvbW1hbmRzXHJcbiAgICBAcmVuZGVyQ29tbWFuZHMubGVuZ3RoID0gMFxyXG5cclxuICAgIGlmIEBob3d0byA+IDBcclxuICAgICAgQHJlbmRlckhvd3RvKClcclxuICAgIGVsc2UgaWYgQGJsYWNrb3V0ID09IG51bGxcclxuICAgICAgQHJlbmRlck1haW5NZW51KClcclxuICAgIGVsc2VcclxuICAgICAgQHJlbmRlckdhbWUoKVxyXG5cclxuICAgIHJldHVybiBAcmVuZGVyQ29tbWFuZHNcclxuXHJcbiAgcmVuZGVySG93dG86IC0+XHJcbiAgICBob3d0b1RleHR1cmUgPSBcImhvd3RvI3tAaG93dG99XCJcclxuICAgIEBsb2cgXCJyZW5kZXJpbmcgI3tob3d0b1RleHR1cmV9XCJcclxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCAwLCAwLCBAd2lkdGgsIEBoZWlnaHQsIDAsIDAsIDAsIEBjb2xvcnMuYmxhY2tcclxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgaG93dG9UZXh0dXJlLCAwLCAwLCBAd2lkdGgsIEBhYUhlaWdodCwgMCwgMCwgMCwgQGNvbG9ycy53aGl0ZVxyXG4gICAgYXJyb3dXaWR0aCA9IEB3aWR0aCAvIDIwXHJcbiAgICBhcnJvd09mZnNldCA9IGFycm93V2lkdGggKiA0XHJcbiAgICBjb2xvciA9IGlmIEBob3d0byA9PSAxIHRoZW4gQGNvbG9ycy5hcnJvd2Nsb3NlIGVsc2UgQGNvbG9ycy5hcnJvd1xyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcImFycm93TFwiLCBAY2VudGVyLnggLSBhcnJvd09mZnNldCwgQGhlaWdodCwgYXJyb3dXaWR0aCwgMCwgMCwgMC41LCAxLCBjb2xvciwgPT5cclxuICAgICAgQGhvd3RvLS1cclxuICAgICAgaWYgQGhvd3RvIDwgMFxyXG4gICAgICAgIEBob3d0byA9IDBcclxuICAgIGNvbG9yID0gaWYgQGhvd3RvID09IDMgdGhlbiBAY29sb3JzLmFycm93Y2xvc2UgZWxzZSBAY29sb3JzLmFycm93XHJcbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwiYXJyb3dSXCIsIEBjZW50ZXIueCArIGFycm93T2Zmc2V0LCBAaGVpZ2h0LCBhcnJvd1dpZHRoLCAwLCAwLCAwLjUsIDEsIGNvbG9yLCA9PlxyXG4gICAgICBAaG93dG8rK1xyXG4gICAgICBpZiBAaG93dG8gPiAzXHJcbiAgICAgICAgQGhvd3RvID0gMFxyXG5cclxuICByZW5kZXJNYWluTWVudTogLT5cclxuICAgIEBtYWluTWVudS5yZW5kZXIoKVxyXG5cclxuICByZW5kZXJHYW1lOiAtPlxyXG5cclxuICAgICMgYmFja2dyb3VuZFxyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIDAsIDAsIEB3aWR0aCwgQGhlaWdodCwgMCwgMCwgMCwgQGNvbG9ycy5iYWNrZ3JvdW5kXHJcblxyXG4gICAgdGV4dEhlaWdodCA9IEBhYUhlaWdodCAvIDI1XHJcbiAgICB0ZXh0UGFkZGluZyA9IHRleHRIZWlnaHQgLyA1XHJcbiAgICBjaGFyYWN0ZXJIZWlnaHQgPSBAYWFIZWlnaHQgLyA1XHJcbiAgICBzY29yZUhlaWdodCA9IHRleHRIZWlnaHRcclxuXHJcbiAgICAjIExvZ1xyXG4gICAgZm9yIGxpbmUsIGkgaW4gQGJsYWNrb3V0LmxvZ1xyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgdGV4dEhlaWdodCwgbGluZSwgMCwgKGkrMSkgKiAodGV4dEhlaWdodCArIHRleHRQYWRkaW5nKSwgMCwgMCwgQGNvbG9ycy53aGl0ZVxyXG5cclxuICAgIGlmIEBibGFja291dC5tYXJhdGhvbk1vZGUoKVxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgdGV4dEhlaWdodCwgXCJNQVJBVEhPTiBNT0RFXCIsIEB3aWR0aCAtIEBwYXVzZUJ1dHRvblNpemUsIDAsIDEsIDAsIEBjb2xvcnMub3JhbmdlXHJcblxyXG4gICAgYWlQbGF5ZXJzID0gW251bGwsIG51bGwsIG51bGxdXHJcbiAgICBpZiBAYmxhY2tvdXQucGxheWVycy5sZW5ndGggPT0gMlxyXG4gICAgICBhaVBsYXllcnNbMV0gPSBAYmxhY2tvdXQucGxheWVyc1sxXVxyXG4gICAgZWxzZSBpZiBAYmxhY2tvdXQucGxheWVycy5sZW5ndGggPT0gM1xyXG4gICAgICBhaVBsYXllcnNbMF0gPSBAYmxhY2tvdXQucGxheWVyc1sxXVxyXG4gICAgICBhaVBsYXllcnNbMl0gPSBAYmxhY2tvdXQucGxheWVyc1syXVxyXG4gICAgZWxzZSAjIDQgcGxheWVyXHJcbiAgICAgIGFpUGxheWVyc1swXSA9IEBibGFja291dC5wbGF5ZXJzWzFdXHJcbiAgICAgIGFpUGxheWVyc1sxXSA9IEBibGFja291dC5wbGF5ZXJzWzJdXHJcbiAgICAgIGFpUGxheWVyc1syXSA9IEBibGFja291dC5wbGF5ZXJzWzNdXHJcblxyXG4gICAgY2hhcmFjdGVyTWFyZ2luID0gY2hhcmFjdGVySGVpZ2h0IC8gMlxyXG5cclxuICAgICMgbGVmdCBzaWRlXHJcbiAgICBpZiBhaVBsYXllcnNbMF0gIT0gbnVsbFxyXG4gICAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbYWlQbGF5ZXJzWzBdLmNoYXJJRF1cclxuICAgICAgY2hhcmFjdGVyV2lkdGggPSBAc3ByaXRlUmVuZGVyZXIuY2FsY1dpZHRoKGNoYXJhY3Rlci5zcHJpdGUsIGNoYXJhY3RlckhlaWdodClcclxuICAgICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBjaGFyYWN0ZXIuc3ByaXRlLCBjaGFyYWN0ZXJNYXJnaW4sIEBoYW5kLnBsYXlDZWlsaW5nLCAwLCBjaGFyYWN0ZXJIZWlnaHQsIDAsIDAsIDEsIEBjb2xvcnMud2hpdGVcclxuICAgICAgQHJlbmRlclNjb3JlIGFpUGxheWVyc1swXSwgYWlQbGF5ZXJzWzBdLmluZGV4ID09IEBibGFja291dC50dXJuLCBzY29yZUhlaWdodCwgY2hhcmFjdGVyTWFyZ2luICsgKGNoYXJhY3RlcldpZHRoIC8gMiksIEBoYW5kLnBsYXlDZWlsaW5nIC0gdGV4dFBhZGRpbmcsIDAuNSwgMFxyXG4gICAgIyB0b3Agc2lkZVxyXG4gICAgaWYgYWlQbGF5ZXJzWzFdICE9IG51bGxcclxuICAgICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2FpUGxheWVyc1sxXS5jaGFySURdXHJcbiAgICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgY2hhcmFjdGVyLnNwcml0ZSwgQGNlbnRlci54LCAwLCAwLCBjaGFyYWN0ZXJIZWlnaHQsIDAsIDAuNSwgMCwgQGNvbG9ycy53aGl0ZVxyXG4gICAgICBAcmVuZGVyU2NvcmUgYWlQbGF5ZXJzWzFdLCBhaVBsYXllcnNbMV0uaW5kZXggPT0gQGJsYWNrb3V0LnR1cm4sIHNjb3JlSGVpZ2h0LCBAY2VudGVyLngsIGNoYXJhY3RlckhlaWdodCwgMC41LCAwXHJcbiAgICAjIHJpZ2h0IHNpZGVcclxuICAgIGlmIGFpUGxheWVyc1syXSAhPSBudWxsXHJcbiAgICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1thaVBsYXllcnNbMl0uY2hhcklEXVxyXG4gICAgICBjaGFyYWN0ZXJXaWR0aCA9IEBzcHJpdGVSZW5kZXJlci5jYWxjV2lkdGgoY2hhcmFjdGVyLnNwcml0ZSwgY2hhcmFjdGVySGVpZ2h0KVxyXG4gICAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIGNoYXJhY3Rlci5zcHJpdGUsIEB3aWR0aCAtIGNoYXJhY3Rlck1hcmdpbiwgQGhhbmQucGxheUNlaWxpbmcsIDAsIGNoYXJhY3RlckhlaWdodCwgMCwgMSwgMSwgQGNvbG9ycy53aGl0ZVxyXG4gICAgICBAcmVuZGVyU2NvcmUgYWlQbGF5ZXJzWzJdLCBhaVBsYXllcnNbMl0uaW5kZXggPT0gQGJsYWNrb3V0LnR1cm4sIHNjb3JlSGVpZ2h0LCBAd2lkdGggLSAoY2hhcmFjdGVyTWFyZ2luICsgKGNoYXJhY3RlcldpZHRoIC8gMikpLCBAaGFuZC5wbGF5Q2VpbGluZyAtIHRleHRQYWRkaW5nLCAwLjUsIDBcclxuXHJcbiAgICBAcGlsZS5yZW5kZXIoKVxyXG5cclxuICAgIGlmIChAYmxhY2tvdXQuc3RhdGUgPT0gU3RhdGUuUE9TVEdBTUVTVU1NQVJZKSBhbmQgQHBpbGUucmVzdGluZygpXHJcbiAgICAgIGxpbmVzID0gQGdhbWVPdmVyVGV4dCgpXHJcbiAgICAgIGdhbWVPdmVyU2l6ZSA9IEBhYUhlaWdodCAvIDhcclxuICAgICAgZ2FtZU92ZXJZID0gQGNlbnRlci55XHJcbiAgICAgIGlmIGxpbmVzLmxlbmd0aCA+IDFcclxuICAgICAgICBnYW1lT3ZlclkgLT0gKGdhbWVPdmVyU2l6ZSA+PiAxKVxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgZ2FtZU92ZXJTaXplLCBsaW5lc1swXSwgQGNlbnRlci54LCBnYW1lT3ZlclksIDAuNSwgMC41LCBAY29sb3JzLm9yYW5nZVxyXG4gICAgICBpZiBsaW5lcy5sZW5ndGggPiAxXHJcbiAgICAgICAgZ2FtZU92ZXJZICs9IGdhbWVPdmVyU2l6ZVxyXG4gICAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBnYW1lT3ZlclNpemUsIGxpbmVzWzFdLCBAY2VudGVyLngsIGdhbWVPdmVyWSwgMC41LCAwLjUsIEBjb2xvcnMub3JhbmdlXHJcblxyXG4gICAgICByZXN0YXJ0UXVpdFNpemUgPSBAYWFIZWlnaHQgLyAxMlxyXG4gICAgICBzaGFkb3dEaXN0YW5jZSA9IHJlc3RhcnRRdWl0U2l6ZSAvIDhcclxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHJlc3RhcnRRdWl0U2l6ZSwgXCJSZXN0YXJ0XCIsIHNoYWRvd0Rpc3RhbmNlICsgQGNlbnRlci54IC8gMiwgc2hhZG93RGlzdGFuY2UgKyBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuYmxhY2ssID0+XHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCByZXN0YXJ0UXVpdFNpemUsIFwiUmVzdGFydFwiLCBAY2VudGVyLnggLyAyLCBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuZ29sZCwgPT5cclxuICAgICAgICBAbmV3R2FtZSgpXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCByZXN0YXJ0UXVpdFNpemUsIFwiUXVpdFwiLCBzaGFkb3dEaXN0YW5jZSArIEBjZW50ZXIueCArIChAY2VudGVyLnggLyAyKSwgc2hhZG93RGlzdGFuY2UgKyBAaGVpZ2h0IC0gcmVzdGFydFF1aXRTaXplLCAwLjUsIDEsIEBjb2xvcnMuYmxhY2ssID0+XHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCByZXN0YXJ0UXVpdFNpemUsIFwiUXVpdFwiLCBAY2VudGVyLnggKyAoQGNlbnRlci54IC8gMiksIEBoZWlnaHQgLSByZXN0YXJ0UXVpdFNpemUsIDAuNSwgMSwgQGNvbG9ycy5nb2xkLCA9PlxyXG4gICAgICAgIEBibGFja291dCA9IG51bGxcclxuXHJcbiAgICBpZiAoQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLlJPVU5EU1VNTUFSWSkgYW5kIEBwaWxlLnJlc3RpbmcoKVxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgQGFhSGVpZ2h0IC8gOCwgXCJUYXAgZm9yIG5leHQgcm91bmQgLi4uXCIsIEBjZW50ZXIueCwgQGNlbnRlci55LCAwLjUsIDAuNSwgQGNvbG9ycy5vcmFuZ2UsID0+XHJcbiAgICAgICAgaWYgQGJsYWNrb3V0Lm5leHQoKSA9PSBPS1xyXG4gICAgICAgICAgQGhhbmQuc2V0IEBibGFja291dC5wbGF5ZXJzWzBdLmhhbmRcclxuXHJcbiAgICBpZiAoQGJsYWNrb3V0LnN0YXRlID09IFN0YXRlLkJJRCkgYW5kIChAYmxhY2tvdXQudHVybiA9PSAwKVxyXG4gICAgICBAYmlkVUkubWludXMucmVuZGVyKClcclxuICAgICAgQGJpZFVJLnBsdXMucmVuZGVyKClcclxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIEBiaWRUZXh0U2l6ZSwgXCIje0BiaWR9XCIsIEBjZW50ZXIueCwgQGJpZEJ1dHRvblkgLSAoQGJpZFRleHRTaXplICogMC4xKSwgMC41LCAwLjUsIEBjb2xvcnMud2hpdGUsID0+XHJcbiAgICAgICAgQGF0dGVtcHRCaWQoKVxyXG4gICAgICBiaWRCdXR0b25IZWlnaHQgPSBAYWFIZWlnaHQgLyAxMlxyXG4gICAgICBiaWRTaXplID0gQGZvbnRSZW5kZXJlci5zaXplKEBmb250LCBiaWRCdXR0b25IZWlnaHQsIFwiQmlkXCIpXHJcbiAgICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCBAY2VudGVyLngsIChAYmlkQnV0dG9uWSArIEBiaWRUZXh0U2l6ZSkgKyAoYmlkU2l6ZS5oICogMC4yKSwgYmlkU2l6ZS53ICogMywgYmlkU2l6ZS5oICogMS41LCAwLCAwLjUsIDAuNSwgQGNvbG9ycy5iaWQsID0+XHJcbiAgICAgICAgQGF0dGVtcHRCaWQoKVxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgYmlkQnV0dG9uSGVpZ2h0LCBcIkJpZFwiLCBAY2VudGVyLngsIEBiaWRCdXR0b25ZICsgQGJpZFRleHRTaXplLCAwLjUsIDAuNSwgQGNvbG9ycy53aGl0ZVxyXG5cclxuICAgICMgY2FyZCBhcmVhXHJcbiAgICAjIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCAwLCBAaGVpZ2h0LCBAd2lkdGgsIEBoZWlnaHQgLSBAaGFuZC5wbGF5Q2VpbGluZywgMCwgMCwgMSwgQGNvbG9ycy5oYW5kYXJlYVxyXG4gICAgQGhhbmQucmVuZGVyKClcclxuICAgIEByZW5kZXJTY29yZSBAYmxhY2tvdXQucGxheWVyc1swXSwgMCA9PSBAYmxhY2tvdXQudHVybiwgc2NvcmVIZWlnaHQsIEBjZW50ZXIueCwgQGhlaWdodCwgMC41LCAxXHJcblxyXG4gICAgIyBIZWFkbGluZSAoaW5jbHVkZXMgZXJyb3IpXHJcbiAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgdGV4dEhlaWdodCwgQGNhbGNIZWFkbGluZSgpLCAwLCAwLCAwLCAwLCBAY29sb3JzLmxpZ2h0Z3JheVxyXG5cclxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJwYXVzZVwiLCBAd2lkdGgsIDAsIDAsIEBwYXVzZUJ1dHRvblNpemUsIDAsIDEsIDAsIEBjb2xvcnMud2hpdGUsID0+XHJcbiAgICAgIEBwYXVzZWQgPSB0cnVlXHJcblxyXG4gICAgaWYgQHBhdXNlZFxyXG4gICAgICBAcGF1c2VNZW51LnJlbmRlcigpXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlbmRlclNjb3JlOiAocGxheWVyLCBteVR1cm4sIHNjb3JlSGVpZ2h0LCB4LCB5LCBhbmNob3J4LCBhbmNob3J5KSAtPlxyXG4gICAgaWYgbXlUdXJuXHJcbiAgICAgIG5hbWVDb2xvciA9IFwiYGZmNzcwMGBcIlxyXG4gICAgZWxzZVxyXG4gICAgICBuYW1lQ29sb3IgPSBcIlwiXHJcbiAgICBuYW1lU3RyaW5nID0gXCIgI3tuYW1lQ29sb3J9I3twbGF5ZXIubmFtZX1gYDogI3twbGF5ZXIuc2NvcmV9IFwiXHJcbiAgICBpZiBwbGF5ZXIuYmlkID09IC0xXHJcbiAgICAgIHNjb3JlU3RyaW5nID0gXCJbIC0tIF1cIlxyXG4gICAgZWxzZVxyXG4gICAgICBpZiBwbGF5ZXIudHJpY2tzIDwgcGxheWVyLmJpZFxyXG4gICAgICAgIHRyaWNrQ29sb3IgPSBcImZmZmYzM1wiXHJcbiAgICAgIGVsc2UgaWYgcGxheWVyLnRyaWNrcyA9PSBwbGF5ZXIuYmlkXHJcbiAgICAgICAgdHJpY2tDb2xvciA9IFwiMzNmZjMzXCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRyaWNrQ29sb3IgPSBcImZmMzMzM1wiXHJcbiAgICAgIHNjb3JlU3RyaW5nID0gXCJbIGAje3RyaWNrQ29sb3J9YCN7cGxheWVyLnRyaWNrc31gYC8je3BsYXllci5iaWR9IF1cIlxyXG5cclxuICAgIG5hbWVTaXplID0gQGZvbnRSZW5kZXJlci5zaXplKEBmb250LCBzY29yZUhlaWdodCwgbmFtZVN0cmluZylcclxuICAgIHNjb3JlU2l6ZSA9IEBmb250UmVuZGVyZXIuc2l6ZShAZm9udCwgc2NvcmVIZWlnaHQsIHNjb3JlU3RyaW5nKVxyXG4gICAgaWYgbmFtZVNpemUudyA+IHNjb3JlU2l6ZS53XHJcbiAgICAgIHNjb3JlU2l6ZS53ID0gbmFtZVNpemUud1xyXG4gICAgbmFtZVkgPSB5XHJcbiAgICBzY29yZVkgPSB5XHJcbiAgICBpZiBhbmNob3J5ID4gMFxyXG4gICAgICBuYW1lWSAtPSBzY29yZUhlaWdodFxyXG4gICAgZWxzZVxyXG4gICAgICBzY29yZVkgKz0gc2NvcmVIZWlnaHRcclxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJzb2xpZFwiLCB4LCB5LCBzY29yZVNpemUudywgc2NvcmVTaXplLmggKiAyLCAwLCBhbmNob3J4LCBhbmNob3J5LCBAY29sb3JzLm92ZXJsYXlcclxuICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBzY29yZUhlaWdodCwgbmFtZVN0cmluZywgeCwgbmFtZVksIGFuY2hvcngsIGFuY2hvcnksIEBjb2xvcnMud2hpdGVcclxuICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBzY29yZUhlaWdodCwgc2NvcmVTdHJpbmcsIHgsIHNjb3JlWSwgYW5jaG9yeCwgYW5jaG9yeSwgQGNvbG9ycy53aGl0ZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyByZW5kZXJpbmcgYW5kIHpvbmVzXHJcblxyXG4gIGRyYXdJbWFnZTogKHRleHR1cmUsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCwgcm90LCBhbmNob3J4LCBhbmNob3J5LCByLCBnLCBiLCBhLCBjYikgLT5cclxuICAgIEByZW5kZXJDb21tYW5kcy5wdXNoIEB0ZXh0dXJlc1t0ZXh0dXJlXSwgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoLCByb3QsIGFuY2hvcngsIGFuY2hvcnksIHIsIGcsIGIsIGFcclxuXHJcbiAgICBpZiBjYj9cclxuICAgICAgIyBjYWxsZXIgd2FudHMgdG8gcmVtZW1iZXIgd2hlcmUgdGhpcyB3YXMgZHJhd24sIGFuZCB3YW50cyB0byBiZSBjYWxsZWQgYmFjayBpZiBpdCBpcyBldmVyIHRvdWNoZWRcclxuICAgICAgIyBUaGlzIGlzIGNhbGxlZCBhIFwiem9uZVwiLiBTaW5jZSB6b25lcyBhcmUgdHJhdmVyc2VkIGluIHJldmVyc2Ugb3JkZXIsIHRoZSBuYXR1cmFsIG92ZXJsYXAgb2ZcclxuICAgICAgIyBhIHNlcmllcyBvZiByZW5kZXJzIGlzIHJlc3BlY3RlZCBhY2NvcmRpbmdseS5cclxuICAgICAgYW5jaG9yT2Zmc2V0WCA9IC0xICogYW5jaG9yeCAqIGR3XHJcbiAgICAgIGFuY2hvck9mZnNldFkgPSAtMSAqIGFuY2hvcnkgKiBkaFxyXG4gICAgICB6b25lID1cclxuICAgICAgICAjIGNlbnRlciAoWCxZKSBhbmQgcmV2ZXJzZWQgcm90YXRpb24sIHVzZWQgdG8gcHV0IHRoZSBjb29yZGluYXRlIGluIGxvY2FsIHNwYWNlIHRvIHRoZSB6b25lXHJcbiAgICAgICAgY3g6ICBkeFxyXG4gICAgICAgIGN5OiAgZHlcclxuICAgICAgICByb3Q6IHJvdCAqIC0xXHJcbiAgICAgICAgIyB0aGUgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveCB1c2VkIGZvciBkZXRlY3Rpb24gb2YgYSBsb2NhbHNwYWNlIGNvb3JkXHJcbiAgICAgICAgbDogICBhbmNob3JPZmZzZXRYXHJcbiAgICAgICAgdDogICBhbmNob3JPZmZzZXRZXHJcbiAgICAgICAgcjogICBhbmNob3JPZmZzZXRYICsgZHdcclxuICAgICAgICBiOiAgIGFuY2hvck9mZnNldFkgKyBkaFxyXG4gICAgICAgICMgY2FsbGJhY2sgdG8gY2FsbCBpZiB0aGUgem9uZSBpcyBjbGlja2VkIG9uXHJcbiAgICAgICAgY2I6ICBjYlxyXG4gICAgICBAem9uZXMucHVzaCB6b25lXHJcblxyXG4gIGNoZWNrWm9uZXM6ICh4LCB5KSAtPlxyXG4gICAgZm9yIHpvbmUgaW4gQHpvbmVzIGJ5IC0xXHJcbiAgICAgICMgbW92ZSBjb29yZCBpbnRvIHNwYWNlIHJlbGF0aXZlIHRvIHRoZSBxdWFkLCB0aGVuIHJvdGF0ZSBpdCB0byBtYXRjaFxyXG4gICAgICB1bnJvdGF0ZWRMb2NhbFggPSB4IC0gem9uZS5jeFxyXG4gICAgICB1bnJvdGF0ZWRMb2NhbFkgPSB5IC0gem9uZS5jeVxyXG4gICAgICBsb2NhbFggPSB1bnJvdGF0ZWRMb2NhbFggKiBNYXRoLmNvcyh6b25lLnJvdCkgLSB1bnJvdGF0ZWRMb2NhbFkgKiBNYXRoLnNpbih6b25lLnJvdClcclxuICAgICAgbG9jYWxZID0gdW5yb3RhdGVkTG9jYWxYICogTWF0aC5zaW4oem9uZS5yb3QpICsgdW5yb3RhdGVkTG9jYWxZICogTWF0aC5jb3Moem9uZS5yb3QpXHJcbiAgICAgIGlmIChsb2NhbFggPCB6b25lLmwpIG9yIChsb2NhbFggPiB6b25lLnIpIG9yIChsb2NhbFkgPCB6b25lLnQpIG9yIChsb2NhbFkgPiB6b25lLmIpXHJcbiAgICAgICAgIyBvdXRzaWRlIG9mIG9yaWVudGVkIGJvdW5kaW5nIGJveFxyXG4gICAgICAgIGNvbnRpbnVlXHJcbiAgICAgIHpvbmUuY2IoeCwgeSlcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVcclxuIiwiQW5pbWF0aW9uID0gcmVxdWlyZSAnLi9BbmltYXRpb24nXHJcblxyXG5DQVJEX0lNQUdFX1cgPSAxMjBcclxuQ0FSRF9JTUFHRV9IID0gMTYyXHJcbkNBUkRfSU1BR0VfT0ZGX1ggPSA0XHJcbkNBUkRfSU1BR0VfT0ZGX1kgPSA0XHJcbkNBUkRfSU1BR0VfQURWX1ggPSBDQVJEX0lNQUdFX1dcclxuQ0FSRF9JTUFHRV9BRFZfWSA9IENBUkRfSU1BR0VfSFxyXG5DQVJEX1JFTkRFUl9TQ0FMRSA9IDAuMzUgICAgICAgICAgICAgICAgICAjIGNhcmQgaGVpZ2h0IGNvZWZmaWNpZW50IGZyb20gdGhlIHNjcmVlbidzIGhlaWdodFxyXG5DQVJEX0hBTkRfQ1VSVkVfRElTVF9GQUNUT1IgPSAzLjUgICAgICAgICAjIGZhY3RvciB3aXRoIHNjcmVlbiBoZWlnaHQgdG8gZmlndXJlIG91dCBjZW50ZXIgb2YgYXJjLiBiaWdnZXIgbnVtYmVyIGlzIGxlc3MgYXJjXHJcbkNBUkRfSE9MRElOR19ST1RfT1JERVIgPSBNYXRoLlBJIC8gMTIgICAgICMgZGVzaXJlZCByb3RhdGlvbiBvZiB0aGUgY2FyZCB3aGVuIGJlaW5nIGRyYWdnZWQgYXJvdW5kIGZvciBvcmRlcmluZydzIHNha2VcclxuQ0FSRF9IT0xESU5HX1JPVF9QTEFZID0gLTEgKiBNYXRoLlBJIC8gMTIgIyBkZXNpcmVkIHJvdGF0aW9uIG9mIHRoZSBjYXJkIHdoZW4gYmVpbmcgZHJhZ2dlZCBhcm91bmQgd2l0aCBpbnRlbnQgdG8gcGxheVxyXG5DQVJEX1BMQVlfQ0VJTElORyA9IDAuNjUgICAgICAgICAgICAgICAgICAjIGhvdyBtdWNoIG9mIHRoZSB0b3Agb2YgdGhlIHNjcmVlbiByZXByZXNlbnRzIFwiSSB3YW50IHRvIHBsYXkgdGhpc1wiIHZzIFwiSSB3YW50IHRvIHJlb3JkZXJcIlxyXG5cclxuTk9fQ0FSRCA9IC0xXHJcblxyXG4jIHRha2VuIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjExMjEyL2hvdy10by1jYWxjdWxhdGUtYW4tYW5nbGUtZnJvbS10aHJlZS1wb2ludHNcclxuIyB1c2VzIGxhdyBvZiBjb3NpbmVzIHRvIGZpZ3VyZSBvdXQgdGhlIGhhbmQgYXJjIGFuZ2xlXHJcbmZpbmRBbmdsZSA9IChwMCwgcDEsIHAyKSAtPlxyXG4gICAgYSA9IE1hdGgucG93KHAxLnggLSBwMi54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMi55LCAyKVxyXG4gICAgYiA9IE1hdGgucG93KHAxLnggLSBwMC54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMC55LCAyKVxyXG4gICAgYyA9IE1hdGgucG93KHAyLnggLSBwMC54LCAyKSArIE1hdGgucG93KHAyLnkgLSBwMC55LCAyKVxyXG4gICAgcmV0dXJuIE1hdGguYWNvcyggKGErYi1jKSAvIE1hdGguc3FydCg0KmEqYikgKVxyXG5cclxuY2FsY0Rpc3RhbmNlID0gKHAwLCBwMSkgLT5cclxuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHAxLnggLSBwMC54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMC55LCAyKSlcclxuXHJcbmNhbGNEaXN0YW5jZVNxdWFyZWQgPSAoeDAsIHkwLCB4MSwgeTEpIC0+XHJcbiAgcmV0dXJuIE1hdGgucG93KHgxIC0geDAsIDIpICsgTWF0aC5wb3coeTEgLSB5MCwgMilcclxuXHJcbmNsYXNzIEhhbmRcclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxyXG4gICAgQGNhcmRzID0gW11cclxuICAgIEBhbmltcyA9IHt9XHJcbiAgICBAcG9zaXRpb25DYWNoZSA9IHt9XHJcblxyXG4gICAgQGRyYWdJbmRleFN0YXJ0ID0gTk9fQ0FSRFxyXG4gICAgQGRyYWdJbmRleEN1cnJlbnQgPSBOT19DQVJEXHJcbiAgICBAZHJhZ1ggPSAwXHJcbiAgICBAZHJhZ1kgPSAwXHJcblxyXG4gICAgIyByZW5kZXIgLyBhbmltIG1ldHJpY3NcclxuICAgIEBjYXJkU3BlZWQgPVxyXG4gICAgICByOiBNYXRoLlBJICogMlxyXG4gICAgICBzOiAyLjVcclxuICAgICAgdDogMiAqIEBnYW1lLndpZHRoXHJcbiAgICBAcGxheUNlaWxpbmcgPSBDQVJEX1BMQVlfQ0VJTElORyAqIEBnYW1lLmhlaWdodFxyXG4gICAgQGNhcmRIZWlnaHQgPSBNYXRoLmZsb29yKEBnYW1lLmhlaWdodCAqIENBUkRfUkVOREVSX1NDQUxFKVxyXG4gICAgQGNhcmRXaWR0aCAgPSBNYXRoLmZsb29yKEBjYXJkSGVpZ2h0ICogQ0FSRF9JTUFHRV9XIC8gQ0FSRF9JTUFHRV9IKVxyXG4gICAgQGNhcmRIYWxmSGVpZ2h0ID0gQGNhcmRIZWlnaHQgPj4gMVxyXG4gICAgQGNhcmRIYWxmV2lkdGggID0gQGNhcmRXaWR0aCA+PiAxXHJcbiAgICBhcmNNYXJnaW4gPSBAY2FyZFdpZHRoIC8gMlxyXG4gICAgYXJjVmVydGljYWxCaWFzID0gQGNhcmRIZWlnaHQgLyA1MFxyXG4gICAgYm90dG9tTGVmdCAgPSB7IHg6IGFyY01hcmdpbiwgICAgICAgICAgICAgICAgeTogYXJjVmVydGljYWxCaWFzICsgQGdhbWUuaGVpZ2h0IH1cclxuICAgIGJvdHRvbVJpZ2h0ID0geyB4OiBAZ2FtZS53aWR0aCAtIGFyY01hcmdpbiwgeTogYXJjVmVydGljYWxCaWFzICsgQGdhbWUuaGVpZ2h0IH1cclxuICAgIEBoYW5kQ2VudGVyID0geyB4OiBAZ2FtZS53aWR0aCAvIDIsICAgICAgICAgeTogYXJjVmVydGljYWxCaWFzICsgQGdhbWUuaGVpZ2h0ICsgKENBUkRfSEFORF9DVVJWRV9ESVNUX0ZBQ1RPUiAqIEBnYW1lLmhlaWdodCkgfVxyXG4gICAgQGhhbmRBbmdsZSA9IGZpbmRBbmdsZShib3R0b21MZWZ0LCBAaGFuZENlbnRlciwgYm90dG9tUmlnaHQpXHJcbiAgICBAaGFuZERpc3RhbmNlID0gY2FsY0Rpc3RhbmNlKGJvdHRvbUxlZnQsIEBoYW5kQ2VudGVyKVxyXG4gICAgQGhhbmRBbmdsZUFkdmFuY2VNYXggPSBAaGFuZEFuZ2xlIC8gNyAjIG5ldmVyIHNwYWNlIHRoZSBjYXJkcyBtb3JlIHRoYW4gd2hhdCB0aGV5J2QgbG9vayBsaWtlIHdpdGggdGhpcyBoYW5kc2l6ZVxyXG4gICAgQGdhbWUubG9nIFwiSGFuZCBkaXN0YW5jZSAje0BoYW5kRGlzdGFuY2V9LCBhbmdsZSAje0BoYW5kQW5nbGV9IChzY3JlZW4gaGVpZ2h0ICN7QGdhbWUuaGVpZ2h0fSlcIlxyXG5cclxuICBzZXQ6IChjYXJkcykgLT5cclxuICAgIEBjYXJkcyA9IGNhcmRzLnNsaWNlKDApXHJcbiAgICBAc3luY0FuaW1zKClcclxuICAgIEB3YXJwKClcclxuXHJcbiAgc3luY0FuaW1zOiAtPlxyXG4gICAgc2VlbiA9IHt9XHJcbiAgICBmb3IgY2FyZCBpbiBAY2FyZHNcclxuICAgICAgc2VlbltjYXJkXSsrXHJcbiAgICAgIGlmIG5vdCBAYW5pbXNbY2FyZF1cclxuICAgICAgICBAYW5pbXNbY2FyZF0gPSBuZXcgQW5pbWF0aW9uIHtcclxuICAgICAgICAgIHNwZWVkOiBAY2FyZFNwZWVkXHJcbiAgICAgICAgICB4OiAwXHJcbiAgICAgICAgICB5OiAwXHJcbiAgICAgICAgICByOiAwXHJcbiAgICAgICAgfVxyXG4gICAgdG9SZW1vdmUgPSBbXVxyXG4gICAgZm9yIGNhcmQsYW5pbSBvZiBAYW5pbXNcclxuICAgICAgaWYgbm90IHNlZW4uaGFzT3duUHJvcGVydHkoY2FyZClcclxuICAgICAgICB0b1JlbW92ZS5wdXNoIGNhcmRcclxuICAgIGZvciBjYXJkIGluIHRvUmVtb3ZlXHJcbiAgICAgICMgQGdhbWUubG9nIFwicmVtb3ZpbmcgYW5pbSBmb3IgI3tjYXJkfVwiXHJcbiAgICAgIGRlbGV0ZSBAYW5pbXNbY2FyZF1cclxuXHJcbiAgICBAdXBkYXRlUG9zaXRpb25zKClcclxuXHJcbiAgY2FsY0RyYXduSGFuZDogLT5cclxuICAgIGRyYXduSGFuZCA9IFtdXHJcbiAgICBmb3IgY2FyZCxpIGluIEBjYXJkc1xyXG4gICAgICBpZiBpICE9IEBkcmFnSW5kZXhTdGFydFxyXG4gICAgICAgIGRyYXduSGFuZC5wdXNoIGNhcmRcclxuXHJcbiAgICBpZiBAZHJhZ0luZGV4Q3VycmVudCAhPSBOT19DQVJEXHJcbiAgICAgIGRyYXduSGFuZC5zcGxpY2UgQGRyYWdJbmRleEN1cnJlbnQsIDAsIEBjYXJkc1tAZHJhZ0luZGV4U3RhcnRdXHJcbiAgICByZXR1cm4gZHJhd25IYW5kXHJcblxyXG4gIHdhbnRzVG9QbGF5RHJhZ2dlZENhcmQ6IC0+XHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQGRyYWdJbmRleFN0YXJ0ID09IE5PX0NBUkRcclxuICAgIHJldHVybiBAZHJhZ1kgPCBAcGxheUNlaWxpbmdcclxuXHJcbiAgdXBkYXRlUG9zaXRpb25zOiAtPlxyXG4gICAgZHJhd25IYW5kID0gQGNhbGNEcmF3bkhhbmQoKVxyXG4gICAgd2FudHNUb1BsYXkgPSBAd2FudHNUb1BsYXlEcmFnZ2VkQ2FyZCgpXHJcbiAgICBkZXNpcmVkUm90YXRpb24gPSBDQVJEX0hPTERJTkdfUk9UX09SREVSXHJcbiAgICBwb3NpdGlvbkNvdW50ID0gZHJhd25IYW5kLmxlbmd0aFxyXG4gICAgaWYgd2FudHNUb1BsYXlcclxuICAgICAgZGVzaXJlZFJvdGF0aW9uID0gQ0FSRF9IT0xESU5HX1JPVF9QTEFZXHJcbiAgICAgIHBvc2l0aW9uQ291bnQtLVxyXG4gICAgcG9zaXRpb25zID0gQGNhbGNQb3NpdGlvbnMocG9zaXRpb25Db3VudClcclxuICAgIGRyYXdJbmRleCA9IDBcclxuICAgIGZvciBjYXJkLGkgaW4gZHJhd25IYW5kXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbY2FyZF1cclxuICAgICAgaWYgaSA9PSBAZHJhZ0luZGV4Q3VycmVudFxyXG4gICAgICAgIGFuaW0ucmVxLnggPSBAZHJhZ1hcclxuICAgICAgICBhbmltLnJlcS55ID0gQGRyYWdZXHJcbiAgICAgICAgYW5pbS5yZXEuciA9IGRlc2lyZWRSb3RhdGlvblxyXG4gICAgICAgIGlmIG5vdCB3YW50c1RvUGxheVxyXG4gICAgICAgICAgZHJhd0luZGV4KytcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHBvcyA9IHBvc2l0aW9uc1tkcmF3SW5kZXhdXHJcbiAgICAgICAgYW5pbS5yZXEueCA9IHBvcy54XHJcbiAgICAgICAgYW5pbS5yZXEueSA9IHBvcy55XHJcbiAgICAgICAgYW5pbS5yZXEuciA9IHBvcy5yXHJcbiAgICAgICAgZHJhd0luZGV4KytcclxuXHJcbiAgIyBpbW1lZGlhdGVseSB3YXJwIGFsbCBjYXJkcyB0byB3aGVyZSB0aGV5IHNob3VsZCBiZVxyXG4gIHdhcnA6IC0+XHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBhbmltLndhcnAoKVxyXG5cclxuICAjIHJlb3JkZXIgdGhlIGhhbmQgYmFzZWQgb24gdGhlIGRyYWcgbG9jYXRpb24gb2YgdGhlIGhlbGQgY2FyZFxyXG4gIHJlb3JkZXI6IC0+XHJcbiAgICByZXR1cm4gaWYgQGRyYWdJbmRleFN0YXJ0ID09IE5PX0NBUkRcclxuICAgIHJldHVybiBpZiBAY2FyZHMubGVuZ3RoIDwgMiAjIG5vdGhpbmcgdG8gcmVvcmRlclxyXG4gICAgcG9zaXRpb25zID0gQGNhbGNQb3NpdGlvbnMoQGNhcmRzLmxlbmd0aClcclxuICAgIGNsb3Nlc3RJbmRleCA9IDBcclxuICAgIGNsb3Nlc3REaXN0ID0gQGdhbWUud2lkdGggKiBAZ2FtZS5oZWlnaHQgIyBzb21ldGhpbmcgaW1wb3NzaWJseSBsYXJnZVxyXG4gICAgZm9yIHBvcywgaW5kZXggaW4gcG9zaXRpb25zXHJcbiAgICAgIGRpc3QgPSBjYWxjRGlzdGFuY2VTcXVhcmVkKHBvcy54LCBwb3MueSwgQGRyYWdYLCBAZHJhZ1kpXHJcbiAgICAgIGlmIGNsb3Nlc3REaXN0ID4gZGlzdFxyXG4gICAgICAgIGNsb3Nlc3REaXN0ID0gZGlzdFxyXG4gICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XHJcbiAgICBAZHJhZ0luZGV4Q3VycmVudCA9IGNsb3Nlc3RJbmRleFxyXG5cclxuICBkb3duOiAoQGRyYWdYLCBAZHJhZ1ksIGluZGV4KSAtPlxyXG4gICAgQHVwKEBkcmFnWCwgQGRyYWdZKSAjIGVuc3VyZSB3ZSBsZXQgZ28gb2YgdGhlIHByZXZpb3VzIGNhcmQgaW4gY2FzZSB0aGUgZXZlbnRzIGFyZSBkdW1iXHJcbiAgICBAZ2FtZS5sb2cgXCJwaWNraW5nIHVwIGNhcmQgaW5kZXggI3tpbmRleH1cIlxyXG4gICAgQGRyYWdJbmRleFN0YXJ0ID0gaW5kZXhcclxuICAgIEBkcmFnSW5kZXhDdXJyZW50ID0gaW5kZXhcclxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxyXG5cclxuICBtb3ZlOiAoQGRyYWdYLCBAZHJhZ1kpIC0+XHJcbiAgICByZXR1cm4gaWYgQGRyYWdJbmRleFN0YXJ0ID09IE5PX0NBUkRcclxuICAgICNAZ2FtZS5sb2cgXCJkcmFnZ2luZyBhcm91bmQgY2FyZCBpbmRleCAje0BkcmFnSW5kZXhDdXJyZW50fVwiXHJcbiAgICBAcmVvcmRlcigpXHJcbiAgICBAdXBkYXRlUG9zaXRpb25zKClcclxuXHJcbiAgdXA6IChAZHJhZ1gsIEBkcmFnWSkgLT5cclxuICAgIHJldHVybiBpZiBAZHJhZ0luZGV4U3RhcnQgPT0gTk9fQ0FSRFxyXG4gICAgQHJlb3JkZXIoKVxyXG4gICAgaWYgQHdhbnRzVG9QbGF5RHJhZ2dlZENhcmQoKVxyXG4gICAgICBAZ2FtZS5sb2cgXCJ0cnlpbmcgdG8gcGxheSBhICN7QGNhcmRzW0BkcmFnSW5kZXhTdGFydF19IGZyb20gaW5kZXggI3tAZHJhZ0luZGV4U3RhcnR9XCJcclxuICAgICAgY2FyZEluZGV4ID0gQGRyYWdJbmRleFN0YXJ0XHJcbiAgICAgIGNhcmQgPSBAY2FyZHNbY2FyZEluZGV4XVxyXG4gICAgICBhbmltID0gQGFuaW1zW2NhcmRdXHJcbiAgICAgIEBkcmFnSW5kZXhTdGFydCA9IE5PX0NBUkRcclxuICAgICAgQGRyYWdJbmRleEN1cnJlbnQgPSBOT19DQVJEXHJcbiAgICAgIEBnYW1lLnBsYXkgY2FyZCwgYW5pbS5jdXIueCwgYW5pbS5jdXIueSwgYW5pbS5jdXIuciwgY2FyZEluZGV4XHJcbiAgICBlbHNlXHJcbiAgICAgIEBnYW1lLmxvZyBcInRyeWluZyB0byByZW9yZGVyICN7QGNhcmRzW0BkcmFnSW5kZXhTdGFydF19IGludG8gaW5kZXggI3tAZHJhZ0luZGV4Q3VycmVudH1cIlxyXG4gICAgICBAY2FyZHMgPSBAY2FsY0RyYXduSGFuZCgpICMgaXMgdGhpcyByaWdodD9cclxuXHJcbiAgICBAZHJhZ0luZGV4U3RhcnQgPSBOT19DQVJEXHJcbiAgICBAZHJhZ0luZGV4Q3VycmVudCA9IE5PX0NBUkRcclxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxyXG5cclxuICB1cGRhdGU6IChkdCkgLT5cclxuICAgIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgZm9yIGNhcmQsYW5pbSBvZiBAYW5pbXNcclxuICAgICAgaWYgYW5pbS51cGRhdGUoZHQpXHJcbiAgICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG4gIHJlbmRlcjogLT5cclxuICAgIHJldHVybiBpZiBAY2FyZHMubGVuZ3RoID09IDBcclxuICAgIGRyYXduSGFuZCA9IEBjYWxjRHJhd25IYW5kKClcclxuICAgIGZvciB2LCBpbmRleCBpbiBkcmF3bkhhbmRcclxuICAgICAgY29udGludWUgaWYgdiA9PSBOT19DQVJEXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbdl1cclxuICAgICAgZG8gKGFuaW0sIGluZGV4KSA9PlxyXG4gICAgICAgIEByZW5kZXJDYXJkIHYsIGFuaW0uY3VyLngsIGFuaW0uY3VyLnksIGFuaW0uY3VyLnIsIDEsIChjbGlja1gsIGNsaWNrWSkgPT5cclxuICAgICAgICAgIEBkb3duKGNsaWNrWCwgY2xpY2tZLCBpbmRleClcclxuXHJcbiAgcmVuZGVyQ2FyZDogKHYsIHgsIHksIHJvdCwgc2NhbGUsIGNiKSAtPlxyXG4gICAgcm90ID0gMCBpZiBub3Qgcm90XHJcbiAgICByYW5rID0gTWF0aC5mbG9vcih2ICUgMTMpXHJcbiAgICBzdWl0ID0gTWF0aC5mbG9vcih2IC8gMTMpXHJcblxyXG4gICAgQGdhbWUuZHJhd0ltYWdlIFwiY2FyZHNcIixcclxuICAgIENBUkRfSU1BR0VfT0ZGX1ggKyAoQ0FSRF9JTUFHRV9BRFZfWCAqIHJhbmspLCBDQVJEX0lNQUdFX09GRl9ZICsgKENBUkRfSU1BR0VfQURWX1kgKiBzdWl0KSwgQ0FSRF9JTUFHRV9XLCBDQVJEX0lNQUdFX0gsXHJcbiAgICB4LCB5LCBAY2FyZFdpZHRoICogc2NhbGUsIEBjYXJkSGVpZ2h0ICogc2NhbGUsXHJcbiAgICByb3QsIDAuNSwgMC41LCAxLDEsMSwxLCBjYlxyXG5cclxuICBjYWxjUG9zaXRpb25zOiAoaGFuZFNpemUpIC0+XHJcbiAgICBpZiBAcG9zaXRpb25DYWNoZS5oYXNPd25Qcm9wZXJ0eShoYW5kU2l6ZSlcclxuICAgICAgcmV0dXJuIEBwb3NpdGlvbkNhY2hlW2hhbmRTaXplXVxyXG4gICAgcmV0dXJuIFtdIGlmIGhhbmRTaXplID09IDBcclxuXHJcbiAgICBhZHZhbmNlID0gQGhhbmRBbmdsZSAvIGhhbmRTaXplXHJcbiAgICBpZiBhZHZhbmNlID4gQGhhbmRBbmdsZUFkdmFuY2VNYXhcclxuICAgICAgYWR2YW5jZSA9IEBoYW5kQW5nbGVBZHZhbmNlTWF4XHJcbiAgICBhbmdsZVNwcmVhZCA9IGFkdmFuY2UgKiBoYW5kU2l6ZSAgICAgICAgICAgICAgICAjIGhvdyBtdWNoIG9mIHRoZSBhbmdsZSB3ZSBwbGFuIG9uIHVzaW5nXHJcbiAgICBhbmdsZUxlZnRvdmVyID0gQGhhbmRBbmdsZSAtIGFuZ2xlU3ByZWFkICAgICAgICAjIGFtb3VudCBvZiBhbmdsZSB3ZSdyZSBub3QgdXNpbmcsIGFuZCBuZWVkIHRvIHBhZCBzaWRlcyB3aXRoIGV2ZW5seVxyXG4gICAgY3VycmVudEFuZ2xlID0gLTEgKiAoQGhhbmRBbmdsZSAvIDIpICAgICAgICAgICAgIyBtb3ZlIHRvIHRoZSBsZWZ0IHNpZGUgb2Ygb3VyIGFuZ2xlXHJcbiAgICBjdXJyZW50QW5nbGUgKz0gYW5nbGVMZWZ0b3ZlciAvIDIgICAgICAgICAgICAgICAjIC4uLiBhbmQgYWR2YW5jZSBwYXN0IGhhbGYgb2YgdGhlIHBhZGRpbmdcclxuICAgIGN1cnJlbnRBbmdsZSArPSBhZHZhbmNlIC8gMiAgICAgICAgICAgICAgICAgICAgICMgLi4uIGFuZCBjZW50ZXIgdGhlIGNhcmRzIGluIHRoZSBhbmdsZVxyXG5cclxuICAgIHBvc2l0aW9ucyA9IFtdXHJcbiAgICBmb3IgaSBpbiBbMC4uLmhhbmRTaXplXVxyXG4gICAgICB4ID0gQGhhbmRDZW50ZXIueCAtIE1hdGguY29zKChNYXRoLlBJIC8gMikgKyBjdXJyZW50QW5nbGUpICogQGhhbmREaXN0YW5jZVxyXG4gICAgICB5ID0gQGhhbmRDZW50ZXIueSAtIE1hdGguc2luKChNYXRoLlBJIC8gMikgKyBjdXJyZW50QW5nbGUpICogQGhhbmREaXN0YW5jZVxyXG4gICAgICBjdXJyZW50QW5nbGUgKz0gYWR2YW5jZVxyXG4gICAgICBwb3NpdGlvbnMucHVzaCB7XHJcbiAgICAgICAgeDogeFxyXG4gICAgICAgIHk6IHlcclxuICAgICAgICByOiBjdXJyZW50QW5nbGUgLSBhZHZhbmNlXHJcbiAgICAgIH1cclxuXHJcbiAgICBAcG9zaXRpb25DYWNoZVtoYW5kU2l6ZV0gPSBwb3NpdGlvbnNcclxuICAgIHJldHVybiBwb3NpdGlvbnNcclxuXHJcbiAgcmVuZGVySGFuZDogLT5cclxuICAgIHJldHVybiBpZiBAaGFuZC5sZW5ndGggPT0gMFxyXG4gICAgZm9yIHYsaW5kZXggaW4gQGhhbmRcclxuICAgICAgZG8gKGluZGV4KSA9PlxyXG4gICAgICAgIEByZW5kZXJDYXJkIHYsIHgsIHksIGN1cnJlbnRBbmdsZSwgMSwgKGNsaWNrWCwgY2xpY2tZKSA9PlxyXG4gICAgICAgICAgQGRvd24oY2xpY2tYLCBjbGlja1ksIGluZGV4KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYW5kXHJcbiIsIkJ1dHRvbiA9IHJlcXVpcmUgJy4vQnV0dG9uJ1xyXG5cclxuY2xhc3MgTWVudVxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEB0aXRsZSwgQGJhY2tncm91bmQsIEBjb2xvciwgQGFjdGlvbnMpIC0+XHJcbiAgICBAYnV0dG9ucyA9IFtdXHJcbiAgICBAYnV0dG9uTmFtZXMgPSBbXCJidXR0b24wXCIsIFwiYnV0dG9uMVwiXVxyXG5cclxuICAgIGJ1dHRvblNpemUgPSBAZ2FtZS5oZWlnaHQgLyAxNVxyXG4gICAgQGJ1dHRvblN0YXJ0WSA9IEBnYW1lLmhlaWdodCAvIDVcclxuXHJcbiAgICBzbGljZSA9IChAZ2FtZS5oZWlnaHQgLSBAYnV0dG9uU3RhcnRZKSAvIChAYWN0aW9ucy5sZW5ndGggKyAxKVxyXG4gICAgY3VyclkgPSBAYnV0dG9uU3RhcnRZICsgc2xpY2VcclxuICAgIGZvciBhY3Rpb24gaW4gQGFjdGlvbnNcclxuICAgICAgYnV0dG9uID0gbmV3IEJ1dHRvbihAZ2FtZSwgQGJ1dHRvbk5hbWVzLCBAZ2FtZS5mb250LCBidXR0b25TaXplLCBAZ2FtZS5jZW50ZXIueCwgY3VyclksIGFjdGlvbilcclxuICAgICAgQGJ1dHRvbnMucHVzaCBidXR0b25cclxuICAgICAgY3VyclkgKz0gc2xpY2VcclxuXHJcbiAgdXBkYXRlOiAoZHQpIC0+XHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuICAgIGZvciBidXR0b24gaW4gQGJ1dHRvbnNcclxuICAgICAgaWYgYnV0dG9uLnVwZGF0ZShkdClcclxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgcmV0dXJuIHVwZGF0ZWRcclxuXHJcbiAgcmVuZGVyOiAtPlxyXG4gICAgQGdhbWUuc3ByaXRlUmVuZGVyZXIucmVuZGVyIEBiYWNrZ3JvdW5kLCAwLCAwLCBAZ2FtZS53aWR0aCwgQGdhbWUuaGVpZ2h0LCAwLCAwLCAwLCBAY29sb3JcclxuICAgIEBnYW1lLmZvbnRSZW5kZXJlci5yZW5kZXIgQGdhbWUuZm9udCwgQGdhbWUuaGVpZ2h0IC8gMjUsIFwiQnVpbGQ6ICN7QGdhbWUudmVyc2lvbn1cIiwgMCwgQGdhbWUuaGVpZ2h0LCAwLCAxLCBAZ2FtZS5jb2xvcnMubGlnaHRncmF5XHJcbiAgICB0aXRsZUhlaWdodCA9IEBnYW1lLmhlaWdodCAvIDhcclxuICAgIHRpdGxlT2Zmc2V0ID0gQGJ1dHRvblN0YXJ0WSA+PiAxXHJcbiAgICBAZ2FtZS5mb250UmVuZGVyZXIucmVuZGVyIEBnYW1lLmZvbnQsIHRpdGxlSGVpZ2h0LCBAdGl0bGUsIEBnYW1lLmNlbnRlci54LCB0aXRsZU9mZnNldCwgMC41LCAwLjUsIEBnYW1lLmNvbG9ycy53aGl0ZVxyXG4gICAgZm9yIGJ1dHRvbiBpbiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ucmVuZGVyKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVxyXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcclxuXHJcblNFVFRMRV9NUyA9IDEwMDBcclxuXHJcbmNsYXNzIFBpbGVcclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAaGFuZCkgLT5cclxuICAgIEBwaWxlID0gW11cclxuICAgIEBwaWxlV2hvID0gW11cclxuICAgIEB0cmljayA9IFtdXHJcbiAgICBAdHJpY2tXaG8gPSBbXVxyXG4gICAgQGFuaW1zID0ge31cclxuICAgIEBwaWxlSUQgPSAtMVxyXG4gICAgQHRyaWNrVGFrZXIgPSBcIlwiXHJcbiAgICBAc2V0dGxlVGltZXIgPSAwXHJcbiAgICBAdHJpY2tDb2xvciA9IHsgcjogMSwgZzogMSwgYjogMCwgYTogMX1cclxuICAgIEBwbGF5ZXJDb3VudCA9IDJcclxuICAgIEBzY2FsZSA9IDAuNlxyXG5cclxuICAgIGNlbnRlclggPSBAZ2FtZS5jZW50ZXIueFxyXG4gICAgY2VudGVyWSA9IEBnYW1lLmNlbnRlci55XHJcbiAgICBvZmZzZXRYID0gQGhhbmQuY2FyZFdpZHRoICogQHNjYWxlXHJcbiAgICBvZmZzZXRZID0gQGhhbmQuY2FyZEhhbGZIZWlnaHQgKiBAc2NhbGVcclxuICAgIEBwaWxlTG9jYXRpb25zID1cclxuICAgICAgMjogW1xyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGJvdHRvbVxyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogY2VudGVyWSAtIG9mZnNldFkgfSAjIHRvcFxyXG4gICAgICBdXHJcbiAgICAgIDM6IFtcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IGNlbnRlclkgKyBvZmZzZXRZIH0gIyBib3R0b21cclxuICAgICAgICB7IHg6IGNlbnRlclggLSBvZmZzZXRYLCB5OiBjZW50ZXJZIH0gIyBsZWZ0XHJcbiAgICAgICAgeyB4OiBjZW50ZXJYICsgb2Zmc2V0WCwgeTogY2VudGVyWSB9ICMgcmlnaHRcclxuICAgICAgXVxyXG4gICAgICA0OiBbXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgYm90dG9tXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYIC0gb2Zmc2V0WCwgeTogY2VudGVyWSB9ICMgbGVmdFxyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogY2VudGVyWSAtIG9mZnNldFkgfSAjIHRvcFxyXG4gICAgICAgIHsgeDogY2VudGVyWCArIG9mZnNldFgsIHk6IGNlbnRlclkgfSAjIHJpZ2h0XHJcbiAgICAgIF1cclxuICAgIEB0aHJvd0xvY2F0aW9ucyA9XHJcbiAgICAgIDI6IFtcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IEBnYW1lLmhlaWdodCB9ICMgYm90dG9tXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiAwIH0gIyB0b3BcclxuICAgICAgXVxyXG4gICAgICAzOiBbXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBAZ2FtZS5oZWlnaHQgfSAjIGJvdHRvbVxyXG4gICAgICAgIHsgeDogMCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGxlZnRcclxuICAgICAgICB7IHg6IEBnYW1lLndpZHRoLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgcmlnaHRcclxuICAgICAgXVxyXG4gICAgICA0OiBbXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBAZ2FtZS5oZWlnaHQgfSAjIGJvdHRvbVxyXG4gICAgICAgIHsgeDogMCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGxlZnRcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IDAgfSAjIHRvcFxyXG4gICAgICAgIHsgeDogQGdhbWUud2lkdGgsIHk6IGNlbnRlclkgKyBvZmZzZXRZIH0gIyByaWdodFxyXG4gICAgICBdXHJcblxyXG4gIHNldDogKHBpbGVJRCwgcGlsZSwgcGlsZVdobywgdHJpY2ssIHRyaWNrV2hvLCB0cmlja1Rha2VyLCBAcGxheWVyQ291bnQsIGZpcnN0VGhyb3cpIC0+XHJcbiAgICBpZiAoQHBpbGVJRCAhPSBwaWxlSUQpIGFuZCAodHJpY2subGVuZ3RoID4gMClcclxuICAgICAgQHBpbGUgPSB0cmljay5zbGljZSgwKSAjIHRoZSBwaWxlIGhhcyBiZWNvbWUgdGhlIHRyaWNrLCBzdGFzaCBpdCBvZmYgb25lIGxhc3QgdGltZVxyXG4gICAgICBAcGlsZVdobyA9IHRyaWNrV2hvLnNsaWNlKDApXHJcbiAgICAgIEBwaWxlSUQgPSBwaWxlSURcclxuICAgICAgQHNldHRsZVRpbWVyID0gU0VUVExFX01TXHJcblxyXG4gICAgIyBkb24ndCBzdG9tcCB0aGUgcGlsZSB3ZSdyZSBkcmF3aW5nIHVudGlsIGl0IGlzIGRvbmUgc2V0dGxpbmcgYW5kIGNhbiBmbHkgb2ZmIHRoZSBzY3JlZW5cclxuICAgIGlmIEBzZXR0bGVUaW1lciA9PSAwXHJcbiAgICAgIEBwaWxlID0gcGlsZS5zbGljZSgwKVxyXG4gICAgICBAcGlsZVdobyA9IHBpbGVXaG8uc2xpY2UoMClcclxuICAgICAgQHRyaWNrID0gdHJpY2suc2xpY2UoMClcclxuICAgICAgQHRyaWNrV2hvID0gdHJpY2tXaG8uc2xpY2UoMClcclxuICAgICAgQHRyaWNrVGFrZXIgPSB0cmlja1Rha2VyXHJcblxyXG4gICAgQHN5bmNBbmltcygpXHJcblxyXG4gIGhpbnQ6ICh2LCB4LCB5LCByKSAtPlxyXG4gICAgQGFuaW1zW3ZdID0gbmV3IEFuaW1hdGlvbiB7XHJcbiAgICAgIHNwZWVkOiBAaGFuZC5jYXJkU3BlZWRcclxuICAgICAgeDogeFxyXG4gICAgICB5OiB5XHJcbiAgICAgIHI6IHJcclxuICAgICAgczogMVxyXG4gICAgfVxyXG5cclxuICBzeW5jQW5pbXM6IC0+XHJcbiAgICBzZWVuID0ge31cclxuICAgIGxvY2F0aW9ucyA9IEB0aHJvd0xvY2F0aW9uc1tAcGxheWVyQ291bnRdXHJcbiAgICBmb3IgY2FyZCwgaW5kZXggaW4gQHBpbGVcclxuICAgICAgc2VlbltjYXJkXSsrXHJcbiAgICAgIGlmIG5vdCBAYW5pbXNbY2FyZF1cclxuICAgICAgICB3aG8gPSBAcGlsZVdob1tpbmRleF1cclxuICAgICAgICBsb2NhdGlvbiA9IGxvY2F0aW9uc1t3aG9dXHJcbiAgICAgICAgQGFuaW1zW2NhcmRdID0gbmV3IEFuaW1hdGlvbiB7XHJcbiAgICAgICAgICBzcGVlZDogQGhhbmQuY2FyZFNwZWVkXHJcbiAgICAgICAgICB4OiBsb2NhdGlvbi54XHJcbiAgICAgICAgICB5OiBsb2NhdGlvbi55XHJcbiAgICAgICAgICByOiAtMSAqIE1hdGguUEkgLyA0XHJcbiAgICAgICAgICBzOiBAc2NhbGVcclxuICAgICAgICB9XHJcbiAgICBmb3IgY2FyZCBpbiBAdHJpY2tcclxuICAgICAgc2VlbltjYXJkXSsrXHJcbiAgICAgIGlmIG5vdCBAYW5pbXNbY2FyZF1cclxuICAgICAgICBAYW5pbXNbY2FyZF0gPSBuZXcgQW5pbWF0aW9uIHtcclxuICAgICAgICAgIHNwZWVkOiBAaGFuZC5jYXJkU3BlZWRcclxuICAgICAgICAgIHg6IC0xICogQGhhbmQuY2FyZEhhbGZXaWR0aFxyXG4gICAgICAgICAgeTogLTEgKiBAaGFuZC5jYXJkSGFsZldpZHRoXHJcbiAgICAgICAgICByOiAtMSAqIE1hdGguUEkgLyAyXHJcbiAgICAgICAgICBzOiAxXHJcbiAgICAgICAgfVxyXG4gICAgdG9SZW1vdmUgPSBbXVxyXG4gICAgZm9yIGNhcmQsYW5pbSBvZiBAYW5pbXNcclxuICAgICAgaWYgbm90IHNlZW4uaGFzT3duUHJvcGVydHkoY2FyZClcclxuICAgICAgICB0b1JlbW92ZS5wdXNoIGNhcmRcclxuICAgIGZvciBjYXJkIGluIHRvUmVtb3ZlXHJcbiAgICAgICMgQGdhbWUubG9nIFwicmVtb3ZpbmcgYW5pbSBmb3IgI3tjYXJkfVwiXHJcbiAgICAgIGRlbGV0ZSBAYW5pbXNbY2FyZF1cclxuXHJcbiAgICBAdXBkYXRlUG9zaXRpb25zKClcclxuXHJcbiAgdXBkYXRlUG9zaXRpb25zOiAtPlxyXG4gICAgbG9jYXRpb25zID0gQHBpbGVMb2NhdGlvbnNbQHBsYXllckNvdW50XVxyXG4gICAgZm9yIHYsIGluZGV4IGluIEBwaWxlXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbdl1cclxuICAgICAgbG9jID0gQHBpbGVXaG9baW5kZXhdXHJcbiAgICAgIGFuaW0ucmVxLnggPSBsb2NhdGlvbnNbbG9jXS54XHJcbiAgICAgIGFuaW0ucmVxLnkgPSBsb2NhdGlvbnNbbG9jXS55XHJcbiAgICAgIGFuaW0ucmVxLnIgPSAwXHJcbiAgICAgIGFuaW0ucmVxLnMgPSBAc2NhbGVcclxuXHJcbiAgICBmb3IgXywgaW5kZXggaW4gQHRyaWNrXHJcbiAgICAgIGkgPSBAdHJpY2subGVuZ3RoIC0gaW5kZXggLSAxXHJcbiAgICAgIHYgPSBAdHJpY2tbaV1cclxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxyXG4gICAgICBhbmltLnJlcS54ID0gKEBnYW1lLndpZHRoICsgQGhhbmQuY2FyZEhhbGZXaWR0aCkgLSAoKGluZGV4KzEpICogKEBoYW5kLmNhcmRXaWR0aCAvIDUpKVxyXG4gICAgICBhbmltLnJlcS55ID0gKEBnYW1lLnBhdXNlQnV0dG9uU2l6ZSAqIDEuNSkgKyBAaGFuZC5jYXJkSGFsZkhlaWdodFxyXG4gICAgICBhbmltLnJlcS5yID0gMFxyXG4gICAgICBhbmltLnJlcS5zID0gMVxyXG5cclxuICByZWFkeUZvck5leHRUcmljazogLT5cclxuICAgIHJldHVybiAoQHNldHRsZVRpbWVyID09IDApXHJcblxyXG4gIHVwZGF0ZTogKGR0KSAtPlxyXG4gICAgdXBkYXRlZCA9IGZhbHNlXHJcblxyXG4gICAgaWYgQHNldHRsZVRpbWVyID4gMFxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgICBAc2V0dGxlVGltZXIgLT0gZHRcclxuICAgICAgaWYgQHNldHRsZVRpbWVyIDwgMFxyXG4gICAgICAgIEBzZXR0bGVUaW1lciA9IDBcclxuXHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBpZiBhbmltLnVwZGF0ZShkdClcclxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG5cclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG4gICMgdXNlZCBieSB0aGUgZ2FtZSBvdmVyIHNjcmVlbi4gSXQgcmV0dXJucyB0cnVlIHdoZW4gbmVpdGhlciB0aGUgcGlsZSBub3IgdGhlIGxhc3QgdHJpY2sgYXJlIG1vdmluZ1xyXG4gIHJlc3Rpbmc6IC0+XHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBpZiBhbmltLmFuaW1hdGluZygpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpZiBAc2V0dGxlVGltZXIgPiAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcmVuZGVyOiAtPlxyXG4gICAgZm9yIHYsIGluZGV4IGluIEBwaWxlXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbdl1cclxuICAgICAgQGhhbmQucmVuZGVyQ2FyZCB2LCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCBhbmltLmN1ci5zXHJcblxyXG4gICAgZm9yIHYgaW4gQHRyaWNrXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbdl1cclxuICAgICAgQGhhbmQucmVuZGVyQ2FyZCB2LCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCBhbmltLmN1ci5zXHJcblxyXG4gICAgaWYgKEB0cmljay5sZW5ndGggPiAwKSBhbmQgKEB0cmlja1Rha2VyLmxlbmd0aCA+IDApXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbQHRyaWNrWzBdXVxyXG4gICAgICBpZiBhbmltP1xyXG4gICAgICAgIEBnYW1lLmZvbnRSZW5kZXJlci5yZW5kZXIgQGdhbWUuZm9udCwgQGdhbWUuYWFIZWlnaHQgLyAzMCwgQHRyaWNrVGFrZXIsIEBnYW1lLndpZHRoLCBhbmltLmN1ci55ICsgQGhhbmQuY2FyZEhhbGZIZWlnaHQsIDEsIDAsIEB0cmlja0NvbG9yXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpbGVcclxuIiwiY2xhc3MgU3ByaXRlUmVuZGVyZXJcclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxyXG4gICAgQHNwcml0ZXMgPVxyXG4gICAgICAjIGdlbmVyaWMgc3ByaXRlc1xyXG4gICAgICBzb2xpZDogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAgNTUsIHk6IDcyMywgdzogIDEwLCBoOiAgMTAgfVxyXG4gICAgICBwYXVzZTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA2MDIsIHk6IDcwNywgdzogMTIyLCBoOiAxMjUgfVxyXG4gICAgICBidXR0b24wOiAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAxNDAsIHk6IDc3NywgdzogNDIyLCBoOiAgNjUgfVxyXG4gICAgICBidXR0b24xOiAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAxNDAsIHk6IDY5OCwgdzogNDIyLCBoOiAgNjUgfVxyXG4gICAgICBwbHVzMDogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA3NDUsIHk6IDY2NCwgdzogMTE2LCBoOiAxMTggfVxyXG4gICAgICBwbHVzMTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA3NDUsIHk6IDgyMCwgdzogMTE2LCBoOiAxMTggfVxyXG4gICAgICBtaW51czA6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4OTUsIHk6IDY2NCwgdzogMTE2LCBoOiAxMTggfVxyXG4gICAgICBtaW51czE6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4OTUsIHk6IDgyMCwgdzogMTE2LCBoOiAxMTggfVxyXG4gICAgICBhcnJvd0w6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAgMzMsIHk6IDg1OCwgdzogMjA0LCBoOiAxNTYgfVxyXG4gICAgICBhcnJvd1I6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAyMzksIHk6IDg1MiwgdzogMjA4LCBoOiAxNTUgfVxyXG5cclxuICAgICAgIyBtZW51IGJhY2tncm91bmRzXHJcbiAgICAgIG1haW5tZW51OiAgeyB0ZXh0dXJlOiBcIm1haW5tZW51XCIsICB4OiAwLCB5OiAwLCB3OiAxMjgwLCBoOiA3MjAgfVxyXG4gICAgICBwYXVzZW1lbnU6IHsgdGV4dHVyZTogXCJwYXVzZW1lbnVcIiwgeDogMCwgeTogMCwgdzogMTI4MCwgaDogNzIwIH1cclxuXHJcbiAgICAgICMgaG93dG9cclxuICAgICAgaG93dG8xOiAgICB7IHRleHR1cmU6IFwiaG93dG8xXCIsICB4OiAwLCB5OiAgMCwgdzogMTkyMCwgaDogMTA4MCB9XHJcbiAgICAgIGhvd3RvMjogICAgeyB0ZXh0dXJlOiBcImhvd3RvMlwiLCAgeDogMCwgeTogIDAsIHc6IDE5MjAsIGg6IDEwODAgfVxyXG4gICAgICBob3d0bzM6ICAgIHsgdGV4dHVyZTogXCJob3d0bzNcIiwgIHg6IDAsIHk6ICAwLCB3OiAxOTIwLCBoOiAxMDgwIH1cclxuXHJcbiAgICAgICMgY2hhcmFjdGVyc1xyXG4gICAgICBtYXJpbzogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAgMjAsIHk6ICAgMCwgdzogMTUxLCBoOiAzMDggfVxyXG4gICAgICBsdWlnaTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAxNzEsIHk6ICAgMCwgdzogMTUxLCBoOiAzMDggfVxyXG4gICAgICBwZWFjaDogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAzMzUsIHk6ICAgMCwgdzogMTY0LCBoOiAzMDggfVxyXG4gICAgICBkYWlzeTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA1MDQsIHk6ICAgMCwgdzogMTY0LCBoOiAzMDggfVxyXG4gICAgICB5b3NoaTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA2NjgsIHk6ICAgMCwgdzogMTgwLCBoOiAzMDggfVxyXG4gICAgICB0b2FkOiAgICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4NDksIHk6ICAgMCwgdzogMTU3LCBoOiAzMDggfVxyXG4gICAgICBib3dzZXI6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAgMTEsIHk6IDMyMiwgdzogMTUxLCBoOiAzMDggfVxyXG4gICAgICBib3dzZXJqcjogIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAyMjUsIHk6IDMyMiwgdzogMTQ0LCBoOiAzMDggfVxyXG4gICAgICBrb29wYTogICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiAzNzIsIHk6IDMyMiwgdzogMTI4LCBoOiAzMDggfVxyXG4gICAgICByb3NhbGluYTogIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA1MDAsIHk6IDMyMiwgdzogMTczLCBoOiAzMDggfVxyXG4gICAgICBzaHlndXk6ICAgIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA2OTEsIHk6IDMyMiwgdzogMTU0LCBoOiAzMDggfVxyXG4gICAgICB0b2FkZXR0ZTogIHsgdGV4dHVyZTogXCJjaGFyc1wiLCB4OiA4NDcsIHk6IDMyMiwgdzogMTU4LCBoOiAzMDggfVxyXG5cclxuICBjYWxjV2lkdGg6IChzcHJpdGVOYW1lLCBoZWlnaHQpIC0+XHJcbiAgICBzcHJpdGUgPSBAc3ByaXRlc1tzcHJpdGVOYW1lXVxyXG4gICAgcmV0dXJuIDEgaWYgbm90IHNwcml0ZVxyXG4gICAgcmV0dXJuIGhlaWdodCAqIHNwcml0ZS53IC8gc3ByaXRlLmhcclxuXHJcbiAgcmVuZGVyOiAoc3ByaXRlTmFtZSwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgY29sb3IsIGNiKSAtPlxyXG4gICAgc3ByaXRlID0gQHNwcml0ZXNbc3ByaXRlTmFtZV1cclxuICAgIHJldHVybiBpZiBub3Qgc3ByaXRlXHJcbiAgICBpZiAoZHcgPT0gMCkgYW5kIChkaCA9PSAwKVxyXG4gICAgICAjIHRoaXMgcHJvYmFibHkgc2hvdWxkbid0IGV2ZXIgYmUgdXNlZC5cclxuICAgICAgZHcgPSBzcHJpdGUueFxyXG4gICAgICBkaCA9IHNwcml0ZS55XHJcbiAgICBlbHNlIGlmIGR3ID09IDBcclxuICAgICAgZHcgPSBkaCAqIHNwcml0ZS53IC8gc3ByaXRlLmhcclxuICAgIGVsc2UgaWYgZGggPT0gMFxyXG4gICAgICBkaCA9IGR3ICogc3ByaXRlLmggLyBzcHJpdGUud1xyXG4gICAgQGdhbWUuZHJhd0ltYWdlIHNwcml0ZS50ZXh0dXJlLCBzcHJpdGUueCwgc3ByaXRlLnksIHNwcml0ZS53LCBzcHJpdGUuaCwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSwgY2JcclxuICAgIHJldHVyblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGVSZW5kZXJlclxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9XHJcbiAgZGFya2ZvcmVzdDpcclxuICAgIGhlaWdodDogNzJcclxuICAgIGdseXBoczpcclxuICAgICAgJzk3JyA6IHsgeDogICA4LCB5OiAgIDgsIHdpZHRoOiAgMzQsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICc5OCcgOiB7IHg6ICAgOCwgeTogIDU4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnOTknIDogeyB4OiAgNTAsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzEwMCc6IHsgeDogICA4LCB5OiAxMTgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMDEnOiB7IHg6ICAgOCwgeTogMTc4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTAyJzogeyB4OiAgIDgsIHk6IDIyOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDMzIH1cclxuICAgICAgJzEwMyc6IHsgeDogICA4LCB5OiAyNzgsIHdpZHRoOiAgMzYsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICcxMDQnOiB7IHg6ICAgOCwgeTogMzI4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTA1JzogeyB4OiAgIDgsIHk6IDM3OCwgd2lkdGg6ICAxMiwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDExIH1cclxuICAgICAgJzEwNic6IHsgeDogICA4LCB5OiA0MjgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMDcnOiB7IHg6ICAyOCwgeTogMzc4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTA4JzogeyB4OiAgNTEsIHk6IDMyOCwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDMzIH1cclxuICAgICAgJzEwOSc6IHsgeDogIDUxLCB5OiA0MjcsIHdpZHRoOiAgMzgsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNyB9XHJcbiAgICAgICcxMTAnOiB7IHg6ICA3MSwgeTogMzc3LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTExJzogeyB4OiAgOTcsIHk6IDQyNywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzExMic6IHsgeDogIDUxLCB5OiAgNTgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMTMnOiB7IHg6ICA1MSwgeTogMTA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0NSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTE0JzogeyB4OiAgOTMsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzExNSc6IHsgeDogIDUxLCB5OiAxNjEsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICcxMTYnOiB7IHg6ICA1MSwgeTogMjExLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzMgfVxyXG4gICAgICAnMTE3JzogeyB4OiAgNTIsIHk6IDI2MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzExOCc6IHsgeDogIDkzLCB5OiAzMTEsIHdpZHRoOiAgMzQsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzMiB9XHJcbiAgICAgICcxMTknOiB7IHg6IDExNCwgeTogMzYwLCB3aWR0aDogIDM4LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzggfVxyXG4gICAgICAnMTIwJzogeyB4OiAxNDAsIHk6IDQxMCwgd2lkdGg6ICAzNiwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzEyMSc6IHsgeDogMTQwLCB5OiA0NTksIHdpZHRoOiAgMzUsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMjInOiB7IHg6IDE4MywgeTogNDU5LCB3aWR0aDogIDM2LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnNjUnIDogeyB4OiAgOTQsIHk6ICA1OCwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzY2JyA6IHsgeDogIDk0LCB5OiAxMTksIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNyB9XHJcbiAgICAgICc2NycgOiB7IHg6ICA5NCwgeTogMTgwLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNjgnIDogeyB4OiAgOTUsIHk6IDI0MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzY5JyA6IHsgeDogMTM2LCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc3MCcgOiB7IHg6IDEzNywgeTogIDY5LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnNzEnIDogeyB4OiAxNzksIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzcyJyA6IHsgeDogMTM3LCB5OiAxMzAsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc3MycgOiB7IHg6IDEzOCwgeTogMTkxLCB3aWR0aDogIDEyLCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMTMgfVxyXG4gICAgICAnNzQnIDogeyB4OiAxMzgsIHk6IDI1Miwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzc1JyA6IHsgeDogMTU4LCB5OiAxOTEsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc3NicgOiB7IHg6IDE2MCwgeTogMzEzLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnNzcnIDogeyB4OiAxODEsIHk6IDI1MSwgd2lkdGg6ICAzOCwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM5IH1cclxuICAgICAgJzc4JyA6IHsgeDogMTg0LCB5OiAzNzQsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc3OScgOiB7IHg6IDIwMywgeTogMzEyLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnODAnIDogeyB4OiAxODAsIHk6ICA2OSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzgxJyA6IHsgeDogMjAxLCB5OiAxMzAsIHdpZHRoOiAgMzUsIGhlaWdodDogIDU2LCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc4MicgOiB7IHg6IDIyMiwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnODMnIDogeyB4OiAyMjMsIHk6ICA2OSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzg0JyA6IHsgeDogMjY1LCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzMyB9XHJcbiAgICAgICc4NScgOiB7IHg6IDIyNywgeTogMTk0LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnODYnIDogeyB4OiAyNDQsIHk6IDEzMCwgd2lkdGg6ICA0MSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDE5LCB4YWR2YW5jZTogIDM5IH1cclxuICAgICAgJzg3JyA6IHsgeDogMjY2LCB5OiAgNjksIHdpZHRoOiAgMzgsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNyB9XHJcbiAgICAgICc4OCcgOiB7IHg6IDMwOCwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMTksIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnODknIDogeyB4OiAyMjcsIHk6IDM3Mywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDE5LCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzkwJyA6IHsgeDogMjI3LCB5OiA0MzMsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICczMycgOiB7IHg6IDI0NiwgeTogMjU1LCB3aWR0aDogIDE0LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMTEgfVxyXG4gICAgICAnNTknIDogeyB4OiAxODAsIHk6IDEzMCwgd2lkdGg6ICAxMywgaGVpZ2h0OiAgMzcsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDU2LCB4YWR2YW5jZTogIDEzIH1cclxuICAgICAgJzM3JyA6IHsgeDogIDk1LCB5OiAzMDIsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICc1OCcgOiB7IHg6IDE2MCwgeTogMzc0LCB3aWR0aDogIDEzLCBoZWlnaHQ6ICAyMywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNTAsIHhhZHZhbmNlOiAgMTMgfVxyXG4gICAgICAnNjMnIDogeyB4OiAyNjgsIHk6IDI1NSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDMzIH1cclxuICAgICAgJzQyJyA6IHsgeDogMTAzLCB5OiAzMDIsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICc0MCcgOiB7IHg6IDI3MCwgeTogMTkwLCB3aWR0aDogIDIzLCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjEgfVxyXG4gICAgICAnNDEnIDogeyB4OiAyOTMsIHk6IDEzMCwgd2lkdGg6ICAyMywgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDIxIH1cclxuICAgICAgJzk1JyA6IHsgeDogMTExLCB5OiAzMDIsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICc0MycgOiB7IHg6IDI0NiwgeTogMzE2LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICAzNCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMzksIHhhZHZhbmNlOiAgMzIgfVxyXG4gICAgICAnNDUnIDogeyB4OiAxODQsIHk6IDQzNSwgd2lkdGg6ICAyNiwgaGVpZ2h0OiAgMTEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDQ0LCB4YWR2YW5jZTogIDI1IH1cclxuICAgICAgJzYxJyA6IHsgeDogMzEyLCB5OiAgNjgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDMwLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICA0MiwgeGFkdmFuY2U6ICAzMyB9XHJcbiAgICAgICc0NicgOiB7IHg6IDEzNSwgeTogMzEzLCB3aWR0aDogIDE0LCBoZWlnaHQ6ICAxMSwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNjEsIHhhZHZhbmNlOiAgMTQgfVxyXG4gICAgICAnNDQnIDogeyB4OiAyMjcsIHk6IDI1NSwgd2lkdGg6ICAxMCwgaGVpZ2h0OiAgMjEsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDY4LCB4YWR2YW5jZTogIDExIH1cclxuICAgICAgJzQ3JyA6IHsgeDogMzUxLCB5OiAgIDgsIHdpZHRoOiAgMjgsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAxOSwgeGFkdmFuY2U6ICAyNiB9XHJcbiAgICAgICcxMjQnOiB7IHg6IDExOSwgeTogMzAyLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMzQnIDogeyB4OiAxMjcsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzM5JyA6IHsgeDogMjAxLCB5OiAxOTQsIHdpZHRoOiAgMTgsIGhlaWdodDogIDE5LCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAgMCwgeGFkdmFuY2U6ICAyMSB9XHJcbiAgICAgICc2NCcgOiB7IHg6IDIxOCwgeTogNDM1LCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMzUnIDogeyB4OiAyMTgsIHk6IDQ0Mywgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzM2JyA6IHsgeDogMzAxLCB5OiAxOTAsIHdpZHRoOiAgMzIsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMiwgeGFkdmFuY2U6ICAyOSB9XHJcbiAgICAgICc5NCcgOiB7IHg6IDIxOCwgeTogNDUxLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMzgnIDogeyB4OiAyNDYsIHk6IDM1OCwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzEyMyc6IHsgeDogMzI0LCB5OiAxMDYsIHdpZHRoOiAgMjcsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyNiB9XHJcbiAgICAgICcxMjUnOiB7IHg6IDI3MCwgeTogMzU4LCB3aWR0aDogIDI3LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjcgfVxyXG4gICAgICAnOTEnIDogeyB4OiAyNzAsIHk6IDQxOCwgd2lkdGg6ICAyMiwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDIxIH1cclxuICAgICAgJzkzJyA6IHsgeDogMzAwLCB5OiA0MTgsIHdpZHRoOiAgMjIsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyMCB9XHJcbiAgICAgICc0OCcgOiB7IHg6IDMwNSwgeTogMzE2LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNDknIDogeyB4OiAzMTEsIHk6IDI1MSwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzUwJyA6IHsgeDogMzQxLCB5OiAxNjYsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNyB9XHJcbiAgICAgICc1MScgOiB7IHg6IDM1OSwgeTogIDY4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNTInIDogeyB4OiAzMzAsIHk6IDM3Nywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzUzJyA6IHsgeDogMzQ4LCB5OiAzMTIsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNyB9XHJcbiAgICAgICc1NCcgOiB7IHg6IDMzMCwgeTogNDM4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNTUnIDogeyB4OiAzNTMsIHk6IDIyNywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzU2JyA6IHsgeDogMzg0LCB5OiAxMjksIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc1NycgOiB7IHg6IDQwMiwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnMzInIDogeyB4OiAgIDAsIHk6ICAgMCwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDIyIH1cclxuIiwiIyBUaGlzIGZpbGUgcHJvdmlkZXMgdGhlIHJlbmRlcmluZyBlbmdpbmUgZm9yIHRoZSB3ZWIgdmVyc2lvbi4gTm9uZSBvZiB0aGlzIGNvZGUgaXMgaW5jbHVkZWQgaW4gdGhlIEphdmEgdmVyc2lvbi5cclxuXHJcbmNvbnNvbGUubG9nICd3ZWIgc3RhcnR1cCdcclxuXHJcbkdhbWUgPSByZXF1aXJlICcuL0dhbWUnXHJcblxyXG4jIHRha2VuIGZyb20gaHR0cDojc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MjM4MzgvcmdiLXRvLWhleC1hbmQtaGV4LXRvLXJnYlxyXG5jb21wb25lbnRUb0hleCA9IChjKSAtPlxyXG4gIGhleCA9IE1hdGguZmxvb3IoYyAqIDI1NSkudG9TdHJpbmcoMTYpXHJcbiAgcmV0dXJuIGlmIGhleC5sZW5ndGggPT0gMSB0aGVuIFwiMFwiICsgaGV4IGVsc2UgaGV4XHJcbnJnYlRvSGV4ID0gKHIsIGcsIGIpIC0+XHJcbiAgcmV0dXJuIFwiI1wiICsgY29tcG9uZW50VG9IZXgocikgKyBjb21wb25lbnRUb0hleChnKSArIGNvbXBvbmVudFRvSGV4KGIpXHJcblxyXG5TQVZFX1RJTUVSX01TID0gMzAwMFxyXG5cclxuY2xhc3MgTmF0aXZlQXBwXHJcbiAgY29uc3RydWN0b3I6IChAc2NyZWVuLCBAd2lkdGgsIEBoZWlnaHQpIC0+XHJcbiAgICBAcmdia0NhY2hlID0gW11cclxuICAgIEB0aW50ZWRUZXh0dXJlQ2FjaGUgPSBbXVxyXG4gICAgQGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZWRvd24nLCBAb25Nb3VzZURvd24uYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmUuYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgICBAb25Nb3VzZVVwLmJpbmQodGhpcyksIGZhbHNlXHJcbiAgICBAY29udGV4dCA9IEBzY3JlZW4uZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAdGV4dHVyZXMgPSBbXHJcbiAgICAgICMgYWxsIGNhcmQgYXJ0XHJcbiAgICAgIFwiLi4vaW1hZ2VzL2NhcmRzLnBuZ1wiXHJcbiAgICAgICMgZm9udHNcclxuICAgICAgXCIuLi9pbWFnZXMvZGFya2ZvcmVzdC5wbmdcIlxyXG4gICAgICAjIGNoYXJhY3RlcnMgLyBvdGhlclxyXG4gICAgICBcIi4uL2ltYWdlcy9jaGFycy5wbmdcIlxyXG4gICAgICAjIGhlbHBcclxuICAgICAgXCIuLi9pbWFnZXMvaG93dG8xLnBuZ1wiXHJcbiAgICAgIFwiLi4vaW1hZ2VzL2hvd3RvMi5wbmdcIlxyXG4gICAgICBcIi4uL2ltYWdlcy9ob3d0bzMucG5nXCJcclxuICAgIF1cclxuXHJcbiAgICBAZ2FtZSA9IG5ldyBHYW1lKHRoaXMsIEB3aWR0aCwgQGhlaWdodClcclxuXHJcbiAgICBpZiB0eXBlb2YgU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiXHJcbiAgICAgIHN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0gXCJzdGF0ZVwiXHJcbiAgICAgIGlmIHN0YXRlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImxvYWRpbmcgc3RhdGU6ICN7c3RhdGV9XCJcclxuICAgICAgICBAZ2FtZS5sb2FkIHN0YXRlXHJcblxyXG4gICAgQHBlbmRpbmdJbWFnZXMgPSAwXHJcbiAgICBsb2FkZWRUZXh0dXJlcyA9IFtdXHJcbiAgICBmb3IgaW1hZ2VVcmwgaW4gQHRleHR1cmVzXHJcbiAgICAgIEBwZW5kaW5nSW1hZ2VzKytcclxuICAgICAgY29uc29sZS5sb2cgXCJsb2FkaW5nIGltYWdlICN7QHBlbmRpbmdJbWFnZXN9OiAje2ltYWdlVXJsfVwiXHJcbiAgICAgIGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgIGltZy5vbmxvYWQgPSBAb25JbWFnZUxvYWRlZC5iaW5kKHRoaXMpXHJcbiAgICAgIGltZy5zcmMgPSBpbWFnZVVybFxyXG4gICAgICBsb2FkZWRUZXh0dXJlcy5wdXNoIGltZ1xyXG4gICAgQHRleHR1cmVzID0gbG9hZGVkVGV4dHVyZXNcclxuXHJcbiAgICBAc2F2ZVRpbWVyID0gU0FWRV9USU1FUl9NU1xyXG5cclxuICBvbkltYWdlTG9hZGVkOiAoaW5mbykgLT5cclxuICAgIEBwZW5kaW5nSW1hZ2VzLS1cclxuICAgIGlmIEBwZW5kaW5nSW1hZ2VzID09IDBcclxuICAgICAgY29uc29sZS5sb2cgJ0FsbCBpbWFnZXMgbG9hZGVkLiBCZWdpbm5pbmcgcmVuZGVyIGxvb3AuJ1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gQHVwZGF0ZSgpXHJcblxyXG4gIGxvZzogKHMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIk5hdGl2ZUFwcC5sb2coKTogI3tzfVwiXHJcblxyXG4gIHVwZGF0ZVNhdmU6IChkdCkgLT5cclxuICAgIHJldHVybiBpZiB0eXBlb2YgU3RvcmFnZSA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICBAc2F2ZVRpbWVyIC09IGR0XHJcbiAgICBpZiBAc2F2ZVRpbWVyIDw9IDBcclxuICAgICAgQHNhdmVUaW1lciA9IFNBVkVfVElNRVJfTVNcclxuICAgICAgc3RhdGUgPSBAZ2FtZS5zYXZlKClcclxuICAgICAgIyBjb25zb2xlLmxvZyBcInNhdmluZzogI3tzdGF0ZX1cIlxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSBcInN0YXRlXCIsIHN0YXRlXHJcblxyXG4gICMgZnJvbSBodHRwOi8vd3d3LnBsYXlteWNvZGUuY29tL2Jsb2cvMjAxMS8wNi9yZWFsdGltZS1pbWFnZS10aW50aW5nLW9uLWh0bWw1LWNhbnZhcy9cclxuICBnZW5lcmF0ZVJHQktzOiAoaW1nKSAtPlxyXG4gICAgdyA9IGltZy53aWR0aFxyXG4gICAgaCA9IGltZy5oZWlnaHRcclxuICAgIHJnYmtzID0gW11cclxuXHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiY2FudmFzXCJcclxuICAgIGNhbnZhcy53aWR0aCA9IHdcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBoXHJcblxyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQgXCIyZFwiXHJcbiAgICBjdHguZHJhd0ltYWdlIGltZywgMCwgMFxyXG5cclxuICAgIHBpeGVscyA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgdywgaCkuZGF0YVxyXG5cclxuICAgICMgNCBpcyB1c2VkIHRvIGFzayBmb3IgMyBpbWFnZXM6IHJlZCwgZ3JlZW4sIGJsdWUgYW5kXHJcbiAgICAjIGJsYWNrIGluIHRoYXQgb3JkZXIuXHJcbiAgICBmb3IgcmdiSSBpbiBbMC4uLjRdXHJcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICAgICAgY2FudmFzLndpZHRoICA9IHdcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGhcclxuXHJcbiAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UgaW1nLCAwLCAwXHJcbiAgICAgIHRvID0gY3R4LmdldEltYWdlRGF0YSAwLCAwLCB3LCBoXHJcbiAgICAgIHRvRGF0YSA9IHRvLmRhdGFcclxuXHJcbiAgICAgIGZvciBpIGluIFswLi4ucGl4ZWxzLmxlbmd0aF0gYnkgNFxyXG4gICAgICAgIHRvRGF0YVtpICBdID0gaWYgKHJnYkkgPT0gMCkgdGhlbiBwaXhlbHNbaSAgXSBlbHNlIDBcclxuICAgICAgICB0b0RhdGFbaSsxXSA9IGlmIChyZ2JJID09IDEpIHRoZW4gcGl4ZWxzW2krMV0gZWxzZSAwXHJcbiAgICAgICAgdG9EYXRhW2krMl0gPSBpZiAocmdiSSA9PSAyKSB0aGVuIHBpeGVsc1tpKzJdIGVsc2UgMFxyXG4gICAgICAgIHRvRGF0YVtpKzNdID0gICAgICAgICAgICAgICAgICAgICBwaXhlbHNbaSszXVxyXG5cclxuICAgICAgY3R4LnB1dEltYWdlRGF0YSB0bywgMCwgMFxyXG5cclxuICAgICAgIyBpbWFnZSBpcyBfc2xpZ2h0bHlfIGZhc3RlciB0aGFuIGNhbnZhcyBmb3IgdGhpcywgc28gY29udmVydFxyXG4gICAgICBpbWdDb21wID0gbmV3IEltYWdlKClcclxuICAgICAgaW1nQ29tcC5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcclxuICAgICAgcmdia3MucHVzaCBpbWdDb21wXHJcblxyXG4gICAgcmV0dXJuIHJnYmtzXHJcblxyXG4gIGdlbmVyYXRlVGludEltYWdlOiAodGV4dHVyZUluZGV4LCByZWQsIGdyZWVuLCBibHVlKSAtPlxyXG4gICAgaW1nID0gQHRleHR1cmVzW3RleHR1cmVJbmRleF1cclxuICAgIGJ1ZmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiY2FudmFzXCJcclxuICAgIGJ1ZmYud2lkdGggID0gaW1nLndpZHRoXHJcbiAgICBidWZmLmhlaWdodCA9IGltZy5oZWlnaHRcclxuXHJcbiAgICBjdHggPSBidWZmLmdldENvbnRleHQgXCIyZFwiXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2NvcHknXHJcbiAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMClcclxuICAgIGZpbGxDb2xvciA9IFwicmdiKCN7TWF0aC5mbG9vcihyZWQqMjU1KX0sICN7TWF0aC5mbG9vcihncmVlbioyNTUpfSwgI3tNYXRoLmZsb29yKGJsdWUqMjU1KX0pXCJcclxuICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcclxuICAgIGNvbnNvbGUubG9nIFwiZmlsbENvbG9yICN7ZmlsbENvbG9yfVwiXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ211bHRpcGx5J1xyXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGJ1ZmYud2lkdGgsIGJ1ZmYuaGVpZ2h0KVxyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdjb3B5J1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gMS4wXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLWluJ1xyXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApXHJcblxyXG4gICAgaW1nQ29tcCA9IG5ldyBJbWFnZSgpXHJcbiAgICBpbWdDb21wLnNyYyA9IGJ1ZmYudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBpbWdDb21wXHJcblxyXG4gIGdlbmVyYXRlVGludEltYWdlMjogKHRleHR1cmVJbmRleCwgcmVkLCBncmVlbiwgYmx1ZSkgLT5cclxuICAgIGltZyA9IEB0ZXh0dXJlc1t0ZXh0dXJlSW5kZXhdXHJcbiAgICByZ2JrcyA9IEByZ2JrQ2FjaGVbdGV4dHVyZUluZGV4XVxyXG4gICAgaWYgbm90IHJnYmtzXHJcbiAgICAgIHJnYmtzID0gQGdlbmVyYXRlUkdCS3MoaW1nKVxyXG4gICAgICBAcmdia0NhY2hlW3RleHR1cmVJbmRleF0gPSByZ2Jrc1xyXG4gICAgICAjIGNvbnNvbGUubG9nIFwiZ2VuZXJhdGVkIFJHQktzIGZvciAje3RleHR1cmVJbmRleH1cIlxyXG5cclxuICAgIGJ1ZmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiY2FudmFzXCJcclxuICAgIGJ1ZmYud2lkdGggID0gaW1nLndpZHRoXHJcbiAgICBidWZmLmhlaWdodCA9IGltZy5oZWlnaHRcclxuXHJcbiAgICBjdHggPSBidWZmLmdldENvbnRleHQgXCIyZFwiXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2NvcHknXHJcbiAgICBjdHguZHJhd0ltYWdlIHJnYmtzWzNdLCAwLCAwXHJcblxyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJ1xyXG4gICAgaWYgcmVkID4gMFxyXG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSByZWRcclxuICAgICAgY3R4LmRyYXdJbWFnZSByZ2Jrc1swXSwgMCwgMFxyXG4gICAgaWYgZ3JlZW4gPiAwXHJcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IGdyZWVuXHJcbiAgICAgIGN0eC5kcmF3SW1hZ2Ugcmdia3NbMV0sIDAsIDBcclxuICAgIGlmIGJsdWUgPiAwXHJcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IGJsdWVcclxuICAgICAgY3R4LmRyYXdJbWFnZSByZ2Jrc1syXSwgMCwgMFxyXG5cclxuICAgIGltZ0NvbXAgPSBuZXcgSW1hZ2UoKVxyXG4gICAgaW1nQ29tcC5zcmMgPSBidWZmLnRvRGF0YVVSTCgpXHJcbiAgICByZXR1cm4gaW1nQ29tcFxyXG5cclxuICBkcmF3SW1hZ2U6ICh0ZXh0dXJlSW5kZXgsIHNyY1gsIHNyY1ksIHNyY1csIHNyY0gsIGRzdFgsIGRzdFksIGRzdFcsIGRzdEgsIHJvdCwgYW5jaG9yWCwgYW5jaG9yWSwgciwgZywgYiwgYSkgLT5cclxuICAgIHRleHR1cmUgPSBAdGV4dHVyZXNbdGV4dHVyZUluZGV4XVxyXG4gICAgaWYgKHIgIT0gMSkgb3IgKGcgIT0gMSkgb3IgKGIgIT0gMSlcclxuICAgICAgdGludGVkVGV4dHVyZUtleSA9IFwiI3t0ZXh0dXJlSW5kZXh9LSN7cn0tI3tnfS0je2J9XCJcclxuICAgICAgdGludGVkVGV4dHVyZSA9IEB0aW50ZWRUZXh0dXJlQ2FjaGVbdGludGVkVGV4dHVyZUtleV1cclxuICAgICAgaWYgbm90IHRpbnRlZFRleHR1cmVcclxuICAgICAgICB0aW50ZWRUZXh0dXJlID0gQGdlbmVyYXRlVGludEltYWdlIHRleHR1cmVJbmRleCwgciwgZywgYlxyXG4gICAgICAgIEB0aW50ZWRUZXh0dXJlQ2FjaGVbdGludGVkVGV4dHVyZUtleV0gPSB0aW50ZWRUZXh0dXJlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImdlbmVyYXRlZCBjYWNoZWQgdGV4dHVyZSAje3RpbnRlZFRleHR1cmVLZXl9XCJcclxuICAgICAgdGV4dHVyZSA9IHRpbnRlZFRleHR1cmVcclxuXHJcbiAgICBAY29udGV4dC5zYXZlKClcclxuICAgIEBjb250ZXh0LnRyYW5zbGF0ZSBkc3RYLCBkc3RZXHJcbiAgICBAY29udGV4dC5yb3RhdGUgcm90ICMgKiAzLjE0MTU5MiAvIDE4MC4wXHJcbiAgICBhbmNob3JPZmZzZXRYID0gLTEgKiBhbmNob3JYICogZHN0V1xyXG4gICAgYW5jaG9yT2Zmc2V0WSA9IC0xICogYW5jaG9yWSAqIGRzdEhcclxuICAgIEBjb250ZXh0LnRyYW5zbGF0ZSBhbmNob3JPZmZzZXRYLCBhbmNob3JPZmZzZXRZXHJcbiAgICBAY29udGV4dC5nbG9iYWxBbHBoYSA9IGFcclxuICAgIEBjb250ZXh0LmRyYXdJbWFnZSh0ZXh0dXJlLCBzcmNYLCBzcmNZLCBzcmNXLCBzcmNILCAwLCAwLCBkc3RXLCBkc3RIKVxyXG4gICAgQGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuICAgIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICBkdCA9IG5vdyAtIEBsYXN0VGltZVxyXG4gICAgQGxhc3RUaW1lID0gbm93XHJcblxyXG4gICAgQGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIEB3aWR0aCwgQGhlaWdodClcclxuICAgIEBnYW1lLnVwZGF0ZShkdClcclxuICAgIHJlbmRlckNvbW1hbmRzID0gQGdhbWUucmVuZGVyKClcclxuXHJcbiAgICBpID0gMFxyXG4gICAgbiA9IHJlbmRlckNvbW1hbmRzLmxlbmd0aFxyXG4gICAgd2hpbGUgKGkgPCBuKVxyXG4gICAgICBkcmF3Q2FsbCA9IHJlbmRlckNvbW1hbmRzLnNsaWNlKGksIGkgKz0gMTYpXHJcbiAgICAgIEBkcmF3SW1hZ2UuYXBwbHkodGhpcywgZHJhd0NhbGwpXHJcblxyXG4gICAgQHVwZGF0ZVNhdmUoZHQpXHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0+IEB1cGRhdGUoKVxyXG5cclxuICBvbk1vdXNlRG93bjogKGV2dCkgLT5cclxuICAgIEBnYW1lLnRvdWNoRG93bihldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXHJcblxyXG4gIG9uTW91c2VNb3ZlOiAoZXZ0KSAtPlxyXG4gICAgQGdhbWUudG91Y2hNb3ZlKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSlcclxuXHJcbiAgb25Nb3VzZVVwOiAoZXZ0KSAtPlxyXG4gICAgQGdhbWUudG91Y2hVcChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXHJcblxyXG5zY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnc2NyZWVuJ1xyXG5yZXNpemVTY3JlZW4gPSAtPlxyXG4gIGRlc2lyZWRBc3BlY3RSYXRpbyA9IDE2IC8gOVxyXG4gIGN1cnJlbnRBc3BlY3RSYXRpbyA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgaWYgY3VycmVudEFzcGVjdFJhdGlvIDwgZGVzaXJlZEFzcGVjdFJhdGlvXHJcbiAgICBzY3JlZW4ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgc2NyZWVuLmhlaWdodCA9IE1hdGguZmxvb3Iod2luZG93LmlubmVyV2lkdGggKiAoMSAvIGRlc2lyZWRBc3BlY3RSYXRpbykpXHJcbiAgZWxzZVxyXG4gICAgc2NyZWVuLndpZHRoID0gTWF0aC5mbG9vcih3aW5kb3cuaW5uZXJIZWlnaHQgKiBkZXNpcmVkQXNwZWN0UmF0aW8pXHJcbiAgICBzY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbnJlc2l6ZVNjcmVlbigpXHJcbiMgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZVNjcmVlbiwgZmFsc2VcclxuXHJcbmFwcCA9IG5ldyBOYXRpdmVBcHAoc2NyZWVuLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXHJcbiJdfQ==
