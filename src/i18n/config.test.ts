import assert from "node:assert/strict";
import test from "node:test";
import { localePath, stripLocalePrefix } from "./config";

test("locale switching uses canonical prefixed and unprefixed paths", () => {
  assert.equal(localePath("fi", stripLocalePrefix("/en/events/42")), "/events/42");
  assert.equal(localePath("en", stripLocalePrefix("/events/42")), "/en/events/42");
  assert.equal(localePath("fi", stripLocalePrefix("/en?tab=open#top")), "/?tab=open#top");
  assert.equal(localePath("en", stripLocalePrefix("/?tab=open#top")), "/en?tab=open#top");
});

test("locale prefix stripping does not alter similar path segments", () => {
  assert.equal(stripLocalePrefix("/english/events"), "/english/events");
  assert.equal(stripLocalePrefix("/final"), "/final");
});
