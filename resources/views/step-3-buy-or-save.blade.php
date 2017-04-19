@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <div id="configured" data-version='{!! json_encode($version) !!}' data-options='{!! json_encode($selectedOptions) !!}'></div>

    <div class="step-3">
        <br>

        <form method="post">
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
                        @if (!\Illuminate\Support\Facades\Auth::check())
                            <label for="email">Email</label>
                            <input id="email" class="form-control" type="email" name="email" required>
                        @else
                            <input id="email" type="hidden" name="email" value="{{ \Illuminate\Support\Facades\Auth::user()->email }}" required>
                        @endif

                        <br>

                        <button class="btn btn-primary" type="submit" formaction="{{ route('buyRequest.store') }}">Make this my ride</button>
                        <button class="btn btn-primary" type="submit" formaction="{{ route('savedVehicle.store') }}">Save to garage</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection

