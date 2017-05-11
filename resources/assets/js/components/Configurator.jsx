import React from 'react';
import BodyStyleSelector from './BodyStyleSelector';
import api from '../src/api';

class Configurator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            bodyStyles: null,
            selectedBodyStyle: null,
        };

        this.stepMap = {
            0: {
                title: 'Select vehicle style',
                render: () => {
                    return this.state.bodyStyles
                        ? <BodyStyleSelector bodyStyles={this.state.bodyStyles} onSelectBodyStyle={console.log}/>
                        : 'loading';
                },
            },
        };

        this.currentStep = this.currentStep.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.onSelectBodyStyle = this.onSelectBodyStyle.bind(this);
    };

    componentDidMount() {
        api.getBodyStyles().then((response) => {
            this.setState({
                bodyStyles: response.data.data
            })
        });
    }

    onSelectBodyStyle(bodyStyle) {
        this.setState({ selectedBodyStyle: bodyStyle });
    };

    renderStep() {
        return this.currentStep().render();
    }

    currentStep() {
        return this.stepMap[this.state.step];
    }

    render() {
        return (
            <div>
                <h2>{ this.currentStep().title }</h2>

                { this.renderStep() }
            </div>
        );
    }
}

export default Configurator;
