@extends('layouts.app')

@section('content')
    <div class="section section--stretch">
        <div class="section__title">
            Admin links
        </div>
        <div class="section__title section__title--small">
            <ul>
                <li><a href="/admin/zip-tester/48103">ZIP Tester</a></li>
                <li><a href="/admin/jato-logs/">JATO Logs</a></li>
                <li><a href="/admin/statistics/deals">Deals Statistics</a></li>
                <li><a href="/admin/deal-debugger/{{  App\Deal::first()->id }}">Deal Debugger</a></li>
            </ul>
        </div>
    </div>
@endsection
