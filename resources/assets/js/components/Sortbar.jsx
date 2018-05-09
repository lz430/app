import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import util from 'src/util';

class Sortbar extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            dropdownShown: false,
        };

        this.compareReady = this.compareReady.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
    }

    renderFilterToggle() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <button className="sortbar__button sortbar__button--pink sortbar__button--with-icon" onClick={this.props.toggleSmallFiltersShown}>
                <div>
                    <SVGInline
                        height="20px"
                        width="20px"
                        className="sortbar__filter-toggle-icon"
                        svg={zondicons['tuning']}
                    />
                </div>
                Filter
            </button>
        );
    }

    toggleDropdownShown() {
        this.setState({
            dropdownShown: !this.state.dropdownShown,
        });
    }

    renderIcon(column) {
        const icon = this.props.sortAscending ? 'cheveron-up' : 'cheveron-down';

        return this.props.sortColumn === column ? (
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

    renderCompareButton() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <div>
                <button
                    className={`sortbar__button sortbar__button--blue ${this.compareReady() ? '' : 'disabled'}`}
                    onClick={this.redirectToCompare}
                >
                    Compare{' '}
                    <div className={`sortbar__compare-count ${this.compareReady() ? 'sortbar__compare-count--ready' : ''}`}>
                        {this.props.compareList.length}
                    </div>
                </button>
            </div>
        );
    }

    renderSortbarDropdown() {
        const icon = this.state.dropdownShown ? 'cheveron-down' : 'cheveron-up';

        return (
            <div className="sortbar__button">
                <div onClick={() => this.props.sortDeals('price')}>
                    Price {this.renderIcon('price')}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="sortbar">
                {this.renderFilterToggle()}
                {this.props.filterPage === 'deals' ? this.renderCompareButton() : ''}
                {this.props.filterPage === 'deals' ? this.renderSortbarDropdown() : ''}
            </div>
        );
    }
}

Sortbar.propTypes = {
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
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortAscending: PropTypes.bool.isRequired,
    window: PropTypes.shape({
        width: PropTypes.number.isRequired,
    }).isRequired,
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        filterPage: state.filterPage,
        sortColumn: state.sortColumn,
        sortAscending: state.sortAscending,
        compareList: state.compareList,
        window: state.window,
        zipcode: state.zipcode,
    };
}

export default connect(mapStateToProps, Actions)(Sortbar);
