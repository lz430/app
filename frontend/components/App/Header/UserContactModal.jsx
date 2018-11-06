import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody, Row, Container, Col } from 'reactstrap';
import ChatWidget from '../ChatWidget';

import { faPhone } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    <Container>
                        <Row>
                            <Col>
                                <h2 className="icon__help text-center">?</h2>
                                <p className="text-center">
                                    Have any questions? Can&#39;t find what
                                    you&#39;re looking for? Have a trade-in or
                                    lease turn-in? Our car professionals are
                                    here to help.
                                </p>
                            </Col>
                        </Row>
                        <Row className="mt-3 border-top">
                            <Col className="p-3 border-right text-center">
                                <a
                                    href="tel:855-675-7301"
                                    className="d-block text-center"
                                >
                                    <FontAwesomeIcon icon={faPhone} />
                                    <span className="btn btn-primary">
                                        <span className="d-md-inline">
                                            855-675-7301
                                        </span>
                                    </span>
                                </a>
                            </Col>
                            <Col className="p-3 text-center">
                                <ChatWidget presentation="modal" />
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
            </Modal>
        );
    }
}

export default UserContactModal;
