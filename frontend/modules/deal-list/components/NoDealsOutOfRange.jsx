import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ApiClient from '../../../store/api';

import { Button, Form, FormGroup, Input } from 'reactstrap';

class NoDealsOutOfRange extends Component {
    static propTypes = {
        userLocation: PropTypes.object.isRequired,
        onSearchForLocation: PropTypes.func.isRequired,
    };

    state = {
        //
        // Email Form
        email: '',
        emailFormSubmitted: false,

        //
        // Zipcode Form
        editing: false,
        zipError: false,
        zipcode: this.props.userLocation.zipcode || '',
    };

    handleEmailCollectionSubmitForm(e) {
        e.preventDefault();

        ApiClient.user.postNotifyWhenInRange(this.state.email).then(() => {
            this.setState({ emailFormSubmitted: true });
        });
    }

    renderEmailCollectionForm() {
        if (this.state.emailFormSubmitted) {
            return (
                <p>
                    Thank you! We will notify you when we arrive in your area.
                </p>
            );
        }

        return (
            <Form
                inline
                onSubmit={e => this.handleEmailCollectionSubmitForm(e)}
            >
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

    validateZipCodeForm() {
        if (this.state.zipcode && this.state.zipcode.length === 5) {
            return (
                parseInt(this.state.zipcode).toString() === this.state.zipcode
            );
        }

        this.setState({ zipError: true });
    }

    handleZipCodeUpdateSubmitForm(event) {
        if (event) {
            event.preventDefault();
        }

        if (
            this.validateZipCodeForm() &&
            this.state.zipcode !== this.props.userLocation.zipcode
        ) {
            this.props.onSearchForLocation(this.state.zipcode);
        }
    }

    handleZipcodeChange(event) {
        this.setState({
            zipcode: event.target.value,
            zipError: false,
        });
    }

    renderZipCodeUpdateForm() {
        return (
            <div>
                <div className="zipcode-finder">
                    <div className="zipcode-finder__info">
                        <div>
                            {this.props.userLocation.city ? '' : 'Zip Code'}
                        </div>
                        <div className="zipcode-finder__zipcode">
                            {this.props.userLocation.city ||
                                this.props.userLocation.zipcode ||
                                '_____'}
                        </div>
                    </div>
                    <div className="zipcode-finder__form">
                        <div>Change Zip:</div>
                        <div>
                            <form
                                onSubmit={this.handleZipCodeUpdateSubmitForm.bind(
                                    this
                                )}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    className="zipcode-finder__input"
                                    value={this.state.zipcode}
                                    onChange={this.handleZipcodeChange.bind(
                                        this
                                    )}
                                />
                                <button className="zipcode-finder__button zipcode-finder__button--dark-bg">
                                    GO
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.zipError ? (
                    <div className="zipcode-finder__errors">
                        <span>Please enter your 5-digit zip code.</span>
                    </div>
                ) : (
                    ''
                )}
            </div>
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
                    {this.renderZipCodeUpdateForm()}
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
