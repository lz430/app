@extends('layouts.app')

@section('title', 'Select a model version')

@section('content')
    @foreach ($versions as $version)
        <form method="post" action="/step-1">
            {{ csrf_field() }}
            <input type="hidden" name="version_id" value="{{ $version->id }}">
            <button type="submit">{{ $version->description }}</button>
        </form>
    @endforeach
@endsection
