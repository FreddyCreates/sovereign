// ORGANISM BUS — Go Cross-Language Communication Bus
// Concurrent message routing between all 6 language layers.
// Uses channels and goroutines for non-blocking organism communication.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

package go_mesh

import (
"fmt"
"sync"
"time"
)

// OrganismBus coordinates cross-language communication
type OrganismBus struct {
Subscribers map[LanguageID][]chan BusEvent
EventLog    []BusEvent
BeatCount   int64
Version     int64
mu          sync.RWMutex
}

// BusEvent is a typed event on the organism bus
type BusEvent struct {
ID        string
Source    LanguageID
Target    *LanguageID // nil = broadcast
EventType BusEventType
Payload   string
Priority  int
Beat      int64
Timestamp time.Time
}

// BusEventType classifies bus events
type BusEventType int

const (
EvtHeartbeat BusEventType = iota
EvtStateSync
EvtCoherenceReport
EvtFieldUpdate
EvtDoctrineCheck
EvtKuramotoSync
EvtHebbianUpdate
EvtEmergence
)

// NewOrganismBus creates a new organism communication bus
func NewOrganismBus() *OrganismBus {
bus := &OrganismBus{
Subscribers: make(map[LanguageID][]chan BusEvent),
EventLog:    make([]BusEvent, 0, 100),
BeatCount:   0,
Version:     1,
}
// Initialize subscriber channels for all 6 languages
for lang := Julia; lang <= Go; lang++ {
bus.Subscribers[lang] = make([]chan BusEvent, 0)
}
return bus
}

// Subscribe adds a listener for a language
func (b *OrganismBus) Subscribe(lang LanguageID) chan BusEvent {
b.mu.Lock()
defer b.mu.Unlock()
ch := make(chan BusEvent, 50)
b.Subscribers[lang] = append(b.Subscribers[lang], ch)
return ch
}

// Publish sends an event to target or broadcasts
func (b *OrganismBus) Publish(event BusEvent) {
b.mu.Lock()
event.Timestamp = time.Now()
event.Beat = b.BeatCount
event.ID = fmt.Sprintf("evt-%d-%d", b.BeatCount, b.Version)
b.EventLog = append(b.EventLog, event)
if len(b.EventLog) > 1000 {
b.EventLog = b.EventLog[len(b.EventLog)-500:]
}
b.Version++
b.mu.Unlock()

b.mu.RLock()
defer b.mu.RUnlock()

if event.Target != nil {
// Targeted delivery
for _, ch := range b.Subscribers[*event.Target] {
select {
case ch <- event:
default: // drop if full
}
}
} else {
// Broadcast to all languages
for _, subs := range b.Subscribers {
for _, ch := range subs {
select {
case ch <- event:
default:
}
}
}
}
}

// Heartbeat advances the bus by one beat
func (b *OrganismBus) Heartbeat() {
b.mu.Lock()
b.BeatCount++
b.mu.Unlock()

b.Publish(BusEvent{
Source:    Go,
EventType: EvtHeartbeat,
Payload:   fmt.Sprintf("beat:%d|phi:%.4f", b.BeatCount, PHI),
Priority:  10,
})
}

// GetStats returns bus statistics
func (b *OrganismBus) GetStats() BusStats {
b.mu.RLock()
defer b.mu.RUnlock()
totalSubs := 0
for _, subs := range b.Subscribers {
totalSubs += len(subs)
}
return BusStats{
BeatCount:   b.BeatCount,
Version:     b.Version,
EventCount:  int64(len(b.EventLog)),
Subscribers: totalSubs,
Languages:   6,
}
}

// BusStats holds bus statistics
type BusStats struct {
BeatCount   int64
Version     int64
EventCount  int64
Subscribers int
Languages   int
}
