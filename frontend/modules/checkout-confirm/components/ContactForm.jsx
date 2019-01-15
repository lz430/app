import React from 'react';
import PropTypes from 'prop-types';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import FormikFieldWithreCaptcha from '../../../components/Forms/FormikFieldWithreCaptcha';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import states from '../../../content/states';

const validationSchema = object().shape({
    first_name: string().required(),
    last_name: string().required(),
    email: string().required(),
    phone_number: string().required(),
    drivers_license_number: string().required('Required'),
    drivers_license_state: string().required('Required'),
    g_recaptcha_response: string().required(),
});

const initialFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    drivers_license_number: '',
    drivers_license_state: 'MI',
    g_recaptcha_response: '',
};

class ContactForm extends React.Component {
    static propTypes = {
        onCheckoutContact: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
    };

    handleOnSubmit(values, actions) {
        this.props.onCheckoutContact(values, actions);
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
                                color="success"
                                size="lg"
                                disabled={true}
                                block
                            >
                                Loading{' '}
                                <FontAwesomeIcon icon={faSpinner} spin={true} />
                            </Button>
                        );
                    } else {
                        let label = 'Confirm and Submit';
                        if (this.props.checkout.strategy !== 'cash') {
                            label = (
                                <span>
                                    <strong>Next:</strong> Apply For Financing
                                </span>
                            );
                        }

                        button = (
                            <Button
                                className="border-radius-0"
                                type="submit"
                                color="primary"
                                size="lg"
                                block
                            >
                                {label}
                            </Button>
                        );
                    }

                    return (
                        <React.Fragment>
                            <Form>
                                <div className="pl-4 pr-4 pt-2">
                                    <FormGroup>
                                        <Label for="first_name">
                                            First Name
                                        </Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            placeholder="Jane"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="last_name">Last Name</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            placeholder="Smith"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="jane@example.com"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="phone_number">Phone</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="tel"
                                            name="phone_number"
                                            id="phone_number"
                                            placeholder="(231) 225 5555"
                                        />
                                    </FormGroup>
                                    <div className="d-flex">
                                        <div className="pr-2 flex-grow-1 ">
                                            <FormGroup>
                                                <Label for="drivers_license_number">
                                                    Drivers License Number
                                                </Label>
                                                <FormikFieldWithBootstrapInput
                                                    type="text"
                                                    name="drivers_license_number"
                                                    id="drivers_license_number"
                                                    placeholder=""
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="pl-2">
                                            <FormGroup>
                                                <Label for="drivers_license_state">
                                                    State
                                                </Label>
                                                <FormikFieldWithBootstrapInput
                                                    type="select"
                                                    name="drivers_license_state"
                                                    id="drivers_license_state"
                                                >
                                                    {states.map(item => (
                                                        <option
                                                            key={
                                                                item.abbreviation
                                                            }
                                                            value={
                                                                item.abbreviation
                                                            }
                                                        >
                                                            {item.abbreviation}
                                                        </option>
                                                    ))}
                                                </FormikFieldWithBootstrapInput>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <Row>
                                        <Col>
                                            <FormikFieldWithreCaptcha name="g_recaptcha_response" />
                                        </Col>
                                    </Row>
                                </div>
                                <Row className="mt-3">
                                    <Col>{button}</Col>
                                </Row>
                            </Form>
                        </React.Fragment>
                    );
                }}
            </Formik>
        );
    }
}

export default ContactForm;
