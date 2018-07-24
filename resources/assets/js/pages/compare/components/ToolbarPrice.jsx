import React from 'react';

import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { batchRequestDealQuotes } from 'apps/pricing/actions';
import { getComparedDeals } from '../selectors';

class ToolbarPrice extends React.PureComponent {
    static propTypes = {
        onBatchRequestDealQuotes: PropTypes.func.isRequired,
        deals: PropTypes.array.isRequired,
    };

    afterSetPurchaseStrategy() {
        this.props.onBatchRequestDealQuotes(this.props.deals);
    }
    render() {
        return (
            <div className="compare-page__top-row">
                <div className="compare-page__top-row__section compare-page__top-row__section--tabButtons">
                    <GlobalSelectPurchaseStrategy
                        afterSetPurchaseStrategy={this.afterSetPurchaseStrategy.bind(
                            this
                        )}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deals: getComparedDeals(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onBatchRequestDealQuotes: deals => {
            return dispatch(batchRequestDealQuotes(deals));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarPrice);
