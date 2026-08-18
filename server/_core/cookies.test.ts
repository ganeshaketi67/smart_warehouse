import { describe, it, expect } from "vitest";
import { getSessionCookieOptions } from "./cookies";

function makeReq(partial: Partial<any>) {
  return partial as any;
}

describe("getSessionCookieOptions", () => {
  it("returns secure true for https protocol", () => {
    const req = makeReq({ protocol: "https", headers: {} });
    const opts = getSessionCookieOptions(req);
    expect(opts.secure).toBe(true);
    expect(opts.httpOnly).toBe(true);
    expect(opts.path).toBe("/");
    expect(opts.sameSite).toBe("none");
  });

  it("returns secure true when x-forwarded-proto contains https", () => {
    const req = makeReq({ protocol: "http", headers: { "x-forwarded-proto": "http,https" } });
    const opts = getSessionCookieOptions(req);
    expect(opts.secure).toBe(true);
  });

  it("returns secure false when no https indicators are present", () => {
    const req = makeReq({ protocol: "http", headers: {} });
    const opts = getSessionCookieOptions(req);
    expect(opts.secure).toBe(false);
  });
});
