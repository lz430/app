import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class ZipcodeFinder extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            zipcode: props.zipcode,
        };

        this.saveZip = this.saveZip.bind(this);
        this.isValid = this.isValid.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    isValid() {
        return (
            this.state.zipcode &&
            this.state.zipcode.length === 5 &&
            parseInt(this.state.zipcode).toString() === this.state.zipcode
        );
    }

    saveZip(event) {
        if (event) event.preventDefault();

        if (this.isValid()) {
            this.props.setZipCode(this.state.zipcode);
        }
    }

    handleChange(event) {
        this.setState({
            zipcode: event.target.value,
        });
    }

    render() {
        return (
            <div className="zipcode-finder">
                <div className="zipcode-finder__info">
                    <div className="zipcode-finder___count">
                        {`${this.props.results_count} results for:`}
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
                                type="text"
                                className="zipcode-finder__input"
                                placeholder="00000"
                                onChange={this.handleChange}
                            />
                            <button className="zipcode-finder__button zipcode-finder__button--dark-bg">
                                GO
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

ZipcodeFinder.propTypes = {
    zipcode: PropTypes.string,
    city: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        city: state.city,
        results_count: state.deals.length,
        zipcode: state.zipcode,
    };
};

export default connect(mapStateToProps, Actions)(ZipcodeFinder);
