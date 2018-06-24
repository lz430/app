import React from 'react';
import PropTypes from 'prop-types';
import * as Actions from 'apps/common/actions';
import ModelYear from '../../../components/Deals/ModelYear';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { connect } from 'react-redux';

class ViewModels extends React.PureComponent {
    static propTypes = {
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

function mapStateToProps(state) {
    return {
        compareList: state.common.compareList,
        modelYears: state.pages.dealList.modelYears,
    };
}

export default connect(
    mapStateToProps,
    Actions
)(ViewModels);
