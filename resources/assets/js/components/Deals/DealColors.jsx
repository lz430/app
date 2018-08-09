import React from 'react';
import { dealType } from 'types';
import strings from 'src/strings';

export default class DealColors extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        const { deal } = this.props;

        const upholsteryType = strings.dealUpholsteryType(deal);

        return (
            <span>
                <span>{deal.color} Exterior</span>,{' '}
                <span>
                    {deal.interior_color} {upholsteryType} Interior
                </span>
            </span>
        );
    }
}
