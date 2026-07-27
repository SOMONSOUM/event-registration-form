import { RegistrationForm } from "@/components/registration-form";

export default function Home({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string }>;
}) {
  return <RegistrationFormShell searchParams={searchParams} />;
}

async function RegistrationFormShell({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const params = await searchParams;

  return <RegistrationForm initialQrCode={params?.code ?? ""} />;
}
