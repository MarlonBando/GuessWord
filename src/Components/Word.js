import React from "react";

/**
   * Word is the class that is responsible for show the word that the user is trying to guess.
   * Each letter of the word is rappresented by a 'span' tag
   * @param {string} word this the word that will be displayed
   */
 class Word extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      var col = [];
      var word = this.props.word
      var className = "square";
      if(this.props.wrong){
        className += " wrong";
      }
      if(this.props.correct){
        className += " correct";
      }
      for (var i = 0; i < word.length; i++) {
        col.push(<span className={className} key={i.toString()}>
          {word.at(i)}
        </span>);
      }
      return <div id="wordPanel">{col}</div>;
    }
  }

  export default Word;