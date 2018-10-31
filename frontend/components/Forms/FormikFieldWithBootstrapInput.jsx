import React from 'react';
import { Input, FormFeedback } from 'reactstrap';
import { Field as FormikField } from 'formik';

/**
 * A custom bootstrap input component to use with a formik field
 * @param field
 * @param touched
 * @param errors
 * @param submitCount
 * @param props
 * @returns {*}
 * @constructor
 */
const CustomBootstrapInputComponent = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) => {
    const showError = !!(touched[field.name] || submitCount);

    return (
        <div>
            <Input
                invalid={!!(showError && errors[field.name])}
                {...field}
                {...props}
            />
            {showError &&
                errors[field.name] && (
                    <FormFeedback>{errors[field.name]}</FormFeedback>
                )}
        </div>
    );
};

/**
 * A Formik Field whose component is a custom bootstrap input
 * Usage: pass the same props to this component as you would pass to the Input field from reactstrap.
 * Example:
 *    <FormikFieldWithBootstrapInput
 name="email"
 placeholder='Email'
 bsSize='lg'
 className={'mb-2'}
 type={'email'} />

 //is equivalent with
 <FormikField name='email'>
 {({ field, form }) => (
          <Input
               placeholder='Email'
               bsSize='lg'
               className={'mb-2'}
               type={'email'}
               invalid={form.touched[field.name] && form.errors[field.name]}
                />
          )}
 </FormikField>
 * @param props
 * @returns {*}
 */
export default props => (
    <FormikField {...props} component={CustomBootstrapInputComponent} />
);
