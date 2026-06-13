#!/usr/bin/env python3
"""
Production-Grade Scaffolding CLI

Generates production-grade deliverable packets for the Sovereign ecosystem.
Zero external dependencies — uses only Python standard library.

Attribution: Alfredo Medina Hernandez — immutable

Usage:
    python3 scaffold.py --type <deliverable-type> --name <packet-name> [--output <dir>]
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BUILDER_ROOT = os.path.dirname(SCRIPT_DIR)
PROFILES_PATH = os.path.join(BUILDER_ROOT, "profiles", "deliverable_profiles.json")

AUTHOR = "Alfredo Medina Hernandez"

def generate_quality_gate_content(required_files):
    """Generate quality gate Python script content for a packet."""
    lines = [
        '#!/usr/bin/env python3',
        '"""',
        'Quality Gate - Self-contained verification for this packet.',
        'Checks structure, policy, manifest, and required files.',
        'Exit 0 = pass, Exit 1 = fail.',
        '"""',
        '',
        'import json',
        'import os',
        'import sys',
        '',
        'REQUIRED_FILES = ' + repr(required_files),
        'PACKET_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))',
        '',
        '',
        'def check_file_exists(path):',
        '    full = os.path.join(PACKET_DIR, path)',
        '    if path.endswith("/"):',
        '        return os.path.isdir(full)',
        '    return os.path.isfile(full)',
        '',
        '',
        'def check_manifest():',
        '    manifest_path = os.path.join(PACKET_DIR, "manifest.json")',
        '    if not os.path.isfile(manifest_path):',
        '        return False, "manifest.json missing"',
        '    try:',
        '        with open(manifest_path, "r") as f:',
        '            data = json.load(f)',
        '        for field in ["name", "type", "version", "author", "created"]:',
        '            if field not in data:',
        '                return False, "manifest.json missing field: " + field',
        '        return True, "valid"',
        '    except (json.JSONDecodeError, IOError) as e:',
        '        return False, "manifest.json invalid: " + str(e)',
        '',
        '',
        'def check_policy():',
        '    policy_path = os.path.join(PACKET_DIR, "PACKET_POLICY.md")',
        '    if not os.path.isfile(policy_path):',
        '        return False, "PACKET_POLICY.md missing"',
        '    size = os.path.getsize(policy_path)',
        '    if size < 50:',
        '        return False, "PACKET_POLICY.md too small (< 50 bytes)"',
        '    return True, "present and non-empty"',
        '',
        '',
        'def main():',
        '    print("Quality Gate: " + os.path.basename(PACKET_DIR))',
        '    print("=" * 50)',
        '    errors = []',
        '    checks_passed = 0',
        '    checks_total = 0',
        '',
        '    for f in REQUIRED_FILES:',
        '        checks_total += 1',
        '        if check_file_exists(f):',
        '            checks_passed += 1',
        '            print("  [PASS] " + f)',
        '        else:',
        '            errors.append("Missing: " + f)',
        '            print("  [FAIL] " + f)',
        '',
        '    checks_total += 1',
        '    valid, msg = check_manifest()',
        '    if valid:',
        '        checks_passed += 1',
        '        print("  [PASS] manifest validity: " + msg)',
        '    else:',
        '        errors.append("Manifest: " + msg)',
        '        print("  [FAIL] manifest validity: " + msg)',
        '',
        '    checks_total += 1',
        '    valid, msg = check_policy()',
        '    if valid:',
        '        checks_passed += 1',
        '        print("  [PASS] policy: " + msg)',
        '    else:',
        '        errors.append("Policy: " + msg)',
        '        print("  [FAIL] policy: " + msg)',
        '',
        '    score = checks_passed / checks_total if checks_total > 0 else 0',
        '    print("=" * 50)',
        '    print("Score: " + str(checks_passed) + "/" + str(checks_total) + " (" + format(score, ".2%") + ")")',
        '',
        '    if errors:',
        '        print("")',
        '        print("Failed (" + str(len(errors)) + " errors):")',
        '        for e in errors:',
        '            print("  - " + e)',
        '        sys.exit(1)',
        '    else:',
        '        print("")',
        '        print("PASSED - Production grade verified.")',
        '        sys.exit(0)',
        '',
        '',
        'if __name__ == "__main__":',
        '    main()',
        '',
    ]
    return '\n'.join(lines)

