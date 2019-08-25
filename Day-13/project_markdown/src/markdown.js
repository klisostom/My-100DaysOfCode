import React from "react";
import "./css/Markdown.css";

const changeContentTArea = "UPDATE_CONTENT_TEXTAREA"

class Markdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textareaContent: ""
        };

        this.changeContentTArea = this.changeContentTArea.bind(this);
    }

    changeContentTArea(event) {

    }

    render() {
        return (
            <div class="centered">
                <textarea id="editor" rows="4" cols="50">

                </textarea>

                <div id="preview">

                </div>
            </div>
        );
    }
}

export default Markdown;