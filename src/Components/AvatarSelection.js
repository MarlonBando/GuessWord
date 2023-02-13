import React from "react";

class AvatarSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarListCursor: 0,
            imgNameList: [
                "avatar\\gokuMemeFace1.png",
                "avatar\\Spiederman.png",
                "avatar\\PaperinoInquitanteAvatar.png",
                "avatar\\Dwight.png",
                "avatar\\Squidward.png",
            ]
        }
    }

    moveCursorFoward() {
        var cursor = this.state.avatarListCursor;
        if (this.state.avatarListCursor + 1 < this.state.imgNameList.length) {
            this.setState({
                avatarListCursor: cursor + 1
            });
        }
    }

    moveCursorBackward() {
        var cursor = this.state.avatarListCursor;
        if (this.state.avatarListCursor - 1 >= 0) {
            this.setState({
                avatarListCursor: cursor - 1
            });
        }
    }

    render() {
        const imgName = this.state.imgNameList[this.state.avatarListCursor];
        return (
            <>
                <img alt="arrowLeft" onClick={this.moveCursorBackward.bind(this)} id="arrowLeft" src="arrowLeft.png" class="arrowImg"></img>
                <img alt="avatar" src={imgName} class="avatarImg" name={imgName} id="avatar"></img>
                <img alt="arrowRight" onClick={this.moveCursorFoward.bind(this)} id="arrowRight" src="arrowRight.png" class="arrowImg"></img>
            </>
        );
    }
}

export default AvatarSelection;