import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Button, FormGroup, Label } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../../store/api';
import PropTypes from 'prop-types';

const validationSchema = object().shape({
    email: string().required(),
});

const initialFormValues = {
    email: '',
};

class ForgotForm extends React.Component {
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
            .passwordForgotRequest(values.email)
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
                                    <Label for="email">Email Address</Label>
                                    <FormikFieldWithBootstrapInput
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="msmith@gmail.com"
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

export default ForgotForm;
