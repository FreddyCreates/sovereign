// stream_sovereign module root
// STREAM_SOVEREIGN — B2.7 — dedicated processing stream
// Named by Jay: "Create a dedicated processing stream to manifest the core"
// Author: Alfredo Medina Hernandez — SOVEREIGN

pub mod stream_sovereign;

pub use stream_sovereign::{
    StreamSovereignState,
    StreamSnapshot,
    AUDIENCE_BUF_SIZE,
    PHI,
    S_CEIL,
    S_FLOOR,
    STREAM_BUF_SIZE,
    STREAM_INTERVAL_MS,
    compute_audience_delta,
    compute_manifestation_score,
    compute_signal_velocity,
    get_stream_snapshot,
    init_stream_state,
    submit_audience_signal,
    tick_stream,
};
