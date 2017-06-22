<div class="compare-deal">
    <div class="compare-deal__basic-info">
        {{ $deal->year }} {{ $deal->make }}
        <br />
        {{ $deal->series }} {{ $deal->model }}
        <br />
        {{ $deal->price }}
    </div>
    <img class="compare-deal__image" src="{{ $deal->photos->first()->url }}"/>

    <div class="compare-deal__buttons">
        <button class="compare-deal__button compare-deal__button--small compare-deal__button--blue compare-deal__button">
            Buy Now
        </button>
        <a href="{{ $withoutDeal($deal->id) }}" class="compare-deal__button compare-deal__button--small compare-deal__button--blue compare-deal__button">
            Remove
        </a>
    </div>


    <div class="compare-deal__incentives">
        <div class="compare-deal__incentives--title">
            Incentives
        </div>

        @foreach ($deal->versions()->first()->taxesAndDiscounts as $incentive)
            <div class="compare-deal__incentive">
                {{ $incentive->name }}
                ${{ $incentive->amount }}
            </div>
        @endforeach

        @foreach ($deal->versions()->first()->incentives as $incentive)
            <div class="compare-deal__incentive">
                {{ $incentive->title }}
                ${{ $incentive->cash }}
            </div>
        @endforeach
    </div>
</div>
