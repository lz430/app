@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="step-0">
        <form method="post" action="/step-0">
            {{ csrf_field() }}
            <div class="row">
                <div class="col-lg-6">
                    <ModelSelector data-makes='{!! json_encode($makes) !!}'></ModelSelector>
                </div>
            </div>

            <hr>

            <button class="btn btn-primary pull-right" type="submit">Next</button>
        </form>
    </div>
@endsection
