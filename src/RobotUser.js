const LichessApi = require('./LichessApi');
const Game = require('./Game');

/**
 * RobotUser listens for challenges and spawns Games on accepting.
 *
 */
class RobotUser {
  /**
   * Initialise with access token to lichess and a player algorithm.
   */
  constructor(api, player) {
    this.api = api;
    this.player = player;
    this.gameId = null;
  }

  async start() {
    this.account = await this.api.accountInfo();
    console.log('Playing as ' + this.account.data.username);
    this.api.streamEvents((event) => this.eventHandler(event));
    return this.account;
  }

  eventHandler(event) {
    switch (event.type) {
      case 'challenge':
        if (!event.challenge) return;
        if (event.challenge.challenger.id === this.account.data.id) return;
        this.handleChallenge(event.challenge);
        break;
      case 'gameStart':
        this.gameId = event.game.id;
        this.handleGameStart(event.game.id);
        break;
      case 'gameFinish':
        this.gameId = null;
      default:
        console.log('Unhandled event : ' + JSON.stringify(event));
    }
  }

  handleGameStart(id) {
    const game = new Game(this.api, this.account.data.username, this.player);
    game.start(id);
  }

  async handleChallenge(challenge) {
    const ctype = challenge.timeControl.type;
    // enum ["generic" "later" "tooFast" "tooSlow" "timeControl" "rated" "casual" "standard" "variant" "noBot" "onlyBot"]
    // rated means only rated allowed
    const allowedVariants = ['standard', 'chess960'];
    const reasonToDeclines = [
      ...(this.gameId ? ['later'] : []), // I'm not accepting challenges at the moment.
      // 'generic', // I'm not accepting challenges at the moment.
      // 'later', // This is not the right time for me, please ask again later.
      // ...(challenge.variant.key !== 'standard' ? ['standard'] : []), // I'm not accepting variant challenges right now.
      // ...(challenge.speed === 'bullet' ? ['tooFast'] : []), // This time control is too fast for me, please challenge again with a slower game.
      // ...(challenge.speed === 'blitz' ? ['tooSlow'] : []), // This time control is too slow for me, please challenge again with a faster game.
      // ...(challenge.speed === 'rapid' ? ['tooSlow'] : []), // This time control is too fast for me, please challenge again with a slower game.
      ...(challenge.speed === 'classical' ? ['tooSlow'] : []), // I'm not accepting challenges with this time control.
      ...(ctype === 'correspondence' ? ['timeControl'] : []), // I'm not accepting challenges with this time control.
      ...(!allowedVariants.includes(challenge.variant.key) ? ['variant'] : []), // I'm not willing to play this variant right now.
      // ...(challenge.rated !== 'rated' ? ['rated'] : []), // Please send me a rated challenge instead.
      // ...(challenge.rated !== 'casual' ? ['casual'] : []), // Please send me a casual challenge instead.
      ...(challenge.challenger.title === 'BOT' ? ['noBot'] : []), // I'm not accepting challenges from bots.
      // ...(challenge.challenger.title !== 'BOT' ? ['onlyBot'] : []), // I'm only accepting challenges from bots.
    ];
    let response = '';
    if (reasonToDeclines.length) {
      response = await this.api.declineChallenge(
        challenge.id,
        reasonToDeclines[0],
      );
    } else {
      response = await this.api.acceptChallenge(challenge.id);
    }
    console.log(
      'Challenge response',
      challenge.variant.key,
      response && (response.data || response),
    );
  }
}

module.exports = RobotUser;
