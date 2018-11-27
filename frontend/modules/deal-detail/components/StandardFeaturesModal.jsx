import React from 'react';
import PropTypes from 'prop-types';
import { dealType } from '../../../core/types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Loading from '../../../components/Loading';

import DealDimensions from './DealDimensions';
import DealWarranties from './DealWarranties';

class StandardFeaturesModal extends React.Component {
    static propTypes = {
        toggle: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        deal: dealType.isRequired,
        basicFeatures: PropTypes.array,
        fuelEconomy: PropTypes.object,
    };

    render() {
        if (!this.props.isOpen) {
            return false;
        }

        const deal = this.props.deal;

        return (
            <Modal
                size="content-fit"
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>
                    <div className="modal__titles modal__titles--center">
                        <div className="modal__subtitle modal__subtitle--center">
                            Standard Features
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <h6>Specifications</h6>
                    <hr />

                    <ul className="text-sm">
                        {this.props.basicFeatures ? (
                            this.props.basicFeatures.map((feature, index) => {
                                return (
                                    <li key={index}>
                                        {feature.name}: {feature.content}
                                    </li>
                                );
                            })
                        ) : (
                            <Loading />
                        )}

                        {this.props.fuelEconomy ? (
                            <li>
                                Fuel Economy - City:{' '}
                                {this.props.fuelEconomy.city} Highway:{' '}
                                {this.props.fuelEconomy.highway}
                            </li>
                        ) : (
                            <Loading />
                        )}
                    </ul>

                    <h6>Dimensions</h6>
                    <DealDimensions id={this.props.deal.id} />

                    <h6>Warranties</h6>
                    <DealWarranties id={this.props.deal.id} />

                    <h6>Features</h6>
                    <hr />
                    <ul className="text-sm">
                        {deal.features.map((feature, index) => {
                            return <li key={index}>{feature.feature}</li>;
                        })}
                    </ul>
                </ModalBody>
            </Modal>
        );
    }
}

export default StandardFeaturesModal;
