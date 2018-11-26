import React from 'react';
import PropTypes from 'prop-types';

import Rebates from './Rebates';
import TaxesAndFees from './TaxesAndFees';
import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import Loading from '../../../../components/Loading';
import { pricingType } from '../../../../core/types';

export default class CashPane extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
    };

    render() {
        const { pricing, onRebatesChange } = this.props;

        return (
            <div>
                <TaxesAndFees pricing={this.props.pricing} />
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoaded() && (
                        <Rebates pricing={pricing} onChange={onRebatesChange} />
                    )}
                    <Line isImportant={true} isSectionTotal={true}>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={pricing.quoteIsLoading()}>
                            <DollarsAndCents value={pricing.yourPrice()} />*
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
