import React from 'react';
import PropTypes from 'prop-types';

import FilterFeatureList from './FilterFeatureList';
import SidebarFilter from './SidebarFilter';

class FilterFeature extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        items: PropTypes.array,
        selectedFeatures: PropTypes.array,
        onToggleFeature: PropTypes.func.isRequired,
        onToggleOpenFilter: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        canToggle: PropTypes.bool.isRequired,
    };

    render() {
        if (!this.props.items) {
            return <div />;
        }

        return (
            <SidebarFilter
                title={this.props.title}
                key={this.props.key}
                open={true}
                canToggle={false}
                toggle={() => this.props.onToggleOpenFilter(this.props.title)}
                count={0}
            >
                <FilterFeatureList
                    selectedFeatures={this.props.selectedFeatures}
                    features={this.props.items}
                    onToggleFeature={this.props.onToggleFeature}
                />
            </SidebarFilter>
        );
    }
}

export default FilterFeature;
