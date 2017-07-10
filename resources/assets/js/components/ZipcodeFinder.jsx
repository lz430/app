import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class ZipcodeFinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            zipcode: props.zipcode,
        };

        this.saveZip = this.saveZip.bind(this);
        this.isValid = this.isValid.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    isValid() {
        console.log(this.state.zipcode);
        return (
            this.state.zipcode.length === 5 &&
            parseInt(this.state.zipcode).toString() === this.state.zipcode
        );
    }

    saveZip() {
        if (this.isValid()) {
            this.props.setZipCode(this.state.zipcode);
            this.toggleEditing();
        }
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    handleChange(event) {
        this.setState({
            zipcode: event.target.value,
        });
    }

    render() {
        const valid = this.isValid();

        return (
            <div className="zipcode-finder">
                <div className="zipcode-finder__info">
                    <div>Zip Code</div>
                    {this.state.editing
                        ? <input
                              className={`zipcode-finder__input ${valid ? '' : 'zipcode-finder__input--invalid'}`}
                              type="number"
                              pattern="\d*"
                              value={this.state.zipcode}
                              onChange={this.handleChange}
                          />
                        : <div className="zipcode-finder__zipcode">
                              {this.props.zipcode}
                          </div>}
                </div>
                <div className="zipcode-finder__buttons">
                    {this.state.editing
                        ? <div>
                              <button
                                  onClick={this.toggleEditing}
                                  className="zipcode-finder__button zipcode-finder__button--small zipcode-finder__button--dark-bg"
                              >
                                  <SVGInline
                                      width="12px"
                                      height="12px"
                                      className="zipcode-finder__button-icon"
                                      svg={zondicons['close']}
                                  />
                                  Cancel
                              </button>
                              <button
                                  onClick={this.saveZip}
                                  className={`zipcode-finder__button zipcode-finder__button--small zipcode-finder__button--dark-bg ${valid ? '' : 'zipcode-finder__button--inactive'}`}
                              >
                                  <SVGInline
                                      width="12px"
                                      height="12px"
                                      className="zipcode-finder__button-icon"
                                      svg={zondicons['checkmark']}
                                  />
                                  Save
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
