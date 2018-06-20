@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Versions Without Photos
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
                    <table class="table table-bordered">
                        <tr>
                            <th>ID</th>
                            <th>Year</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Trim</th>
                            <th>Body Style</th>
                            <th>Drive</th>
                            <th>Lookup By</th>
                        </tr>
                        <tbody>
                        @foreach ($versions as $version)
                            <tr>
                                <td>{{ $version->id }}</td>
                                <td>{{ $version->year }}</td>
                                <td>{{ $version->model->make->name }}</td>
                                <td>{{ $version->model->name }}</td>
                                <td>{{ $version->trim_name }}</td>
                                <td>{{ $version->body_style }}</td>
                                <td>{{ $version->driven_wheels }}</td>
                                <td>
                                    <pre>{{ print_r($version->lookup_by, true) }}</pre>
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