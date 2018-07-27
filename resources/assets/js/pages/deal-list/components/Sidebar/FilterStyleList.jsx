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
import Loading from 'icons/miscicons/Loading';

class FilterStyleList extends React.PureComponent {
    static propTypes = {
        category: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
                count: PropTypes.number,
                icon: PropTypes.string,
            })
        ),
        selectedItems: PropTypes.arrayOf(PropTypes.string),
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
    }

    isItemSelected(item) {
        return (
            this.props.selectedItems &&
            this.props.selectedItems.includes(item.value)
        );
    }

    renderIcon(icon) {
        switch (icon) {
            case 'convertible':
                return (
                    <Convertible
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'coupe':
                return (
                    <Coupe
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'hatchback':
                return (
                    <Hatchback
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'minivan':
                return (
                    <Minivan
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'pickup':
                return (
                    <Pickup
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'sedan':
                return (
                    <Sedan
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
            case 'suv':
                return (
                    <Suv width="70px" className="filter-style-selector__icon" />
                );
            case 'wagon':
                return (
                    <Wagon
                        width="70px"
                        className="filter-style-selector__icon"
                    />
                );
        }

        return false;
    }

    renderItem(item) {
        let selected = this.isItemSelected(item);

        let className = `filter-style-selector__style ${
            selected ? 'filter-style-selector__style--selected' : ''
        }`;

        return (
            <div
                key={item.value}
                className={className}
                onClick={() =>
                    this.props.onToggleSearchFilter(this.props.category, item)
                }
            >
                {this.renderIcon(item.icon)}
                <div className="filter-style-selector__name">{item.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-style-selector">
                <div className="filter-style-selector__styles">
                    {this.props.items ? (
                        this.props.items.map(this.renderItem)
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        );
    }
}

export default FilterStyleList;
