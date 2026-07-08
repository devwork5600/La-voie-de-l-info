import React from "react";

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="space-y-3">
    <h2 className="font-playfair text-xl font-bold">{title}</h2>
    <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

export default LegalSection;
