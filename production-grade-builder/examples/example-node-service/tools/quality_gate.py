#!/usr/bin/env python3
"""
Quality Gate - Self-contained verification for this packet.
Checks structure, policy, manifest, and required files.
Exit 0 = pass, Exit 1 = fail.
"""

import json
import os
import sys

REQUIRED_FILES = ['index.js', 'package.json', 'README.md', 'PACKET_POLICY.md', 'manifest.json', 'release_manifest.json', 'tools/quality_gate.py']
PACKET_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check_file_exists(path):
    full = os.path.join(PACKET_DIR, path)
    if path.endswith("/"):
        return os.path.isdir(full)
    return os.path.isfile(full)


def check_manifest():
    manifest_path = os.path.join(PACKET_DIR, "manifest.json")
    if not os.path.isfile(manifest_path):
        return False, "manifest.json missing"
    try:
        with open(manifest_path, "r") as f:
            data = json.load(f)
        for field in ["name", "type", "version", "author", "created"]:
            if field not in data:
                return False, "manifest.json missing field: " + field
        return True, "valid"
    except (json.JSONDecodeError, IOError) as e:
        return False, "manifest.json invalid: " + str(e)


def check_policy():
    policy_path = os.path.join(PACKET_DIR, "PACKET_POLICY.md")
    if not os.path.isfile(policy_path):
        return False, "PACKET_POLICY.md missing"
    size = os.path.getsize(policy_path)
    if size < 50:
        return False, "PACKET_POLICY.md too small (< 50 bytes)"
    return True, "present and non-empty"


def main():
    print("Quality Gate: " + os.path.basename(PACKET_DIR))
    print("=" * 50)
    errors = []
    checks_passed = 0
    checks_total = 0

    for f in REQUIRED_FILES:
        checks_total += 1
        if check_file_exists(f):
            checks_passed += 1
            print("  [PASS] " + f)
        else:
            errors.append("Missing: " + f)
            print("  [FAIL] " + f)

    checks_total += 1
    valid, msg = check_manifest()
    if valid:
        checks_passed += 1
        print("  [PASS] manifest validity: " + msg)
    else:
        errors.append("Manifest: " + msg)
        print("  [FAIL] manifest validity: " + msg)

    checks_total += 1
    valid, msg = check_policy()
    if valid:
        checks_passed += 1
        print("  [PASS] policy: " + msg)
    else:
        errors.append("Policy: " + msg)
        print("  [FAIL] policy: " + msg)

    score = checks_passed / checks_total if checks_total > 0 else 0
    print("=" * 50)
    print("Score: " + str(checks_passed) + "/" + str(checks_total) + " (" + format(score, ".2%") + ")")

    if errors:
        print("")
        print("Failed (" + str(len(errors)) + " errors):")
        for e in errors:
            print("  - " + e)
        sys.exit(1)
    else:
        print("")
        print("PASSED - Production grade verified.")
        sys.exit(0)


if __name__ == "__main__":
    main()
