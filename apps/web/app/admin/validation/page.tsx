import ValidationList from "./components/ValidationList";

export default function AdminValidationPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Validation
        </h1>
        <p className="text-muted-foreground mt-1">
          Articles en attente de relecture avant publication — y compris ceux
          générés par le pipeline de rédaction assisté par IA.
        </p>
      </div>

      <ValidationList />
    </div>
  );
}
