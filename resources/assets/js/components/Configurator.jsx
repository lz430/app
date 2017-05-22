import React from 'react';
import BodyStyleSelector from './BodyStyleSelector';
import MakeSelector from "./MakeSelector";
import api from '../src/api';
import axios from 'axios';

class Configurator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 'style',
            styles: null,
            makes: null,
        };

        this.stepMap = {
            'style': {
                title: 'Vehicle Style',
                render: () => {
                    return this.state.styles
                        ? <BodyStyleSelector bodyStyles={ this.state.styles } onSelectBodyStyle={ this.onSelectStyle }/>
                        : 'loading';
                },
            },
            'brand': {
                title: 'Vehicle Brand',
                render: () => {
                    return this.state.styles
                        ? <MakeSelector makes={ this.state.makes } onSelectMake={ this.onSelectBrand }/>
                        : 'loading';
                },
            }
        };

        this.setStepStyle = this.setStepStyle.bind(this);
        this.setStepBrand = this.setStepBrand.bind(this);
        this.currentStep = this.currentStep.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.onSelectStyle = this.onSelectStyle.bind(this);
        this.onSelectBrand = this.onSelectBrand.bind(this);
    };

    componentDidMount() {
        axios.all([
            api.getBodyStyles(),
            api.getMakes()
        ])
        .then(axios.spread((styles, makes) => {
            this.setState({
                styles: styles.data.data,
                makes: makes.data.data
            })
        }));
    }

    onSelectStyle(bodyStyle) {
        // send to style page
        console.log(bodyStyle);
    };

    onSelectBrand(id) {
        // send to brand page
        console.log(id)
    };

    renderStep() {
        return this.currentStep().render();
    }

    currentStep() {
        return this.stepMap[this.state.step];
    }

    setStepStyle() {
        this.setState({ step: 'style' });
    }

    setStepBrand() {
        this.setState({ step: 'brand' });
    }

    render() {
        return (
            <div>
                <h2>Start here...</h2>

                <button onClick={ this.setStepStyle }>Vehicle Style</button>
                Or
                <button onClick={ this.setStepBrand }>Vehicle Brand</button>

                { this.renderStep() }
            </div>
        );
    }
}

export default Configurator;
