import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import ContactForm from "./components/ContactForm";

const CONTACT_INFO = [
  { icon: Mail, label: "contact@lavoiedelinfo.fr" },
  { icon: Phone, label: "+33 1 23 45 67 89" },
  { icon: MapPin, label: "12 rue de la Presse, 75002 Paris" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Une question, une suggestion, un scoop à nous transmettre ?
          Écrivez-nous, notre équipe vous répond au plus vite.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          {CONTACT_INFO.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="text-primary mt-0.5 size-5 shrink-0" />
              <p className="text-sm">{label}</p>
            </div>
          ))}

          <div className="border-primary/30 bg-muted/50 rounded-lg border-l-2 p-4">
            <p className="text-muted-foreground text-sm">
              Pour toute question relative à votre compte ou votre abonnement,
              vous pouvez également vous rendre sur votre{" "}
              <Link
                href="/user"
                className="text-primary font-medium hover:underline"
              >
                espace personnel
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
