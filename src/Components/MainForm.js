import React from "react";
import { Navigate } from 'react-router-dom';

class MainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidateTextRoom: (<></>),
            invalidateTextName: (<></>),
            isHost: false,
            avatarImage: "",
            username:"",
            gotoLobby:false,
            roomCode:""
        }
    }

    partecipate() {
        var usernameTmp = document.getElementById('username').value;
        var gotoLobbyTmp = true;
        var invalidateTextNameTmp = this.state.invalidateTextName;
        if (usernameTmp === ""){
            invalidateTextNameTmp = (<div className='text-danger'>
                Campo obbligatorio.
            </div>);
            gotoLobbyTmp = false;
        }else{
            invalidateTextNameTmp=(<></>);
        }
            

        var roomCodeTmp = document.getElementById('roomCode').value;
        var avatarImageTmp = document.getElementById('avatar').name;
        var invalidateTextRoomTmp = this.state.invalidateTextRoom;
        if (roomCodeTmp.length !== 8) {
            invalidateTextRoomTmp = (<div className='text-danger'>
                Codice stanza deve essere di 8 caratteri.
            </div>);
            gotoLobbyTmp = false;
        }else{
            invalidateTextRoomTmp=(<></>);
        }

        this.setState({
            invalidateRoomText: invalidateTextRoomTmp,
            invalidateTextName: invalidateTextNameTmp,
            username: usernameTmp,
            isHost: false,
            avatarImage: avatarImageTmp,
            gotoLobby: gotoLobbyTmp,
            roomCode:roomCodeTmp
        });
    }

    createGame() {
        var usernameTmp = document.getElementById('username').value;
        var gotoLobbyTmp = true;
        var invalidateTextNameTmp = this.state.invalidateTextName
        if (usernameTmp === ""){
            invalidateTextNameTmp = (<div className='text-danger'>
                Campo obbligatorio
            </div>);
            gotoLobbyTmp = false;
        }else{
            invalidateTextNameTmp =(<></>);
        }

            
        var avatarImageTmp = document.getElementById('avatar').name;
        this.setState({
            invalidateRoomText:(<></>),
            invalidateTextName: invalidateTextNameTmp,
            isHost: true,
            username: usernameTmp,
            avatarImage: avatarImageTmp,
            gotoLobby: gotoLobbyTmp
        });
    }

    render() {
        var invalidMessageName = this.state.invalidateTextName;
        var InvalidMessageRoom = this.state.invalidateRoomText;
        return (
            <>
                <div className="form-group m-2">
                    <input type="text" id="username" placeholder="Inserisci il tuo nome" className="form-control myTextField" required autoFocus autocomplete="off"></input>
                    {invalidMessageName}
                </div>
                <div className="form-group m-2">
                    <input type="text" id="roomCode" placeholder="Codice stanza" className="form-control myTextField" required autocomplete="off"></input>
                    {InvalidMessageRoom}
                </div>
                <div className="form-group m-2 d-flex justify-content-center">
                    <button onClick={this.partecipate.bind(this)} className="myButton btn btn-dark btn-lg btn-block mt-1 buttonTextColor">Partecipa ad una partita</button>
                </div>
                <div className="form-group m-2 d-flex justify-content-center">
                <button onClick={this.createGame.bind(this)} className="myButton btn btn-dark btn-lg btn-block mt-1 buttonTextColor">Crea una stanza</button>
                </div>
                {this.state.gotoLobby && this.state.isHost && <Navigate to="/lobby-host" state={{ myName: this.state.username, avatarImage: this.state.avatarImage, roomCode: this.state.roomCode, isHost: this.state.isHost }} />}
                {this.state.gotoLobby && (!this.state.isHost) && <Navigate to="/lobby" state={{ myName: this.state.username, avatarImage: this.state.avatarImage, roomCode: this.state.roomCode, isHost: this.state.isHost }} />}
            </>
        );
    }
}

export default MainForm;