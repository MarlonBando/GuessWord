import React from "react";

class PreGameTimer extends React.Component {
    render() {
        return(
            <>
                <div id="countDownContainer">
                    <div class="countdown">
                        <div class="number">
                            <h2>5</h2>
                        </div>

                        <div class="number">
                            <h2>4</h2>
                        </div>

                        <div class="number">
                            <h2>3</h2>
                        </div>

                        <div class="number">
                            <h2>2</h2>
                        </div>

                        <div class="number">
                            <h2>1</h2>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PreGameTimer;