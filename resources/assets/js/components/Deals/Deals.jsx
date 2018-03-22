import React from 'react';
import PropTypes from 'prop-types';
import NoDealsInRange from './NoDealsInRange';
import NoDealsOutOfRange from './NoDealsOutOfRange';
import ViewDeals from './ViewDeals';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import ViewModels from './ViewModels';

class Deals extends React.PureComponent {
    componentWillReceiveProps(nextProps) {
        nextProps.cancelPromises('bestOffer');

        if (nextProps.deals) {
            nextProps.deals.map(deal => {
                nextProps.requestBestOffer(deal);
            });
        }
    }

    render() {
        // Zip out of range
        if (! this.props.zipInRange) {
            return <NoDealsOutOfRange />;
        }

        // Requesting something
        if (this.props.requestingMoreDeals || this.props.requestingMoreModelYears) {
            return <SVGInline svg={miscicons['loading']} />;
        }

        // No matches at all for initial search
        if (
            (!this.props.deals && !this.props.modelYears) ||
            (!this.props.deals && this.props.modelYears.length == 0)
        ) {
            return <NoDealsInRange />;
        }

        // There were model card results for our initial search but we've modified it to an empty list
        if (this.props.filterPage == 'deals' && this.props.deals.length == 0) {
            return <NoDealsInRange />;
        }

        // We have some results; which should we prefer?
        return this.props.filterPage == 'deals' ? (
            <ViewDeals />
        ) : (
            <ViewModels />
        );
    }
}

Deals.propTypes = {
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
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        requestingMoreDeals: state.requestingMoreDeals,
        requestingMoreModelYears: state.requestingMoreModelYears,
        zipInRange: state.zipInRange,
        modelYears: state.modelYears,
        filterPage: state.filterPage,
    };
}

export default connect(mapStateToProps, Actions)(Deals);
