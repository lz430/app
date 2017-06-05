import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

const renderSortIcon = (sortStatus, sortColumn, column) => {
    const icon = sortStatus === 'desc' ? 'cheveron-down' : 'cheveron-up';

    return sortColumn === column
        ? <SVGInline className="sortbar__icon" svg={zondicons[icon]} />
        : '';
};

const Sortbar = ({
    results_count,
    onPriceClick,
    onYearClick,
    onAtoZClick,
    sortStatus,
    sortColumn,
}) => {
    const renderIcon = renderSortIcon.bind(undefined, sortStatus, sortColumn);

    return (
        <div className="sortbar">
            <div className="results">
                {results_count} Results sorted by
            </div>
            <div className="sortbar__buttons">
                <button className="sortbar__button" onClick={onPriceClick}>
                    {renderIcon('price')}
                    Price
                </button>
                <button className="sortbar__button" onClick={onYearClick}>
                    {renderIcon('year')}
                    Year
                </button>
                <button className="sortbar__button" onClick={onAtoZClick}>
                    {renderIcon('make')}
                    A-Z
                </button>
            </div>
        </div>
    );
};

Sortbar.propTypes = {
    results_count: PropTypes.number.isRequired,
    onPriceClick: PropTypes.func.isRequired,
    onAtoZClick: PropTypes.func.isRequired,
    onYearClick: PropTypes.func.isRequired,
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortStatus: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

export default Sortbar;
