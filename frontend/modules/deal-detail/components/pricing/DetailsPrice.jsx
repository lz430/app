import React from 'react';
import PropTypes from 'prop-types';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Header from '../../../../apps/pricing/components/Header';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

export default class TaxesAndFees extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
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
        const quote = this.props.pricing.quote();
        return (
            <Popover
                placement="left"
                isOpen={this.state.popoverOpen}
                target="rebates-explain"
                toggle={this.toggle.bind(this)}
            >
                <PopoverHeader>Rebate Breakdown</PopoverHeader>
                <PopoverBody className="text-sm cart__rebate_description">
                    {quote.rebates.conditional &&
                        Object.keys(quote.rebates.conditional.programs).map(
                            key => {
                                const program =
                                    quote.rebates.conditional.programs[key];
                                return (
                                    <div key={key}>
                                        {program.program.ProgramName} - ($
                                        {program.value})
                                    </div>
                                );
                            }
                        )}

                    {quote.rebates.everyone &&
                        Object.keys(quote.rebates.everyone.programs).map(
                            key => {
                                const program =
                                    quote.rebates.everyone.programs[key];
                                return (
                                    <div key={key}>
                                        {program.program.ProgramName} - ($
                                        {program.value})
                                    </div>
                                );
                            }
                        )}
                </PopoverBody>
            </Popover>
        );
    }

    renderSectionLabel() {
        const { purchaseStrategy } = this.props;
        let label;

        if (purchaseStrategy === 'lease') {
            label = 'LEASE PRICE BASIS';
        } else if (purchaseStrategy === 'cash') {
            label = 'CASH PRICE';
        } else if (purchaseStrategy === 'finance') {
            label = 'FINANCE PRICE';
        }

        return <Header>{label}</Header>;
    }

    renderDiscountedPriceBreakdown() {
        const { pricing } = this.props;

        let discount, totalLabel, discountLabel, price;

        if (pricing.isEffectiveDiscountEmployee()) {
            totalLabel = 'Employee Price';
            totalLabel = 'Employee Price Discount';

            discount = pricing.employeeDiscount();
            price = pricing.employeePrice();
        } else if (pricing.isEffectiveDiscountSupplier()) {
            totalLabel = 'Supplier / Friends & Family Price';
            discountLabel = 'Supplier / Friends & Family Discount';

            discount = pricing.supplierDiscount();
            price = pricing.supplierPrice();
        } else {
            totalLabel = 'Your Price';
            discountLabel = 'Discount';

            discount = pricing.dmrDiscount();
            price = pricing.defaultPrice();
        }

        return (
            <React.Fragment>
                <Line>
                    <Label style={{ margin: 0 }}>{discountLabel}</Label>
                    <Value isNegative={true}>
                        <DollarsAndCents value={discount} />
                    </Value>
                </Line>
                <Line isSectionTotal={true}>
                    <Label style={{ margin: 0 }}>{totalLabel}</Label>
                    <Value>
                        <DollarsAndCents value={price} />
                    </Value>
                </Line>
            </React.Fragment>
        );
    }

    renderRebates() {
        const { pricing } = this.props;

        if (!pricing.hasRebatesApplied()) {
            return false;
        }

        return (
            <Line isSectionTotal={true}>
                <Label>
                    Total Rebates Applied{' '}
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="cursor-pointer"
                        id="rebates-explain"
                        onClick={this.toggle.bind(this)}
                    />
                </Label>
                <Value isNegative={true}>
                    <DollarsAndCents value={pricing.rebates()} />
                </Value>
                {this.renderDescription()}
            </Line>
        );
    }

    render() {
        const { pricing, purchaseStrategy } = this.props;

        let discountedPriceLabel = 'Discounted Price';
        if (purchaseStrategy === 'lease') {
            discountedPriceLabel = 'Discounted Price Basis';
        }

        return (
            <div>
                {this.renderSectionLabel()}

                <Line>
                    <Label style={{ margin: 0 }}>Retail Price (MSRP)</Label>
                    <Value>
                        <DollarsAndCents value={pricing.msrp()} />
                    </Value>
                </Line>
                {this.renderDiscountedPriceBreakdown()}
                {this.renderRebates()}
                <Line isImportant>
                    <Label style={{ margin: 0 }}>{discountedPriceLabel}</Label>
                    <Value>
                        <DollarsAndCents
                            value={pricing.discountedAndRebatedPrice()}
                        />
                    </Value>
                </Line>
            </div>
        );
    }
}
