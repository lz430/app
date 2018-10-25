import '../styles/app.scss';
import React, { Component } from 'react';
import { Container } from 'reactstrap';

class KbbIframe extends Component {
    state = {
        results: null,
    };

    componentDidMount() {
        window.addEventListener('message', this.handleFrameTasks);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleFrameTasks);
    }

    handleFrameTasks = e => {
        if (typeof e.data === 'string') {
            this.setState({ results: JSON.parse(e.data) });
        }
    };

    render() {
        if (this.state.results) {
            return (
                <Container>
                    KBB Vechile ID: {this.state.results.payload.KBBVehicleId}
                    <br />
                    Name: {this.state.results.payload.firstName}{' '}
                    {this.state.results.payload.lastName}
                    <br />
                    Email: {this.state.results.payload.email}
                    <br />
                    Phone: {this.state.results.payload.phone}
                    <br />
                    Vehicle: {this.state.results.payload.year}{' '}
                    {this.state.results.payload.make}{' '}
                    {this.state.results.payload.model}{' '}
                    {this.state.results.payload.trim}
                    <br />
                    Mileage: {this.state.results.payload.mileage}
                    <br />
                    Trade-In Value: ${this.state.results.payload.value}
                </Container>
            );
        }

        return (
            <div className="embed-responsive embed-responsive-1by1">
                <iframe
                    title="Trade-In Application"
                    ref={f => (this.ifr = f)}
                    frameBorder="0"
                    className="embed-responsive-item"
                    id="kbbIco"
                    src="https://use1-icoreact-www-cobrand-apigw-kbb.awskbbcsnp.kbb.com/instant-cash-offer/?OfferCode=WC&groupId=delivermyride&dealerId=68535947"
                />
            </div>
        );
    }
}

export default KbbIframe;
