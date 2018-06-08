import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import util from 'src/util';

class Sortbar extends React.PureComponent {
    static propTypes = {
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
        window: PropTypes.shape({
            width: PropTypes.number.isRequired,
        }).isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.state = {
            dropdownShown: false,
        };

        this.compareReady = this.compareReady.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
        this.renderBackButton = this.renderBackButton.bind(this);
    }

    renderFilterToggle() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <button
                className="sortbar__button sortbar__button--pink sortbar__button--with-icon"
                onClick={this.props.toggleSmallFiltersShown}
            >
                <div>
                    <SVGInline
                        height="20px"
                        width="20px"
                        className="sortbar__filter-toggle-icon"
                        svg={zondicons['tuning']}
                    />
                </div>
                Filter{this.props.searchQuery.entity === 'model'
                    ? ' Results'
                    : ''}
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
        const clearFilters = () => this.props.clearModelYear();
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
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
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
                onClick={() => this.props.sortDeals('price')}
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
                        this.props.clearAllFilters();
                        this.props.toggleSmallFiltersShown();
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
                {this.props.searchQuery.entity === 'deal'
                    ? this.renderSortButton()
                    : ''}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deals: state.deals,
        compareList: state.compareList,
        window: state.window,
        zipcode: state.zipcode,
        searchQuery: state.searchQuery,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(Sortbar);
