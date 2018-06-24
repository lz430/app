import React from 'react';

import { ReactiveList } from '@appbaseio/reactivesearch';

import Result from 'pages/deal-list-beta/components/Result';
import PriceBar from 'pages/deal-list-beta/components/PriceBar';
import CurrentFiltersBar from 'pages/deal-list-beta/components/CurrentFiltersBar';

/**
 *
 */
class ResultsContainer extends React.Component {
    render() {
        let reactOn = {
            and: [
                'SearchFilter',
                'MakeFilter',
                'ModelFilter',
                'StyleFilter',
                'ColorFilter',
                'ComfortFilter',
                'DriveTrainFilter',
                'FuelTypeFilter',
                'SeatingFilter',
                'SeatingConfigFilter',
                'MsrpFilter',
                'TransmissionFilter',
                'InfotainmentFilter',
                'SafetyFilter',
                'PickupFilter',
            ],
        };

        return (
            <div className="browser-page__results">
                <PriceBar />
                <CurrentFiltersBar />
                <ReactiveList
                    className="browser-page__results__list"
                    componentId="results"
                    dataField="id"
                    stream={false}
                    sortBy="desc"
                    size={20}
                    pages={1}
                    pagination={false}
                    showResultStats={true}
                    loader="Loading Results.."
                    react={reactOn}
                    onData={res => {
                        return <Result key={res._id} result={res} />;
                    }}
                />
            </div>
        );
    }
}

export default ResultsContainer;
