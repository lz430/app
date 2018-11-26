import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import StepEstimateSearchVehicle from '../../../../apps/trade/components/StepEstimateSearchVehicle';
import StepEstimateSelectSpecificVehicle from '../../../../apps/trade/components/StepEstimateSelectSpecificVehicle';
import StepKnownValue from '../../../../apps/trade/components/StepKnownValue';
import StepTradeLien from '../../../../apps/trade/components/StepTradeLien';
import StepKnownOrEstimateValue from '../../../../apps/trade/components/StepKnownOrEstimateValue';
import StepMiles from '../../../../apps/trade/components/StepMiles';
import StepConfirmation from '../../../../apps/trade/components/StepConfirmation';

/**
 * Steps:
 * -- know_or_estimate (User is asked if they know the value or they want to estimate the value

 * If Know:
 * -- know_ask_for_value (if user selects know, they are presented with two
 *    input boxes, amount owed, and value of car

 * If Estimate:
 *  -- estimate_search_vehicle
 *  -- estimate_narrow_down (Optional, only if there are different choices)
 *
 * lien (Ask user if they have a lien on the car and how much they owe)
 * miles (User is asked for the miles on their car
 * confirmation (User is presented with all information we know about their car...
 * User will click (Okay) and be brought back to the cart page.

 */
class TradeInModal extends React.Component {
    static propTypes = {
        zipcode: PropTypes.string.isRequired,
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        handleTradeComplete: PropTypes.func.isRequired,
    };

    state = {
        step: 'know_or_estimate',
        selectedYearMakeModel: null,
        selectedVehicle: null,
        valueOfVehicle: 0,
        milesOnVehicle: 0,
        amountOwnedOnVehicle: 0,
    };

    handleSelectKnownOrEstimateValue(value) {
        if (value === 'estimate') {
            this.setState({ step: 'estimate_search_vehicle' });
        } else {
            this.setState({ step: 'know_value' });
        }
    }

    onVehicleSearchSelect(event, data) {
        this.setState({
            selectedYearMakeModel: data.suggestion,
            step: 'estimate_narrow_down',
        });
    }

    setSelectedVehicle(option) {
        this.setState({
            selectedVehicle: option,
            step: 'lien',
        });
    }

    handleConfirmTradeLien(amountOwnedOnVehicle) {
        this.setState({
            amountOwnedOnVehicle: amountOwnedOnVehicle,
            step: 'miles',
        });
    }

    handleConfirmMilesOnVehicle(milesOnVehicle) {
        this.setState({
            milesOnVehicle: milesOnVehicle,
            step: 'confirmation',
        });
    }

    handleConfirmKnownValue(value) {
        this.setState({
            valueOfVehicle: value,
            step: 'miles',
        });
    }

    handleConfirmationComplete(estimate) {
        let value = this.state.valueOfVehicle;
        if (estimate) {
            if (estimate.report.tradein.target) {
                value = estimate.report.tradein.target;
            }
        }

        this.props.handleTradeComplete(
            value,
            this.state.amountOwnedOnVehicle,
            estimate
        );
    }

    renderKnowOrEstimateStep() {
        return (
            <StepKnownOrEstimateValue
                handleSelectKnownOrEstimateValue={this.handleSelectKnownOrEstimateValue.bind(
                    this
                )}
            />
        );
    }

    renderSelectVehicleStep() {
        return (
            <StepEstimateSelectSpecificVehicle
                vehicle={this.state.selectedYearMakeModel}
                onSpecificVehicleSelect={this.setSelectedVehicle.bind(this)}
            />
        );
    }

    renderEstimateSearchStep() {
        return (
            <StepEstimateSearchVehicle
                onSearchSelect={this.onVehicleSearchSelect.bind(this)}
            />
        );
    }

    renderKnownValue() {
        return (
            <StepKnownValue
                onConfirmValue={this.handleConfirmKnownValue.bind(this)}
            />
        );
    }

    renderLienStep() {
        return (
            <StepTradeLien
                onConfirmTradeLien={this.handleConfirmTradeLien.bind(this)}
            />
        );
    }

    renderMilesStep() {
        return (
            <StepMiles
                onConfirmMiles={this.handleConfirmMilesOnVehicle.bind(this)}
            />
        );
    }

    renderConfirmationStep() {
        return (
            <StepConfirmation
                value={this.state.valueOfVehicle}
                owed={this.state.amountOwnedOnVehicle}
                detailedVehicle={this.state.selectedVehicle}
                miles={this.state.milesOnVehicle}
                zipcode={this.props.zipcode}
                handleConfirmationComplete={this.handleConfirmationComplete.bind(
                    this
                )}
            />
        );
    }

    render() {
        return (
            <Modal
                className="trade-in-modal"
                size="lg"
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>Trade In</ModalHeader>
                <ModalBody>
                    {this.state.step === 'know_or_estimate' &&
                        this.renderKnowOrEstimateStep()}
                    {this.state.step === 'know_value' &&
                        this.renderKnownValue()}
                    {this.state.step === 'estimate_search_vehicle' &&
                        this.renderEstimateSearchStep()}
                    {this.state.step === 'estimate_narrow_down' &&
                        this.renderSelectVehicleStep()}
                    {this.state.step === 'lien' && this.renderLienStep()}
                    {this.state.step === 'miles' && this.renderMilesStep()}
                    {this.state.step === 'confirmation' &&
                        this.renderConfirmationStep()}
                </ModalBody>
            </Modal>
        );
    }
}

export default TradeInModal;
