import React from "react";

//=== Import font
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTumblr, faTwitter } from "@fortawesome/free-brands-svg-icons";
library.add(faTumblr, faTwitter);
//=== End Import font


class Bloquote extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quote: "",
            author: ""
        };

        this.changeQuoteAuthor = this.changeQuoteAuthor.bind(this);
    }

    // Initiating an author and your quote
    componentDidMount() {
        this.changeQuoteAuthor();
    }

    // An array of quotes
    arrayQuotes = () => {
        return [
            {
                quote:
                    "Quem quer vencer um obstáculo deve armar-se da força do leão e da prudência da serpente.",
                author: "Pindaro"
            },
            {
                quote:
                    "É erro vulgar confundir o desejar com o querer. O desejo mede os obstáculos; a vontade vence-os.",
                author: "Alexandre Herculano"
            },
            {
                quote:
                    "A força não vem de vencer. Suas lutas desenvolvem suas forças. Quando você atravessa dificuldades e decide não se render, isso é força.",
                author: "Arnold Schwarzenegger"
            },
            {
                quote:
                    "Construí amigos, enfrentei derrotas, venci obstáculos, bati na porta da vida e disse-lhe: Não tenho medo de vivê-la.",
                author: "Augusto Cury"
            },
            {
                quote:
                    "Muitos homens devem a grandeza da sua vida aos obstáculos que tiveram que vencer.",
                author: "C. H. Spurgeon"
            }
        ];
    };

    // change an quote randomly
    changeQuoteAuthor = () => {
        const quotes = this.arrayQuotes();
        const randomPosition = Math.floor(Math.random() * quotes.length);

        this.setState({
            quote: quotes[randomPosition]["quote"],
            author: quotes[randomPosition]["author"]
        });
    }

    render() {
        //=== Styling
        let styleCardFooter = {
            backgroundColor: "transparent",
            border: "transparent"
        };
        let stylePadding = { padding: "5% 5%", width: '50%' };

        //=== url of twitter, when clicked to share the quote.
        const urlTwitter =
            "https://twitter.com/intent/tweet?url=https%3A%2F%2Flearn.freecodecamp.org%2F&via=klis_sousa&text=" +
            this.state.quote +
            "&hashtags=freecodecamp";

        return (
            <div style={stylePadding}>
                <div className="card">

                    {/* show an quote */}
                    <blockquote className="card-body">
                        <h1 id="text">"{this.state.quote}</h1>
                        <h6 style={{
                            textAlign: "right"
                        }} id="author">
                            - {this.state.author}
                        </h6>
                    </blockquote>

                    <div className="card-footer" style={styleCardFooter}>
                        {/* Buttons of twitter and tumblr */}
                        <a href={urlTwitter} id="tweet-quote" className="btn btn-link" style={{ float: 'left' }}>
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="#" id="tumblr-quote" className="btn btn-link" style={{ float: 'left' }}>
                            <FontAwesomeIcon icon={faTumblr} />
                        </a>

                        {/* Create new quote */}
                        <button
                            className="btn btn-primary"
                            id="new-quote"
                            style={{ float: 'right' }}
                            onClick={this.changeQuoteAuthor}>New quote</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bloquote;