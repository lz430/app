import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import * as Actions from 'actions/index';

class MakeSelector extends React.PureComponent {
    constructor() {
        super();

        this.renderMake = this.renderMake.bind(this);
        this.getLogoFor = this.getLogoFor.bind(this);
    }

    logoMissing() {
        return R.has('logo') && R.propEq('logo', '');
    }

    getLogoFor(make) {
        return R.ifElse(
            this.logoMissing(make.attributes),
            () => this.props.fallbackLogoImage,
            R.prop('logo')
        ).bind(this)(make.attributes);
    }

    animateButton() {
        const modalCloseButton = document.getElementsByClassName(
            'modal__close-button'
        )[0];
        modalCloseButton.classList.remove('animated');
        modalCloseButton.classList.remove('rubberBand');
        setTimeout(() => {
            modalCloseButton.classList += ' rubberBand';
            modalCloseButton.classList += ' animated';
        }, 100);
    }

    renderMake(make) {
        const selected =
            this.props.selectedMakes &&
            R.contains(make.id, this.props.selectedMakes);
        const className = `make-selector__make ${selected
            ? 'make-selector__make--selected'
            : ''}`;

        return (
            <div
                className={className}
                onClick={() => {
                    this.props.toggleMake(make.id);
                    this.animateButton();
                }}
                key={make.id}
            >
                <img src={this.getLogoFor(make)} />
                <div className="make-selector__make-name">
                    {make.attributes.name}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="make-selector">
                <div className="make-selector__makes">
                    {this.props.makes ? (
                        this.props.makes.map(this.renderMake)
                    ) : (
                        'loading'
                    )}
                </div>
            </div>
        );
    }
}

MakeSelector.propTypes = {
    makes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            attributes: PropTypes.shape({
                name: PropTypes.string.isRequired,
                logo: PropTypes.string.isRequired,
            }),
        })
    ),
    selectedMakes: PropTypes.arrayOf(PropTypes.string),
    fallbackLogoImage: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
    return {
        makes: state.makes,
        selectedMakes: state.selectedMakes,
        fallbackLogoImage: state.fallbackLogoImage,
    };
};

export default connect(mapStateToProps, Actions)(MakeSelector);
