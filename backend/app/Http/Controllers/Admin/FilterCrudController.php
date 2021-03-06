<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\FilterRequest as StoreRequest;
// VALIDATION: change the requests to match your own file names if you need form validation
use App\Http\Requests\FilterRequest as UpdateRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;

class FilterCrudController extends CrudController
{
    public function setup()
    {

        /*
        |--------------------------------------------------------------------------
        | BASIC CRUD INFORMATION
        |--------------------------------------------------------------------------
        */
        $this->crud->setModel('App\Models\Filter');
        $this->crud->setRoute(config('backpack.base.route_prefix').'/filter');
        $this->crud->setEntityNameStrings('filter', 'filters');

        /*
        |--------------------------------------------------------------------------
        | BASIC CRUD INFORMATION
        |--------------------------------------------------------------------------
        */

        //$this->crud->setFromDb();

        //
        // FORM
        $this->crud->addField([
            'name'  => 'is_active',
            'label' => 'Is Active',
            'type'  => 'checkbox',
        ]);

        $this->crud->addField([
            'name'  => 'title',
            'label' => 'Title',
            'type'  => 'text',
        ]);

        $this->crud->addField([
            'name'  => 'category_id',
            'label' => 'Category',
            'type' => 'select2',
            'entity' => 'category',
            'attribute' => 'title',
            'model' => "App\Models\Category",
        ]);

        $this->crud->addField([
            'name' => 'map_vauto_features',
            'label' => 'Vauto Features Map',
            'type' => 'remotedatatable',
            'entity_singular' => 'option', // used on the "Add X" button
            'max' => 100,
            'min' => 0,
            'format' => 'text',
        ]);

        $this->crud->addField([
            'name' => 'jato_schema_ids',
            'label' => 'Jato Schema Ids',
            'type' => 'remotedatatable',
            'entity_singular' => 'option', // used on the "Add X" button
            'max' => 100,
            'min' => 0,
            'format' => 'number',
        ]);

        //
        // LIST
        $this->crud->addColumn([
            'label' => 'ID',
            'name' => 'id',
        ]);

        $this->crud->addColumn([
            'label' => 'Created',
            'name' => 'created_at',
        ]);

        $this->crud->addColumn([
            'label' => 'Updated',
            'name' => 'updated_at',
        ]);

        $this->crud->addColumn([
            'label' => 'Is Active',
            'name' => 'is_active',
            'type' => 'boolean',
            'options' => [0 => 'Inactive', 1 => 'Active'],
        ]);

        $this->crud->addColumn([
            'label' => 'Title',
            'name' => 'title',
        ]);

        $this->crud->addColumn([
            'label' => 'Category',
            'name' => 'category.title',
        ]);

        $this->crud->enableExportButtons();
    }

    public function store(StoreRequest $request)
    {
        // your additional operations before save here
        $redirect_location = parent::storeCrud($request);
        // your additional operations after save here
        // use $this->data['entry'] or $this->crud->entry
        return $redirect_location;
    }

    public function update(UpdateRequest $request)
    {
        // your additional operations before save here
        $redirect_location = parent::updateCrud($request);
        // your additional operations after save here
        // use $this->data['entry'] or $this->crud->entry
        return $redirect_location;
    }
}
