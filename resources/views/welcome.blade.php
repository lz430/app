@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="section">
        <div class="welcome__top"></div>
        <div class="section__title">
            Your New Ride Awaits
        </div>
        <div class="section__title section__title--small">
            We put the dealership’s inventory at your fingertips
            <br>
            while keeping the dealer under your thumb.
        </div>
    </div>

    <div class="welcome__select-a-vehicle-type section section--darkest section--no-padding">
        <div class="welcome__select-a-vehicle-type-title">
            Select a vehicle style
        </div>

        <div class="welcome-style-selector">
            <div class="welcome-style-selector__constrained">
                @foreach ($styles as $style)
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
                <!-- background -->
            </div>
        </div>
    </div>

    <div class="section section--no-padding welcome__average-customer">
        <div class="welcome__average-customer-bg">
            <!-- background -->
        </div>
        <div class="welcome__average-customer-title">
            Our average customer saves 15.7% / $3,800 off MSRP.
        </div>
    </div>

    <div class="section section--darker">
        <div class="section__constrained">
            <div class="section__title section__title--left section__title--underline section__title--medium">
                What customers are saying about Deliver My Ride
            </div>

            <div class="triplets">
                <div class="triplets__triplet">
                    <div class="triplets__title">
                    </div>

                    <div class="triplets__description">
                        "This was the first car that I bought on my own and it was really easy. I never talked to the dealer and had my new Jeep dropped off at my office during lunch. They even bought my trade-in sight unseen."
                    </div>

                    <div class="triplets__attribution">
                        <span class="triplets__attribution-name">Lori P.</span>, Birmingham, MI
                    </div>
                </div>
                <div class="triplets__triplet">
                    <div class="triplets__title">
                    </div>

                    <div class="triplets__description">
                        "Shopping for a new car has always taken me a few hours. With to young kids, I don’t have hours to spend at a dealership. This process saved me time and aggravation. Really convenient."
                    </div>

                    <div class="triplets__attribution">
                        <span class="triplets__attribution-name">Jason B.</span>, Traverse City, MI
                    </div>
                </div>
                <div class="triplets__triplet">
                    <div class="triplets__title">
                    </div>

                    <div class="triplets__description">
                        "We knew exactly the color, style and equipment we wanted on a new Explorer.  Instead all of the dealerships to find our car, we used this site for the convenience of having them do all the work."
                    </div>

                    <div class="triplets__attribution">
                        <span class="triplets__attribution-name">Julie S.</span>, Clarkston, MI
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
