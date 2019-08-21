import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickButton } from "./actions";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        };

        this.inputChange = this.inputChange.bind(this);
    }

    inputChange = event => {
        this.setState({
            inputValue: event.target.value
        });
    };

    render() {
        const { newValue, clickButton } = this.props;

        return (
            <div className="App" style={{ paddingTop: "10px" }}>
                <input
                    type="text"
                    onChange={this.inputChange}
                    value={this.inputValue}
                />

                <button onClick={() => clickButton(this.inputValue)}>
                    Click me!
                </button>

                <h1>{newValue}</h1>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    newValue: store.clickState.newValue
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ clickButton }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
