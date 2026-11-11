import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that apply to your use of the NMN.DEV website and enquiries about our services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="7 November 2026"
      intro="These terms apply to your use of this website. Specific projects are governed by a separate written agreement."
    >
      <h2>Using this website</h2>
      <p>
        You may browse this website and send enquiries through it for lawful purposes. Do not attempt
        to disrupt the site, probe it for vulnerabilities without permission, or submit unlawful,
        abusive or automated spam content.
      </p>

      <h2>Enquiries are not contracts</h2>
      <p>
        Sending an enquiry does not create a client relationship or obligate either side. Scope,
        price, timeline and ownership are agreed in a written proposal or contract before work begins.
      </p>

      <h2>Project work</h2>
      <p>
        Each project is covered by its own agreement, which sets out deliverables, payment terms,
        intellectual property and support. If anything here conflicts with a signed project agreement,
        the project agreement applies.
      </p>

      <h2>Portfolio content</h2>
      <p>
        Projects shown on this site are labelled as concept, demo or client work. Concept and demo
        projects are illustrative and do not describe real clients or results.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The design, text, code and branding of this website belong to NMN.DEV unless noted. You may
        not copy or reuse them without permission.
      </p>

      <h2>Disclaimer and liability</h2>
      <p>
        This website is provided &quot;as is&quot;. We aim to keep information accurate and the site
        available, but we do not guarantee it is error-free or uninterrupted. To the extent permitted
        by law, we are not liable for losses arising from use of this website.
      </p>

      <h2>Links to other sites</h2>
      <p>We link to third-party sites such as social profiles. We do not control them and are not responsible for their content.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes fall under the courts of the jurisdiction where NMN.DEV operates.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us through the <Link href="/contact">contact form</Link>.
      </p>
    </LegalPage>
  );
}
