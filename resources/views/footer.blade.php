<footer class="page-footer">
    <div class="footer-icons">
        <div class="footer__icon">
            {!! file_get_contents(resource_path("assets/svg/social/twitter.svg")) !!}
        </div>
        <div class="footer__icon">
            {!! file_get_contents(resource_path("assets/svg/social/facebook.svg")) !!}
        </div>
        <div class="footer__icon">
            {!! file_get_contents(resource_path("assets/svg/social/google-plus.svg")) !!}
        </div>
    </div>
    <div class="footer-links">
        <a href="">Create An Account</a>
        <a href="">How It Works</a>
        <a href="">About Us</a>
        <a href="">FAQ</a>
        <a href="">Join Dealer Network</a>
        <a href="">Blog</a>
    </div>
    <form>
        <div class="footer-signup">
            <div class="footer-signup__title">Get Updates</div>
            <input class="footer-signup__email" placeholder="Enter your email address...">
            <input class="footer-signup__submit" type="submit" value="Submit">
        </div>
    </form>
    <div class="footer-meta">
        <a href="">Contact</a> |
        <a href="">Privacy</a> |
        &copy; {{ date('Y') }} Deliver My Ride. All Rights Reserved.
    </div>
</footer>
