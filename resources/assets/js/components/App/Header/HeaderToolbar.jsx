import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkmark from 'icons/zondicons/Checkmark';

import { getCurrentPage } from 'apps/page/selectors';
import BackButton from '../BackButton';

class HeaderToolbar extends React.PureComponent {
    static propTypes = {
        currentPage: PropTypes.string,
    };

    steps() {
        let steps = {
            'deal-list': {
                step: 1,
                label: 'Search',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: false,
                showBar: false,
            },
            'deal-detail': {
                step: 2,
                label: 'Details',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: true,
                showBar: false,
            },
            compare: {
                step: 3,
                label: 'Compare',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: true,
                showBar: false,
            },
            'checkout-confirm': {
                step: 4,
                label: 'Confirm',
                active: false,
                url: '',
                canNav: false,
                showBreadcrumb: false,
                showBar: true,
            },
            'checkout-complete': {
                step: 5,
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
                    {data.active ? <Checkmark /> : data.step}
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
                        <BackButton />
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

function mapStateToProps(state) {
    return {
        currentPage: getCurrentPage(state),
    };
}

export default connect(mapStateToProps)(HeaderToolbar);
