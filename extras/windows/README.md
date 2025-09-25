# Windows Helper: Open `.grc` from Browser

This helper registers a **custom URL scheme** `mmtgrc://` on Windows so that clicking
“Open in GNU Radio” in the portal can **launch GNU Radio** with the `.grc` file.

## Steps

1. **Edit** `mmtgrc-open.cmd` and set the path to your `gnuradio-companion.exe` if needed.
2. **Register** the protocol by double-clicking `register-mmtgrc.reg` and accepting the prompt.
3. Test: paste into Run (Win+R): `mmtgrc://open?file=C:\Users\Public\Downloads\AM_Modulation.grc`

> Browsers might prompt you the first time to allow this app to open. Approve it.

## Notes
- This is optional. Students can always **Download .grc** and open it manually.
- The `.cmd` script receives the `file` parameter from the URL and starts GRC.
