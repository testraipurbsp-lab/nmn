import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="label">Error 404</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,8vw,6rem)]">
        This page <span className="text-lime">doesn&apos;t exist.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">The link may be broken or the page may have moved.</p>
      <ButtonLink href="/" className="mt-10">Back to home</ButtonLink>
    </section>
  );
}
