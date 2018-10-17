import React from 'react';

import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { batchRequestDealQuotes } from 'apps/pricing/actions';
import { getComparedDeals } from '../selectors';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Link from 'next/link';

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
                        <Link href="/deal-list" as="/filter">
                            <a>Search Results</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Compare Deals</BreadcrumbItem>
                </Breadcrumb>
                <div className="compare-page__top-row__toolbar compare-page__toolbar__section--tabButtons">
                    <GlobalSelectPurchaseStrategy
                        showExplanation={false}
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
