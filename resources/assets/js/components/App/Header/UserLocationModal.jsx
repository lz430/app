import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UserLocationModal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        userLocation: PropTypes.object,
        setNewLocation: PropTypes.func.isRequired,
    };

    state = {
        location: this.props.userLocation.zipcode,
        error: false,
    };

    isValid() {
        if (this.state.location && this.state.location.length === 5) {
            return (
                parseInt(this.state.location).toString() === this.state.location
            );
        }

        this.setState({ error: true });
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
            error: false,
        });
    }

    render() {
        if (!this.props.isOpen) {
            return false;
        }

        return (
            <Modal
                className="no-header"
                size="content-fit"
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle} />
                <ModalBody>
                    <h3>Show Me Deals For:</h3>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <FormGroup>
                            <Label for="location" hidden>
                                Location
                            </Label>
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
                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}

export default UserLocationModal;
