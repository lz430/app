import '../../styles/app.scss';
import React, { Component } from 'react';

import { Container } from 'reactstrap';
import Link from 'next/link';

import withTracker from '../../components/withTracker';
import { withRouter } from 'next/router';
import Head from 'next/head';
import { track } from '../../core/services';

class Page extends Component {
    componentDidMount() {
        track('page:brochure-privacy:view');
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Privacy Policy</title>
                </Head>
                <Container className="policy pt-5 pb-5 text-sm">
                    <h1>Privacy Policy</h1>
                    <p className="date">Last Modified January 5, 2017</p>
                    <p>
                        Welcome to the{' '}
                        <strong>
                            Deliver My Ride, LLC (the &#34;Company,&#34;
                            &#34;us,&#34; &#34;we,&#34; or &#34;DMR&#34;)
                            Website
                        </strong>
                        , which includes any other internet properties owned or
                        controlled by the Company (collectively, our &#34;
                        <strong>Website</strong>
                        &#34;)
                    </p>
                    <p>
                        <strong>
                            1. INTRODUCTION AND APPLICATION OF THIS PRIVACY
                            NOTICE
                        </strong>
                    </p>
                    <p>
                        DMR respects your privacy and is committed to protecting
                        it through our compliance with this Privacy Notice (this
                        &#34;
                        <strong>Privacy Notice</strong>
                        &#34; or this &#34;
                        <strong>Notice</strong>
                        &#34;).
                    </p>
                    <p>
                        This Notice describes the types of information we may
                        collect from you or that you may provide when you visit
                        the <strong>Website,</strong> and our practices for
                        collecting, using, maintaining, protecting, and
                        disclosing that information.
                    </p>
                    <p>This Notice applies to information we collect:</p>
                    <ul>
                        <li>On our Website.</li>
                        <li>
                            In email and other electronic messages between you
                            and this Website.
                        </li>
                    </ul>
                    <p>
                        {' '}
                        This Notice does <strong>not</strong> apply to
                        information collected by:
                    </p>
                    <ul>
                        <li>
                            Us offline or through any other means, including on
                            any other website operated by third parties; or
                        </li>
                        <li>
                            Third parties by any means, including through any
                            application, content, or advertising that may link
                            to or be accessible from the Website.
                        </li>
                    </ul>
                    <p>
                        Please read this Notice carefully to understand our
                        policies and practices regarding your information and
                        how we will treat it.
                        <strong>
                            {' '}
                            IF YOU DO NOT AGREE WITH OUR POLICIES AND PRACTICES,
                            DO NOT USE OUR WEBSITE. BY ACCESSING OR USING THIS
                            WEBSITE, YOU AGREE TO THIS PRIVACY NOTICE
                        </strong>
                        . This Privacy Notice is incorporated into the Terms of
                        Use (available at{' '}
                        <Link
                            href="/brochure/terms-of-service"
                            as="/brochure-terms-of-service"
                        >
                            delivermyride.com/terms-of-service
                        </Link>
                        ). This Privacy Notice may change from time to time (see{' '}
                        <i>Changes to our Privacy Notice</i>
                        ).{' '}
                        <strong>
                            Your continued use of this Website after we make
                            such changes is deemed to be acceptance of those
                            changes, so please check the Notice for updates each
                            time you visit the Website
                        </strong>
                        .
                    </p>
                    <p>
                        <i>
                            NOTE TO USERS FROM SWITZERLAND AND THE EUROPEAN
                            UNION:
                        </i>{' '}
                        This Notice and the Terms of Use above are governed by
                        United States law, and we make no representation that
                        the Website is appropriate or available for use in
                        locations outside of the United States. Translations of
                        the Website into languages other than English (if any)
                        are for your convenience only. In the event you visit
                        our Websites from outside the United States, please know
                        that your information may be transferred to, stored, and
                        processed in the United States, where our servers are
                        located and our central database is operated. The data
                        protection and other laws of the United States and other
                        countries might not be as comprehensive as those in your
                        country, but please be assured that we take steps to
                        ensure that your privacy is protected. By using our
                        services, you understand that your information may be
                        transferred to our facilities and those third parties
                        with whom we share it as described in this Notice.
                    </p>
                    <p>
                        <strong>2. CHILDREN UNDER THE AGE OF 13</strong>
                    </p>
                    <p>
                        The Website is not intended or designed to attract
                        children under the age of 13. We do not collect
                        personally identifiable information from any person we
                        actually know or suspect is a child under the age of 13.
                        If you are under the age of 13, do not use or provide
                        any information on the Website or on or through any of
                        its features, or provide any information about yourself
                        to us, including your name, address, telephone number,
                        email address or any screen name or username you may
                        use.
                    </p>
                    <p>
                        If we learn we have collected or received personal
                        information from a child under the age of 13 without
                        verification of parental consent, we will delete that
                        information. If you believe we might have any
                        information from or about a child under the age of 13,
                        please contact us by sending us an email stating your
                        request to support@delivermyride.com or by writing to us
                        at the address provided below.
                    </p>
                    <address>
                        Deliver My Ride, LLC
                        <br />
                        233 Pierce Street
                        <br />
                        Birmingham, MI 48009
                        <br />+<a href="tel:2486860900">1 248.686.0900</a>
                    </address>
                    <p>
                        <strong>
                            By using the Website, you represent and warrant that
                            you meet all of the eligibility requirements set
                            forth in our
                        </strong>{' '}
                        <strong>
                            Terms of Use (available at{' '}
                            <Link
                                href="/brochure/terms-of-service"
                                as="/brochure-terms-of-service"
                            >
                                delivermyride.com/terms-of-service
                            </Link>
                            ). If you do not meet all of such requirements, you
                            must not access or use the Website.
                        </strong>
                    </p>
                    <p>
                        <strong>
                            3. INFORMATION WE COLLECT ABOUT YOU AND HOW WE
                            COLLECT IT
                        </strong>
                    </p>
                    <p>
                        We collect several types of information from and about
                        users of our Website, including information:
                    </p>
                    <ul>
                        <li>
                            By which you may be personally identified, such as
                            first name, last name, email address, or any other
                            identifier by which you may be contacted online or
                            offline (&#34;
                            <strong>Personal Information</strong>
                            &#34;);
                        </li>
                        <li>
                            That is about you or your actions on the Website but
                            individually does not identify you, such as how you
                            arrived at the Website; and
                        </li>
                        <li>
                            About your Internet connection, the equipment you
                            use to access our Website, and usage details.
                        </li>
                    </ul>
                    <p>We collect such information:</p>
                    <ul>
                        <li>Directly from you when you provide it to us;</li>
                        <li>
                            Automatically as you navigate through the Website.
                            Information collected automatically may include
                            usage details, IP addresses and information
                            collected through cookies, web beacons, and other
                            tracking technologies which are discussed below in
                            more detail in Section 5; and
                        </li>
                        <li>
                            From third parties, for example, our business
                            partners.
                        </li>
                    </ul>
                    <p>
                        <strong>4. INFORMATION YOU PROVIDE TO US</strong>
                    </p>
                    <p>
                        The information we collect on or through our Website may
                        include:
                    </p>
                    <ul>
                        <li>
                            Information that you provide by filling in forms on
                            our Website. For example, if you elect to contact us
                            via the &#34;Schedule an Appointment&#34; link on
                            our Website, you will be communicating with us via
                            email. Consequently, we will receive your email
                            address, as well as any other information you elect
                            to populate in the contact form (so please be
                            careful not to send information, personal or
                            otherwise, that you do not wish us to have).
                            Additionally, we may also ask you for information
                            when you report a problem with our Website to us.
                        </li>
                        <li>
                            Information that you provide by registering for an
                            account.
                        </li>
                        <li>
                            Records and copies of your correspondence (including
                            email addresses), if you contact us.
                        </li>
                    </ul>
                    <p>
                        <strong>
                            5. INFORMATION WE COLLECT THROUGH AUTOMATIC DATA
                            COLLECTION TECHNOLOGIES
                        </strong>
                    </p>
                    <p>
                        As you navigate through and interact with our Website,
                        we may use automatic data collection technologies to
                        collect certain information about your equipment,
                        browsing actions and patterns, including:
                    </p>
                    <ul>
                        <li>
                            Details of your visits to our Website, including
                            traffic data, location data, logs, and other
                            communication data and the resources that you access
                            and use on the Website.
                        </li>
                        <li>
                            Information about your computer and Internet
                            connection, including your IP address, operating
                            system, and browser type.
                        </li>
                    </ul>
                    <p>
                        The information we collect automatically is statistical
                        data and does not include Personal Information such as
                        name, address, phone number, email, or other types of
                        information that would identify you personally. It helps
                        us to improve our Website and to deliver a better and
                        more personalized service, including by enabling us to:
                    </p>
                    <ul>
                        <li>Recognize you when you return to our Website.</li>
                        <li>Estimate our audience size and usage patterns.</li>
                    </ul>
                    <p>
                        We do not collect Personal Information automatically –
                        we only obtain it from you if you elect to send it to
                        us.
                    </p>
                    <p>
                        The technologies we use for such automatic data
                        collection may include &#34;cookies&#34; (or browser
                        cookies). A &#34;cookie,&#34; or &#34;browser
                        cookie,&#34; is a small file placed on the hard drive of
                        your computer. You may refuse to accept cookies by
                        activating the appropriate setting on your browser.
                        However, if you select this setting, you may be unable
                        to access certain parts of our Website. Unless you have
                        adjusted your browser setting so that it will refuse
                        cookies, our system will issue cookies when you direct
                        your browser to our Website.
                    </p>
                    <p>
                        <strong>
                            6. THIRD-PARTY USE OF COOKIES AND OTHER TRACKING
                            TECHNOLOGIES
                        </strong>
                    </p>
                    <p>
                        Some content or applications on the Website are served
                        by third parties, including content providers and
                        application providers, including services known as
                        Google Analytics (see below for additional information
                        regarding the Google Analytics service). Such third
                        parties may use cookies alone or in conjunction with
                        other tracking technologies to collect information about
                        you when you use our Website. The information they
                        collect may be associated with your online activities
                        over time and across different websites and other online
                        services.
                    </p>
                    <p>
                        We do not control such third parties&#39; tracking
                        technologies or how they may be used. If you have any
                        questions about the practices of such third party, you
                        should contact the responsible provider directly.
                    </p>
                    <p>
                        <strong>7. ADVERTISEMENTS AND OPTING OUT</strong>
                    </p>
                    <p>
                        We support the right of our visitors to choose. We
                        strive to provide you with choices regarding the
                        personal information you provide to us. We have created
                        the following mechanisms to provide you with the control
                        over your information:
                    </p>
                    <p>
                        <strong>Tracking Technologies</strong>.
                    </p>
                    <ul>
                        <li>
                            Users can opt out of cookies at any time. You can
                            also set your browser to refuse all or some browser
                            cookies, or to alert you when cookies are being
                            sent. The Network Advertising Initiative (&#34;
                            <strong>NAI</strong>
                            &#34;) provides online instructions and information
                            on how to opt out of communications. Users can use
                            their browser settings to decide whether to turn on
                            and off cookies on the Website. If you disable or
                            refuse cookies, please note that some parts of the
                            Website may then be inaccessible or not function
                            properly.
                        </li>
                    </ul>
                    <p>
                        <strong>Research and Analytics.</strong>
                    </p>
                    <ul>
                        <li>
                            <strong>Google Analytics</strong>. We use Google
                            Analytics to better understand how visitors interact
                            with the Website. This service provides anonymous
                            information including but not limited to data on
                            where visitors came from, what actions they took on
                            the Website, and where visitors went when they left
                            the Website. We use this information to improve your
                            experience when visiting the Website. To learn more
                            about this service and how to opt out of data
                            collection by Google Analytics, you can reference
                            Google&#39;s online information regarding privacy
                            and Google Analytics. From time to time, we may also
                            work with other business partners to conduct
                            research surveys in order to improve the user
                            experience on the Website. We encourage you to read
                            the privacy statements of these business partners to
                            learn about their data practices.
                        </li>
                    </ul>
                    <p>
                        <strong>8. HOW WE USE YOUR INFORMATION</strong>
                    </p>
                    <p>
                        We use information that we collect about you or that you
                        provide to us, including any Personal Information you
                        elect to provide:
                    </p>
                    <ul>
                        <li>To present our Website and its contents to you.</li>
                        <li>
                            To provide you with information, or services that
                            you request from us.
                        </li>
                        <li>
                            To fulfill any other purpose for which you provide
                            it.
                        </li>
                        <li>
                            To carry out our obligations and enforce our rights
                            arising from any contracts entered into between you
                            and us.
                        </li>
                        <li>
                            To notify you about changes to our Website or any
                            products or services we offer or provide through it.
                        </li>
                        <li>
                            In any other way we may describe when you provide
                            the information.
                        </li>
                        <li>For any other purpose with your consent.</li>
                    </ul>
                    <p>
                        <strong>9. DISCLOSURE OF YOUR INFORMATION</strong>
                    </p>
                    <p>
                        We may disclose aggregated information about our users,
                        and information that does not identify any individual,
                        without restriction.
                    </p>
                    <p>
                        We may disclose Personal Information that we collect or
                        you provide as described in this Privacy Notice:
                    </p>
                    <ul>
                        <li>
                            To our affiliates, including our parent company.
                        </li>
                        <li>
                            To contractors, service providers, and other third
                            parties we use to support our business and who are
                            bound by contractual obligations to keep Personal
                            Information confidential and use it only for the
                            purposes for which we disclose it to them.
                        </li>
                        <li>
                            To a buyer or other successor in the event of a
                            merger, divestiture, restructuring, reorganization,
                            dissolution or other sale or transfer of some or all
                            of the Company&#39;s assets, whether as a going
                            concern or as part of bankruptcy, liquidation, or
                            similar proceeding, in which Personal Information
                            held by the Company about our Website&#39;s users is
                            among the assets transferred.
                        </li>
                        <li>
                            To fulfill the purpose for which you provide it.
                        </li>
                        <li>
                            For any other purpose disclosed by us when you
                            provide the information.
                        </li>
                        <li>With your consent.</li>
                    </ul>
                    <p>We may also disclose your Personal Information:</p>
                    <ul>
                        <li>
                            To comply with any court order, law, or legal
                            process, including to respond to any government or
                            regulatory request.
                        </li>
                        <li>
                            To enforce or apply our Terms of Use located at{' '}
                            <Link
                                href="/brochure/terms-of-service"
                                as="/brochure-terms-of-service"
                            >
                                delivermyride.com/terms-of-service
                            </Link>{' '}
                            and other agreements.
                        </li>
                        <li>
                            If we believe disclosure is necessary or appropriate
                            to protect the rights, property, or safety of the
                            Company, our customers, or others.
                        </li>
                    </ul>
                    <p>
                        <strong>
                            10. CHOICES ABOUT HOW WE USE AND DISCLOSE YOUR
                            INFORMATION
                        </strong>
                    </p>
                    <p>
                        We strive to provide you with choices regarding the
                        Personal Information you provide to us. We have created
                        mechanisms to provide you with the following control
                        over your information:
                    </p>
                    <ul>
                        <li>
                            <strong>Tracking Technologies.</strong> See Section
                            7 above for information on how to opt out of
                            tracking technologies.
                        </li>
                        <li>
                            <strong>Communications from the Company.</strong> If
                            you supply us with your email address and
                            subsequently do not wish to have your email address
                            and contact information used by the Company to
                            communicate with you about our activities and
                            services, you may send us an email stating your
                            request to{' '}
                            <a href="mailto:support@delivermyride.com">
                                support@delivermyride.com
                            </a>
                            .
                        </li>
                    </ul>
                    <p>
                        We do not control third parties&#39; collection or use
                        of your information. However, these third parties may
                        provide you with ways to choose not to have your
                        information collected or used in this way. You can opt
                        out of receiving targeted ads from members of NAI at
                        NAI&#39;s website, referenced in Section 7 above.
                    </p>
                    <p>
                        <strong>11. EXTERNAL LINKS</strong>
                    </p>
                    <p>
                        We may provide links to various websites that we do not
                        control. When you click on one of these links, you will
                        be transferred out of our Website and connected to the
                        website of the organization that you selected.{' '}
                    </p>
                    <p>
                        We are not responsible for the nature, quality or
                        accuracy of the content or opinions expressed on such
                        websites, and such websites are not investigated,
                        monitored or checked for quality, accuracy or
                        completeness by us.
                    </p>
                    <p>
                        Inclusion of any linked website on our Website does not
                        imply or express an approval or endorsement of the
                        linked website by us, or of any of the content,
                        opinions, products or services provided on these
                        websites. Even if an affiliation exists between our
                        Website and a third-party website, we exercise no
                        control over linked sites.
                    </p>
                    <p>
                        Each of such linked websites maintains its own
                        independent privacy and data collection policies and
                        procedures. While we expect our business partners and
                        affiliates to respect the privacy of our users, we
                        cannot be responsible for the actions of third parties.
                        If you visit a website that is linked to or from our
                        Website, we encourage you to consult that website&#39;s
                        privacy policy before providing any personal information
                        and whenever interacting with any website.
                    </p>
                    <p>
                        <strong>
                            12. ACCESSING AND CORRECTING YOUR INFORMATION
                        </strong>
                    </p>
                    <p>
                        You may also send us an email at{' '}
                        <a href="mailto:support@delivermyride.com">
                            support@delivermyride.com
                        </a>{' '}
                        to request access to, correct or delete any Personal
                        Information that you have provided to us. We may not
                        accommodate a request to change information if we
                        believe the change would violate any law or legal
                        requirement or cause the information to be incorrect.
                    </p>
                    <p>
                        <strong>13. YOUR CALIFORNIA PRIVACY RIGHTS</strong>
                    </p>
                    <p>
                        Under California Civil Code § 1798.83, residents of the
                        State of California that have provided any personally
                        identifiable information to us have the right to request
                        a list of all third parties to which we have disclosed
                        personally identifiable information during the preceding
                        year for direct marketing purposes.
                    </p>
                    <p>
                        Alternatively, the law provides that if we have a
                        privacy notice that gives either an opt-out or opt-in
                        choice for use of personally identifiable information by
                        third parties (such as advertisers or affiliated
                        companies) for marketing purposes, we may instead
                        provide you with information on how to exercise your
                        disclosure choice options. In compliance with the second
                        alternative, we have established this Website Privacy
                        Notice that provides you with details on how you may
                        either opt out or opt-in to the use of your personally
                        identifiable information by third parties for direct
                        marketing purposes.
                    </p>
                    <p>
                        Additionally, CalOPPA requires us to disclose how we
                        respond to &#34;do-not-track&#34; requests from our
                        users. At this time, we do not currently respond to
                        &#34;do-not-track&#34; requests from our users&#39;
                        browsers.
                    </p>
                    <p>
                        <strong>14. DATA SECURITY</strong>
                    </p>
                    <p>
                        We have implemented measures designed to secure your
                        Personal Information from accidental loss and from
                        unauthorized access, use, alteration, and disclosure.
                        All information you provide to us is stored on our
                        secure servers behind firewalls. Any administrative
                        pages will be encrypted using SSL technology.
                        Furthermore, we strive to only store information that is
                        necessary, and only for so long as such information is
                        necessary.{' '}
                    </p>
                    <p>
                        Unfortunately, the transmission of information via the
                        Internet is not completely secure. Although we strive to
                        protect your Personal Information, we cannot guarantee
                        the security of your Personal Information transmitted to
                        our Website. Any transmission of Personal Information is
                        at your own risk. We are not responsible for
                        circumvention of any privacy settings or security
                        measures contained on the Website.
                    </p>
                    <p>
                        <strong>15. CHANGES TO OUR PRIVACY NOTICE</strong>
                    </p>
                    <p>
                        It is our policy to post any changes we make to our
                        Privacy Notice on this page with a notice that the
                        Privacy Notice has been updated on the Website home
                        page. If we make material changes to how we treat our
                        users&#39; Personal Information, we will notify you
                        through a notice on the Website&#39;s home page. The
                        date the Privacy Notice was last revised appears at the
                        beginning of this Notice. You are responsible for
                        ensuring we have an up-to-date active and deliverable
                        email address for you, and for visiting our Website and
                        this Privacy Notice to check for any changes.
                    </p>
                    <p>
                        <strong>16. CONTACT INFORMATION</strong>
                    </p>
                    <p>
                        To ask questions or comment about this Privacy Notice
                        and our privacy practices, contact us at{' '}
                        <a href="mailto:support@delivermyride.com">
                            support@delivermyride.com
                        </a>
                        .
                    </p>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(withTracker(Page));
