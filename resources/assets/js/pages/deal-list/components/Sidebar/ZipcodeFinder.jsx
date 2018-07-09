import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { requestLocation } from 'apps/user/actions';

class ZipcodeFinder extends React.PureComponent {
    static propTypes = {
        meta: PropTypes.object,
        zipcode: PropTypes.string,
        city: PropTypes.string,
        zipInRange: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            zipError: false,
            zipcode: props.zipcode,
        };

        this.saveZip = this.saveZip.bind(this);
        this.isValid = this.isValid.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    isValid() {
        if (this.state.zipcode && this.state.zipcode.length === 5) {
            return (
                parseInt(this.state.zipcode).toString() === this.state.zipcode
            );
        }

        this.setState({ zipError: true });
    }

    saveZip(event) {
        if (event) event.preventDefault();

        if (this.isValid()) {
            this.props.onSearchForLocation(this.state.zipcode);
        }
    }

    handleChange(event) {
        this.setState({
            zipcode: event.target.value,
            zipError: false,
        });
    }

    render() {
        return (
            <div>
                <div className="zipcode-finder">
                    <div className="zipcode-finder__info">
                        <div className="zipcode-finder___count">
                            {this.props.meta &&
                            this.props.meta.entity === 'deal'
                                ? `${this.props.meta.total} results for:`
                                : ''}
                        </div>
                        <div>{this.props.city ? '' : 'Zip Code'}</div>
                        <div className="zipcode-finder__zipcode">
                            {this.props.city || this.props.zipcode || '_____'}
                        </div>
                    </div>
                    <div className="zipcode-finder__form">
                        <div>Change Zip:</div>
                        <div>
                            <form onSubmit={this.saveZip}>
                                <input
                                    type="number"
                                    min="0"
                                    className="zipcode-finder__input"
                                    placeholder={this.props.zipcode}
                                    onChange={this.handleChange}
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
}

const mapStateToProps = state => {
    return {
        meta: state.pages.dealList.meta,
        city: state.user.location.city,
        zipcode: state.user.location.zipcode,
        zipInRange: state.user.location.zipInRange,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSearchForLocation: search => {
            return dispatch(requestLocation(search));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZipcodeFinder);
