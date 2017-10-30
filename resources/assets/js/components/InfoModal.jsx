import React from 'react';
import zondicons from "../zondicons";
import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

class InfoModal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            body: null,
            toggled: false,
        };
    }

    renderModal() {
        return "I am the modal content";
    }

    toggleModal() {
        this.state.toggled = !this.state.toggled;
        console.log(this.state)
    }

    render() {
        return <div>
            <a
                    onClick={() => {this.toggleModal()}}
                    href="#"
                >
                    <SVGInline width="15px" fill="grey" svg={zondicons['information-outline']} />
                </a>
                {this.state.toggled ? this.renderModal() : ''}
            </div>
    }
}

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, Actions)(InfoModal);
