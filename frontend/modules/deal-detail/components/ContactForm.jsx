import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import FormikFieldWithreCaptcha from '../../../components/Forms/FormikFieldWithreCaptcha';
import { dealType } from '../../../core/types';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Row, Col, Button, FormGroup, Alert } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { track } from '../../../core/services';

import ApiClient from '../../../store/api';

const validationSchema = object().shape({
    message: string().required(),
    firstname: string().required(),
    lastname: string().required(),
    email: string().required(),
    phone: string().required(),
    communication_method: string().required(),
    g_recaptcha_response: string().required(),
});

const initialFormValues = {
    message: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    communication_method: '',
    g_recaptcha_response: '',
};

class ContactForm extends React.Component {
    state = {
        success: false,
        values: null,
    };
    static propTypes = {
        deal: dealType,
    };

    handleOnSubmit(values, actions) {
        this.setState({ values: values });
        const payload = {
            form: 'deal',
            deal_id: this.props.deal.id.toString(),
            deal_vin: this.props.deal.vin,
            ...values,
        };

        ApiClient.brochure
            .contact(payload)
            .then(() => {
                track('deal-detail:contact-form:submitted', {
                    'Form Submission Success': 'success',
                });

                this.setState({ success: true });
            })
            .catch(error => {
                track('deal-detail:contact-form:submitted', {
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
                                size="lg"
                                disabled={true}
                            >
                                Loading{' '}
                                <FontAwesomeIcon icon={faSpinner} spin={true} />
                            </Button>
                        );
                    } else {
                        button = (
                            <Button type="submit" color="primary" size="lg">
                                Send my question
                            </Button>
                        );
                    }

                    return (
                        <Form className="deal__contact deal__row-faq-contact">
                            <h5>Ask a Question About This Car </h5>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormikFieldWithBootstrapInput
                                            type="textarea"
                                            name="message"
                                            id="message"
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
                                    value={this.state.value}
                                >
                                    <option value="" label="Select one" />
                                    <option value="Email" label="Email" />
                                    <option value="Phone" label="Phone" />
                                </FormikFieldWithBootstrapInput>
                            </FormGroup>

                            <Row>
                                <Col>
                                    <FormikFieldWithreCaptcha name="g_recaptcha_response" />
                                </Col>
                            </Row>
                            <Row className="deal__contact__cta">
                                <Col>
                                    <div className="text-center">{button}</div>
                                </Col>
                            </Row>
                            <Row>
                                <h6 className="deal__contact__phone text-center">
                                    Or Call: (855)675-7301
                                </h6>
                            </Row>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default ContactForm;
