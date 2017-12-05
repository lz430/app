import React, { Component } from 'react';

class NoMatchingDeals extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return (
            <div className="deals__no-matches">
                <div>
                    <p>Our service is not currently available in your area. Please provide your email so that we
                        can notify you when we arrive. We apologize for the inconvenience.</p>
                </div>
                <form>
                    <div>
                        <input className="deals__input" placeholder="Enter your email address" type="email"/>
                        <button className="deals__button deals__button--blue" type="submit"
                                onSubmit={() =>
                                    (window.location = '/not-in-area')}>
                            Submit Email
                        </button>

                    </div>
                </form>
            </div>
        );
    }
}

export default NoMatchingDeals;
