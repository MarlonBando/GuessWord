import { useLocation} from 'react-router-dom';

const withRouter = Lobby => props => {
  const location = useLocation();
  return <Lobby roomCode={location.state.roomCode} name={location.state.myName} isHost={location.state.isHost} avatarImage={location.state.avatarImage}/>;
};

export default withRouter;