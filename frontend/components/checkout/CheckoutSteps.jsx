import React from 'react';
import PropTypes from 'prop-types';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BackButton from './BackButton';
import { checkoutType, nextRouterType } from '../../core/types';

class CheckoutSteps extends React.PureComponent {
    static propTypes = {
        currentPage: PropTypes.string,
        checkout: checkoutType,
        router: nextRouterType,
    };

    steps() {
        let steps = {
            'deal-detail': {
                step: 1,
                label: 'Select Deal',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: true,
                showBar: false,
            },
            'checkout-confirm': {
                step: 2,
                label: 'Contact',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: false,
                showBar: true,
            },
            'checkout-financing': {
                step: 3,
                label: 'Financing',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: false,
                showBar: true,
            },
            'checkout-complete': {
                step: 4,
                label: 'Summary',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: false,
                showBar: true,
            },
        };

        if (this.props.currentPage && steps[this.props.currentPage]) {
            steps[this.props.currentPage].active = true;
        }

        return steps;
    }

    renderStep(step, data) {
        return (
            <div className={data.active ? 'step  step--active' : 'step'}>
                <div className="step__icon">
                    {data.active ? (
                        <FontAwesomeIcon icon={faCheck} />
                    ) : (
                        data.step
                    )}
                </div>
                <div className="step__label">{data.label}</div>
            </div>
        );
    }

    renderStepsBar(steps) {
        return (
            <div className="steps-bar">
                <div className="inner">
                    <div className="steps-bar__page-title">
                        <BackButton
                            currentPage={this.props.currentPage}
                            checkout={this.props.checkout}
                            router={this.props.router}
                        />
                    </div>
                    <div className="steps">
                        {Object.keys(this.steps()).map(key => (
                            <div key={key}>
                                {this.renderStep(key, steps[key])}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const steps = this.steps();

        // Render Steps Bar
        if (
            this.props.currentPage &&
            steps[this.props.currentPage] &&
            steps[this.props.currentPage]['showBar']
        ) {
            return this.renderStepsBar(steps);
        }

        return false;
    }
}

export default CheckoutSteps;
