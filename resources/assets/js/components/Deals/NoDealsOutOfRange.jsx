import React, { Component } from 'react';
import api from 'src/api';

const formNotSubmittedMessage = "Our service is not currently available in your area. Please provide your email so that we can notify you when we arrive. We apologize for the inconvenience.";
const formSubmittedMessage = "Thank you! We will notify you when we arrive in your area.";

class NoMatchingDeals extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            formSubmitted: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        api
            .postNotifyWhenInRange(this.state.email)
            .then(() => {
                this.setState({formSubmitted: true});
            });
    }

    render() {
        return (
            <div className="deals__no-matches">
                <div>
                    <p>{ this.state.formSubmitted ? formSubmittedMessage : formNotSubmittedMessage }</p>
                </div>
                {!this.state.formSubmitted ? (
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <div>
                                <input
                                    className="deals__input"
                                    placeholder="Enter your email address"
                                    onChange={(e) => {
                                        this.setState({email: e.target.value})
                                    }}
                                    value={this.state.email}
                                    type="email"
                                    required/>
                                <button className="deals__button deals__button--blue" type="submit">
                                    Submit Email
                                </button>

                            </div>
                        </form>
                    ) :
                    ''
                }
            </div>
        );
    }
}

export default NoMatchingDeals;
