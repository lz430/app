import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class TradeInModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
    };

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
                    <div>HALLO</div>
                </ModalBody>
            </Modal>
        );
    }
}

export default TradeInModal;
