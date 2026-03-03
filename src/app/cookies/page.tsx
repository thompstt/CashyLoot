import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-display tracking-tight">Cookie Policy</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none prose-invert">
          <h2 className="text-xl font-semibold mt-6 mb-3">
            1. Introduction
          </h2>
          <p>
            Cookies are small text files that are stored on your device (computer,
            tablet, or mobile phone) when you visit a website. They are widely used
            to make websites work more efficiently, provide a better user
            experience, and give website owners useful information.
          </p>
          <p>
            CashyLoot LLC (&quot;CashyLoot,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;) uses cookies to operate and improve our website.
            This Cookie Policy explains what cookies we use, why we use them, and
            the choices you have regarding their use.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            2. Types of Cookies We Use
          </h2>
          <p>
            We categorize the cookies used on our website into the following types:
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Strictly Necessary Cookies
          </h3>
          <p>
            These cookies are required for the website to function properly and
            cannot be disabled. They enable core functionality such as
            authentication, security (CSRF protection), and storing your cookie
            consent preference. Without these cookies, essential features of the
            website would not work.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Functionality Cookies
          </h3>
          <p>
            Functionality cookies remember your preferences and settings to provide
            you with an enhanced and more personalized experience. For example,
            they may remember your display preferences or other choices you have
            made on the site.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Analytics Cookies
          </h3>
          <p>
            Analytics cookies help us understand how visitors interact with our
            website by collecting and reporting information about usage patterns.
            We do not currently use analytics cookies, but we may add them in the
            future. If we do, we will update this Cookie Policy and provide notice
            before activating them.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            3. Cookie Table
          </h2>
          <p>
            The following table lists the specific cookies used on our website:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border-b border-border px-4 py-2 text-left">
                    Cookie Name
                  </th>
                  <th className="border-b border-border px-4 py-2 text-left">
                    Purpose
                  </th>
                  <th className="border-b border-border px-4 py-2 text-left">
                    Type
                  </th>
                  <th className="border-b border-border px-4 py-2 text-left">
                    Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border px-4 py-2">
                    <code>better-auth.session_token</code>
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Maintains your authenticated session
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Strictly Necessary
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Session / 30 days
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-2">
                    <code>cookie-consent</code>
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Stores your cookie consent preference
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Strictly Necessary
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    1 year
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-border px-4 py-2">
                    <code>cf_clearance</code>
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Cloudflare Turnstile verification (when active)
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    Strictly Necessary
                  </td>
                  <td className="border-b border-border px-4 py-2">
                    30 minutes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            4. Third-Party Cookies
          </h2>
          <p>
            When you interact with offers through our offerwall providers, their
            content loads in embedded frames (iframes) on our website. These
            providers may set their own cookies according to their own privacy
            policies. We do not control these third-party cookies.
          </p>
          <p>
            Our offerwall providers include:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>AdGem</strong> &mdash; Please review AdGem&apos;s Privacy
              Policy for details on their cookie practices.
            </li>
            <li>
              <strong>Lootably</strong> &mdash; Please review Lootably&apos;s
              Privacy Policy for details on their cookie practices.
            </li>
            <li>
              <strong>BitLabs</strong> &mdash; Please review BitLabs&apos;
              Privacy Policy for details on their cookie practices.
            </li>
          </ul>
          <p className="mt-2">
            We encourage you to review the privacy policies of these third-party
            providers to understand how they use cookies and handle your
            information.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            5. Your Cookie Choices
          </h2>
          <p>
            You have several options for managing cookies:
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Cookie Banner
          </h3>
          <p>
            When you first visit CashyLoot, you will be presented with a cookie
            banner that allows you to accept or decline non-essential cookies. You
            can change your preference at any time by clearing your cookies and
            revisiting the site.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Browser Settings
          </h3>
          <p>
            Most web browsers allow you to view, manage, and delete cookies
            through their settings. The exact steps vary by browser, but you can
            typically find cookie controls in your browser&apos;s Privacy or
            Security settings. Below is general guidance for popular browsers:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Google Chrome</strong>: Settings &gt; Privacy and Security
              &gt; Cookies and other site data
            </li>
            <li>
              <strong>Mozilla Firefox</strong>: Settings &gt; Privacy &amp;
              Security &gt; Cookies and Site Data
            </li>
            <li>
              <strong>Safari</strong>: Preferences &gt; Privacy &gt; Manage
              Website Data
            </li>
            <li>
              <strong>Microsoft Edge</strong>: Settings &gt; Cookies and site
              permissions &gt; Manage and delete cookies and site data
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Important Note
          </h3>
          <p>
            Disabling strictly necessary cookies may prevent you from using
            certain features of the website, including logging in to your account.
            We recommend keeping strictly necessary cookies enabled to ensure the
            website functions correctly.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            6. Changes to This Cookie Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time as our website
            evolves or as regulations change. When we make changes, the
            &quot;Last updated&quot; date at the top of this page will be revised
            to reflect the most recent version. We encourage you to review this
            Cookie Policy periodically to stay informed about how we use cookies.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this Cookie Policy or our use of
            cookies, please contact us at:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              General support:{" "}
              <a
                href="mailto:support@cashyloot.com"
                className="text-primary hover:underline"
              >
                support@cashyloot.com
              </a>
            </li>
            <li>
              Privacy inquiries:{" "}
              <a
                href="mailto:privacy@cashyloot.com"
                className="text-primary hover:underline"
              >
                privacy@cashyloot.com
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
