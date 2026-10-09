#!/usr/bin/env python3
"""Offline tutorial: compare downloaded bytes with a separately reviewed manifest.

This script does not authenticate the manifest, validate a JSON Schema, or send SMS.
Keep the approved manifest in a trusted consumer repository. Do not regenerate it
from the very download you are checking. Python standard library only.
"""
import argparse
import hashlib
import hmac
import json
import platform
import re
from pathlib import Path

MAX_BYTES = 1024 * 1024  # This small-fixture tutorial's explicit size policy.
ARTIFACT = "phone-fixture-integrity-sample.json"


def valid_manifest(manifest):
    return (
        isinstance(manifest, dict)
        and type(manifest.get("manifest_version")) is int
        and manifest["manifest_version"] == 1
        and manifest.get("artifact") == ARTIFACT
        and manifest.get("algorithm") == "sha256"
        and type(manifest.get("byte_length")) is int
        and 0 < manifest["byte_length"] <= MAX_BYTES
        and isinstance(manifest.get("sha256"), str)
        and re.fullmatch(r"[0-9a-f]{64}", manifest["sha256"]) is not None
    )


def verify_bytes(payload, approved_manifest):
    if not valid_manifest(approved_manifest):
        return "MANIFEST_INVALID"
    if len(payload) != approved_manifest["byte_length"]:
        return "BYTE_COUNT_MISMATCH"
    actual = hashlib.sha256(payload).hexdigest()
    if not hmac.compare_digest(actual, approved_manifest["sha256"]):
        return "DIGEST_MISMATCH"
    return "PASS"


def read_bounded(path, limit):
    with Path(path).open("rb") as stream:
        payload = stream.read(limit + 1)
    if len(payload) > limit:
        raise ValueError("FILE_TOO_LARGE")
    return payload


def describe_case(name, payload, manifest, baseline):
    # Parsing here is for the experiment table only. The import path below
    # parses ONLY after the byte comparison passes.
    try:
        parsed = json.loads(payload)
        parses, same_value = True, parsed == baseline
    except (UnicodeDecodeError, json.JSONDecodeError):
        parses, same_value = False, False
    return dict(case=name, byte_length=len(payload),
                outcome=verify_bytes(payload, manifest), json_parses=parses,
                same_parsed_record=same_value)


def demo(sample_path, manifest_path):
    clean = read_bounded(sample_path, MAX_BYTES)
    approved = json.loads(read_bounded(manifest_path, 65536))
    assert verify_bytes(clean, approved) == "PASS", "Review the baseline first"
    baseline = json.loads(clean)
    old = baseline["e164Example"].encode("ascii")
    replacement = (baseline["e164Example"][:-1] + "4").encode("ascii")
    assert old != replacement and len(old) == len(replacement)
    changed = clean.replace(old, replacement, 1)
    compact = json.dumps(baseline, ensure_ascii=False, separators=(",", ":")).encode("utf8")
    replaced_manifest = dict(approved, sha256=hashlib.sha256(changed).hexdigest())
    cases = [
        ("clean", clean, approved, "PASS"),
        ("same_length_edit", changed, approved, "DIGEST_MISMATCH"),
        ("truncated", clean[:-17], approved, "BYTE_COUNT_MISMATCH"),
        ("lf_to_crlf", clean.replace(b"\n", b"\r\n"), approved, "BYTE_COUNT_MISMATCH"),
        ("reserialized", compact, approved, "BYTE_COUNT_MISMATCH"),
        ("file_and_unapproved_manifest_replaced", changed, replaced_manifest, "PASS"),
    ]
    results = []
    for name, payload, manifest, expected in cases:
        row = describe_case(name, payload, manifest, baseline)
        assert row["outcome"] == expected, row
        results.append(row)
    assert results[1]["json_parses"] and not results[1]["same_parsed_record"]
    assert not results[2]["json_parses"]
    assert results[3]["same_parsed_record"] and results[4]["same_parsed_record"]
    assert verify_bytes(clean, {}) == "MANIFEST_INVALID"
    assert verify_bytes(clean, dict(approved, algorithm="md5")) == "MANIFEST_INVALID"
    assert verify_bytes(clean, dict(approved, byte_length=True)) == "MANIFEST_INVALID"
    assert verify_bytes(changed, approved) == "DIGEST_MISMATCH"
    print(json.dumps(dict(python=platform.python_version(), baseline_bytes=len(clean),
                         baseline_sha256=approved["sha256"], cases=results,
                         extra_rejections=["missing_manifest_fields", "wrong_algorithm", "boolean_size"],
                         manifest_authentication="Not implemented"), indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true")
    parser.add_argument("--file", type=Path, default=Path(__file__).with_name(ARTIFACT))
    parser.add_argument("--manifest", type=Path,
                        default=Path(__file__).with_name("phone-fixture-integrity-manifest.json"))
    args = parser.parse_args()
    try:
        if args.demo:
            demo(args.file, args.manifest)
            return 0
        approved = json.loads(read_bounded(args.manifest, 65536))
        payload = read_bounded(args.file, MAX_BYTES)
        outcome = verify_bytes(payload, approved)
        print(outcome)
        if outcome != "PASS":
            return 2
        record = json.loads(payload)  # Consume the SAME bytes already checked.
        print("JSON_PARSED; apply the consumer's schema and safety policy next")
        return 0
    except (OSError, ValueError, AssertionError) as error:
        print("REJECT:", type(error).__name__)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
