import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from '../../../components/Loading';

import ModelYear from '../../../components/Deals/ModelYear';
import { selectModelYear } from '../actions';
import { getUserPurchaseStrategy } from '../../../apps/user/selectors';
import CardCta from './Cta/CardCta';

class ViewModels extends React.PureComponent {
    static propTypes = {
        modelYears: PropTypes.array,
        onSelectModelYear: PropTypes.func.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    /**
     * @param model
     * @returns {string}
     */
    buildModelKey(model) {
        return model.year + '-' + model.make + '-' + model.model;
    }

    render() {
        return (
            <div className="search-results">
                <div className="card-deck inventory-summary-deck m-0">
                    {this.props.modelYears ? (
                        this.props.modelYears.map((model, index) => {
                            const data = [model];
                            if (index === 1) {
                                data.splice(0, 0, { cta: 'call' });
                            }

                            return data.map(item => {
                                if (item.cta) {
                                    return <CardCta key={'cta-' + index} />;
                                } else {
                                    return (
                                        <ModelYear
                                            purchaseStrategy={
                                                this.props.purchaseStrategy
                                            }
                                            onSelectModelYear={
                                                this.props.onSelectModelYear
                                            }
                                            modelYear={model}
                                            key={this.buildModelKey(model)}
                                        />
                                    );
                                }
                            });
                        })
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        modelYears: state.pages.dealList.modelYears,
        purchaseStrategy: getUserPurchaseStrategy(state),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onSelectModelYear: modelYear => {
            return dispatch(selectModelYear(modelYear));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewModels);
