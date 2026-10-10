#!/usr/bin/env python3
"""Offline tutorial: a narrow JSON log-output contract, not a general PII detector.

Only fictional phone examples and inert OTP canaries are used. No network calls.
Run with Python 3.13+: python phone-fixture-log-redaction.py
"""
import copy
import io
import json
import logging
import platform
import re
import sys

PHONE = "+12025550123"  # Fictional NANPA 555-01xx example, not a live recipient.
OTP = "INERT_OTP_CANARY_742913"  # Not an issued code.
REPLAY = {"seed": 417, "counterexample_path": "3:1:0", "dataset_version": "2026-07-20"}


def rejected(reason):
    return {"event": "log_redaction_rejected", "reason": reason}


def public_event(msg):
    """Project an exact built-in dict onto a bounded reviewed output schema.

    Unknown fields are omitted without recursively traversing/rendering them.
    Retained metadata is restricted; no arbitrary message/error/path is retained.
    """
    if type(msg) is not dict or type(msg.get("event")) is not str or msg.get("event") != "fixture_failure":
        return rejected("UNSTRUCTURED_EVENT")
    if type(msg.get("error_code")) is not str or msg.get("error_code") not in ("PARSER_REJECTED", "ROUNDTRIP_MISMATCH"):
        return rejected("INVALID_ERROR_CODE")
    replay = msg.get("replay")
    if type(replay) is not dict:
        return rejected("INVALID_REPLAY")
    seed, path, version = (replay.get(k) for k in ("seed", "counterexample_path", "dataset_version"))
    if not (type(seed) is int and 0 <= seed < 2**32
            and type(path) is str and len(path) <= 64 and re.fullmatch(r"[0-9]+(?::[0-9]+)*", path)
            and type(version) is str and re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", version)):
        return rejected("INVALID_REPLAY")
    fixtures = msg.get("fixtures")
    if type(fixtures) is not list or not 1 <= len(fixtures) <= 20:
        return rejected("INVALID_FIXTURES")
    projected = []
    for item in fixtures:
        if (type(item) is not dict or type(item.get("iso2")) is not str or item.get("iso2") not in ("US", "GB")
                or type(item.get("e164Example")) is not str or item.get("delivery_allowed") is not False):
            return rejected("INVALID_FIXTURES")
        projected.append({"iso2": item["iso2"], "e164Example": "[REDACTED]", "delivery_allowed": False})
    return {"event": "fixture_failure", "error_code": msg["error_code"],
            "replay": {"seed": seed, "counterexample_path": path, "dataset_version": version},
            "fixtures": projected}


class PublicFixtureFormatter(logging.Formatter):
    def format(self, record):
        # Do not call getMessage()/super().format(): they render args and errors.
        # Also omit cached exc_text, stack_info, pathname, extra and logger name.
        if record.args:
            event = rejected("FORMAT_ARGS_NOT_ALLOWED")
        else:
            try:
                event = public_event(record.msg)
            except Exception:
                # Static rejection event. Never log str(error) or the original msg.
                event = rejected("PROJECTION_FAILED")
        if record.exc_info or record.exc_text or record.stack_info:
            event["exception_details_omitted"] = True
        return json.dumps(event, ensure_ascii=True, separators=(",", ":"))


def capture(msg, args=(), exc_info=None, two_handlers=False, cached_error=None, stack_info=None):
    logger = logging.Logger("isolated_fixture_demo", level=logging.INFO)
    logger.propagate = False  # This dedicated logger's tutorial routing only.
    sinks = [io.StringIO() for _ in range(2 if two_handlers else 1)]
    for sink in sinks:
        handler = logging.StreamHandler(sink)
        handler.setFormatter(PublicFixtureFormatter())
        logger.addHandler(handler)
    record = logging.LogRecord(logger.name, logging.ERROR, "inert_demo.py", 1,
                               msg, args, exc_info, sinfo=stack_info)
    record.exc_text = cached_error
    logger.handle(record)
    return [sink.getvalue() for sink in sinks]


def baseline():
    return {"event": "fixture_failure", "error_code": "PARSER_REJECTED", "replay": dict(REPLAY),
            "fixtures": [{"iso2": "US", "e164Example": PHONE, "delivery_allowed": False,
                          "debug": {"otp": OTP, "nested": [{"phone": PHONE}]}}],
            "extra_payload": {"recipient": PHONE, "otp": OTP}}


def demo():
    sample = baseline()
    original = copy.deepcopy(sample)
    try:
        raise ValueError("inert exception " + PHONE + " " + OTP)
    except ValueError:
        info = sys.exc_info()
    invalid = copy.deepcopy(sample)
    invalid["replay"]["seed"] = True
    cases = [
        ("nested_fixture_and_otp", capture(sample), "fixture_failure", True),
        ("unknown_recipient_alias", capture(dict(sample, recipient_alias=PHONE)), "fixture_failure", True),
        ("percent_s_argument", capture("fixture=%s", (PHONE,)), "log_redaction_rejected", False),
        ("exception_and_cached_text", capture(sample, exc_info=info, cached_error=OTP,
                                              stack_info="inert stack " + PHONE), "fixture_failure", True),
        ("two_output_handlers", capture(sample, two_handlers=True), "fixture_failure", True),
        ("boolean_seed", capture(invalid), "log_redaction_rejected", False),
    ]
    results = []
    for name, outputs, expected_event, preserves_replay in cases:
        for text in outputs:
            assert PHONE not in text and OTP not in text, name
            assert len(text.splitlines()) == 1, name
            value = json.loads(text)
            assert value["event"] == expected_event, name
            assert (value.get("replay") == REPLAY) == preserves_replay, name
            if preserves_replay:
                assert value["fixtures"][0]["e164Example"] == "[REDACTED]"
                assert value["fixtures"][0]["delivery_allowed"] is False
        results.append({"case": name, "sinks_checked": len(outputs), "raw_canaries_present": False,
                        "event": expected_event, "replay_preserved": preserves_replay})
    assert sample == original, "Formatter must not mutate the producer object"
    weak = logging.Formatter("%(message)s")
    arg_record = logging.LogRecord("weak_demo", 40, "inert_demo.py", 1, "fixture=%s", (PHONE,), None)
    exception_record = logging.LogRecord("weak_demo", 40, "inert_demo.py", 1, "fixture failed", (), info)
    assert PHONE not in arg_record.msg and PHONE in weak.format(arg_record)
    assert PHONE not in exception_record.msg and OTP in weak.format(exception_record)
    assert capture({}) == ['{"event":"log_redaction_rejected","reason":"UNSTRUCTURED_EVENT"}\n']
    print(json.dumps({"python": platform.python_version(), "cases": results,
                      "negative_controls": {"phone_from_args_leaks": True, "otp_from_exception_leaks": True},
                      "input_unchanged": sample == original,
                      "redacted_sample": json.loads(capture(sample)[0]),
                      "scope": "Only this dedicated logger and its reviewed handlers"}, indent=2))


if __name__ == "__main__":
    demo()
