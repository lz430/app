import React from 'react';

import {
    SelectedFilters,
} from '@appbaseio/reactivesearch';

import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';


/**
 *
 */
class CurrentFiltersBar extends React.Component {
    render() {
        return (
            <div className="filterbar">
                <SVGInline
                    height="20px"
                    width="20px"
                    className="filterbar__filter-icon"
                    svg={zondicons['filter']}
                />
                <SelectedFilters />
            </div>
        );
    }

}

export default CurrentFiltersBar;