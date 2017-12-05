import React from 'react';
import PropTypes from 'prop-types';
import NoDealsInRange from './NoDealsInRange';
import NoDealsOutOfRange from './NoDealsOutOfRange';
import ViewDeals from './ViewDeals';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class Deals extends React.PureComponent {
    render() {
        if (!this.props.deals && this.props.requestingMoreDeals && this.props.zipInRange) {
            return <SVGInline svg={miscicons['loading']}/>;
        }

        if (this.props.zipInRange) {
            return (this.props.deals && this.props.deals.length) ? <ViewDeals /> : <NoDealsInRange/>;
        }

        return <NoDealsOutOfRange />;
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
    zipInRange: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        requestingMoreDeals: state.requestingMoreDeals,
        zipInRange: state.zipInRange,
    };
}

export default connect(mapStateToProps, null)(Deals);
