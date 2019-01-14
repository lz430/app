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
                        <b>Created
                            At</b>: {{$purchase->deal->created_at->format(config('app.default_datetime_format'))}}
                    </li>
                    <li class="list-group-item">
                        <b>Updated
                            At</b>: {{$purchase->deal->updated_at->format(config('app.default_datetime_format'))}}
                    </li>
                    <li class="list-group-item">
                        <b>Type</b>: {{ucwords($purchase->type)}}
                    </li>
                    @if($purchase->msrp)
                        <li class="list-group-item">
                            <b>MSRP</b>: ${{number_format($purchase->msrp, 2)}}
                        </li>
                    @endif
                    @if($purchase->dmr_price)
                        <li class="list-group-item">
                            <b>DMR Price</b>: ${{number_format($purchase->dmr_price, 2)}}
                        </li>
                    @endif
                    @if($purchase->down_payment)
                        <li class="list-group-item">
                            <b>Down Payment</b>: ${{number_format($purchase->down_payment, 2)}}
                        </li>
                    @endif
                    @if($purchase->rebates->total)
                        <li class="list-group-item">
                            <b>Total Rebates</b>: ${{number_format($purchase->rebates->total, 2)}}
                        </li>
                    @endif
                    @if($purchase->monthly_payment)
                        <li class="list-group-item">
                            <b>Monthly Payment</b>: ${{number_format($purchase->monthly_payment, 2)}}
                        </li>
                    @endif
                    @if($purchase->term)
                        <li class="list-group-item">
                            <b>Term</b>: {{$purchase->term}} Months
                        </li>
                    @endif
                    @if($purchase->lease_mileage)
                        <li class="list-group-item">
                            <b>Lease Mileage</b>: {{number_format($purchase->lease_mileage)}}
                        </li>
                    @endif
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
                        <b>Options</b>: {{$purchase->deal->option_codes ? implode(", ", $purchase->deal->option_codes) : "None"}}
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

    @if ($purchase->rebates)
        @component('components.box')
            @slot('title')
                Rebates
            @endslot
            @if(isset($purchase->rebates->everyone) && count((array) $purchase->rebates->everyone->programs))
                @component('components.box')
                    @slot('title')
                        Everyone Rebates - (${{number_format($purchase->rebates->everyone->total, 2)}})
                    @endslot
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>Value</th>
                            <th>Type</th>
                            <th>Facing</th>
                            <th>ID</th>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>Stop Date</th>
                            <th>Financial Institution</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($purchase->rebates->everyone->programs as $program)
                            <tr>
                                <td>{{$program->value}}</td>
                                <td>{{$program->program->ProgramType}}</td>
                                <td>{{$program->program->Facing}}</td>
                                <td>{{$program->program->ProgramID}}</td>
                                <td>{{$program->program->ProgramNumber}}</td>
                                <td>{{$program->program->ProgramName}}</td>
                                <td>{{$program->program->ProgramDescription}}</td>
                                <td>{{$program->program->ProgramStartDate}}</td>
                                <td>{{$program->program->ProgramStopDate}}</td>
                                <td>{{$program->program->FinancialInstitution}}</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>

                @endcomponent
            @endif
            @if(isset($purchase->rebates->lease) && count((array) $purchase->rebates->lease->programs))
                @component('components.box')
                    @slot('title')
                        Lease Rebates - (${{number_format($purchase->rebates->lease->total, 2)}})
                    @endslot
                    @foreach($purchase->rebates->lease->programs as $program)
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>Value</th>
                                <th>Type</th>
                                <th>Facing</th>
                                <th>ID</th>
                                <th>Number</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>Stop Date</th>
                                <th>Financial Institution</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{{$program->value}}</td>
                                <td>{{$program->program->ProgramType}}</td>
                                <td>{{$program->program->Facing}}</td>
                                <td>{{$program->program->ProgramID}}</td>
                                <td>{{$program->program->ProgramNumber}}</td>
                                <td>{{$program->program->ProgramName}}</td>
                                <td>{{$program->program->ProgramDescription}}</td>
                                <td>{{$program->program->ProgramStartDate}}</td>
                                <td>{{$program->program->ProgramStopDate}}</td>
                                <td>{{$program->program->FinancialInstitution}}</td>
                            </tr>
                            </tbody>
                        </table>
                        <hr/>
                        @if ($program->scenario)
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th>CCR</th>
                                    <th>Factor</th>
                                    <th>TierNo</th>
                                    <th>ResidualBump</th>
                                    <th>NoSecurityDeposit</th>
                                    <th>QualifyingTermEnd</th>
                                    <th>QualifyingTermStart</th>
                                    <th>FirstPaymentWaived</th>
                                    <th>MaxCarryArgumentID</th>
                                    <th>MaxCarryPercentage</th>
                                    <th>ManufacturerTierName</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($program->scenario->terms as $scenario)
                                    <tr>
                                        <td>{{$scenario->CCR}}</td>
                                        <td>{{$scenario->Factor}}</td>
                                        <td>{{$scenario->TierNo}}</td>
                                        <td>{{$scenario->ResidualBump}}</td>
                                        <td>{{$scenario->NoSecurityDeposit}}</td>
                                        <td>{{$scenario->QualifyingTermEnd}}</td>
                                        <td>{{$scenario->QualifyingTermStart}}</td>
                                        <td>{{$scenario->FirstPaymentWaived}}</td>
                                        <td>{{$scenario->MaxCarryArgumentID}}</td>
                                        <td>{{$scenario->MaxCarryPercentage}}</td>
                                        <td>{{$scenario->ManufacturerTierName}}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        @endif

                    @endforeach

                @endcomponent
            @endif

            @if(isset($purchase->rebates->conditional) && count((array) $purchase->rebates->conditional->programs))
                @component('components.box')
                    @slot('title')
                        Conditional Rebates - (${{number_format($purchase->rebates->conditional->total, 2)}})
                    @endslot
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>Value</th>
                            <th>Type</th>
                            <th>Facing</th>
                            <th>ID</th>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>Stop Date</th>
                            <th>Financial Institution</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($purchase->rebates->conditional->programs as $program)
                            <tr>
                                <td>{{$program->value}}</td>
                                <td>{{$program->program->ProgramType}}</td>
                                <td>{{$program->program->Facing}}</td>
                                <td>{{$program->program->ProgramID}}</td>
                                <td>{{$program->program->ProgramNumber}}</td>
                                <td>{{$program->program->ProgramName}}</td>
                                <td>{{$program->program->ProgramDescription}}</td>
                                <td>{{$program->program->ProgramStartDate}}</td>
                                <td>{{$program->program->ProgramStopDate}}</td>
                                <td>{{$program->program->FinancialInstitution}}</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>

                @endcomponent
            @endif
        @endcomponent
    @endif

    <h3>
        Developer
    </h3>
    <div class="row">
        <div class="col-md-12">
            @if ($purchase->rebates)
                @component('components.box')
                    @slot('title')
                        Rebates
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
                        Trade
                    @endslot
                    <pre>{{ json_encode($purchase->trade, JSON_PRETTY_PRINT) }}</pre>
                @endcomponent
            @endif
        </div>
    </div>
@endsection