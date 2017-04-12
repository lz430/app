@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <pre>
        {{ json_encode($version, JSON_PRETTY_PRINT) }}
    </pre>

    <form method="post" action="/buy">
        {{ csrf_field() }}

        @foreach ($options as $option)
            <div style="border: 1px solid black;padding: 15px;">
                <label><strong>{{ $option->name }}</strong>
                    <input disabled {{ in_array($option->id, $selectedOptionIds) ? 'checked' : '' }} type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                </label>
            </div>

            <br>
        @endforeach

        @foreach ($options as $option)
            @if (in_array($option->id, $selectedOptionIds))
                <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
            @endif
        @endforeach

        <input type="hidden" name="version_id" value="{{ $version->id }}">

        <label>Make this my ride
            <button type="submit">Buy</button>
        </label>
    </form>

    <br>
    <br>

    <form method="post" action="/save">
        {{ csrf_field() }}

        <label>Share your car with yourself, or come back later to view it
            <br>
            <input type="email" name="email" required>
        </label>

        @foreach ($options as $option)
            @if (in_array($option->id, $selectedOptionIds))
                <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
            @endif
        @endforeach

        <input type="hidden" name="version_id" value="{{ $version->id }}">

        <button type="submit" formaction="/save">Save</button>
    </form>
@endsection

