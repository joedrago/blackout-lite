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

  NativeApp.prototype.onTouchStart = function(evt) {
    var j, len, results, touch, touches;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL0FuaW1hdGlvbi5jb2ZmZWUiLCJnYW1lL0JsYWNrb3V0LmNvZmZlZSIsImdhbWUvQnV0dG9uLmNvZmZlZSIsImdhbWUvRm9udFJlbmRlcmVyLmNvZmZlZSIsImdhbWUvR2FtZS5jb2ZmZWUiLCJnYW1lL0hhbmQuY29mZmVlIiwiZ2FtZS9NZW51LmNvZmZlZSIsImdhbWUvUGlsZS5jb2ZmZWUiLCJnYW1lL1Nwcml0ZVJlbmRlcmVyLmNvZmZlZSIsImdhbWUvZm9udG1ldHJpY3MuY29mZmVlIiwiZ2FtZS9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLFNBQUMsQ0FBRDtFQUNULElBQUcsQ0FBQSxLQUFLLENBQVI7QUFDRSxXQUFPLEVBRFQ7R0FBQSxNQUVLLElBQUcsQ0FBQSxHQUFJLENBQVA7QUFDSCxXQUFPLENBQUMsRUFETDs7QUFFTCxTQUFPO0FBTEU7O0FBT0w7RUFDUyxtQkFBQyxJQUFEO0FBQ1gsUUFBQTtJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDO0lBQ2QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxHQUFELEdBQU87QUFDUCxTQUFBLFNBQUE7O01BQ0UsSUFBRyxDQUFBLEtBQUssT0FBUjtRQUNFLElBQUMsQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFMLEdBQVU7UUFDVixJQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBTCxHQUFVLEVBRlo7O0FBREY7RUFKVzs7c0JBVWIsSUFBQSxHQUFNLFNBQUE7SUFDSixJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQURoQjs7SUFFQSxJQUFHLGtCQUFIO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEdBQUcs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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2FsY1NpZ24gPSAodikgLT5cclxuICBpZiB2ID09IDBcclxuICAgIHJldHVybiAwXHJcbiAgZWxzZSBpZiB2IDwgMFxyXG4gICAgcmV0dXJuIC0xXHJcbiAgcmV0dXJuIDFcclxuXHJcbmNsYXNzIEFuaW1hdGlvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cclxuICAgIEBzcGVlZCA9IGRhdGEuc3BlZWRcclxuICAgIEByZXEgPSB7fVxyXG4gICAgQGN1ciA9IHt9XHJcbiAgICBmb3Igayx2IG9mIGRhdGFcclxuICAgICAgaWYgayAhPSAnc3BlZWQnXHJcbiAgICAgICAgQHJlcVtrXSA9IHZcclxuICAgICAgICBAY3VyW2tdID0gdlxyXG5cclxuICAjICdmaW5pc2hlcycgYWxsIGFuaW1hdGlvbnNcclxuICB3YXJwOiAtPlxyXG4gICAgaWYgQGN1ci5yP1xyXG4gICAgICBAY3VyLnIgPSBAcmVxLnJcclxuICAgIGlmIEBjdXIucz9cclxuICAgICAgQGN1ci5zID0gQHJlcS5zXHJcbiAgICBpZiBAY3VyLng/IGFuZCBAY3VyLnk/XHJcbiAgICAgIEBjdXIueCA9IEByZXEueFxyXG4gICAgICBAY3VyLnkgPSBAcmVxLnlcclxuXHJcbiAgYW5pbWF0aW5nOiAtPlxyXG4gICAgaWYgQGN1ci5yP1xyXG4gICAgICBpZiBAcmVxLnIgIT0gQGN1ci5yXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIGlmIEBjdXIucz9cclxuICAgICAgaWYgQHJlcS5zICE9IEBjdXIuc1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICBpZiBAY3VyLng/IGFuZCBAY3VyLnk/XHJcbiAgICAgIGlmIChAcmVxLnggIT0gQGN1ci54KSBvciAoQHJlcS55ICE9IEBjdXIueSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIHVwZGF0ZTogKGR0KSAtPlxyXG4gICAgdXBkYXRlZCA9IGZhbHNlXHJcbiAgICAjIHJvdGF0aW9uXHJcbiAgICBpZiBAY3VyLnI/XHJcbiAgICAgIGlmIEByZXEuciAhPSBAY3VyLnJcclxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgICAgICMgc2FuaXRpemUgcmVxdWVzdGVkIHJvdGF0aW9uXHJcbiAgICAgICAgdHdvUGkgPSBNYXRoLlBJICogMlxyXG4gICAgICAgIG5lZ1R3b1BpID0gLTEgKiB0d29QaVxyXG4gICAgICAgIEByZXEuciAtPSB0d29QaSB3aGlsZSBAcmVxLnIgPj0gdHdvUGlcclxuICAgICAgICBAcmVxLnIgKz0gdHdvUGkgd2hpbGUgQHJlcS5yIDw9IG5lZ1R3b1BpXHJcbiAgICAgICAgIyBwaWNrIGEgZGlyZWN0aW9uIGFuZCB0dXJuXHJcbiAgICAgICAgZHIgPSBAcmVxLnIgLSBAY3VyLnJcclxuICAgICAgICBkaXN0ID0gTWF0aC5hYnMoZHIpXHJcbiAgICAgICAgc2lnbiA9IGNhbGNTaWduKGRyKVxyXG4gICAgICAgIGlmIGRpc3QgPiBNYXRoLlBJXHJcbiAgICAgICAgICAjIHNwaW4gdGhlIG90aGVyIGRpcmVjdGlvbiwgaXQgaXMgY2xvc2VyXHJcbiAgICAgICAgICBkaXN0ID0gdHdvUGkgLSBkaXN0XHJcbiAgICAgICAgICBzaWduICo9IC0xXHJcbiAgICAgICAgbWF4RGlzdCA9IGR0ICogQHNwZWVkLnIgLyAxMDAwXHJcbiAgICAgICAgaWYgZGlzdCA8IG1heERpc3RcclxuICAgICAgICAgICMgd2UgY2FuIGZpbmlzaCB0aGlzIGZyYW1lXHJcbiAgICAgICAgICBAY3VyLnIgPSBAcmVxLnJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAY3VyLnIgKz0gbWF4RGlzdCAqIHNpZ25cclxuXHJcbiAgICAjIHNjYWxlXHJcbiAgICBpZiBAY3VyLnM/XHJcbiAgICAgIGlmIEByZXEucyAhPSBAY3VyLnNcclxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgICAgICMgcGljayBhIGRpcmVjdGlvbiBhbmQgdHVyblxyXG4gICAgICAgIGRzID0gQHJlcS5zIC0gQGN1ci5zXHJcbiAgICAgICAgZGlzdCA9IE1hdGguYWJzKGRzKVxyXG4gICAgICAgIHNpZ24gPSBjYWxjU2lnbihkcylcclxuICAgICAgICBtYXhEaXN0ID0gZHQgKiBAc3BlZWQucyAvIDEwMDBcclxuICAgICAgICBpZiBkaXN0IDwgbWF4RGlzdFxyXG4gICAgICAgICAgIyB3ZSBjYW4gZmluaXNoIHRoaXMgZnJhbWVcclxuICAgICAgICAgIEBjdXIucyA9IEByZXEuc1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBjdXIucyArPSBtYXhEaXN0ICogc2lnblxyXG5cclxuICAgICMgdHJhbnNsYXRpb25cclxuICAgIGlmIEBjdXIueD8gYW5kIEBjdXIueT9cclxuICAgICAgaWYgKEByZXEueCAhPSBAY3VyLngpIG9yIChAcmVxLnkgIT0gQGN1ci55KVxyXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICAgICAgdmVjWCA9IEByZXEueCAtIEBjdXIueFxyXG4gICAgICAgIHZlY1kgPSBAcmVxLnkgLSBAY3VyLnlcclxuICAgICAgICBkaXN0ID0gTWF0aC5zcXJ0KCh2ZWNYICogdmVjWCkgKyAodmVjWSAqIHZlY1kpKVxyXG4gICAgICAgIG1heERpc3QgPSBkdCAqIEBzcGVlZC50IC8gMTAwMFxyXG4gICAgICAgIGlmIGRpc3QgPCBtYXhEaXN0XHJcbiAgICAgICAgICAjIHdlIGNhbiBmaW5pc2ggdGhpcyBmcmFtZVxyXG4gICAgICAgICAgQGN1ci54ID0gQHJlcS54XHJcbiAgICAgICAgICBAY3VyLnkgPSBAcmVxLnlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIG1vdmUgYXMgbXVjaCBhcyBwb3NzaWJsZVxyXG4gICAgICAgICAgQGN1ci54ICs9ICh2ZWNYIC8gZGlzdCkgKiBtYXhEaXN0XHJcbiAgICAgICAgICBAY3VyLnkgKz0gKHZlY1kgLyBkaXN0KSAqIG1heERpc3RcclxuXHJcbiAgICByZXR1cm4gdXBkYXRlZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25cclxuIiwiTUlOX1BMQVlFUlMgPSAzXHJcbk1BWF9MT0dfTElORVMgPSA3XHJcbk9LID0gJ09LJ1xyXG5TdGF0ZSA9XHJcbiAgTE9CQlk6ICdsb2JieSdcclxuICBCSUQ6ICdiaWQnXHJcbiAgVFJJQ0s6ICd0cmljaydcclxuICBST1VORFNVTU1BUlk6ICdyb3VuZFN1bW1hcnknXHJcbiAgUE9TVEdBTUVTVU1NQVJZOiAncG9zdEdhbWVTdW1tYXJ5J1xyXG5cclxuU3VpdCA9XHJcbiAgTk9ORTogLTFcclxuICBDTFVCUzogMFxyXG4gIERJQU1PTkRTOiAxXHJcbiAgSEVBUlRTOiAyXHJcbiAgU1BBREVTOiAzXHJcblxyXG5TdWl0TmFtZSA9IFsnQ2x1YnMnLCAnRGlhbW9uZHMnLCAnSGVhcnRzJywgJ1NwYWRlcyddXHJcblNob3J0U3VpdE5hbWUgPSBbJ0MnLCAnRCcsICdIJywgJ1MnXVxyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBBSSBOYW1lIEdlbmVyYXRvclxyXG5cclxuYWlDaGFyYWN0ZXJMaXN0ID0gW1xyXG4gIHsgaWQ6IFwibWFyaW9cIiwgICAgbmFtZTogXCJNYXJpb1wiLCAgICAgIHNwcml0ZTogXCJtYXJpb1wiLCAgICBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJsdWlnaVwiLCAgICBuYW1lOiBcIkx1aWdpXCIsICAgICAgc3ByaXRlOiBcImx1aWdpXCIsICAgIGJyYWluOiBcImNoYW9zXCIgfVxyXG4gIHsgaWQ6IFwicGVhY2hcIiwgICAgbmFtZTogXCJQZWFjaFwiLCAgICAgIHNwcml0ZTogXCJwZWFjaFwiLCAgICBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJkYWlzeVwiLCAgICBuYW1lOiBcIkRhaXN5XCIsICAgICAgc3ByaXRlOiBcImRhaXN5XCIsICAgIGJyYWluOiBcImNvbnNlcnZhdGl2ZU1vcm9uXCIgfVxyXG4gIHsgaWQ6IFwieW9zaGlcIiwgICAgbmFtZTogXCJZb3NoaVwiLCAgICAgIHNwcml0ZTogXCJ5b3NoaVwiLCAgICBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJ0b2FkXCIsICAgICBuYW1lOiBcIlRvYWRcIiwgICAgICAgc3ByaXRlOiBcInRvYWRcIiwgICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcImJvd3NlclwiLCAgIG5hbWU6IFwiQm93c2VyXCIsICAgICBzcHJpdGU6IFwiYm93c2VyXCIsICAgYnJhaW46IFwiYWdncmVzc2l2ZU1vcm9uXCIgfVxyXG4gIHsgaWQ6IFwiYm93c2VyanJcIiwgbmFtZTogXCJCb3dzZXIgSnJcIiwgIHNwcml0ZTogXCJib3dzZXJqclwiLCBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJrb29wYVwiLCAgICBuYW1lOiBcIktvb3BhXCIsICAgICAgc3ByaXRlOiBcImtvb3BhXCIsICAgIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuICB7IGlkOiBcInJvc2FsaW5hXCIsIG5hbWU6IFwiUm9zYWxpbmFcIiwgICBzcHJpdGU6IFwicm9zYWxpbmFcIiwgYnJhaW46IFwibm9ybWFsXCIgfVxyXG4gIHsgaWQ6IFwic2h5Z3V5XCIsICAgbmFtZTogXCJTaHlndXlcIiwgICAgIHNwcml0ZTogXCJzaHlndXlcIiwgICBicmFpbjogXCJub3JtYWxcIiB9XHJcbiAgeyBpZDogXCJ0b2FkZXR0ZVwiLCBuYW1lOiBcIlRvYWRldHRlXCIsICAgc3ByaXRlOiBcInRvYWRldHRlXCIsIGJyYWluOiBcIm5vcm1hbFwiIH1cclxuXVxyXG5cclxuYWlDaGFyYWN0ZXJzID0ge31cclxuZm9yIGNoYXJhY3RlciBpbiBhaUNoYXJhY3Rlckxpc3RcclxuICBhaUNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxucmFuZG9tQ2hhcmFjdGVyID0gLT5cclxuICByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWlDaGFyYWN0ZXJMaXN0Lmxlbmd0aClcclxuICByZXR1cm4gYWlDaGFyYWN0ZXJMaXN0W3JdXHJcblxyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIENhcmRcclxuXHJcbmNsYXNzIENhcmRcclxuICBjb25zdHJ1Y3RvcjogKHgpIC0+XHJcbiAgICBAc3VpdCAgPSBNYXRoLmZsb29yKHggLyAxMylcclxuICAgIEB2YWx1ZSA9IE1hdGguZmxvb3IoeCAlIDEzKVxyXG4gICAgc3dpdGNoIEB2YWx1ZVxyXG4gICAgICB3aGVuIDkgIHRoZW4gQHZhbHVlTmFtZSA9ICdKJ1xyXG4gICAgICB3aGVuIDEwIHRoZW4gQHZhbHVlTmFtZSA9ICdRJ1xyXG4gICAgICB3aGVuIDExIHRoZW4gQHZhbHVlTmFtZSA9ICdLJ1xyXG4gICAgICB3aGVuIDEyIHRoZW4gQHZhbHVlTmFtZSA9ICdBJ1xyXG4gICAgICBlbHNlICAgICAgICAgQHZhbHVlTmFtZSA9IFN0cmluZyhAdmFsdWUgKyAyKVxyXG5cclxuICAgIEBuYW1lID0gQHZhbHVlTmFtZSArIFNob3J0U3VpdE5hbWVbQHN1aXRdXHJcblxyXG5jYXJkQmVhdHMgPSAoY2hhbGxlbmdlclgsIGNoYW1waW9uWCwgY3VycmVudFN1aXQpIC0+XHJcbiAgY2hhbGxlbmdlciA9IG5ldyBDYXJkKGNoYWxsZW5nZXJYKVxyXG4gIGNoYW1waW9uID0gbmV3IENhcmQoY2hhbXBpb25YKVxyXG5cclxuICBpZiBjaGFsbGVuZ2VyLnN1aXQgPT0gY2hhbXBpb24uc3VpdFxyXG4gICAgIyBFYXN5IGNhc2UuLi4gc2FtZSBzdWl0LCBqdXN0IHRlc3QgdmFsdWVcclxuICAgIHJldHVybiAoY2hhbGxlbmdlci52YWx1ZSA+IGNoYW1waW9uLnZhbHVlKVxyXG4gIGVsc2VcclxuICAgIGlmIGNoYWxsZW5nZXIuc3VpdCA9PSBTdWl0LlNQQURFU1xyXG4gICAgICAjIFRydW1wIGd1YXJhbnRlZWQgd2luXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgICMgRHVtcCBndWFyYW50ZWVkIGxvc3NcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIHJldHVybiBmYWxzZVxyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBEZWNrXHJcblxyXG5jbGFzcyBTaHVmZmxlZERlY2tcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgICMgZGF0IGluc2lkZS1vdXQgc2h1ZmZsZSFcclxuICAgIEBjYXJkcyA9IFsgMCBdXHJcbiAgICBmb3IgaSBpbiBbMS4uLjUyXVxyXG4gICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSlcclxuICAgICAgQGNhcmRzLnB1c2goQGNhcmRzW2pdKVxyXG4gICAgICBAY2FyZHNbal0gPSBpXHJcblxyXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4jIEJsYWNrb3V0XHJcblxyXG5jbGFzcyBCbGFja291dFxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUsIHBhcmFtcykgLT5cclxuICAgIHJldHVybiBpZiBub3QgcGFyYW1zXHJcblxyXG4gICAgaWYgcGFyYW1zLnN0YXRlXHJcbiAgICAgIGZvciBrLHYgb2YgcGFyYW1zLnN0YXRlXHJcbiAgICAgICAgaWYgcGFyYW1zLnN0YXRlLmhhc093blByb3BlcnR5KGspXHJcbiAgICAgICAgICB0aGlzW2tdID0gcGFyYW1zLnN0YXRlW2tdXHJcblxyXG4gICAgICAjIHRoaXMgY2FuIGJlIHJlbW92ZWQgYXQgc29tZSBwb2ludFxyXG4gICAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXHJcbiAgICAgICAgaWYgcGxheWVyLmNoYXJhY3RlclxyXG4gICAgICAgICAgcGxheWVyLmNoYXJJRCA9IHBsYXllci5jaGFyYWN0ZXIuc3ByaXRlXHJcbiAgICAgICAgICBkZWxldGUgcGxheWVyW1wiY2hhcmFjdGVyXCJdXHJcbiAgICBlbHNlXHJcbiAgICAgICMgbmV3IGdhbWVcclxuICAgICAgQHN0YXRlID0gU3RhdGUuTE9CQllcclxuICAgICAgQHBsYXllcnMgPSBwYXJhbXMucGxheWVyc1xyXG4gICAgICBAbG9nID0gW11cclxuICAgICAgaWYgcGFyYW1zLnJvdW5kcyA9PSAnTSdcclxuICAgICAgICAjIG1hcmF0aG9uIG1vZGUhXHJcbiAgICAgICAgQHJvdW5kcyA9IFsnTSddXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcm91bmRzID0gKE51bWJlcih2KSBmb3IgdiBpbiBwYXJhbXMucm91bmRzLnNwbGl0KFwifFwiKSlcclxuXHJcbiAgICAgIEBwbGF5ZXJzWzBdLmJpZCA9IDBcclxuICAgICAgQHBsYXllcnNbMF0udHJpY2tzID0gMFxyXG4gICAgICBAcGxheWVyc1swXS5zY29yZSA9IDBcclxuICAgICAgQHBsYXllcnNbMF0uaW5kZXggPSAwXHJcblxyXG4gICAgICBAb3V0cHV0KEBwbGF5ZXJzWzBdLm5hbWUgKyAnIGNyZWF0ZXMgZ2FtZScpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBCbGFja291dCBtZXRob2RzXHJcblxyXG4gIG1hcmF0aG9uTW9kZTogLT5cclxuICAgIHJldHVybiAoQHJvdW5kc1swXSA9PSAnTScpXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBuYW1lcyA9IFwiYmlkcyBkZWFsZXIgbG9nIGxvd2VzdFJlcXVpcmVkIG5leHRSb3VuZCBwaWxlIHBpbGVXaG8gcGxheWVycyBwcmV2IHByZXZUcmlja1Rha2VyIHByZXZXaG8gcm91bmRzIHN0YXRlIHRyaWNrSUQgdHJpY2tUYWtlciB0cmlja3MgdHJ1bXBCcm9rZW4gdHVyblwiLnNwbGl0KFwiIFwiKVxyXG4gICAgc3RhdGUgPSB7fVxyXG4gICAgZm9yIG5hbWUgaW4gbmFtZXNcclxuICAgICAgc3RhdGVbbmFtZV0gPSB0aGlzW25hbWVdXHJcbiAgICByZXR1cm4gc3RhdGVcclxuXHJcbiAgZmluZFBsYXllcjogKGlkKSAtPlxyXG4gICAgZm9yIHBsYXllciBpbiBAcGxheWVyc1xyXG4gICAgICBpZiBwbGF5ZXIuaWQgPT0gaWRcclxuICAgICAgICByZXR1cm4gcGxheWVyXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gIGZpbmRPd25lcjogLT5cclxuICAgIHJldHVybiBAcGxheWVyc1swXVxyXG5cclxuICBjdXJyZW50UGxheWVyOiAtPlxyXG4gICAgcmV0dXJuIEBwbGF5ZXJzW0B0dXJuXVxyXG5cclxuICBjdXJyZW50U3VpdDogLT5cclxuICAgIGlmIEBwaWxlLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVybiBTdWl0Lk5PTkVcclxuXHJcbiAgICBjYXJkID0gbmV3IENhcmQoQHBpbGVbMF0pXHJcbiAgICByZXR1cm4gY2FyZC5zdWl0XHJcblxyXG4gIHJlbmFtZTogKGlkLCBuYW1lKSAtPlxyXG4gICAgcGxheWVyID0gQGZpbmRQbGF5ZXIoaWQpXHJcbiAgICBpZiBwbGF5ZXJcclxuICAgICAgQG91dHB1dChwbGF5ZXIubmFtZSArICcgcmVuYW1lZCB0byAnICsgbmFtZSlcclxuICAgICAgcGxheWVyLm5hbWUgPSBuYW1lXHJcblxyXG4gIHBsYXllckhhc1N1aXQ6IChwbGF5ZXIsIHN1aXQpIC0+XHJcbiAgICBmb3IgdiBpbiBwbGF5ZXIuaGFuZFxyXG4gICAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgICAgaWYgY2FyZC5zdWl0ID09IHN1aXRcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIHBsYXllckhhc09ubHlTcGFkZXM6IChwbGF5ZXIpIC0+XHJcbiAgICBmb3IgdiBpbiBwbGF5ZXIuaGFuZFxyXG4gICAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgICAgaWYgY2FyZC5zdWl0ICE9IFN1aXQuU1BBREVTXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwbGF5ZXJDYW5XaW5JblN1aXQ6IChwbGF5ZXIsIGNoYW1waW9uQ2FyZCkgLT5cclxuICAgIGZvciB2IGluIHBsYXllci5oYW5kXHJcbiAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgICBpZiBjYXJkLnN1aXQgPT0gY2hhbXBpb25DYXJkLnN1aXRcclxuICAgICAgICBpZiBjYXJkLnZhbHVlID4gY2hhbXBpb25DYXJkLnZhbHVlXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIGJlc3RJblBpbGU6IC0+XHJcbiAgICBpZiBAcGlsZS5sZW5ndGggPT0gMFxyXG4gICAgICByZXR1cm4gLTFcclxuICAgIGN1cnJlbnRTdWl0ID0gQGN1cnJlbnRTdWl0KClcclxuICAgIGJlc3QgPSAwXHJcbiAgICBmb3IgaSBpbiBbMS4uLkBwaWxlLmxlbmd0aF1cclxuICAgICAgaWYgY2FyZEJlYXRzKEBwaWxlW2ldLCBAcGlsZVtiZXN0XSwgY3VycmVudFN1aXQpXHJcbiAgICAgICAgYmVzdCA9IGlcclxuICAgIHJldHVybiBiZXN0XHJcblxyXG4gIHBsYXllckFmdGVyOiAoaW5kZXgpIC0+XHJcbiAgICByZXR1cm4gKGluZGV4ICsgMSkgJSBAcGxheWVycy5sZW5ndGhcclxuXHJcbiAgb3V0cHV0OiAodGV4dCkgLT5cclxuICAgIEBsb2cucHVzaCB0ZXh0XHJcbiAgICBpZiBAbG9nLmxlbmd0aCA+IE1BWF9MT0dfTElORVNcclxuICAgICAgQGxvZy5zaGlmdCgpXHJcblxyXG4gIHJlc2V0OiAocGFyYW1zKSAtPlxyXG4gICAgaWYgQHBsYXllcnMubGVuZ3RoIDwgTUlOX1BMQVlFUlNcclxuICAgICAgcmV0dXJuICdub3RFbm91Z2hQbGF5ZXJzJ1xyXG5cclxuICAgIGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuICAgICAgcGxheWVyLnNjb3JlID0gMFxyXG4gICAgICBwbGF5ZXIuaGFuZCA9IFtdXHJcblxyXG4gICAgQG5leHRSb3VuZCA9IDBcclxuICAgIEB0cnVtcEJyb2tlbiA9IGZhbHNlXHJcbiAgICBAcHJldiA9IFtdXHJcbiAgICBAcGlsZSA9IFtdXHJcbiAgICBAcGlsZVdobyA9IFtdXHJcbiAgICBAcHJldldobyA9IFtdXHJcbiAgICBAcHJldlRyaWNrVGFrZXIgPSAtMVxyXG5cclxuICAgIGlmIEBtYXJhdGhvbk1vZGUoKVxyXG4gICAgICByb3VuZENvdW50ID0gXCJNYXJhdGhvbiBtb2RlXCJcclxuICAgIGVsc2VcclxuICAgICAgcm91bmRDb3VudCA9IFwiI3tAcm91bmRzLmxlbmd0aH0gcm91bmRzXCJcclxuICAgIEBvdXRwdXQoXCJOZXcgZ2FtZSEgKCN7QHBsYXllcnMubGVuZ3RofSBwbGF5ZXJzLCAje3JvdW5kQ291bnR9KVwiKVxyXG5cclxuICAgIEBzdGFydEJpZCgpXHJcblxyXG4gICAgcmV0dXJuIE9LXHJcblxyXG4gIHN0YXJ0QmlkOiAocGFyYW1zKSAtPlxyXG4gICAgaWYgQG1hcmF0aG9uTW9kZSgpXHJcbiAgICAgIGlmIEBwbGF5ZXJzWzBdLnNjb3JlID4gMFxyXG4gICAgICAgIHJldHVybiAnZ2FtZU92ZXInXHJcbiAgICAgIEB0cmlja3MgPSAxM1xyXG4gICAgZWxzZVxyXG4gICAgICBpZihAbmV4dFJvdW5kID49IEByb3VuZHMubGVuZ3RoKVxyXG4gICAgICAgIHJldHVybiAnZ2FtZU92ZXInXHJcbiAgICAgIEB0cmlja3MgPSBAcm91bmRzW0BuZXh0Um91bmRdXHJcblxyXG4gICAgQG5leHRSb3VuZCsrXHJcblxyXG4gICAgaWYgQHByZXZUcmlja1Rha2VyID09IC0xXHJcbiAgICAgIEBkZWFsZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBAcGxheWVycy5sZW5ndGgpXHJcbiAgICAgIEBvdXRwdXQgXCJSYW5kb21seSBhc3NpZ25pbmcgZGVhbGVyIHRvICN7QHBsYXllcnNbQGRlYWxlcl0ubmFtZX1cIlxyXG4gICAgZWxzZVxyXG4gICAgICBAZGVhbGVyID0gQHByZXZUcmlja1Rha2VyXHJcbiAgICAgIEBvdXRwdXQgXCIje0BwbGF5ZXJzW0BkZWFsZXJdLm5hbWV9IGNsYWltZWQgbGFzdCB0cmljaywgZGVhbHNcIlxyXG5cclxuICAgIGRlY2sgPSBuZXcgU2h1ZmZsZWREZWNrKClcclxuICAgIGZvciBwbGF5ZXIsIGkgaW4gQHBsYXllcnNcclxuICAgICAgcGxheWVyLmJpZCA9IC0xXHJcbiAgICAgIHBsYXllci50cmlja3MgPSAwXHJcblxyXG4gICAgICBAZ2FtZS5sb2cgXCJkZWFsaW5nICN7QHRyaWNrc30gY2FyZHMgdG8gcGxheWVyICN7aX1cIlxyXG5cclxuICAgICAgcGxheWVyLmhhbmQgPSBbXVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkB0cmlja3NdXHJcbiAgICAgICAgcGxheWVyLmhhbmQucHVzaChkZWNrLmNhcmRzLnNoaWZ0KCkpXHJcblxyXG4gICAgICBwbGF5ZXIuaGFuZC5zb3J0IChhLGIpIC0+IHJldHVybiBhIC0gYlxyXG5cclxuICAgIEBzdGF0ZSA9IFN0YXRlLkJJRFxyXG4gICAgQHR1cm4gPSBAcGxheWVyQWZ0ZXIoQGRlYWxlcilcclxuICAgIEBiaWRzID0gMFxyXG4gICAgQHBpbGUgPSBbXVxyXG4gICAgQHBpbGVXaG8gPSBbXVxyXG4gICAgQHByZXYgPSBbXVxyXG4gICAgQHByZXZXaG8gPSBbXVxyXG4gICAgQHByZXZUcmlja1Rha2VyID0gLTFcclxuXHJcbiAgICBAb3V0cHV0KCdSb3VuZCAnICsgQG5leHRSb3VuZCArICcgYmVnaW5zICcgKyBAcGxheWVyc1tAdHVybl0ubmFtZSArICcgYmlkcyBmaXJzdCcpXHJcblxyXG4gICAgcmV0dXJuIE9LXHJcblxyXG4gIGVuZEJpZDogLT5cclxuICAgIGxvd2VzdFBsYXllciA9IDBcclxuICAgIGxvd2VzdENhcmQgPSBAcGxheWVyc1swXS5oYW5kWzBdICMgaGFuZCBpcyBzb3J0ZWQsIHRoZXJlZm9yZSBoYW5kWzBdIGlzIHRoZSBsb3dlc3RcclxuICAgIGZvciBpIGluIFsxLi4uQHBsYXllcnMubGVuZ3RoXVxyXG4gICAgICBwbGF5ZXIgPSBAcGxheWVyc1tpXVxyXG4gICAgICBpZiBwbGF5ZXIuaGFuZFswXSA8IGxvd2VzdENhcmRcclxuICAgICAgICBsb3dlc3RQbGF5ZXIgPSBpXHJcbiAgICAgICAgbG93ZXN0Q2FyZCA9IHBsYXllci5oYW5kWzBdXHJcblxyXG4gICAgQGxvd2VzdFJlcXVpcmVkID0gdHJ1ZSAjIE5leHQgcGxheWVyIGlzIG9ibGlnYXRlZCB0byB0aHJvdyB0aGUgbG93ZXN0IGNhcmRcclxuICAgIEB0dXJuID0gbG93ZXN0UGxheWVyXHJcbiAgICBAdHJ1bXBCcm9rZW4gPSBmYWxzZVxyXG4gICAgQHRyaWNrSUQgPSAwXHJcbiAgICBAc3RhcnRUcmljaygpXHJcblxyXG4gIHN0YXJ0VHJpY2s6ICgpIC0+XHJcbiAgICAjIEB0dXJuIHNob3VsZCBhbHJlYWR5IGJlIGNvcnJlY3QsIGVpdGhlciBmcm9tIGVuZEJpZCAobG93ZXN0IGNsdWIpIG9yIGVuZFRyaWNrIChsYXN0IHRyaWNrVGFrZXIpXHJcblxyXG4gICAgQHRyaWNrVGFrZXIgPSAtMVxyXG4gICAgQHN0YXRlID0gU3RhdGUuVFJJQ0tcclxuXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgZW5kVHJpY2s6IC0+XHJcbiAgICB0YWtlciA9IEBwbGF5ZXJzW0B0cmlja1Rha2VyXVxyXG4gICAgdGFrZXIudHJpY2tzKytcclxuXHJcbiAgICBAb3V0cHV0KHRha2VyLm5hbWUgKyAnIHBvY2tldHMgdGhlIHRyaWNrIFsnICsgdGFrZXIudHJpY2tzICsgJ10nKVxyXG4gICAgQHByZXZUcmlja1Rha2VyID0gQHRyaWNrVGFrZXJcclxuICAgIEB0dXJuID0gQHRyaWNrVGFrZXJcclxuICAgIEBwcmV2ID0gQHBpbGVcclxuICAgIEBwcmV2V2hvID0gQHBpbGVXaG9cclxuICAgIEBwaWxlID0gW11cclxuICAgIEBwaWxlV2hvID0gW11cclxuICAgIEB0cmlja0lEKytcclxuXHJcbiAgICBpZiBAcGxheWVyc1swXS5oYW5kLmxlbmd0aCA+IDBcclxuICAgICAgQHN0YXJ0VHJpY2soKVxyXG4gICAgZWxzZVxyXG4gICAgICByb3VuZENvdW50ID0gQHJvdW5kcy5sZW5ndGhcclxuICAgICAgaWYgQG1hcmF0aG9uTW9kZSgpXHJcbiAgICAgICAgcm91bmRDb3VudCA9IFwiTVwiXHJcbiAgICAgIEBvdXRwdXQoJ1JvdW5kIGVuZHMgWycgKyBAbmV4dFJvdW5kICsgJy8nICsgcm91bmRDb3VudCArICddJylcclxuXHJcbiAgICAgIGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuICAgICAgICBvdmVyVW5kZXIgPSBwbGF5ZXIuYmlkIC0gcGxheWVyLnRyaWNrc1xyXG4gICAgICAgIGlmIG92ZXJVbmRlciA8IDBcclxuICAgICAgICAgIG92ZXJVbmRlciAqPSAtMVxyXG5cclxuICAgICAgICBwZW5hbHR5UG9pbnRzID0gMFxyXG4gICAgICAgIHN0ZXAgPSAxXHJcbiAgICAgICAgd2hpbGUgb3ZlclVuZGVyID4gMFxyXG4gICAgICAgICAgcGVuYWx0eVBvaW50cyArPSBzdGVwKysgIyBkYXQgcXVhZHJhdGljXHJcbiAgICAgICAgICBvdmVyVW5kZXItLVxyXG5cclxuICAgICAgICBwbGF5ZXIuc2NvcmUgKz0gcGVuYWx0eVBvaW50c1xyXG5cclxuICAgICAgICBwbGF5ZXIubGFzdFdlbnQgPSBTdHJpbmcocGxheWVyLnRyaWNrcykgKyAnLycgKyBTdHJpbmcocGxheWVyLmJpZClcclxuICAgICAgICBwbGF5ZXIubGFzdFBvaW50cyA9IHBlbmFsdHlQb2ludHNcclxuXHJcbiAgICAgIGdhbWVFbmRpbmcgPSBmYWxzZVxyXG4gICAgICBpZiBAbWFyYXRob25Nb2RlKClcclxuICAgICAgICBnYW1lRW5kaW5nID0gKEBwbGF5ZXJzWzBdLnNjb3JlID4gMClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGdhbWVFbmRpbmcgPSAoQG5leHRSb3VuZCA+PSBAcm91bmRzLmxlbmd0aClcclxuXHJcbiAgICAgIGlmIGdhbWVFbmRpbmdcclxuICAgICAgICBAc3RhdGUgPSBTdGF0ZS5QT1NUR0FNRVNVTU1BUllcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBzdGF0ZSA9IFN0YXRlLlJPVU5EU1VNTUFSWVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgQmxhY2tvdXQgYWN0aW9uc1xyXG5cclxuICBxdWl0OiAocGFyYW1zKSAtPlxyXG4gICAgQHN0YXRlID0gU3RhdGUuUE9TVEdBTUVTVU1NQVJZXHJcbiAgICBAb3V0cHV0KCdTb21lb25lIHF1aXQgQmxhY2tvdXQgb3ZlcicpXHJcblxyXG4gIG5leHQ6IChwYXJhbXMpIC0+XHJcbiAgICBzd2l0Y2ggQHN0YXRlXHJcbiAgICAgIHdoZW4gU3RhdGUuTE9CQlkgICAgICAgICAgIHRoZW4gcmV0dXJuIEByZXNldChwYXJhbXMpXHJcbiAgICAgIHdoZW4gU3RhdGUuQklEU1VNTUFSWSAgICAgIHRoZW4gcmV0dXJuIEBzdGFydFRyaWNrKClcclxuICAgICAgd2hlbiBTdGF0ZS5ST1VORFNVTU1BUlkgICAgdGhlbiByZXR1cm4gQHN0YXJ0QmlkKClcclxuICAgICAgd2hlbiBTdGF0ZS5QT1NUR0FNRVNVTU1BUlkgdGhlbiByZXR1cm4gJ2dhbWVPdmVyJ1xyXG4gICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ25vTmV4dCdcclxuICAgIHJldHVybiAnbmV4dElzQ29uZnVzZWQnXHJcblxyXG4gIGJpZDogKHBhcmFtcykgLT5cclxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5CSURcclxuICAgICAgcmV0dXJuICdub3RCaWRkaW5nTm93J1xyXG5cclxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXHJcbiAgICBpZiBwYXJhbXMuaWQgIT0gY3VycmVudFBsYXllci5pZFxyXG4gICAgICByZXR1cm4gJ25vdFlvdXJUdXJuJ1xyXG5cclxuICAgIHBhcmFtcy5iaWQgPSBOdW1iZXIocGFyYW1zLmJpZClcclxuXHJcbiAgICBpZiAocGFyYW1zLmJpZCA8IDApIHx8IChwYXJhbXMuYmlkID4gQHRyaWNrcylcclxuICAgICAgcmV0dXJuICdiaWRPdXRPZlJhbmdlJ1xyXG5cclxuICAgIGlmIEB0dXJuID09IEBkZWFsZXJcclxuICAgICAgaWYgKEBiaWRzICsgcGFyYW1zLmJpZCkgPT0gQHRyaWNrc1xyXG4gICAgICAgIHJldHVybiAnZGVhbGVyRnVja2VkJ1xyXG5cclxuICAgICAgQGVuZEJpZCgpXHJcbiAgICBlbHNlXHJcbiAgICAgIEB0dXJuID0gQHBsYXllckFmdGVyKEB0dXJuKVxyXG5cclxuICAgIGN1cnJlbnRQbGF5ZXIuYmlkID0gcGFyYW1zLmJpZFxyXG4gICAgQGJpZHMgKz0gY3VycmVudFBsYXllci5iaWRcclxuICAgIEBvdXRwdXQoY3VycmVudFBsYXllci5uYW1lICsgXCIgYmlkcyBcIiArIGN1cnJlbnRQbGF5ZXIuYmlkKVxyXG5cclxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5CSURcclxuICAgICAgIyBCaWRkaW5nIGVuZGVkXHJcbiAgICAgIEBvdXRwdXQoJ0JpZGRpbmcgZW5kcyAnICsgQGJpZHMgKyAnLycgKyBAdHJpY2tzICsgJyAnICsgQHBsYXllcnNbQHR1cm5dLm5hbWUgKyAnIHRocm93cyBmaXJzdCcpXHJcblxyXG4gICAgcmV0dXJuIE9LXHJcblxyXG4gIGFkZFBsYXllcjogKHBsYXllcikgLT5cclxuICAgIHBsYXllci5iaWQgPSAwXHJcbiAgICBwbGF5ZXIudHJpY2tzID0gMFxyXG4gICAgcGxheWVyLnNjb3JlID0gMFxyXG4gICAgaWYgbm90IHBsYXllci5haVxyXG4gICAgICBwbGF5ZXIuYWkgPSBmYWxzZVxyXG5cclxuICAgIEBwbGF5ZXJzLnB1c2ggcGxheWVyXHJcbiAgICBwbGF5ZXIuaW5kZXggPSBAcGxheWVycy5sZW5ndGggLSAxXHJcbiAgICAjIEBvdXRwdXQocGxheWVyLm5hbWUgKyBcIiBqb2lucyBnYW1lIChcIiArIEBwbGF5ZXJzLmxlbmd0aCArIFwiKVwiKVxyXG5cclxuICBuYW1lUHJlc2VudDogKG5hbWUpIC0+XHJcbiAgICBmb3IgcGxheWVyIGluIEBwbGF5ZXJzXHJcbiAgICAgIGlmIHBsYXllci5uYW1lID09IG5hbWVcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICBhZGRBSTogLT5cclxuICAgIGxvb3BcclxuICAgICAgY2hhcmFjdGVyID0gcmFuZG9tQ2hhcmFjdGVyKClcclxuICAgICAgaWYgbm90IEBuYW1lUHJlc2VudChjaGFyYWN0ZXIubmFtZSlcclxuICAgICAgICBicmVha1xyXG5cclxuICAgIGFpID1cclxuICAgICAgY2hhcklEOiBjaGFyYWN0ZXIuaWRcclxuICAgICAgbmFtZTogY2hhcmFjdGVyLm5hbWVcclxuICAgICAgaWQ6ICdhaScgKyBTdHJpbmcoQHBsYXllcnMubGVuZ3RoKVxyXG4gICAgICBhaTogdHJ1ZVxyXG5cclxuICAgIEBhZGRQbGF5ZXIoYWkpXHJcblxyXG4gICAgQGdhbWUubG9nKFwiYWRkZWQgQUkgcGxheWVyXCIpXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgY2FuUGxheTogKHBhcmFtcykgLT5cclxuICAgIGlmIEBzdGF0ZSAhPSBTdGF0ZS5UUklDS1xyXG4gICAgICByZXR1cm4gJ25vdEluVHJpY2snXHJcblxyXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcclxuICAgIGlmIHBhcmFtcy5pZCAhPSBjdXJyZW50UGxheWVyLmlkXHJcbiAgICAgIHJldHVybiAnbm90WW91clR1cm4nXHJcblxyXG4gICAgaWYgcGFyYW1zLmhhc093blByb3BlcnR5KCd3aGljaCcpXHJcbiAgICAgIHBhcmFtcy53aGljaCA9IE51bWJlcihwYXJhbXMud2hpY2gpXHJcbiAgICAgIHBhcmFtcy5pbmRleCA9IC0xXHJcbiAgICAgIGZvciBjYXJkLCBpIGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxyXG4gICAgICAgIGlmIGNhcmQgPT0gcGFyYW1zLndoaWNoXHJcbiAgICAgICAgICBwYXJhbXMuaW5kZXggPSBpXHJcbiAgICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgcGFyYW1zLmluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuICdkb05vdEhhdmUnXHJcbiAgICBlbHNlXHJcbiAgICAgIHBhcmFtcy5pbmRleCA9IE51bWJlcihwYXJhbXMuaW5kZXgpXHJcblxyXG4gICAgaWYgKHBhcmFtcy5pbmRleCA8IDApIHx8IChwYXJhbXMuaW5kZXggPj0gY3VycmVudFBsYXllci5oYW5kLmxlbmd0aClcclxuICAgICAgcmV0dXJuICdpbmRleE91dE9mUmFuZ2UnXHJcblxyXG4gICAgaWYgQGxvd2VzdFJlcXVpcmVkICYmIChwYXJhbXMuaW5kZXggIT0gMClcclxuICAgICAgcmV0dXJuICdsb3dlc3RDYXJkUmVxdWlyZWQnXHJcblxyXG4gICAgY2hvc2VuQ2FyZFggPSBjdXJyZW50UGxheWVyLmhhbmRbcGFyYW1zLmluZGV4XVxyXG4gICAgY2hvc2VuQ2FyZCA9IG5ldyBDYXJkKGNob3NlbkNhcmRYKVxyXG5cclxuICAgIGlmKCghQHRydW1wQnJva2VuKSAmJiAgICAgICAgICAgICAgICAgICAgIyBFbnN1cmUgdGhhdCB0cnVtcCBpcyBicm9rZW5cclxuICAgIChAcGlsZS5sZW5ndGggPT0gMCkgJiYgICAgICAgICAgICAgICAgICAgIyBiZWZvcmUgYWxsb3dpbmcgc29tZW9uZSB0byBsZWFkXHJcbiAgICAoY2hvc2VuQ2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKSAmJiAgICAgICMgd2l0aCBzcGFkZXNcclxuICAgICghQHBsYXllckhhc09ubHlTcGFkZXMoY3VycmVudFBsYXllcikpKSAgIyB1bmxlc3MgaXQgaXMgYWxsIHRoZXkgaGF2ZVxyXG4gICAgICByZXR1cm4gJ3RydW1wTm90QnJva2VuJ1xyXG5cclxuICAgIGJlc3RJbmRleCA9IEBiZXN0SW5QaWxlKClcclxuICAgIGZvcmNlZFN1aXQgPSBAY3VycmVudFN1aXQoKVxyXG4gICAgaWYgZm9yY2VkU3VpdCAhPSBTdWl0Lk5PTkUgIyBzYWZlIHRvIGFzc3VtZSAoYmVzdEluZGV4ICE9IC0xKSBpbiB0aGlzIGJsb2NrXHJcbiAgICAgIGlmIEBwbGF5ZXJIYXNTdWl0KGN1cnJlbnRQbGF5ZXIsIGZvcmNlZFN1aXQpXHJcbiAgICAgICAgIyBZb3UgbXVzdCB0aHJvdyBpbi1zdWl0IGlmIHlvdSBoYXZlIG9uZSBvZiB0aGF0IHN1aXRcclxuICAgICAgICBpZiBjaG9zZW5DYXJkLnN1aXQgIT0gZm9yY2VkU3VpdFxyXG4gICAgICAgICAgcmV0dXJuICdmb3JjZWRJblN1aXQnXHJcblxyXG4gICAgICAgICMgSWYgdGhlIGN1cnJlbnQgd2lubmVyIGlzIHdpbm5pbmcgaW4tc3VpdCwgeW91IG11c3QgdHJ5IHRvIGJlYXQgdGhlbSBpbi1zdWl0XHJcbiAgICAgICAgY3VycmVudFdpbm5pbmdDYXJkWCA9IEBwaWxlW2Jlc3RJbmRleF1cclxuICAgICAgICBjdXJyZW50V2lubmluZ0NhcmQgPSBuZXcgQ2FyZChjdXJyZW50V2lubmluZ0NhcmRYKVxyXG4gICAgICAgIGlmIGN1cnJlbnRXaW5uaW5nQ2FyZC5zdWl0ID09IGZvcmNlZFN1aXRcclxuICAgICAgICAgIGlmKCghY2FyZEJlYXRzKGNob3NlbkNhcmRYLCBjdXJyZW50V2lubmluZ0NhcmRYLCBmb3JjZWRTdWl0KSkgJiZcclxuICAgICAgICAgIChAcGxheWVyQ2FuV2luSW5TdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRXaW5uaW5nQ2FyZCkpKVxyXG4gICAgICAgICAgICByZXR1cm4gJ2ZvcmNlZEhpZ2hlckluU3VpdCdcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgQ3VycmVudCBwbGF5ZXIgZG9lc24ndCBoYXZlIHRoYXQgc3VpdCwgZG9uJ3QgYm90aGVyXHJcbiAgICAgICAgZm9yY2VkU3VpdCA9IFN1aXQuTk9ORVxyXG5cclxuICAgIHJldHVybiBPS1xyXG5cclxuICBwbGF5OiAocGFyYW1zKSAtPlxyXG4gICAgY2FuUGxheUNhcmQgPSBAY2FuUGxheShwYXJhbXMpXHJcbiAgICBpZiBjYW5QbGF5Q2FyZCAhPSBPS1xyXG4gICAgICByZXR1cm4gY2FuUGxheUNhcmRcclxuXHJcbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxyXG5cclxuICAgIGlmIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnd2hpY2gnKVxyXG4gICAgICBwYXJhbXMud2hpY2ggPSBOdW1iZXIocGFyYW1zLndoaWNoKVxyXG4gICAgICBwYXJhbXMuaW5kZXggPSAtMVxyXG4gICAgICBmb3IgY2FyZCwgaSBpbiBjdXJyZW50UGxheWVyLmhhbmRcclxuICAgICAgICBpZiBjYXJkID09IHBhcmFtcy53aGljaFxyXG4gICAgICAgICAgcGFyYW1zLmluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGlmIHBhcmFtcy5pbmRleCA9PSAtMVxyXG4gICAgICAgIHJldHVybiAnZG9Ob3RIYXZlJ1xyXG4gICAgZWxzZVxyXG4gICAgICBwYXJhbXMuaW5kZXggPSBOdW1iZXIocGFyYW1zLmluZGV4KVxyXG5cclxuICAgIGNob3NlbkNhcmRYID0gY3VycmVudFBsYXllci5oYW5kW3BhcmFtcy5pbmRleF1cclxuICAgIGNob3NlbkNhcmQgPSBuZXcgQ2FyZChjaG9zZW5DYXJkWClcclxuXHJcbiAgICAjIElmIHlvdSBnZXQgaGVyZSwgeW91IGNhbiB0aHJvdyB3aGF0ZXZlciB5b3Ugd2FudCwgYW5kIGl0XHJcbiAgICAjIHdpbGwgZWl0aGVyIHB1dCB5b3UgaW4gdGhlIGxlYWQsIHRydW1wLCBvciBkdW1wLlxyXG5cclxuICAgIEBsb3dlc3RSZXF1aXJlZCA9IGZhbHNlXHJcblxyXG4gICAgIyBUaHJvdyB0aGUgY2FyZCBvbiB0aGUgcGlsZSwgYWR2YW5jZSB0aGUgdHVyblxyXG4gICAgQHBpbGUucHVzaChjdXJyZW50UGxheWVyLmhhbmRbcGFyYW1zLmluZGV4XSlcclxuICAgIEBwaWxlV2hvLnB1c2goQHR1cm4pXHJcbiAgICBjdXJyZW50UGxheWVyLmhhbmQuc3BsaWNlKHBhcmFtcy5pbmRleCwgMSlcclxuXHJcbiAgICAjIFJlY2FsY3VsYXRlIGJlc3QgaW5kZXhcclxuICAgIGJlc3RJbmRleCA9IEBiZXN0SW5QaWxlKClcclxuICAgIGlmIGJlc3RJbmRleCA9PSAoQHBpbGUubGVuZ3RoIC0gMSlcclxuICAgICAgIyBUaGUgY2FyZCB0aGlzIHBsYXllciBqdXN0IHRocmV3IGlzIHRoZSBiZXN0IGNhcmQuIENsYWltIHRoZSB0cmljay5cclxuICAgICAgQHRyaWNrVGFrZXIgPSBAdHVyblxyXG5cclxuICAgIGlmIEBwaWxlLmxlbmd0aCA9PSAxXHJcbiAgICAgIG1zZyA9IGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIGxlYWRzIHdpdGggXCIgKyBjaG9zZW5DYXJkLm5hbWVcclxuICAgIGVsc2VcclxuICAgICAgaWYgQHRyaWNrVGFrZXIgPT0gQHR1cm5cclxuICAgICAgICBtc2cgPSBjdXJyZW50UGxheWVyLm5hbWUgKyBcIiBjbGFpbXMgdGhlIHRyaWNrIHdpdGggXCIgKyBjaG9zZW5DYXJkLm5hbWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG1zZyA9IGN1cnJlbnRQbGF5ZXIubmFtZSArIFwiIGR1bXBzIFwiICsgY2hvc2VuQ2FyZC5uYW1lXHJcblxyXG4gICAgaWYoKCFAdHJ1bXBCcm9rZW4pICYmIChjaG9zZW5DYXJkLnN1aXQgPT0gU3VpdC5TUEFERVMpKVxyXG4gICAgICBtc2cgKz0gXCIgKHRydW1wIGJyb2tlbilcIlxyXG4gICAgICBAdHJ1bXBCcm9rZW4gPSB0cnVlXHJcblxyXG4gICAgQG91dHB1dChtc2cpXHJcblxyXG4gICAgaWYgQHBpbGUubGVuZ3RoID09IEBwbGF5ZXJzLmxlbmd0aFxyXG4gICAgICBAZW5kVHJpY2soKVxyXG4gICAgZWxzZVxyXG4gICAgICBAdHVybiA9IEBwbGF5ZXJBZnRlcihAdHVybilcclxuXHJcbiAgICByZXR1cm4gT0tcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEFJXHJcblxyXG4gICMgSGVscGVyIGZ1bmN0aW9uIHRvIGJpZCByZWFzb25pbmcgZm9yIGJpZGRpbmcgaSB0cmlja3NcclxuICBhaUxvZ0JpZDogKGksIHdoeSkgLT5cclxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXHJcbiAgICBpZiBub3QgY3VycmVudFBsYXllci5haVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBjYXJkID0gbmV3IENhcmQoY3VycmVudFBsYXllci5oYW5kW2ldKVxyXG4gICAgQGFpTG9nKCdwb3RlbnRpYWwgd2lubmVyOiAnICsgY2FyZC5uYW1lICsgJyBbJyArIHdoeSArICddJylcclxuXHJcbiAgIyBIZWxwZXIgZnVuY3Rpb24gdG8gYmlkIHJlYXNvbmluZyBmb3IgcGxheWluZyBjYXJkIGluZGV4IGlcclxuICBhaUxvZ1BsYXk6IChpLCB3aHkpIC0+XHJcbiAgICBpZiBpID09IC0xXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGN1cnJlbnRQbGF5ZXIgPSBAY3VycmVudFBsYXllcigpXHJcbiAgICBpZiBub3QgY3VycmVudFBsYXllci5haVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBjYXJkID0gbmV3IENhcmQoY3VycmVudFBsYXllci5oYW5kW2ldKVxyXG4gICAgQGFpTG9nKCdiZXN0UGxheTogJyArIGNhcmQubmFtZSArICcgWycgKyB3aHkgKyAnXScpXHJcblxyXG4gICMgQXR0ZW1wdHMgdG8gYmlkIGkgdHJpY2tzXHJcbiAgYWlCaWQ6IChjdXJyZW50UGxheWVyLCBpKSAtPlxyXG4gICAgcmVwbHkgPSBAYmlkKHsnaWQnOmN1cnJlbnRQbGF5ZXIuaWQsICdiaWQnOml9KVxyXG4gICAgaWYgcmVwbHkgPT0gT0tcclxuICAgICAgQGdhbWUubG9nKFwiQUk6IFwiICsgY3VycmVudFBsYXllci5uYW1lICsgXCIgYmlkcyBcIiArIFN0cmluZyhpKSlcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIEF0dGVtcHRzIHRvIHBsYXkgY2FyZCBpbmRleCBpXHJcbiAgYWlQbGF5OiAoY3VycmVudFBsYXllciwgaSkgLT5cclxuICAgIGNhcmQgPSBuZXcgQ2FyZChjdXJyZW50UGxheWVyLmhhbmRbaV0pXHJcbiAgICAjIEBnYW1lLmxvZyBcImFpUGxheTogI3tpfVwiXHJcbiAgICByZXBseSA9IEBwbGF5KHsnaWQnOmN1cnJlbnRQbGF5ZXIuaWQsICdpbmRleCc6aX0pXHJcbiAgICBpZiByZXBseSA9PSBPS1xyXG4gICAgICBAZ2FtZS5sb2coXCJBSTogXCIgKyBjdXJyZW50UGxheWVyLm5hbWUgKyBcIiBwbGF5cyBcIiArIGNhcmQubmFtZSlcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIGVsc2VcclxuICAgICAgaWYgcmVwbHkgPT0gJ2RlYWxlckZ1Y2tlZCdcclxuICAgICAgICBAb3V0cHV0KGN1cnJlbnRQbGF5ZXIubmFtZSArICcgc2F5cyBcIkkgaGF0ZSBiZWluZyB0aGUgZGVhbGVyLlwiJylcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIFRyaWVzIHRvIHBsYXkgbG93ZXN0IGNhcmRzIGZpcnN0IChtb3ZlcyByaWdodClcclxuICBhaVBsYXlMb3c6IChjdXJyZW50UGxheWVyLCBzdGFydGluZ1BvaW50KSAtPlxyXG4gICAgZm9yIGkgaW4gW3N0YXJ0aW5nUG9pbnQuLi5jdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoXVxyXG4gICAgICBpZiBAYWlQbGF5KGN1cnJlbnRQbGF5ZXIsIGkpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIGZvciBpIGluIFswLi4uc3RhcnRpbmdQb2ludF1cclxuICAgICAgaWYgQGFpUGxheShjdXJyZW50UGxheWVyLCBpKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyBUcmllcyB0byBwbGF5IGhpZ2hlc3QgY2FyZHMgZmlyc3QgKG1vdmVzIGxlZnQpXHJcbiAgYWlQbGF5SGlnaDogKGN1cnJlbnRQbGF5ZXIsIHN0YXJ0aW5nUG9pbnQpIC0+XHJcbiAgICBmb3IgaSBpbiBbc3RhcnRpbmdQb2ludC4uMF0gYnkgLTFcclxuICAgICAgaWYoQGFpUGxheShjdXJyZW50UGxheWVyLCBpKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgZm9yIGkgaW4gW2N1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGgtMS4uLnN0YXJ0aW5nUG9pbnRdIGJ5IC0xXHJcbiAgICAgIGlmIEBhaVBsYXkoY3VycmVudFBsYXllciwgaSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMgR2VuZXJpYyBsb2dnaW5nIGZ1bmN0aW9uOyBwcmVwZW5kcyBjdXJyZW50IEFJIHBsYXllcidzIGd1dHMgYmVmb3JlIHByaW50aW5nIHRleHRcclxuICBhaUxvZzogKHRleHQpIC0+XHJcbiAgICBjdXJyZW50UGxheWVyID0gQGN1cnJlbnRQbGF5ZXIoKVxyXG4gICAgaWYgbm90IGN1cnJlbnRQbGF5ZXIuYWlcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2N1cnJlbnRQbGF5ZXIuY2hhcklEXVxyXG4gICAgQGdhbWUubG9nKCdBSVsnK2N1cnJlbnRQbGF5ZXIubmFtZSsnICcrY3VycmVudFBsYXllci50cmlja3MrJy8nK2N1cnJlbnRQbGF5ZXIuYmlkKycgJytjaGFyYWN0ZXIuYnJhaW4rJ106IGhhbmQ6JytzdHJpbmdpZnlDYXJkcyhjdXJyZW50UGxheWVyLmhhbmQpKycgcGlsZTonK3N0cmluZ2lmeUNhcmRzKEBwaWxlKSsnICcrdGV4dClcclxuXHJcbiAgIyBEZXRlY3RzIGlmIHRoZSBjdXJyZW50IHBsYXllciBpcyBBSSBkdXJpbmcgYSBCSUQgb3IgVFJJQ0sgcGhhc2UgYW5kIGFjdHMgYWNjb3JkaW5nIHRvIHRoZWlyICdicmFpbidcclxuICBhaVRpY2s6IC0+XHJcbiAgICBpZiAoQHN0YXRlICE9IFN0YXRlLkJJRCkgJiYgKEBzdGF0ZSAhPSBTdGF0ZS5UUklDSylcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgY3VycmVudFBsYXllciA9IEBjdXJyZW50UGxheWVyKClcclxuICAgIGlmIG5vdCBjdXJyZW50UGxheWVyLmFpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIEJpZGRpbmdcclxuXHJcbiAgICBpZiBAc3RhdGUgPT0gU3RhdGUuQklEXHJcbiAgICAgIEBhaUxvZyhcImFib3V0IHRvIGNhbGwgYnJhaW4uYmlkXCIpXHJcbiAgICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1tjdXJyZW50UGxheWVyLmNoYXJJRF1cclxuICAgICAgYmlkID0gQGJyYWluc1tjaGFyYWN0ZXIuYnJhaW5dLmJpZC5hcHBseSh0aGlzLCBbY3VycmVudFBsYXllcl0pXHJcblxyXG4gICAgICAjIFRyeSB0byBiaWQgYXMgY2xvc2UgYXMgeW91IGNhbiB0byB0aGUgJ2Jlc3QgYmlkJ1xyXG4gICAgICBAYWlMb2coJ2JpZDonK1N0cmluZyhiaWQpKVxyXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIGlmIEBhaUJpZChjdXJyZW50UGxheWVyLCBiaWQtMSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICBpZiBAYWlCaWQoY3VycmVudFBsYXllciwgYmlkKzEpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgaWYgQGFpQmlkKGN1cnJlbnRQbGF5ZXIsIGJpZC0yKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIGlmIEBhaUJpZChjdXJyZW50UGxheWVyLCBiaWQrMilcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgIyBHaXZlIHVwIGFuZCBiaWQgd2hhdGV2ZXIgaXMgYWxsb3dlZFxyXG4gICAgICBmb3IgaSBpbiBbMC4uLmN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGhdXHJcbiAgICAgICAgaWYgQGFpQmlkKGN1cnJlbnRQbGF5ZXIsIGkpXHJcbiAgICAgICAgICBAYWlMb2coJ2dhdmUgdXAgYW5kIGJpZDonK1N0cmluZyhpKSlcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICMgUGxheWluZ1xyXG5cclxuICAgIGlmIEBzdGF0ZSA9PSBTdGF0ZS5UUklDS1xyXG4gICAgICBAYWlMb2coXCJhYm91dCB0byBjYWxsIGJyYWluLnBsYXlcIilcclxuICAgICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2N1cnJlbnRQbGF5ZXIuY2hhcklEXVxyXG4gICAgICBwbGF5ZWRDYXJkID0gQGJyYWluc1tjaGFyYWN0ZXIuYnJhaW5dLnBsYXkuYXBwbHkodGhpcywgW2N1cnJlbnRQbGF5ZXJdKVxyXG4gICAgICBpZiBwbGF5ZWRDYXJkXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBhaUxvZygnYnJhaW4gZmFpbGVkIHRvIHBsYXkgY2FyZDogcGlja2luZyByYW5kb20gY2FyZCB0byBwbGF5JylcclxuICAgICAgICBzdGFydGluZ1BvaW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudFBsYXllci5oYW5kLmxlbmd0aClcclxuICAgICAgICByZXR1cm4gQGFpUGxheUxvdyhjdXJyZW50UGxheWVyLCBzdGFydGluZ1BvaW50KVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIyBBSSBCcmFpbnNcclxuXHJcbiAgIyBCcmFpbnMgbXVzdCBoYXZlOlxyXG4gICMgKiBpZDogaW50ZXJuYWwgaWRlbnRpZmllciBmb3IgdGhlIGJyYWluXHJcbiAgIyAqIG5hbWU6IHByZXR0eSBuYW1lXHJcbiAgIyAqIGJpZChjdXJyZW50UGxheWVyKSByZXR1cm5zIHRoZSBiaWQgdmFsdWUgYmV0d2VlbiBbMCAtIGhhbmRTaXplXS5cclxuICAjICogcGxheShjdXJyZW50UGxheWVyKSBhdHRlbXB0cyB0byBwbGF5IGEgY2FyZCBieSBjYWxsaW5nIGFpUGxheSgpLiBTaG91bGQgcmV0dXJuIHRydWUgaWYgaXQgc3VjY2Vzc2Z1bGx5IHBsYXllZCBhIGNhcmQgKGFpUGxheSgpIHJldHVybmVkIHRydWUpXHJcbiAgYnJhaW5zOlxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIE5vcm1hbDogSW50ZW5kZWQgdG8gYmUgdXNlZCBieSBtb3N0IGNoYXJhY3RlcnMuXHJcbiAgICAjICAgICAgICAgTm90IHRvbyBkdW1iLCBub3QgdG9vIHNtYXJ0LlxyXG4gICAgbm9ybWFsOlxyXG4gICAgICBpZDogICBcIm5vcm1hbFwiXHJcbiAgICAgIG5hbWU6IFwiTm9ybWFsXCJcclxuXHJcbiAgICAgICMgbm9ybWFsXHJcbiAgICAgIGJpZDogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgIyBDYXJkcyBSZXByZXNlbnRlZCAoaG93IG1hbnkgb3V0IG9mIHRoZSBkZWNrIGFyZSBpbiBwbGF5PylcclxuICAgICAgICBoYW5kU2l6ZSA9IGN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGhcclxuICAgICAgICBjciA9IEBwbGF5ZXJzLmxlbmd0aCAqIGhhbmRTaXplXHJcbiAgICAgICAgI2NycCA9IE1hdGguZmxvb3IoKGNyICogMTAwKSAvIDUyKVxyXG5cclxuICAgICAgICBiaWQgPSAwXHJcbiAgICAgICAgcGFydGlhbFNwYWRlcyA9IDBcclxuICAgICAgICBwYXJ0aWFsRmFjZXMgPSAwICMgbm9uIHNwYWRlIGZhY2UgY2FyZHNcclxuICAgICAgICBmb3IgdiwgaSBpbiBjdXJyZW50UGxheWVyLmhhbmRcclxuICAgICAgICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgICAgICAgaWYgY2FyZC5zdWl0ID09IFN1aXQuU1BBREVTXHJcbiAgICAgICAgICAgIGlmIGNyID4gNDAgIyBBbG1vc3QgYWxsIGNhcmRzIGluIHBsYXlcclxuICAgICAgICAgICAgICBpZiBjYXJkLnZhbHVlID49IDYgIyA4UyBvciBoaWdoZXJcclxuICAgICAgICAgICAgICAgIGJpZCsrXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJzhTIG9yIGJpZ2dlcicpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHBhcnRpYWxTcGFkZXMrK1xyXG4gICAgICAgICAgICAgICAgaWYgcGFydGlhbFNwYWRlcyA+IDFcclxuICAgICAgICAgICAgICAgICAgYmlkKytcclxuICAgICAgICAgICAgICAgICAgQGFpTG9nQmlkKGksICdhIGNvdXBsZSBvZiBsb3cgc3BhZGVzJylcclxuICAgICAgICAgICAgICAgICAgcGFydGlhbFNwYWRlcyA9IDBcclxuICAgICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIGJpZCsrXHJcbiAgICAgICAgICAgICAgQGFpTG9nQmlkKGksICdzcGFkZScpXHJcbiAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgKGNhcmQudmFsdWUgPj0gOSkgJiYgKGNhcmQudmFsdWUgPD0gMTEpICMgSlFLIG9mIG5vbiBzcGFkZVxyXG4gICAgICAgICAgICAgIHBhcnRpYWxGYWNlcysrXHJcbiAgICAgICAgICAgICAgaWYgcGFydGlhbEZhY2VzID4gMlxyXG4gICAgICAgICAgICAgICAgcGFydGlhbEZhY2VzID0gMFxyXG4gICAgICAgICAgICAgICAgQGFpTG9nQmlkKGksICdhIGNvdXBsZSBKUUsgbm9uLXNwYWRlcycpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgICAgIGlmIGNyID4gNDBcclxuICAgICAgICAgICAgIyAqIEFjZXMgYW5kIEtpbmdzIGFyZSBwcm9iYWJseSB3aW5uZXJzXHJcbiAgICAgICAgICAgIGlmKChjYXJkLnZhbHVlID49IDExKSAmJiAgICMgQWNlIG9yIEtpbmdcclxuICAgICAgICAgICAgKGNhcmQuc3VpdCAhPSBTdWl0LkNMVUJTKSkgIyBOb3QgYSBjbHViXHJcbiAgICAgICAgICAgICAgYmlkKytcclxuICAgICAgICAgICAgICBAYWlMb2dCaWQoaSwgJ25vbi1jbHViIGFjZSBvciBraW5nJylcclxuICAgICAgICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgICBpZiBoYW5kU2l6ZSA+PSA2XHJcbiAgICAgICAgICAjICogVGhlIEFjZSBvZiBjbHVicyBpcyBhIHdpbm5lciB1bmxlc3MgeW91IGFsc28gaGF2ZSBhIGxvdyBjbHViXHJcbiAgICAgICAgICBjbHViVmFsdWVzID0gdmFsdWVzT2ZTdWl0KGN1cnJlbnRQbGF5ZXIuaGFuZCwgU3VpdC5DTFVCUylcclxuICAgICAgICAgIGlmIGNsdWJWYWx1ZXMubGVuZ3RoID4gMCAjIGhhcyBjbHVic1xyXG4gICAgICAgICAgICBpZiBjbHViVmFsdWVzW2NsdWJWYWx1ZXMubGVuZ3RoIC0gMV0gPT0gMTIgIyBoYXMgQUNcclxuICAgICAgICAgICAgICBpZiBjbHViVmFsdWVzWzBdID4gMCAjIDJDIG5vdCBpbiBoYW5kXHJcbiAgICAgICAgICAgICAgICBiaWQrK1xyXG4gICAgICAgICAgICAgICAgQGFpTG9nQmlkKDAsICdBQyB3aXRoIG5vIDJDJylcclxuXHJcbiAgICAgICAgcmV0dXJuIGJpZFxyXG5cclxuICAgICAgIyBub3JtYWxcclxuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgdHJpY2tzTmVlZGVkID0gY3VycmVudFBsYXllci5iaWQgLSBjdXJyZW50UGxheWVyLnRyaWNrc1xyXG4gICAgICAgIHdhbnRUb1dpbiA9ICh0cmlja3NOZWVkZWQgPiAwKVxyXG4gICAgICAgIGJlc3RQbGF5ID0gLTFcclxuICAgICAgICBjdXJyZW50U3VpdCA9IEBjdXJyZW50U3VpdCgpXHJcbiAgICAgICAgd2lubmluZ0luZGV4ID0gQGJlc3RJblBpbGUoKVxyXG5cclxuICAgICAgICBpZiBAcGlsZS5sZW5ndGggPT0gQHBsYXllcnMubGVuZ3RoXHJcbiAgICAgICAgICBjdXJyZW50U3VpdCA9IFN1aXQuTk9ORVxyXG4gICAgICAgICAgd2lubmluZ0luZGV4ID0gLTFcclxuXHJcbiAgICAgICAgd2lubmluZ0NhcmQgPSBmYWxzZVxyXG4gICAgICAgIGlmIHdpbm5pbmdJbmRleCAhPSAtMVxyXG4gICAgICAgICAgd2lubmluZ0NhcmQgPSBuZXcgQ2FyZChAcGlsZVt3aW5uaW5nSW5kZXhdKVxyXG5cclxuICAgICAgICBpZiB3YW50VG9XaW5cclxuICAgICAgICAgIGlmIGN1cnJlbnRTdWl0ID09IFN1aXQuTk9ORSAjIEFyZSB5b3UgbGVhZGluZz9cclxuICAgICAgICAgICAgIyBMZWFkIHdpdGggeW91ciBoaWdoZXN0IG5vbi1zcGFkZVxyXG4gICAgICAgICAgICBwbGF5ID0gaGlnaGVzdFZhbHVlTm9uU3BhZGVJbmRleChjdXJyZW50UGxheWVyLmhhbmQsIFN1aXQuTk9ORSlcclxuICAgICAgICAgICAgQGFpTG9nUGxheShwbGF5LCAnaGlnaGVzdCBub24tc3BhZGUgKHRyeWluZyB0byB3aW4pJylcclxuXHJcbiAgICAgICAgICAgIGlmIGJlc3RQbGF5ID09IC0xXHJcbiAgICAgICAgICAgICAgIyBPbmx5IHNwYWRlcyBsZWZ0ISBUaW1lIHRvIGJsZWVkIHRoZSB0YWJsZS5cclxuICAgICAgICAgICAgICBiZXN0UGxheSA9IDBcclxuICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnbG93ZXN0IHNwYWRlICh0cnlpbmcgdG8gd2luIGJsZWVkaW5nIHRoZSB0YWJsZSBmb3IgYSBmdXR1cmUgd2luKScpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIEBwbGF5ZXJIYXNTdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRTdWl0KSAjIEFyZSB5b3Ugc3R1Y2sgd2l0aCBmb3JjZWQgcGxheT9cclxuICAgICAgICAgICAgICBpZiBAcGxheWVyQ2FuV2luSW5TdWl0KGN1cnJlbnRQbGF5ZXIsIHdpbm5pbmdDYXJkKSAjIENhbiB5b3Ugd2luP1xyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBoaWdoZXN0SW5kZXhJblN1aXQoY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZC5zdWl0KVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2hpZ2hlc3QgaW4gc3VpdCAodHJ5aW5nIHRvIHdpbiBmb3JjZWQgaW4gc3VpdCknKVxyXG4gICAgICAgICAgICAgICAgaWYgYmVzdFBsYXkgIT0gLTFcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIEBhaVBsYXlIaWdoKGN1cnJlbnRQbGF5ZXIsIGJlc3RQbGF5KVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGJlc3RQbGF5ID0gbG93ZXN0SW5kZXhJblN1aXQoY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZC5zdWl0KVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2xvd2VzdCBpbiBzdWl0ICh0cnlpbmcgdG8gd2luIGZvcmNlZCBpbiBzdWl0LCBjYW50IHdpbiknKVxyXG4gICAgICAgICAgICAgICAgaWYgYmVzdFBsYXkgIT0gLTFcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIEBhaVBsYXlMb3coY3VycmVudFBsYXllciwgYmVzdFBsYXkpXHJcblxyXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxyXG4gICAgICAgICAgICAgIGxhc3RDYXJkID0gbmV3IENhcmQoY3VycmVudFBsYXllci5oYW5kW2N1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGggLSAxXSlcclxuICAgICAgICAgICAgICBpZiBsYXN0Q2FyZC5zdWl0ID09IFN1aXQuU1BBREVTXHJcbiAgICAgICAgICAgICAgICAjIFRyeSB0byB0cnVtcCwgaGFyZFxyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ3RydW1wICh0cnlpbmcgdG8gd2luKScpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgIyBObyBtb3JlIHNwYWRlcyBsZWZ0IGFuZCBub25lIG9mIHRoaXMgc3VpdC4gRHVtcCB5b3VyIGxvd2VzdCBjYXJkLlxyXG4gICAgICAgICAgICAgICAgYmVzdFBsYXkgPSBsb3dlc3RWYWx1ZUluZGV4KGN1cnJlbnRQbGF5ZXIuaGFuZCwgU3VpdC5OT05FKVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2R1bXAgKHRyeWluZyB0byB3aW4sIHRocm93aW5nIGxvd2VzdCknKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgUGxhbjogVHJ5IHRvIGR1bXAgc29tZXRoaW5nIGF3ZXNvbWVcclxuXHJcbiAgICAgICAgICBpZiBjdXJyZW50U3VpdCA9PSBTdWl0Lk5PTkUgIyBBcmUgeW91IGxlYWRpbmc/XHJcbiAgICAgICAgICAgICMgTGVhZCB3aXRoIHlvdXIgbG93ZXN0IHZhbHVlICh0cnkgdG8gbm90IHRocm93IGEgc3BhZGUgaWYgeW91IGNhbiBoZWxwIGl0KVxyXG4gICAgICAgICAgICBiZXN0UGxheSA9IGxvd2VzdFZhbHVlSW5kZXgoY3VycmVudFBsYXllci5oYW5kLCBTdWl0LlNQQURFUylcclxuICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2xvd2VzdCB2YWx1ZSAodHJ5aW5nIHRvIGxvc2UgYXZvaWRpbmcgc3BhZGVzKScpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIEBwbGF5ZXJIYXNTdWl0KGN1cnJlbnRQbGF5ZXIsIGN1cnJlbnRTdWl0KSAjIEFyZSB5b3Ugc3R1Y2sgd2l0aCBmb3JjZWQgcGxheT9cclxuICAgICAgICAgICAgICBpZiBAcGxheWVyQ2FuV2luSW5TdWl0KGN1cnJlbnRQbGF5ZXIsIHdpbm5pbmdDYXJkKSAjIEFyZSB5b3Ugc3R1Y2sgd2lubmluZz9cclxuICAgICAgICAgICAgICAgIGJlc3RQbGF5ID0gbG93ZXN0SW5kZXhJblN1aXQoY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZC5zdWl0KVxyXG4gICAgICAgICAgICAgICAgQGFpTG9nUGxheShiZXN0UGxheSwgJ2xvd2VzdCBpbiBzdWl0ICh0cnlpbmcgdG8gbG9zZSBmb3JjZWQgdG8gd2luKScpXHJcbiAgICAgICAgICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gQGFpUGxheUxvdyhjdXJyZW50UGxheWVyLCBiZXN0UGxheSlcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBiZXN0UGxheSA9IGhpZ2hlc3RJbmRleEluU3VpdChjdXJyZW50UGxheWVyLmhhbmQsIHdpbm5pbmdDYXJkLnN1aXQpXHJcbiAgICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAnaGlnaGVzdCBpbiBzdWl0ICh0cnlpbmcgdG8gbG9zZSBmb3JjZWQgaW4gc3VpdCwgYnV0IGNhbnQgd2luKScpXHJcbiAgICAgICAgICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gQGFpUGxheUhpZ2goY3VycmVudFBsYXllciwgYmVzdFBsYXkpXHJcblxyXG4gICAgICAgICAgICBpZiBiZXN0UGxheSA9PSAtMVxyXG4gICAgICAgICAgICAgICMgVHJ5IHRvIGR1bXAgeW91ciBoaWdoZXN0IHNwYWRlLCBpZiB5b3UgY2FuIHRocm93IGFueXRoaW5nXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTdWl0ICE9IFN1aXQuU1BBREVTKSAmJiAod2lubmluZ0NhcmQuc3VpdCA9PSBTdWl0LlNQQURFUylcclxuICAgICAgICAgICAgICAgICMgQ3VycmVudCB3aW5uZXIgaXMgdHJ1bXBpbmcgdGhlIHN1aXQuIFRocm93IHlvdXIgaGlnaGVzdCBzcGFkZSBsb3dlciB0aGFuIHRoZSB3aW5uZXJcclxuICAgICAgICAgICAgICAgIGJlc3RQbGF5ID0gaGlnaGVzdFZhbHVlSW5kZXhJblN1aXRMb3dlclRoYW4oY3VycmVudFBsYXllci5oYW5kLCB3aW5uaW5nQ2FyZClcclxuICAgICAgICAgICAgICAgIEBhaUxvZ1BsYXkoYmVzdFBsYXksICd0cnlpbmcgdG8gbG9zZSBoaWdoZXN0IGR1bXBhYmxlIHNwYWRlJylcclxuXHJcbiAgICAgICAgICAgIGlmIGJlc3RQbGF5ID09IC0xXHJcbiAgICAgICAgICAgICAgIyBUcnkgdG8gZHVtcCB5b3VyIGhpZ2hlc3Qgbm9uLXNwYWRlXHJcbiAgICAgICAgICAgICAgYmVzdFBsYXkgPSBoaWdoZXN0VmFsdWVOb25TcGFkZUluZGV4KGN1cnJlbnRQbGF5ZXIuaGFuZCwgd2lubmluZ0NhcmQuc3VpdClcclxuICAgICAgICAgICAgICBAYWlMb2dQbGF5KGJlc3RQbGF5LCAndHJ5aW5nIHRvIGxvc2UgaGlnaGVzdCBkdW1wYWJsZSBub24tc3BhZGUnKVxyXG5cclxuICAgICAgICBpZiBiZXN0UGxheSAhPSAtMVxyXG4gICAgICAgICAgaWYoQGFpUGxheShjdXJyZW50UGxheWVyLCBiZXN0UGxheSkpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIEBhaUxvZygnbm90IGFsbG93ZWQgdG8gcGxheSBteSBiZXN0IHBsYXknKVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBDaGFvczogQ29tcGxldGVseSByYW5kb20uIFByb2JhYmx5IGF3ZnVsIHRvIHBsYXkgYWdhaW5zdC5cclxuICAgIGNoYW9zOlxyXG4gICAgICBpZDogICBcImNoYW9zXCJcclxuICAgICAgbmFtZTogXCJDaGFvc1wiXHJcblxyXG4gICAgICAjIGNoYW9zXHJcbiAgICAgIGJpZDogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgIyBwaWNrIGEgYmlkIHNvbWV3aGVyZSBpbiB0aGUgZmlyc3QgNTAlXHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRQbGF5ZXIuaGFuZC5sZW5ndGggKiAwLjUpXHJcblxyXG4gICAgICAjIGNoYW9zXHJcbiAgICAgIHBsYXk6IChjdXJyZW50UGxheWVyKSAtPlxyXG4gICAgICAgIGxlZ2FsSW5kaWNlcyA9IFtdXHJcbiAgICAgICAgZm9yIHYsIGkgaW4gY3VycmVudFBsYXllci5oYW5kXHJcbiAgICAgICAgICBjYW5QbGF5Q2FyZCA9IEBjYW5QbGF5KHsgaWQ6IGN1cnJlbnRQbGF5ZXIuaWQsIGluZGV4OiBpIH0pXHJcbiAgICAgICAgICBpZiBjYW5QbGF5Q2FyZCA9PSBPS1xyXG4gICAgICAgICAgICBsZWdhbEluZGljZXMucHVzaCBpXHJcbiAgICAgICAgICAjIGVsc2VcclxuICAgICAgICAgICMgICBAYWlMb2cgXCJjYW5QbGF5Q2FyZCAje2l9IHJldHVybmVkICN7Y2FuUGxheUNhcmR9XCJcclxuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlZ2FsSW5kaWNlcy5sZW5ndGgpXHJcbiAgICAgICAgQGFpTG9nIFwibGVnYWwgaW5kaWNlczogI3tKU09OLnN0cmluZ2lmeShsZWdhbEluZGljZXMpfSwgY2hvb3NpbmcgaW5kZXggI3tsZWdhbEluZGljZXNbcmFuZG9tSW5kZXhdfVwiXHJcbiAgICAgICAgcmV0dXJuIEBhaVBsYXkoY3VycmVudFBsYXllciwgbGVnYWxJbmRpY2VzW3JhbmRvbUluZGV4XSlcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBDb25zZXJ2YXRpdmUgTW9yb246IEJpZHMgc3BhZGUgY291bnQsIGFuZCBwbGF5cyBsb3cgY2FyZHMuXHJcbiAgICBjb25zZXJ2YXRpdmVNb3JvbjpcclxuICAgICAgaWQ6ICAgXCJjb25zZXJ2YXRpdmVNb3JvblwiXHJcbiAgICAgIG5hbWU6IFwiQ29uc2VydmF0aXZlIE1vcm9uXCJcclxuXHJcbiAgICAgICMgY29uc2VydmF0aXZlTW9yb25cclxuICAgICAgYmlkOiAoY3VycmVudFBsYXllcikgLT5cclxuICAgICAgICBiaWQgPSAwXHJcbiAgICAgICAgZm9yIHYgaW4gY3VycmVudFBsYXllci5oYW5kXHJcbiAgICAgICAgICBjYXJkID0gbmV3IENhcmQodilcclxuICAgICAgICAgIGJpZCsrIGlmIGNhcmQuc3VpdCA9PSBTdWl0LlNQQURFU1xyXG4gICAgICAgIEBhaUxvZyBcIkkgYW0gYSBtb3JvbiBhbmQgSSBoYXZlICN7YmlkfSBzcGFkZXMuIExldCdzIHJvbGwgd2l0aCBpdC5cIlxyXG4gICAgICAgIHJldHVybiBiaWRcclxuXHJcbiAgICAgICMgY29uc2VydmF0aXZlTW9yb25cclxuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgQGFpTG9nIFwicGxheWluZyBsb3dlc3QgcG9zc2libGUgY2FyZFwiXHJcbiAgICAgICAgcmV0dXJuIEBhaVBsYXlMb3coY3VycmVudFBsYXllciwgMClcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBBZ2dyZXNzaXZlIE1vcm9uOiBCaWRzIHNwYWRlcyBhbmQgYWNlcywgYW5kIHBsYXlzIGhpZ2ggY2FyZHMuXHJcbiAgICBhZ2dyZXNzaXZlTW9yb246XHJcbiAgICAgIGlkOiAgIFwiYWdncmVzc2l2ZU1vcm9uXCJcclxuICAgICAgbmFtZTogXCJBZ2dyZXNzaXZlIE1vcm9uXCJcclxuXHJcbiAgICAgICMgYWdncmVzc2l2ZU1vcm9uXHJcbiAgICAgIGJpZDogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgYmlkID0gMFxyXG4gICAgICAgIGZvciB2IGluIGN1cnJlbnRQbGF5ZXIuaGFuZFxyXG4gICAgICAgICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICAgICAgICBiaWQrKyBpZiAoY2FyZC5zdWl0ID09IFN1aXQuU1BBREVTKSBvciAoY2FyZC52YWx1ZSA9PSAxMilcclxuICAgICAgICBAYWlMb2cgXCJJIGFtIGEgbW9yb24gYW5kIEkgaGF2ZSAje2JpZH0gc3BhZGVzIGFuZC9vciBhY2VzLiBGYXJ0LlwiXHJcbiAgICAgICAgcmV0dXJuIGJpZFxyXG5cclxuICAgICAgIyBhZ2dyZXNzaXZlTW9yb25cclxuICAgICAgcGxheTogKGN1cnJlbnRQbGF5ZXIpIC0+XHJcbiAgICAgICAgQGFpTG9nIFwicGxheWluZyBoaWdoZXN0IHBvc3NpYmxlIGNhcmRcIlxyXG4gICAgICAgIHJldHVybiBAYWlQbGF5SGlnaChjdXJyZW50UGxheWVyLCBjdXJyZW50UGxheWVyLmhhbmQubGVuZ3RoIC0gMSlcclxuXHJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgQUkgY2FyZCBoZWxwZXJzXHJcblxyXG52YWx1ZXNPZlN1aXQgPSAoaGFuZCwgc3VpdCkgLT5cclxuICB2YWx1ZXMgPSBbXVxyXG4gIGZvciB2IGluIGhhbmRcclxuICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgaWYgY2FyZC5zdWl0ID09IHN1aXRcclxuICAgICAgdmFsdWVzLnB1c2goY2FyZC52YWx1ZSlcclxuICByZXR1cm4gdmFsdWVzXHJcblxyXG5zdHJpbmdpZnlDYXJkcyA9IChjYXJkcykgLT5cclxuICB0ID0gJydcclxuICBmb3IgdiBpbiBjYXJkc1xyXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICBpZih0KVxyXG4gICAgICB0ICs9ICcsJ1xyXG4gICAgdCArPSBjYXJkLm5hbWVcclxuXHJcbiAgcmV0dXJuICdbJyt0KyddJ1xyXG5cclxubG93ZXN0SW5kZXhJblN1aXQgPSAoaGFuZCwgc3VpdCkgLT5cclxuICBmb3IgdixpIGluIGhhbmRcclxuICAgIGNhcmQgPSBuZXcgQ2FyZCh2KVxyXG4gICAgaWYgY2FyZC5zdWl0ID09IHN1aXRcclxuICAgICAgcmV0dXJuIGlcclxuICByZXR1cm4gLTFcclxuXHJcbmhpZ2hlc3RJbmRleEluU3VpdCA9IChoYW5kLCBzdWl0KSAtPlxyXG4gIGZvciB2LGkgaW4gaGFuZCBieSAtMVxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKHYpXHJcbiAgICBpZiBjYXJkLnN1aXQgPT0gc3VpdFxyXG4gICAgICByZXR1cm4gaVxyXG4gIHJldHVybiAtMVxyXG5cclxubG93ZXN0VmFsdWVJbmRleCA9IChoYW5kLCBhdm9pZFN1aXQpIC0+ICMgdXNlIFN1aXQuTk9ORSB0byByZXR1cm4gYW55IHN1aXRcclxuICBjYXJkID0gbmV3IENhcmQoaGFuZFswXSlcclxuICBsb3dlc3RJbmRleCA9IDBcclxuICBsb3dlc3RWYWx1ZSA9IGNhcmQudmFsdWVcclxuICBmb3IgaSBpbiBbMS4uLmhhbmQubGVuZ3RoXVxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKGhhbmRbaV0pXHJcbiAgICBpZiBjYXJkLnN1aXQgIT0gYXZvaWRTdWl0XHJcbiAgICAgIGlmIGNhcmQudmFsdWUgPCBsb3dlc3RWYWx1ZVxyXG4gICAgICAgIGxvd2VzdFZhbHVlID0gY2FyZC52YWx1ZVxyXG4gICAgICAgIGxvd2VzdEluZGV4ID0gaVxyXG4gIHJldHVybiBsb3dlc3RJbmRleFxyXG5cclxuaGlnaGVzdFZhbHVlTm9uU3BhZGVJbmRleCA9IChoYW5kLCBhdm9pZFN1aXQpIC0+XHJcbiAgaGlnaGVzdEluZGV4ID0gLTFcclxuICBoaWdoZXN0VmFsdWUgPSAtMVxyXG4gIGZvciBpIGluIFtoYW5kLmxlbmd0aC0xLi4wXSBieSAtMVxyXG4gICAgY2FyZCA9IG5ldyBDYXJkKGhhbmRbaV0pXHJcbiAgICBpZiAoY2FyZC5zdWl0ICE9IGF2b2lkU3VpdCkgJiYgKGNhcmQuc3VpdCAhPSBTdWl0LlNQQURFUylcclxuICAgICAgaWYgY2FyZC52YWx1ZSA+IGhpZ2hlc3RWYWx1ZVxyXG4gICAgICAgIGhpZ2hlc3RWYWx1ZSA9IGNhcmQudmFsdWVcclxuICAgICAgICBoaWdoZXN0SW5kZXggPSBpXHJcbiAgcmV0dXJuIGhpZ2hlc3RJbmRleFxyXG5cclxuaGlnaGVzdFZhbHVlSW5kZXhJblN1aXRMb3dlclRoYW4gPSAoaGFuZCwgd2lubmluZ0NhcmQpIC0+XHJcbiAgZm9yIGkgaW4gW2hhbmQubGVuZ3RoLTEuLjBdIGJ5IC0xXHJcbiAgICBjYXJkID0gbmV3IENhcmQoaGFuZFtpXSlcclxuICAgIGlmIChjYXJkLnN1aXQgPT0gd2lubmluZ0NhcmQuc3VpdCkgJiYgKGNhcmQudmFsdWUgPCB3aW5uaW5nQ2FyZC52YWx1ZSlcclxuICAgICAgcmV0dXJuIGlcclxuICByZXR1cm4gLTFcclxuXHJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiMgRXhwb3J0c1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIENhcmQ6IENhcmRcclxuICBCbGFja291dDogQmxhY2tvdXRcclxuICBTdGF0ZTogU3RhdGVcclxuICBPSzogT0tcclxuICBhaUNoYXJhY3RlcnM6IGFpQ2hhcmFjdGVyc1xyXG5cclxuIiwiQW5pbWF0aW9uID0gcmVxdWlyZSAnLi9BbmltYXRpb24nXHJcblxyXG5jbGFzcyBCdXR0b25cclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAc3ByaXRlTmFtZXMsIEBmb250LCBAdGV4dEhlaWdodCwgQHgsIEB5LCBAY2IpIC0+XHJcbiAgICBAYW5pbSA9IG5ldyBBbmltYXRpb24ge1xyXG4gICAgICBzcGVlZDogeyBzOiAzIH1cclxuICAgICAgczogMFxyXG4gICAgfVxyXG4gICAgQGNvbG9yID0geyByOiAxLCBnOiAxLCBiOiAxLCBhOiAwIH1cclxuXHJcbiAgdXBkYXRlOiAoZHQpIC0+XHJcbiAgICByZXR1cm4gQGFuaW0udXBkYXRlKGR0KVxyXG5cclxuICByZW5kZXI6IC0+XHJcbiAgICBAY29sb3IuYSA9IEBhbmltLmN1ci5zXHJcbiAgICBAZ2FtZS5zcHJpdGVSZW5kZXJlci5yZW5kZXIgQHNwcml0ZU5hbWVzWzBdLCBAeCwgQHksIDAsIEB0ZXh0SGVpZ2h0ICogMS41LCAwLCAwLjUsIDAuNSwgQGdhbWUuY29sb3JzLndoaXRlLCA9PlxyXG4gICAgICAjIHB1bHNlIGJ1dHRvbiBhbmltLFxyXG4gICAgICBAYW5pbS5jdXIucyA9IDFcclxuICAgICAgQGFuaW0ucmVxLnMgPSAwXHJcbiAgICAgICMgdGhlbiBjYWxsIGNhbGxiYWNrXHJcbiAgICAgIEBjYih0cnVlKVxyXG4gICAgQGdhbWUuc3ByaXRlUmVuZGVyZXIucmVuZGVyIEBzcHJpdGVOYW1lc1sxXSwgQHgsIEB5LCAwLCBAdGV4dEhlaWdodCAqIDEuNSwgMCwgMC41LCAwLjUsIEBjb2xvclxyXG4gICAgdGV4dCA9IEBjYihmYWxzZSlcclxuICAgIEBnYW1lLmZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIEB0ZXh0SGVpZ2h0LCB0ZXh0LCBAeCwgQHksIDAuNSwgMC41LCBAZ2FtZS5jb2xvcnMuYnV0dG9udGV4dFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b25cclxuIiwiZm9udG1ldHJpY3MgPSByZXF1aXJlICcuL2ZvbnRtZXRyaWNzJ1xyXG5cclxuIyB0YWtlbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiXHJcbmhleFRvUmdiID0gKGhleCwgYSkgLT5cclxuICAgIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpXHJcbiAgICByZXR1cm4gbnVsbCBpZiBub3QgcmVzdWx0XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpIC8gMjU1LFxyXG4gICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpIC8gMjU1LFxyXG4gICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpIC8gMjU1XHJcbiAgICAgICAgYTogYVxyXG4gICAgfVxyXG5cclxuY2xhc3MgRm9udFJlbmRlcmVyXHJcbiAgY29uc3RydWN0b3I6ICAoQGdhbWUpIC0+XHJcbiAgICBAd2hpdGUgPSB7IHI6IDEsIGc6IDEsIGI6IDEsIGE6IDEgfVxyXG5cclxuICBzaXplOiAoZm9udCwgaGVpZ2h0LCBzdHIpIC0+XHJcbiAgICBtZXRyaWNzID0gZm9udG1ldHJpY3NbZm9udF1cclxuICAgIHJldHVybiBpZiBub3QgbWV0cmljc1xyXG4gICAgc2NhbGUgPSBoZWlnaHQgLyBtZXRyaWNzLmhlaWdodFxyXG5cclxuICAgIHRvdGFsV2lkdGggPSAwXHJcbiAgICB0b3RhbEhlaWdodCA9IG1ldHJpY3MuaGVpZ2h0ICogc2NhbGVcclxuICAgIGZvciBjaCwgaSBpbiBzdHJcclxuICAgICAgY29kZSA9IGNoLmNoYXJDb2RlQXQoMClcclxuICAgICAgZ2x5cGggPSBtZXRyaWNzLmdseXBoc1tjb2RlXVxyXG4gICAgICBjb250aW51ZSBpZiBub3QgZ2x5cGhcclxuICAgICAgdG90YWxXaWR0aCArPSBnbHlwaC54YWR2YW5jZSAqIHNjYWxlXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdzogdG90YWxXaWR0aFxyXG4gICAgICBoOiB0b3RhbEhlaWdodFxyXG4gICAgfVxyXG5cclxuICByZW5kZXI6IChmb250LCBoZWlnaHQsIHN0ciwgeCwgeSwgYW5jaG9yeCwgYW5jaG9yeSwgY29sb3IsIGNiKSAtPlxyXG4gICAgbWV0cmljcyA9IGZvbnRtZXRyaWNzW2ZvbnRdXHJcbiAgICByZXR1cm4gaWYgbm90IG1ldHJpY3NcclxuICAgIHNjYWxlID0gaGVpZ2h0IC8gbWV0cmljcy5oZWlnaHRcclxuXHJcbiAgICB0b3RhbFdpZHRoID0gMFxyXG4gICAgdG90YWxIZWlnaHQgPSBtZXRyaWNzLmhlaWdodCAqIHNjYWxlXHJcbiAgICBza2lwQ29sb3IgPSBmYWxzZVxyXG4gICAgZm9yIGNoLCBpIGluIHN0clxyXG4gICAgICBpZiBjaCA9PSAnYCdcclxuICAgICAgICBza2lwQ29sb3IgPSAhc2tpcENvbG9yXHJcbiAgICAgIGNvbnRpbnVlIGlmIHNraXBDb2xvclxyXG4gICAgICBjb2RlID0gY2guY2hhckNvZGVBdCgwKVxyXG4gICAgICBnbHlwaCA9IG1ldHJpY3MuZ2x5cGhzW2NvZGVdXHJcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBnbHlwaFxyXG4gICAgICB0b3RhbFdpZHRoICs9IGdseXBoLnhhZHZhbmNlICogc2NhbGVcclxuXHJcbiAgICBhbmNob3JPZmZzZXRYID0gLTEgKiBhbmNob3J4ICogdG90YWxXaWR0aFxyXG4gICAgYW5jaG9yT2Zmc2V0WSA9IC0xICogYW5jaG9yeSAqIHRvdGFsSGVpZ2h0XHJcbiAgICBjdXJyWCA9IHhcclxuXHJcbiAgICBpZiBjb2xvclxyXG4gICAgICBzdGFydGluZ0NvbG9yID0gY29sb3JcclxuICAgIGVsc2VcclxuICAgICAgc3RhcnRpbmdDb2xvciA9IEB3aGl0ZVxyXG4gICAgY3VycmVudENvbG9yID0gc3RhcnRpbmdDb2xvclxyXG5cclxuICAgIGNvbG9yU3RhcnQgPSAtMVxyXG4gICAgZm9yIGNoLCBpIGluIHN0clxyXG4gICAgICBpZiBjaCA9PSAnYCdcclxuICAgICAgICBpZiBjb2xvclN0YXJ0ID09IC0xXHJcbiAgICAgICAgICBjb2xvclN0YXJ0ID0gaSArIDFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBsZW4gPSBpIC0gY29sb3JTdGFydFxyXG4gICAgICAgICAgaWYgbGVuXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2xvciA9IGhleFRvUmdiKHN0ci5zdWJzdHIoY29sb3JTdGFydCwgaSAtIGNvbG9yU3RhcnQpLCBzdGFydGluZ0NvbG9yLmEpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2xvciA9IHN0YXJ0aW5nQ29sb3JcclxuICAgICAgICAgIGNvbG9yU3RhcnQgPSAtMVxyXG5cclxuICAgICAgY29udGludWUgaWYgY29sb3JTdGFydCAhPSAtMVxyXG4gICAgICBjb2RlID0gY2guY2hhckNvZGVBdCgwKVxyXG4gICAgICBnbHlwaCA9IG1ldHJpY3MuZ2x5cGhzW2NvZGVdXHJcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBnbHlwaFxyXG4gICAgICBAZ2FtZS5kcmF3SW1hZ2UgZm9udCxcclxuICAgICAgZ2x5cGgueCwgZ2x5cGgueSwgZ2x5cGgud2lkdGgsIGdseXBoLmhlaWdodCxcclxuICAgICAgY3VyclggKyAoZ2x5cGgueG9mZnNldCAqIHNjYWxlKSArIGFuY2hvck9mZnNldFgsIHkgKyAoZ2x5cGgueW9mZnNldCAqIHNjYWxlKSArIGFuY2hvck9mZnNldFksIGdseXBoLndpZHRoICogc2NhbGUsIGdseXBoLmhlaWdodCAqIHNjYWxlLFxyXG4gICAgICAwLCAwLCAwLFxyXG4gICAgICBjdXJyZW50Q29sb3IuciwgY3VycmVudENvbG9yLmcsIGN1cnJlbnRDb2xvci5iLCBjdXJyZW50Q29sb3IuYSwgY2JcclxuICAgICAgY3VyclggKz0gZ2x5cGgueGFkdmFuY2UgKiBzY2FsZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb250UmVuZGVyZXJcclxuIiwiQW5pbWF0aW9uID0gcmVxdWlyZSAnLi9BbmltYXRpb24nXHJcbkJ1dHRvbiA9IHJlcXVpcmUgJy4vQnV0dG9uJ1xyXG5Gb250UmVuZGVyZXIgPSByZXF1aXJlICcuL0ZvbnRSZW5kZXJlcidcclxuU3ByaXRlUmVuZGVyZXIgPSByZXF1aXJlICcuL1Nwcml0ZVJlbmRlcmVyJ1xyXG5NZW51ID0gcmVxdWlyZSAnLi9NZW51J1xyXG5IYW5kID0gcmVxdWlyZSAnLi9IYW5kJ1xyXG5QaWxlID0gcmVxdWlyZSAnLi9QaWxlJ1xyXG57QmxhY2tvdXQsIFN0YXRlLCBPSywgYWlDaGFyYWN0ZXJzfSA9IHJlcXVpcmUgJy4vQmxhY2tvdXQnXHJcblxyXG4jIHRlbXBcclxuQlVJTERfVElNRVNUQU1QID0gXCIwLjAuMVwiXHJcblxyXG5jbGFzcyBHYW1lXHJcbiAgY29uc3RydWN0b3I6IChAbmF0aXZlLCBAd2lkdGgsIEBoZWlnaHQpIC0+XHJcbiAgICBAdmVyc2lvbiA9IEJVSUxEX1RJTUVTVEFNUFxyXG4gICAgQGxvZyhcIkdhbWUgY29uc3RydWN0ZWQ6ICN7QHdpZHRofXgje0BoZWlnaHR9XCIpXHJcbiAgICBAZm9udFJlbmRlcmVyID0gbmV3IEZvbnRSZW5kZXJlciB0aGlzXHJcbiAgICBAc3ByaXRlUmVuZGVyZXIgPSBuZXcgU3ByaXRlUmVuZGVyZXIgdGhpc1xyXG4gICAgQGZvbnQgPSBcImRhcmtmb3Jlc3RcIlxyXG4gICAgQHpvbmVzID0gW11cclxuICAgIEBuZXh0QUlUaWNrID0gMTAwMCAjIHdpbGwgYmUgc2V0IGJ5IG9wdGlvbnNcclxuICAgIEBjZW50ZXIgPVxyXG4gICAgICB4OiBAd2lkdGggLyAyXHJcbiAgICAgIHk6IEBoZWlnaHQgLyAyXHJcbiAgICBAYWFIZWlnaHQgPSBAd2lkdGggKiA5IC8gMTZcclxuICAgIEBsb2cgXCJoZWlnaHQ6ICN7QGhlaWdodH0uIGhlaWdodCBpZiBzY3JlZW4gd2FzIDE2OjkgKGFzcGVjdCBhZGp1c3RlZCk6ICN7QGFhSGVpZ2h0fVwiXHJcbiAgICBAcGF1c2VCdXR0b25TaXplID0gQGFhSGVpZ2h0IC8gMTVcclxuICAgIEBjb2xvcnMgPVxyXG4gICAgICB3aGl0ZTogICAgICB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XHJcbiAgICAgIGJsYWNrOiAgICAgIHsgcjogICAwLCBnOiAgIDAsIGI6ICAgMCwgYTogICAxIH1cclxuICAgICAgcmVkOiAgICAgICAgeyByOiAgIDEsIGc6ICAgMCwgYjogICAwLCBhOiAgIDEgfVxyXG4gICAgICBvcmFuZ2U6ICAgICB7IHI6ICAgMSwgZzogMC41LCBiOiAgIDAsIGE6ICAgMSB9XHJcbiAgICAgIGdvbGQ6ICAgICAgIHsgcjogICAxLCBnOiAgIDEsIGI6ICAgMCwgYTogICAxIH1cclxuICAgICAgYnV0dG9udGV4dDogeyByOiAgIDEsIGc6ICAgMSwgYjogICAxLCBhOiAgIDEgfVxyXG4gICAgICBsaWdodGdyYXk6ICB7IHI6IDAuNSwgZzogMC41LCBiOiAwLjUsIGE6ICAgMSB9XHJcbiAgICAgIGJhY2tncm91bmQ6IHsgcjogICAwLCBnOiAwLjIsIGI6ICAgMCwgYTogICAxIH1cclxuICAgICAgbG9nYmc6ICAgICAgeyByOiAwLjEsIGc6ICAgMCwgYjogICAwLCBhOiAgIDEgfVxyXG4gICAgICBhcnJvdzogICAgICB7IHI6ICAgMSwgZzogICAxLCBiOiAgIDEsIGE6ICAgMSB9XHJcbiAgICAgIGFycm93Y2xvc2U6IHsgcjogICAxLCBnOiAwLjUsIGI6ICAgMCwgYTogMC4zIH1cclxuICAgICAgaGFuZGFyZWE6ICAgeyByOiAgIDAsIGc6IDAuMSwgYjogICAwLCBhOiAxLjAgfVxyXG4gICAgICBvdmVybGF5OiAgICB7IHI6ICAgMCwgZzogICAwLCBiOiAgIDAsIGE6IDAuNiB9XHJcbiAgICAgIG1haW5tZW51OiAgIHsgcjogMC4xLCBnOiAwLjEsIGI6IDAuMSwgYTogICAxIH1cclxuICAgICAgcGF1c2VtZW51OiAgeyByOiAwLjEsIGc6IDAuMCwgYjogMC4xLCBhOiAgIDEgfVxyXG4gICAgICBiaWQ6ICAgICAgICB7IHI6ICAgMCwgZzogMC42LCBiOiAgIDAsIGE6ICAgMSB9XHJcblxyXG4gICAgQHRleHR1cmVzID1cclxuICAgICAgXCJjYXJkc1wiOiAwXHJcbiAgICAgIFwiZGFya2ZvcmVzdFwiOiAxXHJcbiAgICAgIFwiY2hhcnNcIjogMlxyXG4gICAgICBcImhvd3RvMVwiOiAzXHJcbiAgICAgIFwiaG93dG8yXCI6IDRcclxuICAgICAgXCJob3d0bzNcIjogNVxyXG5cclxuICAgIEBibGFja291dCA9IG51bGwgIyBkb24ndCBzdGFydCBpbiBhIGdhbWVcclxuICAgIEBsYXN0RXJyID0gJydcclxuICAgIEBwYXVzZWQgPSBmYWxzZVxyXG4gICAgQGhvd3RvID0gMFxyXG4gICAgQHJlbmRlckNvbW1hbmRzID0gW11cclxuXHJcbiAgICBAYmlkID0gMFxyXG4gICAgQGJpZEJ1dHRvblNpemUgPSBAYWFIZWlnaHQgLyA4XHJcbiAgICBAYmlkVGV4dFNpemUgPSBAYWFIZWlnaHQgLyA2XHJcbiAgICBiaWRCdXR0b25EaXN0YW5jZSA9IEBiaWRCdXR0b25TaXplICogM1xyXG4gICAgQGJpZEJ1dHRvblkgPSBAY2VudGVyLnkgLSAoQGJpZEJ1dHRvblNpemUpXHJcbiAgICBAYmlkVUkgPSAjKEBnYW1lLCBAc3ByaXRlTmFtZXMsIEBmb250LCBAdGV4dEhlaWdodCwgQHgsIEB5LCBAdGV4dCwgQGNiKVxyXG4gICAgICBtaW51czogbmV3IEJ1dHRvbiB0aGlzLCBbJ21pbnVzMCcsICdtaW51czEnXSwgQGZvbnQsIEBiaWRCdXR0b25TaXplLCBAY2VudGVyLnggLSBiaWRCdXR0b25EaXN0YW5jZSwgQGJpZEJ1dHRvblksIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQGFkanVzdEJpZCgtMSlcclxuICAgICAgICByZXR1cm4gJydcclxuICAgICAgcGx1czogIG5ldyBCdXR0b24gdGhpcywgWydwbHVzMCcsICdwbHVzMSddLCAgIEBmb250LCBAYmlkQnV0dG9uU2l6ZSwgQGNlbnRlci54ICsgYmlkQnV0dG9uRGlzdGFuY2UsIEBiaWRCdXR0b25ZLCAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBhZGp1c3RCaWQoMSlcclxuICAgICAgICByZXR1cm4gJydcclxuXHJcbiAgICBAb3B0aW9uTWVudXMgPVxyXG4gICAgICByb3VuZHM6IFtcclxuICAgICAgICB7IHRleHQ6IFwiOCByb3VuZHMgb2YgMTNcIiwgZGF0YTogXCIxM3wxM3wxM3wxM3wxM3wxM3wxM3wxM1wiIH1cclxuICAgICAgICB7IHRleHQ6IFwiNCByb3VuZHMgb2YgMTNcIiwgZGF0YTogXCIxM3wxM3wxM3wxM1wiIH1cclxuICAgICAgICB7IHRleHQ6IFwiMyB0byAxM1wiLCBkYXRhOiBcIjN8NHw1fDZ8N3w4fDl8MTB8MTF8MTJ8MTNcIiB9XHJcbiAgICAgICAgeyB0ZXh0OiBcIjMgdG8gMTMgYnkgb2Rkc1wiLCBkYXRhOiBcIjN8NXw3fDl8MTF8MTNcIiB9XHJcbiAgICAgICAgeyB0ZXh0OiBcIk1hcmF0aG9uXCIsIGRhdGE6IFwiTVwiIH1cclxuICAgICAgXVxyXG4gICAgICBzcGVlZHM6IFtcclxuICAgICAgICB7IHRleHQ6IFwiQUkgU3BlZWQ6IFNsb3dcIiwgc3BlZWQ6IDIwMDAgfVxyXG4gICAgICAgIHsgdGV4dDogXCJBSSBTcGVlZDogTWVkaXVtXCIsIHNwZWVkOiAxMDAwIH1cclxuICAgICAgICB7IHRleHQ6IFwiQUkgU3BlZWQ6IEZhc3RcIiwgc3BlZWQ6IDUwMCB9XHJcbiAgICAgICAgeyB0ZXh0OiBcIkFJIFNwZWVkOiBVbHRyYVwiLCBzcGVlZDogMjUwIH1cclxuICAgICAgXVxyXG4gICAgQG9wdGlvbnMgPVxyXG4gICAgICBwbGF5ZXJzOiA0XHJcbiAgICAgIHJvdW5kSW5kZXg6IDBcclxuICAgICAgc3BlZWRJbmRleDogMVxyXG4gICAgICBzb3VuZDogdHJ1ZVxyXG5cclxuICAgIEBtYWluTWVudSA9IG5ldyBNZW51IHRoaXMsIFwiQmxhY2tvdXQhXCIsIFwic29saWRcIiwgQGNvbG9ycy5tYWlubWVudSwgW1xyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBob3d0byA9IDFcclxuICAgICAgICByZXR1cm4gXCJIb3cgVG8gUGxheVwiXHJcbiAgICAgIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQG9wdGlvbnMucm91bmRJbmRleCA9IChAb3B0aW9ucy5yb3VuZEluZGV4ICsgMSkgJSBAb3B0aW9uTWVudXMucm91bmRzLmxlbmd0aFxyXG4gICAgICAgIHJldHVybiBAb3B0aW9uTWVudXMucm91bmRzW0BvcHRpb25zLnJvdW5kSW5kZXhdLnRleHRcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAb3B0aW9ucy5wbGF5ZXJzKytcclxuICAgICAgICAgIGlmIEBvcHRpb25zLnBsYXllcnMgPiA0XHJcbiAgICAgICAgICAgIEBvcHRpb25zLnBsYXllcnMgPSAzXHJcbiAgICAgICAgcmV0dXJuIFwiI3tAb3B0aW9ucy5wbGF5ZXJzfSBQbGF5ZXJzXCJcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAb3B0aW9ucy5zcGVlZEluZGV4ID0gKEBvcHRpb25zLnNwZWVkSW5kZXggKyAxKSAlIEBvcHRpb25NZW51cy5zcGVlZHMubGVuZ3RoXHJcbiAgICAgICAgcmV0dXJuIEBvcHRpb25NZW51cy5zcGVlZHNbQG9wdGlvbnMuc3BlZWRJbmRleF0udGV4dFxyXG4gICAgICAjIChjbGljaykgPT5cclxuICAgICAgIyAgIGlmIGNsaWNrXHJcbiAgICAgICMgICAgIEBvcHRpb25zLnNvdW5kID0gIUBvcHRpb25zLnNvdW5kXHJcbiAgICAgICMgICByZXR1cm4gXCJTb3VuZDogI3tpZiBAb3B0aW9ucy5zb3VuZCB0aGVuIFwiRW5hYmxlZFwiIGVsc2UgXCJEaXNhYmxlZFwifVwiXHJcbiAgICAgIChjbGljaykgPT5cclxuICAgICAgICBpZiBjbGlja1xyXG4gICAgICAgICAgQG5ld0dhbWUoKVxyXG4gICAgICAgIHJldHVybiBcIlN0YXJ0XCJcclxuICAgIF1cclxuXHJcbiAgICBAcGF1c2VNZW51ID0gbmV3IE1lbnUgdGhpcywgXCJQYXVzZWRcIiwgXCJzb2xpZFwiLCBAY29sb3JzLnBhdXNlbWVudSwgW1xyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBwYXVzZWQgPSBmYWxzZVxyXG4gICAgICAgIHJldHVybiBcIlJlc3VtZSBHYW1lXCJcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAaG93dG8gPSAxXHJcbiAgICAgICAgcmV0dXJuIFwiSG93IFRvIFBsYXlcIlxyXG4gICAgICAoY2xpY2spID0+XHJcbiAgICAgICAgaWYgY2xpY2tcclxuICAgICAgICAgIEBvcHRpb25zLnNwZWVkSW5kZXggPSAoQG9wdGlvbnMuc3BlZWRJbmRleCArIDEpICUgQG9wdGlvbk1lbnVzLnNwZWVkcy5sZW5ndGhcclxuICAgICAgICByZXR1cm4gQG9wdGlvbk1lbnVzLnNwZWVkc1tAb3B0aW9ucy5zcGVlZEluZGV4XS50ZXh0XHJcbiAgICAgICMgKGNsaWNrKSA9PlxyXG4gICAgICAjICAgaWYgY2xpY2tcclxuICAgICAgIyAgICAgQG9wdGlvbnMuc291bmQgPSAhQG9wdGlvbnMuc291bmRcclxuICAgICAgIyAgIHJldHVybiBcIlNvdW5kOiAje2lmIEBvcHRpb25zLnNvdW5kIHRoZW4gXCJFbmFibGVkXCIgZWxzZSBcIkRpc2FibGVkXCJ9XCJcclxuICAgICAgKGNsaWNrKSA9PlxyXG4gICAgICAgIGlmIGNsaWNrXHJcbiAgICAgICAgICBAYmxhY2tvdXQgPSBudWxsXHJcbiAgICAgICAgICBAcGF1c2VkID0gZmFsc2VcclxuICAgICAgICByZXR1cm4gXCJRdWl0IEdhbWVcIlxyXG4gICAgXVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBsb2dnaW5nXHJcblxyXG4gIGxvZzogKHMpIC0+XHJcbiAgICBAbmF0aXZlLmxvZyhzKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBsb2FkIC8gc2F2ZVxyXG5cclxuICBsb2FkOiAoanNvbikgLT5cclxuICAgIEBsb2cgXCIoQ1MpIGxvYWRpbmcgc3RhdGVcIlxyXG4gICAgdHJ5XHJcbiAgICAgIHN0YXRlID0gSlNPTi5wYXJzZSBqc29uXHJcbiAgICBjYXRjaFxyXG4gICAgICBAbG9nIFwibG9hZCBmYWlsZWQgdG8gcGFyc2Ugc3RhdGU6ICN7anNvbn1cIlxyXG4gICAgICByZXR1cm5cclxuICAgIGlmIHN0YXRlLm9wdGlvbnNcclxuICAgICAgZm9yIGssIHYgb2Ygc3RhdGUub3B0aW9uc1xyXG4gICAgICAgIEBvcHRpb25zW2tdID0gdlxyXG5cclxuICAgIGlmIHN0YXRlLmJsYWNrb3V0XHJcbiAgICAgIEBsb2cgXCJyZWNyZWF0aW5nIGdhbWUgZnJvbSBzYXZlZGF0YVwiXHJcbiAgICAgIEBibGFja291dCA9IG5ldyBCbGFja291dCB0aGlzLCB7XHJcbiAgICAgICAgc3RhdGU6IHN0YXRlLmJsYWNrb3V0XHJcbiAgICAgIH1cclxuICAgICAgQHByZXBhcmVHYW1lKClcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgICMgQGxvZyBcIihDUykgc2F2aW5nIHN0YXRlXCJcclxuICAgIHN0YXRlID0ge1xyXG4gICAgICBvcHRpb25zOiBAb3B0aW9uc1xyXG4gICAgfVxyXG4gICAgaWYgQGJsYWNrb3V0P1xyXG4gICAgICBzdGF0ZS5ibGFja291dCA9IEBibGFja291dC5zYXZlKClcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSBzdGF0ZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGFpVGlja1JhdGU6IC0+XHJcbiAgICByZXR1cm4gQG9wdGlvbk1lbnVzLnNwZWVkc1tAb3B0aW9ucy5zcGVlZEluZGV4XS5zcGVlZFxyXG5cclxuICBuZXdHYW1lOiAtPlxyXG4gICAgQGJsYWNrb3V0ID0gbmV3IEJsYWNrb3V0IHRoaXMsIHtcclxuICAgICAgcm91bmRzOiBAb3B0aW9uTWVudXMucm91bmRzW0BvcHRpb25zLnJvdW5kSW5kZXhdLmRhdGFcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdQbGF5ZXInIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gICAgZm9yIHAgaW4gWzEuLi5Ab3B0aW9ucy5wbGF5ZXJzXVxyXG4gICAgICBAYmxhY2tvdXQuYWRkQUkoKVxyXG4gICAgQGxvZyBcIm5leHQ6IFwiICsgQGJsYWNrb3V0Lm5leHQoKVxyXG4gICAgQGxvZyBcInBsYXllciAwJ3MgaGFuZDogXCIgKyBKU09OLnN0cmluZ2lmeShAYmxhY2tvdXQucGxheWVyc1swXS5oYW5kKVxyXG5cclxuICAgIEBwcmVwYXJlR2FtZSgpXHJcblxyXG4gIHByZXBhcmVHYW1lOiAtPlxyXG4gICAgQGhhbmQgPSBuZXcgSGFuZCB0aGlzXHJcbiAgICBAcGlsZSA9IG5ldyBQaWxlIHRoaXMsIEBoYW5kXHJcbiAgICBAaGFuZC5zZXQgQGJsYWNrb3V0LnBsYXllcnNbMF0uaGFuZFxyXG5cclxuICBtYWtlSGFuZDogKGluZGV4KSAtPlxyXG4gICAgZm9yIHYgaW4gWzAuLi4xM11cclxuICAgICAgaWYgdiA9PSBpbmRleFxyXG4gICAgICAgIEBoYW5kW3ZdID0gMTNcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBoYW5kW3ZdID0gdlxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBpbnB1dCBoYW5kbGluZ1xyXG5cclxuICB0b3VjaERvd246ICh4LCB5KSAtPlxyXG4gICAgIyBAbG9nKFwidG91Y2hEb3duICN7eH0sI3t5fVwiKVxyXG4gICAgQGNoZWNrWm9uZXMoeCwgeSlcclxuXHJcbiAgdG91Y2hNb3ZlOiAoeCwgeSkgLT5cclxuICAgICMgQGxvZyhcInRvdWNoTW92ZSAje3h9LCN7eX1cIilcclxuICAgIGlmIEBibGFja291dCAhPSBudWxsXHJcbiAgICAgIEBoYW5kLm1vdmUoeCwgeSlcclxuXHJcbiAgdG91Y2hVcDogKHgsIHkpIC0+XHJcbiAgICAjIEBsb2coXCJ0b3VjaFVwICN7eH0sI3t5fVwiKVxyXG4gICAgaWYgQGJsYWNrb3V0ICE9IG51bGxcclxuICAgICAgQGhhbmQudXAoeCwgeSlcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgYmlkIGhhbmRsaW5nXHJcblxyXG4gIGFkanVzdEJpZDogKGFtb3VudCkgLT5cclxuICAgIHJldHVybiBpZiBAYmxhY2tvdXQgPT0gbnVsbFxyXG4gICAgQGJpZCA9IEBiaWQgKyBhbW91bnRcclxuICAgIGlmIEBiaWQgPCAwXHJcbiAgICAgIEBiaWQgPSAwXHJcbiAgICBpZiBAYmlkID4gQGJsYWNrb3V0LnRyaWNrc1xyXG4gICAgICBAYmlkID0gQGJsYWNrb3V0LnRyaWNrc1xyXG5cclxuICBhdHRlbXB0QmlkOiAtPlxyXG4gICAgcmV0dXJuIGlmIEBibGFja291dCA9PSBudWxsXHJcbiAgICBAYWRqdXN0QmlkKDApXHJcbiAgICBpZiBAYmxhY2tvdXQuc3RhdGUgPT0gU3RhdGUuQklEXHJcbiAgICAgIGlmIEBibGFja291dC50dXJuID09IDBcclxuICAgICAgICBAbG9nIFwiYmlkZGluZyAje0BiaWR9XCJcclxuICAgICAgICBAbGFzdEVyciA9IEBibGFja291dC5iaWQge1xyXG4gICAgICAgICAgaWQ6IDFcclxuICAgICAgICAgIGJpZDogQGJpZFxyXG4gICAgICAgICAgYWk6IGZhbHNlXHJcbiAgICAgICAgfVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBoZWFkbGluZSAoZ2FtZSBzdGF0ZSBpbiB0b3AgbGVmdClcclxuXHJcbiAgcHJldHR5RXJyb3JUYWJsZToge1xyXG4gICAgYmlkT3V0T2ZSYW5nZTogICAgICBcIllvdSBhcmUgc29tZWhvdyBiaWRkaW5nIGFuIGltcG9zc2libGUgdmFsdWUuIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXHJcbiAgICBkZWFsZXJGdWNrZWQ6ICAgICAgIFwiRGVhbGVyIHJlc3RyaWN0aW9uOiBZb3UgbWF5IG5vdCBtYWtlIHRvdGFsIGJpZHMgbWF0Y2ggdG90YWwgdHJpY2tzLlwiXHJcbiAgICBkb05vdEhhdmU6ICAgICAgICAgIFwiWW91IGFyZSBzb21laG93IGF0dGVtcHRpbmcgdG8gcGxheSBhIGNhcmQgeW91IGRvbid0IG93bi4gVGhlIGdhbWUgbXVzdCBiZSBicm9rZW4uXCJcclxuICAgIGZvcmNlZEhpZ2hlckluU3VpdDogXCJZb3UgaGF2ZSBhIGhpZ2hlciB2YWx1ZSBpbiB0aGUgbGVhZCBzdWl0LiBZb3UgbXVzdCBwbGF5IGl0LiAoUnVsZSAyKVwiXHJcbiAgICBmb3JjZWRJblN1aXQ6ICAgICAgIFwiWW91IGhhdmUgYXQgbGVhc3Qgb25lIG9mIHRoZSBsZWFkIHN1aXQuIFlvdSBtdXN0IHBsYXkgaXQuIChSdWxlIDEpXCJcclxuICAgIGdhbWVPdmVyOiAgICAgICAgICAgXCJUaGUgZ2FtZSBpcyBvdmVyLiAgVGhlIGdhbWUgbXVzdCBiZSBicm9rZW4uXCJcclxuICAgIGluZGV4T3V0T2ZSYW5nZTogICAgXCJZb3UgZG9uJ3QgaGF2ZSB0aGF0IGluZGV4LiBUaGUgZ2FtZSBtdXN0IGJlIGJyb2tlbi5cIlxyXG4gICAgbG93ZXN0Q2FyZFJlcXVpcmVkOiBcIllvdSBtdXN0IHN0YXJ0IHRoZSByb3VuZCB3aXRoIHRoZSBsb3dlc3QgY2FyZCB5b3UgaGF2ZS5cIlxyXG4gICAgbmV4dElzQ29uZnVzZWQ6ICAgICBcIkludGVyYWwgZXJyb3IuIFRoZSBnYW1lIG11c3QgYmUgYnJva2VuLlwiXHJcbiAgICBub05leHQ6ICAgICAgICAgICAgIFwiSW50ZXJhbCBlcnJvci4gVGhlIGdhbWUgbXVzdCBiZSBicm9rZW4uXCJcclxuICAgIG5vdEJpZGRpbmdOb3c6ICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBiaWQgZHVyaW5nIHRoZSB3cm9uZyBwaGFzZS5cIlxyXG4gICAgbm90RW5vdWdoUGxheWVyczogICBcIkNhbm5vdCBzdGFydCB0aGUgZ2FtZSB3aXRob3V0IG1vcmUgcGxheWVycy5cIlxyXG4gICAgbm90SW5UcmljazogICAgICAgICBcIllvdSBhcmUgdHJ5aW5nIHRvIHBsYXkgYSBjYXJkIGR1cmluZyB0aGUgd3JvbmcgcGhhc2UuXCJcclxuICAgIG5vdFlvdXJUdXJuOiAgICAgICAgXCJJdCBpc24ndCB5b3VyIHR1cm4uXCJcclxuICAgIHRydW1wTm90QnJva2VuOiAgICAgXCJUcnVtcCBpc24ndCBicm9rZW4geWV0LiBMZWFkIHdpdGggYSBub24tc3BhZGUuXCJcclxuICB9XHJcblxyXG4gIHByZXR0eUVycm9yOiAtPlxyXG4gICAgcHJldHR5ID0gQHByZXR0eUVycm9yVGFibGVbQGxhc3RFcnJdXHJcbiAgICByZXR1cm4gcHJldHR5IGlmIHByZXR0eVxyXG4gICAgcmV0dXJuIEBsYXN0RXJyXHJcblxyXG4gIGNhbGNIZWFkbGluZTogLT5cclxuICAgIHJldHVybiBcIlwiIGlmIEBibGFja291dCA9PSBudWxsXHJcblxyXG4gICAgaGVhZGxpbmUgPSBcIlwiXHJcbiAgICBzd2l0Y2ggQGJsYWNrb3V0LnN0YXRlXHJcbiAgICAgIHdoZW4gU3RhdGUuQklEXHJcbiAgICAgICAgaGVhZGxpbmUgPSBcIldhaXRpbmcgZm9yIGBmZjc3MDBgI3tAYmxhY2tvdXQucGxheWVyc1tAYmxhY2tvdXQudHVybl0ubmFtZX1gYCB0byBgZmZmZjAwYGJpZGBgXCJcclxuICAgICAgd2hlbiBTdGF0ZS5UUklDS1xyXG4gICAgICAgIGhlYWRsaW5lID0gXCJXYWl0aW5nIGZvciBgZmY3NzAwYCN7QGJsYWNrb3V0LnBsYXllcnNbQGJsYWNrb3V0LnR1cm5dLm5hbWV9YGAgdG8gYGZmZmYwMGBwbGF5YGBcIlxyXG4gICAgICB3aGVuIFN0YXRlLlJPVU5EU1VNTUFSWVxyXG4gICAgICAgIGhlYWRsaW5lID0gXCJXYWl0aW5nIGZvciBuZXh0IHJvdW5kLi4uXCJcclxuICAgICAgd2hlbiBTdGF0ZS5QT1NUR0FNRVNVTU1BUllcclxuICAgICAgICBoZWFkbGluZSA9IFwiR2FtZSBvdmVyIVwiXHJcblxyXG4gICAgZXJyVGV4dCA9IFwiXCJcclxuICAgIGlmIChAbGFzdEVyci5sZW5ndGggPiAwKSBhbmQgKEBsYXN0RXJyICE9IE9LKVxyXG4gICAgICBlcnJUZXh0ID0gXCIgIEVSUk9SOiBgZmYwMDAwYCN7QHByZXR0eUVycm9yKCl9XCJcclxuICAgICAgaGVhZGxpbmUgKz0gZXJyVGV4dFxyXG5cclxuICAgIHJldHVybiBoZWFkbGluZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBnYW1lIG92ZXIgaW5mb3JtYXRpb25cclxuXHJcbiAgZ2FtZU92ZXJUZXh0OiAtPlxyXG4gICAgcmV0dXJuIFtcIkdhbWUgT3ZlciFcIl0gaWYgQGJsYWNrb3V0ID09IG51bGxcclxuXHJcbiAgICBpZiBAYmxhY2tvdXQubWFyYXRob25Nb2RlKClcclxuICAgICAgcmV0dXJuIFtcIk1hcmF0aG9uIG92ZXIhXCIsIFwiU3Vydml2ZWQgI3tAYmxhY2tvdXQubmV4dFJvdW5kIC0gMX0gcm91bmRzXCJdXHJcblxyXG4gICAgbG93ZXN0U2NvcmUgPSBAYmxhY2tvdXQucGxheWVyc1swXS5zY29yZVxyXG4gICAgZm9yIHBsYXllciBpbiBAYmxhY2tvdXQucGxheWVyc1xyXG4gICAgICBpZiBsb3dlc3RTY29yZSA+IHBsYXllci5zY29yZVxyXG4gICAgICAgIGxvd2VzdFNjb3JlID0gcGxheWVyLnNjb3JlXHJcblxyXG4gICAgd2lubmVycyA9IFtdXHJcbiAgICBmb3IgcGxheWVyIGluIEBibGFja291dC5wbGF5ZXJzXHJcbiAgICAgIGlmIHBsYXllci5zY29yZSA9PSBsb3dlc3RTY29yZVxyXG4gICAgICAgIHdpbm5lcnMucHVzaCBwbGF5ZXIubmFtZVxyXG5cclxuICAgIGlmIHdpbm5lcnMubGVuZ3RoID09IDFcclxuICAgICAgcmV0dXJuIFtcIiN7d2lubmVyc1swXX0gd2lucyFcIl1cclxuXHJcbiAgICByZXR1cm4gW1wiVGllOiAje3dpbm5lcnMuam9pbignLCcpfVwiXVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBjYXJkIGhhbmRsaW5nXHJcblxyXG4gIHBsYXk6IChjYXJkVG9QbGF5LCB4LCB5LCByLCBjYXJkSW5kZXgpIC0+XHJcbiAgICBpZiBAYmxhY2tvdXQuc3RhdGUgPT0gU3RhdGUuVFJJQ0tcclxuICAgICAgQGxvZyBcIihnYW1lKSBwbGF5aW5nIGNhcmQgI3tjYXJkVG9QbGF5fVwiXHJcbiAgICAgIHJldCA9IEBibGFja291dC5wbGF5IHtcclxuICAgICAgICBpZDogMVxyXG4gICAgICAgIHdoaWNoOiBjYXJkVG9QbGF5XHJcbiAgICAgIH1cclxuICAgICAgQGxhc3RFcnIgPSByZXRcclxuICAgICAgaWYgcmV0ID09IE9LXHJcbiAgICAgICAgQGhhbmQuc2V0IEBibGFja291dC5wbGF5ZXJzWzBdLmhhbmRcclxuICAgICAgICBAcGlsZS5oaW50IGNhcmRUb1BsYXksIHgsIHksIHJcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgbWFpbiBsb29wXHJcblxyXG4gIHVwZGF0ZTogKGR0KSAtPlxyXG4gICAgQHpvbmVzLmxlbmd0aCA9IDAgIyBmb3JnZXQgYWJvdXQgem9uZXMgZnJvbSB0aGUgbGFzdCBmcmFtZS4gd2UncmUgYWJvdXQgdG8gbWFrZSBzb21lIG5ldyBvbmVzIVxyXG5cclxuICAgIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgaWYgQHVwZGF0ZU1haW5NZW51KGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgaWYgQHVwZGF0ZUdhbWUoZHQpXHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcblxyXG4gICAgcmV0dXJuIHVwZGF0ZWRcclxuXHJcbiAgdXBkYXRlTWFpbk1lbnU6IChkdCkgLT5cclxuICAgIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgaWYgQG1haW5NZW51LnVwZGF0ZShkdClcclxuICAgICAgdXBkYXRlZCA9IHRydWVcclxuICAgIHJldHVybiB1cGRhdGVkXHJcblxyXG4gIHVwZGF0ZUdhbWU6IChkdCkgLT5cclxuICAgIHJldHVybiBmYWxzZSBpZiBAYmxhY2tvdXQgPT0gbnVsbFxyXG5cclxuICAgIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgaWYgQHBpbGUudXBkYXRlKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgaWYgQHBpbGUucmVhZHlGb3JOZXh0VHJpY2soKVxyXG4gICAgICBAbmV4dEFJVGljayAtPSBkdFxyXG4gICAgICBpZiBAbmV4dEFJVGljayA8PSAwXHJcbiAgICAgICAgQG5leHRBSVRpY2sgPSBAYWlUaWNrUmF0ZSgpXHJcbiAgICAgICAgaWYgQGJsYWNrb3V0LmFpVGljaygpXHJcbiAgICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgaWYgQGhhbmQudXBkYXRlKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG5cclxuICAgIHRyaWNrVGFrZXJOYW1lID0gXCJcIlxyXG4gICAgaWYgQGJsYWNrb3V0LnByZXZUcmlja1Rha2VyICE9IC0xXHJcbiAgICAgIHRyaWNrVGFrZXJOYW1lID0gQGJsYWNrb3V0LnBsYXllcnNbQGJsYWNrb3V0LnByZXZUcmlja1Rha2VyXS5uYW1lXHJcbiAgICBAcGlsZS5zZXQgQGJsYWNrb3V0LnRyaWNrSUQsIEBibGFja291dC5waWxlLCBAYmxhY2tvdXQucGlsZVdobywgQGJsYWNrb3V0LnByZXYsIEBibGFja291dC5wcmV2V2hvLCB0cmlja1Rha2VyTmFtZSwgQGJsYWNrb3V0LnBsYXllcnMubGVuZ3RoLCBAYmxhY2tvdXQudHVyblxyXG5cclxuICAgIGlmIEBwYXVzZU1lbnUudXBkYXRlKGR0KVxyXG4gICAgICB1cGRhdGVkID0gdHJ1ZVxyXG5cclxuICAgIEBhZGp1c3RCaWQoMClcclxuICAgIGlmIEBiaWRVSS5taW51cy51cGRhdGUoZHQpXHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICBpZiBAYmlkVUkucGx1cy51cGRhdGUoZHQpXHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcblxyXG4gICAgcmV0dXJuIHVwZGF0ZWRcclxuXHJcbiAgcmVuZGVyOiAtPlxyXG4gICAgIyBSZXNldCByZW5kZXIgY29tbWFuZHNcclxuICAgIEByZW5kZXJDb21tYW5kcy5sZW5ndGggPSAwXHJcblxyXG4gICAgaWYgQGhvd3RvID4gMFxyXG4gICAgICBAcmVuZGVySG93dG8oKVxyXG4gICAgZWxzZSBpZiBAYmxhY2tvdXQgPT0gbnVsbFxyXG4gICAgICBAcmVuZGVyTWFpbk1lbnUoKVxyXG4gICAgZWxzZVxyXG4gICAgICBAcmVuZGVyR2FtZSgpXHJcblxyXG4gICAgcmV0dXJuIEByZW5kZXJDb21tYW5kc1xyXG5cclxuICByZW5kZXJIb3d0bzogLT5cclxuICAgIGhvd3RvVGV4dHVyZSA9IFwiaG93dG8je0Bob3d0b31cIlxyXG4gICAgQGxvZyBcInJlbmRlcmluZyAje2hvd3RvVGV4dHVyZX1cIlxyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIDAsIDAsIEB3aWR0aCwgQGhlaWdodCwgMCwgMCwgMCwgQGNvbG9ycy5ibGFja1xyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBob3d0b1RleHR1cmUsIDAsIDAsIEB3aWR0aCwgQGFhSGVpZ2h0LCAwLCAwLCAwLCBAY29sb3JzLndoaXRlXHJcbiAgICBhcnJvd1dpZHRoID0gQHdpZHRoIC8gMjBcclxuICAgIGFycm93T2Zmc2V0ID0gYXJyb3dXaWR0aCAqIDRcclxuICAgIGNvbG9yID0gaWYgQGhvd3RvID09IDEgdGhlbiBAY29sb3JzLmFycm93Y2xvc2UgZWxzZSBAY29sb3JzLmFycm93XHJcbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwiYXJyb3dMXCIsIEBjZW50ZXIueCAtIGFycm93T2Zmc2V0LCBAaGVpZ2h0LCBhcnJvd1dpZHRoLCAwLCAwLCAwLjUsIDEsIGNvbG9yLCA9PlxyXG4gICAgICBAaG93dG8tLVxyXG4gICAgICBpZiBAaG93dG8gPCAwXHJcbiAgICAgICAgQGhvd3RvID0gMFxyXG4gICAgY29sb3IgPSBpZiBAaG93dG8gPT0gMyB0aGVuIEBjb2xvcnMuYXJyb3djbG9zZSBlbHNlIEBjb2xvcnMuYXJyb3dcclxuICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgXCJhcnJvd1JcIiwgQGNlbnRlci54ICsgYXJyb3dPZmZzZXQsIEBoZWlnaHQsIGFycm93V2lkdGgsIDAsIDAsIDAuNSwgMSwgY29sb3IsID0+XHJcbiAgICAgIEBob3d0bysrXHJcbiAgICAgIGlmIEBob3d0byA+IDNcclxuICAgICAgICBAaG93dG8gPSAwXHJcblxyXG4gIHJlbmRlck1haW5NZW51OiAtPlxyXG4gICAgQG1haW5NZW51LnJlbmRlcigpXHJcblxyXG4gIHJlbmRlckdhbWU6IC0+XHJcblxyXG4gICAgIyBiYWNrZ3JvdW5kXHJcbiAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIFwic29saWRcIiwgMCwgMCwgQHdpZHRoLCBAaGVpZ2h0LCAwLCAwLCAwLCBAY29sb3JzLmJhY2tncm91bmRcclxuXHJcbiAgICB0ZXh0SGVpZ2h0ID0gQGFhSGVpZ2h0IC8gMjVcclxuICAgIHRleHRQYWRkaW5nID0gdGV4dEhlaWdodCAvIDVcclxuICAgIGNoYXJhY3RlckhlaWdodCA9IEBhYUhlaWdodCAvIDVcclxuICAgIHNjb3JlSGVpZ2h0ID0gdGV4dEhlaWdodFxyXG5cclxuICAgICMgTG9nXHJcbiAgICBmb3IgbGluZSwgaSBpbiBAYmxhY2tvdXQubG9nXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCB0ZXh0SGVpZ2h0LCBsaW5lLCAwLCAoaSsxKSAqICh0ZXh0SGVpZ2h0ICsgdGV4dFBhZGRpbmcpLCAwLCAwLCBAY29sb3JzLndoaXRlXHJcblxyXG4gICAgaWYgQGJsYWNrb3V0Lm1hcmF0aG9uTW9kZSgpXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCB0ZXh0SGVpZ2h0LCBcIk1BUkFUSE9OIE1PREVcIiwgQHdpZHRoIC0gQHBhdXNlQnV0dG9uU2l6ZSwgMCwgMSwgMCwgQGNvbG9ycy5vcmFuZ2VcclxuXHJcbiAgICBhaVBsYXllcnMgPSBbbnVsbCwgbnVsbCwgbnVsbF1cclxuICAgIGlmIEBibGFja291dC5wbGF5ZXJzLmxlbmd0aCA9PSAyXHJcbiAgICAgIGFpUGxheWVyc1sxXSA9IEBibGFja291dC5wbGF5ZXJzWzFdXHJcbiAgICBlbHNlIGlmIEBibGFja291dC5wbGF5ZXJzLmxlbmd0aCA9PSAzXHJcbiAgICAgIGFpUGxheWVyc1swXSA9IEBibGFja291dC5wbGF5ZXJzWzFdXHJcbiAgICAgIGFpUGxheWVyc1syXSA9IEBibGFja291dC5wbGF5ZXJzWzJdXHJcbiAgICBlbHNlICMgNCBwbGF5ZXJcclxuICAgICAgYWlQbGF5ZXJzWzBdID0gQGJsYWNrb3V0LnBsYXllcnNbMV1cclxuICAgICAgYWlQbGF5ZXJzWzFdID0gQGJsYWNrb3V0LnBsYXllcnNbMl1cclxuICAgICAgYWlQbGF5ZXJzWzJdID0gQGJsYWNrb3V0LnBsYXllcnNbM11cclxuXHJcbiAgICBjaGFyYWN0ZXJNYXJnaW4gPSBjaGFyYWN0ZXJIZWlnaHQgLyAyXHJcblxyXG4gICAgIyBsZWZ0IHNpZGVcclxuICAgIGlmIGFpUGxheWVyc1swXSAhPSBudWxsXHJcbiAgICAgIGNoYXJhY3RlciA9IGFpQ2hhcmFjdGVyc1thaVBsYXllcnNbMF0uY2hhcklEXVxyXG4gICAgICBjaGFyYWN0ZXJXaWR0aCA9IEBzcHJpdGVSZW5kZXJlci5jYWxjV2lkdGgoY2hhcmFjdGVyLnNwcml0ZSwgY2hhcmFjdGVySGVpZ2h0KVxyXG4gICAgICBAc3ByaXRlUmVuZGVyZXIucmVuZGVyIGNoYXJhY3Rlci5zcHJpdGUsIGNoYXJhY3Rlck1hcmdpbiwgQGhhbmQucGxheUNlaWxpbmcsIDAsIGNoYXJhY3RlckhlaWdodCwgMCwgMCwgMSwgQGNvbG9ycy53aGl0ZVxyXG4gICAgICBAcmVuZGVyU2NvcmUgYWlQbGF5ZXJzWzBdLCBhaVBsYXllcnNbMF0uaW5kZXggPT0gQGJsYWNrb3V0LnR1cm4sIHNjb3JlSGVpZ2h0LCBjaGFyYWN0ZXJNYXJnaW4gKyAoY2hhcmFjdGVyV2lkdGggLyAyKSwgQGhhbmQucGxheUNlaWxpbmcgLSB0ZXh0UGFkZGluZywgMC41LCAwXHJcbiAgICAjIHRvcCBzaWRlXHJcbiAgICBpZiBhaVBsYXllcnNbMV0gIT0gbnVsbFxyXG4gICAgICBjaGFyYWN0ZXIgPSBhaUNoYXJhY3RlcnNbYWlQbGF5ZXJzWzFdLmNoYXJJRF1cclxuICAgICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBjaGFyYWN0ZXIuc3ByaXRlLCBAY2VudGVyLngsIDAsIDAsIGNoYXJhY3RlckhlaWdodCwgMCwgMC41LCAwLCBAY29sb3JzLndoaXRlXHJcbiAgICAgIEByZW5kZXJTY29yZSBhaVBsYXllcnNbMV0sIGFpUGxheWVyc1sxXS5pbmRleCA9PSBAYmxhY2tvdXQudHVybiwgc2NvcmVIZWlnaHQsIEBjZW50ZXIueCwgY2hhcmFjdGVySGVpZ2h0LCAwLjUsIDBcclxuICAgICMgcmlnaHQgc2lkZVxyXG4gICAgaWYgYWlQbGF5ZXJzWzJdICE9IG51bGxcclxuICAgICAgY2hhcmFjdGVyID0gYWlDaGFyYWN0ZXJzW2FpUGxheWVyc1syXS5jaGFySURdXHJcbiAgICAgIGNoYXJhY3RlcldpZHRoID0gQHNwcml0ZVJlbmRlcmVyLmNhbGNXaWR0aChjaGFyYWN0ZXIuc3ByaXRlLCBjaGFyYWN0ZXJIZWlnaHQpXHJcbiAgICAgIEBzcHJpdGVSZW5kZXJlci5yZW5kZXIgY2hhcmFjdGVyLnNwcml0ZSwgQHdpZHRoIC0gY2hhcmFjdGVyTWFyZ2luLCBAaGFuZC5wbGF5Q2VpbGluZywgMCwgY2hhcmFjdGVySGVpZ2h0LCAwLCAxLCAxLCBAY29sb3JzLndoaXRlXHJcbiAgICAgIEByZW5kZXJTY29yZSBhaVBsYXllcnNbMl0sIGFpUGxheWVyc1syXS5pbmRleCA9PSBAYmxhY2tvdXQudHVybiwgc2NvcmVIZWlnaHQsIEB3aWR0aCAtIChjaGFyYWN0ZXJNYXJnaW4gKyAoY2hhcmFjdGVyV2lkdGggLyAyKSksIEBoYW5kLnBsYXlDZWlsaW5nIC0gdGV4dFBhZGRpbmcsIDAuNSwgMFxyXG5cclxuICAgIEBwaWxlLnJlbmRlcigpXHJcblxyXG4gICAgaWYgKEBibGFja291dC5zdGF0ZSA9PSBTdGF0ZS5QT1NUR0FNRVNVTU1BUlkpIGFuZCBAcGlsZS5yZXN0aW5nKClcclxuICAgICAgbGluZXMgPSBAZ2FtZU92ZXJUZXh0KClcclxuICAgICAgZ2FtZU92ZXJTaXplID0gQGFhSGVpZ2h0IC8gOFxyXG4gICAgICBnYW1lT3ZlclkgPSBAY2VudGVyLnlcclxuICAgICAgaWYgbGluZXMubGVuZ3RoID4gMVxyXG4gICAgICAgIGdhbWVPdmVyWSAtPSAoZ2FtZU92ZXJTaXplID4+IDEpXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBnYW1lT3ZlclNpemUsIGxpbmVzWzBdLCBAY2VudGVyLngsIGdhbWVPdmVyWSwgMC41LCAwLjUsIEBjb2xvcnMub3JhbmdlXHJcbiAgICAgIGlmIGxpbmVzLmxlbmd0aCA+IDFcclxuICAgICAgICBnYW1lT3ZlclkgKz0gZ2FtZU92ZXJTaXplXHJcbiAgICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIGdhbWVPdmVyU2l6ZSwgbGluZXNbMV0sIEBjZW50ZXIueCwgZ2FtZU92ZXJZLCAwLjUsIDAuNSwgQGNvbG9ycy5vcmFuZ2VcclxuXHJcbiAgICAgIHJlc3RhcnRRdWl0U2l6ZSA9IEBhYUhlaWdodCAvIDEyXHJcbiAgICAgIHNoYWRvd0Rpc3RhbmNlID0gcmVzdGFydFF1aXRTaXplIC8gOFxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgcmVzdGFydFF1aXRTaXplLCBcIlJlc3RhcnRcIiwgc2hhZG93RGlzdGFuY2UgKyBAY2VudGVyLnggLyAyLCBzaGFkb3dEaXN0YW5jZSArIEBoZWlnaHQgLSByZXN0YXJ0UXVpdFNpemUsIDAuNSwgMSwgQGNvbG9ycy5ibGFjaywgPT5cclxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHJlc3RhcnRRdWl0U2l6ZSwgXCJSZXN0YXJ0XCIsIEBjZW50ZXIueCAvIDIsIEBoZWlnaHQgLSByZXN0YXJ0UXVpdFNpemUsIDAuNSwgMSwgQGNvbG9ycy5nb2xkLCA9PlxyXG4gICAgICAgIEBuZXdHYW1lKClcclxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHJlc3RhcnRRdWl0U2l6ZSwgXCJRdWl0XCIsIHNoYWRvd0Rpc3RhbmNlICsgQGNlbnRlci54ICsgKEBjZW50ZXIueCAvIDIpLCBzaGFkb3dEaXN0YW5jZSArIEBoZWlnaHQgLSByZXN0YXJ0UXVpdFNpemUsIDAuNSwgMSwgQGNvbG9ycy5ibGFjaywgPT5cclxuICAgICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHJlc3RhcnRRdWl0U2l6ZSwgXCJRdWl0XCIsIEBjZW50ZXIueCArIChAY2VudGVyLnggLyAyKSwgQGhlaWdodCAtIHJlc3RhcnRRdWl0U2l6ZSwgMC41LCAxLCBAY29sb3JzLmdvbGQsID0+XHJcbiAgICAgICAgQGJsYWNrb3V0ID0gbnVsbFxyXG5cclxuICAgIGlmIChAYmxhY2tvdXQuc3RhdGUgPT0gU3RhdGUuUk9VTkRTVU1NQVJZKSBhbmQgQHBpbGUucmVzdGluZygpXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBAYWFIZWlnaHQgLyA4LCBcIlRhcCBmb3IgbmV4dCByb3VuZCAuLi5cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIDAuNSwgMC41LCBAY29sb3JzLm9yYW5nZSwgPT5cclxuICAgICAgICBpZiBAYmxhY2tvdXQubmV4dCgpID09IE9LXHJcbiAgICAgICAgICBAaGFuZC5zZXQgQGJsYWNrb3V0LnBsYXllcnNbMF0uaGFuZFxyXG5cclxuICAgIGlmIChAYmxhY2tvdXQuc3RhdGUgPT0gU3RhdGUuQklEKSBhbmQgKEBibGFja291dC50dXJuID09IDApXHJcbiAgICAgIEBiaWRVSS5taW51cy5yZW5kZXIoKVxyXG4gICAgICBAYmlkVUkucGx1cy5yZW5kZXIoKVxyXG4gICAgICBAZm9udFJlbmRlcmVyLnJlbmRlciBAZm9udCwgQGJpZFRleHRTaXplLCBcIiN7QGJpZH1cIiwgQGNlbnRlci54LCBAYmlkQnV0dG9uWSAtIChAYmlkVGV4dFNpemUgKiAwLjEpLCAwLjUsIDAuNSwgQGNvbG9ycy53aGl0ZSwgPT5cclxuICAgICAgICBAYXR0ZW1wdEJpZCgpXHJcbiAgICAgIGJpZEJ1dHRvbkhlaWdodCA9IEBhYUhlaWdodCAvIDEyXHJcbiAgICAgIGJpZFNpemUgPSBAZm9udFJlbmRlcmVyLnNpemUoQGZvbnQsIGJpZEJ1dHRvbkhlaWdodCwgXCJCaWRcIilcclxuICAgICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIEBjZW50ZXIueCwgKEBiaWRCdXR0b25ZICsgQGJpZFRleHRTaXplKSArIChiaWRTaXplLmggKiAwLjIpLCBiaWRTaXplLncgKiAzLCBiaWRTaXplLmggKiAxLjUsIDAsIDAuNSwgMC41LCBAY29sb3JzLmJpZCwgPT5cclxuICAgICAgICBAYXR0ZW1wdEJpZCgpXHJcbiAgICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCBiaWRCdXR0b25IZWlnaHQsIFwiQmlkXCIsIEBjZW50ZXIueCwgQGJpZEJ1dHRvblkgKyBAYmlkVGV4dFNpemUsIDAuNSwgMC41LCBAY29sb3JzLndoaXRlXHJcblxyXG4gICAgIyBjYXJkIGFyZWFcclxuICAgICMgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIDAsIEBoZWlnaHQsIEB3aWR0aCwgQGhlaWdodCAtIEBoYW5kLnBsYXlDZWlsaW5nLCAwLCAwLCAxLCBAY29sb3JzLmhhbmRhcmVhXHJcbiAgICBAaGFuZC5yZW5kZXIoKVxyXG4gICAgQHJlbmRlclNjb3JlIEBibGFja291dC5wbGF5ZXJzWzBdLCAwID09IEBibGFja291dC50dXJuLCBzY29yZUhlaWdodCwgQGNlbnRlci54LCBAaGVpZ2h0LCAwLjUsIDFcclxuXHJcbiAgICAjIEhlYWRsaW5lIChpbmNsdWRlcyBlcnJvcilcclxuICAgIEBmb250UmVuZGVyZXIucmVuZGVyIEBmb250LCB0ZXh0SGVpZ2h0LCBAY2FsY0hlYWRsaW5lKCksIDAsIDAsIDAsIDAsIEBjb2xvcnMubGlnaHRncmF5XHJcblxyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInBhdXNlXCIsIEB3aWR0aCwgMCwgMCwgQHBhdXNlQnV0dG9uU2l6ZSwgMCwgMSwgMCwgQGNvbG9ycy53aGl0ZSwgPT5cclxuICAgICAgQHBhdXNlZCA9IHRydWVcclxuXHJcbiAgICBpZiBAcGF1c2VkXHJcbiAgICAgIEBwYXVzZU1lbnUucmVuZGVyKClcclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVuZGVyU2NvcmU6IChwbGF5ZXIsIG15VHVybiwgc2NvcmVIZWlnaHQsIHgsIHksIGFuY2hvcngsIGFuY2hvcnkpIC0+XHJcbiAgICBpZiBteVR1cm5cclxuICAgICAgbmFtZUNvbG9yID0gXCJgZmY3NzAwYFwiXHJcbiAgICBlbHNlXHJcbiAgICAgIG5hbWVDb2xvciA9IFwiXCJcclxuICAgIG5hbWVTdHJpbmcgPSBcIiAje25hbWVDb2xvcn0je3BsYXllci5uYW1lfWBgOiAje3BsYXllci5zY29yZX0gXCJcclxuICAgIGlmIHBsYXllci5iaWQgPT0gLTFcclxuICAgICAgc2NvcmVTdHJpbmcgPSBcIlsgLS0gXVwiXHJcbiAgICBlbHNlXHJcbiAgICAgIGlmIHBsYXllci50cmlja3MgPCBwbGF5ZXIuYmlkXHJcbiAgICAgICAgdHJpY2tDb2xvciA9IFwiZmZmZjMzXCJcclxuICAgICAgZWxzZSBpZiBwbGF5ZXIudHJpY2tzID09IHBsYXllci5iaWRcclxuICAgICAgICB0cmlja0NvbG9yID0gXCIzM2ZmMzNcIlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdHJpY2tDb2xvciA9IFwiZmYzMzMzXCJcclxuICAgICAgc2NvcmVTdHJpbmcgPSBcIlsgYCN7dHJpY2tDb2xvcn1gI3twbGF5ZXIudHJpY2tzfWBgLyN7cGxheWVyLmJpZH0gXVwiXHJcblxyXG4gICAgbmFtZVNpemUgPSBAZm9udFJlbmRlcmVyLnNpemUoQGZvbnQsIHNjb3JlSGVpZ2h0LCBuYW1lU3RyaW5nKVxyXG4gICAgc2NvcmVTaXplID0gQGZvbnRSZW5kZXJlci5zaXplKEBmb250LCBzY29yZUhlaWdodCwgc2NvcmVTdHJpbmcpXHJcbiAgICBpZiBuYW1lU2l6ZS53ID4gc2NvcmVTaXplLndcclxuICAgICAgc2NvcmVTaXplLncgPSBuYW1lU2l6ZS53XHJcbiAgICBuYW1lWSA9IHlcclxuICAgIHNjb3JlWSA9IHlcclxuICAgIGlmIGFuY2hvcnkgPiAwXHJcbiAgICAgIG5hbWVZIC09IHNjb3JlSGVpZ2h0XHJcbiAgICBlbHNlXHJcbiAgICAgIHNjb3JlWSArPSBzY29yZUhlaWdodFxyXG4gICAgQHNwcml0ZVJlbmRlcmVyLnJlbmRlciBcInNvbGlkXCIsIHgsIHksIHNjb3JlU2l6ZS53LCBzY29yZVNpemUuaCAqIDIsIDAsIGFuY2hvcngsIGFuY2hvcnksIEBjb2xvcnMub3ZlcmxheVxyXG4gICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHNjb3JlSGVpZ2h0LCBuYW1lU3RyaW5nLCB4LCBuYW1lWSwgYW5jaG9yeCwgYW5jaG9yeSwgQGNvbG9ycy53aGl0ZVxyXG4gICAgQGZvbnRSZW5kZXJlci5yZW5kZXIgQGZvbnQsIHNjb3JlSGVpZ2h0LCBzY29yZVN0cmluZywgeCwgc2NvcmVZLCBhbmNob3J4LCBhbmNob3J5LCBAY29sb3JzLndoaXRlXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIHJlbmRlcmluZyBhbmQgem9uZXNcclxuXHJcbiAgZHJhd0ltYWdlOiAodGV4dHVyZSwgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoLCByb3QsIGFuY2hvcngsIGFuY2hvcnksIHIsIGcsIGIsIGEsIGNiKSAtPlxyXG4gICAgQHJlbmRlckNvbW1hbmRzLnB1c2ggQHRleHR1cmVzW3RleHR1cmVdLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgsIHJvdCwgYW5jaG9yeCwgYW5jaG9yeSwgciwgZywgYiwgYVxyXG5cclxuICAgIGlmIGNiP1xyXG4gICAgICAjIGNhbGxlciB3YW50cyB0byByZW1lbWJlciB3aGVyZSB0aGlzIHdhcyBkcmF3biwgYW5kIHdhbnRzIHRvIGJlIGNhbGxlZCBiYWNrIGlmIGl0IGlzIGV2ZXIgdG91Y2hlZFxyXG4gICAgICAjIFRoaXMgaXMgY2FsbGVkIGEgXCJ6b25lXCIuIFNpbmNlIHpvbmVzIGFyZSB0cmF2ZXJzZWQgaW4gcmV2ZXJzZSBvcmRlciwgdGhlIG5hdHVyYWwgb3ZlcmxhcCBvZlxyXG4gICAgICAjIGEgc2VyaWVzIG9mIHJlbmRlcnMgaXMgcmVzcGVjdGVkIGFjY29yZGluZ2x5LlxyXG4gICAgICBhbmNob3JPZmZzZXRYID0gLTEgKiBhbmNob3J4ICogZHdcclxuICAgICAgYW5jaG9yT2Zmc2V0WSA9IC0xICogYW5jaG9yeSAqIGRoXHJcbiAgICAgIHpvbmUgPVxyXG4gICAgICAgICMgY2VudGVyIChYLFkpIGFuZCByZXZlcnNlZCByb3RhdGlvbiwgdXNlZCB0byBwdXQgdGhlIGNvb3JkaW5hdGUgaW4gbG9jYWwgc3BhY2UgdG8gdGhlIHpvbmVcclxuICAgICAgICBjeDogIGR4XHJcbiAgICAgICAgY3k6ICBkeVxyXG4gICAgICAgIHJvdDogcm90ICogLTFcclxuICAgICAgICAjIHRoZSBheGlzIGFsaWduZWQgYm91bmRpbmcgYm94IHVzZWQgZm9yIGRldGVjdGlvbiBvZiBhIGxvY2Fsc3BhY2UgY29vcmRcclxuICAgICAgICBsOiAgIGFuY2hvck9mZnNldFhcclxuICAgICAgICB0OiAgIGFuY2hvck9mZnNldFlcclxuICAgICAgICByOiAgIGFuY2hvck9mZnNldFggKyBkd1xyXG4gICAgICAgIGI6ICAgYW5jaG9yT2Zmc2V0WSArIGRoXHJcbiAgICAgICAgIyBjYWxsYmFjayB0byBjYWxsIGlmIHRoZSB6b25lIGlzIGNsaWNrZWQgb25cclxuICAgICAgICBjYjogIGNiXHJcbiAgICAgIEB6b25lcy5wdXNoIHpvbmVcclxuXHJcbiAgY2hlY2tab25lczogKHgsIHkpIC0+XHJcbiAgICBmb3Igem9uZSBpbiBAem9uZXMgYnkgLTFcclxuICAgICAgIyBtb3ZlIGNvb3JkIGludG8gc3BhY2UgcmVsYXRpdmUgdG8gdGhlIHF1YWQsIHRoZW4gcm90YXRlIGl0IHRvIG1hdGNoXHJcbiAgICAgIHVucm90YXRlZExvY2FsWCA9IHggLSB6b25lLmN4XHJcbiAgICAgIHVucm90YXRlZExvY2FsWSA9IHkgLSB6b25lLmN5XHJcbiAgICAgIGxvY2FsWCA9IHVucm90YXRlZExvY2FsWCAqIE1hdGguY29zKHpvbmUucm90KSAtIHVucm90YXRlZExvY2FsWSAqIE1hdGguc2luKHpvbmUucm90KVxyXG4gICAgICBsb2NhbFkgPSB1bnJvdGF0ZWRMb2NhbFggKiBNYXRoLnNpbih6b25lLnJvdCkgKyB1bnJvdGF0ZWRMb2NhbFkgKiBNYXRoLmNvcyh6b25lLnJvdClcclxuICAgICAgaWYgKGxvY2FsWCA8IHpvbmUubCkgb3IgKGxvY2FsWCA+IHpvbmUucikgb3IgKGxvY2FsWSA8IHpvbmUudCkgb3IgKGxvY2FsWSA+IHpvbmUuYilcclxuICAgICAgICAjIG91dHNpZGUgb2Ygb3JpZW50ZWQgYm91bmRpbmcgYm94XHJcbiAgICAgICAgY29udGludWVcclxuICAgICAgem9uZS5jYih4LCB5KVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZVxyXG4iLCJBbmltYXRpb24gPSByZXF1aXJlICcuL0FuaW1hdGlvbidcclxuXHJcbkNBUkRfSU1BR0VfVyA9IDEyMFxyXG5DQVJEX0lNQUdFX0ggPSAxNjJcclxuQ0FSRF9JTUFHRV9PRkZfWCA9IDRcclxuQ0FSRF9JTUFHRV9PRkZfWSA9IDRcclxuQ0FSRF9JTUFHRV9BRFZfWCA9IENBUkRfSU1BR0VfV1xyXG5DQVJEX0lNQUdFX0FEVl9ZID0gQ0FSRF9JTUFHRV9IXHJcbkNBUkRfUkVOREVSX1NDQUxFID0gMC4zNSAgICAgICAgICAgICAgICAgICMgY2FyZCBoZWlnaHQgY29lZmZpY2llbnQgZnJvbSB0aGUgc2NyZWVuJ3MgaGVpZ2h0XHJcbkNBUkRfSEFORF9DVVJWRV9ESVNUX0ZBQ1RPUiA9IDMuNSAgICAgICAgICMgZmFjdG9yIHdpdGggc2NyZWVuIGhlaWdodCB0byBmaWd1cmUgb3V0IGNlbnRlciBvZiBhcmMuIGJpZ2dlciBudW1iZXIgaXMgbGVzcyBhcmNcclxuQ0FSRF9IT0xESU5HX1JPVF9PUkRFUiA9IE1hdGguUEkgLyAxMiAgICAgIyBkZXNpcmVkIHJvdGF0aW9uIG9mIHRoZSBjYXJkIHdoZW4gYmVpbmcgZHJhZ2dlZCBhcm91bmQgZm9yIG9yZGVyaW5nJ3Mgc2FrZVxyXG5DQVJEX0hPTERJTkdfUk9UX1BMQVkgPSAtMSAqIE1hdGguUEkgLyAxMiAjIGRlc2lyZWQgcm90YXRpb24gb2YgdGhlIGNhcmQgd2hlbiBiZWluZyBkcmFnZ2VkIGFyb3VuZCB3aXRoIGludGVudCB0byBwbGF5XHJcbkNBUkRfUExBWV9DRUlMSU5HID0gMC42NSAgICAgICAgICAgICAgICAgICMgaG93IG11Y2ggb2YgdGhlIHRvcCBvZiB0aGUgc2NyZWVuIHJlcHJlc2VudHMgXCJJIHdhbnQgdG8gcGxheSB0aGlzXCIgdnMgXCJJIHdhbnQgdG8gcmVvcmRlclwiXHJcblxyXG5OT19DQVJEID0gLTFcclxuXHJcbiMgdGFrZW4gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyMTEyMTIvaG93LXRvLWNhbGN1bGF0ZS1hbi1hbmdsZS1mcm9tLXRocmVlLXBvaW50c1xyXG4jIHVzZXMgbGF3IG9mIGNvc2luZXMgdG8gZmlndXJlIG91dCB0aGUgaGFuZCBhcmMgYW5nbGVcclxuZmluZEFuZ2xlID0gKHAwLCBwMSwgcDIpIC0+XHJcbiAgICBhID0gTWF0aC5wb3cocDEueCAtIHAyLngsIDIpICsgTWF0aC5wb3cocDEueSAtIHAyLnksIDIpXHJcbiAgICBiID0gTWF0aC5wb3cocDEueCAtIHAwLngsIDIpICsgTWF0aC5wb3cocDEueSAtIHAwLnksIDIpXHJcbiAgICBjID0gTWF0aC5wb3cocDIueCAtIHAwLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAwLnksIDIpXHJcbiAgICByZXR1cm4gTWF0aC5hY29zKCAoYStiLWMpIC8gTWF0aC5zcXJ0KDQqYSpiKSApXHJcblxyXG5jYWxjRGlzdGFuY2UgPSAocDAsIHAxKSAtPlxyXG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3cocDEueCAtIHAwLngsIDIpICsgTWF0aC5wb3cocDEueSAtIHAwLnksIDIpKVxyXG5cclxuY2FsY0Rpc3RhbmNlU3F1YXJlZCA9ICh4MCwgeTAsIHgxLCB5MSkgLT5cclxuICByZXR1cm4gTWF0aC5wb3coeDEgLSB4MCwgMikgKyBNYXRoLnBvdyh5MSAtIHkwLCAyKVxyXG5cclxuY2xhc3MgSGFuZFxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XHJcbiAgICBAY2FyZHMgPSBbXVxyXG4gICAgQGFuaW1zID0ge31cclxuICAgIEBwb3NpdGlvbkNhY2hlID0ge31cclxuXHJcbiAgICBAZHJhZ0luZGV4U3RhcnQgPSBOT19DQVJEXHJcbiAgICBAZHJhZ0luZGV4Q3VycmVudCA9IE5PX0NBUkRcclxuICAgIEBkcmFnWCA9IDBcclxuICAgIEBkcmFnWSA9IDBcclxuXHJcbiAgICAjIHJlbmRlciAvIGFuaW0gbWV0cmljc1xyXG4gICAgQGNhcmRTcGVlZCA9XHJcbiAgICAgIHI6IE1hdGguUEkgKiAyXHJcbiAgICAgIHM6IDIuNVxyXG4gICAgICB0OiAyICogQGdhbWUud2lkdGhcclxuICAgIEBwbGF5Q2VpbGluZyA9IENBUkRfUExBWV9DRUlMSU5HICogQGdhbWUuaGVpZ2h0XHJcbiAgICBAY2FyZEhlaWdodCA9IE1hdGguZmxvb3IoQGdhbWUuaGVpZ2h0ICogQ0FSRF9SRU5ERVJfU0NBTEUpXHJcbiAgICBAY2FyZFdpZHRoICA9IE1hdGguZmxvb3IoQGNhcmRIZWlnaHQgKiBDQVJEX0lNQUdFX1cgLyBDQVJEX0lNQUdFX0gpXHJcbiAgICBAY2FyZEhhbGZIZWlnaHQgPSBAY2FyZEhlaWdodCA+PiAxXHJcbiAgICBAY2FyZEhhbGZXaWR0aCAgPSBAY2FyZFdpZHRoID4+IDFcclxuICAgIGFyY01hcmdpbiA9IEBjYXJkV2lkdGggLyAyXHJcbiAgICBhcmNWZXJ0aWNhbEJpYXMgPSBAY2FyZEhlaWdodCAvIDUwXHJcbiAgICBib3R0b21MZWZ0ICA9IHsgeDogYXJjTWFyZ2luLCAgICAgICAgICAgICAgICB5OiBhcmNWZXJ0aWNhbEJpYXMgKyBAZ2FtZS5oZWlnaHQgfVxyXG4gICAgYm90dG9tUmlnaHQgPSB7IHg6IEBnYW1lLndpZHRoIC0gYXJjTWFyZ2luLCB5OiBhcmNWZXJ0aWNhbEJpYXMgKyBAZ2FtZS5oZWlnaHQgfVxyXG4gICAgQGhhbmRDZW50ZXIgPSB7IHg6IEBnYW1lLndpZHRoIC8gMiwgICAgICAgICB5OiBhcmNWZXJ0aWNhbEJpYXMgKyBAZ2FtZS5oZWlnaHQgKyAoQ0FSRF9IQU5EX0NVUlZFX0RJU1RfRkFDVE9SICogQGdhbWUuaGVpZ2h0KSB9XHJcbiAgICBAaGFuZEFuZ2xlID0gZmluZEFuZ2xlKGJvdHRvbUxlZnQsIEBoYW5kQ2VudGVyLCBib3R0b21SaWdodClcclxuICAgIEBoYW5kRGlzdGFuY2UgPSBjYWxjRGlzdGFuY2UoYm90dG9tTGVmdCwgQGhhbmRDZW50ZXIpXHJcbiAgICBAaGFuZEFuZ2xlQWR2YW5jZU1heCA9IEBoYW5kQW5nbGUgLyA3ICMgbmV2ZXIgc3BhY2UgdGhlIGNhcmRzIG1vcmUgdGhhbiB3aGF0IHRoZXknZCBsb29rIGxpa2Ugd2l0aCB0aGlzIGhhbmRzaXplXHJcbiAgICBAZ2FtZS5sb2cgXCJIYW5kIGRpc3RhbmNlICN7QGhhbmREaXN0YW5jZX0sIGFuZ2xlICN7QGhhbmRBbmdsZX0gKHNjcmVlbiBoZWlnaHQgI3tAZ2FtZS5oZWlnaHR9KVwiXHJcblxyXG4gIHNldDogKGNhcmRzKSAtPlxyXG4gICAgQGNhcmRzID0gY2FyZHMuc2xpY2UoMClcclxuICAgIEBzeW5jQW5pbXMoKVxyXG4gICAgQHdhcnAoKVxyXG5cclxuICBzeW5jQW5pbXM6IC0+XHJcbiAgICBzZWVuID0ge31cclxuICAgIGZvciBjYXJkIGluIEBjYXJkc1xyXG4gICAgICBzZWVuW2NhcmRdKytcclxuICAgICAgaWYgbm90IEBhbmltc1tjYXJkXVxyXG4gICAgICAgIEBhbmltc1tjYXJkXSA9IG5ldyBBbmltYXRpb24ge1xyXG4gICAgICAgICAgc3BlZWQ6IEBjYXJkU3BlZWRcclxuICAgICAgICAgIHg6IDBcclxuICAgICAgICAgIHk6IDBcclxuICAgICAgICAgIHI6IDBcclxuICAgICAgICB9XHJcbiAgICB0b1JlbW92ZSA9IFtdXHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBpZiBub3Qgc2Vlbi5oYXNPd25Qcm9wZXJ0eShjYXJkKVxyXG4gICAgICAgIHRvUmVtb3ZlLnB1c2ggY2FyZFxyXG4gICAgZm9yIGNhcmQgaW4gdG9SZW1vdmVcclxuICAgICAgIyBAZ2FtZS5sb2cgXCJyZW1vdmluZyBhbmltIGZvciAje2NhcmR9XCJcclxuICAgICAgZGVsZXRlIEBhbmltc1tjYXJkXVxyXG5cclxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxyXG5cclxuICBjYWxjRHJhd25IYW5kOiAtPlxyXG4gICAgZHJhd25IYW5kID0gW11cclxuICAgIGZvciBjYXJkLGkgaW4gQGNhcmRzXHJcbiAgICAgIGlmIGkgIT0gQGRyYWdJbmRleFN0YXJ0XHJcbiAgICAgICAgZHJhd25IYW5kLnB1c2ggY2FyZFxyXG5cclxuICAgIGlmIEBkcmFnSW5kZXhDdXJyZW50ICE9IE5PX0NBUkRcclxuICAgICAgZHJhd25IYW5kLnNwbGljZSBAZHJhZ0luZGV4Q3VycmVudCwgMCwgQGNhcmRzW0BkcmFnSW5kZXhTdGFydF1cclxuICAgIHJldHVybiBkcmF3bkhhbmRcclxuXHJcbiAgd2FudHNUb1BsYXlEcmFnZ2VkQ2FyZDogLT5cclxuICAgIHJldHVybiBmYWxzZSBpZiBAZHJhZ0luZGV4U3RhcnQgPT0gTk9fQ0FSRFxyXG4gICAgcmV0dXJuIEBkcmFnWSA8IEBwbGF5Q2VpbGluZ1xyXG5cclxuICB1cGRhdGVQb3NpdGlvbnM6IC0+XHJcbiAgICBkcmF3bkhhbmQgPSBAY2FsY0RyYXduSGFuZCgpXHJcbiAgICB3YW50c1RvUGxheSA9IEB3YW50c1RvUGxheURyYWdnZWRDYXJkKClcclxuICAgIGRlc2lyZWRSb3RhdGlvbiA9IENBUkRfSE9MRElOR19ST1RfT1JERVJcclxuICAgIHBvc2l0aW9uQ291bnQgPSBkcmF3bkhhbmQubGVuZ3RoXHJcbiAgICBpZiB3YW50c1RvUGxheVxyXG4gICAgICBkZXNpcmVkUm90YXRpb24gPSBDQVJEX0hPTERJTkdfUk9UX1BMQVlcclxuICAgICAgcG9zaXRpb25Db3VudC0tXHJcbiAgICBwb3NpdGlvbnMgPSBAY2FsY1Bvc2l0aW9ucyhwb3NpdGlvbkNvdW50KVxyXG4gICAgZHJhd0luZGV4ID0gMFxyXG4gICAgZm9yIGNhcmQsaSBpbiBkcmF3bkhhbmRcclxuICAgICAgYW5pbSA9IEBhbmltc1tjYXJkXVxyXG4gICAgICBpZiBpID09IEBkcmFnSW5kZXhDdXJyZW50XHJcbiAgICAgICAgYW5pbS5yZXEueCA9IEBkcmFnWFxyXG4gICAgICAgIGFuaW0ucmVxLnkgPSBAZHJhZ1lcclxuICAgICAgICBhbmltLnJlcS5yID0gZGVzaXJlZFJvdGF0aW9uXHJcbiAgICAgICAgaWYgbm90IHdhbnRzVG9QbGF5XHJcbiAgICAgICAgICBkcmF3SW5kZXgrK1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcG9zID0gcG9zaXRpb25zW2RyYXdJbmRleF1cclxuICAgICAgICBhbmltLnJlcS54ID0gcG9zLnhcclxuICAgICAgICBhbmltLnJlcS55ID0gcG9zLnlcclxuICAgICAgICBhbmltLnJlcS5yID0gcG9zLnJcclxuICAgICAgICBkcmF3SW5kZXgrK1xyXG5cclxuICAjIGltbWVkaWF0ZWx5IHdhcnAgYWxsIGNhcmRzIHRvIHdoZXJlIHRoZXkgc2hvdWxkIGJlXHJcbiAgd2FycDogLT5cclxuICAgIGZvciBjYXJkLGFuaW0gb2YgQGFuaW1zXHJcbiAgICAgIGFuaW0ud2FycCgpXHJcblxyXG4gICMgcmVvcmRlciB0aGUgaGFuZCBiYXNlZCBvbiB0aGUgZHJhZyBsb2NhdGlvbiBvZiB0aGUgaGVsZCBjYXJkXHJcbiAgcmVvcmRlcjogLT5cclxuICAgIHJldHVybiBpZiBAZHJhZ0luZGV4U3RhcnQgPT0gTk9fQ0FSRFxyXG4gICAgcmV0dXJuIGlmIEBjYXJkcy5sZW5ndGggPCAyICMgbm90aGluZyB0byByZW9yZGVyXHJcbiAgICBwb3NpdGlvbnMgPSBAY2FsY1Bvc2l0aW9ucyhAY2FyZHMubGVuZ3RoKVxyXG4gICAgY2xvc2VzdEluZGV4ID0gMFxyXG4gICAgY2xvc2VzdERpc3QgPSBAZ2FtZS53aWR0aCAqIEBnYW1lLmhlaWdodCAjIHNvbWV0aGluZyBpbXBvc3NpYmx5IGxhcmdlXHJcbiAgICBmb3IgcG9zLCBpbmRleCBpbiBwb3NpdGlvbnNcclxuICAgICAgZGlzdCA9IGNhbGNEaXN0YW5jZVNxdWFyZWQocG9zLngsIHBvcy55LCBAZHJhZ1gsIEBkcmFnWSlcclxuICAgICAgaWYgY2xvc2VzdERpc3QgPiBkaXN0XHJcbiAgICAgICAgY2xvc2VzdERpc3QgPSBkaXN0XHJcbiAgICAgICAgY2xvc2VzdEluZGV4ID0gaW5kZXhcclxuICAgIEBkcmFnSW5kZXhDdXJyZW50ID0gY2xvc2VzdEluZGV4XHJcblxyXG4gIGRvd246IChAZHJhZ1gsIEBkcmFnWSwgaW5kZXgpIC0+XHJcbiAgICBAdXAoQGRyYWdYLCBAZHJhZ1kpICMgZW5zdXJlIHdlIGxldCBnbyBvZiB0aGUgcHJldmlvdXMgY2FyZCBpbiBjYXNlIHRoZSBldmVudHMgYXJlIGR1bWJcclxuICAgIEBnYW1lLmxvZyBcInBpY2tpbmcgdXAgY2FyZCBpbmRleCAje2luZGV4fVwiXHJcbiAgICBAZHJhZ0luZGV4U3RhcnQgPSBpbmRleFxyXG4gICAgQGRyYWdJbmRleEN1cnJlbnQgPSBpbmRleFxyXG4gICAgQHVwZGF0ZVBvc2l0aW9ucygpXHJcblxyXG4gIG1vdmU6IChAZHJhZ1gsIEBkcmFnWSkgLT5cclxuICAgIHJldHVybiBpZiBAZHJhZ0luZGV4U3RhcnQgPT0gTk9fQ0FSRFxyXG4gICAgI0BnYW1lLmxvZyBcImRyYWdnaW5nIGFyb3VuZCBjYXJkIGluZGV4ICN7QGRyYWdJbmRleEN1cnJlbnR9XCJcclxuICAgIEByZW9yZGVyKClcclxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxyXG5cclxuICB1cDogKEBkcmFnWCwgQGRyYWdZKSAtPlxyXG4gICAgcmV0dXJuIGlmIEBkcmFnSW5kZXhTdGFydCA9PSBOT19DQVJEXHJcbiAgICBAcmVvcmRlcigpXHJcbiAgICBpZiBAd2FudHNUb1BsYXlEcmFnZ2VkQ2FyZCgpXHJcbiAgICAgIEBnYW1lLmxvZyBcInRyeWluZyB0byBwbGF5IGEgI3tAY2FyZHNbQGRyYWdJbmRleFN0YXJ0XX0gZnJvbSBpbmRleCAje0BkcmFnSW5kZXhTdGFydH1cIlxyXG4gICAgICBjYXJkSW5kZXggPSBAZHJhZ0luZGV4U3RhcnRcclxuICAgICAgY2FyZCA9IEBjYXJkc1tjYXJkSW5kZXhdXHJcbiAgICAgIGFuaW0gPSBAYW5pbXNbY2FyZF1cclxuICAgICAgQGRyYWdJbmRleFN0YXJ0ID0gTk9fQ0FSRFxyXG4gICAgICBAZHJhZ0luZGV4Q3VycmVudCA9IE5PX0NBUkRcclxuICAgICAgQGdhbWUucGxheSBjYXJkLCBhbmltLmN1ci54LCBhbmltLmN1ci55LCBhbmltLmN1ci5yLCBjYXJkSW5kZXhcclxuICAgIGVsc2VcclxuICAgICAgQGdhbWUubG9nIFwidHJ5aW5nIHRvIHJlb3JkZXIgI3tAY2FyZHNbQGRyYWdJbmRleFN0YXJ0XX0gaW50byBpbmRleCAje0BkcmFnSW5kZXhDdXJyZW50fVwiXHJcbiAgICAgIEBjYXJkcyA9IEBjYWxjRHJhd25IYW5kKCkgIyBpcyB0aGlzIHJpZ2h0P1xyXG5cclxuICAgIEBkcmFnSW5kZXhTdGFydCA9IE5PX0NBUkRcclxuICAgIEBkcmFnSW5kZXhDdXJyZW50ID0gTk9fQ0FSRFxyXG4gICAgQHVwZGF0ZVBvc2l0aW9ucygpXHJcblxyXG4gIHVwZGF0ZTogKGR0KSAtPlxyXG4gICAgdXBkYXRlZCA9IGZhbHNlXHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBpZiBhbmltLnVwZGF0ZShkdClcclxuICAgICAgICB1cGRhdGVkID0gdHJ1ZVxyXG4gICAgcmV0dXJuIHVwZGF0ZWRcclxuXHJcbiAgcmVuZGVyOiAtPlxyXG4gICAgcmV0dXJuIGlmIEBjYXJkcy5sZW5ndGggPT0gMFxyXG4gICAgZHJhd25IYW5kID0gQGNhbGNEcmF3bkhhbmQoKVxyXG4gICAgZm9yIHYsIGluZGV4IGluIGRyYXduSGFuZFxyXG4gICAgICBjb250aW51ZSBpZiB2ID09IE5PX0NBUkRcclxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxyXG4gICAgICBkbyAoYW5pbSwgaW5kZXgpID0+XHJcbiAgICAgICAgQHJlbmRlckNhcmQgdiwgYW5pbS5jdXIueCwgYW5pbS5jdXIueSwgYW5pbS5jdXIuciwgMSwgKGNsaWNrWCwgY2xpY2tZKSA9PlxyXG4gICAgICAgICAgQGRvd24oY2xpY2tYLCBjbGlja1ksIGluZGV4KVxyXG5cclxuICByZW5kZXJDYXJkOiAodiwgeCwgeSwgcm90LCBzY2FsZSwgY2IpIC0+XHJcbiAgICByb3QgPSAwIGlmIG5vdCByb3RcclxuICAgIHJhbmsgPSBNYXRoLmZsb29yKHYgJSAxMylcclxuICAgIHN1aXQgPSBNYXRoLmZsb29yKHYgLyAxMylcclxuXHJcbiAgICBAZ2FtZS5kcmF3SW1hZ2UgXCJjYXJkc1wiLFxyXG4gICAgQ0FSRF9JTUFHRV9PRkZfWCArIChDQVJEX0lNQUdFX0FEVl9YICogcmFuayksIENBUkRfSU1BR0VfT0ZGX1kgKyAoQ0FSRF9JTUFHRV9BRFZfWSAqIHN1aXQpLCBDQVJEX0lNQUdFX1csIENBUkRfSU1BR0VfSCxcclxuICAgIHgsIHksIEBjYXJkV2lkdGggKiBzY2FsZSwgQGNhcmRIZWlnaHQgKiBzY2FsZSxcclxuICAgIHJvdCwgMC41LCAwLjUsIDEsMSwxLDEsIGNiXHJcblxyXG4gIGNhbGNQb3NpdGlvbnM6IChoYW5kU2l6ZSkgLT5cclxuICAgIGlmIEBwb3NpdGlvbkNhY2hlLmhhc093blByb3BlcnR5KGhhbmRTaXplKVxyXG4gICAgICByZXR1cm4gQHBvc2l0aW9uQ2FjaGVbaGFuZFNpemVdXHJcbiAgICByZXR1cm4gW10gaWYgaGFuZFNpemUgPT0gMFxyXG5cclxuICAgIGFkdmFuY2UgPSBAaGFuZEFuZ2xlIC8gaGFuZFNpemVcclxuICAgIGlmIGFkdmFuY2UgPiBAaGFuZEFuZ2xlQWR2YW5jZU1heFxyXG4gICAgICBhZHZhbmNlID0gQGhhbmRBbmdsZUFkdmFuY2VNYXhcclxuICAgIGFuZ2xlU3ByZWFkID0gYWR2YW5jZSAqIGhhbmRTaXplICAgICAgICAgICAgICAgICMgaG93IG11Y2ggb2YgdGhlIGFuZ2xlIHdlIHBsYW4gb24gdXNpbmdcclxuICAgIGFuZ2xlTGVmdG92ZXIgPSBAaGFuZEFuZ2xlIC0gYW5nbGVTcHJlYWQgICAgICAgICMgYW1vdW50IG9mIGFuZ2xlIHdlJ3JlIG5vdCB1c2luZywgYW5kIG5lZWQgdG8gcGFkIHNpZGVzIHdpdGggZXZlbmx5XHJcbiAgICBjdXJyZW50QW5nbGUgPSAtMSAqIChAaGFuZEFuZ2xlIC8gMikgICAgICAgICAgICAjIG1vdmUgdG8gdGhlIGxlZnQgc2lkZSBvZiBvdXIgYW5nbGVcclxuICAgIGN1cnJlbnRBbmdsZSArPSBhbmdsZUxlZnRvdmVyIC8gMiAgICAgICAgICAgICAgICMgLi4uIGFuZCBhZHZhbmNlIHBhc3QgaGFsZiBvZiB0aGUgcGFkZGluZ1xyXG4gICAgY3VycmVudEFuZ2xlICs9IGFkdmFuY2UgLyAyICAgICAgICAgICAgICAgICAgICAgIyAuLi4gYW5kIGNlbnRlciB0aGUgY2FyZHMgaW4gdGhlIGFuZ2xlXHJcblxyXG4gICAgcG9zaXRpb25zID0gW11cclxuICAgIGZvciBpIGluIFswLi4uaGFuZFNpemVdXHJcbiAgICAgIHggPSBAaGFuZENlbnRlci54IC0gTWF0aC5jb3MoKE1hdGguUEkgLyAyKSArIGN1cnJlbnRBbmdsZSkgKiBAaGFuZERpc3RhbmNlXHJcbiAgICAgIHkgPSBAaGFuZENlbnRlci55IC0gTWF0aC5zaW4oKE1hdGguUEkgLyAyKSArIGN1cnJlbnRBbmdsZSkgKiBAaGFuZERpc3RhbmNlXHJcbiAgICAgIGN1cnJlbnRBbmdsZSArPSBhZHZhbmNlXHJcbiAgICAgIHBvc2l0aW9ucy5wdXNoIHtcclxuICAgICAgICB4OiB4XHJcbiAgICAgICAgeTogeVxyXG4gICAgICAgIHI6IGN1cnJlbnRBbmdsZSAtIGFkdmFuY2VcclxuICAgICAgfVxyXG5cclxuICAgIEBwb3NpdGlvbkNhY2hlW2hhbmRTaXplXSA9IHBvc2l0aW9uc1xyXG4gICAgcmV0dXJuIHBvc2l0aW9uc1xyXG5cclxuICByZW5kZXJIYW5kOiAtPlxyXG4gICAgcmV0dXJuIGlmIEBoYW5kLmxlbmd0aCA9PSAwXHJcbiAgICBmb3IgdixpbmRleCBpbiBAaGFuZFxyXG4gICAgICBkbyAoaW5kZXgpID0+XHJcbiAgICAgICAgQHJlbmRlckNhcmQgdiwgeCwgeSwgY3VycmVudEFuZ2xlLCAxLCAoY2xpY2tYLCBjbGlja1kpID0+XHJcbiAgICAgICAgICBAZG93bihjbGlja1gsIGNsaWNrWSwgaW5kZXgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRcclxuIiwiQnV0dG9uID0gcmVxdWlyZSAnLi9CdXR0b24nXHJcblxyXG5jbGFzcyBNZW51XHJcbiAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHRpdGxlLCBAYmFja2dyb3VuZCwgQGNvbG9yLCBAYWN0aW9ucykgLT5cclxuICAgIEBidXR0b25zID0gW11cclxuICAgIEBidXR0b25OYW1lcyA9IFtcImJ1dHRvbjBcIiwgXCJidXR0b24xXCJdXHJcblxyXG4gICAgYnV0dG9uU2l6ZSA9IEBnYW1lLmhlaWdodCAvIDE1XHJcbiAgICBAYnV0dG9uU3RhcnRZID0gQGdhbWUuaGVpZ2h0IC8gNVxyXG5cclxuICAgIHNsaWNlID0gKEBnYW1lLmhlaWdodCAtIEBidXR0b25TdGFydFkpIC8gKEBhY3Rpb25zLmxlbmd0aCArIDEpXHJcbiAgICBjdXJyWSA9IEBidXR0b25TdGFydFkgKyBzbGljZVxyXG4gICAgZm9yIGFjdGlvbiBpbiBAYWN0aW9uc1xyXG4gICAgICBidXR0b24gPSBuZXcgQnV0dG9uKEBnYW1lLCBAYnV0dG9uTmFtZXMsIEBnYW1lLmZvbnQsIGJ1dHRvblNpemUsIEBnYW1lLmNlbnRlci54LCBjdXJyWSwgYWN0aW9uKVxyXG4gICAgICBAYnV0dG9ucy5wdXNoIGJ1dHRvblxyXG4gICAgICBjdXJyWSArPSBzbGljZVxyXG5cclxuICB1cGRhdGU6IChkdCkgLT5cclxuICAgIHVwZGF0ZWQgPSBmYWxzZVxyXG4gICAgZm9yIGJ1dHRvbiBpbiBAYnV0dG9uc1xyXG4gICAgICBpZiBidXR0b24udXBkYXRlKGR0KVxyXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICByZXR1cm4gdXBkYXRlZFxyXG5cclxuICByZW5kZXI6IC0+XHJcbiAgICBAZ2FtZS5zcHJpdGVSZW5kZXJlci5yZW5kZXIgQGJhY2tncm91bmQsIDAsIDAsIEBnYW1lLndpZHRoLCBAZ2FtZS5oZWlnaHQsIDAsIDAsIDAsIEBjb2xvclxyXG4gICAgQGdhbWUuZm9udFJlbmRlcmVyLnJlbmRlciBAZ2FtZS5mb250LCBAZ2FtZS5oZWlnaHQgLyAyNSwgXCJCdWlsZDogI3tAZ2FtZS52ZXJzaW9ufVwiLCAwLCBAZ2FtZS5oZWlnaHQsIDAsIDEsIEBnYW1lLmNvbG9ycy5saWdodGdyYXlcclxuICAgIHRpdGxlSGVpZ2h0ID0gQGdhbWUuaGVpZ2h0IC8gOFxyXG4gICAgdGl0bGVPZmZzZXQgPSBAYnV0dG9uU3RhcnRZID4+IDFcclxuICAgIEBnYW1lLmZvbnRSZW5kZXJlci5yZW5kZXIgQGdhbWUuZm9udCwgdGl0bGVIZWlnaHQsIEB0aXRsZSwgQGdhbWUuY2VudGVyLngsIHRpdGxlT2Zmc2V0LCAwLjUsIDAuNSwgQGdhbWUuY29sb3JzLndoaXRlXHJcbiAgICBmb3IgYnV0dG9uIGluIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi5yZW5kZXIoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51XHJcbiIsIkFuaW1hdGlvbiA9IHJlcXVpcmUgJy4vQW5pbWF0aW9uJ1xyXG5cclxuU0VUVExFX01TID0gMTAwMFxyXG5cclxuY2xhc3MgUGlsZVxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBoYW5kKSAtPlxyXG4gICAgQHBpbGUgPSBbXVxyXG4gICAgQHBpbGVXaG8gPSBbXVxyXG4gICAgQHRyaWNrID0gW11cclxuICAgIEB0cmlja1dobyA9IFtdXHJcbiAgICBAYW5pbXMgPSB7fVxyXG4gICAgQHBpbGVJRCA9IC0xXHJcbiAgICBAdHJpY2tUYWtlciA9IFwiXCJcclxuICAgIEBzZXR0bGVUaW1lciA9IDBcclxuICAgIEB0cmlja0NvbG9yID0geyByOiAxLCBnOiAxLCBiOiAwLCBhOiAxfVxyXG4gICAgQHBsYXllckNvdW50ID0gMlxyXG4gICAgQHNjYWxlID0gMC42XHJcblxyXG4gICAgY2VudGVyWCA9IEBnYW1lLmNlbnRlci54XHJcbiAgICBjZW50ZXJZID0gQGdhbWUuY2VudGVyLnlcclxuICAgIG9mZnNldFggPSBAaGFuZC5jYXJkV2lkdGggKiBAc2NhbGVcclxuICAgIG9mZnNldFkgPSBAaGFuZC5jYXJkSGFsZkhlaWdodCAqIEBzY2FsZVxyXG4gICAgQHBpbGVMb2NhdGlvbnMgPVxyXG4gICAgICAyOiBbXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgYm90dG9tXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZIC0gb2Zmc2V0WSB9ICMgdG9wXHJcbiAgICAgIF1cclxuICAgICAgMzogW1xyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIGJvdHRvbVxyXG4gICAgICAgIHsgeDogY2VudGVyWCAtIG9mZnNldFgsIHk6IGNlbnRlclkgfSAjIGxlZnRcclxuICAgICAgICB7IHg6IGNlbnRlclggKyBvZmZzZXRYLCB5OiBjZW50ZXJZIH0gIyByaWdodFxyXG4gICAgICBdXHJcbiAgICAgIDQ6IFtcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IGNlbnRlclkgKyBvZmZzZXRZIH0gIyBib3R0b21cclxuICAgICAgICB7IHg6IGNlbnRlclggLSBvZmZzZXRYLCB5OiBjZW50ZXJZIH0gIyBsZWZ0XHJcbiAgICAgICAgeyB4OiBjZW50ZXJYLCB5OiBjZW50ZXJZIC0gb2Zmc2V0WSB9ICMgdG9wXHJcbiAgICAgICAgeyB4OiBjZW50ZXJYICsgb2Zmc2V0WCwgeTogY2VudGVyWSB9ICMgcmlnaHRcclxuICAgICAgXVxyXG4gICAgQHRocm93TG9jYXRpb25zID1cclxuICAgICAgMjogW1xyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogQGdhbWUuaGVpZ2h0IH0gIyBib3R0b21cclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IDAgfSAjIHRvcFxyXG4gICAgICBdXHJcbiAgICAgIDM6IFtcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IEBnYW1lLmhlaWdodCB9ICMgYm90dG9tXHJcbiAgICAgICAgeyB4OiAwLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgbGVmdFxyXG4gICAgICAgIHsgeDogQGdhbWUud2lkdGgsIHk6IGNlbnRlclkgKyBvZmZzZXRZIH0gIyByaWdodFxyXG4gICAgICBdXHJcbiAgICAgIDQ6IFtcclxuICAgICAgICB7IHg6IGNlbnRlclgsIHk6IEBnYW1lLmhlaWdodCB9ICMgYm90dG9tXHJcbiAgICAgICAgeyB4OiAwLCB5OiBjZW50ZXJZICsgb2Zmc2V0WSB9ICMgbGVmdFxyXG4gICAgICAgIHsgeDogY2VudGVyWCwgeTogMCB9ICMgdG9wXHJcbiAgICAgICAgeyB4OiBAZ2FtZS53aWR0aCwgeTogY2VudGVyWSArIG9mZnNldFkgfSAjIHJpZ2h0XHJcbiAgICAgIF1cclxuXHJcbiAgc2V0OiAocGlsZUlELCBwaWxlLCBwaWxlV2hvLCB0cmljaywgdHJpY2tXaG8sIHRyaWNrVGFrZXIsIEBwbGF5ZXJDb3VudCwgZmlyc3RUaHJvdykgLT5cclxuICAgIGlmIChAcGlsZUlEICE9IHBpbGVJRCkgYW5kICh0cmljay5sZW5ndGggPiAwKVxyXG4gICAgICBAcGlsZSA9IHRyaWNrLnNsaWNlKDApICMgdGhlIHBpbGUgaGFzIGJlY29tZSB0aGUgdHJpY2ssIHN0YXNoIGl0IG9mZiBvbmUgbGFzdCB0aW1lXHJcbiAgICAgIEBwaWxlV2hvID0gdHJpY2tXaG8uc2xpY2UoMClcclxuICAgICAgQHBpbGVJRCA9IHBpbGVJRFxyXG4gICAgICBAc2V0dGxlVGltZXIgPSBTRVRUTEVfTVNcclxuXHJcbiAgICAjIGRvbid0IHN0b21wIHRoZSBwaWxlIHdlJ3JlIGRyYXdpbmcgdW50aWwgaXQgaXMgZG9uZSBzZXR0bGluZyBhbmQgY2FuIGZseSBvZmYgdGhlIHNjcmVlblxyXG4gICAgaWYgQHNldHRsZVRpbWVyID09IDBcclxuICAgICAgQHBpbGUgPSBwaWxlLnNsaWNlKDApXHJcbiAgICAgIEBwaWxlV2hvID0gcGlsZVdoby5zbGljZSgwKVxyXG4gICAgICBAdHJpY2sgPSB0cmljay5zbGljZSgwKVxyXG4gICAgICBAdHJpY2tXaG8gPSB0cmlja1doby5zbGljZSgwKVxyXG4gICAgICBAdHJpY2tUYWtlciA9IHRyaWNrVGFrZXJcclxuXHJcbiAgICBAc3luY0FuaW1zKClcclxuXHJcbiAgaGludDogKHYsIHgsIHksIHIpIC0+XHJcbiAgICBAYW5pbXNbdl0gPSBuZXcgQW5pbWF0aW9uIHtcclxuICAgICAgc3BlZWQ6IEBoYW5kLmNhcmRTcGVlZFxyXG4gICAgICB4OiB4XHJcbiAgICAgIHk6IHlcclxuICAgICAgcjogclxyXG4gICAgICBzOiAxXHJcbiAgICB9XHJcblxyXG4gIHN5bmNBbmltczogLT5cclxuICAgIHNlZW4gPSB7fVxyXG4gICAgbG9jYXRpb25zID0gQHRocm93TG9jYXRpb25zW0BwbGF5ZXJDb3VudF1cclxuICAgIGZvciBjYXJkLCBpbmRleCBpbiBAcGlsZVxyXG4gICAgICBzZWVuW2NhcmRdKytcclxuICAgICAgaWYgbm90IEBhbmltc1tjYXJkXVxyXG4gICAgICAgIHdobyA9IEBwaWxlV2hvW2luZGV4XVxyXG4gICAgICAgIGxvY2F0aW9uID0gbG9jYXRpb25zW3dob11cclxuICAgICAgICBAYW5pbXNbY2FyZF0gPSBuZXcgQW5pbWF0aW9uIHtcclxuICAgICAgICAgIHNwZWVkOiBAaGFuZC5jYXJkU3BlZWRcclxuICAgICAgICAgIHg6IGxvY2F0aW9uLnhcclxuICAgICAgICAgIHk6IGxvY2F0aW9uLnlcclxuICAgICAgICAgIHI6IC0xICogTWF0aC5QSSAvIDRcclxuICAgICAgICAgIHM6IEBzY2FsZVxyXG4gICAgICAgIH1cclxuICAgIGZvciBjYXJkIGluIEB0cmlja1xyXG4gICAgICBzZWVuW2NhcmRdKytcclxuICAgICAgaWYgbm90IEBhbmltc1tjYXJkXVxyXG4gICAgICAgIEBhbmltc1tjYXJkXSA9IG5ldyBBbmltYXRpb24ge1xyXG4gICAgICAgICAgc3BlZWQ6IEBoYW5kLmNhcmRTcGVlZFxyXG4gICAgICAgICAgeDogLTEgKiBAaGFuZC5jYXJkSGFsZldpZHRoXHJcbiAgICAgICAgICB5OiAtMSAqIEBoYW5kLmNhcmRIYWxmV2lkdGhcclxuICAgICAgICAgIHI6IC0xICogTWF0aC5QSSAvIDJcclxuICAgICAgICAgIHM6IDFcclxuICAgICAgICB9XHJcbiAgICB0b1JlbW92ZSA9IFtdXHJcbiAgICBmb3IgY2FyZCxhbmltIG9mIEBhbmltc1xyXG4gICAgICBpZiBub3Qgc2Vlbi5oYXNPd25Qcm9wZXJ0eShjYXJkKVxyXG4gICAgICAgIHRvUmVtb3ZlLnB1c2ggY2FyZFxyXG4gICAgZm9yIGNhcmQgaW4gdG9SZW1vdmVcclxuICAgICAgIyBAZ2FtZS5sb2cgXCJyZW1vdmluZyBhbmltIGZvciAje2NhcmR9XCJcclxuICAgICAgZGVsZXRlIEBhbmltc1tjYXJkXVxyXG5cclxuICAgIEB1cGRhdGVQb3NpdGlvbnMoKVxyXG5cclxuICB1cGRhdGVQb3NpdGlvbnM6IC0+XHJcbiAgICBsb2NhdGlvbnMgPSBAcGlsZUxvY2F0aW9uc1tAcGxheWVyQ291bnRdXHJcbiAgICBmb3IgdiwgaW5kZXggaW4gQHBpbGVcclxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxyXG4gICAgICBsb2MgPSBAcGlsZVdob1tpbmRleF1cclxuICAgICAgYW5pbS5yZXEueCA9IGxvY2F0aW9uc1tsb2NdLnhcclxuICAgICAgYW5pbS5yZXEueSA9IGxvY2F0aW9uc1tsb2NdLnlcclxuICAgICAgYW5pbS5yZXEuciA9IDBcclxuICAgICAgYW5pbS5yZXEucyA9IEBzY2FsZVxyXG5cclxuICAgIGZvciBfLCBpbmRleCBpbiBAdHJpY2tcclxuICAgICAgaSA9IEB0cmljay5sZW5ndGggLSBpbmRleCAtIDFcclxuICAgICAgdiA9IEB0cmlja1tpXVxyXG4gICAgICBhbmltID0gQGFuaW1zW3ZdXHJcbiAgICAgIGFuaW0ucmVxLnggPSAoQGdhbWUud2lkdGggKyBAaGFuZC5jYXJkSGFsZldpZHRoKSAtICgoaW5kZXgrMSkgKiAoQGhhbmQuY2FyZFdpZHRoIC8gNSkpXHJcbiAgICAgIGFuaW0ucmVxLnkgPSAoQGdhbWUucGF1c2VCdXR0b25TaXplICogMS41KSArIEBoYW5kLmNhcmRIYWxmSGVpZ2h0XHJcbiAgICAgIGFuaW0ucmVxLnIgPSAwXHJcbiAgICAgIGFuaW0ucmVxLnMgPSAxXHJcblxyXG4gIHJlYWR5Rm9yTmV4dFRyaWNrOiAtPlxyXG4gICAgcmV0dXJuIChAc2V0dGxlVGltZXIgPT0gMClcclxuXHJcbiAgdXBkYXRlOiAoZHQpIC0+XHJcbiAgICB1cGRhdGVkID0gZmFsc2VcclxuXHJcbiAgICBpZiBAc2V0dGxlVGltZXIgPiAwXHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcbiAgICAgIEBzZXR0bGVUaW1lciAtPSBkdFxyXG4gICAgICBpZiBAc2V0dGxlVGltZXIgPCAwXHJcbiAgICAgICAgQHNldHRsZVRpbWVyID0gMFxyXG5cclxuICAgIGZvciBjYXJkLGFuaW0gb2YgQGFuaW1zXHJcbiAgICAgIGlmIGFuaW0udXBkYXRlKGR0KVxyXG4gICAgICAgIHVwZGF0ZWQgPSB0cnVlXHJcblxyXG4gICAgcmV0dXJuIHVwZGF0ZWRcclxuXHJcbiAgIyB1c2VkIGJ5IHRoZSBnYW1lIG92ZXIgc2NyZWVuLiBJdCByZXR1cm5zIHRydWUgd2hlbiBuZWl0aGVyIHRoZSBwaWxlIG5vciB0aGUgbGFzdCB0cmljayBhcmUgbW92aW5nXHJcbiAgcmVzdGluZzogLT5cclxuICAgIGZvciBjYXJkLGFuaW0gb2YgQGFuaW1zXHJcbiAgICAgIGlmIGFuaW0uYW5pbWF0aW5nKClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIGlmIEBzZXR0bGVUaW1lciA+IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICByZW5kZXI6IC0+XHJcbiAgICBmb3IgdiwgaW5kZXggaW4gQHBpbGVcclxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxyXG4gICAgICBAaGFuZC5yZW5kZXJDYXJkIHYsIGFuaW0uY3VyLngsIGFuaW0uY3VyLnksIGFuaW0uY3VyLnIsIGFuaW0uY3VyLnNcclxuXHJcbiAgICBmb3IgdiBpbiBAdHJpY2tcclxuICAgICAgYW5pbSA9IEBhbmltc1t2XVxyXG4gICAgICBAaGFuZC5yZW5kZXJDYXJkIHYsIGFuaW0uY3VyLngsIGFuaW0uY3VyLnksIGFuaW0uY3VyLnIsIGFuaW0uY3VyLnNcclxuXHJcbiAgICBpZiAoQHRyaWNrLmxlbmd0aCA+IDApIGFuZCAoQHRyaWNrVGFrZXIubGVuZ3RoID4gMClcclxuICAgICAgYW5pbSA9IEBhbmltc1tAdHJpY2tbMF1dXHJcbiAgICAgIGlmIGFuaW0/XHJcbiAgICAgICAgQGdhbWUuZm9udFJlbmRlcmVyLnJlbmRlciBAZ2FtZS5mb250LCBAZ2FtZS5hYUhlaWdodCAvIDMwLCBAdHJpY2tUYWtlciwgQGdhbWUud2lkdGgsIGFuaW0uY3VyLnkgKyBAaGFuZC5jYXJkSGFsZkhlaWdodCwgMSwgMCwgQHRyaWNrQ29sb3JcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGlsZVxyXG4iLCJjbGFzcyBTcHJpdGVSZW5kZXJlclxyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XHJcbiAgICBAc3ByaXRlcyA9XHJcbiAgICAgICMgZ2VuZXJpYyBzcHJpdGVzXHJcbiAgICAgIHNvbGlkOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6ICA1NSwgeTogNzIzLCB3OiAgMTAsIGg6ICAxMCB9XHJcbiAgICAgIHBhdXNlOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDYwMiwgeTogNzA3LCB3OiAxMjIsIGg6IDEyNSB9XHJcbiAgICAgIGJ1dHRvbjA6ICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDE0MCwgeTogNzc3LCB3OiA0MjIsIGg6ICA2NSB9XHJcbiAgICAgIGJ1dHRvbjE6ICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDE0MCwgeTogNjk4LCB3OiA0MjIsIGg6ICA2NSB9XHJcbiAgICAgIHBsdXMwOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDc0NSwgeTogNjY0LCB3OiAxMTYsIGg6IDExOCB9XHJcbiAgICAgIHBsdXMxOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDc0NSwgeTogODIwLCB3OiAxMTYsIGg6IDExOCB9XHJcbiAgICAgIG1pbnVzMDogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDg5NSwgeTogNjY0LCB3OiAxMTYsIGg6IDExOCB9XHJcbiAgICAgIG1pbnVzMTogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDg5NSwgeTogODIwLCB3OiAxMTYsIGg6IDExOCB9XHJcbiAgICAgIGFycm93TDogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6ICAzMywgeTogODU4LCB3OiAyMDQsIGg6IDE1NiB9XHJcbiAgICAgIGFycm93UjogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDIzOSwgeTogODUyLCB3OiAyMDgsIGg6IDE1NSB9XHJcblxyXG4gICAgICAjIG1lbnUgYmFja2dyb3VuZHNcclxuICAgICAgbWFpbm1lbnU6ICB7IHRleHR1cmU6IFwibWFpbm1lbnVcIiwgIHg6IDAsIHk6IDAsIHc6IDEyODAsIGg6IDcyMCB9XHJcbiAgICAgIHBhdXNlbWVudTogeyB0ZXh0dXJlOiBcInBhdXNlbWVudVwiLCB4OiAwLCB5OiAwLCB3OiAxMjgwLCBoOiA3MjAgfVxyXG5cclxuICAgICAgIyBob3d0b1xyXG4gICAgICBob3d0bzE6ICAgIHsgdGV4dHVyZTogXCJob3d0bzFcIiwgIHg6IDAsIHk6ICAwLCB3OiAxOTIwLCBoOiAxMDgwIH1cclxuICAgICAgaG93dG8yOiAgICB7IHRleHR1cmU6IFwiaG93dG8yXCIsICB4OiAwLCB5OiAgMCwgdzogMTkyMCwgaDogMTA4MCB9XHJcbiAgICAgIGhvd3RvMzogICAgeyB0ZXh0dXJlOiBcImhvd3RvM1wiLCAgeDogMCwgeTogIDAsIHc6IDE5MjAsIGg6IDEwODAgfVxyXG5cclxuICAgICAgIyBjaGFyYWN0ZXJzXHJcbiAgICAgIG1hcmlvOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6ICAyMCwgeTogICAwLCB3OiAxNTEsIGg6IDMwOCB9XHJcbiAgICAgIGx1aWdpOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDE3MSwgeTogICAwLCB3OiAxNTEsIGg6IDMwOCB9XHJcbiAgICAgIHBlYWNoOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDMzNSwgeTogICAwLCB3OiAxNjQsIGg6IDMwOCB9XHJcbiAgICAgIGRhaXN5OiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDUwNCwgeTogICAwLCB3OiAxNjQsIGg6IDMwOCB9XHJcbiAgICAgIHlvc2hpOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDY2OCwgeTogICAwLCB3OiAxODAsIGg6IDMwOCB9XHJcbiAgICAgIHRvYWQ6ICAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDg0OSwgeTogICAwLCB3OiAxNTcsIGg6IDMwOCB9XHJcbiAgICAgIGJvd3NlcjogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6ICAxMSwgeTogMzIyLCB3OiAxNTEsIGg6IDMwOCB9XHJcbiAgICAgIGJvd3NlcmpyOiAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDIyNSwgeTogMzIyLCB3OiAxNDQsIGg6IDMwOCB9XHJcbiAgICAgIGtvb3BhOiAgICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDM3MiwgeTogMzIyLCB3OiAxMjgsIGg6IDMwOCB9XHJcbiAgICAgIHJvc2FsaW5hOiAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDUwMCwgeTogMzIyLCB3OiAxNzMsIGg6IDMwOCB9XHJcbiAgICAgIHNoeWd1eTogICAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDY5MSwgeTogMzIyLCB3OiAxNTQsIGg6IDMwOCB9XHJcbiAgICAgIHRvYWRldHRlOiAgeyB0ZXh0dXJlOiBcImNoYXJzXCIsIHg6IDg0NywgeTogMzIyLCB3OiAxNTgsIGg6IDMwOCB9XHJcblxyXG4gIGNhbGNXaWR0aDogKHNwcml0ZU5hbWUsIGhlaWdodCkgLT5cclxuICAgIHNwcml0ZSA9IEBzcHJpdGVzW3Nwcml0ZU5hbWVdXHJcbiAgICByZXR1cm4gMSBpZiBub3Qgc3ByaXRlXHJcbiAgICByZXR1cm4gaGVpZ2h0ICogc3ByaXRlLncgLyBzcHJpdGUuaFxyXG5cclxuICByZW5kZXI6IChzcHJpdGVOYW1lLCBkeCwgZHksIGR3LCBkaCwgcm90LCBhbmNob3J4LCBhbmNob3J5LCBjb2xvciwgY2IpIC0+XHJcbiAgICBzcHJpdGUgPSBAc3ByaXRlc1tzcHJpdGVOYW1lXVxyXG4gICAgcmV0dXJuIGlmIG5vdCBzcHJpdGVcclxuICAgIGlmIChkdyA9PSAwKSBhbmQgKGRoID09IDApXHJcbiAgICAgICMgdGhpcyBwcm9iYWJseSBzaG91bGRuJ3QgZXZlciBiZSB1c2VkLlxyXG4gICAgICBkdyA9IHNwcml0ZS54XHJcbiAgICAgIGRoID0gc3ByaXRlLnlcclxuICAgIGVsc2UgaWYgZHcgPT0gMFxyXG4gICAgICBkdyA9IGRoICogc3ByaXRlLncgLyBzcHJpdGUuaFxyXG4gICAgZWxzZSBpZiBkaCA9PSAwXHJcbiAgICAgIGRoID0gZHcgKiBzcHJpdGUuaCAvIHNwcml0ZS53XHJcbiAgICBAZ2FtZS5kcmF3SW1hZ2Ugc3ByaXRlLnRleHR1cmUsIHNwcml0ZS54LCBzcHJpdGUueSwgc3ByaXRlLncsIHNwcml0ZS5oLCBkeCwgZHksIGR3LCBkaCwgcm90LCBhbmNob3J4LCBhbmNob3J5LCBjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iLCBjb2xvci5hLCBjYlxyXG4gICAgcmV0dXJuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZVJlbmRlcmVyXHJcbiIsIm1vZHVsZS5leHBvcnRzID1cclxuICBkYXJrZm9yZXN0OlxyXG4gICAgaGVpZ2h0OiA3MlxyXG4gICAgZ2x5cGhzOlxyXG4gICAgICAnOTcnIDogeyB4OiAgIDgsIHk6ICAgOCwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzk4JyA6IHsgeDogICA4LCB5OiAgNTgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICc5OScgOiB7IHg6ICA1MCwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTAwJzogeyB4OiAgIDgsIHk6IDExOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzEwMSc6IHsgeDogICA4LCB5OiAxNzgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMDInOiB7IHg6ICAgOCwgeTogMjI4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzMgfVxyXG4gICAgICAnMTAzJzogeyB4OiAgIDgsIHk6IDI3OCwgd2lkdGg6ICAzNiwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzEwNCc6IHsgeDogICA4LCB5OiAzMjgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMDUnOiB7IHg6ICAgOCwgeTogMzc4LCB3aWR0aDogIDEyLCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMTEgfVxyXG4gICAgICAnMTA2JzogeyB4OiAgIDgsIHk6IDQyOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzEwNyc6IHsgeDogIDI4LCB5OiAzNzgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQxLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMDgnOiB7IHg6ICA1MSwgeTogMzI4LCB3aWR0aDogIDM0LCBoZWlnaHQ6ICA0MSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzMgfVxyXG4gICAgICAnMTA5JzogeyB4OiAgNTEsIHk6IDQyNywgd2lkdGg6ICAzOCwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzExMCc6IHsgeDogIDcxLCB5OiAzNzcsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMTEnOiB7IHg6ICA5NywgeTogNDI3LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTEyJzogeyB4OiAgNTEsIHk6ICA1OCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzExMyc6IHsgeDogIDUxLCB5OiAxMDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQ1LCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICcxMTQnOiB7IHg6ICA5MywgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnMTE1JzogeyB4OiAgNTEsIHk6IDE2MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDIsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzExNic6IHsgeDogIDUxLCB5OiAyMTEsIHdpZHRoOiAgMzUsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzMyB9XHJcbiAgICAgICcxMTcnOiB7IHg6ICA1MiwgeTogMjYxLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA0MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnMTE4JzogeyB4OiAgOTMsIHk6IDMxMSwgd2lkdGg6ICAzNCwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDMyIH1cclxuICAgICAgJzExOSc6IHsgeDogMTE0LCB5OiAzNjAsIHdpZHRoOiAgMzgsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzOCB9XHJcbiAgICAgICcxMjAnOiB7IHg6IDE0MCwgeTogNDEwLCB3aWR0aDogIDM2LCBoZWlnaHQ6ICA0MSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMzEsIHhhZHZhbmNlOiAgMzcgfVxyXG4gICAgICAnMTIxJzogeyB4OiAxNDAsIHk6IDQ1OSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNDEsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDMxLCB4YWR2YW5jZTogIDM0IH1cclxuICAgICAgJzEyMic6IHsgeDogMTgzLCB5OiA0NTksIHdpZHRoOiAgMzYsIGhlaWdodDogIDQyLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAzMSwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc2NScgOiB7IHg6ICA5NCwgeTogIDU4LCB3aWR0aDogIDM0LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNjYnIDogeyB4OiAgOTQsIHk6IDExOSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzY3JyA6IHsgeDogIDk0LCB5OiAxODAsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc2OCcgOiB7IHg6ICA5NSwgeTogMjQxLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzcgfVxyXG4gICAgICAnNjknIDogeyB4OiAxMzYsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzcwJyA6IHsgeDogMTM3LCB5OiAgNjksIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICc3MScgOiB7IHg6IDE3OSwgeTogICA4LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNzInIDogeyB4OiAxMzcsIHk6IDEzMCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzczJyA6IHsgeDogMTM4LCB5OiAxOTEsIHdpZHRoOiAgMTIsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAxMyB9XHJcbiAgICAgICc3NCcgOiB7IHg6IDEzOCwgeTogMjUyLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzYgfVxyXG4gICAgICAnNzUnIDogeyB4OiAxNTgsIHk6IDE5MSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzc2JyA6IHsgeDogMTYwLCB5OiAzMTMsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNCB9XHJcbiAgICAgICc3NycgOiB7IHg6IDE4MSwgeTogMjUxLCB3aWR0aDogIDM4LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzkgfVxyXG4gICAgICAnNzgnIDogeyB4OiAxODQsIHk6IDM3NCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzc5JyA6IHsgeDogMjAzLCB5OiAzMTIsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc4MCcgOiB7IHg6IDE4MCwgeTogIDY5LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnODEnIDogeyB4OiAyMDEsIHk6IDEzMCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTYsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzgyJyA6IHsgeDogMjIyLCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc4MycgOiB7IHg6IDIyMywgeTogIDY5LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnODQnIDogeyB4OiAyNjUsIHk6ICAgOCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDMzIH1cclxuICAgICAgJzg1JyA6IHsgeDogMjI3LCB5OiAxOTQsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc4NicgOiB7IHg6IDI0NCwgeTogMTMwLCB3aWR0aDogIDQxLCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMTksIHhhZHZhbmNlOiAgMzkgfVxyXG4gICAgICAnODcnIDogeyB4OiAyNjYsIHk6ICA2OSwgd2lkdGg6ICAzOCwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzg4JyA6IHsgeDogMzA4LCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDEsIHlvZmZzZXQ6ICAxOSwgeGFkdmFuY2U6ICAzNSB9XHJcbiAgICAgICc4OScgOiB7IHg6IDIyNywgeTogMzczLCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMTksIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnOTAnIDogeyB4OiAyMjcsIHk6IDQzMywgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM1IH1cclxuICAgICAgJzMzJyA6IHsgeDogMjQ2LCB5OiAyNTUsIHdpZHRoOiAgMTQsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAxMSB9XHJcbiAgICAgICc1OScgOiB7IHg6IDE4MCwgeTogMTMwLCB3aWR0aDogIDEzLCBoZWlnaHQ6ICAzNywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNTYsIHhhZHZhbmNlOiAgMTMgfVxyXG4gICAgICAnMzcnIDogeyB4OiAgOTUsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzU4JyA6IHsgeDogMTYwLCB5OiAzNzQsIHdpZHRoOiAgMTMsIGhlaWdodDogIDIzLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA1MCwgeGFkdmFuY2U6ICAxMyB9XHJcbiAgICAgICc2MycgOiB7IHg6IDI2OCwgeTogMjU1LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzMgfVxyXG4gICAgICAnNDInIDogeyB4OiAxMDMsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzQwJyA6IHsgeDogMjcwLCB5OiAxOTAsIHdpZHRoOiAgMjMsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyMSB9XHJcbiAgICAgICc0MScgOiB7IHg6IDI5MywgeTogMTMwLCB3aWR0aDogIDIzLCBoZWlnaHQ6ICA1MiwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjEgfVxyXG4gICAgICAnOTUnIDogeyB4OiAxMTEsIHk6IDMwMiwgd2lkdGg6ICAgMCwgaGVpZ2h0OiAgIDAsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDcwLCB4YWR2YW5jZTogIDIyIH1cclxuICAgICAgJzQzJyA6IHsgeDogMjQ2LCB5OiAzMTYsIHdpZHRoOiAgMzUsIGhlaWdodDogIDM0LCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICAzOSwgeGFkdmFuY2U6ICAzMiB9XHJcbiAgICAgICc0NScgOiB7IHg6IDE4NCwgeTogNDM1LCB3aWR0aDogIDI2LCBoZWlnaHQ6ICAxMSwgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgNDQsIHhhZHZhbmNlOiAgMjUgfVxyXG4gICAgICAnNjEnIDogeyB4OiAzMTIsIHk6ICA2OCwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgMzAsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDQyLCB4YWR2YW5jZTogIDMzIH1cclxuICAgICAgJzQ2JyA6IHsgeDogMTM1LCB5OiAzMTMsIHdpZHRoOiAgMTQsIGhlaWdodDogIDExLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA2MSwgeGFkdmFuY2U6ICAxNCB9XHJcbiAgICAgICc0NCcgOiB7IHg6IDIyNywgeTogMjU1LCB3aWR0aDogIDEwLCBoZWlnaHQ6ICAyMSwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNjgsIHhhZHZhbmNlOiAgMTEgfVxyXG4gICAgICAnNDcnIDogeyB4OiAzNTEsIHk6ICAgOCwgd2lkdGg6ICAyOCwgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDE5LCB4YWR2YW5jZTogIDI2IH1cclxuICAgICAgJzEyNCc6IHsgeDogMTE5LCB5OiAzMDIsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICczNCcgOiB7IHg6IDEyNywgeTogMzAyLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMzknIDogeyB4OiAyMDEsIHk6IDE5NCwgd2lkdGg6ICAxOCwgaGVpZ2h0OiAgMTksIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogICAwLCB4YWR2YW5jZTogIDIxIH1cclxuICAgICAgJzY0JyA6IHsgeDogMjE4LCB5OiA0MzUsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICczNScgOiB7IHg6IDIxOCwgeTogNDQzLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMzYnIDogeyB4OiAzMDEsIHk6IDE5MCwgd2lkdGg6ICAzMiwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIyLCB4YWR2YW5jZTogIDI5IH1cclxuICAgICAgJzk0JyA6IHsgeDogMjE4LCB5OiA0NTEsIHdpZHRoOiAgIDAsIGhlaWdodDogICAwLCB4b2Zmc2V0OiAgIDAsIHlvZmZzZXQ6ICA3MCwgeGFkdmFuY2U6ICAyMiB9XHJcbiAgICAgICczOCcgOiB7IHg6IDI0NiwgeTogMzU4LCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgNzAsIHhhZHZhbmNlOiAgMjIgfVxyXG4gICAgICAnMTIzJzogeyB4OiAzMjQsIHk6IDEwNiwgd2lkdGg6ICAyNywgaGVpZ2h0OiAgNTIsIHhvZmZzZXQ6ICAgMCwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDI2IH1cclxuICAgICAgJzEyNSc6IHsgeDogMjcwLCB5OiAzNTgsIHdpZHRoOiAgMjcsIGhlaWdodDogIDUyLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAyNyB9XHJcbiAgICAgICc5MScgOiB7IHg6IDI3MCwgeTogNDE4LCB3aWR0aDogIDIyLCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAwLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjEgfVxyXG4gICAgICAnOTMnIDogeyB4OiAzMDAsIHk6IDQxOCwgd2lkdGg6ICAyMiwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMSwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDIwIH1cclxuICAgICAgJzQ4JyA6IHsgeDogMzA1LCB5OiAzMTYsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc0OScgOiB7IHg6IDMxMSwgeTogMjUxLCB3aWR0aDogIDM0LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAyLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnNTAnIDogeyB4OiAzNDEsIHk6IDE2Niwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzUxJyA6IHsgeDogMzU5LCB5OiAgNjgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc1MicgOiB7IHg6IDMzMCwgeTogMzc3LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzUgfVxyXG4gICAgICAnNTMnIDogeyB4OiAzNDgsIHk6IDMxMiwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMywgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM3IH1cclxuICAgICAgJzU0JyA6IHsgeDogMzMwLCB5OiA0MzgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDIsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICc1NScgOiB7IHg6IDM1MywgeTogMjI3LCB3aWR0aDogIDM1LCBoZWlnaHQ6ICA1MywgeG9mZnNldDogICAxLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMzQgfVxyXG4gICAgICAnNTYnIDogeyB4OiAzODQsIHk6IDEyOSwgd2lkdGg6ICAzNSwgaGVpZ2h0OiAgNTMsIHhvZmZzZXQ6ICAgMiwgeW9mZnNldDogIDIwLCB4YWR2YW5jZTogIDM2IH1cclxuICAgICAgJzU3JyA6IHsgeDogNDAyLCB5OiAgIDgsIHdpZHRoOiAgMzUsIGhlaWdodDogIDUzLCB4b2Zmc2V0OiAgIDMsIHlvZmZzZXQ6ICAyMCwgeGFkdmFuY2U6ICAzNiB9XHJcbiAgICAgICczMicgOiB7IHg6ICAgMCwgeTogICAwLCB3aWR0aDogICAwLCBoZWlnaHQ6ICAgMCwgeG9mZnNldDogICAzLCB5b2Zmc2V0OiAgMjAsIHhhZHZhbmNlOiAgMjIgfVxyXG4iLCIjIFRoaXMgZmlsZSBwcm92aWRlcyB0aGUgcmVuZGVyaW5nIGVuZ2luZSBmb3IgdGhlIHdlYiB2ZXJzaW9uLiBOb25lIG9mIHRoaXMgY29kZSBpcyBpbmNsdWRlZCBpbiB0aGUgSmF2YSB2ZXJzaW9uLlxyXG5cclxuY29uc29sZS5sb2cgJ3dlYiBzdGFydHVwJ1xyXG5cclxuR2FtZSA9IHJlcXVpcmUgJy4vR2FtZSdcclxuXHJcbiMgdGFrZW4gZnJvbSBodHRwOiNzdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiXHJcbmNvbXBvbmVudFRvSGV4ID0gKGMpIC0+XHJcbiAgaGV4ID0gTWF0aC5mbG9vcihjICogMjU1KS50b1N0cmluZygxNilcclxuICByZXR1cm4gaWYgaGV4Lmxlbmd0aCA9PSAxIHRoZW4gXCIwXCIgKyBoZXggZWxzZSBoZXhcclxucmdiVG9IZXggPSAociwgZywgYikgLT5cclxuICByZXR1cm4gXCIjXCIgKyBjb21wb25lbnRUb0hleChyKSArIGNvbXBvbmVudFRvSGV4KGcpICsgY29tcG9uZW50VG9IZXgoYilcclxuXHJcblNBVkVfVElNRVJfTVMgPSAzMDAwXHJcblxyXG5jbGFzcyBOYXRpdmVBcHBcclxuICBjb25zdHJ1Y3RvcjogKEBzY3JlZW4sIEB3aWR0aCwgQGhlaWdodCkgLT5cclxuICAgIEB0aW50ZWRUZXh0dXJlQ2FjaGUgPSBbXVxyXG4gICAgQGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgIEB0b3VjaE1vdXNlID0gbnVsbFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlZG93bicsICBAb25Nb3VzZURvd24uYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCAgQG9uTW91c2VNb3ZlLmJpbmQodGhpcyksIGZhbHNlXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsICAgIEBvbk1vdXNlVXAuYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICd0b3VjaHN0YXJ0JywgQG9uVG91Y2hTdGFydC5iaW5kKHRoaXMpLCBmYWxzZVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNobW92ZScsICBAb25Ub3VjaE1vdmUuYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICd0b3VjaGVuZCcsICAgQG9uVG91Y2hFbmQuYmluZCh0aGlzKSwgZmFsc2VcclxuICAgIEBjb250ZXh0ID0gQHNjcmVlbi5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEB0ZXh0dXJlcyA9IFtcclxuICAgICAgIyBhbGwgY2FyZCBhcnRcclxuICAgICAgXCIuLi9pbWFnZXMvY2FyZHMucG5nXCJcclxuICAgICAgIyBmb250c1xyXG4gICAgICBcIi4uL2ltYWdlcy9kYXJrZm9yZXN0LnBuZ1wiXHJcbiAgICAgICMgY2hhcmFjdGVycyAvIG90aGVyXHJcbiAgICAgIFwiLi4vaW1hZ2VzL2NoYXJzLnBuZ1wiXHJcbiAgICAgICMgaGVscFxyXG4gICAgICBcIi4uL2ltYWdlcy9ob3d0bzEucG5nXCJcclxuICAgICAgXCIuLi9pbWFnZXMvaG93dG8yLnBuZ1wiXHJcbiAgICAgIFwiLi4vaW1hZ2VzL2hvd3RvMy5wbmdcIlxyXG4gICAgXVxyXG5cclxuICAgIEBnYW1lID0gbmV3IEdhbWUodGhpcywgQHdpZHRoLCBAaGVpZ2h0KVxyXG5cclxuICAgIGlmIHR5cGVvZiBTdG9yYWdlICE9IFwidW5kZWZpbmVkXCJcclxuICAgICAgc3RhdGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSBcInN0YXRlXCJcclxuICAgICAgaWYgc3RhdGVcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwibG9hZGluZyBzdGF0ZTogI3tzdGF0ZX1cIlxyXG4gICAgICAgIEBnYW1lLmxvYWQgc3RhdGVcclxuXHJcbiAgICBAcGVuZGluZ0ltYWdlcyA9IDBcclxuICAgIGxvYWRlZFRleHR1cmVzID0gW11cclxuICAgIGZvciBpbWFnZVVybCBpbiBAdGV4dHVyZXNcclxuICAgICAgQHBlbmRpbmdJbWFnZXMrK1xyXG4gICAgICBjb25zb2xlLmxvZyBcImxvYWRpbmcgaW1hZ2UgI3tAcGVuZGluZ0ltYWdlc306ICN7aW1hZ2VVcmx9XCJcclxuICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgaW1nLm9ubG9hZCA9IEBvbkltYWdlTG9hZGVkLmJpbmQodGhpcylcclxuICAgICAgaW1nLnNyYyA9IGltYWdlVXJsXHJcbiAgICAgIGxvYWRlZFRleHR1cmVzLnB1c2ggaW1nXHJcbiAgICBAdGV4dHVyZXMgPSBsb2FkZWRUZXh0dXJlc1xyXG5cclxuICAgIEBzYXZlVGltZXIgPSBTQVZFX1RJTUVSX01TXHJcblxyXG4gIG9uSW1hZ2VMb2FkZWQ6IChpbmZvKSAtPlxyXG4gICAgQHBlbmRpbmdJbWFnZXMtLVxyXG4gICAgaWYgQHBlbmRpbmdJbWFnZXMgPT0gMFxyXG4gICAgICBjb25zb2xlLmxvZyAnQWxsIGltYWdlcyBsb2FkZWQuIEJlZ2lubmluZyByZW5kZXIgbG9vcC4nXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PiBAdXBkYXRlKClcclxuXHJcbiAgbG9nOiAocykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiTmF0aXZlQXBwLmxvZygpOiAje3N9XCJcclxuXHJcbiAgdXBkYXRlU2F2ZTogKGR0KSAtPlxyXG4gICAgcmV0dXJuIGlmIHR5cGVvZiBTdG9yYWdlID09IFwidW5kZWZpbmVkXCJcclxuICAgIEBzYXZlVGltZXIgLT0gZHRcclxuICAgIGlmIEBzYXZlVGltZXIgPD0gMFxyXG4gICAgICBAc2F2ZVRpbWVyID0gU0FWRV9USU1FUl9NU1xyXG4gICAgICBzdGF0ZSA9IEBnYW1lLnNhdmUoKVxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwic2F2aW5nOiAje3N0YXRlfVwiXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtIFwic3RhdGVcIiwgc3RhdGVcclxuXHJcbiAgZ2VuZXJhdGVUaW50SW1hZ2U6ICh0ZXh0dXJlSW5kZXgsIHJlZCwgZ3JlZW4sIGJsdWUpIC0+XHJcbiAgICBpbWcgPSBAdGV4dHVyZXNbdGV4dHVyZUluZGV4XVxyXG4gICAgYnVmZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJjYW52YXNcIlxyXG4gICAgYnVmZi53aWR0aCAgPSBpbWcud2lkdGhcclxuICAgIGJ1ZmYuaGVpZ2h0ID0gaW1nLmhlaWdodFxyXG5cclxuICAgIGN0eCA9IGJ1ZmYuZ2V0Q29udGV4dCBcIjJkXCJcclxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnY29weSdcclxuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKVxyXG4gICAgZmlsbENvbG9yID0gXCJyZ2IoI3tNYXRoLmZsb29yKHJlZCoyNTUpfSwgI3tNYXRoLmZsb29yKGdyZWVuKjI1NSl9LCAje01hdGguZmxvb3IoYmx1ZSoyNTUpfSlcIlxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgY29uc29sZS5sb2cgXCJmaWxsQ29sb3IgI3tmaWxsQ29sb3J9XCJcclxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbXVsdGlwbHknXHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgYnVmZi53aWR0aCwgYnVmZi5oZWlnaHQpXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2NvcHknXHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxLjBcclxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXHJcbiAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMClcclxuXHJcbiAgICBpbWdDb21wID0gbmV3IEltYWdlKClcclxuICAgIGltZ0NvbXAuc3JjID0gYnVmZi50b0RhdGFVUkwoKVxyXG4gICAgcmV0dXJuIGltZ0NvbXBcclxuXHJcbiAgZHJhd0ltYWdlOiAodGV4dHVyZUluZGV4LCBzcmNYLCBzcmNZLCBzcmNXLCBzcmNILCBkc3RYLCBkc3RZLCBkc3RXLCBkc3RILCByb3QsIGFuY2hvclgsIGFuY2hvclksIHIsIGcsIGIsIGEpIC0+XHJcbiAgICB0ZXh0dXJlID0gQHRleHR1cmVzW3RleHR1cmVJbmRleF1cclxuICAgIGlmIChyICE9IDEpIG9yIChnICE9IDEpIG9yIChiICE9IDEpXHJcbiAgICAgIHRpbnRlZFRleHR1cmVLZXkgPSBcIiN7dGV4dHVyZUluZGV4fS0je3J9LSN7Z30tI3tifVwiXHJcbiAgICAgIHRpbnRlZFRleHR1cmUgPSBAdGludGVkVGV4dHVyZUNhY2hlW3RpbnRlZFRleHR1cmVLZXldXHJcbiAgICAgIGlmIG5vdCB0aW50ZWRUZXh0dXJlXHJcbiAgICAgICAgdGludGVkVGV4dHVyZSA9IEBnZW5lcmF0ZVRpbnRJbWFnZSB0ZXh0dXJlSW5kZXgsIHIsIGcsIGJcclxuICAgICAgICBAdGludGVkVGV4dHVyZUNhY2hlW3RpbnRlZFRleHR1cmVLZXldID0gdGludGVkVGV4dHVyZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJnZW5lcmF0ZWQgY2FjaGVkIHRleHR1cmUgI3t0aW50ZWRUZXh0dXJlS2V5fVwiXHJcbiAgICAgIHRleHR1cmUgPSB0aW50ZWRUZXh0dXJlXHJcblxyXG4gICAgQGNvbnRleHQuc2F2ZSgpXHJcbiAgICBAY29udGV4dC50cmFuc2xhdGUgZHN0WCwgZHN0WVxyXG4gICAgQGNvbnRleHQucm90YXRlIHJvdCAjICogMy4xNDE1OTIgLyAxODAuMFxyXG4gICAgYW5jaG9yT2Zmc2V0WCA9IC0xICogYW5jaG9yWCAqIGRzdFdcclxuICAgIGFuY2hvck9mZnNldFkgPSAtMSAqIGFuY2hvclkgKiBkc3RIXHJcbiAgICBAY29udGV4dC50cmFuc2xhdGUgYW5jaG9yT2Zmc2V0WCwgYW5jaG9yT2Zmc2V0WVxyXG4gICAgQGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBhXHJcbiAgICBAY29udGV4dC5kcmF3SW1hZ2UodGV4dHVyZSwgc3JjWCwgc3JjWSwgc3JjVywgc3JjSCwgMCwgMCwgZHN0VywgZHN0SClcclxuICAgIEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcbiAgICBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgZHQgPSBub3cgLSBAbGFzdFRpbWVcclxuICAgIEBsYXN0VGltZSA9IG5vd1xyXG5cclxuICAgIEBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBAd2lkdGgsIEBoZWlnaHQpXHJcbiAgICBAZ2FtZS51cGRhdGUoZHQpXHJcbiAgICByZW5kZXJDb21tYW5kcyA9IEBnYW1lLnJlbmRlcigpXHJcblxyXG4gICAgaSA9IDBcclxuICAgIG4gPSByZW5kZXJDb21tYW5kcy5sZW5ndGhcclxuICAgIHdoaWxlIChpIDwgbilcclxuICAgICAgZHJhd0NhbGwgPSByZW5kZXJDb21tYW5kcy5zbGljZShpLCBpICs9IDE2KVxyXG4gICAgICBAZHJhd0ltYWdlLmFwcGx5KHRoaXMsIGRyYXdDYWxsKVxyXG5cclxuICAgIEB1cGRhdGVTYXZlKGR0KVxyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PiBAdXBkYXRlKClcclxuXHJcbiAgb25Ub3VjaFN0YXJ0OiAoZXZ0KSAtPlxyXG4gICAgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlc1xyXG4gICAgZm9yIHRvdWNoIGluIHRvdWNoZXNcclxuICAgICAgaWYgQHRvdWNoTW91c2UgPT0gbnVsbFxyXG4gICAgICAgIEB0b3VjaE1vdXNlID0gdG91Y2guaWRlbnRpZmllclxyXG4gICAgICBpZiBAdG91Y2hNb3VzZSA9PSB0b3VjaC5pZGVudGlmaWVyXHJcbiAgICAgICAgQGdhbWUudG91Y2hEb3duKHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpXHJcblxyXG4gIG9uVG91Y2hNb3ZlOiAoZXZ0KSAtPlxyXG4gICAgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlc1xyXG4gICAgZm9yIHRvdWNoIGluIHRvdWNoZXNcclxuICAgICAgaWYgQHRvdWNoTW91c2UgPT0gdG91Y2guaWRlbnRpZmllclxyXG4gICAgICAgIEBnYW1lLnRvdWNoTW92ZSh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKVxyXG5cclxuICBvblRvdWNoRW5kOiAoZXZ0KSAtPlxyXG4gICAgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlc1xyXG4gICAgZm9yIHRvdWNoIGluIHRvdWNoZXNcclxuICAgICAgaWYgQHRvdWNoTW91c2UgPT0gdG91Y2guaWRlbnRpZmllclxyXG4gICAgICAgIEBnYW1lLnRvdWNoVXAodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSlcclxuICAgICAgICBAdG91Y2hNb3VzZSA9IG51bGxcclxuICAgIGlmIGV2dC50b3VjaGVzLmxlbmd0aCA9PSAwXHJcbiAgICAgIEB0b3VjaE1vdXNlID0gbnVsbFxyXG5cclxuICBvbk1vdXNlRG93bjogKGV2dCkgLT5cclxuICAgIEBnYW1lLnRvdWNoRG93bihldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXHJcblxyXG4gIG9uTW91c2VNb3ZlOiAoZXZ0KSAtPlxyXG4gICAgQGdhbWUudG91Y2hNb3ZlKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSlcclxuXHJcbiAgb25Nb3VzZVVwOiAoZXZ0KSAtPlxyXG4gICAgQGdhbWUudG91Y2hVcChldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpXHJcblxyXG5zY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnc2NyZWVuJ1xyXG5yZXNpemVTY3JlZW4gPSAtPlxyXG4gIGRlc2lyZWRBc3BlY3RSYXRpbyA9IDE2IC8gOVxyXG4gIGN1cnJlbnRBc3BlY3RSYXRpbyA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgaWYgY3VycmVudEFzcGVjdFJhdGlvIDwgZGVzaXJlZEFzcGVjdFJhdGlvXHJcbiAgICBzY3JlZW4ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgc2NyZWVuLmhlaWdodCA9IE1hdGguZmxvb3Iod2luZG93LmlubmVyV2lkdGggKiAoMSAvIGRlc2lyZWRBc3BlY3RSYXRpbykpXHJcbiAgZWxzZVxyXG4gICAgc2NyZWVuLndpZHRoID0gTWF0aC5mbG9vcih3aW5kb3cuaW5uZXJIZWlnaHQgKiBkZXNpcmVkQXNwZWN0UmF0aW8pXHJcbiAgICBzY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbnJlc2l6ZVNjcmVlbigpXHJcbiMgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZVNjcmVlbiwgZmFsc2VcclxuXHJcbmFwcCA9IG5ldyBOYXRpdmVBcHAoc2NyZWVuLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXHJcbiJdfQ==
