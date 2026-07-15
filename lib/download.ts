// lib/download.ts
//
// THE single flip-point for where "download SPOTTR" sends people. Every QR
// poster and printed link encodes spottrfit.com/get, and /get reads these — so
// changing the destination here (TestFlight today, App Store at public launch)
// retargets every code ever printed, with zero reprints.

// Paste the public TestFlight link (App Store Connect → TestFlight → External
// group → Public Link) when the external group is live. While null, /get falls
// back to the waitlist form.
export const TESTFLIGHT_URL: string | null = 'https://testflight.apple.com/join/Qh5CFFtR';

// The App Store product page — set at public launch; it wins over TestFlight.
export const APP_STORE_URL: string | null = null;

export const DOWNLOAD_URL: string | null = APP_STORE_URL ?? TESTFLIGHT_URL;

// True while the download is a TestFlight beta (drives the "via Apple's
// TestFlight" explainer copy on /get).
export const IS_BETA = APP_STORE_URL === null;
