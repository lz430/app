@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            {{ trans('backpack::base.dashboard') }}
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li class="active">{{ trans('backpack::base.dashboard') }}</li>
        </ol>
    </section>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Welcome</div>
                </div>

                <div class="box-body">Welcome to the DMR admin area</div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Legacy Admin Pages</div>
                </div>

                <div class="box-body">
                    <ul>
                        <li><a href="/admin/zip-tester/48103">ZIP Tester</a></li>
                        <li><a href="/admin/jato-logs/">JATO Logs</a></li>
                        <li><a href="/admin/statistics/deals">Deals Statistics</a></li>
                        <li><a href="/admin/deal-debugger/{{  App\Models\Deal::first()->id }}">Deal Debugger</a></li>
                        <li><a href="/admin/vauto-dump/" download>VAuto Dump</a></li>
                        <li><a href="/admin/deal-feature-debugger/{{ App\Models\Deal::first()->id }}">Deal Feature Debugger</a></li>
                        <li>Deal by Vin: <form method="post" action="/admin/deal-by-vin">{{ csrf_field() }}<input name="vin" style="padding: 0.5em;" placeholder="VIN"><input type="submit" value="find" style="padding: 0.5em 1em; background: #eee;"></form></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
@endsection