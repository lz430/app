<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\DealRequest as StoreRequest;
// VALIDATION: change the requests to match your own file names if you need form validation
use App\Http\Requests\DealRequest as UpdateRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;

class DealCrudController extends CrudController
{
    public function setup()
    {

        /*
        |--------------------------------------------------------------------------
        | BASIC CRUD INFORMATION
        |--------------------------------------------------------------------------
        */
        $this->crud->setModel('App\Models\Deal');
        $this->crud->setRoute(config('backpack.base.route_prefix').'/deal');
        $this->crud->setEntityNameStrings('deal', 'deals');

        /*
        |--------------------------------------------------------------------------
        | BASIC CRUD INFORMATION
        |--------------------------------------------------------------------------
        */

        //$this->crud->setFromDb();

        //
        // FORM
        $this->crud->addField([
            'name'  => 'status',
            'label' => 'Status',
            'type' => 'enum',
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
            'label' => 'VIN',
            'name' => 'vin',
        ]);

        $this->crud->addColumn([
            'label' => 'Year',
            'name' => 'year',
        ]);

        $this->crud->addColumn([
            'label' => 'Make',
            'name' => 'make',
        ]);

        $this->crud->addColumn([
            'label' => 'Model',
            'name' => 'model',
        ]);

        $this->crud->addColumn([
            'label' => 'Status',
            'name' => 'status',
        ]);

        $this->crud->addButtonFromView('line', 'open_in_app', 'deal-app-view', null);
        $this->crud->addButtonFromView('line', 'open_in_admin', 'deal-admin-view', null);

        $this->crud->denyAccess(['create']);

        $this->crud->enableExportButtons();

        $this->crud->addFilter([ // dropdown filter
            'name' => 'status',
            'type' => 'dropdown',
            'label'=> 'Status',
        ], [
            'available' => 'Available',
            'pending' => 'Pending',
            'processing' => 'Processing',
            'sold' => 'Sold'
        ], function ($value) { // if the filter is active
            $this->crud->addClause('where', 'status', $value);
        });
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
