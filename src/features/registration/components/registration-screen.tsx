"use client";

import { RegistrationFormCard } from "./registration-form-card";
import { RegistrationHeader } from "./registration-header";
import { RegistrationSidePanel } from "./registration-side-panel";
import { useRegistrationFormController } from "../hooks/use-registration-form-controller";

export const RegistrationScreen = () => {
  const registration = useRegistrationFormController();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-6">
        <section className="grid content-start gap-6">
          <RegistrationHeader />
          <RegistrationFormCard
            form={registration.form}
            errors={registration.errors}
            errorMessage={registration.errorMessage}
            isSubmitting={registration.isSubmitting}
            onSubmit={registration.submit}
            onChange={registration.update}
          />
        </section>

        <RegistrationSidePanel
          method={registration.form.deliveryMethod ?? "download"}
          result={registration.result}
        />
      </div>
    </main>
  );
};
