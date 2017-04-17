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
                    <select className="form-control" disabled>
                        <option>Any</option>
                    </select>
                </label>
            );
        }

        return (
            <label>Model
                <select className="form-control" name="model_id">
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
            <div>
                <label>Choose Make
                    <select className="form-control" onChange={this.onSelectMake}>
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
                    <input className="form-control" type="text" name="zip"/>
                </label>
            </div>
        )
    }
}

export default ModelSelector;
