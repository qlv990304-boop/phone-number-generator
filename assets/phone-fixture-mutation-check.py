"""Offline, hand-selected output mutations; no SMS or network code."""
from copy import deepcopy
import json

EXPECTED = {
    "phone": "+12025550100",
    "region": "US",
    "source": "https://www.nanpa.com/numbering/555-line-numbers",
    "fictional_only": True,
    "delivery_allowed": False,
}

MUTATIONS = {
    "remove_plus": {"phone": "12025550100"},
    "wrong_region": {"region": "GB"},
    "empty_source": {"source": ""},
    "enable_delivery": {"delivery_allowed": True},
    "change_fixed_slot": {"phone": "+12025550101"},
}

def weak_check(row):
    return len(row.get("phone", "")) == 12 and row.get("region") == "US"

def contract_check(row):
    # Independent, reviewed expected values, not the generator under test.
    return row == EXPECTED

def classify(check, row):
    try:
        return "SURVIVED" if check(row) else "KILLED"
    except Exception as error:
        return "HARNESS_ERROR:" + type(error).__name__

def main():
    assert weak_check(EXPECTED) and contract_check(EXPECTED)
    results = []
    for name, change in MUTATIONS.items():
        row = deepcopy(EXPECTED)
        row.update(change)
        results.append({"mutation": name, "weak": classify(weak_check, row),
                        "contract": classify(contract_check, row)})
    print("BASELINE: PASS")
    print(json.dumps(results, indent=2))
    assert all(row["contract"] == "KILLED" for row in results)
    assert sum(row["weak"] == "SURVIVED" for row in results) == 3

if __name__ == "__main__":
    main()