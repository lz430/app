import React from 'react';
import PropTypes from 'prop-types';

import { Col } from 'reactstrap';
import { dealType } from '../../../../core/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/pro-light-svg-icons';
import IconColorSwatch from '../../../../components/Deals/IconColorSwatch';
import TireIcon from '../../../../static/icons/equipment/tire-icn.svg';
import WarrantyIcon from '../../../../static/icons/equipment/warranty-icn.svg';
import FuelIcon from '../../../../static/icons/equipment/fuel-icn.svg';
import IconStyle from '../../../../components/Deals/IconStyle';
import IconDrive from '../../../../components/Deals/IconDrive';

export default class extends React.PureComponent {
    static propTypes = {
        item: PropTypes.object.isRequired,
        deal: dealType.isRequired,
    };

    renderIcon() {
        const { deal, item } = this.props;
        if (item.label === 'Exterior Color' && deal.exterior_color_swatch) {
            return <IconColorSwatch color={deal.exterior_color_swatch} />;
        }

        if (item.label === 'Wheels') {
            return <TireIcon className="svg-inline--fa fa-w-16" />;
        }

        if (item.label === 'Vehicle Warranty') {
            return <WarrantyIcon className="svg-inline--fa fa-w-16" />;
        }

        if (item.label === 'Fuel Type') {
            return <FuelIcon className="svg-inline--fa fa-w-16" />;
        }

        if (item.label === 'Body Style') {
            return <IconStyle style={item.value} size={1} />;
        }

        if (item.label === 'Drive Train') {
            return <IconDrive drive={item.value} />;
        }

        return <FontAwesomeIcon icon={faCar} />;
    }

    render() {
        return (
            <Col md={6}>
                <div className="d-flex deal__section-overview-features-item align-items-center">
                    <div className="icon pr-3">{this.renderIcon()}</div>
                    <div className="flex-fill content">
                        {this.props.item.value}
                    </div>
                </div>
            </Col>
        );
    }
}
