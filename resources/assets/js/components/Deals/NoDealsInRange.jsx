import React from 'react';

const NoDealsInRange = () => {
    return (
        <div className="deals__no-matches">
            <div>
                <p>Sorry, there are no deals available that meet the selected criteria. Please adjust your search and try again.</p>
            </div>
        </div>
    )
};

export default NoDealsInRange;
