import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Configured extends React.Component {
    constructor(props) {
        super(props);

        this.totalPrice = this.totalPrice.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
    };

    totalPrice() {
        return _.reduce(this.props.options, (acc, option) => {
            return option.msrp + acc;
        }, this.props.version.msrp);
    }

    renderOptions() {
        return (
            <div>
                options: {
                    this.props.options.map((option) => {
                        return (<div key={option.id}>{option.name} ({option.msrp})</div>);
                    })
                }
            </div>
        );
    }

    getImageUrl() {
        return 'https://sslphotos.jato.com/PHOTO300' + this.props.version.photo_path;
    }

    render() {
        return (
            <div>
                <div>{this.props.version.year} {this.props.version.description}</div>

                <div className="text-center">
                    <img src={this.getImageUrl()}/>
                </div>

                <div>msrp: {this.props.version.msrp}</div>

                {this.renderOptions()}

                <div>total: {this.totalPrice()}</div>
            </div>
        );
    }
}

Configured.propTypes = {
    version: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
    }),
    options: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        msrp: PropTypes.number.required,
    })),
};

export default Configured;
