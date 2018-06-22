import React from 'react';
import PropTypes from 'prop-types';
import NoDealsInRange from '../../pages/filter/components/NoDealsInRange';
import NoDealsOutOfRange from '../../pages/filter/components/NoDealsOutOfRange';
import ViewDeals from './ViewDeals';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import ViewModels from './ViewModels';

class Deals extends React.PureComponent {
    static propTypes = {
        modelYears: PropTypes.array,
        loadingSearchResults: PropTypes.bool,
        deals: PropTypes.arrayOf(
            PropTypes.shape({
                year: PropTypes.string.isRequired,
                msrp: PropTypes.number.isRequired,
                employee_price: PropTypes.number.isRequired,
                supplier_price: PropTypes.number.isRequired,
                make: PropTypes.string.isRequired,
                model: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired,
            })
        ),
        zipInRange: PropTypes.bool,
        searchQuery: PropTypes.object.isRequired,
    };

    render() {
        // Zip out of range
        if (!this.props.zipInRange) {
            return <NoDealsOutOfRange />;
        }

        // Requesting something
        if (this.props.loadingSearchResults) {
            return <SVGInline svg={miscicons['loading']} />;
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
        deals: state.deals,
        loadingSearchResults: state.loadingSearchResults,
        zipInRange: state.zipInRange,
        modelYears: state.modelYears,
        searchQuery: state.searchQuery,
    };
}

export default connect(mapStateToProps)(Deals);
