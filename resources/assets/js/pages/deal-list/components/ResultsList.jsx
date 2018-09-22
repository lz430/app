import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dealType } from 'types';

import NoDealsInRange from './NoDealsInRange';
import NoDealsOutOfRange from './NoDealsOutOfRange';
import ViewDeals from './ViewDeals';
import ViewModels from './ViewModels';
import Loading from 'icons/miscicons/Loading';
import { getUserLocation } from 'apps/user/selectors';

class ResultsList extends React.PureComponent {
    static propTypes = {
        location: PropTypes.object,
        modelYears: PropTypes.array,
        loadingSearchResults: PropTypes.bool,
        deals: PropTypes.arrayOf(dealType),
        zipInRange: PropTypes.bool,
        searchQuery: PropTypes.object.isRequired,
    };
    render() {
        // Requesting something
        if (this.props.loadingSearchResults) {
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
            <ViewDeals />
        ) : (
            <ViewModels />
        );
    }
}

function mapStateToProps(state) {
    return {
        deals: state.pages.dealList.deals,
        loadingSearchResults: state.pages.dealList.loadingSearchResults,
        location: getUserLocation(state),
        modelYears: state.pages.dealList.modelYears,
        searchQuery: state.pages.dealList.searchQuery,
    };
}

export default connect(mapStateToProps)(ResultsList);