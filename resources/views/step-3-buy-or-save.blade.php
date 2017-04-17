@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <div class="step-3">
        <h1>{{ $version->description }}</h1>

        <h2>msrp: ${{ $version->msrp }}</h2>

        <details>
            <pre>
                {{ json_encode($version, JSON_PRETTY_PRINT) }}
            </pre>
        </details>

        <form method="post" action="/buy">
            {{ csrf_field() }}

            @foreach ($options as $option)
                <div class="step-3__option {{ in_array($option->id, $selectedOptionIds) ? '' : 'hide' }}">
                    <label>
                        <input disabled {{ in_array($option->id, $selectedOptionIds) ? 'checked' : '' }} type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                        <strong>{{ $option->name }}</strong>
                    </label>
                </div>
            @endforeach

            @foreach ($options as $option)
                @if (in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <label>
                <button class="btn btn-primary" type="submit">Make this my ride</button>
            </label>
        </form>

        <br>
        <br>

        <form method="post" action="/save">
            {{ csrf_field() }}

            <div class="form-group">
                <label>Share your car with yourself, or come back later to view it
                    <br>
                    <input class="form-control" type="email" name="email" required>
                </label>
            </div>

            @foreach ($options as $option)
                @if (in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <button class="btn btn-primary" type="submit" formaction="/save">Save</button>
        </form>
    </div>
@endsection

