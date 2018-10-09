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
                                            </tr>
                                            <tbody>
                                            @foreach($value->rules as $k)
                                                <tr>
                                                    <td>{{$k->value}}</td>
                                                    <td>base field: {{$value->base_field}}</td>
                                                    <td>modifier: {{$k->modifier}}</td>
                                                    <td>
                                                        <table class="table table-striped">
                                                            <tr>
                                                                <th colspan="3" style="text-align: center;">conditions</th>
                                                            </tr>
                                                            <tbody>
                                                            <tr style="text-align: center;">
                                                                <td>vin: {{$k->conditions->vin}}</td>
                                                                <td>make: {{$k->conditions->make}}</td>
                                                                <td>model: {{$k->conditions->model}}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
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