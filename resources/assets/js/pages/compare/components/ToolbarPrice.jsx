import React from 'react';

import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';
import AccuPricingCta from 'components/AccuPricing/Cta';

class ToolbarPrice extends React.PureComponent {
    render() {
        return (
            <div className="compare-page__top-row">
                <div className="compare-page__top-row__section compare-page__top-row__section--accuPricing">
                    <AccuPricingCta />
                </div>
                <div className="compare-page__top-row__section compare-page__top-row__section--tabButtons">
                    <GlobalSelectPurchaseStrategy />
                </div>
            </div>
        );
    }
}

export default ToolbarPrice;
