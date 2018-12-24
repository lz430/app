import React from 'react';
import FormikFieldWithBootstrapInput from '../../../components/Forms/FormikFieldWithBootstrapInput';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

import { Button, FormGroup, Label } from 'reactstrap';

import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const validationSchema = object().shape({
    email: string().required(),
});

const initialFormValues = {
    email: '',
};

class ForgotForm extends React.Component {
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
