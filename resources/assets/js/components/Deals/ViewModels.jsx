import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import * as Actions from 'actions';
import Deal from './Deal';
import ModelYear from './ModelYear';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class ViewModels extends React.PureComponent {
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
                <div
                    className={
                        'modelyears ' +
                        (this.props.compareList.length > 0 ? '' : 'no-compare')
                    }
                >
                    {this.props.modelYears ? (
                        this.props.modelYears.map((model, index) => {
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

ViewModels.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            employee_price: PropTypes.number.isRequired,
            id: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            supplier_price: PropTypes.number.isRequired,
            year: PropTypes.string.isRequired,
        })
    ),
    dealPage: PropTypes.number,
    dealPageTotal: PropTypes.number,
    dealsByMakeModelYear: PropTypes.array,
    selectedDealGrouping: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        compareList: state.compareList,
        modelYears: state.modelYears,
    };
}

export default connect(
    mapStateToProps,
    Actions
)(ViewModels);
