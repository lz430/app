@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            {{  $purchase->title() }}
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li><a href="/admin/purchase">Purchases</a></li>
            <li class="active">View</li>
        </ol>
    </section>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    General Information
                @endslot
                <ul class="list-group no-padding no-margin">
                    <li class="list-group-item">
                        <b>Created At</b>: {{$purchase->deal->created_at}}
                    </li>
                </ul>
            @endcomponent
        </div>
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    Vehicle Information
                @endslot
                <ul class="list-group no-padding no-margin">
                    <li class="list-group-item">
                        <b>Deal ID</b>: {{$purchase->deal->id}}
                    </li>
                    <li class="list-group-item">
                        <b>Dealer Name</b>: {{$purchase->deal->dealer->name}}
                    </li>
                    <li class="list-group-item">
                        <b>Stock #</b>: {{$purchase->deal->stock_number}}
                    </li>
                    <li class="list-group-item">
                        <b>VIN</b>: {{$purchase->deal->vin}}
                    </li>
                    <li class="list-group-item">
                        <b>Packages</b>: {{$purchase->deal->package_codes ? implode(", ", $purchase->deal->package_codes) : "None"}}
                    </li>
                    <li class="list-group-item">
                        <b>Deal Status</b>: {{$purchase->deal->status}}
                    </li>
                </ul>
                @slot('footer')
                    <a href="/admin/deal/{{$purchase->deal->id}}">View Deal</a>
                @endslot

            @endcomponent
        </div>
        <div class="col-md-4">
            @if ($purchase->buyer)
                @component('components.box')
                    @slot('title')
                        Customer Information
                    @endslot
                    <ul class="list-group no-padding no-margin">
                        <li class="list-group-item">
                            <b>First Name</b>: {{$purchase->buyer->first_name}}
                        </li>
                        <li class="list-group-item">
                            <b>Last Name</b>: {{$purchase->buyer->last_name}}
                        </li>
                        <li class="list-group-item">
                            <b>Email</b>: {{$purchase->buyer->email}}
                        </li>
                        <li class="list-group-item">
                            <b>Phone</b>: {{$purchase->buyer->phone_number}}
                        </li>

                    </ul>
                @endcomponent
            @endif
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            @if ($purchase->rebates)
                @component('components.box')
                    @slot('title')
                        Developer - (Rebates)
                    @endslot
                    <pre>{{ json_encode($purchase->rebates, JSON_PRETTY_PRINT) }}</pre>
                @endcomponent
            @endif
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            @if ($purchase->rebates)
                @component('components.box')
                    @slot('title')
                        Developer - (Trade)
                    @endslot
                    <pre>{{ json_encode($purchase->trade, JSON_PRETTY_PRINT) }}</pre>
                @endcomponent
            @endif
        </div>
    </div>
@endsection