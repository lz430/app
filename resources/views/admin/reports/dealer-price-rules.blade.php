@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Dealer Price Rules
            <a href="/admin/reports/dealer-price-rules/export" class="btn btn-md btn-default pull-right">
                <i class="fa fa-download"></i> Export CSV</a>
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
            @foreach ($dealers as $dealer)
                <div class="box box-default">
                    <div class="box-header with-border">
                        <div class="box-title">
                            <b>{{ $dealer->dealer_id }} {{ $dealer->name }}</b>
                        </div>
                    </div>
                    <div class="box-body">
                        @foreach($dealer->price_rules as $key => $value)
                            <div class="box box-primary">
                                <div class="box-header">
                                    <div class="box-title">
                                        <b>Role:</b> {{$key}} | <b>Base Field:</b> {{$value->base_field}}
                                    </div>
                                </div>
                                <div class="box-body">
                                    @if(array_filter($value->rules) && count($value->rules))

                                        <table class="table table-condensed">
                                            @empty(!$value->rules)
                                                <tr>
                                                    <th style="width: 15%;">Modifier</th>
                                                    <th style="width: 15%;">Conditions: VIN</th>
                                                    <th style="width: 15%;">Conditions: Year</th>
                                                    <th style="width: 15%;">Conditions: Make</th>
                                                    <th style="width: 15%;">Conditions: Model</th>
                                                </tr>
                                            @endempty
                                            <tbody>
                                            @foreach($value->rules as $k)
                                                <tr>
                                                    <td style="width: 15%;">{{isset($k->modifier) ? $k->modifier : "--"}}</td>
                                                    <td style="width: 15%;">{{!empty($k->conditions->vin) ? $k->conditions->vin : "--"}}</td>
                                                    <td style="width: 15%;">{{isset($k->conditions->year) ? $k->conditions->year : "--"}}</td>
                                                    <td style="width: 15%;">{{!empty($k->conditions->make) ? $k->conditions->make : "--"}}</td>
                                                    <td style="width: 15%;">{{!empty($k->conditions->model) ? $k->conditions->model : "--"}}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                    @else
                                        <div>No price rules set</div>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection