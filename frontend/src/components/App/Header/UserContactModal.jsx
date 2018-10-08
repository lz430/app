import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Phone from 'icons/zondicons/Phone';
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
                    <div className="container">
                        <div className="row">
                            <h2 className="icon__help text-center">?</h2>
                            <p className="text-center">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Aliquam at porttitor sem.
                                Aliquam erat volutpat. Donec placerat nisl
                                magna, et faucibus arcu condimentum sed
                            </p>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <a
                                    href="tel:855-675-7301"
                                    className="d-block text-center"
                                >
                                    <Phone />
                                    <span className="btn btn-primary">
                                        <span className="d-md-inline">
                                            855-675-7301
                                        </span>
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
