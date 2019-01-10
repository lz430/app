@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Vehicles Violating Price Rules
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
                @component('components.box')
                    Hello
                {{dd($deal)}}


                @endcomponent

        </div>
    </div>
@endsection