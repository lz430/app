import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import util from 'src/util';
import {
    toggleSearchSort,
    clearAllSecondaryFilters,
    clearModelYear,
    toggleSmallFiltersShown,
} from 'pages/deal-list/actions';

class Sortbar extends React.PureComponent {
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

    shouldComponentUpdate(nextProps) {
        return (
            this.props.searchQuery.sort !== nextProps.searchQuery.sort ||
            this.props.searchQuery.entity !== nextProps.searchQuery.entity ||
            this.props.compareList.length !== nextProps.compareList.length
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            count: props.compareList.length,
            dropdownShown: false,
        };

        this.compareReady = this.compareReady.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
        this.renderBackButton = this.renderBackButton.bind(this);
    }

    componentDidMount() {
        this.setState({ count: this.props.compareList.length });
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
                    <SVGInline
                        height="20px"
                        width="20px"
                        className="sortbar__filter-toggle-icon"
                        svg={zondicons['tuning']}
                    />
                </div>
                Filter Results
            </button>
        );
    }

    renderIcon(column) {
        const icon =
            this.props.searchQuery.sort.direction === 'asc'
                ? 'cheveron-up'
                : 'cheveron-down';
        return this.props.searchQuery.sort.attribute === column ? (
            <SVGInline
                height="18px"
                width="18px"
                className="sortbar__sort-icon"
                svg={zondicons[icon]}
            />
        ) : (
            ''
        );
    }

    redirectToCompare() {
        if (this.compareReady()) {
            window.location.href =
                '/compare?' +
                this.props.compareList
                    .map(
                        dealAndSelectedFilters =>
                            `deals[]=${dealAndSelectedFilters.deal.id}`
                    )
                    .join('&') +
                `&zipcode=${this.props.zipcode}`;
        }
    }

    compareReady() {
        return this.props.compareList.length >= 2;
    }

    renderBackButton() {
        const nativeBack = () => window.history.back();
        const clearFilters = () => this.props.onClearModelYear();
        const onDealsPage = this.props.searchQuery.entity === 'deal';

        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <button
                className="sortbar__button sortbar__button--with-icon"
                onClick={() => (onDealsPage ? clearFilters() : nativeBack())}
            >
                <SVGInline
                    height="20px"
                    width="20px"
                    className="sortbar__back-icon"
                    svg={zondicons['cheveron-left']}
                />
            </button>
        );
    }

    renderCompareButton() {
        return (
            <div>
                <button
                    className={`sortbar__button sortbar__button--blue ${
                        this.compareReady() ? '' : 'disabled'
                    }`}
                    onClick={this.redirectToCompare}
                >
                    Compare{' '}
                    <div
                        className={`sortbar__compare-count ${
                            this.compareReady()
                                ? 'sortbar__compare-count--ready'
                                : ''
                        }`}
                    >
                        {this.props.compareList.length}
                    </div>
                </button>
            </div>
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
                    <SVGInline
                        height="20px"
                        width="20px"
                        className="sortbar__back-icon"
                        svg={zondicons['tag']}
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
                {this.renderBackButton()}
                {this.renderFilterToggle()}
                {this.props.searchQuery.entity === 'model'
                    ? this.renderClearFiltersButton()
                    : ''}
                {this.props.searchQuery.entity === 'deal'
                    ? this.renderCompareButton()
                    : ''}
                {/*this.props.searchQuery.entity === 'deal'
                    ? this.renderSortButton()
                    : '' */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.common.compareList,
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
