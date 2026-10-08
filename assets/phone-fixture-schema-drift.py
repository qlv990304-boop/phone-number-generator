"""Offline fixture contract example, not a change to GetPhoneNum's public dataset.
Install the accompanying requirements, then run with Python 3.10 or newer.
No network client, SMS integration or live delivery is used.
"""
from copy import deepcopy
import json
import platform
from importlib.metadata import version
from jsonschema import Draft202012Validator

DIALECT = "https://json-schema.org/draft/2020-12/schema"
DATASET_VERSION = "2026-07-20"
# Eight fields copied from our own published US fixture record.
RECORD = {
    "country": "United States", "iso2": "US", "callingCode": "+1",
    "nationalPattern": "(NPA) NXX-XXXX", "e164Example": "+12025550123",
    "nationalDigits": "10", "fixtureSafety": "Uses the reserved 555-01xx fictional block",
    "sourceUrl": "https://www.nanpa.com/numbering/555-line-numbers",
}

def closed_object(properties):
    return {"type": "object", "properties": properties,
            "required": list(properties), "additionalProperties": False}

strings = {key: {"type": "string", "minLength": 1} for key in RECORD}
strings["e164Example"] = {"type": "string", "pattern": r"^\+[1-9][0-9]{1,14}$"}
SCHEMA_V1 = {"$schema": DIALECT, **closed_object({
    "schema_version": {"type": "integer", "const": 1},
    **strings, "delivery_allowed": {"type": "boolean", "const": False},
})}
v2_strings = {key: deepcopy(rule) for key, rule in strings.items()
              if key not in ("e164Example", "fixtureSafety", "sourceUrl")}
SCHEMA_V2 = {"$schema": DIALECT, **closed_object({
    "schema_version": {"type": "integer", "const": 2}, **v2_strings,
    "phone_e164": deepcopy(strings["e164Example"]),
    "provenance": closed_object({
        "fixtureSafety": deepcopy(strings["fixtureSafety"]),
        "sourceUrl": deepcopy(strings["sourceUrl"]),
    }),
    "delivery_allowed": {"type": "boolean", "const": False},
})}
for schema in (SCHEMA_V1, SCHEMA_V2):
    Draft202012Validator.check_schema(schema)
VALIDATORS = {1: Draft202012Validator(SCHEMA_V1), 2: Draft202012Validator(SCHEMA_V2)}

class ContractError(ValueError):
    pass

def check(record, schema_version):
    errors = []
    for error in VALIDATORS[schema_version].iter_errors(record):
        path = list(error.absolute_path)
        if error.validator == "required":
            missing = next(key for key in error.validator_value if key not in error.instance)
            code = "MISSING:" + ".".join(path + [missing])
        elif error.validator == "additionalProperties":
            extras = sorted(set(error.instance) - set(error.schema["properties"]))
            code = "EXTRA:" + ".".join(path + [extras[0]])
        else:
            code = error.validator.upper() + ":" + (".".join(path) or "$")
        errors.append(code)
    if errors:
        priority = {"MISSING": 0, "TYPE": 1, "CONST": 2, "PATTERN": 3, "EXTRA": 4}
        errors.sort(key=lambda code: (priority.get(code.split(":")[0], 9), code))
        raise ContractError(errors[0])

def produce_v1():
    return {"schema_version": 1, **deepcopy(RECORD), "delivery_allowed": False}

def produce_v2():
    row = produce_v1()
    row["schema_version"] = 2
    row["phone_e164"] = row.pop("e164Example")
    row["provenance"] = {key: row.pop(key) for key in ("fixtureSafety", "sourceUrl")}
    return row

def adapt_v2_to_v1(record):
    # Validate BEFORE mapping; never replace missing safety fields with defaults.
    check(record, 2)
    row = {key: deepcopy(record[key]) for key in v2_strings}
    row.update(schema_version=1, e164Example=record["phone_e164"],
               fixtureSafety=record["provenance"]["fixtureSafety"],
               sourceUrl=record["provenance"]["sourceUrl"],
               delivery_allowed=record["delivery_allowed"])
    check(row, 1)
    return row

def consume(record, allow_v2=False):
    if type(record) is not dict:
        raise ContractError("TYPE:$")
    protocol = record.get("schema_version")
    if type(protocol) is not int or protocol not in ({1, 2} if allow_v2 else {1}):
        raise ContractError("UNSUPPORTED_VERSION")
    check(record, protocol)
    return deepcopy(record) if protocol == 1 else adapt_v2_to_v1(record)

def outcome(record, allow_v2=False):
    try:
        consume(json.loads(json.dumps(record)), allow_v2)
        return "ACCEPT"
    except ContractError as error:
        return str(error)

def require_equal(actual, expected):
    if actual != expected:
        raise RuntimeError(f"Expected {expected!r}, received {actual!r}")

def experiment():
    v1, v2 = produce_v1(), produce_v2()
    missing = deepcopy(v1); del missing["fixtureSafety"]
    renamed = deepcopy(v1); renamed["phone_e164"] = renamed.pop("e164Example")
    numeric = deepcopy(v1); numeric["e164Example"] = 12025550123
    unknown = deepcopy(v1); unknown["schema_version"] = 99
    rows = [
        ("v1 producer -> v1 consumer", v1, False, "ACCEPT"),
        ("v2 producer -> v1 consumer", v2, False, "UNSUPPORTED_VERSION"),
        ("v1 producer -> migrating consumer", v1, True, "ACCEPT"),
        ("v2 producer -> migrating consumer", v2, True, "ACCEPT"),
        ("missing safety field", missing, True, "MISSING:fixtureSafety"),
        ("renamed phone without version bump", renamed, True, "MISSING:e164Example"),
        ("phone string changed to number", numeric, True, "TYPE:e164Example"),
        ("unknown contract version", unknown, True, "UNSUPPORTED_VERSION"),
    ]
    results = []
    for name, record, allow_v2, expected in rows:
        actual = outcome(record, allow_v2)
        require_equal(actual, expected)
        results.append({"case": name, "outcome": actual})
    require_equal(consume(v2, True), v1)
    broken_v2 = deepcopy(v2); del broken_v2["provenance"]["sourceUrl"]
    require_equal(outcome(broken_v2, True), "MISSING:provenance.sourceUrl")
    require_equal(outcome({**v1, "delivery_allowed": True}, True), "CONST:delivery_allowed")
    require_equal(outcome({**v1, "schema_version": True}, True), "UNSUPPORTED_VERSION")
    return results

if __name__ == "__main__":
    print(json.dumps({"python": platform.python_version(), "jsonschema": version("jsonschema"),
                      "dataset_version": DATASET_VERSION, "cases": experiment(),
                      "metadata_round_trip": "PASS", "missing_v2_source": "REJECT",
                      "delivery_flip": "REJECT", "boolean_version": "REJECT"}, indent=2))
