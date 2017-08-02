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

    {{--<div class="container">--}}
        {{--<div class="row">--}}
            {{--<div class="col-md-8 col-md-offset-2">--}}
                {{--<div class="panel panel-default">--}}
                    {{--<div class="panel-heading">Reset Password</div>--}}
    {{----}}
                    {{--<div class="panel-body">--}}
                        {{--@if (session('status'))--}}
                            {{--<div class="alert alert-success">--}}
                                {{--{{ session('status') }}--}}
                            {{--</div>--}}
                        {{--@endif--}}
    {{----}}
                        {{--<form class="form-horizontal" role="form" method="POST" action="{{ route('password.request') }}">--}}
                            {{--{{ csrf_field() }}--}}
    {{----}}
                            {{--<input type="hidden" name="token" value="{{ $token }}">--}}
    {{----}}
                            {{--<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">--}}
                                {{--<label for="email" class="col-md-4 control-label">E-Mail Address</label>--}}
    {{----}}
                                {{--<div class="col-md-6">--}}
                                    {{--<input id="email" type="email" class="form-control" name="email" value="{{ $email or old('email') }}" required autofocus>--}}
    {{----}}
                                    {{--@if ($errors->has('email'))--}}
                                        {{--<span class="help-block">--}}
                                            {{--<strong>{{ $errors->first('email') }}</strong>--}}
                                        {{--</span>--}}
                                    {{--@endif--}}
                                {{--</div>--}}
                            {{--</div>--}}
    {{----}}
                            {{--<div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">--}}
                                {{--<label for="password" class="col-md-4 control-label">Password</label>--}}
    {{----}}
                                {{--<div class="col-md-6">--}}
                                    {{--<input id="password" type="password" class="form-control" name="password" required>--}}
    {{----}}
                                    {{--@if ($errors->has('password'))--}}
                                        {{--<span class="help-block">--}}
                                            {{--<strong>{{ $errors->first('password') }}</strong>--}}
                                        {{--</span>--}}
                                    {{--@endif--}}
                                {{--</div>--}}
                            {{--</div>--}}
    {{----}}
                            {{--<div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">--}}
                                {{--<label for="password-confirm" class="col-md-4 control-label">Confirm Password</label>--}}
                                {{--<div class="col-md-6">--}}
                                    {{--<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>--}}
    {{----}}
                                    {{--@if ($errors->has('password_confirmation'))--}}
                                        {{--<span class="help-block">--}}
                                            {{--<strong>{{ $errors->first('password_confirmation') }}</strong>--}}
                                        {{--</span>--}}
                                    {{--@endif--}}
                                {{--</div>--}}
                            {{--</div>--}}
    {{----}}
                            {{--<div class="form-group">--}}
                                {{--<div class="col-md-6 col-md-offset-4">--}}
                                    {{--<button type="submit" class="btn btn-primary">--}}
                                        {{--Reset Password--}}
                                    {{--</button>--}}
                                {{--</div>--}}
                            {{--</div>--}}
                        {{--</form>--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</div>--}}
        {{--</div>--}}
    {{--</div>--}}
@endsection
