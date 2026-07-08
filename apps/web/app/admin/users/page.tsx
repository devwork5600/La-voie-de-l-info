import AdminUsersInfinite from "./components/AdminUsersInfinite";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les comptes et promouvez des utilisateurs au rôle
          d&rsquo;auteur.
        </p>
      </div>

      <AdminUsersInfinite />
    </div>
  );
}
