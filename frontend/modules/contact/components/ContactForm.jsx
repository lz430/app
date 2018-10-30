import React from 'react';
import PropTypes from 'prop-types';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Row, Col, Button, FormGroup, Label, Input, Alert } from 'reactstrap';

import { faArrowRight } from '@fortawesome/pro-light-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const validationSchema = object().shape({
    name: string().required(),
    email: string().required(),
    phone: string().required(),
    city: string().required(),
    state: string().required(),
    message: string().required(),
});

class ContactForm extends React.Component {
    static propTypes = {
        results: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
    };

    state = {
        results: null,
    };

    handleOnSubmit(values) {
        console.log(values);
        this.setState({ results: values });
        return true;
    }

    render() {
        if (this.state.results) {
            return (
                <Alert t>
                    Thanks {this.state.results.name}, we'll be in touch shortly.
                </Alert>
            );
        }

        return (
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    state: '',
                    message: '',
                }}
                validationSchema={validationSchema}
                onSubmit={values => this.handleOnSubmit(values)}
            >
                {props => (
                    <Form>
                        <FormGroup>
                            <Label for="exampleEmail">Your Name</Label>
                            <FormikFieldWithBootstrapInput
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Jane Smith"
                            />
                        </FormGroup>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
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
                                    <Label for="exampleEmail">Phone</Label>
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
                                    <Label for="exampleEmail">City</Label>
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
                                    <Label for="exampleEmail">State</Label>
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
                            <Label for="exampleText">Message</Label>
                            <FormikFieldWithBootstrapInput
                                type="textarea"
                                name="message"
                                id="message"
                                style={{ height: '150px' }}
                            />
                        </FormGroup>

                        <div className="text-right">
                            <Button type="submit" color="primary" size="lg">
                                Submit <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    }
}

export default ContactForm;
