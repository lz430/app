@extends('layouts.app')

@section('title', $title)

@section('precontent')
    <div class="back-bar">
        <a href="javascript:window.history.back();">&lt; Back to previous</a>
    </div>
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">Confirm Quote Details…</div>
            @include('partials.steps', ['current' => 5])
        </div>
    </div>
@endsection

@section('content')
    <div class="content--grey">
        <ConfirmDetails
                deal="{{$deal}}"
        ></ConfirmDetails>
    </div>
@endsection
