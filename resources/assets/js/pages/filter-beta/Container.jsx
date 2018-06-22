import React from 'react';

import { ReactiveBase } from '@appbaseio/reactivesearch';

import FilterSidebar from 'pages/filter-beta/components/FilterSidebar';
import ResultsContainer from 'pages/filter-beta/components/ResultsContainer';

class FilterBeta extends React.Component {
    render() {
        return (
            <ReactiveBase app="deal" url="http://dmr.local.test:9200/">
                <FilterSidebar />
                <ResultsContainer />
            </ReactiveBase>
        );
    }
}

export default FilterBeta;
