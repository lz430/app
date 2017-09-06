import React from "react";
import R from "ramda";
import PropTypes from "prop-types";
import Deal from "components/Deal";
import { connect } from "react-redux";
import * as Actions from "actions";

class Deals extends React.PureComponent {
  render() {
    return (
      <div className="deals">
        <div className="deals__title">Dealer Inventory</div>

        {this.props.deals.map((deal, index) => {
          return (
            <Deal deal={deal} key={index}>
              <div className="deal__buttons">
                <button
                  className={
                    "deal__button deal__button--small " +
                      (R.contains(deal, this.props.compareList)
                        ? "deal__button--blue"
                        : "")
                  }
                  onClick={this.props.toggleCompare.bind(null, deal)}
                >
                  Compare
                </button>
                <button
                  onClick={() => (window.location = `/deals/${deal.id}`)}
                  className="deal__button deal__button--small deal__button--blue deal__button"
                >
                  View Details
                </button>
              </div>
            </Deal>
          );
        })}
        {this.props.dealPage === this.props.dealPageTotal
          ? ""
          : <div className="deals__show-more">
              <button
                onClick={this.props.requestMoreDeals}
                className="deals__button deals__button--blue"
              >
                Show More
              </button>
            </div>}
      </div>
    );
  }
}

Deals.propTypes = {
  deals: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.string.isRequired,
      msrp: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })
  ),
  dealPage: PropTypes.number.isRequired,
  dealPageTotal: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    deals: state.deals,
    dealPage: state.dealPage,
    dealPageTotal: state.dealPageTotal,
    compareList: state.compareList
  };
}

export default connect(mapStateToProps, Actions)(Deals);
