import React, { Component } from 'react';
import api from 'src/api';
import util from 'src/util';
import { connect } from 'react-redux';
import { toggleSmallFiltersShown } from 'pages/deal-list/actions';
import PropTypes from 'prop-types';
import ZipcodeFinder from 'pages/deal-list/components/Sidebar/ZipcodeFinder';

class NoDealsOutOfRange extends Component {
    static propTypes = {
        window: PropTypes.shape({
            width: PropTypes.number.isRequired,
        }).isRequired,
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
    };

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
                    <button className="btn btn-success" type="submit">
                        Submit Email
                    </button>
                </div>
            </form>
        );
    }

    render() {
        const isMobile = !util.windowIsLargerThanSmall(this.props.window.width);
        const formNotSubmittedMessage = ` Please${
            isMobile ? ' change your zip code or' : ''
        } `;

        return (
            <div className="deals__no-matches">
                <div>
                    <p>
                        Our service is not currently available in your selected
                        area. Please update your location
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

const mapStateToProps = state => {
    return {
        window: state.common.window,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoDealsOutOfRange);
