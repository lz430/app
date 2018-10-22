import React from 'react';
import PropTypes from 'prop-types';

import { dealType } from '../../core/types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import DealPriceExplanationModalData from './DealPriceExplanationModalData';

class DealPriceExplanationModal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        deal: dealType.isRequired,
        dealPricing: PropTypes.object,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Modal
                className="no-header"
                size="content-fit"
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle} />
                <ModalBody>
                    <DealPriceExplanationModalData
                        deal={this.props.deal}
                        purchaseStrategy={this.props.purchaseStrategy}
                        dealPricing={this.props.dealPricing}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default DealPriceExplanationModal;