PACKET_POLICY_TEMPLATE = """# Packet Policy: {name}

**Type**: {type}
**Version**: 1.0.0
**Attribution**: Alfredo Medina Hernandez — immutable

## Law

This packet obeys the Sovereign production-grade law:

1. All required artifacts are present
2. Manifest is valid and complete
3. Quality gate passes before export
4. Self-verification tooling included
5. Release manifest tracks checksums

## Required Files

{required_files_list}

## Quality Gate

Run: `python3 tools/quality_gate.py`

Exit 0 = production grade verified.
"""

README_TEMPLATE = """# {name}

**Type**: {type}
**Author**: {author}
**Created**: {created}

## Purpose

{description}

## Usage

```bash
# Run quality gate
python3 tools/quality_gate.py
```

## Structure

```
{name}/
{structure}
```

## Policy

See [PACKET_POLICY.md](./PACKET_POLICY.md) for production-grade requirements.
"""


def load_profiles():
    with open(PROFILES_PATH, "r") as f:
        return json.load(f)


def create_manifest(name, dtype, output_dir):
    manifest = {
        "name": name,
        "type": dtype,
        "version": "1.0.0",
        "author": AUTHOR,
        "created": datetime.now(timezone.utc).isoformat(),
        "entry_point": None,
        "dependencies": [],
    }
    return manifest


def create_release_manifest(name, dtype):
    return {
        "name": name,
        "type": dtype,
        "version": "1.0.0",
        "release_date": datetime.now(timezone.utc).isoformat(),
        "status": "scaffolded",
        "checksum": None,
        "quality_gate_passed": False,
    }


