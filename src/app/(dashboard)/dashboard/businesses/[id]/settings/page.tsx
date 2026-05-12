import { redirect } from "next/navigation";

export default async function BusinessSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/businesses/${id}`);
}
