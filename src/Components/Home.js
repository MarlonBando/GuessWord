import React from 'react'
import AvatarSelection from './AvatarSelection';
import MainForm from './MainForm'
import Logo from './Logo'

function Home() {
    return (
        <>
            <Logo/>
            <div id="menu" className="myPanel p-5 text-center">
                <div id="avatarDiv">
                    <span>
                        <AvatarSelection />
                    </span>
                </div>
                <MainForm />
            </div>
            <div id="rules" className="myPanel p-3 text-center mt-2">
                <h2 class="h3">Regole di gioco</h2>
                <p>L'obiettivo del gioco è indovinare più parole degli avversari, si ha a disposizione la definizione della parola e il numero di lettere. Ogni 3 secondi verrà svelata una lettera della parola.</p>
            </div>
            <div id="command" className="myPanel p-3 text-center mt-2">
                <h2 class="h3">Comandi</h2>
                <div id="enter" className="mt-3">
                    <img alt="enterKey" src="key/enter.png" class="comandImage"></img>
                    <p>Premi "Invio" per dare la tua risposta</p>
                </div>
                <div id="return" className="mt-2">
                    <img alt="returnKey" src="key/return.png" class="comandImage"></img>
                    <p>Usa "return" per cancellare quanto scritto</p>
                </div>
            </div>
        </>
    );
}

export default Home;