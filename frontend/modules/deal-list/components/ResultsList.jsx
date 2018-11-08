import React from 'react';
import PropTypes from 'prop-types';
import { dealType } from '../../../core/types';

import NoDealsInRange from './NoDealsInRange';
import NoDealsOutOfRange from './NoDealsOutOfRange';
import ViewDeals from './ViewDeals';
import ViewModels from './ViewModels';
import Loading from '../../../components/Loading';

class ResultsList extends React.PureComponent {
    static propTypes = {
        location: PropTypes.object,
        modelYears: PropTypes.array,
        loadingSearchResults: PropTypes.bool,
        deals: PropTypes.arrayOf(dealType),
        zipInRange: PropTypes.bool,
        searchQuery: PropTypes.object.isRequired,
        currentSearchPage: PropTypes.number,
        purchaseStrategy: PropTypes.string,
        compareList: PropTypes.array,
        meta: PropTypes.object.isRequired,
        onRequestMoreDeals: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onSelectModelYear: PropTypes.func.isRequired,
    };

    render() {
        // No pagination for models so we just return loading here anytime we
        // are loading results
        if (
            this.props.searchQuery.entity === 'model' &&
            this.props.loadingSearchResults
        ) {
            return <Loading />;
        }

        //
        // We only want to show loading here for deals if we're on the first page.
        if (
            this.props.searchQuery.entity === 'deal' &&
            this.props.loadingSearchResults &&
            (this.props.currentSearchPage === 1 ||
                !this.props.currentSearchPage)
        ) {
            return <Loading />;
        }

        // Zip out of range
        if (!this.props.location.has_results) {
            return <NoDealsOutOfRange />;
        }

        if (
            this.props.searchQuery.entity === 'model' &&
            (!this.props.modelYears || this.props.modelYears.length === 0)
        ) {
            return <NoDealsInRange />;
        }

        if (
            this.props.searchQuery.entity === 'deal' &&
            (!this.props.deals || this.props.deals.length === 0)
        ) {
            return <NoDealsInRange />;
        }

        // We have some results; which should we prefer?
        return this.props.searchQuery.entity === 'deal' ? (
            <ViewDeals
                compareList={this.props.compareList}
                meta={this.props.meta}
                shouldShowLoading={this.props.loadingSearchResults}
                deals={this.props.deals}
                onRequestMoreDeals={this.props.onRequestMoreDeals}
                onToggleCompare={this.props.onToggleCompare}
            />
        ) : (
            <ViewModels
                modelYears={this.props.modelYears}
                onSelectModelYear={this.props.onSelectModelYear}
                purchaseStrategy={this.props.purchaseStrategy}
            />
        );
    }
}

export default ResultsList;
