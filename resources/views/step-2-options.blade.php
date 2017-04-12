@extends('layouts.app')

@section('title', 'Select options')

@section('content')
    <form method="post" action="/step-2">
        {{ csrf_field() }}

        @foreach($options as $option)
            <div style="border: 1px solid black;padding: 15px;">
                <label><strong>{{ $option->name }}</strong>
                    <input type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                </label>

                <br>

                {!! $option->description !!}
            </div>

            <br>
        @endforeach

        <input type="hidden" name="version_id" value="{{ $versionId }}">

        <button type="submit">Continue</button>
    </form>
@endsection
