import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Components/Home';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Lobby from './Components/Lobby';
import Game from './Components/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/game' element={<Game/>}></Route>
        <Route path='/lobby' element={<Lobby isHost={false} roomCode={"sas"} />}></Route>
        <Route path='/lobby-host' element={<Lobby isHost={true}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
