import React from "react";
import { Navigate } from 'react-router-dom';
import Logo from './Logo';

class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnToHome: false
        };
    }
    render() {
        return(
            <>
                <Logo/>
                <h1 id="errorTitle" className="d-flex justify-content-center">Errore imprevisto</h1>
                <div className="d-flex justify-content-center">
                    <button className="myButton btn btn-dark btn-lg btn-block m-1 buttonTextColor ml-4 mr-4" onClick={() => {this.setState({ returnToHome: true }); }}>Ritorna alla Home</button>
                </div>
                {this.state.returnToHome && <Navigate to="/"/>}
            </>
        )
    }
}

export default ErrorPage;