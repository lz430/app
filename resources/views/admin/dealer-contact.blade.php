@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Dealer Contact
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li><a href="/admin/deal">Deals</a></li>
            <li class="active">View</li>
        </ol>
    </section>
@endsection

@section('content')
    <form method="post" action="/admin/dealercontact/save">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        <input type="hidden" name="dealer_id" value="{{isset($contact->dealer_id) ? $contact->dealer_id : $dealerNumber}}">
        <input type="hidden" name="contact_id" value="{{isset($contact->id) ? $contact->id : null}}">
        <div class="box">
            <div class="box-header with-border">
                <h3>{{isset($contact->id) ? 'Edit' : 'Create'}}</h3>
            </div>
            <div class="box-body row display-flex wrap">
                <div class="form-group col-xs-12">
                    <label>Name</label>
                    <input type="text" name="name" value="{{isset($contact->name) ? $contact->name : null}}" class="form-control">
                </div>
                <div class="form-group col-xs-12">
                    <label>Title</label>
                    <input type="text" name="title" value="{{isset($contact->title) ? $contact->title : null}}" class="form-control">
                </div>
                <div class="form-group col-xs-12">
                    <label>Email</label>
                    <input type="email" name="email" value="{{isset($contact->email) ? $contact->email : null}}" class="form-control">
                </div>
                <div class="form-group col-xs-12">
                    <label>Phone</label>
                    <input type="text" name="phone" value="{{isset($contact->phone) ? $contact->phone : null}}" class="form-control">
                </div>
            </div>
            <div class="box-footer">
                <div id="saveActions" class="form-group">
                    <input name="save_action" value="save_and_back" type="hidden">
                    <button type="submit" class="btn btn-success">
                        <span class="fa fa-save" role="presentation" aria-hidden="true"></span> &nbsp;
                        <span data-value="save_and_back">Save and back</span>
                    </button>
                    <a href="/admin/dealer" class="btn btn-default"><span class="fa fa-ban"></span> &nbsp;Cancel</a>
                </div>
            </div>
        </div>
    </form>
@endsection