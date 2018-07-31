import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'icons/miscicons/Loading';

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

        let className = `filter-make-selector__make ${
            selected ? 'filter-make-selector__make--selected' : ''
        }`;

        return (
            <div
                className={className}
                key={item.value}
                onClick={() =>
                    this.props.onToggleSearchFilter(this.props.category, item)
                }
            >
                <div className="filter-make-selector__name">{item.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-make-selector">
                <div className="filter-make-selector__makes">
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
