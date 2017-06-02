import React from 'react';
import PropTypes from 'prop-types';

class ZipcodeFinder extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="zipcode-finder">
                <div className="zipcode-finder__info">
                    <div>Zip Code</div>
                    <div className="zipcode-finder__code">90040</div>
                </div>
                <div className="zipcode-finder__buttons">
                    <button className="zipcode-finder__button zipcode-finder__button--blue zipcode-finder__button--small">
                        Update
                    </button>
                </div>
            </div>
        );
    }
}

ZipcodeFinder.propTypes = {
    onUpdate: PropTypes.func.isRequired,
};

export default ZipcodeFinder;
