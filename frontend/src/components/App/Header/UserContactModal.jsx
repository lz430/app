import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody, Alert, Button } from 'reactstrap';
import Bolt from 'icons/zondicons/Bolt';
import Phone from 'icons/zondicons/Phone';
import ChatIcon from 'icons/zondicons/ChatBubbleDots';
import ChatWidget from '../ChatWidget';

class UserContactModal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
    };

    render() {
        if (!this.props.isOpen) {
            return false;
        }

        return (
            <Modal
                className="user-contact-modal"
                size="content-fit"
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle} />
                <ModalBody>
                    <h3 className="text-center">Contact Us: </h3>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <a
                                    href="tel:855-675-7301"
                                    className="d-block text-center"
                                >
                                    <span className="btn btn-primary">
                                        <span className="d-md-inline">
                                            Give Us A Call
                                        </span>
                                        <Phone />
                                    </span>
                                    {/*<span className="hidden d-md-inline">(855) 675-7301</span>*/}
                                </a>
                            </div>

                            <div className="col">
                                <ChatWidget presentation="modal" />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default UserContactModal;
