@extends('layouts.app')

@section('content')
    <div class="section section--stretch">
        <div class="section__title">
            Admin links
        </div>
        <div class="" style="width: 15rem; margin: 0 auto; font-size: 1.5rem">
            <ul>
                <li><a href="/admin/zip-tester/48103">ZIP Tester</a></li>
                <li><a href="/admin/jato-logs/">JATO Logs</a></li>
                <li><a href="/admin/statistics/deals">Deals Statistics</a></li>
                <li><a href="/admin/deal-debugger/{{  App\Deal::first()->id }}">Deal Debugger</a></li>
                <li>Deal by Vin: <form method="post" action="/admin/deal-by-vin">{{ csrf_field() }}<input name="vin" style="padding: 0.5em;" placeholder="VIN"><input type="submit" value="find" style="padding: 0.5em 1em; background: #eee;"></form></li>
            </ul>
        </div>
    </div>
@endsection
