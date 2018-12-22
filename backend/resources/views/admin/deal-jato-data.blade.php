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
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation" class="active">
                <a href="/admin/deal/{{$deal->id}}/jato">JATO Data</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

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
@endsection