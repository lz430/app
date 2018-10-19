import React from 'react';
import PropTypes from 'prop-types';
import { pricingType } from '../../../../core/types';

import Compose from '../../../../icons/zondicons/Compose';
import Loading from '../../../../icons/miscicons/Loading';
import Line from '../../../../components/pricing/Line';
import Label from '../../../../components/pricing/Label';
import Value from '../../../../components/pricing/Value';
import Group from '../../../../components/pricing/Group';
import Header from '../../../../components/pricing/Header';
import Separator from '../../../../components/pricing/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

import LeaseTermsSelect from './LeaseTermsSelect';
import Rebates from './Rebates';
import Discount from './Discount';

export default class LeasePane extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        leaseTermsSelectOpened: false,
    };

    render() {
        const { pricing, onDiscountChange, onRebatesChange } = this.props;

        if (
            pricing.quoteIsLoaded() &&
            (!pricing.annualMileageAvailable() ||
                !pricing.annualMileageAvailable().length)
        ) {
            return (
                <p className="no-lease-rates-error">
                    Sorry, there are currently no lease rates available for this
                    vehicle.
                </p>
            );
        }

        return (
            <div>
                <Group>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={pricing.msrp()} />
                        </Value>
                    </Line>
                    <Discount pricing={pricing} onChange={onDiscountChange} />
                    <Line isSectionTotal={true}>
                        <Label>Discounted Price</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.discountedPrice()}
                            />
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    <Rebates pricing={pricing} onChange={onRebatesChange} />
                </Group>
                <Separator />
                <Group>
                    <Header>
                        Lease Terms
                        <Compose
                            style={{
                                float: 'right',
                                cursor: 'pointer',
                                fill: '#41b1ac',
                            }}
                            height="1em"
                            onClick={() => this.toggleTermsSelect()}
                        />
                    </Header>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <Line>
                                <table
                                    style={{
                                        border: '1px solid black',
                                        borderSpacing: 0,
                                        padding: '.5em 0',
                                        margin: '1em auto',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => this.toggleTermsSelect()}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    fontWeight: 100,
                                                    fontSize: '.75em',
                                                    padding: '.25em 1em 0',
                                                    borderRight:
                                                        '1px solid black',
                                                }}
                                            >
                                                Annual Miles
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 100,
                                                    fontSize: '.75em',
                                                    padding: '.25em 1em 0',
                                                }}
                                            >
                                                Months
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    padding: '0 1em .25em',
                                                    borderRight:
                                                        '1px solid black',
                                                }}
                                            >
                                                {pricing.annualMileage()}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    padding: '0 1em .25em',
                                                }}
                                            >
                                                {pricing.term()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Line>
                            <Line>
                                <Label>Pre-Tax Payment</Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.monthlyPreTaxPayment()}
                                    />
                                </Value>
                            </Line>
                            <Line>
                                <Label>Use Tax</Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.monthlyUseTax()}
                                    />
                                </Value>
                            </Line>
                            <Line isImportant={true}>
                                <Label>Monthly Payment</Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.monthlyPayment()}
                                    />
                                </Value>
                            </Line>
                        </div>
                    )}
                </Group>
                <Separator />
                <Group>
                    <Header>Due at Delivery</Header>
                    <Line>
                        <Label>First Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.firstPayment()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Doc Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.docFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Electronic Filing Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.cvrFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Tax on Rebates</Label>
                        <Value>
                            <DollarsAndCents value={pricing.taxOnRebates()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                        </Value>
                    </Line>
                </Group>
                {this.state.leaseTermsSelectOpened && (
                    <LeaseTermsSelect
                        pricing={pricing}
                        isOpen={this.state.leaseTermsSelectOpened}
                        toggle={this.toggleTermsSelect.bind(this)}
                        onChange={this.handleLeaseTermsChange.bind(this)}
                    />
                )}
            </div>
        );
    }

    handleLeaseTermsChange = (annualMileage, term, cashDue) => {
        this.props.onChange(annualMileage, term, cashDue);
        this.toggleTermsSelect();
    };

    toggleTermsSelect() {
        this.setState({
            leaseTermsSelectOpened: !this.state.leaseTermsSelectOpened,
        });
    }
}
