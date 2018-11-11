import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import GlobalSelectPurchaseStrategy from '../../../apps/user/components/GlobalSelectPurchaseStrategy';
import BackToSearchResultsLink from '../../../apps/page/components/BackToSearchResultsLink';

class ToolbarPrice extends React.PureComponent {
    static propTypes = {
        onBatchRequestDealQuotes: PropTypes.func.isRequired,
        deals: PropTypes.array,
        searchQuery: PropTypes.object,
    };

    afterSetPurchaseStrategy() {
        this.props.onBatchRequestDealQuotes(this.props.deals);
    }
    render() {
        return (
            <div className="compare-page__toolbar">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BackToSearchResultsLink
                            searchQuery={this.props.searchQuery}
                        />
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

export default ToolbarPrice;
