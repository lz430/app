@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            {{  $deal->title() }}
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li><a href="/admin/deal">Deals</a></li>
            <li class="active">View</li>
        </ol>
    </section>
@endsection

@section('content')
    @component('components.box', ['bodyclasses' => 'no-padding'])
        <ul class="nav nav-pills">
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}">Features</a>
            </li>
            <li role="presentation" class="active">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

    @foreach($quotes as $type => $roles)
        @component('components.box')
            @slot('title')
                {{$type}}
            @endslot
            @foreach($roles as $role => $data)
                @component('components.box')
                    @slot('title')
                        {{$role}}
                    @endslot
                    @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-rates"])
                        @slot('title')
                            Rates & Rebates
                        @endslot
                        <pre>{{ json_encode($data['rates'], JSON_PRETTY_PRINT) }}</pre>
                    @endcomponent
                    @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-quote"])
                        @slot('title')
                            Quote (Excluding Lease Payments)
                        @endslot
                        <pre>{{ json_encode($data['quote'], JSON_PRETTY_PRINT) }}</pre>
                    @endcomponent
                    @if (isset($data['payments']))
                        @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-payments"])
                            @slot('title')
                                Lease Payments
                            @endslot
                            <pre>{{ json_encode($data['payments'], JSON_PRETTY_PRINT) }}</pre>
                        @endcomponent
                    @endif
                @endcomponent
            @endforeach
        @endcomponent
    @endforeach
@endsection