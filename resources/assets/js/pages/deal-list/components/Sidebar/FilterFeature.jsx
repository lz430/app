import React from 'react';
import PropTypes from 'prop-types';

import FilterFeatureList from './FilterFeatureList';
import SidebarFilter from './SidebarFilter';

class FilterFeature extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
                count: PropTypes.number,
            })
        ),
        selectedItems: PropTypes.arrayOf(PropTypes.string),
        onToggleSearchFilter: PropTypes.func.isRequired,
        onToggleOpenFilter: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        canToggle: PropTypes.bool.isRequired,
    };

    render() {
        if (!this.props.items || !this.props.items.length) {
            return false;
        }

        return (
            <SidebarFilter
                title={this.props.title}
                key={this.props.title}
                open={true}
                canToggle={false}
                toggle={() => this.props.onToggleOpenFilter(this.props.title)}
                selectedItems={this.props.selectedItems}
            >
                <FilterFeatureList
                    category={this.props.category}
                    items={this.props.items}
                    selectedItems={this.props.selectedItems}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />
            </SidebarFilter>
        );
    }
}

export default FilterFeature;
