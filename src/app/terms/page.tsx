import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-display tracking-tight">Terms of Service</CardTitle>
            <Badge variant="secondary">Placeholder</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none prose-invert">
          <p className="text-muted-foreground italic">
            This is placeholder text. Replace with your actual Terms of Service
            generated from Termly or TermsFeed before launching.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">1. Eligibility</h2>
          <p>
            You must be at least 18 years of age to use CashyLoot. By creating
            an account, you represent and warrant that you are at least 18 years
            old. We reserve the right to verify your age and may terminate
            accounts that do not meet this requirement.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            2. Account Rules
          </h2>
          <p>
            You may only create one account per person. Multiple accounts,
            shared accounts, and accounts created with false information are
            prohibited. You are responsible for maintaining the confidentiality
            of your account credentials.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            3. Points &amp; Rewards
          </h2>
          <p>
            Points are earned by completing offers from our partner networks.
            100 points equals $1.00 USD. Points are non-transferable between
            users and have no cash value until redeemed through our withdrawal
            system. We reserve the right to adjust point values or reverse
            fraudulently earned points.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            4. Withdrawals
          </h2>
          <p>
            You may withdraw your earned points as gift cards (minimum $1.00) or
            PayPal cash (minimum $5.00). Withdrawals are processed within 1-3
            business days. We may require identity verification (W-9) for
            payouts exceeding certain thresholds as required by law.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            5. Prohibited Conduct
          </h2>
          <p>The following activities are strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Using VPNs, proxies, or other tools to mask your location</li>
            <li>Creating multiple accounts</li>
            <li>Using automated tools or bots to complete offers</li>
            <li>Fraudulently completing or misrepresenting offer completions</li>
            <li>Sharing or selling your account</li>
            <li>Exploiting bugs or glitches in the platform</li>
          </ul>
          <p className="mt-2">
            Violation of these rules may result in account suspension, point
            forfeiture, and permanent ban.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            6. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate your account at any
            time for violation of these terms or for any other reason at our
            discretion. Upon termination, any unredeemed points may be
            forfeited.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            7. Limitation of Liability
          </h2>
          <p>
            CashyLoot is provided &quot;as is&quot; without warranties of any
            kind. We are not liable for any indirect, incidental, or
            consequential damages arising from your use of the platform. Our
            total liability shall not exceed the amount of points you have
            earned in the preceding 12 months.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact
            us at: support@cashyloot.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
