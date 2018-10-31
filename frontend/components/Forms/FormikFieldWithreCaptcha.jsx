import React from 'react';
import { Field as FormikField } from 'formik';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../../core/config';

class RecapchaFormField extends React.Component {
    static propTypes = {
        field: PropTypes.shape({
            name: PropTypes.string.isRequired,
            onChange: PropTypes.func.isRequired,
            onBlur: PropTypes.func.isRequired,
            value: PropTypes.any,
        }),
        form: PropTypes.object.isRequired,
    };

    recaptchaRef = React.createRef();

    handleVerifyRecaptchaToken = recaptchaToken => {
        this.props.form.setFieldValue(this.props.field.name, recaptchaToken);
    };

    componentDidUpdate() {
        if (
            this.props.field.value &&
            Object.keys(this.props.form.errors).length &&
            this.props.form.submitCount
        ) {
            this.props.form.setFieldValue(this.props.field.name, '');
            this.recaptchaRef.current.reset();
        }
    }

    render() {
        const { form, field } = this.props;
        const showError = !!form.submitCount;

        return (
            <div>
                <ReCAPTCHA
                    ref={this.recaptchaRef}
                    size="normal"
                    data-theme="dark"
                    sitekey={config.RECAPTCHA_PUBLIC_KEY}
                    onChange={this.handleVerifyRecaptchaToken.bind(this)}
                />
                {showError &&
                    form.errors[field.name] && (
                        <div className="text-danger font-weight-bold">
                            Please confirm you are a human =)
                        </div>
                    )}
            </div>
        );
    }
}

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
    <FormikField {...props} component={RecapchaFormField} />
);
