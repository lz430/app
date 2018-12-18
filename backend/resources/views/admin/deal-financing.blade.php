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
                <a href="/admin/deal/{{$deal->id}}/jato">JATO Data</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

    <div class="row">
        <div class="col-md-6">
            @component('components.box')
                @slot('title')
                    Vehicle Details
                @endslot
                <ul class="list-group no-padding no-margin">
                    <li class="list-group-item">
                        <b>Deal ID</b>: {{$deal->id}}
                    </li>
                    <li class="list-group-item">
                        <b>Dealer Name</b>: {{$deal->dealer->name}}
                    </li>
                    <li class="list-group-item">
                        <b>Stock #</b>: {{$deal->stock_number}}
                    </li>
                    <li class="list-group-item">
                        <b>VIN</b>: {{$deal->vin}}
                    </li>
                    <li class="list-group-item">
                        <b>Packages</b>: {{$deal->package_codes ? implode(", ", $deal->package_codes) : "None"}}
                    </li>
                    <li class="list-group-item">
                        <b>Status</b>: {{$deal->status}}
                    </li>
                </ul>
            @endcomponent
        </div>
        <div class="col-md-6">
            @component('components.box')
                @slot('title')
                    Price Details
                @endslot
                <ul class="list-group no-padding no-margin">
                    <li class="list-group-item">
                        <b>MSRP</b>: ${{number_format($deal->msrp, 2)}}
                    </li>
                    <li class="list-group-item">
                        <b>Sale Price</b>: ${{number_format($deal->price, 2)}}
                    </li>
                    <li class="list-group-item">
                        <b>CVR Fee</b>: ${{number_format($deal->dealer->cvr_fee, 2)}}
                    </li>
                    <li class="list-group-item">
                        <b>Registration Fee</b>: ${{number_format($deal->dealer->registration_fee, 2)}}
                    </li>
                    <li class="list-group-item">
                        <b>Acquisition Fee</b>: ${{number_format($deal->dealer->acquisition_fee, 2)}}
                    </li>
                    <li class="list-group-item">
                        <b>Doc Fee</b>: ${{number_format($deal->dealer->doc_fee, 2)}}
                    </li>
                </ul>
            @endcomponent
        </div>
    </div>
    <div class="row">
        @foreach($quotes as $type => $roles)
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    @php $scenarioType = null; @endphp
                    @foreach($roles as $role => $data)
                    @foreach($data['rebates']['everyone']['programs'] as $program)
                        @php $scenarioType = $program->scenario->DealScenarioType; @endphp
                    @endforeach
                    @endforeach
                    <b>{{ucwords($type)}}</b> | {{$scenarioType}}
                @endslot
                @foreach($roles as $role => $data)
                    @component('components.box')
                        @slot('title')
                            {{ucwords($role)}}
                        @endslot
                            @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-rates"])
                                @slot('title')
                                    Rates & Rebates
                                @endslot
                                <div class="box box-default">
                                    <div class="box-header with-border">
                                    <div class="box-title">
                                       Cash Programs for Everyone
                                    </div>
                                    <table class="table table-condensed">
                                        <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Id</th>
                                            <th>Value</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        @foreach($data['rebates']['everyone']['programs'] as $program)
                                            <tr>
                                                <td>{{$program->program->ProgramName}}</td>
                                                <td>{{$program->program->ProgramID}}</td>
                                                <td>${{$program->value}}</td>
                                            </tr>
                                        @endforeach
                                        <tr class="well">
                                            <td><b>Total</b></td>
                                            <td></td>
                                            <td>${{$data['rebates']['everyone']['total']}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                                <div class="box box-default">
                                    <div class="box-header with-border">
                                        <div class="box-title">
                                            Selected Conditionals
                                        </div>
                                        <table class="table table-condensed">
                                            <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Id</th>
                                                <th>Role</th>
                                                <th>Value</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            @foreach($data['selections']['conditionalRoles'] as $conditional)
                                                <tr>
                                                    <td>{{$conditional['title']}}</td>
                                                    <td>{{$conditional['id']}}</td>
                                                    <td>{{$conditional['role']}}</td>
                                                    <td>${{$conditional['value']}}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            @endcomponent
                            @if($type == 'lease')
                                @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-quote"])
                                    @slot('title')
                                        Quotes
                                    @endslot
                                        <table class="table table-condensed">
                                            <thead>
                                            <tr>
                                                <th>Term Length</th>
                                                <th>Rate/Money Factor</th>
                                                <th>Residuals</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            @foreach($data['rates'] as $rate)
                                                <tr>
                                                    <td>{{isset($rate['termLength']) ? $rate['termLength'] : '--'}}</td>
                                                    <td>{{isset($rate['rate']) ? $rate['rate'] . '%' : (isset($rate['moneyFactor']) ? $rate['moneyFactor'] : '--')}}</td>
                                                    @foreach($rate['residuals'] as $residual)
                                                        <td>{{isset($residual['annualMileage']) ? $residual['annualMileage'] . ' miles' : '--'}}</td>
                                                        <td>{{isset($residual['residualPercent']) ? $residual['residualPercent'] . '%' : '--'}}</td>
                                                    @endforeach
                                                </tr>
                                            @endforeach

                                            </tbody>
                                        </table>
                                @endcomponent
                                @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-payment"])
                                    @slot('title')
                                        Lease Payments
                                    @endslot
                                        <table class="table table-condensed">
                                            <thead>
                                            <tr>
                                                <th>Term</th>
                                                <th>Cash Due</th>
                                                <th>Annual Mileage</th>
                                                <th>Monthly Payment</th>
                                                <th>Total Amt. @ Drive Off</th>
                                                <th>Use Tax</th>
                                                <th>Pre Tax Amt.</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            @foreach($data['payments'] as $payment)
                                                <tr>
                                                    <td>{{$payment['term']}}</td>
                                                    <td>{{isset($payment['cash_due']) ? $payment['cash_due'] : '--'}}</td>
                                                    <td>{{isset($payment['annual_mileage']) ? $payment['annual_mileage'] : '--'}}</td>
                                                    <td>{{isset($payment['monthly_payment']) ? '$' . $payment['monthly_payment'] : '--'}}</td>
                                                    <td>{{isset($payment['total_amount_at_drive_off']) ? '$' . $payment['total_amount_at_drive_off'] : '--'}}</td>
                                                    <td>{{isset($payment['monthly_use_tax']) ? '$' . $payment['monthly_use_tax'] : '--'}}</td>
                                                    <td>{{isset($payment['monthly_pre_tax_payment']) ? '$' . $payment['monthly_pre_tax_payment'] : '--'}}</td>
                                                    <td></td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                @endcomponent
                            @endif
                    @endcomponent
                @endforeach
            @endcomponent
        </div>
        @endforeach
    </div>
@endsection