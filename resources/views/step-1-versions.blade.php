@extends('layouts.app')

@section('title', 'Select a model version')

@section('content')
    <div class="step-1">
        @foreach ($versionsGrouped as $groupName => $versionsBodyTypeGrouped)
            <h2>{{ $groupName }}</h2>

            @foreach ($versionsBodyTypeGrouped as $bodyType => $versions)
                <div class="items">
                    @foreach ($versions as $version)
                        <form class="items__item" method="post" action="/step-1" onclick="this.submit()">
                            {{ csrf_field() }}
                            <input type="hidden" name="version_id" value="{{ $version->id }}">
                            {{ $version->year }} {{ $version->description }} ({{ $bodyType }})
                        </form>
                    @endforeach
                </div>
            @endforeach
        @endforeach
    </div>
@endsection
