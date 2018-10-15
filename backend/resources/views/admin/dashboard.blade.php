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
                        <li><a href="/admin/jato-logs/">JATO Logs</a></li>
                        <li><a href="/admin/statistics/deals">Deals Statistics</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
@endsection