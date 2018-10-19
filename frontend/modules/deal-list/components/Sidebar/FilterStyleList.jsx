import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import StyleIcon from '../../../../components/Deals/StyleIcon';
import Loading from '../../../../icons/miscicons/Loading';

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
