import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-display tracking-tight">
            Terms of Service
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none prose-invert">
          {/* ── 1. Acceptance of Terms ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            Welcome to CashyLoot (&quot;CashyLoot,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;). CashyLoot is a US limited
            liability company. By accessing or using our website located at
            cashyloot.com (the &quot;Website&quot;), you (&quot;you,&quot;
            &quot;your,&quot; or &quot;User&quot;) accept and agree to be bound
            by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy,
            which is incorporated herein by reference. If you do not agree to
            these Terms, you must not access or use the Website.
          </p>
          <p className="mt-2 font-semibold">Table of Contents</p>
          <ol className="list-decimal pl-6 space-y-1 mt-2">
            <li>Acceptance of Terms</li>
            <li>Eligibility</li>
            <li>Changes to Terms</li>
            <li>Account Rules</li>
            <li>Points &amp; Rewards</li>
            <li>Withdrawals</li>
            <li>Identity Verification</li>
            <li>Inactive Accounts</li>
            <li>Rewards Expiration</li>
            <li>Taxes</li>
            <li>Mystery Vaults (Chance-Based Features)</li>
            <li>Referral Program</li>
            <li>Prohibited Conduct</li>
            <li>Intellectual Property</li>
            <li>Termination</li>
            <li>Disclaimer of Warranties</li>
            <li>Limitation of Liability</li>
            <li>Indemnification</li>
            <li>Governing Law &amp; Jurisdiction</li>
            <li>Limitation on Time to File Claims</li>
            <li>Waiver and Severability</li>
            <li>Entire Agreement</li>
          </ol>

          {/* ── 2. Eligibility ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Eligibility</h2>
          <p>
            You must be at least eighteen (18) years of age to use CashyLoot. By
            creating an account, you represent and warrant that you are at least
            18 years old and that you have the legal capacity to enter into
            binding contracts under applicable law. Only one account per person
            and one account per household is permitted. We reserve the right to
            verify your age at any time and may immediately terminate or suspend
            any account that does not meet this eligibility requirement. If we
            determine that you are under 18 years of age, your account will be
            terminated and any accumulated points or pending rewards will be
            forfeited.
          </p>

          {/* ── 3. Changes to Terms ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            3. Changes to Terms
          </h2>
          <p>
            CashyLoot reserves the right to revise, amend, or update these Terms
            at any time and at our sole discretion. Any changes will be effective
            immediately upon posting the revised Terms on the Website, with the
            &quot;Last updated&quot; date revised accordingly. Your continued use
            of the Website after any such changes constitutes your acceptance of
            the new Terms. We encourage you to check this page periodically for
            updates. For material changes that significantly affect your rights
            or obligations, we will make reasonable efforts to notify you by
            email at the address associated with your account.
          </p>

          {/* ── 4. Account Rules ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            4. Account Rules
          </h2>
          <p>
            You may only create one account per person. Multiple accounts,
            shared accounts, and accounts created with false information are
            strictly prohibited. You are responsible for maintaining the
            confidentiality of your account credentials, including your password.
            You agree to notify CashyLoot immediately of any unauthorized use of
            your account or any other breach of security. CashyLoot will not be
            liable for any loss or damage arising from your failure to protect
            your account credentials. You are solely responsible for all
            activities that occur under your account.
          </p>

          {/* ── 5. Points & Rewards ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            5. Points &amp; Rewards
          </h2>
          <p>
            Points are earned by completing offers from our partner networks,
            including but not limited to AdGem, Lootably, and BitLabs. One
            hundred (100) points equals one US dollar ($1.00 USD). Points are
            non-transferable between users and have no monetary value
            whatsoever. Points do not constitute property, currency, or any form
            of stored value. Points have no cash value until redeemed through our
            withdrawal system in accordance with Section 6 of these Terms.
          </p>
          <p className="mt-2">
            We reserve the right to adjust point values, reverse fraudulently
            earned points, or correct any errors in point balances at any time.
            CashyLoot may hold credited points for up to thirty (30) days for
            verification purposes before they become available for withdrawal. We
            reserve the right to change, limit, modify, or discontinue any
            offers and reward amounts at any time without prior notice. CashyLoot
            may change, suspend, or cancel all or a portion of a Rewards Program
            at any time at our sole discretion.
          </p>

          {/* ── 6. Withdrawals ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Withdrawals</h2>
          <p>
            You may withdraw your earned points as gift cards (minimum $1.00
            redemption, fulfilled via Tremendous) or PayPal cash (minimum $5.00
            redemption). Withdrawals are typically processed within one to three
            (1-3) business days, though processing times may vary. All
            redemptions are final and non-refundable once processed.
          </p>
          <p className="mt-2">
            Identity verification is required before your first payout is
            processed (see Section 7). Gift card availability may be limited by
            region and is subject to the terms and conditions of the applicable
            third-party gift card provider. CashyLoot is not responsible for any
            restrictions, limitations, or issues arising from third-party gift
            card terms.
          </p>
          <p className="mt-2">
            We reserve the right to impose daily, weekly, or monthly withdrawal
            limits at any time. Any withdrawal limits in effect will be
            communicated on the Website. CashyLoot reserves the right to delay
            or deny any withdrawal request if we suspect fraud, abuse, or
            violation of these Terms.
          </p>

          {/* ── 7. Identity Verification ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            7. Identity Verification
          </h2>
          <p>
            CashyLoot reserves the right to request identity verification before
            crediting rewards or processing payouts. Acceptable forms of
            identification include a government-issued photo ID such as a
            driver&apos;s license, state-issued identification card, or
            passport. A completed IRS Form W-9 may also be required when you
            reach applicable tax reporting thresholds (see Section 10).
          </p>
          <p className="mt-2">
            If you fail to provide the requested verification documentation
            within thirty (30) days of our request, CashyLoot reserves the right
            to deny pending rewards, suspend or terminate your account, and
            forfeit any accumulated points. All verification data collected will
            be handled in accordance with our Privacy Policy.
          </p>

          {/* ── 8. Inactive Accounts ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            8. Inactive Accounts
          </h2>
          <p>
            If your account remains inactive for a period of one (1) year,
            meaning no login activity, no offer completions, and no withdrawal
            requests during that period, CashyLoot may close your account. We
            will send you an email notice at the address associated with your
            account at least thirty (30) days before any account closure due to
            inactivity. All unredeemed points will expire and be forfeited upon
            account closure. Reactivation of a closed account is at the sole
            discretion of CashyLoot and is not guaranteed.
          </p>

          {/* ── 9. Rewards Expiration ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            9. Rewards Expiration
          </h2>
          <p>
            CashyLoot reserves the right to adopt, modify, or enforce expiration
            rules for past, present, or future rewards at any time. If we
            implement or change expiration rules, we will provide at least thirty
            (30) days&apos; notice via email or a notice posted on the Website
            before the new expiration rules take effect. It is your
            responsibility to redeem your points before any applicable expiration
            date.
          </p>

          {/* ── 10. Taxes ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Taxes</h2>
          <p>
            You are solely responsible for all tax liability arising from rewards
            earned or redeemed through CashyLoot. CashyLoot will issue an IRS
            Form 1099-MISC to any User whose total rewards equal or exceed two
            thousand dollars ($2,000.00) in a calendar year, in accordance with
            the 2026 Online Brokerage and Business Activity (OBBBA) reporting
            threshold.
          </p>
          <p className="mt-2">
            CashyLoot may require you to provide tax information, including but
            not limited to a completed IRS Form W-9, Social Security Number
            (SSN), or Taxpayer Identification Number (TIN), as a condition of
            continued use of the Website and processing of withdrawals. Failure
            to provide requested tax information may result in backup withholding
            on your rewards and/or suspension of your account until the required
            information is provided.
          </p>

          {/* ── 11. Mystery Vaults (Chance-Based Features) ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            11. Mystery Vaults (Chance-Based Features)
          </h2>
          <p>
            CashyLoot offers &quot;Mystery Vaults&quot; -- optional,
            chance-based features where Users may spend earned points for
            randomized prize outcomes. Mystery Vaults are available in three
            tiers:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Bronze Vault:</strong> 100 points per attempt
            </li>
            <li>
              <strong>Silver Vault:</strong> 300 points per attempt
            </li>
            <li>
              <strong>Gold Vault:</strong> 500 points per attempt
            </li>
          </ul>
          <p className="mt-2">
            Outcomes are determined by weighted random probability. Lower-value
            prizes have a higher probability of occurrence. Points spent on
            Mystery Vaults are non-refundable regardless of the outcome. Users
            may receive fewer points than they spend; there is no guaranteed
            return on any vault attempt.
          </p>
          <p className="mt-2">
            All vault results are final. No reversals, re-rolls, or exchanges
            will be provided under any circumstances. CashyLoot may modify vault
            costs, available prizes, probability weights, or discontinue Mystery
            Vaults entirely at any time without prior notice.
          </p>
          <p className="mt-2">
            Mystery Vaults are provided for entertainment purposes only. They do
            not constitute gambling under applicable law as no real money is
            wagered and points have no inherent monetary value. Users must be at
            least 18 years of age to use Mystery Vaults, as covered by the
            general eligibility requirements in Section 2.
          </p>
          <p className="mt-2">
            CashyLoot reserves the right to limit vault usage frequency or the
            total amount any individual User may spend on vaults within a given
            time period. Published odds for each vault tier are available at
            cashyloot.com/vaults or upon written request to
            support@cashyloot.com.
          </p>

          {/* ── 12. Referral Program ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            12. Referral Program
          </h2>
          <p>
            CashyLoot offers a Referral Program that allows eligible Users to
            earn rewards by referring new users to the Website. Participation in
            the Referral Program is subject to the following terms:
          </p>

          <p className="mt-3 font-semibold">Eligibility</p>
          <p>
            To participate in the Referral Program, you must have an active,
            verified CashyLoot account in good standing. Accounts that are
            suspended, under investigation, or otherwise restricted are not
            eligible.
          </p>

          <p className="mt-3 font-semibold">Referral Rewards</p>
          <p>
            Referrers earn a one-time bonus of $0.50 (50 points) for each valid
            referred signup, plus a tiered ongoing commission based on the
            referred user&apos;s earnings:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Starter:</strong> 5% commission (default)
            </li>
            <li>
              <strong>Bronze:</strong> 7% commission (5+ valid referrals)
            </li>
            <li>
              <strong>Silver:</strong> 10% commission (10+ valid referrals)
            </li>
            <li>
              <strong>Gold:</strong> 12% commission (25+ valid referrals)
            </li>
            <li>
              <strong>Diamond:</strong> 15% commission (50+ valid referrals)
            </li>
          </ul>

          <p className="mt-3 font-semibold">Anti-Fraud</p>
          <p>
            Self-referrals, creation of duplicate accounts for the purpose of
            earning referral rewards, and use of VPNs, proxies, or similar tools
            to manipulate referral tracking will result in immediate
            disqualification from the Referral Program and forfeiture of all
            pending and future referral rewards. Referral commissions are subject
            to the same fraud verification hold periods as regular earnings.
          </p>

          <p className="mt-3 font-semibold">Referrer Obligations</p>
          <p>
            You agree to share your referral link ethically and in compliance
            with all applicable laws and regulations. The following activities
            are prohibited:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              Sending unsolicited mass messages, spam emails, or bulk
              communications
            </li>
            <li>
              Making deceptive, misleading, or exaggerated claims about
              CashyLoot or potential earnings
            </li>
            <li>
              Using deceptive incentivization tactics to generate signups
            </li>
            <li>Impersonating CashyLoot or its representatives</li>
            <li>
              Engaging in any behavior that damages or could damage the CashyLoot
              brand or reputation
            </li>
          </ul>
          <p className="mt-2">
            You must comply with all applicable Federal Trade Commission (FTC)
            disclosure guidelines when promoting your referral link, including
            clearly disclosing that you will earn a commission from referrals.
          </p>

          <p className="mt-3 font-semibold">Relationship</p>
          <p>
            Participation in the Referral Program does not create an employment,
            partnership, agency, or joint venture relationship between you and
            CashyLoot. You are an independent participant and have no authority
            to bind CashyLoot in any manner.
          </p>

          <p className="mt-3 font-semibold">Program Modifications</p>
          <p>
            CashyLoot may modify, suspend, or terminate the Referral Program at
            any time at our sole discretion. We reserve the right to revoke any
            pending or future referral rewards for violations of these Terms or
            the Referral Program rules.
          </p>

          {/* ── 13. Prohibited Conduct ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            13. Prohibited Conduct
          </h2>
          <p>
            The following activities are strictly prohibited when using
            CashyLoot:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              Using VPNs, proxies, Tor, or other tools or services to mask,
              spoof, or misrepresent your location
            </li>
            <li>
              Creating multiple accounts, whether directly or through the use of
              different devices, browsers, or identities
            </li>
            <li>
              Using automated tools, bots, macros, scripts, or any other
              automated means to complete offers, interact with the Website, or
              manipulate point balances
            </li>
            <li>
              Using emulator software to simulate mobile devices for the purpose
              of completing mobile offers
            </li>
            <li>
              Using fake SMS services, VOIP numbers, virtual phone numbers, or
              temporary phone numbers for offer verification
            </li>
            <li>
              Fraudulently completing or misrepresenting offer completions,
              including providing false information to offer providers
            </li>
            <li>
              Sharing, selling, trading, or otherwise transferring your account
              or access to your account to any other person
            </li>
            <li>
              Exploiting bugs, glitches, errors, or vulnerabilities in the
              platform, whether known or unknown
            </li>
            <li>
              Impersonating any person, entity, or CashyLoot representative, or
              falsely stating or misrepresenting your affiliation with any
              person or entity
            </li>
            <li>Attempting to harm minors in any way</li>
            <li>
              Interfering with or disrupting the Website, servers, networks, or
              infrastructure connected to the Website
            </li>
            <li>
              Circumventing, disabling, or otherwise interfering with any
              security-related features of the Website
            </li>
          </ul>
          <p className="mt-2">
            Violation of any of these prohibitions may result in immediate
            account suspension, forfeiture of all accumulated points and pending
            rewards, permanent ban from the Website, and, where applicable,
            legal action to recover damages.
          </p>

          {/* ── 14. Intellectual Property ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            14. Intellectual Property
          </h2>
          <p>
            The CashyLoot name, logo, visual design, and all content, features,
            and functionality of the Website, including but not limited to text,
            graphics, images, software, and the arrangement thereof, are owned
            by CashyLoot or its licensors and are protected by United States and
            international copyright, trademark, trade dress, patent, and other
            intellectual property or proprietary rights laws. No use,
            reproduction, distribution, modification, display, or creation of
            derivative works of any CashyLoot content is permitted without the
            prior written permission of CashyLoot. All third-party trademarks,
            service marks, and logos referenced on the Website are the property
            of their respective owners.
          </p>

          {/* ── 15. Termination ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">15. Termination</h2>
          <p>
            CashyLoot reserves the right to suspend or terminate your account at
            any time, with or without cause, and with or without notice, for
            violation of these Terms or for any other reason at our sole
            discretion. Upon termination, CashyLoot may void any pending and
            accumulated rewards, and you will forfeit all unredeemed points.
          </p>
          <p className="mt-2">
            CashyLoot will cooperate with law enforcement authorities when
            required to do so by law or when we reasonably believe that
            cooperation is necessary to protect CashyLoot, its Users, or the
            public.
          </p>
          <p className="mt-2">
            You may terminate your account at any time by deleting your account
            through the Website settings. However, all obligations under these
            Terms that by their nature should survive termination shall survive,
            including but not limited to Sections 14, 16, 17, 18, 19, 20, and
            21.
          </p>

          {/* ── 16. Disclaimer of Warranties ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            16. Disclaimer of Warranties
          </h2>
          <p className="uppercase text-xs tracking-wide leading-relaxed">
            THE WEBSITE AND ALL CONTENT, MATERIALS, INFORMATION, SOFTWARE,
            PRODUCTS, AND SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND
            &quot;AS AVAILABLE&quot; BASIS. CASHYLOOT EXPRESSLY DISCLAIMS ALL
            WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR
            OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
            NON-INFRINGEMENT. CASHYLOOT MAKES NO WARRANTY THAT (A) THE WEBSITE
            WILL MEET YOUR REQUIREMENTS; (B) THE WEBSITE WILL BE UNINTERRUPTED,
            TIMELY, SECURE, OR ERROR-FREE; (C) THE RESULTS OBTAINED FROM USE OF
            THE WEBSITE WILL BE ACCURATE OR RELIABLE; OR (D) ANY ERRORS IN THE
            WEBSITE WILL BE CORRECTED.
          </p>

          {/* ── 17. Limitation of Liability ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            17. Limitation of Liability
          </h2>
          <p className="uppercase text-xs tracking-wide leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            CASHYLOOT, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS,
            DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A)
            YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE WEBSITE;
            (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE WEBSITE; (C)
            ANY CONTENT OBTAINED FROM THE WEBSITE; OR (D) UNAUTHORIZED ACCESS,
            USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT. IN NO EVENT
            SHALL CASHYLOOT&apos;S TOTAL LIABILITY EXCEED THE AMOUNT OF REWARDS
            YOU HAVE EARNED IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR
            ONE HUNDRED DOLLARS ($100.00), WHICHEVER IS GREATER.
          </p>

          {/* ── 18. Indemnification ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            18. Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless CashyLoot and its
            officers, directors, employees, agents, and affiliates from and
            against any and all claims, damages, obligations, losses,
            liabilities, costs, or debt, and expenses (including but not limited
            to attorney&apos;s fees) arising from: (a) your use of and access to
            the Website; (b) your violation of any term of these Terms; (c) your
            violation of any third-party right, including without limitation any
            intellectual property, privacy, or proprietary right; or (d) your
            activities related to the Referral Program, including any claims
            arising from your promotional activities or representations made to
            referred users.
          </p>

          {/* ── 19. Governing Law & Jurisdiction ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            19. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of the State of Delaware, without regard to its conflict of law
            provisions. You agree that any legal action or proceeding arising out
            of or relating to these Terms or your use of the Website shall be
            brought exclusively in the state and federal courts located in the
            State of Delaware. You hereby irrevocably consent to the personal
            jurisdiction and venue of such courts and waive any objection to
            venue or inconvenient forum.
          </p>

          {/* ── 20. Limitation on Time to File Claims ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            20. Limitation on Time to File Claims
          </h2>
          <p>
            Any cause of action or claim you may have arising out of or relating
            to these Terms or the Website must be commenced within one (1) year
            after the cause of action accrues. Otherwise, such cause of action or
            claim is permanently barred. This limitation applies regardless of
            whether you knew or should have known about the cause of action at
            the time it accrued.
          </p>

          {/* ── 21. Waiver and Severability ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            21. Waiver and Severability
          </h2>
          <p>
            No waiver by CashyLoot of any term or condition set out in these
            Terms shall be deemed a further or continuing waiver of such term or
            condition or a waiver of any other term or condition, and any failure
            of CashyLoot to assert a right or provision under these Terms shall
            not constitute a waiver of such right or provision. If any provision
            of these Terms is held by a court or other tribunal of competent
            jurisdiction to be invalid, illegal, or unenforceable for any reason,
            such provision shall be eliminated or limited to the minimum extent
            such that the remaining provisions of these Terms will continue in
            full force and effect.
          </p>

          {/* ── 22. Entire Agreement ── */}
          <h2 className="text-xl font-semibold mt-6 mb-3">
            22. Entire Agreement
          </h2>
          <p>
            These Terms of Service, together with our Privacy Policy and any
            other legal notices or policies published by CashyLoot on the
            Website, constitute the entire agreement between you and CashyLoot
            regarding your use of the Website. These Terms supersede all prior
            and contemporaneous understandings, agreements, representations, and
            warranties, both written and oral, regarding the Website.
          </p>
          <p className="mt-4">
            If you have any questions about these Terms of Service, please
            contact us at:{" "}
            <a
              href="mailto:support@cashyloot.com"
              className="text-primary underline"
            >
              support@cashyloot.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
