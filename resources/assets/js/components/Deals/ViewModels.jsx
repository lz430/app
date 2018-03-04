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
    render() {
        return (
            <div>
                <div className={'modelyears ' + (this.props.compareList.length > 0 ? '' : 'no-compare')}>
                    {this.props.modelYears ? (this.props.modelYears.map((model, index) => {
                            return <ModelYear modelYear={model} key={index} />
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
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            employee_price: PropTypes.number.isRequired,
            supplier_price: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        })
    ),
    dealsByMakeModelYear: PropTypes.array,
    dealPage: PropTypes.number,
    dealPageTotal: PropTypes.number,
    selectedDealGrouping: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        modelYears: state.modelYears,
        compareList: state.compareList,
    };
}

export default connect(mapStateToProps, Actions)(ViewModels);
