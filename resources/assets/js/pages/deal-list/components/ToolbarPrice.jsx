import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sortbar from './Sortbar';
import { showAccuPricingModal } from 'apps/common/actions';
import { requestSearch } from 'pages/deal-list/actions';

import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';

/**
 *
 */
class ToolbarPrice extends React.Component {
    static propTypes = {
        onRequestSearch: PropTypes.func.isRequired,
        onShowAccuPricingModal: PropTypes.func.isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    afterSetPurchaseStrategy() {
        this.props.onRequestSearch();
    }

    render() {
        return (
            <div className="filter-page__top-row">
                {this.props.searchQuery.entity === 'deal' && (
                    <div className="filter-page__top-row__section filter-page__top-row__section--tabButtons">
                        <GlobalSelectPurchaseStrategy
                            afterSetPurchaseStrategy={this.afterSetPurchaseStrategy.bind(
                                this
                            )}
                        />
                    </div>
                )}
                <div className="filter-page__top-row__section filter-page__top-row__section--sortbar">
                    <Sortbar />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onShowAccuPricingModal: () => {
            return dispatch(showAccuPricingModal);
        },

        onRequestSearch: () => {
            return dispatch(requestSearch());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarPrice);
