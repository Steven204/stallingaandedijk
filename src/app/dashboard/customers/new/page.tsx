import { requireRole } from "@/lib/auth-utils";
import { CustomerForm } from "@/components/forms/customer-form";

export default async function NewCustomerPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nieuwe klant</h1>
      <CustomerForm />
    </div>
  );
}
