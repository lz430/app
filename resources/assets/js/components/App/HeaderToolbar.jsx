import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

import { getCurrentPage } from 'apps/page/selectors';

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
            },
            'deal-detail': {
                step: 2,
                label: 'Details',
                active: false,
                url: '',
                canNav: false,
            },
            compare: {
                step: 3,
                label: 'Compare',
                active: false,
                url: '',
                canNav: false,
            },
            'checkout-confirm': {
                step: 4,
                label: 'Confirm',
                active: false,
                url: '',
                canNav: false,
            },
            'checkout-complete': {
                step: 5,
                label: 'Summary',
                active: false,
                url: '',
                canNav: false,
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
                        <SVGInline svg={zondicons['checkmark']} />
                    ) : (
                        data.step
                    )}
                </div>
                <div className="step__label">{data.label}</div>
            </div>
        );
    }

    render() {
        const steps = this.steps();

        return (
            <div className="steps-bar">
                <div className="inner">
                    <div className="steps-bar__page-title">
                        <a href="javascript:window.history.back();">
                            &lt; BACK
                        </a>
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
}

function mapStateToProps(state) {
    return {
        currentPage: getCurrentPage(state),
    };
}

export default connect(mapStateToProps)(HeaderToolbar);
