"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import UserRow from "./UserRow";

import { getUsers } from "@/actions/admin-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AdminUsersInfinite: React.FC = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["admin-users"],
      queryFn: ({ pageParam = 1 }) => getUsers({ page: pageParam, limit: 20 }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const users = data?.pages.flatMap((p) => p.users) ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
        {status === "pending" ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Aucun utilisateur.
          </p>
        ) : (
          <div>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="space-y-4 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-px w-full" />
      </CardContent>
    </Card>
  );
};

export default AdminUsersInfinite;
