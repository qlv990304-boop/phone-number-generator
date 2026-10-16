"""Offline authored evidence policy, not a provider SDK or live Lookup client.
Python 3 standard library only. Run beside cases.json; stdout is deterministic JSON.
The fixed clock and 300-second window are experiment choices, not provider promises.
No network, telephone numbers, credentials, messages, or delivery operations.
"""
from pathlib import Path
from datetime import datetime
import json

NOW = datetime.fromisoformat("2026-10-16T01:00:00+00:00")
WINDOW_SECONDS = 300

def classify(record):
    # The caller supplies a normalized application envelope, not a raw API response.
    if record.get("http_ok") is not True:
        return "unavailable"
    if not record.get("requested_subject") or record.get("response_subject") != record["requested_subject"]:
        return "subject_mismatch"
    try:
        stamp = datetime.fromisoformat(record["observed_at"].replace("Z", "+00:00"))
        if stamp.tzinfo is None:
            return "timestamp_invalid"
        age = (NOW - stamp).total_seconds()
    except (KeyError, ValueError, TypeError, AttributeError):
        return "timestamp_invalid"
    if age < 0:
        return "timestamp_invalid"
    if age > WINDOW_SECONDS:
        return "stale"
    if record.get("basic_valid") is not True:
        return "basic_invalid"
    if record.get("line_status_requested") is not True:
        return "not_checked"
    if record.get("package_error") is not None:
        return "unavailable"
    status = record.get("line_status")
    if not isinstance(status, str) or status not in ("active", "reachable", "unreachable", "inactive", "unknown"):
        return "unavailable"
    return status + "_reported"

def main():
    cases = json.loads(Path(__file__).with_name("cases.json").read_text(encoding="utf-8"))
    rows = []
    for case in cases:
        actual = classify(case["input"])
        assert actual == case["expected"], (case["id"], actual, case["expected"])
        rows.append({"id": case["id"], "actual": actual, "expected": case["expected"], "matched": True,
                     "delivery_proven": False, "control_proven": False, "contact_permission_proven": False})
    print(json.dumps({"scope": "Authored offline synthetic envelopes only; no live Lookup results",
                      "date": "2026-10-16", "clock_utc": NOW.isoformat(), "window_seconds": WINDOW_SECONDS,
                      "cases": len(rows), "matched": len(rows), "rows": rows}, indent=2))

if __name__ == "__main__":
    main()
