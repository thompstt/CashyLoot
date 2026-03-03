import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-display tracking-tight">Privacy Policy</CardTitle>
            <Badge variant="secondary">Placeholder</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none prose-invert">
          <p className="text-muted-foreground italic">
            This is placeholder text. Replace with your actual Privacy Policy
            generated from Termly or TermsFeed before launching.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, including your name,
            email address, date of birth, and payment information (PayPal email)
            when you create an account and use our services. We also
            automatically collect certain technical information such as IP
            address, browser type, device information, and usage data.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Provide and maintain our rewards platform</li>
            <li>Process your points earnings and withdrawals</li>
            <li>Verify your identity and prevent fraud</li>
            <li>
              Send transactional emails (account verification, payout
              notifications)
            </li>
            <li>Comply with legal obligations (tax reporting)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">3. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management.
            We may also use analytics cookies to understand how users interact
            with our site. You can manage your cookie preferences through your
            browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            4. Third-Party Services
          </h2>
          <p>
            Our platform integrates with third-party offerwall providers (AdGem,
            Lootably, BitLabs) and payment processors (Tremendous, PayPal).
            These services have their own privacy policies. When you interact
            with offers from these providers, their privacy policies may also
            apply.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. California residents have additional rights under the
            CCPA, including the right to opt out of the sale or sharing of
            personal information.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            6. Do Not Sell or Share My Personal Information
          </h2>
          <p>
            We do not sell your personal information. To exercise your right to
            opt out of any sharing of personal information, please contact us at
            the email address below.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at: privacy@cashyloot.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
