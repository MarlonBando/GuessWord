import React from "react";
import Definition from './Definition';
import Word from './Word';
import withRouter from './withRouterGame';
import Peer from 'peerjs';
import Ranking from "./Ranking";
import Logo from './Logo';
import Timer from './Timer';
import { Navigate } from 'react-router-dom';
import PreGameTimer from "./PreGameTimer";

/**
 * Game is the class that implements the first mode of the game
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    var myPeerTmp = new Peer(props.myPeerPacket.idGame, { host: 'localhost', port: 9000, path: '/myapp' });
    myPeerTmp.on('open', (id) => {
    });
    var showLetterTimeTmp = 1500;

    this.state = {
      guessList: props.guessList,
      /**
       * array that contains all the definitions of the round
       */
      definition: ["Migliore amico dell'uomo", "la seguirono i Re Magi", "E' in Francia ma è Italiana", "Protagonista di Dragon Ball", "Il sium", "Il king delle bestemmie", "tu sai chi"],
      /**
       * array that contains all the words to guess in the round.
       */
      words: ["cane", "cometa", "gioconda", "goku", "Cristiano Ronaldo", "blur", "voldemort"],
      /**
       * index that will be used in the 'definitions' array and 'words' array.
       */
      nResponse: 0,
      /**
       * This is the word that is show to the players
       */
      currentWord: "",
      /**
       * This array allows us to define the order in which to display the single characters of the word to guess 
       */
      currentWordArrayIndex: [],
      /**
       * The index used to iterate through the currentWordArrayIndex
       */
      currentIndex: 0,

      timeout: null,

      /**
       * Round time in ms order
       */
      roundTime: props.roundTime,

      roundTimeLeft: props.roundTime,

      /**
       * Number of total rounds durin a single game.
       */
      nTotRound: props.nTotRound,

      /**
       * Number of the current Round
       */
      currentRound: 1,

      /**
      * In battle mode represents the maximum amount of time that the players have to guess a single word. In speed run is greater than roundTime.
      */
      wordMaxTime: props.wordMaxTime,

      wordTimeLeft: props.wordMaxTime,

      refreshTimerPeriod: 1000,

      /**
       * round timeout object
       */
      roundTimeOut: null,

      /**
       * Boolean variable that represents if a user is eliminated.
       */
      isEliminated: false,


      /**
       * 0 -> Speed Run
       * 1 -> Battle
       */
      gameMode: props.gameMode,

      /**
       * true  -> battle royale on
       * false -> battle royale off
       */
      isBattleRoyale: props.isBattleRoyale,

      /**
       * true -> the render method will display the result table.
       * false -> the render method will not display the resulta table.
       */
      showRoundResult: false,

      /**
       * end of round ranking display time
       */
      timeEndOfRound: 5000,

      wordPerRound: props.wordPerRound,

      connectedPeerPacket: props.connectedPeerPacket,

      peersIdToConnect: props.peersIdToConnect,

      myPeer: myPeerTmp,

      myPeerPacket: props.myPeerPacket,

      showWordResult: true,

      showLetterTime: showLetterTimeTmp,

      showLetterInterval:null,

      gameStarted: false,

      correctAnswer: false,

      wrongAnswer: false,

      endOfGame: false,

      returnToHome:false,

      resetTimer:true,

      startTimer:true,

    };
  }

  endOfGame() {
    this.setState({
      showRoundResult: true,
      endOfGame: true
    });
  }

  endOfRound() {
    clearInterval(this.state.showLetterInterval);
    if (!this.state.showRoundResult) {
      setTimeout(() => this.endOfRound(), this.state.timeEndOfRound);
      this.setState({
        resetTimer:true,
        restartTimer:false,
        showRoundResult: true
      });
    } else {
      if (this.state.nTotRound - this.state.currentRound <= 0) {
        this.endOfGame();
      } else {
        var currentRoundTmp = this.state.currentRound + 1;
        var nResponseTmp = (this.state.guessList.length / this.state.nTotRound) * (currentRoundTmp - 1); // width * row(=currentRoundTmp - 1) + col(=0)
        this.createWord(this.state.guessList[nResponseTmp]["nome"]);
        var roundTimeoOutTmp = setTimeout(() => this.endOfRound(), this.state.roundTime);
        this.setState({
          nResponse: nResponseTmp,
          roundTimeLeft: this.state.roundTime,
          currentRound: currentRoundTmp,
          showRoundResult: false,
          roundTimeOut: roundTimeoOutTmp,
          resetTimer:false,
        });
      }
    }
  }

  /**
   * This method mix an array composed by the index of the character in the string 'word'
   * This method change the order in which the individual characters will be shown infact the array passed as parameter
   * contains at index 0, the index of the character of the string 'word' that will be shown as first.
   * At index 1 its contained the character that will be shown as second and so on.
   * @param {integer[]} vet contains at index 'i' a value equal to the value of the index.
   * @returns the vet array shuffled randomly
   */
  shuffle(vet) {
    var n = vet.length;
    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = vet[i];
      vet[i] = vet[j];
      vet[j] = tmp;
    }
    return vet;
  }

  /**
   * This method is used to update the word in order to remove an "empty" character with the right letter of the word
   * in order to give some hint to the players.
   * @param {string} str string that we want to modify.
   * @param {integer} index the index of the character that we want replace.
   * @param {char} replacement the new character that will be added to the position defined by the 'index' parameter.
   * @returns the new string with the 'replacements' character at the index defined by the 'index' parameter.
   */
  replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(++index);
  }

  /**
   * Initialize the displayed word with empty characters (they are actually rapresented with an underscore).
   * It also start the timer that will update the word with the real letters that is composed by.
   * @param {string} word 
   */
  createWord(word) {
    var vetI = [];
    var startWord = word[0];
    for (var i = 1; i < word.length; i++) {
      if (word[i] === ' ') {
        startWord = startWord + " ";
      } else {
        startWord = startWord + "_";
      }
      vetI.push(i);
    }
    vetI = this.shuffle(vetI);
    var wordTimeOutTmp = this.state.wordTimeOut;
    var showLetterTimeTmp = this.state.showLetterTime;
    var wordTimeLeftTmp = this.state.wordMaxTime;
    clearInterval(this.state.showLetterInterval);
    if (this.state.gameMode === 1) {
      showLetterTimeTmp = this.state.wordMaxTime / word.length;
      wordTimeLeftTmp = this.state.wordMaxTime;
      Object.assign(wordTimeLeftTmp, this.state.wordMaxTime);
      wordTimeOutTmp = setTimeout(() => this.wordTimeElapsed(), this.state.wordMaxTime);
    }
    this.setState({
      currentIndex: 0,
      currentWord: startWord,
      currentWordArrayIndex: vetI,
      wordTimeLeft: wordTimeLeftTmp,
      wordTimeOut: wordTimeOutTmp,
      correctAnswer: false,
      wrongAnswer: false,
      restartTimer:true,
      showLetterInterval: setInterval(() => this.step(), showLetterTimeTmp)
    });
  }

  /**
   * This method update the displayed word.
   */
  step() {
    var currIndex = this.state.currentIndex;
    const word = this.state.guessList[this.state.nResponse]["nome"];
    const currentWordArrayIndexTmp = this.state.currentWordArrayIndex;
    if (currIndex >= currentWordArrayIndexTmp.length - 1) {
      clearInterval(this.state.showLetterInterval);
    } else {
      var currWord = this.state.currentWord;
      var replaceIndex = this.state.currentWordArrayIndex[currIndex];
      this.setState({
        currentWord: this.replaceAt(currWord, replaceIndex, word.charAt(replaceIndex)),
        currentIndex: ++currIndex,
      });
    }
  }

  messageReceived(peerPacketReceived, connection) {
    var connectedPeerPacketTmp = this.state.connectedPeerPacket;
    var idPeerPacket = peerPacketReceived.id;
    if (peerPacketReceived.idMessage === 0) {
      connectedPeerPacketTmp[idPeerPacket].conn = connection;
    } else if (peerPacketReceived.idMessage === 3) {
      connectedPeerPacketTmp[idPeerPacket].score = peerPacketReceived.score;
      this.setState({
        connectedPeerPacket: connectedPeerPacketTmp
      });
    } else if (peerPacketReceived.idMessage === 5) {
      this.gameStart();
    }
  }

  connectToPeers() {
    var connectedPeerPacketTmp = this.state.connectedPeerPacket;
    const peersIdToConnectTmp = this.state.peersIdToConnect;
    for (var peerIndex in this.state.peersIdToConnect) {
      for (var peerPacketId in connectedPeerPacketTmp) {
        if (this.state.connectedPeerPacket[peerPacketId].idGame === peersIdToConnectTmp[peerIndex]) {
          const peerId = peerPacketId;
          const peerIdGame = peersIdToConnectTmp[peerIndex];
          connectedPeerPacketTmp[peerId].conn = this.state.myPeer.connect(peerIdGame);
          connectedPeerPacketTmp[peerId].conn.on('open', () => {
            var myPeerPackeTmp = this.state.myPeerPacket;
            myPeerPackeTmp.idMessage = 0;
            connectedPeerPacketTmp[peerId].conn.send(myPeerPackeTmp);
            connectedPeerPacketTmp[peerId].conn.on('data', (peerPacketReceived) => {
              this.messageReceived(peerPacketReceived, connectedPeerPacketTmp[peerId].conn);
            });
          });
        }
      }
    }
  }

  wordTimeElapsed() {
    clearInterval(this.state.showLetterInterval);
    clearInterval(this.state.wordTimeLeftInterval);
    if (this.state.showWordResult) {
      var currentWordTmp = this.state.guessList[this.state.nResponse]["nome"];
      this.setState({
        currentWord: currentWordTmp,
        showWordResult: false,
        resetTimer:true,
        startTimer:false,
      });
      setTimeout(() => this.wordTimeElapsed(), 2000);
    } else {
      if ((this.state.nResponse + 1) % (this.state.guessList.length / this.state.nTotRound) === 0) {
        this.endOfRound();
      } else {
        var nResponseTmp = this.state.nResponse + 1;
        this.setState({
          showWordResult: true,
          nResponse: nResponseTmp,
          resetTimer:false,
          startTimer:true
        });
        this.createWord(this.state.guessList[nResponseTmp]["nome"]);
      }
    }
  }

  gameStart() {
    if (this.state.myPeerPacket.isHost) {
      var myPeerPacketTmp = this.state.myPeerPacket;
      myPeerPacketTmp.idMessage = 5;
      const connectedPeerPacketTmp = this.state.connectedPeerPacket;
      for (var PeerPacketId in connectedPeerPacketTmp) {
        if (connectedPeerPacketTmp[PeerPacketId].conn !== null) {
          connectedPeerPacketTmp[PeerPacketId].conn.send(myPeerPacketTmp);
        } else {
        }
      }
    }
    this.createWord(this.state.guessList[(this.state.currentRound - 1) * this.state.wordPerRound]["nome"]);
    if (this.state.gameMode === 0) {
      this.setState({
        gameStarted: true,
        roundTimeOut: setTimeout(() => this.endOfRound(), this.state.roundTime)
      });
    } else {
      this.setState({
        gameStarted: true
      });
    }
  }

  componentDidMount() {
    setTimeout(() => this.connectToPeers(), 500);
    this.state.myPeer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.on('data', (data) => {
          this.messageReceived(data, conn);
        });
      });
    });
    if (this.state.myPeerPacket.isHost === true) {
      setTimeout(() => this.gameStart(), 5000);
    }
  }

  sendScore() {
    var myPeerPacketTmp = this.state.myPeerPacket;
    myPeerPacketTmp.idMessage = 3;
    if (this.state.gameMode === 0) {
      myPeerPacketTmp.score = myPeerPacketTmp.score + 1;
    } else if (this.state.gameMode === 1) {
      myPeerPacketTmp.score += 10 * this.state.wordTimeLeft / 1000;
    }
    const connectedPeerPacketTmp = this.state.connectedPeerPacket;
    for (var PeerPacketId in connectedPeerPacketTmp) {
      connectedPeerPacketTmp[PeerPacketId].conn.send(myPeerPacketTmp);
    }
  }

  /**
   * This method checks the user keyboard input.
   * If the 'enter' key is pressed he checks the string inside the 'Input' with the word to guess if they are the same the word is guessed
   * it cleans the input val and move to the next word by increasing the nResponse index.
   * @param {*} event 
   */
  checkWord(event) {
    var i = this.state.nResponse;
    if (event.key === "Enter") {
      var currentWordTmp = this.state.guessList[this.state.nResponse]["nome"]
      if (event.target.value.toUpperCase() === this.state.guessList[i]["nome"].toUpperCase()) {
        this.sendScore();
        var input = document.getElementById("inputWord");
        input.value = "";
        if (this.state.gameMode === 0) {
          this.setState({
            currentWord: currentWordTmp,
            correctAnswer: true
          });
          clearInterval(this.state.showLetterInterval);
          setTimeout(()=>{
            this.setState({
              nResponse: ++i,
              currentIndex: 0,
              currentWord: "",
              currentWordArrayIndex: [],
              correctAnswer:false
            });
            this.createWord(this.state.guessList[i]["nome"]);
          },1000);            
        } else if (this.state.gameMode === 1) {
          clearInterval(this.state.showLetterInterval);
          this.setState({
            currentWord: currentWordTmp,
            correctAnswer: true
          });
        }
      } else {
        this.setState({
          wrongAnswer: true
        })
        setTimeout(() => {
          this.setState({ wrongAnswer: false });
        }, 1500);
      }
    }
  }

  render() {
    if (!this.state.gameStarted) {
      return (<PreGameTimer/>);
    }

    var timeLimit;
    if(this.state.gameMode === 1){
      timeLimit = this.state.wordMaxTime/1000;
    }else if(this.state.gameMode === 0){
      timeLimit = this.state.roundTime/1000;
    }

    if (this.state.showRoundResult) {
      var returnButton;
      if (this.state.endOfGame) {
        returnButton =
          <div className="d-flex justify-content-center">
            <button className="myButton btn btn-dark btn-lg btn-block m-1 buttonTextColor ml-4 mr-4" onClick={() => {this.setState({ returnToHome: true }); }}>Ritorna alla Home</button>
          </div>
      }
      return (
        <div id="gamePanel">
          <Logo />
          {returnButton}
          {this.state.returnToHome && <Navigate to="/"/>}
          <Ranking connectedPeerPacket={this.state.connectedPeerPacket} myPeerPacket={this.state.myPeerPacket} />
        </div>
      );
    }

    return (
      <div id="gamePanel">
        <div id="definitionPanel">
          <span class="timer">
            <Timer timeLimit={timeLimit} resetTimer={this.state.resetTimer} startTimer={this.state.startTimer}/>
          </span>
          <Definition definition={this.state.guessList[this.state.nResponse]["desc"]} />
          <span id="nRound">{this.state.currentRound}/{this.state.nTotRound}</span>
        </div>
        <Word word={this.state.currentWord} correct={this.state.correctAnswer} wrong={this.state.wrongAnswer} />
        <div class="input_area">
          <input autocomplete="off" type="text" placeholder="Inserisci la parola" id="inputWord" onKeyDown={this.checkWord.bind(this)}></input>
        </div>
        <Ranking connectedPeerPacket={this.state.connectedPeerPacket} myPeerPacket={this.state.myPeerPacket} />
      </div>
    );
  }
}

export default withRouter(Game);