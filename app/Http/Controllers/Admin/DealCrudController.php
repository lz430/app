<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;

// VALIDATION: change the requests to match your own file names if you need form validation
use App\Http\Requests\DealRequest as StoreRequest;
use App\Http\Requests\DealRequest as UpdateRequest;

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
        $this->crud->setRoute(config('backpack.base.route_prefix') . '/deal');
        $this->crud->setEntityNameStrings('deal', 'deals');

        /*
        |--------------------------------------------------------------------------
        | BASIC CRUD INFORMATION
        |--------------------------------------------------------------------------
        */

        //$this->crud->setFromDb();


        //
        // FORM

        //
        // LIST
        $this->crud->addColumn([
            'label' => 'ID',
            'name' => 'id',
        ]);

        $this->crud->addColumn([
            'label' => 'VIN',
            'name' => 'vin',
        ]);

        $this->crud->addColumn([
            'label' => 'Title',
            'type' => "model_function",
            'name' => 'title',
            'function_name' => 'title'
        ]);

        $this->crud->addButtonFromView('line', 'open_debugger', 'deal-debugger', null);
        $this->crud->addButtonFromView('line', 'open_in_app', 'deal-app-view', null);
        $this->crud->addButtonFromView('line', 'open_in_admin', 'deal-admin-view', null);

        $this->crud->denyAccess(['create', 'update', 'delete']);


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
