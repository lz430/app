import React from 'react';

import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';

import { Button } from 'reactstrap';

import { pricingType } from '../../../../core/types';

export default class TradeIn extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        return (
            <Group>
                <Header>Trade In</Header>
                <div className="cart__trade-start text-center">
                    <Button outline>Add a Trade-In</Button>
                </div>
                <hr />
            </Group>
        );
    }
}
