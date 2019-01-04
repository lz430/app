import React from 'react';
import PropTypes from 'prop-types';

import { Col } from 'reactstrap';
import { dealType } from '../../../../core/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/pro-light-svg-icons';
import ColorSwatchIcon from '../../../../components/Deals/ColorSwatchIcon';

export default class extends React.PureComponent {
    static propTypes = {
        item: PropTypes.object.isRequired,
        deal: dealType.isRequired,
    };

    renderIcon() {
        if (this.props.item.swatch) {
            return <ColorSwatchIcon color={this.props.item.swatch} />;
        }

        return <FontAwesomeIcon icon={faCar} />;
    }

    render() {
        return (
            <Col md={6}>
                <div className="d-flex deal__section-overview-features-item align-items-center">
                    <div className="icon pr-3">{this.renderIcon()}</div>
                    <div className="flex-fill content">
                        {this.props.item.label}: {this.props.item.value}
                    </div>
                </div>
            </Col>
        );
    }
}
