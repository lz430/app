import React, { Component } from 'react';
import api from 'src/api';
import util from 'src/util';
import { connect } from 'react-redux';
import * as Actions from 'apps/common/actions';

class NoDealsOutOfRange extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            formSubmitted: false,
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        api.postNotifyWhenInRange(this.state.email).then(() => {
            this.setState({ formSubmitted: true });
        });
    }

    render() {
        const isMobile = !util.windowIsLargerThanSmall(this.props.window.width);
        const formNotSubmittedMessage = `Our service is not currently available in your area. Please${
            isMobile ? ' change your zip code or' : ''
        } provide your email so that we can notify you when we arrive. We apologize for the inconvenience.`;
        const formSubmittedMessage =
            'Thank you! We will notify you when we arrive in your area.';
        return (
            <div className="deals__no-matches">
                <div>
                    <p>
                        {this.state.formSubmitted
                            ? formSubmittedMessage
                            : formNotSubmittedMessage}
                    </p>
                </div>
                {isMobile ? (
                    <button
                        className="deals__button deals__button--pink deals__button--zip"
                        onClick={this.props.toggleSmallFiltersShown}
                    >
                        Change Zip
                    </button>
                ) : null}
                {!this.state.formSubmitted ? (
                    <form onSubmit={e => this.handleSubmit(e)}>
                        <div>
                            <input
                                className="deals__input"
                                placeholder="Enter your email address"
                                onChange={e => {
                                    this.setState({ email: e.target.value });
                                }}
                                value={this.state.email}
                                type="email"
                                required
                            />
                            <button
                                className="deals__button deals__button--blue"
                                type="submit"
                            >
                                Submit Email
                            </button>
                        </div>
                    </form>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
    };
};
export default connect(
    mapStateToProps,
    Actions
)(NoDealsOutOfRange);
