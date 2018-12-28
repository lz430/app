import React from 'react';
import PropTypes from 'prop-types';

import { Formik, Form } from 'formik';
import { string, object } from 'yup';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Button, FormGroup, Label } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../../store/api';

const validationSchema = object().shape({
    password: string().required(),
    password_confirmation: string().required(),
});

const initialFormValues = {
    password: '',
    password_confirmation: '',
};

class ForgotChangeForm extends React.Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
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
            .passwordForgotChange(
                this.props.token,
                this.props.email,
                values.password,
                values.password_confirmation
            )
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
                                        placeholder="Password"
                                    />
                                </FormGroup>
                            </div>
                            <div className="p-3">{button}</div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default ForgotChangeForm;
