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
            <li role="presentation" class="active">
                <a href="/admin/deal/{{$deal->id}}">Features</a>
            </li>
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

    <h1>
        Deal
    </h1>

    <div class="row">
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    General
                @endslot
                <strong>ID: </strong> {{$deal->id}}<br/>
                <strong>Stock #: </strong> {{$deal->stock_number}}<br/>
                <strong>VIN: </strong> {{$deal->vin}}<br/>
                <strong>Packages: </strong> {{$deal->package_codes ? implode(", ", $deal->package_codes) : "None"}}
                <br/>
                <strong>Options: </strong> {{$deal->option_codes ? implode(", ", $deal->option_codes) : "None"}}<br/>
                <strong>Status: </strong> {{$deal->status}}
                @slot('footer')
                    <a href="/admin/deal/{{$deal->id}}/edit">Edit Deal Status</a>
                @endslot
            @endcomponent
            @component('components.box')
                @slot('title')
                    Dealer
                @endslot
                @if ($deal->dealer)
                    <strong>{{$deal->dealer->name}}</strong> <br/>
                    {{$deal->dealer->dealer_id}} <br/>
                    @slot('footer')
                        <a href="/admin/dealer/{{$deal->dealer->id}}/edit">Edit Dealer</a>
                    @endslot
                @else
                    No Dealer!
                @endif
            @endcomponent
        </div>
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    Source Prices
                @endslot
                <ul class="list-group no-padding no-margin">
                    @foreach ($deal->source_price as $key => $price)
                        <li class="list-group-item">
                            {{$key}} : {{$price}}
                        </li>
                    @endforeach
                </ul>
            @endcomponent
        </div>
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    Prices
                @endslot
                <ul class="list-group no-padding no-margin">
                    @foreach ($deal->prices() as $key => $price)
                        <li class="list-group-item">
                            {{$key}} : {{$price}}
                        </li>
                    @endforeach
                </ul>
            @endcomponent
        </div>
    </div>
    <h3>
        Media
    </h3>
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-header">
                    <div class="box-title">
                        Marketing Photos
                    </div>
                </div>
                <div class="box-body">
                    <div class="row">
                        @foreach ($deal->marketingPhotos() as $photo)
                            <div class="col-md-2">
                                <img style="max-width:100%; margin-bottom:20px;" src="{{$photo->url}}"/>
                            </div>
                        @endforeach
                    </div>

                </div>
            </div>
        </div>
    </div>
    <h3>
        Features
    </h3>
    <div class="row">
        @foreach ($features as $group)
            <div class="col-md-4">
                @foreach($group as $title => $category)
                    @component('components.box')
                        @slot('title')
                            {{$title}}
                        @endslot
                        <ul class="list-item no-padding no-margin">
                            @foreach($category as $feature)
                                <li class="list-group-item">
                                    {{$feature->title}}
                                </li>
                            @endforeach
                        </ul>
                    @endcomponent
                @endforeach
            </div>
        @endforeach
    </div>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Vauto Features
                @endslot
                {{implode(', ', explode("|",$deal->vauto_features))}}
            @endcomponent
        </div>
    </div>
    <h3>Compare Data</h3>
    <div class="row">

        @foreach($compare as $category => $labels)
            <div class="col-md-3">
                @component('components.box')
                    @slot('title')
                        {{$category}}
                    @endslot
                    <ul class="list-group no-padding no-margin">
                        @foreach ($labels as $label)
                            <li class="list-group-item" style="padding:2px;">
                                {{$label}}
                            </li>
                        @endforeach
                    </ul>
                @endcomponent
            </div>
        @endforeach
    </div>
    <h1>
        Jato Data
    </h1>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Standard Equipment
                @endslot
                @foreach($standardEquipment as $category => $equipments)
                    @component('components.box', ['collapsible' => true, 'key' => 'sec-' . strtolower(str_replace([' ', '&'], ['', ''], $category))])
                        @slot('title')
                            {{$category}}
                        @endslot
                            <div class="row">
                                @foreach($equipments as $key => $equipment)
                                    <div class="col-md-3">
                                        @include('admin.shared.jatoequipment', ['equipment' => $equipment, 'prefix' => 'se'.$key])
                                    </div>
                                @endforeach
                            </div>
                    @endcomponent
                @endforeach
            @endcomponent
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Packages
                @endslot
                <div class="box-group" id="accordion-package">
                    @foreach ($packages as $key => $package)
                        @component('components.box', ['collapsible' => true, 'key' => 'package-' . $key])
                            @slot('title')
                                {{$package['isOnDeal'] ? "YES" : "NO"}} [{{$package['option']->optionCode}}]
                                - {{$package['option']->optionName}}
                            @endslot
                            <pre>{{ json_encode($package['option'], JSON_PRETTY_PRINT) }}</pre>
                            <div class="row">
                                @foreach($package['equipment'] as $key => $equipment)
                                    <div class="col-md-3">
                                        @include('admin.shared.jatoequipment', ['equipment' => $equipment, 'prefix' => 'pe'.$key])
                                    </div>
                                @endforeach
                            </div>
                        @endcomponent
                    @endforeach
                </div>
            @endcomponent
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Options
                @endslot
                <div class="box-group" id="accordion-option">
                    @foreach ($options as $key => $option)
                        @component('components.box', ['collapsible' => true, 'key' => 'option-' . $key])
                            @slot('title')
                                {{$option['isOnDeal'] ? "YES" : "NO"}} [{{$option['option']->optionCode}}]
                                - {{$option['option']->optionName}}
                            @endslot
                            <pre>{{ json_encode($option['option'], JSON_PRETTY_PRINT) }}</pre>
                            <div class="row">
                                @foreach($option['equipment'] as $key => $equipment)
                                    <div class="col-md-3">
                                        @include('admin.shared.jatoequipment', ['equipment' => $equipment, 'prefix' => 'oe'.$key])
                                    </div>
                                @endforeach
                            </div>
                        @endcomponent
                    @endforeach
                </div>
            @endcomponent
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Vehicle Versions
                @endslot
                @if (isset($versions['decode']))
                    <pre>{{ json_encode($versions['decode'], JSON_PRETTY_PRINT) }}</pre>
                @endif
                @if (isset($versions['versions']))
                    <div class="box-group" id="accordion-option">
                        @foreach ($versions['versions'] as $key => $version)
                            @component('components.box', ['collapsible' => true, 'key' => 'version-' . $key])
                                @slot('title')
                                    {{$version->vehicle_ID == $deal->version->jato_vehicle_id ? "YES" : "NO"}}
                                    [{{$version->vehicle_ID}}] - {{$version->versionName}}
                                @endslot
                                <pre>{{ json_encode($version, JSON_PRETTY_PRINT) }}</pre>
                            @endcomponent
                        @endforeach
                    </div>
                @endif
            @endcomponent
        </div>
    </div>
    <h1>
        Models
    </h1>
    <div class="row">
        <div class="col-md-12">
            @foreach ($models as $key => $model)
                @component('components.box', ['collapsible' => true, 'key' => 'model-' . $key])
                    @slot('title')
                        {{$model['title']}}
                    @endslot
                    <pre>{{ json_encode($model['model'], JSON_PRETTY_PRINT) }}</pre>
                @endcomponent
            @endforeach
        </div>
    </div>
@endsection