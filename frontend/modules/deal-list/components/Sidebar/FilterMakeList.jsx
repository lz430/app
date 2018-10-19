import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../../components/Loading';

import classNames from 'classnames';

class FilterMakeList extends React.PureComponent {
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
                className={classNames('filter-items__item', {
                    'filter-items__item--selected': selected,
                })}
                key={item.value}
                onClick={() =>
                    this.props.onToggleSearchFilter(this.props.category, item)
                }
            >
                <div className="filter-items__item__label">{item.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-items filter-items__make">
                <div className="filter-items__make__list">
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

export default FilterMakeList;
