import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class ZipcodeFinder extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            valid: false,
        };

        this.validateZip = this.validateZip.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
    }

    validateZip() {
        let zip = document.getElementById('zipcode_input').value;
        let valid = zip.length === 5;
        this.setState({
            valid: valid,
        });

        if (valid) {
            this.props.setZipCode(zip);
            document.getElementById('zipcode_input').value = '';
            this.toggleEditing();
        }
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    render() {
        return (
            <div className="zipcode-finder">
                <div className="zipcode-finder__info">
                    <div>Zip Code</div>
                    {this.state.editing
                        ? <input
                              className="zipcode-finder__code"
                              type="number"
                              id="zipcode_input"
                          />
                        : <div className="zipcode-finder__code">
                              {this.props.zipcode}
                          </div>}
                </div>
                <div className="zipcode-finder__buttons">
                    {this.state.editing
                        ? <div>
                              <button
                                  onClick={this.validateZip}
                                  className="zipcode-finder__button zipcode-finder__button--small zipcode-finder__button--dark-bg"
                              >
                                  Save
                              </button>
                              {' '}
                              <button
                                  onClick={this.toggleEditing}
                                  className="zipcode-finder__button zipcode-finder__button--small zipcode-finder__button--dark-bg"
                              >
                                  Cancel
                              </button>
                          </div>
                        : <button
                              onClick={this.toggleEditing}
                              className="zipcode-finder__button zipcode-finder__button--small zipcode-finder__button--dark-bg"
                          >
                              Update
                          </button>}
                </div>
            </div>
        );
    }
}

ZipcodeFinder.propTypes = {
    onUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        zipcode: state.zipcode,
    };
};

export default connect(mapStateToProps, Actions)(ZipcodeFinder);
