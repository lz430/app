@extends('layouts.app')

@section('content')
    @section('nav')
    @endsection

    <div class="section section--no-header-or-footer section--darker">
        <div class="login">
            <div class="login__logo">
                <img src="/images/dmr-logo.svg"/>
            </div>
            <form class="login__form" role="form" method="POST" action="{{ route('login') }}">
                {{ csrf_field() }}

                <div class="login__title">
                    Sign in
                </div>

                <div class="login__sexy-line"></div>

                <div class="login__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                    <label for="email" class="login__label">Email</label>

                    <div class="login__input-and-error">
                        <input id="email" type="email" class="login__input" name="email" value="{{ old('email') }}" required autofocus>

                        @if ($errors->has('email'))
                            <span class="login__error">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="login__group {{ $errors->has('password') ? ' login__group-has-error' : '' }}">
                    <label for="password" class="login__label">Password</label>

                    <div class="login__input-and-error">
                        <input id="password" type="password" class="login__input" name="password" required>

                        @if ($errors->has('password'))
                            <span class="login__error">
                                <strong>{{ $errors->first('password') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="login__remember-and-forgot">
                    <div class="login__remember">
                        <label>
                            <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                        </label>
                    </div>

                    <div class="login__forgot">
                        <a class="login__forgot-link" href="{{ route('password.request') }}">
                            Forgot Your Password?
                        </a>
                    </div>
                </div>

                <div class="login__buttons">
                    <button type="submit" class="login__button login__button--blue login__button--small">
                        Sign in to your account
                    </button>
                </div>
            </form>
        </div>
    </div>

    @section('footer')
    @endsection
@endsection
