"""Authored offline SMS evidence reducer, not a webhook server or provider client.
Python 3 standard library. No telephone values, bodies, credentials or network calls.
These invented normalized events assume authentication happened upstream.
Only nonscheduled outbound SMS states are modeled; this is not a full provider FSM.
"""
from pathlib import Path
from itertools import permutations
import json

PROGRESS = {"queued": 0, "sending": 1, "sent": 2}
TERMINAL = {"delivered", "undelivered", "failed"}
LABELS = {"delivered": "delivery_reported", "undelivered": "non_delivery_reported", "failed": "send_failure_reported"}

def reduce_events(events, target="message-A"):
    progress = None
    terminal = set()
    unexpected = False
    ignored = 0
    for event in events:
        if event.get("message_id") != target:
            ignored += 1
            continue
        status = event.get("status")
        if isinstance(status, str) and status in TERMINAL:
            terminal.add(status)
        elif isinstance(status, str) and status in PROGRESS:
            if progress is None or PROGRESS[status] > PROGRESS[progress]:
                progress = status
        else:
            unexpected = True
    if len(terminal) > 1:
        label = "review_terminal_conflict"
    elif unexpected:
        label = "review_unknown_status"
    elif terminal:
        label = LABELS[next(iter(terminal))]
    elif progress:
        label = "delivery_unconfirmed"
    else:
        label = "no_matching_evidence"
    return {"label": label, "progress": progress, "terminal_reports": sorted(terminal),
            "ignored_wrong_message": ignored, "human_read_proven": False}

def main():
    cases = json.loads(Path(__file__).with_name("cases.json").read_text(encoding="utf8"))
    rows = []
    for case in cases:
        actual = reduce_events(case["events"])
        assert actual["label"] == case["expected"], (case["id"], actual, case["expected"])
        last = case["events"][-1]["status"] if case["events"] else None
        rows.append({"id": case["id"], "expected": case["expected"], "actual": actual, "matched": True, "naive_last_status": last})
    orders = []
    for order in permutations(("queued", "sent", "delivered")):
        events = [{"message_id": "message-A", "status": s} for s in order]
        actual = reduce_events(events)
        assert actual["label"] == "delivery_reported", (order, actual)
        orders.append({"order": list(order), "naive_last_status": order[-1], "guarded_label": actual["label"], "matched": True})
    print(json.dumps({"scope": "Authored offline synthetic events only; not actual messages, callbacks or delivery measurements",
                      "date": "2026-10-17", "curated_cases": len(rows), "curated_matched": len(rows),
                      "permutations": len(orders), "permutation_matched": len(orders),
                      "guarded_delivery_reported": sum(x["guarded_label"] == "delivery_reported" for x in orders),
                      "naive_delivered_last": sum(x["naive_last_status"] == "delivered" for x in orders),
                      "rows": rows, "orders": orders}, indent=2))

if __name__ == "__main__":
    main()
