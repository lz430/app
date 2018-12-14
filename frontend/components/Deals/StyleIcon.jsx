import React from 'react';
import PropTypes from 'prop-types';

import Convertible from '../../static/icons/body-styles/convertible.svg';
import Coupe from '../../static/icons/body-styles/coupe.svg';
import Hatchback from '../../static/icons/body-styles/hatchback.svg';
import Minivan from '../../static/icons/body-styles/minivan.svg';
import Pickup from '../../static/icons/body-styles/pickup.svg';
import Sedan from '../../static/icons/body-styles/sedan.svg';
import Suv from '../../static/icons/body-styles/suv.svg';
import Wagon from '../../static/icons/body-styles/wagon.svg';

class StyleIcon extends React.PureComponent {
    static propTypes = {
        style: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
    };

    static defaultProps = {
        size: 'small',
    };

    renderIcon(icon) {
        let size = '70px';

        if (this.props.size === 'large') {
            size = '180px';
        }

        switch (icon) {
            case 'convertible':
                return (
                    <Convertible
                        width={size}
                        className="filter-items__item__icon"
                    />
                );
            case 'coupe':
                return (
                    <Coupe width={size} className="filter-items__item__icon" />
                );
            case 'hatchback':
                return (
                    <Hatchback
                        width={size}
                        className="filter-items__item__icon"
                    />
                );
            case 'minivan':
                return (
                    <Minivan
                        width={size}
                        className="filter-items__item__icon"
                    />
                );
            case 'pickup':
                return (
                    <Pickup width={size} className="filter-items__item__icon" />
                );
            case 'sedan':
                return (
                    <Sedan width={size} className="filter-items__item__icon" />
                );
            case 'suv':
                return (
                    <Suv width={size} className="filter-items__item__icon" />
                );
            case 'wagon':
                return (
                    <Wagon width={size} className="filter-items__item__icon" />
                );
            default:
                return false;
        }
    }

    render() {
        return this.renderIcon(this.props.style);
    }
}

export default StyleIcon;
