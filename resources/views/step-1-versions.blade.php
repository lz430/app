@extends('layouts.app')

@section('title', 'Select a model version')

@section('content')
    <div class="step-1">
        @foreach ($versionsGrouped as $groupName => $versions)
            <h2>{{ $groupName }}</h2>
            <div class="items">
                @foreach ($versions as $version)
                    <form class="items__item" method="post" action="/step-1" onclick="this.submit()">
                        {{ csrf_field() }}
                        <input type="hidden" name="version_id" value="{{ $version->id }}">
                        {{ $version->description }}
                    </form>
                @endforeach
            </div>
        @endforeach
    </div>
@endsection
