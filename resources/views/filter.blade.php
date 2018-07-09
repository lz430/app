@extends('layouts.app', ['bodyClass' => 'filter-page-body'])

@section('precontent')
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">
                <a href="javascript:window.history.back();">&lt; Back</a>
            </div>
            @include('partials.steps', ['current' => 2])
        </div>
    </div>
@endsection

@section('content')
    <FilterPage></FilterPage>
@endsection
