import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Button, FormGroup, Label } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    password: '',
    password_confirmation: '',
};

class SignupForm extends React.Component {
    state = {
        success: false,
        values: null,
    };

    handleOnSubmit(values, actions) {
        actions.setSubmitting(false);
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
                                <FormGroup>
                                    <Label for="first_name">First Name</Label>
                                    <FormikFieldWithBootstrapInput
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        placeholder="Matt"
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
                                    <Label for="email">Email Address</Label>
                                    <FormikFieldWithBootstrapInput
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="msmith@gmail.com"
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
                            </div>
                            <div className="p-2">{button}</div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default SignupForm;
