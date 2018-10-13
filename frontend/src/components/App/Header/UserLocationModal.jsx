import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    Alert,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import Bolt from '../../../icons/zondicons/Bolt';
import Location from '../../../icons/zondicons/Location';

class UserLocationModal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        userLocation: PropTypes.object,
        setNewLocation: PropTypes.func.isRequired,
    };

    state = {
        location: this.props.userLocation.zipcode,
        isInvalidZipcodeError: false,
    };

    isValid() {
        if (this.state.location && this.state.location.length === 5) {
            return (
                parseInt(this.state.location).toString() === this.state.location
            );
        }

        this.setState({ isInvalidZipcodeError: true });
    }

    onSubmit(event) {
        if (event) event.preventDefault();
        if (this.isValid()) {
            this.props.setNewLocation(this.state.location);
        }
    }

    onChange(event) {
        event.preventDefault();

        this.setState({
            location: event.target.value,
            isInvalidZipcodeError: false,
        });
    }

    render() {
        if (!this.props.isOpen) {
            return false;
        }

        return (
            <Modal
                className="user-location-modal no-header"
                size="content-fit"
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle} />
                <ModalBody>
                    <h4>Show Me Deals For:</h4>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <div className="location-input">
                            <div className="icon">
                                <Location />
                            </div>
                            <div className="location-content">
                                <FormGroup>
                                    <Label for="location">Your Zipcode:</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        name="location"
                                        id="location"
                                        placeholder="Location"
                                        value={this.state.location}
                                        onChange={this.onChange.bind(this)}
                                    />
                                </FormGroup>
                            </div>
                        </div>

                        {this.state.isInvalidZipcodeError && (
                            <Alert color="danger">
                                <Bolt /> This zipcode does not appear to be
                                valid, please enter a valid zipcode.
                            </Alert>
                        )}

                        {!this.props.userLocation.zipcode && (
                            <Alert color="danger">
                                <Bolt /> Unable to find zipcode.
                            </Alert>
                        )}
                        <Button color="primary"> Update Location</Button>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}

export default UserLocationModal;
