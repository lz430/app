import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Alert, Button, FormGroup, Label } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import PropTypes from 'prop-types';

const validationSchema = object().shape({
    email: string().required(),
    password: string().required(),
});

const initialFormValues = {
    email: '',
    password: '',
};

/**
 * Formik doens't support global form errors.
 * @see https://github.com/jaredpalmer/formik/issues/711
 */
class LoginForm extends React.Component {
    static propTypes = {
        loginUser: PropTypes.func.isRequired,
    };

    state = {
        globalFormError: null,
    };

    handleGlobalFormErrors(errors) {
        this.setState({ globalFormError: errors['form'] });
    }

    handleOnSubmit(values, actions) {
        actions.handleGlobalFormErrors = this.handleGlobalFormErrors.bind(this);
        this.props.loginUser(values, actions);
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
                            </div>
                            <div className="text-center pb-1 text-sm">
                                <Link href="/auth/forgot" as="/forgot" passHref>
                                    <a>Reset my password</a>
                                </Link>
                            </div>
                            <div className="p-2">{button}</div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default LoginForm;
