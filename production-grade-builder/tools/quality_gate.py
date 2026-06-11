#!/usr/bin/env python3
"""
Quality Gate — Production-Grade Builder Self-Verification

Validates that ANY packet (including the builder itself) meets production-grade standards.
Zero external dependencies — uses only Python standard library.

Usage:
    python3 quality_gate.py <packet_directory>
    python3 quality_gate.py  (validates the builder itself)

Attribution: Alfredo Medina Hernandez — immutable
"""

import json
import os
import sys

BUILDER_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Required files for the builder itself
BUILDER_REQUIRED = [
    "README.md",
    "PACKET_POLICY.md",
    "profiles/deliverable_profiles.json",
    "tools/scaffold.py",
    "tools/quality_gate.py",
    "schema/registry.schema.json",
    "schema/manifest.schema.json",
]

# Universal required files for any packet
PACKET_REQUIRED = [
    "README.md",
    "PACKET_POLICY.md",
    "manifest.json",
    "release_manifest.json",
    "tools/quality_gate.py",
]


def check_file_exists(base_dir, path):
    full = os.path.join(base_dir, path)
    if path.endswith("/"):
        return os.path.isdir(full)
    return os.path.isfile(full)


def check_manifest(base_dir):
    manifest_path = os.path.join(base_dir, "manifest.json")
    if not os.path.isfile(manifest_path):
        return False, "manifest.json missing"
    try:
        with open(manifest_path, "r") as f:
            data = json.load(f)
        for field in ["name", "type", "version", "author", "created"]:
            if field not in data:
                return False, f"manifest.json missing field: {field}"
        return True, "valid"
    except (json.JSONDecodeError, IOError) as e:
        return False, f"manifest.json invalid: {e}"


def check_policy(base_dir):
    policy_path = os.path.join(base_dir, "PACKET_POLICY.md")
    if not os.path.isfile(policy_path):
        return False, "PACKET_POLICY.md missing"
    size = os.path.getsize(policy_path)
    if size < 50:
        return False, "PACKET_POLICY.md too small (< 50 bytes)"
    return True, "present and non-empty"


def check_readme(base_dir):
    readme_path = os.path.join(base_dir, "README.md")
    if not os.path.isfile(readme_path):
        return False, "README.md missing"
    size = os.path.getsize(readme_path)
    if size < 20:
        return False, "README.md too small (< 20 bytes)"
    return True, "present and non-empty"


def check_profiles(base_dir):
    profiles_path = os.path.join(base_dir, "profiles", "deliverable_profiles.json")
    if not os.path.isfile(profiles_path):
        return False, "profiles not found"
    try:
        with open(profiles_path, "r") as f:
            data = json.load(f)
        if "profiles" not in data:
            return False, "profiles key missing"
        count = len(data["profiles"])
        if count < 10:
            return False, f"only {count} profiles (need >= 10)"
        return True, f"{count} profiles registered"
    except (json.JSONDecodeError, IOError) as e:
        return False, f"profiles invalid: {e}"


def validate_builder():
    """Validate the builder packet itself."""
    print("Quality Gate: production-grade-builder")
    print("=" * 50)
    errors = []
    checks_passed = 0
    checks_total = 0

    # Check required builder files
    for f in BUILDER_REQUIRED:
        checks_total += 1
        if check_file_exists(BUILDER_ROOT, f):
            checks_passed += 1
            print(f"  [PASS] {f}")
        else:
            errors.append(f"Missing: {f}")
            print(f"  [FAIL] {f}")

    # Check policy
    checks_total += 1
    valid, msg = check_policy(BUILDER_ROOT)
    if valid:
        checks_passed += 1
        print(f"  [PASS] policy: {msg}")
    else:
        errors.append(f"Policy: {msg}")
        print(f"  [FAIL] policy: {msg}")

    # Check profiles
    checks_total += 1
    valid, msg = check_profiles(BUILDER_ROOT)
    if valid:
        checks_passed += 1
        print(f"  [PASS] profiles: {msg}")
    else:
        errors.append(f"Profiles: {msg}")
        print(f"  [FAIL] profiles: {msg}")

    # Check README
    checks_total += 1
    valid, msg = check_readme(BUILDER_ROOT)
    if valid:
        checks_passed += 1
        print(f"  [PASS] readme: {msg}")
    else:
        errors.append(f"README: {msg}")
        print(f"  [FAIL] readme: {msg}")

    return checks_passed, checks_total, errors


def validate_packet(packet_dir):
    """Validate any production-grade packet."""
    packet_name = os.path.basename(os.path.abspath(packet_dir))
    print(f"Quality Gate: {packet_name}")
    print("=" * 50)
    errors = []
    checks_passed = 0
    checks_total = 0

    # Check universal required files
    for f in PACKET_REQUIRED:
        checks_total += 1
        if check_file_exists(packet_dir, f):
            checks_passed += 1
            print(f"  [PASS] {f}")
        else:
            errors.append(f"Missing: {f}")
            print(f"  [FAIL] {f}")

    # Check manifest validity
    checks_total += 1
    valid, msg = check_manifest(packet_dir)
    if valid:
        checks_passed += 1
        print(f"  [PASS] manifest validity: {msg}")
    else:
        errors.append(f"Manifest: {msg}")
        print(f"  [FAIL] manifest validity: {msg}")

    # Check policy
    checks_total += 1
    valid, msg = check_policy(packet_dir)
    if valid:
        checks_passed += 1
        print(f"  [PASS] policy: {msg}")
    else:
        errors.append(f"Policy: {msg}")
        print(f"  [FAIL] policy: {msg}")

    # Check README
    checks_total += 1
    valid, msg = check_readme(packet_dir)
    if valid:
        checks_passed += 1
        print(f"  [PASS] readme: {msg}")
    else:
        errors.append(f"README: {msg}")
        print(f"  [FAIL] readme: {msg}")

    return checks_passed, checks_total, errors


def main():
    if len(sys.argv) > 1:
        packet_dir = sys.argv[1]
        if not os.path.isdir(packet_dir):
            print(f"Error: '{packet_dir}' is not a directory")
            sys.exit(1)
        checks_passed, checks_total, errors = validate_packet(packet_dir)
    else:
        checks_passed, checks_total, errors = validate_builder()

    # Score
    score = checks_passed / checks_total if checks_total > 0 else 0
    print("=" * 50)
    print(f"Score: {checks_passed}/{checks_total} ({score:.2%})")

    if errors:
        print(f"\nFailed ({len(errors)} errors):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("\nPASSED — Production grade verified.")
        sys.exit(0)


if __name__ == "__main__":
    main()
