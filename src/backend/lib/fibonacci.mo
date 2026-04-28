// Fibonacci Engineering Layer
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887 | S0_FLOOR=0.75 | All math is real, no stubs

import Types "../types/architecture";
import Float "mo:core/Float";
import Nat "mo:core/Nat";

module {

  let PHI      : Float = Types.PHI;       // 1.6180339887
  let S0_FLOOR : Float = Types.S0_FLOOR;  // 0.75

  // Golden angle in radians: 2π / PHI² ≈ 2.399963
  let GOLDEN_ANGLE : Float = 2.399963;

  // ── FIBONACCI SEQUENCE ─────────────────────────────────────────────────

  /// Returns the nth Fibonacci number (0-indexed: fib(0)=1, fib(1)=1, fib(2)=2, …)
  public func fib(n : Nat) : Nat {
    if (n == 0) return 1;
    if (n == 1) return 1;
    var a : Nat = 1;
    var b : Nat = 1;
    var i : Nat = 2;
    while (i <= n) {
      let c = a + b;
      a := b;
      b := c;
      i += 1;
    };
    b
  };

  /// Ratio of consecutive Fibonacci numbers: fib(n+1) / fib(n) → PHI as n → ∞
  public func fibRatio(n : Nat) : Float {
    let fn  = fib(n).toFloat();
    let fn1 = fib(n + 1).toFloat();
    if (fn == 0.0) { PHI } else { fn1 / fn }
  };

  /// Scale value using Fibonacci position with S0_FLOOR enforcement.
  /// Returns max(S0_FLOOR, s0 * fibRatio(n))
  public func fibScale(n : Nat, s0 : Float) : Float {
    let scaled = s0 * fibRatio(n);
    if (scaled < S0_FLOOR) { S0_FLOOR } else { scaled }
  };

  /// Geometric position from origin for nth Fibonacci: baseRadius * PHI^(n/12)
  public func fibPosition(n : Nat, baseRadius : Float) : Float {
    // PHI^(n/12.0) computed iteratively to avoid fractional pow issues
    let exp : Float = n.toFloat() / 12.0;
    // Use Float.log and Float.exp: PHI^x = e^(x * ln(PHI))
    // ln(PHI) ≈ 0.48121182505960344
    let lnPHI : Float = 0.48121182505960344;
    let factor = Float.exp(exp * lnPHI);
    baseRadius * factor
  };

  /// Frequency at Fibonacci position n: baseFreq * PHI^(fib(n) % 12 / 12)
  public func fibHarmonic(baseFreq : Float, n : Nat) : Float {
    let fibN    = fib(n) % 12;
    let exp     = fibN.toFloat() / 12.0;
    let lnPHI   : Float = 0.48121182505960344;
    let factor  = Float.exp(exp * lnPHI);
    baseFreq * factor
  };

  /// 3D Fibonacci spiral position for the nth element.
  /// angle = n * GOLDEN_ANGLE (radians)
  /// radius = fibPosition(n, 1.0)
  /// x = radius * cos(angle), y = radius * sin(angle), z = n * PHI * 0.1
  public func fibGeometry(n : Nat) : (Float, Float, Float) {
    let angle  : Float = n.toFloat() * GOLDEN_ANGLE;
    let radius : Float = fibPosition(n, 1.0);
    let x      : Float = radius * Float.cos(angle);
    let y      : Float = radius * Float.sin(angle);
    let z      : Float = n.toFloat() * PHI * 0.1;
    (x, y, z)
  };

};
