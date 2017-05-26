@extends('layouts.app')

@section('content')
    <div class="section section--stretch">
        <div class="section__title">
            Apply for financing
        </div>
        <div class="section__title section__title--small">
            <form method="post" action="{{ route('apply') }}" class="application-form">
                {{ csrf_field() }}
                <input type="hidden" name="deal_id" value="{{ $deal_id }}">

                <div class="application-form__input-group">
                    <label class="application-form__label">First Name
                        <input class="application-form__input-text" type="text" name="first_name">
                    </label>
                    <label class="application-form__label">Middle Name
                        <input class="application-form__input-text" type="text" name="middle_name">
                    </label>
                    <label class="application-form__label">Last Name
                        <input class="application-form__input-text" type="text" name="last_name">
                    </label>
                    <label class="application-form__label">Email Address
                        <input class="application-form__input-text" type="email" name="email">
                    </label>
                </div>

                <button type="submit" class="application-form__button">Apply</button>
            </form>
        </div>
    </div>
@endsection
