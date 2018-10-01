import React from 'react';
import PropTypes from 'prop-types';

import Convertible from 'icons/body-styles/Convertible';
import Coupe from 'icons/body-styles/Coupe';
import Hatchback from 'icons/body-styles/Hatchback';
import Minivan from 'icons/body-styles/Minivan';
import Pickup from 'icons/body-styles/Pickup';
import Sedan from 'icons/body-styles/Sedan';
import Suv from 'icons/body-styles/Suv';
import Wagon from 'icons/body-styles/Wagon';

class StyleIcon extends React.PureComponent {
    static propTypes = {
        style: PropTypes.string.isRequired,
    };

    renderIcon(icon) {
        switch (icon) {
            case 'convertible':
                return (
                    <Convertible
                        width="70px"
                        className="filter-items__item__icon"
                    />
                );
            case 'coupe':
                return (
                    <Coupe width="70px" className="filter-items__item__icon" />
                );
            case 'hatchback':
                return (
                    <Hatchback
                        width="70px"
                        className="filter-items__item__icon"
                    />
                );
            case 'minivan':
                return (
                    <Minivan
                        width="70px"
                        className="filter-items__item__icon"
                    />
                );
            case 'pickup':
                return (
                    <Pickup width="70px" className="filter-items__item__icon" />
                );
            case 'sedan':
                return (
                    <Sedan width="70px" className="filter-items__item__icon" />
                );
            case 'suv':
                return (
                    <Suv width="70px" className="filter-items__item__icon" />
                );
            case 'wagon':
                return (
                    <Wagon width="70px" className="filter-items__item__icon" />
                );
        }

        return false;
    }

    render() {
        return this.renderIcon(this.props.style);
    }
}

export default StyleIcon;
