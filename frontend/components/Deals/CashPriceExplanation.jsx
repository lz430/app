import React from 'react';
import { dealPricingType } from '../../core/types';
import Group from '../../apps/pricing/components/Group';
import Line from '../../apps/pricing/components/Line';
import Label from '../../apps/pricing/components/Label';
import Value from '../../apps/pricing/components/Value';
import DollarsAndCents from '../money/DollarsAndCents';

export default class CashPriceExplanation extends React.Component {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };
    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={dealPricing.msrp()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Discount</Label>
                        <Value isNegative={true}>
                            <DollarsAndCents
                                value={dealPricing.dmrDiscount()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={dealPricing.quoteIsLoading()}
                        >
                            <DollarsAndCents value={dealPricing.rebates()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Taxes &amp; Fees</Label>
                        <Value isLoading={dealPricing.quoteIsLoading()}>
                            <DollarsAndCents
                                value={dealPricing.taxesAndFees()}
                            />
                        </Value>
                    </Line>
                    <Line isImportant={true}>
                        <Label>Cash Price</Label>
                        <Value>
                            <DollarsAndCents value={dealPricing.totalPrice()} />
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
