import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-display tracking-tight">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none prose-invert">

          {/* 1. Introduction */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            1. Introduction
          </h2>
          <p>
            CashyLoot LLC (&quot;CashyLoot&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates
            cashyloot.com (the &quot;Website&quot;). This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit
            our Website and use our services (collectively, the &quot;Services&quot;). By
            using the Website, you agree to the collection and use of information
            in accordance with this policy. If you do not agree, please do not
            use the Website.
          </p>
          <p>
            This Privacy Policy does not apply to third-party websites, services,
            or applications that may be linked from our Website. We encourage you
            to review the privacy policies of any third-party sites you visit.
          </p>

          {/* 2. Children Under 18 */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            2. Children Under 18
          </h2>
          <p>
            CashyLoot is not intended for anyone under the age of 18. We do not
            knowingly collect personal information from children under 18. In
            compliance with the Children&apos;s Online Privacy Protection Act
            (COPPA), if we discover that we have collected information from a
            child under 18, we will delete that information promptly. If you
            believe a child under 18 has provided us with personal information,
            please contact us immediately at{" "}
            <a href="mailto:privacy@cashyloot.com" className="text-primary underline">
              privacy@cashyloot.com
            </a>.
          </p>

          {/* 3. Information We Collect */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            3. Information We Collect
          </h2>

          <h3 className="text-lg font-medium mt-4 mb-2">
            (a) Information You Provide
          </h3>
          <p>
            We collect information that you voluntarily provide when you register
            for an account, use our Services, or communicate with us. This
            includes:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Date of birth</li>
            <li>Password (stored in hashed form; we never store plaintext passwords)</li>
            <li>PayPal email address for withdrawal processing</li>
            <li>Government-issued identification documents (for identity verification)</li>
            <li>W-9/tax information, including Social Security Number (SSN) or Taxpayer Identification Number (TIN), when required by law</li>
            <li>Referral program data (referral links generated, referred users)</li>
            <li>Support communications (messages, attachments, and metadata from customer support interactions)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            (b) Automatic Data Collection
          </h3>
          <p>
            When you access or use the Website, we automatically collect certain
            information, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Device type</li>
            <li>Unique device identifiers</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring and exit pages</li>
            <li>Clickstream data</li>
            <li>Cookies and similar technologies (see Section 5: Cookies and Tracking Technologies)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            (c) Third-Party Data
          </h3>
          <p>
            We receive information from third-party services integrated with our
            platform, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Offer completion and conversion data from our offerwall providers (AdGem, Lootably, BitLabs)</li>
            <li>Payment processing data from Tremendous and PayPal</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            (d) Mystery Vault Data
          </h3>
          <p>
            When you use our Mystery Vault feature, we collect:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Vault tier selected</li>
            <li>Points spent</li>
            <li>Prize awarded</li>
            <li>Timestamp of each vault opening</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            (e) Referral Program Data
          </h3>
          <p>
            When you participate in our Referral Program, we collect:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Referral link clicks</li>
            <li>Referred user signup status</li>
            <li>Commission calculations</li>
            <li>Referral tier progression</li>
          </ul>

          {/* 4. How We Use Your Information */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            4. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Provide, operate, and maintain our rewards platform</li>
            <li>Process your points earnings and withdrawal requests</li>
            <li>Verify your identity and prevent fraud</li>
            <li>Administer the referral program and calculate commissions</li>
            <li>Track and attribute offer completions from offerwall providers</li>
            <li>Send transactional emails (account verification, payout confirmations, security alerts)</li>
            <li>Comply with legal obligations (tax reporting, law enforcement requests)</li>
            <li>Analyze vault opening patterns for platform analytics and fraud detection</li>
            <li>Improve website functionality and user experience</li>
            <li>Display relevant offers and content</li>
            <li>Enforce our Terms of Service</li>
            <li>Respond to customer support inquiries</li>
          </ul>
          <p>
            We may use your information to contact you about our Services. You
            can opt out of non-transactional communications at any time by
            following the unsubscribe instructions included in those
            communications or by contacting us directly.
          </p>

          {/* 5. Cookies and Tracking Technologies */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            5. Cookies and Tracking Technologies
          </h2>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They are widely used to make websites work more
            efficiently and to provide information to site operators. We use
            cookies and similar tracking technologies to operate and improve our
            Website.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Types of Cookies We Use
          </h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Strictly Necessary Cookies:</strong> These cookies are
              essential for the Website to function properly. They include
              authentication session tokens
              (<code>better-auth.session_token</code>), CSRF protection tokens,
              and your cookie consent preference (<code>cookie-consent</code>).
              These cookies cannot be disabled.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> These cookies allow us to
              remember your preferences, such as locale settings and UI
              preferences, to provide a more personalized experience.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> We may add analytics cookies in
              the future to understand usage patterns and improve the Website.
              If implemented, these cookies will be subject to your consent
              preferences.
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Other Tracking Technologies
          </h3>
          <p>
            In addition to cookies, we may use web beacons (clear GIFs/pixel
            tags), local storage, and similar technologies to collect and store
            information about your interactions with the Website.
          </p>
          <p>
            Offerwall provider iframes embedded on our Website may set their own
            cookies, which are subject to their respective privacy policies.
            CashyLoot does not control these third-party cookies.
          </p>
          <p>
            For more details about the specific cookies we use, please see our{" "}
            <a href="/cookies" className="text-primary underline">
              Cookie Policy
            </a>.
          </p>
          <p>
            You can manage your cookie preferences through your browser settings.
            Most browsers allow you to refuse or delete cookies. Please note that
            disabling strictly necessary cookies may affect the functionality of
            the Website.
          </p>

          {/* 6. Third-Party Services */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            6. Third-Party Services
          </h2>
          <p>
            Our platform integrates with the following third-party services. Each
            provider receives only the information necessary to perform its
            function:
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Offerwall Providers</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>AdGem:</strong> Receives offer completion data,
              click/conversion tracking for reward attribution, and
              device/browser information for fraud prevention.
            </li>
            <li>
              <strong>Lootably:</strong> Receives offer completion data,
              click/conversion tracking for reward attribution, and
              device/browser information for fraud prevention.
            </li>
            <li>
              <strong>BitLabs:</strong> Receives offer completion data,
              click/conversion tracking for reward attribution, and
              device/browser information for fraud prevention.
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">Payment Processors</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Tremendous:</strong> Processes gift card payouts. Receives
              your name, email address, reward amount, and gift card selection.
            </li>
            <li>
              <strong>PayPal:</strong> Processes cash payouts. Receives your
              PayPal email address and payout amount.
            </li>
          </ul>

          <p>
            We share limited technical information (IP address, device
            fingerprint, click timestamps) with offerwall providers solely for
            the purposes of offer attribution and fraud prevention.
          </p>
          <p>
            Each third-party provider has their own privacy policy governing
            their use of your data. We encourage you to review those policies
            before interacting with their services through our platform.
          </p>

          {/* 7. Disclosure of Your Information */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            7. Disclosure of Your Information
          </h2>
          <p>
            We may disclose your personal information in the following
            circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>(a) Service Providers:</strong> To service providers and
              contractors who perform services on our behalf, bound by
              contractual obligations to keep your information confidential and
              use it only for the purposes for which we disclose it to them.
            </li>
            <li>
              <strong>(b) Legal Obligations:</strong> To comply with applicable
              laws, regulations, legal processes, court orders, or enforceable
              government requests.
            </li>
            <li>
              <strong>(c) Enforcement:</strong> To enforce our Terms of Service
              and other agreements, including investigation of potential
              violations.
            </li>
            <li>
              <strong>(d) Protection:</strong> To protect the rights, property,
              or safety of CashyLoot, our users, or the public as required or
              permitted by law.
            </li>
            <li>
              <strong>(e) Business Transfers:</strong> In connection with a
              merger, acquisition, reorganization, or sale of all or a portion of
              our assets. In such an event, we will provide notice before your
              personal information is transferred and becomes subject to a
              different privacy policy.
            </li>
            <li>
              <strong>(f) Offerwall Attribution:</strong> Limited
              click/transaction data shared with offerwall providers solely for
              reward validation and fraud prevention purposes.
            </li>
          </ul>
          <p>
            We do not sell your personal information for monetary consideration.
          </p>

          {/* 8. Your Rights */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            8. Your Rights
          </h2>
          <p>
            All users of CashyLoot have the following rights regarding their
            personal information:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Access the personal information we hold about you</li>
            <li>Correct or update inaccurate or incomplete personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Request a copy of the data we hold about you in a portable format</li>
            <li>Opt out of marketing and non-transactional communications</li>
            <li>Close your account</li>
          </ul>
          <p>
            To exercise any of these rights, please email us at{" "}
            <a href="mailto:privacy@cashyloot.com" className="text-primary underline">
              privacy@cashyloot.com
            </a>{" "}
            with &quot;Privacy Rights Request&quot; in the subject line. We will verify
            your identity before processing any request. We will respond to
            verified requests within 45 calendar days.
          </p>

          {/* 9. California Privacy Rights (CCPA/CPRA) */}
          <h2 id="ccpa" className="text-xl font-semibold mt-6 mb-3">
            9. California Privacy Rights (CCPA/CPRA)
          </h2>
          <p>
            If you are a California resident, you have additional rights under
            the California Consumer Privacy Act (CCPA), as amended by the
            California Privacy Rights Act (CPRA):
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Right to Know:</strong> You have the right to request that
              we disclose the categories and specific pieces of personal
              information we have collected about you.
            </li>
            <li>
              <strong>Right to Delete:</strong> You have the right to request
              deletion of your personal information, subject to certain
              exceptions (legal obligations, tax record retention, fraud
              prevention, and completing pending transactions).
            </li>
            <li>
              <strong>Right to Correct:</strong> You have the right to request
              correction of inaccurate personal information we maintain about
              you.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You have the right to
              receive your personal data in a structured, commonly used, and
              machine-readable format.
            </li>
            <li>
              <strong>Right to Opt-Out of Sale:</strong> We do not sell personal
              information, so no opt-out is necessary. However, you may still
              submit a request if you have concerns.
            </li>
            <li>
              <strong>Right to Limit Use of Sensitive Personal Information:</strong>{" "}
              You have the right to limit how we use sensitive personal
              information (such as SSN/TIN) to only those uses necessary to
              provide the Services.
            </li>
            <li>
              <strong>Right to Non-Discrimination:</strong> We will not
              discriminate against you for exercising any of your CCPA/CPRA
              rights. We will not deny you services, charge different prices, or
              provide a different level of service because you exercised your
              privacy rights.
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Categories of Personal Information Collected
          </h3>
          <p>
            In the preceding 12 months, we have collected the following
            categories of personal information:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Identifiers:</strong> Name, email address, IP address,
              unique device identifiers
            </li>
            <li>
              <strong>Personal Information (Cal. Civ. Code 1798.80):</strong>{" "}
              Date of birth, payment information (PayPal email)
            </li>
            <li>
              <strong>Internet or Network Activity:</strong> Browsing history,
              pages visited, clickstream data, usage data
            </li>
            <li>
              <strong>Geolocation Data:</strong> Approximate location derived
              from IP address
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Business Purpose for Collection
          </h3>
          <p>
            We collect this information for the following business purposes:
            providing and maintaining our Services, processing rewards and
            payouts, identity verification and fraud prevention, and tax
            compliance.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Response Timing
          </h3>
          <p>
            We will acknowledge your request within 10 business days of receipt.
            We will provide a substantive response within 45 calendar days. If we
            need additional time, we may extend this period by up to 45
            additional calendar days, and we will notify you of the extension and
            the reason for it.
          </p>
          <p>
            Authorized agents may submit requests on your behalf with your
            written permission. We may require you to verify your identity
            directly with us even when an authorized agent submits a request.
          </p>

          {/* 10. Other State Privacy Rights */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            10. Other State Privacy Rights
          </h2>
          <p>
            Residents of certain other US states have additional privacy rights
            under their respective state laws, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Colorado Privacy Act (CPA)</li>
            <li>Connecticut Data Privacy Act (CTDPA)</li>
            <li>Virginia Consumer Data Protection Act (VCDPA)</li>
            <li>Utah Consumer Privacy Act (UCPA)</li>
          </ul>
          <p>
            If you are a resident of one of these states, you may have the right
            to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Confirm whether we are processing your personal data</li>
            <li>Access your personal data</li>
            <li>Delete your personal data</li>
            <li>Obtain a copy of your personal data in a portable format (data portability)</li>
            <li>Opt out of targeted advertising</li>
          </ul>
          <p>
            To exercise any of these rights, please email us at{" "}
            <a href="mailto:privacy@cashyloot.com" className="text-primary underline">
              privacy@cashyloot.com
            </a>.
            We will respond within the timeframes required by applicable law.
          </p>

          {/* 11. Do Not Sell or Share My Personal Information */}
          <h2 id="do-not-sell" className="text-xl font-semibold mt-6 mb-3">
            11. Do Not Sell or Share My Personal Information
          </h2>
          <p>
            We do not sell your personal information for monetary consideration.
            We do not share your personal information for cross-context
            behavioral advertising.
          </p>
          <p>
            If you wish to exercise your right to opt out, you may contact us at{" "}
            <a href="mailto:privacy@cashyloot.com" className="text-primary underline">
              privacy@cashyloot.com
            </a>{" "}
            or use the &quot;Do Not Sell My Info&quot; link in our website footer.
          </p>
          <p>
            Once you opt out, we will not ask you to re-authorize the sale or
            sharing of your personal information for at least 12 months.
          </p>

          {/* 12. Data Security */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            12. Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational security
            measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Encryption in transit using Transport Layer Security (TLS)</li>
            <li>Encrypted storage for sensitive data (passwords, SSN/TIN)</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security assessments and vulnerability testing</li>
            <li>Employee training on data protection best practices</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or method of
            electronic storage is 100% secure. While we strive to protect your
            personal information, we cannot guarantee its absolute security.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials, including your password. Please notify us
            immediately if you believe your account has been compromised.
          </p>

          {/* 13. Data Retention */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            13. Data Retention
          </h2>
          <p>
            We retain your personal information for as long as necessary to
            fulfill the purposes described in this Privacy Policy, unless a
            longer retention period is required or permitted by law. Specific
            retention periods are as follows:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Account data:</strong> Retained while your account is
              active, plus 3 years after account closure for legal and tax
              compliance purposes.
            </li>
            <li>
              <strong>Transaction and payout logs:</strong> 7 years, in
              accordance with tax compliance requirements.
            </li>
            <li>
              <strong>Postback/offer completion logs:</strong> 2 years.
            </li>
            <li>
              <strong>Vault opening data:</strong> Retained with transaction data
              for 7 years.
            </li>
            <li>
              <strong>Referral data:</strong> Retained while the referral program
              is active, plus 3 years after the program ends or your
              participation ceases.
            </li>
            <li>
              <strong>Identity verification documents:</strong> Deleted within 90
              days of successful verification.
            </li>
            <li>
              <strong>Cookie consent preferences:</strong> 1 year.
            </li>
          </ul>
          <p>
            After the applicable retention periods expire, your data is securely
            deleted or anonymized so that it can no longer be associated with
            you.
          </p>

          {/* 14. International Transfers */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            14. International Transfers
          </h2>
          <p>
            Your information is processed and stored in the United States via
            Amazon Web Services (AWS). If you access our Website from outside the
            United States, please be aware that your information will be
            transferred to, stored in, and processed in the United States, where
            data protection laws may differ from those in your country of
            residence.
          </p>
          <p>
            By using the Website, you consent to the transfer of your information
            to the United States and the processing of your information in
            accordance with this Privacy Policy.
          </p>

          {/* 15. Changes to This Privacy Policy */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            15. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, legal requirements, or other
            factors. When we make changes, we will post the updated Privacy
            Policy on this page and update the &quot;Last updated&quot; date at the top of
            this policy.
          </p>
          <p>
            For material changes that significantly affect how we handle your
            personal information, we will notify you by email at the address
            associated with your account prior to the changes taking effect.
          </p>
          <p>
            Your continued use of the Website after the posting of changes
            constitutes your acceptance of the updated Privacy Policy. If you do
            not agree to the changes, you should discontinue use of the Website.
          </p>

          {/* 16. Contact Us */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            16. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or wish to
            exercise your privacy rights, please contact us:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Privacy inquiries:</strong>{" "}
              <a href="mailto:privacy@cashyloot.com" className="text-primary underline">
                privacy@cashyloot.com
              </a>
            </li>
            <li>
              <strong>General support:</strong>{" "}
              <a href="mailto:support@cashyloot.com" className="text-primary underline">
                support@cashyloot.com
              </a>
            </li>
          </ul>
          <p>
            Please include &quot;Privacy&quot; in the subject line for fastest routing to
            our privacy team.
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
