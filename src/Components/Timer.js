import React from "react";

class Timer extends React.Component {
    constructor(props) {
        super(props);
        const fullDashArrayTmp = 283;
        this.state = {
            timeLimit: props.timeLimit,
            timePassed: -1,
            timeLeft: props.timeLimit,
            timeInterval: null,
            fullDashArray: fullDashArrayTmp,
            resetDashArray: "-57 " + fullDashArrayTmp,
            timer: null,
            resetTimer:false,
            startTimer:false,
        }
    }

    componentDidMount(){
        var timerTmp = document.getElementById("base-timer-path-remaining");
        this.setState({
            timer : timerTmp
        });
    }

    isTrigger() {
        if(this.state.timer === null){
            return;
        }
        if (this.props.resetTimer !== this.state.resetTimer) {
            this.reset();
            this.resetTimerVar();

            this.setState({
                resetTimer:this.props.resetTimer 
            })
        }

        if(this.props.startTimer !== this.state.startTimer){
            this.setState({
                startTimer:this.props.startTimer
            })
            this.startTimer();
            
        }
    }

    reset() {
        clearInterval(this.state.timeInterval);
        this.state.timer.setAttribute("stroke-dasharray", this.state.resetDashArray);
    }

    startTimer() {
        clearInterval(this.state.timeInterval);
        var timeIntervalTmp = setInterval(() => {
            var timePassedTmp = this.state.timePassed;
            timePassedTmp += 1;
            var timeLeftTmp = this.state.timeLimit - timePassedTmp;
            this.setState({
                timePassed: timePassedTmp,
                timeLeft: timeLeftTmp
            });
            if(timeLeftTmp === 0){
                clearInterval(this.state.timeInterval);
            }else{
                const circleDashArray = Math.trunc(this.calculateTimeFraction() * this.state.fullDashArray);
                this.state.timer.setAttribute("stroke-dasharray", "" + circleDashArray + " 283");
            }
            
        }, 1000);
        this.setState({
            timeInterval: timeIntervalTmp
        })
    }

    calculateTimeFraction() {
        const rawTimeFraction = this.state.timeLeft / this.state.timeLimit;
        return rawTimeFraction - (1 / this.state.timeLimit) * (1 - rawTimeFraction);
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        var seconds = time % 60;

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    timeIsUp() {
    }

    resetTimerVar() {
        this.setState({
            timePassed: -1,
            timeLeft: this.state.timeLimit
        });
    }

    render() {
        this.isTrigger();
        return (
            <div class="base-timer">
                <svg class="base-timer__svg" viewBox="0 0 100 100">
                    <g class="base-timer__circle">
                        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                        <path id="base-timer-path-remaining" stroke-dasharray="283" class="base-timer__path-remaining arc"
                            d="
                                M 50, 50
                                m -45, 0
                                a 45,45 0 1,0 90,0
                                a 45,45 0 1,0 -90,0">
                        </path>
                    </g>
                </svg>
                <span id="base-timer-label" class="base-timer__label">{this.formatTime(this.state.timeLeft)}</span>
            </div>
        );
    }
}

export default Timer;