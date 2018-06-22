@extends('layouts.app', ['bodyClass' => 'filter-page-body'])

@section('precontent')
    <div class="back-bar">
        <a href="javascript:window.history.back();">&lt; Back to previous</a>
    </div>
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">Your Vehicle Search Results...</div>
            @include('partials.steps', ['current' => 2])
        </div>
    </div>
@endsection

@section('content')
    <BrowsePage id="browse-page"></BrowsePage>
@endsection