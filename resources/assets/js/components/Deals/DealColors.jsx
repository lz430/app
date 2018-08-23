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
                <span>
                    {deal.color} Exterior
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: deal.exterior_color_swatch,
                            borderRadius: '3px',
                            border: '1px solid #000000',
                            display: 'inline-block',
                            marginLeft: '5px',
                        }}
                    />
                </span>,{' '}
                <span>
                    {deal.interior_color} {upholsteryType} Interior
                </span>
            </span>
        );
    }
}
