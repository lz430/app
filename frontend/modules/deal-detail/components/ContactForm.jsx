import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import FormikFieldWithreCaptcha from '../../../components/Forms/FormikFieldWithreCaptcha';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Row, Col, Button, FormGroup, Alert } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { track } from '../../../core/services';

import ApiClient from '../../../store/api';

const validationSchema = object().shape({
    subject: string().required(),
    firstname: string().required(),
    lastname: string().required(),
    email: string().required(),
    phone: string().required(),
    g_recaptcha_response: string().required(),
});

const initialFormValues = {
    subject: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    g_recaptcha_response: '',
};

class ContactForm extends React.Component {
    state = {
        success: false,
        values: null,
    };

    handleOnSubmit(values, actions) {
        this.setState({ values: values });

        ApiClient.brochure
            .contact(values)
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
                                Send my question
                            </Button>
                        );
                    }

                    return (
                        <Form className="deal__contact">
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="subject"
                                            id="subject"
                                            placeholder="I'd like to know"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            placeholder="First Name"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            placeholder="Last Name"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            placeholder="Phone Number (Optional)"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <label htmlFor="communication_method">
                                    Please indicate your preferred method of
                                    communication:
                                </label>
                                <FormikFieldWithBootstrapInput
                                    type="select"
                                    name="communication_method"
                                    id="communication_method"
                                >
                                    <option value="Email" label="Email" />
                                    <option value="Phone" label="Phone" />
                                </FormikFieldWithBootstrapInput>
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
