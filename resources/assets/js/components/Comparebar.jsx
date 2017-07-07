import React from 'react';
import util from 'src/util';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class Comparebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: props.compareList.length,
            shaking: true,
        };

        window.setTimeout(() => {
            this.setState({
                shaking: false,
            });
        }, 1000);

        this.compareReady = this.compareReady.bind(this);
        this.compareButtonClass = this.compareButtonClass.bind(this);
        this.redirectToCompare = this.redirectToCompare.bind(this);
        this.renderCompareBar = this.renderCompareBar.bind(this);
        this.renderCompareBubble = this.renderCompareBubble.bind(this);
    }

    componentDidUpdate() {
        if (this.state.count !== this.props.compareList.length) {
            this.setState({
                count: this.props.compareList.length,
                shaking: true,
            });

            window.setTimeout(() => {
                this.setState({
                    shaking: false,
                });
            }, 1000);
        }
    }

    redirectToCompare() {
        if (this.compareReady()) {
            window.location.href =
                '/compare?' +
                this.props.compareList
                    .map(deal => `deals[]=${deal.id}`)
                    .join('&');
        }
    }

    compareReady() {
        return this.props.compareList.length >= 2;
    }

    compareButtonClass() {
        return `compare-bar__compare-button ${this.compareReady() ? 'compare-bar__compare-button__ready' : ''}`;
    }

    renderCompareBar() {
        return (
            <div className="compare-bar">
                <div className="compare-bar__deals">
                    {this.props.compareList.map((deal, index) => {
                        return (
                            <div key={index} className="compare-bar__deal">
                                <div className="compare-bar__deal__info">
                                    <div className="compare-bar__deal__title">
                                        {deal.year} {deal.make} {deal.model}
                                    </div>
                                    <div>
                                        {deal.price
                                            ? util.moneyFormat(deal.price)
                                            : ''}
                                    </div>
                                </div>
                                <SVGInline
                                    onClick={this.props.toggleCompare.bind(
                                        null,
                                        deal
                                    )}
                                    width="15px"
                                    height="15px"
                                    className="compare-bar__deal__remove"
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
                        className="compare-bar__compare-button__arrow"
                        svg={zondicons['arrow-right']}
                    />
                    <br />
                    COMPARE
                </div>
            </div>
        );
    }

    renderCompareBubble() {
        const className = `compare-bubble ${this.state.shaking ? 'compare-bubble--shake' : ''}`;

        return this.props.compareList.length
            ? <div className={className} onClick={this.redirectToCompare}>
                  <div className="compare-bubble__count">
                      {this.props.compareList.length}
                  </div>
              </div>
            : '';
    }

    render() {
        return util.windowIsLargerThanMedium(this.props.window.width)
            ? this.renderCompareBar()
            : this.renderCompareBubble();
    }
}

function mapStateToProps(state) {
    return {
        window: state.window,
        compareList: state.compareList,
    };
}

export default connect(mapStateToProps, Actions)(Comparebar);
