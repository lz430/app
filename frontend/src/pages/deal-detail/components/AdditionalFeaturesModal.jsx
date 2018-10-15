import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import PropTypes from 'prop-types';
import { dealType } from 'types';

class AdditionalFeaturesModal extends React.Component {
    static propTypes = {
        toggle: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,

        deal: dealType,
    };

    render() {
        if (!this.props.isOpen) {
            return false;
        }

        return (
            <Modal
                size="content-fit"
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>
                    <div className="modal__titles modal__titles--center">
                        Additional Options
                    </div>
                </ModalHeader>
                <ModalBody className="text-sm">
                    <ul>
                        {this.props.deal.vauto_features.map(
                            (feature, index) => {
                                return <li key={index}>{feature}</li>;
                            }
                        )}
                    </ul>
                </ModalBody>
            </Modal>
        );
    }
}

export default AdditionalFeaturesModal;
