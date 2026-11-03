# Keet 4.25 docs: what still needs screenshots or testing

Branch `docs/keet-4.25.0-features` (PR #60). Status as of 2026-11-03.
Tested on: Keet Desktop 4.25.2-rc.0 internal build (macOS, throwaway profiles) and Android 4.25.1 public APK / 4.25.0 internal APK (emulator, API 36).
Not tested at all: iOS, Windows, Linux.

## 1. Checked in the last pass (now covered by screenshots or tests)

| Area | What was checked | Where |
| --- | --- | --- |
| Contact Book | "Add remarks" menu item and fresh alias screenshots, desktop and mobile | contact-book.mdx |
| Private notes | Edit, delete (clear and save), 280-character limit (`Max 280 char.` on mobile, `The character limit is 280.` on desktop), note under the name in Contacts (both platforms), Note row on a group member's profile (mobile), Alias and Note rows hidden while blocked, note and alias kept after unblock (desktop) | private-notes.mdx |
| Share contacts | Search in the picker, selecting two contacts (`Share (2)`), two cards arrive, `Added` state, "Added to your contact list" toast (desktop and mobile), clicking the card name opens the profile only for existing contacts (desktop) | share-contacts.mdx |
| Roles | Moderator flow end to end (promote, view as Moderator on desktop and mobile, `Make Admin` greyed out for Moderators on desktop, Admin role not offered to Moderators on mobile), downgrade dialogs (desktop to Moderator and to Peer, mobile to Peer), Admin to Moderator on mobile has no confirmation, only-admin notice, promoter and promoted notifications, Peers see a User Profile and no `Assign role` | group-member-roles.mdx |

## 2. Still unverified: needs a person or a device

### Video and the "heavy load" messages (no screenshots at all)
- **Why blocked:** Keet-Internal has no macOS camera permission, so the camera never starts. Nothing here was reproduced.
- **To do on desktop:** grant Camera in System Settings > Privacy & Security, join a call with 2+ people, and raise renderer CPU with the snippet in `keet-desktop/scripts/burn-cpu-console.md` (`__burn(1)` in DevTools). Capture:
  - the popup `Your device is under heavy load` next to the camera button, both variants (camera only, camera plus hidden videos)
  - a remote tile showing `Video is off because your device is under heavy load` with `Show video`
- **To do on mobile (real device):** capture the same popup under the video button, the tile with `Show video`, and the `View all Participants` button once 5 other people are in a call.
- **Behaviours to confirm:** 6 or more cameras on at once with nobody dropped, audio unaffected, no refusal at toggle time, what happens on a thin uplink (quality drops silently).
- **Wording in the article that comes from source only:** "Keet only plays video for the people you can see", "Keet lowers the video quality you send", and the mobile "you and the most active people first" layout.

### Speaking-while-muted warning
- **Existing screenshot:** taken while the call was still ringing (popup shows correctly, but it is not a connected call). A connected-call shot is nicer.
- **Timing not verified:** the article says about 2 seconds of speech to trigger and about a minute of quiet to auto-dismiss. These come from source (`use-speaking-while-muted.ts`). The test machine's fake microphone only beeps, so the exact timings could not be measured. Needs real speech: speak while muted, time the popup; stop talking, time the dismissal.
- **Seen in the 1:1 test:** the popup appeared with the fake beeping mic (about 6 s into one call, about 44 s in another). It did not appear in a group call within 25 s, but that mic is too unreliable to conclude anything. Needs a retest with real speech in a group call.
- **Not tested:** dismissing with the close button, clicking outside, and Esc; the popup not returning until you unmute and mute again; microphone denied; ignoring typing and clicks; Windows and Linux.
- **Mobile:** not in 4.25.x. Re-check the article and add a Mobile tab when 4.26 ships (source: tag `4.26.0-426019`, text "Tap to unmute yourself so that they can hear you.", 2 s on iOS, 3 s on Android, 10 s auto-dismiss, 30 s cooldown).

### Private notes
- Sync of a note to a linked device (the article does not claim it). Needs two linked devices.
- Desktop profile page: I saw the note fail to save twice in one long session (typing in the Note row, then going back; also the Add remarks modal) until the app was restarted. I could not reproduce it afterwards. Worth asking the desktop team whether notes can fail to save silently.
- Deleting a contact erasing its alias and note (from source only, not run).
- Mobile: note on a blocked contact (source says the tiles are hidden, as on desktop).
- iOS, Windows, Linux screenshots.

### Share contacts
- Mobile: multi-select (only one contact was shared), search in the picker, an "Added" card for an existing contact is shown but only after adding, tapping a card (source says nothing happens).
- Sharing to someone who has blocked the shared contact, or whom you have blocked (picker should exclude blocked contacts; not run).
- A contact card received on an older Keet version ("Sharing contacts not supported" from core).
- Whether Forward and Copy are really absent from the card's menu on desktop (from source).
- iOS, Windows, Linux screenshots.

### Group roles
- A failed role change (source says nothing is shown; no way to force a failure was found).
- A Moderator downgrading themselves.
- Admin downgrading themselves once a second Admin exists.
- The Admin invite option on mobile (confirmed on desktop only; mobile from source).
- Desktop "View responsibilities" for the Moderator variant (`What is a Moderator Role?`).
- Role changes made while the member is offline.
- iOS, Windows, Linux screenshots.

## 3. Known mismatches between the tickets and what ships (for the product team)

- **Notes:** 280-character limit (ticket says 500); field is "Note" / "Add a private note"; no save, edit or delete toast; no offline-retry message.
- **Share contacts:** DM only; receiver card has only "Add" / "Added"; tapping the card does not open the profile on mobile, and only opens it on desktop after the contact is added.
- **Muted warning:** desktop only in 4.25; text is "You're muted." and trigger, dismissal and cooldown rules differ from the ticket.
- **Promote to admin:** promotions apply with no confirmation; notifications are toasts, not timeline events; the Admin invite option still exists (removed in 4.26); a failed change shows nothing.
- **Adaptive video:** fixed 5-camera cap was removed in 4.25.0, not 4.24.0 as the changelog says; there is no "camera can't be enabled" message because Keet sheds load automatically instead.

## 4. Test environment notes

- One contact ("Carol") disappeared from Alice's Contacts after I force-killed the throwaway Keet core worker to restart it. I believe that was caused by my forced kill and not by Keet, but it is untested.
- The internal Android build and the internal desktop build could find each other; the public Android build could not find the desktop internal build. Throwaway profiles pair most reliably by importing a profile QR image.
- Desktop screenshots hide the internal debug bar and the INTERNAL badge. Mobile internal-build screenshots have the debug overlay tab painted out at the top right edge.
