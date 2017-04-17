import React from 'react';
import Select from 'react-select';

class ModelSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedMake: null, selectedModelId: null };

        this.onSelectMake = this.onSelectMake.bind(this);
        this.onSelectModel = this.onSelectModel.bind(this);
    };

    onSelectMake(make) {
        this.setState({selectedMake: make});
    };

    onSelectModel(model) {
        this.setState({selectedModelId: model ? model.id : null});
    };

    renderModelSelect() {
        return (
            <div>
                <label htmlFor="model_id">Choose model</label>
                <Select
                    name="model_id"
                    value={this.state.selectedModelId ? this.state.selectedModelId : null}
                    options={this.state.selectedMake ? this.state.selectedMake.models : []}
                    labelKey="name"
                    valueKey="id"
                    placeholder=""
                    onChange={this.onSelectModel}
                />
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <div className="col-lg-12 step-0__selector">
                        <label>Choose make</label>
                        <Select
                            value={this.state.selectedMake ? this.state.selectedMake.id : null}
                            options={this.props.makes}
                            labelKey="name"
                            valueKey="id"
                            placeholder=""
                            onChange={this.onSelectMake}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-lg-12 step-0__selector">
                        { this.renderModelSelect() }
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-lg-8 step-0__selector">
                        <label htmlFor="zip">Enter ZIP code</label>
                        <input id="zip" className="form-control" type="text" name="zip"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModelSelector;
