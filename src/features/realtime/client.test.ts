import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { clearRealtimeData } from "./client";
import { collectScope, isPrivilegedQuery } from "./queries";

const key = (path: string, input?: unknown) => [
  path.split("."),
  { input, type: "query" },
];

test("scope follows real enabled observers, including function-valued enabled", () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const options = {
    queryKey: key("signups.getMySignupStatus", {
      eventId: 7,
    }),
    queryFn: () => Promise.resolve(null),
    initialData: null,
    staleTime: Infinity,
    enabled: false,
  };
  const observer = new QueryObserver(client, options);
  const unsubscribe = observer.subscribe(() => {});
  try {
    assert.deepEqual(
      collectScope(client.getQueryCache().getAll()).eventIds,
      [],
    );
    observer.setOptions({ ...options, enabled: () => true });
    assert.deepEqual(
      collectScope(client.getQueryCache().getAll()).eventIds,
      [7],
    );
    observer.setOptions({ ...options, enabled: false });
    assert.deepEqual(
      collectScope(client.getQueryCache().getAll()).eventIds,
      [],
    );
    unsubscribe();
    assert.deepEqual(
      collectScope(client.getQueryCache().getAll()).eventIds,
      [],
    );
  } finally {
    unsubscribe();
    client.clear();
  }
});

test("privilege cleanup clears observed SSR data and removes inactive data without touching raffle", () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const usersKey = key("users.getUsers");
  const editKey = key("events.getEventEditId", { eventId: 7 });
  const raffleKey = key("raffle.getRaffleStatus", { eventId: 7 });
  const publicKey = key("events.getEvents");
  const observer = new QueryObserver(client, {
    queryKey: usersKey,
    queryFn: () => Promise.resolve(["privileged"]),
    initialData: ["privileged"],
    enabled: false,
  });
  const unsubscribe = observer.subscribe(() => {});
  client.setQueryData(editKey, { private: true });
  client.setQueryData(raffleKey, { unchanged: true });
  client.setQueryData(publicKey, []);
  try {
    clearRealtimeData(client, isPrivilegedQuery);
    assert.equal(client.getQueryData(usersKey), undefined);
    assert.equal(observer.getCurrentResult().data, undefined);
    assert.equal(observer.getCurrentResult().status, "pending");
    assert.equal(
      client.getQueryCache().find({ queryKey: editKey, exact: true }),
      undefined,
    );
    assert.deepEqual(client.getQueryData(raffleKey), { unchanged: true });
    assert.equal(client.getQueryState(raffleKey)?.isInvalidated, false);
    assert.deepEqual(client.getQueryData(publicKey), []);
  } finally {
    unsubscribe();
    client.clear();
  }
});

test("privilege cleanup cancels requests so an old authorized response cannot repopulate data", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const usersKey = key("users.getUsers");
  let resolve: (data: string[]) => void = () => {};
  const response = new Promise<string[]>((done) => {
    resolve = done;
  });
  const observer = new QueryObserver(client, {
    queryKey: usersKey,
    queryFn: () => response,
    initialData: ["old privileged data"],
  });
  const unsubscribe = observer.subscribe(() => {});
  try {
    assert.equal(client.getQueryState(usersKey)?.fetchStatus, "fetching");
    clearRealtimeData(client, isPrivilegedQuery);
    resolve(["late privileged data"]);
    await response;
    await Promise.resolve();
    assert.equal(client.getQueryData(usersKey), undefined);
    assert.equal(observer.getCurrentResult().data, undefined);
  } finally {
    unsubscribe();
    client.clear();
  }
});
