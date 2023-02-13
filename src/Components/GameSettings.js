function radioOnChange(){
    console.log("radioOnChange()...");
    var isDisabled = !document.getElementById("battaglia").checked;
    document.getElementById("wordMaxTime").disabled = isDisabled;
    document.getElementById("wordPerRound").disabled = isDisabled;
    console.log("radioOnChange()...completed");
}

function GameSettings() {
    return (
            <form className="myForm">
                <div className="mb-4 text-center">
                    <h3 className="h2">Settaggi partita</h3>
                </div>
                <div className="d-flex justify-content-center m-2" id="radio">
                    <div className="form-radio form-check-inline">
                        <input className="form-check-input" type="radio" name="gameMode" id="scalata" value="0" defaultChecked onChange={radioOnChange}></input>
                        <label className="form-check-label" htmlFor="scalata">Scalata</label>
                    </div>
                    <div className="form-radio form-check-inline">
                        <input className="form-check-input" type="radio" name="gameMode" id="battaglia" value="1" onChange={radioOnChange}></input>
                        <label className="form-check-label" htmlFor="battaglia">Battaglia</label>
                    </div>
                </div>
                <div className="form-group m-2">
                    <label htmlFor="roundTime">Durata round</label>
                    <select className="form-select" id="roundTime" aria-label="roundTime">
                        <option defaultValue value={60000}>1 Minuto</option>
                        <option value={20000}>2 Minuti</option>
                        <option value={180000}>3 Minuti</option>
                    </select>
                </div>
                <div className="form-group m-2">
                    <label htmlFor="roundNumber">Numero di round</label>
                    <select className="form-select" id="roundNumber" aria-label="roundNumber">
                        <option value={1}>1 Round</option>
                        <option value={2}>2 Round</option>
                        <option defaultValue value={3}>3 Round</option>
                        <option value={4}>4 Round</option>
                        <option value={5}>5 Round</option>
                    </select>
                </div>
                <div className="form-group m-2">
                    <label htmlFor="wordMaxTime">Durata massima parola</label>
                    <select className="form-select" id="wordMaxTime" disabled={true} aria-label="wordMaxTime">
                        <option defaultValue value={10000}>10 Secondi</option>
                        <option value={20000}>20 Secondi</option>
                        <option value={30000}>30 Secondi</option>
                    </select>
                </div>
                <div className="form-group m-2">
                    <label htmlFor="wordPerRound">Parole per round</label>
                    <select className="form-select" id="wordPerRound" disabled={true} aria-label="wordPerRound">
                        <option defaultValue value="5">5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                </div>
            </form>
    );
}

export default GameSettings;