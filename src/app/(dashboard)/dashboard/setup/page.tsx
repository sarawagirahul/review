import { SetupWizard } from "@/components/dashboard/SetupWizard";

export default function SetupPage() {
  return (
    <div className="py-8">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-medium text-ink mb-3">Welcome to JustHustle</h1>
        <p className="text-body text-lg">Let's get your business set up so you can start collecting reviews.</p>
      </div>
      <SetupWizard />
    </div>
  )
}
