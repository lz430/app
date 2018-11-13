import '../../styles/app.scss';
import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Card,
    CardBody,
    Button,
} from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import TradePendingClient from '../../apps/trade/client';
import { equals } from 'ramda';
import PersonalForm from '../../apps/trade/components/PersonalForm';

class Page extends Component {
    state = {
        // Auto Complete (Step One)
        isLoading: false,
        value: '',
        selected: null,
        suggestions: [],

        // Additional Options (Step Two)
        options: [],
        detailed: null,

        // Personal Info (Step Three)
        personalFinished: false,
        miles: null,
        zipcode: null,

        //
        // Report
        report: null,
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

        if (
            this.state.personalFinished &&
            this.state.personalFinished !== prevState.personalFinished
        ) {
            TradePendingClient.report(
                this.state.detailed.id,
                this.state.zipcode,
                this.state.miles
            ).then(res => {
                this.setState({ report: res.data });
            });
        }
    }

    reset() {
        this.setState({
            // Auto Complete (Step One)
            isLoading: false,
            value: '',
            selected: null,
            suggestions: [],

            // Additional Options (Step Two)
            options: [],
            detailed: null,

            // Personal Info (Step Three)
            personalFinished: false,
            miles: null,
            zipcode: null,

            //
            // Report
            report: null,
        });
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

    renderAutoSuggest() {
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
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(
                            this
                        )}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(
                            this
                        )}
                        onSuggestionSelected={this.onSuggestionSelected.bind(
                            this
                        )}
                        getSuggestionValue={this.getResultValue.bind(this)}
                        renderSuggestion={this.renderResult.bind(this)}
                        inputProps={inputProps}
                    />
                </Col>
            </Row>
        );
    }

    selectDetailedOption(option) {
        this.setState({ detailed: option });
    }

    renderSelection() {
        if (!this.state.options.length || this.state.detailed !== null) {
            return false;
        }

        return (
            <Row className="mt-5">
                {this.state.options.map(item => {
                    return (
                        <Col md={3} key={item.id}>
                            <Card className="mb-2">
                                <CardBody className="p-2">
                                    <ListGroup className="text-sm mb-2">
                                        <ListGroupItem className="p-1">
                                            <strong>ID:</strong> {item.id}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Year:</strong> {item.year}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Make:</strong> {item.make}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Model:</strong> {item.model}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Trim:</strong> {item.trim}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Body:</strong> {item.body}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Drivetrain:</strong>{' '}
                                            {item.drivetrain}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Engine:</strong>{' '}
                                            {item.engine}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Fuel Type:</strong>{' '}
                                            {item.fuel_type}
                                        </ListGroupItem>
                                    </ListGroup>

                                    <Button
                                        color="primary"
                                        block
                                        onClick={() =>
                                            this.selectDetailedOption(item)
                                        }
                                    >
                                        Select
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    }

    renderFinalResult() {
        if (!this.state.report) {
            return false;
        }

        const { report } = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h1>{report.report.ymmt}</h1>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md={4}>
                        <h3>Calculations:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>Advertising:</strong>{' '}
                                {report.calculations.advertising}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Depreciation:</strong>{' '}
                                {report.calculations.depreciation}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Overhead:</strong>{' '}
                                {report.calculations.overhead}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Profit:</strong>{' '}
                                {report.calculations.profit}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Reconditioning:</strong>{' '}
                                {report.calculations.reconditioning}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Sale Discount Percent:</strong>{' '}
                                {report.calculations.sale_discount_percent}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <h3>Report:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>Average Duration:</strong>{' '}
                                {report.report.average_duration}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Count:</strong> {report.report.count}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Demand Index:</strong>{' '}
                                {report.report.demand_index}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Mileage:</strong>{' '}
                                {report.report.mileage}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Radius:</strong> {report.report.radius}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Zipcode:</strong>{' '}
                                {report.report.zip_code}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - High:</strong>{' '}
                                {report.report.tradein.high}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - Low:</strong>{' '}
                                {report.report.tradein.low}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - Traget:</strong>{' '}
                                {report.report.tradein.target}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <h3>Vehicle:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>ID:</strong> {report.vehicle.id}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Year:</strong> {report.vehicle.year}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Make:</strong> {report.vehicle.make}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Model:</strong> {report.vehicle.model}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Trim:</strong> {report.vehicle.trim}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Drivetrain:</strong>{' '}
                                {report.vehicle.drivetrain}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Engine:</strong> {report.vehicle.engine}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Fuel Type:</strong>{' '}
                                {report.vehicle.fuel_type}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    onSubmitPersonalInfo(values) {
        this.setState({ personalFinished: true, ...values });
    }

    renderPersonalInfo() {
        if (!this.state.detailed || this.state.personalFinished) {
            return false;
        }

        return (
            <Row className="mt-5">
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="bg-white p-4 border border-primary">
                        <PersonalForm
                            onSubmit={this.onSubmitPersonalInfo.bind(this)}
                        />
                    </div>
                </Col>
            </Row>
        );
    }

    renderStartOver() {
        if (!this.state.selected) {
            return false;
        }

        return (
            <Row className="mt-5">
                <Col className="text-center">
                    <Button
                        onClick={() => {
                            this.reset();
                        }}
                        color="danger"
                    >
                        Start Over
                    </Button>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <div className="tp-poc">
                <Container className="mb-5 mt-5">
                    {this.renderAutoSuggest()}
                    {this.renderSelection()}
                    {this.renderPersonalInfo()}
                    {this.renderFinalResult()}
                    {this.renderStartOver()}
                </Container>
            </div>
        );
    }
}

export default Page;
