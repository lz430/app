import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Sortbar extends React.Component {
    renderIcon(column) {
        const icon = this.props.sortAscending ? 'cheveron-up' : 'cheveron-down';
        return this.props.sortColumn === column
            ? <SVGInline
                  height="15px"
                  width="15px"
                  className="sortbar__icon"
                  svg={zondicons[icon]}
              />
            : '';
    }

    render() {
        return (
            <div className="sortbar">
                <div className="sortbar__count">
                    <span className="sortbar__count-number">
                        {this.props.results_count}
                    </span>
                    {' '}
                    results
                </div>
                <div className="sortbar__buttons">
                    <button
                        className="sortbar__button sortbar__button--small"
                        onClick={() => {
                            this.props.sortDeals('price');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('price')} Price
                    </button>
                    <button
                        className="sortbar__button sortbar__button--small"
                        onClick={() => {
                            this.props.sortDeals('year');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('year')} Year
                    </button>
                    <button
                        className="sortbar__button sortbar__button--small"
                        onClick={() => {
                            this.props.sortDeals('make');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('make')} A-Z
                    </button>
                </div>
            </div>
        );
    }
}

Sortbar.propTypes = {
    results_count: PropTypes.number.isRequired,
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortAscending: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    return {
        results_count: state.deals.length,
        sortColumn: state.sortColumn,
        sortAscending: state.sortAscending,
    };
}

export default connect(mapStateToProps, Actions)(Sortbar);
