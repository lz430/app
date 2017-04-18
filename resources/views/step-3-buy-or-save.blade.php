@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <div id="configured" data-version='{!! json_encode($version) !!}' data-options='{!! json_encode($selectedOptions) !!}'></div>

    <div class="step-3">
        <form method="post" action="{{ route('buyRequest.store') }}">
            {{ csrf_field() }}

            @foreach ($options as $option)
                @if (in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <div class="form-group">
                <div class="row">
                    <div class="col-lg-6">
                        <button class="btn btn-primary" type="submit">Make this my ride</button>
                    </div>
                </div>
            </div>
        </form>

        <hr>

        <form method="post" action="{{ route('savedVehicle.store') }}">
            {{ csrf_field() }}

            <div class="form-group">
                <div class="row">
                    <div class="col-lg-6">
                        <label for="email">Share your car with yourself, or come back later to view it</label>
                        <input class="form-control" type="email" name="email" required>

                        <br>

                        <button class="btn btn-primary" type="submit">Save to garage</button>
                    </div>
                </div>
            </div>

            @foreach ($options as $option)
                @if (in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">
        </form>
    </div>
@endsection

