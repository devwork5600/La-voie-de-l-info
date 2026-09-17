"use client";

import { TickerItem } from "@lvdi/database";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";

import { NewsletterSignup } from "@/components/layout/footer/NewsletterSignup";
import { Button } from "@/components/ui/button";

interface TickerSidebarProps {
  items: TickerItem[];
  title?: string;
  special?: "subscribe" | "newsletter";
}

const TickerSidebar: React.FC<TickerSidebarProps> = ({
  items,
  title = "Dépêches",
  special = "subscribe",
}) => {
  const { TimeAgo } = useTimeAgo();

  return (
    <div className="w-full">
      <div className="border-foreground border-t-2 pt-3 text-center">
        <h2 className="text-sm font-semibold tracking-widest uppercase">
          {title}
        </h2>
      </div>

      <ul className="divide-border mt-6 divide-y">
        {items.slice(0, 4).map((item) => (
          <li key={item.id} className="py-4 first:pt-0">
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <p className="text-primary text-xs font-semibold uppercase">
                {item.sourceName} ·{" "}
                <TimeAgo date={item.publishedAt} locale="fr" />
              </p>
              <h3 className="group-hover:text-primary mt-1 flex items-start gap-1 leading-snug font-semibold transition">
                <span>{item.title}</span>
                <ExternalLink className="mt-1 size-3 shrink-0 opacity-50" />
              </h3>
            </a>
          </li>
        ))}
      </ul>

      <div className="bg-primary text-primary-foreground mt-8 rounded-md p-6">
        {special === "subscribe" ? (
          <Button
            asChild
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full"
          >
            <Link href="/subscribe">S&rsquo;abonner</Link>
          </Button>
        ) : (
          <NewsletterSignup buttonClassName="bg-primary-foreground text-primary hover:bg-primary-foreground/90" />
        )}
      </div>
    </div>
  );
};

export default TickerSidebar;
