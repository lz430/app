import React from 'react';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TaxesAndFees extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    state = {
        popoverOpen: false,
    };

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
    }

    renderDescription() {
        const { pricing } = this.props;

        return (
            <Popover
                placement="left"
                isOpen={this.state.popoverOpen}
                target="taxes-explain"
                toggle={this.toggle.bind(this)}
            >
                <PopoverHeader>Taxes & Fees Breakdown</PopoverHeader>
                <PopoverBody>
                    <Line>
                        <Label>Doc Fee</Label>
                        <Value>
                            <DollarsAndCents value={pricing.docFee()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Electronic Filing Fee</Label>
                        <Value>
                            <DollarsAndCents value={pricing.cvrFee()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Sales Tax</Label>
                        <Value>
                            <DollarsAndCents value={pricing.salesTax()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true}>
                        <Label>Total</Label>
                        <Value>
                            <DollarsAndCents value={pricing.taxesAndFees()} />*
                        </Value>
                    </Line>
                </PopoverBody>
            </Popover>
        );
    }

    render() {
        const { pricing } = this.props;

        return (
            <Group>
                <Header>Taxes &amp; Fees</Header>
                <Line isSectionTotal={true}>
                    <Label>
                        Total Taxes & Fees{' '}
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="cursor-pointer"
                            id="taxes-explain"
                            onClick={this.toggle.bind(this)}
                        />
                    </Label>
                    <Value>
                        <DollarsAndCents value={pricing.taxesAndFees()} />
                    </Value>
                </Line>
                {this.renderDescription()}
            </Group>
        );
    }
}
