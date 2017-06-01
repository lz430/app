@extends('layouts.app')

@section('content')
    <div class="section section--stretch">
        <div class="apply-or-purchase">
            <form action="{{ route('viewApply') }}">
                {{ csrf_field() }}
                <input type="hidden" name="deal_id" value="{{ $deal_id }}">
                <button type="submit" class="apply-or-purchase__button">Apply for Financing</button>
            </form>

            OR

            <form method="post" action="{{ route('purchase') }}">
                {{ csrf_field() }}
                <input type="hidden" name="deal_id" value="{{ $deal_id }}">
                <button type="submit" class="apply-or-purchase__button">Purchase</button>
            </form>
        </div>
    </div>
@endsection
