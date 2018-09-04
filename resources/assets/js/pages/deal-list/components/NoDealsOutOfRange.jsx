import React, { Component } from 'react';

import api from 'src/api';
import ZipcodeFinder from 'pages/deal-list/components/Sidebar/ZipcodeFinder';

import { Button, Form, FormGroup, Input } from 'reactstrap';

class NoDealsOutOfRange extends Component {
    state = {
        email: '',
        formSubmitted: false,
    };

    handleSubmit(e) {
        e.preventDefault();

        api.postNotifyWhenInRange(this.state.email).then(() => {
            this.setState({ formSubmitted: true });
        });
    }

    renderEmailCollectionForm() {
        if (this.state.formSubmitted) {
            return (
                <p>
                    Thank you! We will notify you when we arrive in your area.
                </p>
            );
        }

        return (
            <Form inline onSubmit={e => this.handleSubmit(e)}>
                <FormGroup className="mb-0">
                    <Input
                        type="email"
                        onChange={e => {
                            this.setState({ email: e.target.value });
                        }}
                        value={this.state.email}
                        placeholder="Enter your email address"
                        required
                    />
                </FormGroup>
                <Button color="success">Submit Email</Button>
            </Form>
        );
    }

    render() {
        return (
            <div className="deals__no-matches">
                <div>
                    <p>
                        Our service is currently available in the Detroit
                        market. <br /> Please update your search location.
                    </p>
                </div>
                <div className="full-page-user-location">
                    <ZipcodeFinder />
                </div>
                <div>
                    <p>
                        or provide your email so that we can notify you when we
                        arrive. We apologize for the inconvenience.
                    </p>
                </div>
                {!this.state.formSubmitted
                    ? this.renderEmailCollectionForm()
                    : ''}
            </div>
        );
    }
}

export default NoDealsOutOfRange;