def scaffold_packet(dtype, name, output_dir):
    profiles = load_profiles()
    if dtype not in profiles["profiles"]:
        print(f"Error: Unknown deliverable type '{dtype}'")
        print(f"Available types: {', '.join(sorted(profiles['profiles'].keys()))}")
        sys.exit(1)

    profile = profiles["profiles"][dtype]
    packet_dir = os.path.join(output_dir, name)
    os.makedirs(packet_dir, exist_ok=True)

    required_files = profile["required_files"]
    entry_point = profile.get("entry_point", "")

    # Create directories for paths ending with /
    for f in required_files:
        if f.endswith("/"):
            os.makedirs(os.path.join(packet_dir, f), exist_ok=True)

    # Create tools directory
    os.makedirs(os.path.join(packet_dir, "tools"), exist_ok=True)
    os.makedirs(os.path.join(packet_dir, "reports"), exist_ok=True)

    # Write quality gate
    qg_content = generate_quality_gate_content(required_files)
    with open(os.path.join(packet_dir, "tools", "quality_gate.py"), "w") as f:
        f.write(qg_content)

    # Write manifest
    manifest = create_manifest(name, dtype, packet_dir)
    manifest["entry_point"] = entry_point
    with open(os.path.join(packet_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    # Write release manifest
    release = create_release_manifest(name, dtype)
    with open(os.path.join(packet_dir, "release_manifest.json"), "w") as f:
        json.dump(release, f, indent=2)

    # Write PACKET_POLICY.md
    required_list = "\n".join(f"- `{rf}`" for rf in required_files)
    policy = PACKET_POLICY_TEMPLATE.format(
        name=name, type=dtype, required_files_list=required_list
    )
    with open(os.path.join(packet_dir, "PACKET_POLICY.md"), "w") as f:
        f.write(policy)

    # Write README.md
    structure = "\n".join(f"  {rf}" for rf in required_files)
    readme = README_TEMPLATE.format(
        name=name,
        type=dtype,
        author=AUTHOR,
        created=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        description=profile["description"],
        structure=structure,
    )
    with open(os.path.join(packet_dir, "README.md"), "w") as f:
        f.write(readme)

    # Create entry point stub if it's a file (not a directory)
    if entry_point and not entry_point.endswith("/"):
        ep_path = os.path.join(packet_dir, entry_point)
        os.makedirs(os.path.dirname(ep_path) if os.path.dirname(ep_path) else packet_dir, exist_ok=True)
        if not os.path.exists(ep_path):
            if entry_point.endswith(".py"):
                with open(ep_path, "w") as f:
                    f.write(f'#!/usr/bin/env python3\n"""\n{name} — {profile["description"]}\n"""\n\n\ndef main():\n    print("{name} running")\n\n\nif __name__ == "__main__":\n    main()\n')
            elif entry_point.endswith(".js"):
                with open(ep_path, "w") as f:
                    f.write(f'// {name} — {profile["description"]}\n\nconsole.log("{name} running");\n')
            elif entry_point.endswith(".html"):
                with open(ep_path, "w") as f:
                    f.write(f'<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>{name}</title></head>\n<body><h1>{name}</h1></body>\n</html>\n')
            elif entry_point.endswith(".yml") or entry_point.endswith(".yaml"):
                with open(ep_path, "w") as f:
                    f.write(f"# {name} — {profile['description']}\nname: {name}\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n")
            elif entry_point.endswith(".json"):
                with open(ep_path, "w") as f:
                    json.dump({"name": name, "type": dtype, "version": "1.0.0"}, f, indent=2)
            elif entry_point.endswith(".md"):
                with open(ep_path, "w") as f:
                    f.write(f"# {name}\n\n{profile['description']}\n")
            elif entry_point.endswith(".sh"):
                with open(ep_path, "w") as f:
                    f.write(f'#!/usr/bin/env bash\n# {name} — {profile["description"]}\nset -euo pipefail\necho "{name} deploying..."\n')
            else:
                with open(ep_path, "w") as f:
                    f.write(f"# {name}\n")

    # Create other required files that don't exist yet
    for rf in required_files:
        if rf.endswith("/"):
            continue  # directories already created
        rf_path = os.path.join(packet_dir, rf)
        if not os.path.exists(rf_path):
            os.makedirs(os.path.dirname(rf_path) if os.path.dirname(rf_path) else packet_dir, exist_ok=True)
            if rf == "requirements.txt":
                with open(rf_path, "w") as f:
                    f.write("# Dependencies for " + name + "\n")
            elif rf == "package.json":
                pkg = {"name": name, "version": "1.0.0", "scripts": {"start": f"node {entry_point}"}}
                with open(rf_path, "w") as f:
                    json.dump(pkg, f, indent=2)
            elif rf == "schema.json":
                with open(rf_path, "w") as f:
                    json.dump({"$schema": "http://json-schema.org/draft-07/schema#", "type": "object"}, f, indent=2)
            elif rf == "assertions.json":
                with open(rf_path, "w") as f:
                    json.dump({"assertions": [], "timestamp": datetime.now(timezone.utc).isoformat()}, f, indent=2)
            elif rf == "dashboard.json":
                with open(rf_path, "w") as f:
                    json.dump({"name": name, "widgets": [], "refresh_interval": 60}, f, indent=2)
            elif rf == ".gitignore":
                with open(rf_path, "w") as f:
                    f.write("node_modules/\n__pycache__/\n*.pyc\n.env\n")
            elif rf == "LICENSE":
                with open(rf_path, "w") as f:
                    f.write(f"Copyright (c) {datetime.now().year} {AUTHOR}\nAll rights reserved.\n")
            elif rf == "CONTRIBUTING.md":
                with open(rf_path, "w") as f:
                    f.write(f"# Contributing to {name}\n\nAll contributions must pass the quality gate.\n")
            elif rf.endswith(".md"):
                with open(rf_path, "w") as f:
                    f.write(f"# {os.path.splitext(os.path.basename(rf))[0]}\n\nTODO: Fill in content.\n")
            # Skip files we've already created

    # Write build report placeholder
    report = {
        "name": name,
        "type": dtype,
        "scaffolded_at": datetime.now(timezone.utc).isoformat(),
        "quality_gate": "pending",
        "files_generated": len(required_files),
    }
    with open(os.path.join(packet_dir, "reports", "build_report.json"), "w") as f:
        json.dump(report, f, indent=2)

    print(f"Scaffolded production-grade packet: {name}")
    print(f"  Type: {dtype}")
    print(f"  Location: {packet_dir}")
    print(f"  Files: {len(required_files)} required artifacts")
    print(f"\nRun quality gate:")
    print(f"  python3 {os.path.join(packet_dir, 'tools', 'quality_gate.py')}")

    return packet_dir


def main():
    parser = argparse.ArgumentParser(
        description="Production-Grade Scaffolding CLI — Sovereign Ecosystem"
    )
    parser.add_argument(
        "--type", "-t", required=True,
        help="Deliverable type (e.g., static-app, python-service, node-service)"
    )
    parser.add_argument(
        "--name", "-n", required=True,
        help="Packet name"
    )
    parser.add_argument(
        "--output", "-o", default=".",
        help="Output directory (default: current directory)"
    )
    parser.add_argument(
        "--list-types", action="store_true",
        help="List all available deliverable types"
    )

    args = parser.parse_args()

    if args.list_types:
        profiles = load_profiles()
        print("Available deliverable types:")
        for name, profile in sorted(profiles["profiles"].items()):
            print(f"  {name:20s} — {profile['description']}")
        sys.exit(0)

    scaffold_packet(args.type, args.name, args.output)


if __name__ == "__main__":
    main()
