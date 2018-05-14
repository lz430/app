<footer class="page-footer">
    {{--
    <div class="footer-icons">
        <div class="footer__icon">
            <a target="_blank" href="https://www.facebook.com/DeliverMyRide/">
                <img src="/images/social/facebook.svg" title="Facebook" alt="Facebook">
            </a>
        </div>
        <div class="footer__icon">
            <a target="_blank" href="https://twitter.com/delivermyride1">
                <img src="/images/social/twitter.svg" title="Twitter" alt="Twitter">
            </a>
        </div>
        <div class="footer__icon">
            <a target="_blank" href="https://www.instagram.com/delivermyride/">
                <img src="/images/social/instagram.svg" title="Instagram" alt="Instagram">
            </a>
        </div>
        <div class="footer__icon">
            <a target="_blank" href="https://www.youtube.com/channel/UCOtyW2G9P_UixoVEfV5mVOA">
                <img src="/images/social/youtube.svg" title="Youtube" alt="Youtube">
            </a>
        </div>
    </div>
    <div class="footer-links">
        <a href="{{ marketing_url('about/') }}">About Us</a>
        <a href="{{ marketing_url('faq/') }}">FAQ</a>
        <a href="{{ marketing_url('blog/') }}">Blog</a>
    </div>
    <form>
        <div class="footer-signup">
            <div class="footer-signup__title">Get Updates</div>
            <input class="footer-signup__email" placeholder="Enter your email address...">
            <input class="footer-signup__submit" type="submit" value="Submit">
        </div>
    </form>
    --}}
    <div class="footer-meta">
        <a href="{{ marketing_url('contact/') }}">Contact</a> |
        <a href="{{ marketing_url('terms-of-service/') }}">Terms</a> |
        <a href="{{ marketing_url('privacy-policy/') }}">Privacy</a> |
        &copy; {{ date('Y') }} Deliver My Ride. <span class="footer-meta--desktop">All Rights Reserved. |
        Headquarters: 35 W Huron Street, Suite 1000, Pontiac, MI 48342  |
        Phone: 248.590.0360</span>
    </div>
</footer>
