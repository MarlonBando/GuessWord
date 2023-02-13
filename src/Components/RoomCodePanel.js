function RoomCodePanel(props) {
    return (
        <div className="myPanel mb-3">
            <div className="d-flex justify-content-center">
                <h2 className="h2">Codice stanza:</h2>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="h3">{props.roomCode}</h3>
            </div>
        </div>
    );
}

export default RoomCodePanel;