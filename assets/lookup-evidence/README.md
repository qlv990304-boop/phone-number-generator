# GetPhoneNum Lookup evidence experiment — 2026-10-16

Download classify.py and cases.json into the same directory. Use Python 3:

    python classify.py

Expected stdout is results.json: 20 cases, 20 matched. No dependencies or network access are needed.
These are invented normalized application envelopes with opaque subjects fixture-A and fixture-B.
They are not actual Twilio responses, carrier readings, availability tests or performance measurements.
An adapter would need to map a provider response and preserve request identity, requested fields,
completion time and error information before applying an application policy like this one.
The fixed clock is 2026-10-16T01:00:00Z. The inclusive 300-second window is solely a boundary-test
choice, not a recommendation or a guarantee from a carrier or API provider.
Output false for a *_proven field means that this experiment provides no such proof.
Cached positives are deliberately excluded from the classifier's current-evidence decision.
No decision grants contact permission, verifies user control, proves SMS delivery or allocates a line.
