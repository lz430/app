@extends('layouts.app')

@section('title', 'Buy')

@section('content')
    <Configured data-version='{!! json_encode($savedVehicle->version) !!}' data-options='{!! json_encode($savedVehicle->options) !!}'></Configured>

    <div class="buy-request-create">
        <form method="post">
            {{ csrf_field() }}

            @foreach ($selectedOptionIds as $selectedOptionId)
                <input type="hidden" name="option_ids[]" value="{{ $selectedOptionId }}">
            @endforeach

            <input type="hidden" name="version_id" value="{{ $savedVehicle->version->id }}">

            <br>
            <br>

            collect / confirm user info here

            <button class="btn btn-primary" type="submit" formaction="{{ route('buyRequest.store', ['savedVehicleId' => $savedVehicle->id]) }}">Buy</button>
        </form>
    </div>
@endsection
