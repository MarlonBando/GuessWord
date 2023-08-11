import Peer from 'peerjs';
import React from 'react';
import data from "../db/data.json";
import withRouter from './withRouterLobby';
import { Navigate } from 'react-router-dom';
import Logo from './Logo';
import RoomCodePanel from './RoomCodePanel';
import GameSettings from './GameSettings';
import Ranking from './Ranking';
import ErrorPage from './ErrorPage';

function createId() {
    var chars = "0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
    var idLength = 8;
    var id = "";
    for (var i = 0; i < idLength; i++) {
        id += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
    }
    return id;
}

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        var myIdTmp = createId();
        var idGameTmp;
        do {
            idGameTmp = createId();
        } while (idGameTmp === myIdTmp);
        var myPeerTmp = new Peer(myIdTmp, { host: 'localhost', port: 9000, path: '/myapp' });
        var roomCodeTmp;
        props.isHost ? roomCodeTmp = myIdTmp : roomCodeTmp = props.roomCode;
        var peerPacketTmp = {
            'isHost': props.isHost,
            'id': myIdTmp,
            'idGame': idGameTmp,
            'idMessage': 0,
            'conn': null,
            'guessList': [],
            'name': props.name,
            'avatarImage': props.avatarImage,
            'score': 0,
            'gameMode': 0,
            'nTotRound': 3,
            'wordPerRound': 10,
            'roundTime': 60000,
            'wordMaxTime': 20000,
            'correctClass': ''
        };

        this.state = {
            /**
             * variable that tells if the peer is the host
             */
            isHost: props.isHost,

            /**
             * Assigns the created id
             */
            myId: myIdTmp,

            myName: props.name,

            avatarImage: props.avatarImage,

            /**
             * Assings the Peer object
             */
            myPeer: myPeerTmp,

            /**
             * dictionary of all peers connected
             */
            connectedPeerPacket: {},

            /**
             * room code
             */
            roomCode: roomCodeTmp,

            /**
             * true when the peer loses the connecition with the host.
             */
            hostDisconneted: false,

            peerPacket: peerPacketTmp,

            goToGame: false,

            peersIdToConnect: [],

            noRemove: false,

            nTotRound: 3,

            wordMaxTime: 20000,

            wordPerRound: 10,

            roundTime: 60000,

            gameMode: 0,

            isError: false
        }
    }

    beforeUnloadHandler = (e) => {

        e.preventDefault();
        // Additional actions before page unloads
        var connectedPeerPacketTmp = this.state.connectedPeerPacket;
        for (var idConnectedPeer in connectedPeerPacketTmp) {
            connectedPeerPacketTmp[idConnectedPeer].conn.close();
        }

        e.returnValue = true;
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        if (this.state.isHost) {
            // Every time that the host receive a connection it will send to 
            // the connected peer the list of the peer's id that are already connected to the host.
            this.state.myPeer.on('connection', (conn) => {
                conn.on('open', () => {
                    conn.on('data', (receivedPeerPacket) => {
                        ///Data sarà di tipo peer packet
                        if (receivedPeerPacket.idMessage === 0) {
                            var peerPacketList = [];
                            peerPacketList.push(this.state.peerPacket);
                            var connectedPeerPacketTmp = Object.assign({}, this.state.connectedPeerPacket);
                            for (var connectedPeerPacket in connectedPeerPacketTmp) {
                                var copia = Object.assign({}, connectedPeerPacketTmp[connectedPeerPacket]);
                                copia.conn = null;
                                peerPacketList.push(copia);
                            }
                            conn.send(peerPacketList);
                            connectedPeerPacketTmp[conn.peer] = receivedPeerPacket;
                            connectedPeerPacketTmp[conn.peer].conn = conn;
                            this.setState({
                                connectedPeerPacket: connectedPeerPacketTmp
                            });
                        } else if (receivedPeerPacket.idMessage === 2) {
                            var connectedPeerPacketTMP = this.state.connectedPeerPacket;
                            connectedPeerPacketTMP[receivedPeerPacket.id].score = receivedPeerPacket.score;
                        }
                    });
                });

                conn.on('close', () => {
                    if (!this.state.noRemove) {
                        var connectedPeerPacketTmp = this.state.connectedPeerPacket;
                        delete connectedPeerPacketTmp[conn.peer];
                        this.setState({
                            connectedPeerPacket: connectedPeerPacketTmp
                        });
                    }
                });
            });

            this.state.myPeer.on('disconnected', () => {
                /** TODO: Host disconnesso -> invio messaggio fine partita ai partecipanti */
            });
        } else {
            // Siamo nel peer client.
            // Try to reach the Host.
            var connH = this.state.myPeer.connect(this.state.roomCode);


            // When the connection with the host is established the connection is added to connectedPeers dict. 
            connH.on('open', () => {
                const peerPacketTmp = this.state.peerPacket;
                connH.send(peerPacketTmp);
                connH.on('data', (receivedData) => {
                    var hostPeerPacket = receivedData[0];
                    if (hostPeerPacket.idMessage === 0) {
                        var peersIdToConnectTmp = this.state.peersIdToConnect;
                        peersIdToConnectTmp.push(hostPeerPacket.idGame);
                        var connectedPeerPacketTmp = this.state.connectedPeerPacket;
                        connectedPeerPacketTmp[connH.peer] = hostPeerPacket;
                        connectedPeerPacketTmp[connH.peer].conn = connH;
                        receivedData.shift();
                        receivedData.forEach(peerPacket => {
                            peersIdToConnectTmp.push(peerPacket.idGame);
                            connectedPeerPacketTmp[peerPacket.id] = peerPacket;
                            connectedPeerPacketTmp[peerPacket.id].conn = this.state.myPeer.connect(peerPacket.id);
                            connectedPeerPacketTmp[peerPacket.id].conn.on('open', () => {
                                connectedPeerPacketTmp[peerPacket.id].conn.send(this.state.peerPacket);
                                connectedPeerPacketTmp[peerPacket.id].conn.on('close', () => {
                                    connectedPeerPacketTmp = this.state.connectedPeerPacket;
                                    delete connectedPeerPacketTmp[peerPacket.id];
                                    this.setState({
                                        connectedPeerPacket: connectedPeerPacketTmp
                                    });
                                });
                            });
                        });
                        this.setState({
                            connectedPeerPacket: connectedPeerPacketTmp
                        });
                    } else if (hostPeerPacket.idMessage === 1) {
                        var guessListTmp = this.state.guessList;
                        guessListTmp = hostPeerPacket.guessList;
                        var connectedPeerPacketTMp = this.state.connectedPeerPacket;
                        for (var peerPacketId in connectedPeerPacketTMp) {
                            connectedPeerPacketTMp[peerPacketId].conn = null;
                        }
                        this.setState({
                            guessList: guessListTmp,
                            goToGame: true,
                            wordMaxTime: hostPeerPacket.wordMaxTime,
                            nTotRound: hostPeerPacket.nTotRound,
                            wordPerRound: hostPeerPacket.wordPerRound,
                            roundTime: hostPeerPacket.roundTime,
                            gameMode: hostPeerPacket.gameMode
                        });
                    } else if (hostPeerPacket.idMessage === 3) {
                    }
                })
            });

            connH.on('close', () => {
                if (!this.state.noRemove) {
                    this.setState({
                        hostDisconneted: true
                    });
                }
            });

            ///Listen for connection from other peers. SImply add the connection to the dict.
            this.state.myPeer.on('connection', (conn) => {
                conn.on('open', () => {
                    conn.on('data', (receivedPeerPacket) => {
                        if (receivedPeerPacket.idMessage === 0) {
                            var connectedPeerPacketTmp = this.state.connectedPeerPacket;
                            connectedPeerPacketTmp[conn.peer] = receivedPeerPacket;
                            connectedPeerPacketTmp[conn.peer].conn = conn;
                            this.setState({
                                connectedPeers: connectedPeerPacketTmp
                            });
                        }
                    });
                });

                conn.on('close', () => {
                    if (!this.state.noRemove) {
                        var connectedPeerPacketTmp = this.state.connectedPeerPacket;
                        delete connectedPeerPacketTmp[conn.peer];
                        this.setState({
                            connectedPeers: connectedPeerPacketTmp
                        });
                    }
                });
            });

            this.state.myPeer.on('disconnected', () => {
                var connectedPeerPacketTmp = this.state.connectedPeerPacket;
                for (var idConnectedPeer in connectedPeerPacketTmp) {
                    connectedPeerPacketTmp[idConnectedPeer].conn.close();
                }
            });

            this.state.myPeer.on('error', (err) => {
                this.setState({
                    isError: true
                });
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }

    getWords() {
        this.setState({
            noRemove: true
        });
        var selectRoundNumber = document.getElementById("roundNumber");
        var selectRoundTime = document.getElementById("roundTime");
        var nTotRoundTmp = parseInt(selectRoundNumber.options[selectRoundNumber.selectedIndex].value);
        var roundTimeTmp = parseInt(selectRoundTime.options[selectRoundTime.selectedIndex].value);
        var wordMaxTimeTmp = this.state.wordMaxTime;
        var wordPerRoundTmp = this.state.wordPerRound;
        var nWordInGuessList = (roundTimeTmp / 1000) * nTotRoundTmp;
        var gameModeTmp = this.state.gameMode;
        var radioButtonBattaglia = document.getElementById("battaglia");
        var radioButtonScalata = document.getElementById("scalata");
        if (document.getElementById("battaglia").checked) {
            var selectMaxWordTime = document.getElementById("wordMaxTime");
            var selectWordPerRound = document.getElementById("wordPerRound");
            wordMaxTimeTmp = parseInt(selectMaxWordTime.options[selectMaxWordTime.selectedIndex].value);
            wordPerRoundTmp = parseInt(selectWordPerRound.options[selectWordPerRound.selectedIndex].value);
            nWordInGuessList = wordPerRoundTmp * nTotRoundTmp;
            gameModeTmp = parseInt(radioButtonBattaglia.value);
        } else {
            gameModeTmp = parseInt(radioButtonScalata.value);
        }
        var maxWords = data.length - 1;
        var guessListTmp = [];
        for (var i = 0; i < nWordInGuessList; i++) {
            var wordIndex = Math.floor(Math.random() * maxWords);
            var maxDescs = data[wordIndex]["desc"].length - 1;
            var descIndex = Math.floor(Math.random() * maxDescs);
            data[wordIndex]["desc"] = data[wordIndex]["desc"][descIndex];
            guessListTmp.push(data[wordIndex]);
        }

        var connectedPeerPackeTmp = this.state.connectedPeerPacket;
        for (var peerPacketId in connectedPeerPackeTmp) {
            var peerPacketTmp = Object.assign({}, connectedPeerPackeTmp[peerPacketId]);
            peerPacketTmp.idMessage = 1;
            peerPacketTmp.guessList = guessListTmp;
            peerPacketTmp.conn = null;
            peerPacketTmp.wordMaxTime = wordMaxTimeTmp;
            peerPacketTmp.gameMode = gameModeTmp;
            peerPacketTmp.roundTime = roundTimeTmp;
            peerPacketTmp.nTotRound = nTotRoundTmp;
            peerPacketTmp.wordPerRound = wordPerRoundTmp;
            connectedPeerPackeTmp[peerPacketId].conn.send([peerPacketTmp]);
            connectedPeerPackeTmp[peerPacketId].conn = null;
        }
        this.setState({
            guessList: guessListTmp,
            goToGame: true,
            nTotRound: nTotRoundTmp,
            roundTime: roundTimeTmp,
            wordMaxTime: wordMaxTimeTmp,
            wordPerRound: wordPerRoundTmp,
            gameMode: gameModeTmp
        });
    }

    render() {
        if (this.state.isError) {
            return <ErrorPage />
        }

        const connectedPeerPacketTmp = this.state.connectedPeerPacket;
        var rankedPlayerPeerPacket = [];
        rankedPlayerPeerPacket.push(this.state.myPeerPacket);
        for (var PeerPacketId in connectedPeerPacketTmp) {
            rankedPlayerPeerPacket.push(connectedPeerPacketTmp[PeerPacketId]);
        };
        var listaPeer = [];
        for (var PeerPacketId in connectedPeerPacketTmp) {
            listaPeer.push(<p key={PeerPacketId}>{PeerPacketId}: {connectedPeerPacketTmp[PeerPacketId].name}</p>)
        };
        var gameSettings = (<></>);

        if (this.state.isHost) {
            gameSettings = (
                <div id="gameSettings" className="myPanel p-2">
                    <GameSettings />
                    <div className="d-flex justify-content-center">
                        <button className="myButton btn btn-dark btn-lg btn-block m-1 buttonTextColor ml-4 mr-4" onClick={this.getWords.bind(this)}>Inizia la partita</button>
                    </div>
                </div>);
        }

        return (
            <>
                <Logo />
                <Ranking connectedPeerPacket={this.state.connectedPeerPacket} myPeerPacket={this.state.peerPacket} isLobby={true} />
                <RoomCodePanel roomCode={this.state.roomCode} />
                {gameSettings}
                {this.state.goToGame && <Navigate to="/game" state={{ roundTime: this.state.roundTime, nTotRound: this.state.nTotRound, wordMaxTime: this.state.wordMaxTime, gameMode: this.state.gameMode, isBattleRoyale: 0, connectedPeerPacket: this.state.connectedPeerPacket, peersIdToConnect: this.state.peersIdToConnect, myPeerPacket: this.state.peerPacket, guessList: this.state.guessList, wordPerRound: this.state.wordPerRound }} />}
            </>
        );

    }


}

export default withRouter(Lobby);