@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="section section--darker">
        <div class="section__title">
            Your New Ride Awaits
        </div>
        <div class="section__title section__title--small">
            We put the dealership’s inventory at your fingertips
            <br>
            while keeping the dealer under your thumb.
        </div>
    </div>

    <div class="section section--darkest">
        <div class="section__title section__title--uppercase section__title--small section__title--light section__title--spaced">
            Select a vehicle type
        </div>

        <div class="welcome-style-selector">
            <div class="welcome-style-selector__constrained">
                @foreach($styles as $style)
                    @include('partials.welcome-style', ['style' => $style])
                @endforeach
            </div>
        </div>
    </div>

    <div class="section section--no-padding">
        <div class="welcome-steps">
            <div class="welcome-steps__steps">
                <div class="welcome-steps__title">
                    Your New Ride Awaits
                    <div class="welcome-steps__sexy-line"></div>
                </div>

                <div class="welcome-steps__step-container">
                    <div class="welcome-steps__step-number">1</div>
                    <div class="welcome-steps__step">
                        <div class="welcome-steps__step-title">
                            Configure your vehicle
                        </div>
                        <div class="welcome-steps__step-description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cumque distinctio dolorem harum iste magni minima non nostrum.
                        </div>
                    </div>

                    <div class="welcome-steps__step-number">2</div>
                    <div class="welcome-steps__step">
                        <div class="welcome-steps__step-title">
                            Compare Instant Quotes
                        </div>
                        <div class="welcome-steps__step-description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cumque distinctio dolorem harum iste magni minima non nostrum.
                        </div>
                    </div>

                    <div class="welcome-steps__step-number">3</div>
                    <div class="welcome-steps__step">
                        <div class="welcome-steps__step-title">
                            Select & Buy
                        </div>
                        <div class="welcome-steps__step-description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cumque distinctio dolorem harum iste magni minima non nostrum.
                        </div>
                    </div>

                    <div class="welcome-steps__step-number">4</div>
                    <div class="welcome-steps__step">
                        <div class="welcome-steps__step-title">
                            We Deliver Your Ride
                        </div>
                        <div class="welcome-steps__step-description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cumque distinctio dolorem harum iste magni minima non nostrum.
                        </div>
                    </div>
                </div>
            </div>

            <div class="welcome-steps__image">

            </div>
        </div>
    </div>

    <div class="section">
        <div class="section__title">
            Our average customer saves 15.7% / $3,800 off MSRP.
        </div>
    </div>

    <div class="section section--darker">
        <div class="section__title">
            What customers are saying about Deliver My Ride
        </div>

        <div class="triplet-container">
            <div class="triplet">
                <div class="triplet__title">
                    Simple
                </div>

                <div class="triplet__description">
                    "This was the first car that I bought on my own and it was really easy. I never talked to the dealer and had my new Jeep dropped off at my office during lunch. They even bought my trade-in sight unseen."
                </div>

                <div class="triplet__attribution">
                    Lori P., Birmingham, MI
                </div>
            </div>
            <div class="triplet">
                <div class="triplet__title">
                    Timely
                </div>

                <div class="triplet__description">
                    "Shopping for a new car has always taken me a few hours. With to young kids, I don’t have hours to spend at a dealership. This process saved me time and aggravation. Really convenient."
                </div>

                <div class="triplet__attribution">
                    Jason B., Traverse City, MI
                </div>
            </div>
            <div class="triplet">
                <div class="triplet__title">
                    Convenient
                </div>

                <div class="triplet__description">
                    "We knew exactly the color, style and equipment we wanted on a new Explorer.  Instead all of the dealerships to find our car, we used this site for the convenience of having them do all the work."
                </div>

                <div class="triplet__attribution">
                    Julie S., Clarkston, MI
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section__title">
            Deliver My Ride in the media
        </div>
    </div>
@endsection
