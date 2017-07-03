import React from 'react';
import util from 'src/util';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class Comparebar extends React.Component {
    constructor() {
        super();

        this.compareReady = this.compareReady.bind(this);
        this.compareButtonClass = this.compareButtonClass.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
    }

    redirectToCompare() {
        if (this.compareReady()) {
            const compareUrl =
                '/compare?' +
                this.props.compareList
                    .map(deal => `deals[]=${deal.id}`)
                    .join('&');
            window.location.href = compareUrl;
        }
    }

    compareReady() {
        return this.props.compareList.length >= 2;
    }

    compareButtonClass() {
        let className = `comparebar__compare-button ${this.compareReady() ? 'comparebar__compare-button__ready' : ''}`;
        return className;
    }

    render() {
        return (
            <div className="comparebar">
                <div className="comparebar__deals">
                    {this.props.compareList.map((deal, index) => {
                        return (
                            <div key={index} className="comparebar__deal">
                                <div className="comparebar__deal__info">
                                    <div className="comparebar__deal__title">
                                        {deal.year} {deal.make} {deal.model}
                                    </div>
                                    <div>{util.moneyFormat(deal.price)}</div>
                                </div>
                                <SVGInline
                                    onClick={this.props.toggleCompare.bind(
                                        null,
                                        deal
                                    )}
                                    width="15px"
                                    height="15px"
                                    className="comparebar__deal__remove"
                                    svg={zondicons['close-solid']}
                                />
                            </div>
                        );
                    })}
                </div>
                <div
                    onClick={this.redirectToCompare}
                    className={this.compareButtonClass()}
                >
                    <SVGInline
                        width="15px"
                        height="15px"
                        className="comparebar__compare-button__arrow"
                        svg={zondicons['arrow-right']}
                    />
                    <br />
                    COMPARE
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        compareList: state.compareList,
    };
}

export default connect(mapStateToProps, Actions)(Comparebar);
