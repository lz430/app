import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import bodyStyleIcons from 'body-styles';
import miscicons from 'miscicons';

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
                {bodyStyleIcons[item.icon] ? (
                    <SVGInline
                        width="70px"
                        className="filter-style-selector__icon"
                        svg={bodyStyleIcons[item.icon]}
                    />
                ) : (
                    ''
                )}

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
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
}

export default FilterStyleList;
