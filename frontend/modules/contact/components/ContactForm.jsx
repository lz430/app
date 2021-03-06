import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import FormikFieldWithreCaptcha from '../../../components/Forms/FormikFieldWithreCaptcha';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Row, Col, Button, FormGroup, Label, Alert } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { track } from '../../../core/services';

import ApiClient from '../../../store/api';

const validationSchema = object().shape({
    firstname: string().required(),
    lastname: string().required(),
    email: string().required(),
    phone: string().required(),
    city: string().required(),
    state: string().required(),
    message: string().required(),
    g_recaptcha_response: string().required(),
});

const initialFormValues = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
    g_recaptcha_response: '',
};

class ContactForm extends React.Component {
    state = {
        success: false,
        values: null,
    };

    handleOnSubmit(values, actions) {
        this.setState({ values: values });
        const payload = {
            form: 'brochure',
            ...values,
        };

        ApiClient.brochure
            .contact(payload)
            .then(() => {
                track('brochure-contact:form:submitted', {
                    'Form Submission Success': 'success',
                });

                this.setState({ success: true });
            })
            .catch(error => {
                track('brochure-contact:form:submitted', {
                    'Form Submission Success': 'error',
                });

                actions.setErrors(
                    ApiClient.translateApiErrors(error.response.data)
                );
            })
            .then(() => {
                actions.setSubmitting(false);
            });
    }

    render() {
        if (this.state.success && this.state.values) {
            return (
                <Alert color="success">
                    Thanks {this.state.values.firstname}, we&#39;ll be in touch
                    shortly.
                </Alert>
            );
        }

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
                            >
                                Loading{' '}
                                <FontAwesomeIcon icon={faSpinner} spin={true} />
                            </Button>
                        );
                    } else {
                        button = (
                            <Button type="submit" color="primary" size="md">
                                Submit
                            </Button>
                        );
                    }

                    return (
                        <Form>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="firstname">
                                            First Name
                                        </Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            placeholder="Jane"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="lastname">Last Name</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            placeholder="Smith"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="jane@example.com"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="phone">Phone</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            placeholder="(231) 225 5555"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="city">City</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="city"
                                            id="city"
                                            placeholder="Brighton"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="state">State</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="state"
                                            id="state"
                                            placeholder="MI"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Label for="message">Message</Label>
                                <FormikFieldWithBootstrapInput
                                    type="textarea"
                                    name="message"
                                    id="message"
                                    style={{ height: '150px' }}
                                />
                            </FormGroup>

                            <Row>
                                <Col>
                                    <FormikFieldWithreCaptcha name="g_recaptcha_response" />
                                </Col>
                            </Row>

                            <div className="text-right">{button}</div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default ContactForm;
