import React from "react";

class Ranking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLobby: props.isLobby
        }
    }

    render() {
        var rankedPlayerPeerPacketList = [];
        const connectedPeerPacketTmp = this.props.connectedPeerPacket;
        rankedPlayerPeerPacketList.push(this.props.myPeerPacket);
        for (var PeerPacketId in connectedPeerPacketTmp) {
            rankedPlayerPeerPacketList.push(connectedPeerPacketTmp[PeerPacketId]);
        };
        var ulRankedPlayer = [];
        var keyIndex=0;
        for (var rankedPlayerPeerPacket in rankedPlayerPeerPacketList) {
            if (this.state.isLobby) {
                ulRankedPlayer.push(<li key={keyIndex}>
                    <img src={rankedPlayerPeerPacketList[rankedPlayerPeerPacket].avatarImage} alt="avatarImage"></img>
                    <strong>{rankedPlayerPeerPacketList[rankedPlayerPeerPacket].name}</strong>
                    <span></span>
                </li>);
            } else {
                ulRankedPlayer.push(<li key={keyIndex} class={rankedPlayerPeerPacketList[rankedPlayerPeerPacket].correctClass}>
                    <img src={rankedPlayerPeerPacketList[rankedPlayerPeerPacket].avatarImage} alt="avatarImage"></img>
                    <strong className="score">{rankedPlayerPeerPacketList[rankedPlayerPeerPacket].name}</strong>
                    <span>{rankedPlayerPeerPacketList[rankedPlayerPeerPacket].score}</span>
                </li>);
            }
            keyIndex++;
        };

        if (this.state.isLobby) {
            return (
                <div class="myPanel p-1 mb-2 justify-content-center">
                    <div class="user_wrapper_lobby">
                        <ul>
                            {ulRankedPlayer}
                        </ul>
                    </div></div>
            );
        }
        return (<div class="ranking">
            <div class="user_wrapper">
                <ul>
                    {ulRankedPlayer}
                </ul>
            </div>
        </div>);
    }
}

export default Ranking;