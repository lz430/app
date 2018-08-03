import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tuning from 'icons/zondicons/Tuning';
import CheveronUp from 'icons/zondicons/CheveronUp';
import CheveronDown from 'icons/zondicons/CheveronDown';
import Tag from 'icons/zondicons/Tag';
import util from 'src/util';
import {
    toggleSearchSort,
    clearAllSecondaryFilters,
    clearModelYear,
    toggleSmallFiltersShown,
} from 'pages/deal-list/actions';

import BackButton from 'components/App/BackButton';

class Sortbar extends React.Component {
    static propTypes = {
        window: PropTypes.shape({
            width: PropTypes.number.isRequired,
        }).isRequired,

        searchQuery: PropTypes.object.isRequired,
        onClearAllSecondaryFilters: PropTypes.func.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchSort: PropTypes.func.isRequired,
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
    };

    state = {
        dropdownShown: false,
    };

    shouldComponentUpdate(nextProps) {
        return (
            this.props.searchQuery.sort !== nextProps.searchQuery.sort ||
            this.props.searchQuery.entity !== nextProps.searchQuery.entity
        );
    }

    constructor(props) {
        super(props);

        this.renderBackButton = this.renderBackButton.bind(this);
    }

    renderFilterToggle() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <button
                className="sortbar__button sortbar__button--pink sortbar__button--with-icon"
                onClick={this.props.onToggleSmallFiltersShown}
            >
                <div>
                    <Tuning
                        height="20px"
                        width="20px"
                        className="sortbar__filter-toggle-icon"
                    />
                </div>
                Filter Results
            </button>
        );
    }

    renderIcon(column) {
        if (this.props.searchQuery.sort.attribute === column) {
            if (this.props.searchQuery.sort.direction === 'asc') {
                return (
                    <CheveronDown
                        height="18px"
                        width="18px"
                        className="sortbar__sort-icon"
                    />
                );
            } else {
                return (
                    <CheveronUp
                        height="18px"
                        width="18px"
                        className="sortbar__sort-icon"
                    />
                );
            }
        }
        return false;
    }
    renderBackButton() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <BackButton style="button" />
        );
    }

    /**
     * @returns {*}
     */
    renderSortButton() {
        return (
            <button
                className="sortbar__button sortbar__button--with-icon"
                onClick={() => this.props.onToggleSearchSort('price')}
            >
                {util.windowIsLargerThanSmall(this.props.window.width) ? (
                    'Price '
                ) : (
                    <Tag
                        height="20px"
                        width="20px"
                        className="sortbar__back-icon"
                    />
                )}
                {this.renderIcon('price')}
            </button>
        );
    }

    renderClearFiltersButton() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <div>
                <button
                    className="sortbar__button sortbar__button--blue sortbar__button--clear-filters"
                    onClick={() => {
                        this.props.onClearAllSecondaryFilters();
                        this.props.onToggleSmallFiltersShown();
                    }}
                >
                    Clear Options
                </button>
            </div>
        );
    }

    render() {
        return (
            <div className="sortbar">
                {this.renderFilterToggle()}
                {this.props.searchQuery.entity === 'model'
                    ? this.renderClearFiltersButton()
                    : ''}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        zipcode: state.user.purchasePreferences.strategy,
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSearchSort: sort => {
            return dispatch(toggleSearchSort(sort));
        },

        onClearAllSecondaryFilters: () => {
            return dispatch(clearAllSecondaryFilters());
        },

        onClearModelYear: () => {
            return dispatch(clearModelYear());
        },

        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sortbar);
