@extends('layouts.app')

@section('title', 'Select a model version')

@section('content')
    <div class="step-1">
        @foreach ($versions as $version)
            <form method="post" action="/step-1">
                {{ csrf_field() }}
                <input type="hidden" name="version_id" value="{{ $version->id }}">
                <button class="btn btn-default" type="submit">{{ $version->description }}</button>
            </form>
        @endforeach
    </div>
@endsection
