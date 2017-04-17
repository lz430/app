@extends('layouts.app')

@section('title', 'Select options')

@section('content')
    <div class="step-2">
        <form method="post" action="/step-2">
            {{ csrf_field() }}

            @foreach($options as $option)
                <div class="step-2__option">
                    <label>
                        <input type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                        <strong>{{ $option->name }}</strong>
                    </label>

                    <br>

                    {!! $option->description !!}
                </div>

                <br>
            @endforeach

            <input type="hidden" name="version_id" value="{{ $versionId }}">

            <button class="btn btn-primary" type="submit">Continue</button>
        </form>
    </div>
@endsection
