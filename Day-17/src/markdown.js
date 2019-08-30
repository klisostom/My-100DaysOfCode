import React from "react";
import { Provider, connect } from 'react-redux';
import { combineReducers, createStore } from "redux";
import "./styles/css/index.css";
import marked from "marked";


// Markdown: When I click a link rendered by my markdown previewer, the link is opened up in a new tab
let renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
    let link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace("<a", "<a target='_blank' ");
};
marked.setOptions({
    renderer: renderer,
    breaks: true,
});

// Redux:
// action types
const UPDATE_EDITOR = "UPDATE_EDITOR";

// actionCreator
const updateEditor = (message) => {
    return (
        {   // action   
            type: UPDATE_EDITOR,
            message: message
        }
    );
};

const textareaReduce = (state = '', action) => {
    switch (action.type) {
        case UPDATE_EDITOR:
            //return [...state, action.message];
            return { state: state, message: action.message }
        default:
            return state;
    }
};

const reducer = combineReducers({ textareaReduce });
const store = createStore(reducer);

const DEFAULT_MARKDOWN = `
# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;

// React:
class Editor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            textareaEditor: ''
        };

        this.changeContentTArea = this.changeContentTArea.bind(this);
    }

    componentWillMount() {
        this.setState({
            textareaEditor: this.state.textareaEditor + DEFAULT_MARKDOWN
        });
    }

    changeContentTArea(event) {
        this.setState({
            textareaEditor: event.target.value
        });
        //this.props.updatePreview(this.state.textareaEditor);
    }

    convetToMarkdown() {
        let md = marked(this.state.textareaEditor);
        return { __html: md };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="editor" id="editorWrap" >
                            <div className="" style={{ backgroundColor: "#DC9523" }}>
                                <span style={{ float: "left", marginLeft: "5px" }}>
                                    <i class="fa fa-github-square"></i>
                                </span>
                                <span style={{ marginLeft: "5px" }}>
                                    Editor
                                </span>
                                <span style={{ float: "right", marginRight: "5px" }}>
                                    <i class="fa fa-arrows"></i>
                                </span>
                            </div>
                            {/* DEFAULT_MARKDOWN */}
                            <textarea rows="6" id="editor" 
                                onChange={this.changeContentTArea} 
                                >{this.state.textareaEditor}</textarea>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="preview">
                            <div className="" style={{ backgroundColor: "#DC9523" }}>
                                <span style={{ float: "left", marginLeft: "5px" }}>
                                    <i class="fa fa-github-square"></i>
                                </span>
                                <span style={{ marginLeft: "5px" }}>
                                    Preview
                                </span>
                                <span style={{ float: "right", marginRight: "5px" }}>
                                    <i class="fa fa-arrows"></i>
                                </span>
                            </div>
                            <div id="preview" dangerouslySetInnerHTML={this.convetToMarkdown()}></div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


class Presentational extends React.Component {

    render() {
        return (
            <div>
                <Editor />
            </div>
        );
    }
}
//=== End React

// React-Redux:
const mapStateToProps = (state) => {
    return ({
        messages: state
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        updatePreview: (message) => {
            dispatch(updateEditor(message))
        }
    });
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class AppWrapper extends React.Component {
    render() {
        return (
            <Provider store={store} >
                <Container />
            </Provider>
        );
    }
};

export default AppWrapper;