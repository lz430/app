import React from 'react';

import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { batchRequestDealQuotes } from 'apps/pricing/actions';
import { getComparedDeals } from '../selectors';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

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
            <div className="compare-page__toolbar">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="/filter">Search Results</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Compare Deals</BreadcrumbItem>
                </Breadcrumb>
                <div className="compare-page__top-row__toolbar compare-page__toolbar__section--tabButtons">
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
