import React from 'react';
import _ from 'lodash';

class ModelSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedMake: null };

        this.onSelectMake = this.onSelectMake.bind(this);
    };

    onSelectMake(event) {
        this.setState({selectedMake: _.find(this.props.makes, (make) => {
            return make.id === parseInt(event.target.value);
        })});
    };

    renderModelSelect() {
        if (!this.state.selectedMake) {
            return (
                <label>Choose Model
                    <select disabled>
                        <option>Any</option>
                    </select>
                </label>
            );
        }

        return (
            <label>Model
                <select>
                    {
                        this.state.selectedMake.models.map((model) => (
                            <option key={ model.id } value={ model.id }>{ model.name }</option>
                        ))
                    }
                </select>
            </label>
        );
    }

    render() {
        return (
            <form>
                <label>Choose Make
                    <select onChange={this.onSelectMake}>
                        <option>Any</option>
                        {
                            this.props.makes.map((make) => (
                                <option key={ make.id } value={ make.id }>{ make.name }</option>
                            ))
                        }
                    </select>
                </label>

                { this.renderModelSelect() }

                <label>Enter ZIP Code
                    <input type="text" name="zip"/>
                </label>
            </form>
        )
    }
}

export default ModelSelector;
