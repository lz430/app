import React from 'react';

import { ReactiveBase } from '@appbaseio/reactivesearch';

import FilterSidebar from 'components/Browse/FilterSidebar';
import ResultsContainer from 'components/Browse/ResultsContainer';

class BrowsePage extends React.Component {
    render() {
        return (
            <ReactiveBase app="deal" url="http://dmr.local.test:9200/">
                <FilterSidebar />
                <ResultsContainer />
            </ReactiveBase>
        );
    }
}

export default BrowsePage;
