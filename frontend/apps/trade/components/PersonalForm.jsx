import React from 'react';
import PropTypes from 'prop-types';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { number, object } from 'yup';

import { Button, Row, Col, FormGroup, Label } from 'reactstrap';

const validationSchema = object().shape({
    zipcode: number().required(),
    miles: number().required(),
});

const initialFormValues = {
    zipcode: '48116',
    miles: '20000',
};

class PersonalForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    state = {
        values: null,
        recaptchaToken: false,
    };

    handleOnSubmit(values, actions) {
        this.props.onSubmit(values, actions);
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
                {() => {
                    return (
                        <Form>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="zipcode">Zipcode</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="number"
                                            name="zipcode"
                                            id="zipcode"
                                            placeholder="48116"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="message">Miles</Label>
                                        <FormikFieldWithBootstrapInput
                                            type="number"
                                            name="miles"
                                            id="miles"
                                            placeholder="20000"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <div className="text-right">
                                <Button type="submit" color="primary" size="md">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default PersonalForm;
