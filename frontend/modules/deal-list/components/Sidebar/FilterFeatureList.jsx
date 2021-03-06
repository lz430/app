import React from 'react';
import PropTypes from 'prop-types';
import { contains } from 'ramda';

import { filterItemType } from '../../../../core/types';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            <div className="filter-items filter-items__list">
                {this.props.items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-items__item"
                            onClick={() =>
                                this.props.onToggleSearchFilter(
                                    this.props.category,
                                    item
                                )
                            }
                        >
                            {this.props.selectedItems &&
                            contains(
                                String(item.value),
                                this.props.selectedItems
                            ) ? (
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className="filter-items__item__checkbox filter-items__item--selected"
                                />
                            ) : (
                                <div className="filter-items__item__checkbox" />
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
