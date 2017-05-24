@extends('layouts.app')

@section('content')
    <div class="section section--stretch">
        <div class="apply-or-purchase">
            <button class="apply-or-purchase__button">Apply for Financing</button>

            OR

            <form method="post" action="{{ route('purchase') }}">
                {{ csrf_field() }}
                <input type="hidden" name="deal_id" value="{{ $deal->id }}">
                <button type="submit" class="apply-or-purchase__button">Purchase</button>
            </form>
        </div>
    </div>
@endsection
