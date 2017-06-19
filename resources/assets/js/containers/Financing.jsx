import React, { Component } from 'react';

import RouteOne from '../components/Financing/RouteOne';

class Financing extends Component {
    constructor() {
        super();

        this.state = {
            wantsFinancing: false
        }
    }

    renderButtons() {
        return (
            <div>
                <h2>Would you like to apply for financing for the { DeliverMyRide.deal.year} { DeliverMyRide.deal.make } { DeliverMyRide.deal.model }?</h2>

                <button onClick={ () => { this.setState({ wantsFinancing: true })}}>Apply for Financing</button>
                <button onClick={ () => { window.location = '/financing/thankyou' }}>No thanks, I'll pay cash</button>
            </div>
        )
    }

    render() {
        return (
            <div className="financing">
                { this.state.wantsFinancing ? <RouteOne /> : this.renderButtons() }
            </div>
        );
    }
}

export default Financing;
