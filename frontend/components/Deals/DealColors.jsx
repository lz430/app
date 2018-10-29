import React from 'react';
import { dealType } from '../../core/types';
import strings from '../../util/strings';

export default class DealColors extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        const { deal } = this.props;

        const upholsteryType = strings.dealUpholsteryType(deal);

        return (
            <span>
                <span>
                    {deal.color} Exterior{' '}
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: deal.exterior_color_swatch,
                            borderRadius: '3px',
                            border: '1px solid #000000',
                            display: 'inline-block',
                        }}
                    />
                </span>
                ,{' '}
                <span>
                    {deal.interior_color} {upholsteryType} Interior
                </span>
            </span>
        );
    }
}
