@extends('layouts.app')

@section('content')
    <div class="section section--no-footer">
        <div class="section__title">
            <div class="section__title-icon">
                {!! file_get_contents(resource_path("assets/svg/zondicons/checkmark-outline.svg")) !!}
            </div>
            Thanks you for your purchase!

            <div class="section__title section__title--small section__title--constrict-extra-small">
                We'll get in touch with you soon to work out delivery and payment details
            </div>
        </div>

        <div class="section__image">
            <img src="{{ $purchase->deal->photos->first()->url }}">
        </div>

        <div class="section__title section__title--small section__title--constrict-small">
            If you enjoyed your experience using Deliver My Ride, it would be awesome if you could share it with your friends.
            <div class="section__buttons">
                <a href="#" class="section__button section__button--small section__button--facebook-blue section__button--no-border">
                    {!! file_get_contents(resource_path("assets/svg/social/facebook.svg")) !!}
                    Share
                </a>
                <a href="#" class="section__button section__button--small section__button--twitter-blue section__button--no-border">
                    {!! file_get_contents(resource_path("assets/svg/social/twitter.svg")) !!}
                    Tweet
                </a>
            </div>
        </div>
    </div>
    @section('footer')
    @endsection
@endsection
