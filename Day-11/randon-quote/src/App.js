import React from "react";
import "./App.css";
import Bloquote from "./Bloquote";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        };
    }

    inputChange = event => {
        this.setState({
            inputValue: event.target.value
        });
    };

    render() {
        return (
            <div className="centered" id="quote-box" >
                <Bloquote />
            </div>
        );
    }
}

export default App;