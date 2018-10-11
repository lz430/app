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
        <div class="col-md-8 col-md-offset-2">
            @component('components.box')
                @slot('title')
                    Route One Example
                @endslot
                @if ($url)
                    <iframe
                            frameBorder="0"
                            height="1000"
                            id="routeOne"
                            src="{{$url}}"
                            width="100%"
                    ></iframe>
                @else
                    <h3>No routeone id found</h3>
                @endif

                @slot('footer')
                    Do not submit!
                @endslot
            @endcomponent
        </div>
    </div>
@endsection