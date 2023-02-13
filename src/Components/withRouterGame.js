import { useLocation} from 'react-router-dom';

const withRouter = Game => props => {
  const location = useLocation();
  return <Game roundTime={location.state.roundTime} nTotRound={location.state.nTotRound} wordMaxTime={location.state.wordMaxTime} gameMode={location.state.gameMode} isBattleRoyal={location.state.isBattleRoyal} connectedPeerPacket={location.state.connectedPeerPacket} peersIdToConnect={location.state.peersIdToConnect} myPeerPacket={location.state.myPeerPacket} guessList={location.state.guessList} wordPerRound={location.state.wordPerRound}/>;
};

export default withRouter;