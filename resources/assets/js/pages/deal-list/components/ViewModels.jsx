import React from 'react';
import PropTypes from 'prop-types';
import ModelYear from 'components/Deals/ModelYear';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class ViewModels extends React.PureComponent {
    static propTypes = {
        modelYears: PropTypes.array,
    };

    /**
     * @param model
     * @returns {string}
     */
    buildModelKey(model) {
        return model.year + '--' + model.id;
    }

    render() {
        return (
            <div>
                <div className="card-deck inventory-summary-deck m-0">
                    {this.props.modelYears ? (
                        this.props.modelYears.map(model => {
                            return (
                                <ModelYear
                                    modelYear={model}
                                    key={this.buildModelKey(model)}
                                />
                            );
                        })
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        compareList: state.common.compareList,
        modelYears: state.pages.dealList.modelYears,
    };
}

export default connect(mapStateToProps)(ViewModels);
