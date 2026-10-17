# GetPhoneNum SMS evidence replay — October17,2026

Save replay.py and cases.json in the same directory. Run with Python3:

    python replay.py

Expected output matches results.json:14 curated cases plus6 permutations,20 matched scenarios.
The permutations all contain the same queued,sent,delivered reports for message-A.
Guarded delivery_reported=6; naive delivered-last=2. This is not a delivery or success rate.
No real messages, callbacks, phone numbers, message bodies, credentials or network operations.
Opaque message-A/B identifiers and normalized status events are invented local fixtures.
This is an authored UI evidence policy, not a full provider state machine or webhook endpoint.
Scope:nonscheduled outbound SMS only. Receipt authentication must happen before this model;
it does not validate signatures, parse HTTP, persist data, reconcile API state, or send a reply.
The read label deliberately tests an out-of-scope channel signal. Unknown statuses and conflicts
require review, not an automatic success. Historical terminal reports are retained as a set.
Repeated matching status observations are idempotent for this display model, not a general
webhook deduplication scheme. Arrival order is intentionally not treated as event truth.
human_read_proven=false means no such proof is provided by this experiment.
