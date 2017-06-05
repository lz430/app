import React from 'react';
import R from 'ramda';
import api from 'src/api';
import qs from 'qs';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import Sortbar from 'components/Sortbar';
import FilterPanel from 'components/FilterPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions/index';


class FilterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true,
        };

        this.closeModal = this.closeModal.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.sortParam = this.sortParam.bind(this);
        this.renderDeals = this.renderDeals.bind(this);
        this.loadMoreDeals = this.loadMoreDeals.bind(this);
    }

    componentDidMount() {
        // api.getMakes().then(makes => {
        //     this.setState({
        //         makes: makes.data.data,
        //     }, () => {
        //         store.dispatch(sortDeals());
        //     });
        // });


    }

    loadMoreDeals() {
        this.setState(
            {
                dealPage: this.state.dealPage + 1,
            },
            () => {
                this.getDeals(
                    this.sortParam(this.state.sortColumn)
                ).then(deals => {
                    this.setState({
                        deals: R.concat(this.state.deals, deals.data.data),
                    });
                });
            }
        );
    }

    closeModal() {
        this.setState(
            {
                showModal: false,
            },
            () => {
                // this.props.actions.getDeals({
                //     sort: 'price',
                //     make_ids: this.props.makes
                // })
                // this.getDeals().then(deals => {
                //     this.setState({
                //         deals: deals.data.data,
                //     });
                // });
            }
        );
    }

    getDeals(sort = 'price', page = this.state.dealPage) {
        return api.getDeals(
            this.state.selectedMakes,
            [this.state.selectedBodyStyle],
            ['photos'],
            sort,
            page
        );
    }

    sortParam(column) {
        return this.state.sortStatus === 'desc' ? '-' + column : column;
    }

    toggleSort(column) {
        this.setState(
            {
                sortColumn: column,
                sortStatus: this.state.sortStatus === 'asc' ? 'desc' : 'asc',
            },
            () => {
                this.getDeals(this.sortParam(column)).then(deals => {
                    this.setState({
                        deals: deals.data.data,
                        dealPage: 0,
                    });
                });
            }
        );
    }

    renderModal() {
        return (
            <div className="modal">
                <div className="modal__close" onClick={this.closeModal}>X</div>
                <MakeSelector
                    // makes={this.props.makes}
                    // onSelectMake={this.props.actions.selectMake}
                    // selectedMakes={this.state.selectedMakes}
                    // fallbackLogoImage={this.state.fallbackLogoImage}
                />
            </div>
        );
    }

    renderDeals() {
        return (
                <div className="filter-page">
                    {/*<div className="filter-page__filter-panel">*/}
                        {/*<FilterPanel />*/}
                    {/*</div>*/}
                    <div className="filter-page__deals">
                        {/*<Sortbar*/}
                            {/*results_count={this.props.deals.length}*/}
                            {/*onPriceClick={this.props.actions.sortDeals}*/}
                            {/*onYearClick={this.props.actions.sortDeals}*/}
                            {/*onAtoZClick={this.props.actions.sortDeals}*/}
                            {/*sortColumn={this.props.sortColumn}*/}
                            {/*sortStatus={this.props.sortStatus}*/}
                        {/*/>*/}
                        {/*{this.state.deals.length*/}
                            {/*? <Deals*/}
                                  {/*loadMoreDeals={this.loadMoreDeals}*/}
                                  {/*deals={this.state.deals}*/}
                                  {/*fallbackDealImage={*/}
                                      {/*this.state.fallbackDealImage*/}
                                  {/*}*/}
                              {/*/>*/}
                            {/*: <p>No Results</p>}*/}
                    </div>
                </div>
        );
    }

    render() {
        if (this.props.makes && this.state.showModal) {
            return this.renderModal();
        }

        // if (this.state.deals) {
        //     return this.renderDeals();
        // }

        return <div>'Loading'</div>;
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ActionTypes, dispatch),
    };
};

export default connect(mapStateToProps, Actions)(FilterPage);
