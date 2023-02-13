import '../style.css';
import React from "react";

/**
 * Definition is a class that display the definition of the word that the player want to guess.
 * Its HTML structure is made by a <div> with inside a <p> that contains the sentence 
 * @param {string} definition this is the sentence that will be displayed
 */
 class Definition extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (<span className="definition">
        <p>{this.props.definition}</p>
      </span>)
    }
  }

  export default Definition;
  
  