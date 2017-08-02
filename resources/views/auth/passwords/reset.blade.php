@extends('layouts.app')

@section('content')
    <div class="section section--no-header-or-footer section--darker">
        <div class="password-reset">
            <div class="password-reset__logo">
                <a href="/">
                    <img src="/images/dmr-logo.svg"/>
                </a>
            </div>
        </div>
        <form class="password-reset__form" role="form" method="POST" action="/password/reset">
            {{ csrf_field() }}

            <div class="password-reset__title">
                Reset Password
            </div>

            @if (session('status'))
                <div class="password-reset__message">
                    {{ session('status') }}
                </div>
            @endif

            <div class="password-reset__sexy-line"></div>

            <input type="hidden" name="token" value="{{ $token }}">

            <div class="password-reset__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                <label for="email" class="password-reset__label">Email</label>

                <div class="password-reset__input-and-error">
                    <input id="email" type="email" class="password-reset__input" name="email" value="{{ old('email') }}" required autofocus>

                    @if ($errors->has('email'))
                        <span class="password-reset__error">
                            <strong>{{ $errors->first('email') }}</strong>
                        </span>
                    @endif
                </div>

                <label for="password" class="password-reset__label">Password</label>

                <div class="password-reset__input-and-error">
                    <input id="password" type="password" class="password-reset__input" name="password" required>

                    @if ($errors->has('password'))
                        <span class="password-reset__error">
                            <strong>{{ $errors->first('password') }}</strong>
                        </span>
                    @endif
                </div>

                <label for="password_confirmation" class="password-reset__label">Confirm Password</label>

                <div class="password-reset__input-and-error">
                    <input id="password-confirm" type="password" class="password-reset__input" name="password_confirmation" required>

                    @if ($errors->has('password_confirmation'))
                        <span class="password-reset__error">
                            <strong>{{ $errors->first('password_confirmation') }}</strong>
                        </span>
                    @endif
                </div>
            </div>

            <div class="password-reset__buttons">
                <button type="submit" class="password-reset__button password-reset__button--blue password-reset__button--small">
                    Reset Password
                </button>
            </div>
        </form>
    </div>
@endsection
