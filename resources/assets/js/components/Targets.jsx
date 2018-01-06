import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import rebates from 'src/rebates';
import strings from 'src/strings';
import miscicons from 'miscicons';
import zondicons from 'zondicons';

class Targets extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    availableTargets() {
        return this.props.dealTargets[this.props.deal.id] || [];
    }

    renderTarget(target, index) {
        const isSelected = R.contains(
            target,
            rebates.getSelectedTargetsForDeal(
                this.props.dealTargets,
                this.props.selectedTargets,
                this.props.deal
            )
        );
        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${
            isSelected ? 'rebates__checkbox--selected' : ''
        }`;

        return (
            <div
                key={index}
                onClick={this.props.toggleTarget.bind(this, target)}
                className={`rebates__rebate`}
            >
                {isSelected ? (
                    <SVGInline
                        width="15px"
                        height="15px"
                        className={checkboxClass}
                        svg={zondicons['checkmark']}
                    />
                ) : (
                    <div className="rebates__checkbox" />
                )}
                <div className="rebates__title">
                    {strings.toTitleCase(target.targetName)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="rebates">
                {this.props ? (
                    this.availableTargets().map((target, index) =>
                        this.renderTarget(target, index)
                    )
                ) : (
                    <SVGInline svg={miscicons['loading']} />
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        deal: state.selectedDeal,
        dealTargets: state.dealTargets,
        selectedTargets: state.selectedTargets,
    };
}

Targets.propTypes = {
    zipcode: PropTypes.string.isRequired,
    deal: PropTypes.object.isRequired,
    dealTargets: PropTypes.object.isRequired,
    selectedTargets: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, Actions)(Targets);
