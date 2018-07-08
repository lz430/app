@extends('layouts.app')

@section('title', $title)

@section('precontent')
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">
                <a href="javascript:window.history.back();">&lt; Back</a>
            </div>
            @include('partials.steps', ['current' => 3])
        </div>
    </div>
@endsection

@section('content')
    <div class="content--grey">
        <DealDetails
                deal="{{$deal}}"
        ></DealDetails>
    </div>
@endsection
