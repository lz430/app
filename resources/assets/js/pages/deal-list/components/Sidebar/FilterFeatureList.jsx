import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterFeatureList extends React.PureComponent {
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

    render() {
        if (!this.props.items) {
            return <div />;
        }

        return (
            <div className="filter-selector">
                {this.props.items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={() =>
                                this.props.onToggleSearchFilter(
                                    this.props.category,
                                    item
                                )
                            }
                        >
                            {this.props.selectedItems &&
                            R.contains(item.value, this.props.selectedItems) ? (
                                <SVGInline
                                    width="15px"
                                    height="15px"
                                    className="filter-selector__checkbox filter-selector__checkbox--selected"
                                    svg={zondicons['checkmark']}
                                />
                            ) : (
                                <div className="filter-selector__checkbox" />
                            )}
                            {item.label}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FilterFeatureList;
