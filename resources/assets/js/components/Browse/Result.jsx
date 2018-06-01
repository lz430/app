import React from 'react';

import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';

class Result extends React.PureComponent {
    render() {
        const result = this.props.result;

        let image = 'http://www.asfera.info/files/images/1_aprela/4/deloreyn.jpg';

        if (result.thumbnail) {
            image = result.thumbnail;
        }

        return (
            <div className="browser-page__results__result deal">
                <div className="deal__content">

                    <div className="deal__basic-info">
                        <div
                            onClick={() =>
                                (window.location = `/deals/${result.id}`)
                            }
                            className="deal__basic-info-year-and-model"
                        >
                            <div className="deal__basic-info-year-and-make">
                                {`${result.year} ${result.make}`}
                            </div>

                            <div className="deal__basic-info-model-and-series">
                                {`${result.model} ${result.series}`}
                            </div>
                            <div className="deal__basic-info-color">
                                {result.color}, {result.interior_color}
                            </div>
                        </div>
                    </div>
                    <DealImage
                        featureImageClass="deal__image"
                        deal={result}
                    />
                </div>

                <div className="deal__price">
                    <DealPrice deal={result} />
                </div>
            </div>
        );
    }
}

export default Result;
