import React from 'react';
import PropTypes from 'prop-types';
import { filterItemType } from 'types';

import * as R from 'ramda';

import Checkmark from 'icons/zondicons/Checkmark';

class FilterFeatureList extends React.PureComponent {
    static propTypes = {
        category: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(filterItemType),
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
                            R.contains(
                                String(item.value),
                                this.props.selectedItems
                            ) ? (
                                <Checkmark
                                    width="15px"
                                    height="15px"
                                    className="filter-selector__checkbox filter-selector__checkbox--selected"
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
