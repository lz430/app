import React from 'react';
import PropTypes from 'prop-types';
import StyleIcon from '../../../../components/Deals/StyleIcon';
import Convertible from '../../../../icons/body-styles/Convertible';
import Coupe from '../../../../icons/body-styles/Coupe';
import Hatchback from '../../../../icons/body-styles/Hatchback';
import Minivan from '../../../../icons/body-styles/Minivan';
import Pickup from '../../../../icons/body-styles/Pickup';
import Sedan from '../../../../icons/body-styles/Sedan';
import Suv from '../../../../icons/body-styles/Suv';
import Wagon from '../../../../icons/body-styles/Wagon';
import Loading from '../../../../icons/miscicons/Loading';
import classNames from 'classnames';

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
            default:
                return false;
        }
    }

    renderItem(item) {
        let selected = this.isItemSelected(item);

        return (
            <div
                key={item.value}
                className={classNames('filter-items__item', {
                    'filter-items__item--selected': selected,
                })}
                onClick={() =>
                    this.props.onToggleSearchFilter(this.props.category, item)
                }
            >
                <StyleIcon key={item.icon} style={item.icon} />
                <div className="filter-items__item__label">{item.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-items filter-items__style">
                <div className="filter-items__style__list">
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
