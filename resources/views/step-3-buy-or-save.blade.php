@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <div id="configured" data-version='{!! json_encode($version) !!}' data-options='{!! json_encode($selectedOptions) !!}'></div>

    <div class="step-3">
        <h1>{{ $version->description }}</h1>

        <h2>msrp: ${{ $version->msrp }}</h2>

        <div class="text-center">
            <img src="https://sslphotos.jato.com/PHOTO300{{ $version->photo_path }}">
        </div>

        <details>
            <pre>
                {{ json_encode($version, JSON_PRETTY_PRINT) }}
            </pre>
        </details>

        <form method="post" action="/buy">
            {{ csrf_field() }}

            <div class="options">
                @foreach ($options as $option)
                    <div class="options__option {{ in_array($option->id, $selectedOptionIds) ? '' : 'hide' }}">
                        <label>
                            <input disabled {{ in_array($option->id, $selectedOptionIds) ? 'checked' : '' }} type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                            <strong>{{ $option->name }}</strong>
                        </label>
                    </div>
                @endforeach
            </div>

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

