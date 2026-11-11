import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How NMN.DEV collects, uses and protects information submitted through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const email = site.contact.email;
  return (
    <LegalPage
      title="Privacy Policy"
      updated="7 November 2026"
      intro="This policy explains what information this website collects, why, and how it is handled."
    >
      <h2>Information we collect</h2>
      <p>
        When you use the contact form we collect the details you enter: your name, email address,
        optional company, the service you need, optional budget and timeline, and your project
        description. We use this only to respond to your enquiry.
      </p>
      <p>
        Our servers and hosting provider may keep standard technical logs (such as IP address,
        browser type and requested pages) for security and reliability.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To read and reply to your enquiry.</li>
        <li>To prevent spam and abuse of the contact form.</li>
        <li>To keep the website secure and working.</li>
      </ul>

      <h2>Service providers</h2>
      <p>
        Enquiries are delivered by email through Resend. If spam protection is enabled, Cloudflare
        Turnstile checks submissions and may process technical information from your browser. These
        providers process data on our behalf under their own terms and privacy policies.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website does not set advertising or tracking cookies. If we add analytics in future,
        this policy will be updated first.
      </p>

      <h2>Retention</h2>
      <p>
        We keep enquiry emails for as long as needed to respond and to maintain a record of our
        discussions, and then delete them when they are no longer needed.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete the personal information we hold about you. Contact
        us using the details below and we will respond within a reasonable time.
      </p>

      <h2>Sharing</h2>
      <p>We do not sell your personal information, and we only share it with the providers listed above or where the law requires.</p>

      <h2>Contact</h2>
      <p>
        {email ? (
          <>
            Email <a href={`mailto:${email}`}>{email}</a> or use the{" "}
          </>
        ) : (
          <>Use the </>
        )}
        <Link href="/contact">contact form</Link> for any privacy question.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy and will change the date above when we do.</p>
    </LegalPage>
  );
}
