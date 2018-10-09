@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Dealer Price Rules
            <a href="/admin/reports/dealer-price-rules/export" class="btn btn-md btn-default pull-right"><i class="fa fa-download"></i> Export CSV</a>
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li class="active">{{ trans('backpack::base.dashboard') }}</li>
        </ol>

    </section>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-body  no-padding">
                    <table class="table table-bordered table-striped">
                        <tr>
                            <th>Dealer ID</th>
                            <th>Name</th>
                        </tr>
                        <tbody>
                        @foreach ($rules as $rule)
                            <tr>
                                <td>{{ $rule->dealer_id }}</td>
                                <td>{{ $rule->name }}</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    @foreach($rule->price_rules as $key => $value)
                                        <table class="table table-condensed">
                                            <tr>
                                                <th>{{$key}}</th>
                                                <th>Base Field</th>
                                                <th>Modifier</th>
                                                <th>Conditions: VIN</th>
                                                <th>Conditions: Make</th>
                                                <th>Conditions: Model</th>
                                            </tr>
                                            <tbody>
                                            @foreach($value->rules as $k)
                                                <tr>
                                                    <td>{{$k->value}}</td>
                                                    <td>{{$value->base_field}}</td>
                                                    <td>{{$k->modifier}}</td>
                                                    <td>{{$k->conditions->vin}}</td>
                                                    <td>{{$k->conditions->make}}</td>
                                                    <td>{{$k->conditions->model}}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                    @endforeach
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection