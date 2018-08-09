import React from 'react';
import PropTypes from 'prop-types';
import { filterItemType } from 'types';
import FilterFeatureList from './FilterFeatureList';
import SidebarFilter from './SidebarFilter';

class FilterFeature extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(filterItemType),
        loadingSearchResults: PropTypes.bool.isRequired,
        selectedItems: PropTypes.arrayOf(PropTypes.string),
        onToggleSearchFilter: PropTypes.func.isRequired,
        onToggleOpenFilter: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        canToggle: PropTypes.bool.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.selectedItems !== nextProps.selectedItems) {
            return true;
        }

        if (nextProps.loadingSearchResults) {
            return false;
        }

        if (
            this.props.loadingSearchResults !== nextProps.loadingSearchResults
        ) {
            return true;
        }

        if (this.props.items !== nextProps.items) {
            return true;
        }

        return false;
    }

    render() {
        // Hide if no items to select
        if (!this.props.items || !this.props.items.length) {
            return false;
        }
        // Hide if only one selectable option.
        if (
            this.props.items.length === 1 &&
            !this.props.selectedItems &&
            !this.props.loadingSearchResults
        ) {
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
