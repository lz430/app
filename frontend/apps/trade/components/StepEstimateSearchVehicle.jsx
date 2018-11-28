import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import TradePendingClient from '../../../apps/trade/client';
import { equals } from 'ramda';

class StepEstimateSearchVehicle extends Component {
    static propTypes = {
        onSearchSelect: PropTypes.func.isRequired,
    };
    state = {
        step: 'know_or_estimate',
        isLoading: false,
        value: '',
        selected: null,
        suggestions: [],
    };

    latestRequest = null;

    componentDidUpdate(prevProps, prevState) {
        if (
            !equals(prevState.selected, this.state.selected) &&
            this.state.selected
        ) {
            TradePendingClient.selectDetails(this.state.selected).then(res => {
                if (res.data.details.length > 1) {
                    this.setState({ options: res.data.details });
                } else {
                    this.setState({
                        options: res.data.details,
                        detailed: res.data.details[0],
                    });
                }
            });
        }
    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue,
        });
    }

    onSuggestionsFetchRequested({ value }) {
        const inputValue = value.trim().toLowerCase();

        this.setState({
            isLoading: true,
        });

        // Make request
        const thisRequest = (this.latestRequest = TradePendingClient.suggest(
            inputValue
        ).then(res => {
            // If this is true there's a newer request happening, stop everything
            if (thisRequest !== this.latestRequest) {
                return;
            }

            let result = [];
            res.data.hits.hits.forEach(item => {
                let car, v, ymmt;
                v = item._source;
                ymmt = v.year + ' ' + v.make + ' ' + v.model + ' ' + v.trim;
                car = {
                    ymmt: ymmt,
                    year: v.year,
                    make: v.make,
                    model: v.model,
                    trim: v.trim,
                };
                return result.push(car);
            });

            this.setState({
                suggestions: result,
                isLoading: false,
            });
        }));
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
        });
    }

    onSuggestionSelected(event, data) {
        this.setState({ selected: data.suggestion });
    }

    getResultValue(result) {
        return result.ymmt;
    }

    renderResult(result) {
        return <div>{result.ymmt}</div>;
    }

    render() {
        if (this.state.selected) {
            return false;
        }

        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Start typing a car',
            value,
            onChange: this.onChange.bind(this),
        };

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Search for your vehicle</h3>
                    </Col>
                </Row>
                <Row className="mt-3 mb-3">
                    <Col md={{ size: 6, offset: 3 }}>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(
                                this
                            )}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(
                                this
                            )}
                            onSuggestionSelected={this.props.onSearchSelect}
                            getSuggestionValue={this.getResultValue.bind(this)}
                            renderSuggestion={this.renderResult.bind(this)}
                            inputProps={inputProps}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default StepEstimateSearchVehicle;
