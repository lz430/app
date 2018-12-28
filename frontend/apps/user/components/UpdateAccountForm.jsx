import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Button, FormGroup, Label, Alert, Row, Col } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../../store/api';
import PropTypes from 'prop-types';

const validationSchema = object().shape({
    first_name: string().required(),
    last_name: string().required(),
    email: string().required(),
    password: string().required(),
    password_confirmation: string().required(),
});

const initialFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    current_password: '',
    password: '',
    password_confirmation: '',
};

class SignupForm extends React.Component {
    static propTypes = {
        handleOnSuccess: PropTypes.func.isRequired,
    };

    state = {
        globalFormError: null,
    };

    handleGlobalFormErrors(errors) {
        this.setState({ globalFormError: errors['form'] });
    }

    handleOnSubmit(values, actions) {
        api.user
            .signup(values)
            .then(() => {
                this.props.handleOnSuccess();
            })
            .catch(error => {
                console.log(error);
                const formErrors = api.translateApiErrors(error.response.data);
                if (formErrors.form) {
                    this.handleGlobalFormErrors(formErrors);
                } else {
                    actions.setErrors(formErrors);
                }
            })
            .then(() => {
                actions.setSubmitting(false);
            });
    }

    render() {
        return (
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) =>
                    this.handleOnSubmit(values, actions)
                }
            >
                {props => {
                    let button;

                    if (props.isSubmitting) {
                        button = (
                            <Button
                                type="submit"
                                color="primary"
                                size="md"
                                disabled={true}
                                block
                            >
                                Loading{' '}
                                <FontAwesomeIcon icon={faSpinner} spin={true} />
                            </Button>
                        );
                    } else {
                        button = (
                            <Button
                                type="submit"
                                color="primary"
                                size="md"
                                block
                            >
                                Submit
                            </Button>
                        );
                    }

                    return (
                        <Form>
                            <div className="p-3">
                                {this.state.globalFormError && (
                                    <Alert className="text-sm text-center">
                                        {this.state.globalFormError}
                                    </Alert>
                                )}
                                <fieldset>
                                    <legend>Account Info</legend>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="first_name">
                                                    First Name
                                                </Label>
                                                <FormikFieldWithBootstrapInput
                                                    type="text"
                                                    name="first_name"
                                                    id="first_name"
                                                    placeholder="Matt"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="last_name">
                                                    Last Name
                                                </Label>
                                                <FormikFieldWithBootstrapInput
                                                    type="text"
                                                    name="last_name"
                                                    id="last_name"
                                                    placeholder="Smith"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label for="email">Email Address</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="msmith@gmail.com"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Phone Number</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            placeholder="231-555-5555"
                                        />
                                    </FormGroup>
                                </fieldset>
                                <fieldset className="form-group">
                                    <legend>Update your password</legend>
                                    <FormGroup>
                                        <Label for="password">
                                            Current Password
                                        </Label>
                                        <FormikFieldWithBootstrapInput
                                            type="password"
                                            name="current_password"
                                            id="current_password"
                                            placeholder="Current Password"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Password"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password_confirmation">
                                            Confirm Password
                                        </Label>
                                        <FormikFieldWithBootstrapInput
                                            type="password"
                                            name="password_confirmation"
                                            id="password_confirmation"
                                            placeholder="Confirm Password"
                                        />
                                    </FormGroup>
                                </fieldset>
                            </div>
                            <div className="pl-3 pr-3">{button}</div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default SignupForm;
