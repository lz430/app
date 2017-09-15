@extends('layouts.app')

@section('content')
@section('nav')
@endsection

<div class="section section--no-header-or-footer section--darker">
    <div class="request-email">
        <div class="request-email__logo">
            <a href="/">
                <img src="/images/dmr-logo.svg"/>
            </a>
        </div>
        <form class="request-email__form" method="POST" action="{{ route('receive-email') }}">
            {{ csrf_field() }}

            <div class="request-email__title">
                Where can we send your info?
            </div>

            <div class="request-email__sexy-line"></div>

            <div class="request-email__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                <label for="email" class="request-email__label">Email</label>

                <div class="request-email__input-and-error">
                    <input id="email" type="email" class="request-email__input" name="email" value="{{ old('email') }}" required autofocus>

                    @if ($errors->has('email'))
                        <span class="request-email__error">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                    @endif
                </div>
            </div>

            <div class="request-email__buttons">
                <button class="request-email__button request-email__button--blue request-email__button--small">
                    Continue
                </button>
            </div>
        </form>
    </div>
</div>

@section('footer')
@endsection
@endsection