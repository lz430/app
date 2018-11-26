import '../../styles/app.scss';
import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import PersonalForm from '../../apps/trade/components/PersonalForm';
import StepEstimateSearchVehicle from '../../apps/trade/components/StepEstimateSearchVehicle';
import StepEstimateSelectSpecificVehicle from '../../apps/trade/components/StepEstimateSelectSpecificVehicle';
import StepConfirmation from '../../apps/trade/components/StepConfirmation';

/**
 * Steps:
 * -- know_or_estimate (User is asked if they know the value or they want to estimate the value

 * If Know:
 * -- know_ask_for_value (if user selects know, they are presented with two
 *    input boxes, amount owed, and value of car

 * If Estimate:
 *  -- estimate_search_vehicle
 *  -- estimate_narrow_down (Optional, only if there are different choices)

 * miles (User is asked for the miles on their car
 * confirmation (User is presented with all information we know about their car...
 * User will click (Okay) and be brought back to the cart page.

 */
class Page extends Component {
    state = {
        step: 'know_or_estimate',
        selected: null,

        // Additional Options (Step Two)
        detailed: null,

        // Personal Info (Step Three)
        personalFinished: false,
        miles: null,
        zipcode: null,
    };

    reset() {
        this.setState({
            // Auto Complete (Step One)
            selected: null,

            // Additional Options (Step Two)
            detailed: null,

            // Personal Info (Step Three)
            personalFinished: false,
            miles: null,
            zipcode: null,
        });
    }

    onVehicleSearchSelect(event, data) {
        this.setState({ selected: data.suggestion });
    }

    selectDetailedOption(option) {
        this.setState({ detailed: option });
    }

    renderEstimateSearchStep() {
        if (this.state.selected) {
            return false;
        }

        return (
            <StepEstimateSearchVehicle
                onSearchSelect={this.onVehicleSearchSelect.bind(this)}
            />
        );
    }

    renderSelection() {
        if (!this.state.selected || this.state.detailed !== null) {
            return false;
        }

        return (
            <StepEstimateSelectSpecificVehicle
                vehicle={this.state.selected}
                onSpecificVehicleSelect={this.selectDetailedOption.bind(this)}
            />
        );
    }

    renderFinalResult() {
        return (
            <StepConfirmation
                show={this.state.personalFinished}
                detailedVehicle={this.state.detailed}
                miles={this.state.miles}
                zipcode={this.state.zipcode}
            />
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
                    {this.renderEstimateSearchStep()}
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
