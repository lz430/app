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
                                        @if(array_filter($value->rules))
                                        <table class="table table-condensed">
                                            @empty(!$value->rules)
                                            <tr>
                                                <th style="width: 15%;">{{$key}}</th>
                                                <th style="width: 15%;">Base Field</th>
                                                <th style="width: 15%;">Modifier</th>
                                                <th style="width: 15%;">Conditions: VIN</th>
                                                <th style="width: 15%;">Conditions: Make</th>
                                                <th style="width: 15%;">Conditions: Model</th>
                                            </tr>
                                            @endempty
                                            <tbody>
                                            @foreach($value->rules as $k)
                                                <tr>
                                                    <td style="width: 15%;">{{$k->value}}</td>
                                                    <td style="width: 15%;">{{$value->base_field}}</td>
                                                    <td style="width: 15%;">{{$k->modifier}}</td>
                                                    <td style="width: 15%;">{{$k->conditions->vin}}</td>
                                                    <td style="width: 15%;">{{$k->conditions->make}}</td>
                                                    <td style="width: 15%;">{{$k->conditions->model}}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                        @endif
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