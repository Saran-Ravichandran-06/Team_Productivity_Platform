"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

export function useUrlFilters(searchParamKey = "search", debounceMs = 300) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get(searchParamKey) || "");
  const debouncedSearch = useDebounce(search, debounceMs);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      router.push(`${pathname}?${createQueryString(key, value)}`);
    },
    [pathname, router, createQueryString]
  );

  useEffect(() => {
    const currentUrlSearch = searchParams.get(searchParamKey) || "";
    if (debouncedSearch !== currentUrlSearch) {
      setFilter(searchParamKey, debouncedSearch);
    }
  }, [debouncedSearch, searchParams, searchParamKey, setFilter]);

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    search,
    setSearch,
    searchParams,
    setFilter,
    clearFilters,
  };
}

