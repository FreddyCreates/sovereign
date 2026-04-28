/// DispatchSovereign.mo — EXPEDITIO_REGALIS (Dispatch Sovereign)
/// Four dispatch queues — 25 sovereign micro-workers each (100 total).
/// TASK_INJECTOR creates tasks from anomalies. WORKER_DISPATCH executes them.
///
/// Family: CONSILIUM_MUNDI | Grade: Engine
/// Doctrine: Law of Spherical Causality (16), Law of Always-On Production (18)
import List "mo:core/List";
import Time "mo:core/Time";

module {

  public type SwarmId = {
    #SWARM_AETHER;
    #SWARM_CHRONOS;
    #SWARM_PHANTOM;
    #SWARM_ARCHITECT;
  };

  public type TaskType = {
    #REBALANCE;
    #RESTART_MODULE;
    #APPLY_LAW;
    #TEST_STATE;
    #VERIFY_COHERENCE;
    #RECALIBRATE_SENSOR;
    #LOCK_SETTINGS;
    #BROADCAST_NARRATIVE;
  };

  public type WorkerStatus = {
    #IDLE;
    #EXECUTING;
    #VERIFYING;
    #COMPLETE;
    #FAILED;
  };

  public type TaskRecord = {
    id               : Text;
    anomalyId        : Text;
    taskType         : TaskType;
    context          : Text;
    assignedWorkerId : Text;
    startedAt        : Int;
    var completedAt  : Int;
    var result       : ?Text;
    var success      : Bool;
  };

  public type MicroWorker = {
    id               : Text;
    swarmId          : SwarmId;
    beingId          : Text;
    name             : Text;
    latinName        : Text;
    var currentTask  : ?TaskRecord;
    taskHistory      : List.List<TaskRecord>;   // last 10 tasks
    var status       : WorkerStatus;
    var successCount : Nat;
    var failureCount : Nat;
  };

  // Shared-safe snapshots
  public type TaskSnapshot = {
    id               : Text;
    anomalyId        : Text;
    taskType         : Text;
    context          : Text;
    assignedWorkerId : Text;
    startedAt        : Int;
    completedAt      : Int;
    result           : ?Text;
    success          : Bool;
  };

  public type WorkerSnapshot = {
    id             : Text;
    swarmId        : Text;
    beingId        : Text;
    name           : Text;
    latinName      : Text;
    currentTask    : ?TaskSnapshot;
    recentHistory  : [TaskSnapshot];
    status         : Text;
    successCount   : Nat;
    failureCount   : Nat;
  };

  public type DispatchState = {
    workers           : List.List<MicroWorker>;
    var taskIdCounter : Nat;
    var totalDispatched : Nat;
    var totalCompleted  : Nat;
    var totalFailed     : Nat;
  };

  func swarmText(s : SwarmId) : Text {
    switch (s) {
      case (#SWARM_AETHER)    "SWARM_AETHER";
      case (#SWARM_CHRONOS)   "SWARM_CHRONOS";
      case (#SWARM_PHANTOM)   "SWARM_PHANTOM";
      case (#SWARM_ARCHITECT) "SWARM_ARCHITECT";
    }
  };

  func taskTypeText(t : TaskType) : Text {
    switch (t) {
      case (#REBALANCE)           "REBALANCE";
      case (#RESTART_MODULE)      "RESTART_MODULE";
      case (#APPLY_LAW)           "APPLY_LAW";
      case (#TEST_STATE)          "TEST_STATE";
      case (#VERIFY_COHERENCE)    "VERIFY_COHERENCE";
      case (#RECALIBRATE_SENSOR)  "RECALIBRATE_SENSOR";
      case (#LOCK_SETTINGS)       "LOCK_SETTINGS";
      case (#BROADCAST_NARRATIVE) "BROADCAST_NARRATIVE";
    }
  };

  func workerStatusText(s : WorkerStatus) : Text {
    switch (s) {
      case (#IDLE)       "IDLE";
      case (#EXECUTING)  "EXECUTING";
      case (#VERIFYING)  "VERIFYING";
      case (#COMPLETE)   "COMPLETE";
      case (#FAILED)     "FAILED";
    }
  };

  func snapshotTask(t : TaskRecord) : TaskSnapshot {
    { id = t.id; anomalyId = t.anomalyId; taskType = taskTypeText(t.taskType);
      context = t.context; assignedWorkerId = t.assignedWorkerId;
      startedAt = t.startedAt; completedAt = t.completedAt;
      result = t.result; success = t.success }
  };

  func snapshotWorker(w : MicroWorker) : WorkerSnapshot {
    {
      id           = w.id;
      swarmId      = swarmText(w.swarmId);
      beingId      = w.beingId;
      name         = w.name;
      latinName    = w.latinName;
      currentTask  = switch (w.currentTask) { case (?t) ?snapshotTask(t); case null null };
      recentHistory = w.taskHistory.map<TaskRecord, TaskSnapshot>(snapshotTask).toArray();
      status       = workerStatusText(w.status);
      successCount = w.successCount;
      failureCount = w.failureCount;
    }
  };

  let LATIN_PREFIXES : [Text] = [
    "Primus", "Secundus", "Tertius", "Quartus", "Quintus",
    "Sextus", "Septimus", "Octavus", "Nonus", "Decimus",
    "Undecimus", "Duodecimus", "Tertius Decimus", "Quartus Decimus", "Quintus Decimus",
    "Sextus Decimus", "Septimus Decimus", "Duodevicesimus", "Undevicesimus", "Vicesimus",
    "Vicesimus Primus", "Vicesimus Secundus", "Vicesimus Tertius", "Vicesimus Quartus", "Vicesimus Quintus",
  ];

  func makeWorker(
    swarm : SwarmId, beingId : Text, idx : Nat
  ) : MicroWorker {
    let swarmPrefix = switch (swarm) {
      case (#SWARM_AETHER)    "A";
      case (#SWARM_CHRONOS)   "C";
      case (#SWARM_PHANTOM)   "P";
      case (#SWARM_ARCHITECT) "M";
    };
    let n = idx + 1;
    let ns = if (n < 10) "0" # n.toText() else n.toText();
    let latinName = "Miles " # LATIN_PREFIXES[idx] # " " # (switch (swarm) {
      case (#SWARM_AETHER)    "Aetheri";
      case (#SWARM_CHRONOS)   "Chronosi";
      case (#SWARM_PHANTOM)   "Phantomae";
      case (#SWARM_ARCHITECT) "Architecti";
    });
    {
      id             = "W_" # swarmPrefix # "_" # ns;
      swarmId        = swarm;
      beingId;
      name           = "WORKER_" # swarmPrefix # "_" # ns;
      latinName;
      var currentTask  = null;
      taskHistory      = List.empty<TaskRecord>();
      var status       = #IDLE;
      var successCount = 0;
      var failureCount = 0;
    }
  };

  public func initState() : DispatchState {
    let workers = List.empty<MicroWorker>();
    // 25 workers per swarm
    for (i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].vals()) {
      workers.add(makeWorker(#SWARM_AETHER,    "AETHER_PRIME",    i));
      workers.add(makeWorker(#SWARM_CHRONOS,   "CHRONOS_NEXUS",   i));
      workers.add(makeWorker(#SWARM_PHANTOM,   "PHANTOM_WITNESS", i));
      workers.add(makeWorker(#SWARM_ARCHITECT, "ARCHITECT_MIRROR",i));
    };
    {
      workers;
      var taskIdCounter   = 0;
      var totalDispatched = 0;
      var totalCompleted  = 0;
      var totalFailed     = 0;
    }
  };

  func anomalyToTaskType(anomalyType : Text) : TaskType {
    if (anomalyType == "TIMING_JITTER")        #RECALIBRATE_SENSOR
    else if (anomalyType == "FIELD_COHERENCE_LOSS") #VERIFY_COHERENCE
    else #REBALANCE
  };

  /// TASK_INJECTOR: receives anomaly info, creates a task, assigns to least-loaded worker.
  public func injectTask(
    state        : DispatchState,
    anomalyId    : Text,
    beingId      : Text,
    anomalyType  : Text,
    context      : Text,
    beat         : Nat,
  ) : ?Text {
    let now = Time.now();
    let taskType = anomalyToTaskType(anomalyType);

    // Find swarm for this being
    let targetSwarm : SwarmId = switch (beingId) {
      case ("AETHER_PRIME")    #SWARM_AETHER;
      case ("CHRONOS_NEXUS")   #SWARM_CHRONOS;
      case ("PHANTOM_WITNESS") #SWARM_PHANTOM;
      case ("ARCHITECT_MIRROR") #SWARM_ARCHITECT;
      case (_) #SWARM_AETHER;
    };

    // Find idle worker with least failures (least loaded)
    var bestWorker : ?MicroWorker = null;
    var bestLoad : Nat = 9999999;
    for (w in state.workers.values()) {
      if (w.swarmId == targetSwarm) {
        switch (w.status) {
          case (#IDLE) {
            let load = w.successCount + w.failureCount;
            if (load < bestLoad) {
              bestLoad   := load;
              bestWorker := ?w;
            };
          };
          case (_) {};
        };
      };
    };

    switch (bestWorker) {
      case null { null };
      case (?w) {
        let taskId = "T_" # beat.toText() # "_" # state.taskIdCounter.toText();
        let task : TaskRecord = {
          id               = taskId;
          anomalyId;
          taskType;
          context;
          assignedWorkerId = w.id;
          startedAt        = now;
          var completedAt  = 0;
          var result       = null;
          var success      = false;
        };
        w.currentTask  := ?task;
        w.status       := #EXECUTING;
        state.taskIdCounter   += 1;
        state.totalDispatched += 1;
        ?taskId
      };
    }
  };

  /// WORKER_DISPATCH: advance executing workers — simulate completion.
  public func advanceWorkers(
    state : DispatchState,
    beat  : Nat,
  ) : [Text] {
    let now = Time.now();
    var resolvedAnomalyIds : [Text] = [];

    for (w in state.workers.values()) {
      switch (w.status, w.currentTask) {
        case (#EXECUTING, ?task) {
          // Move to VERIFYING after one beat
          w.status := #VERIFYING;
        };
        case (#VERIFYING, ?task) {
          // Complete the task — deterministic success based on beat + worker id
          let successKey = (beat * 7 + w.successCount + w.failureCount) % 10;
          let success = successKey < 9; // 90% success rate
          task.completedAt := now;
          task.result      := ?(if (success) "SOVEREIGN WORKER " # w.name # " completed " # taskTypeText(task.taskType) # " successfully at beat " # beat.toText()
                                 else "SOVEREIGN WORKER " # w.name # " failed " # taskTypeText(task.taskType) # " at beat " # beat.toText() # " — re-queue pending");
          task.success     := success;
          w.status         := if (success) #COMPLETE else #FAILED;
          if (success) {
            w.successCount += 1;
            resolvedAnomalyIds := resolvedAnomalyIds.concat([task.anomalyId]);
            state.totalCompleted += 1;
          } else {
            w.failureCount += 1;
            state.totalFailed += 1;
          };
          // Archive in task history (keep last 10)
          w.taskHistory.add(task);
          if (w.taskHistory.size() > 10) {
            ignore w.taskHistory.removeLast();
          };
          w.currentTask := null;
        };
        case (#COMPLETE, _) {
          // Reset to IDLE for next task
          w.status := #IDLE;
        };
        case (#FAILED, _) {
          // Reset to IDLE for retry
          w.status := #IDLE;
        };
        case (_, _) {};
      };
    };

    resolvedAnomalyIds
  };

  public func getWorkersBySwarm(state : DispatchState, swarmId : Text) : [WorkerSnapshot] {
    let targetSwarm : ?SwarmId = switch (swarmId) {
      case ("SWARM_AETHER")    ?#SWARM_AETHER;
      case ("SWARM_CHRONOS")   ?#SWARM_CHRONOS;
      case ("SWARM_PHANTOM")   ?#SWARM_PHANTOM;
      case ("SWARM_ARCHITECT") ?#SWARM_ARCHITECT;
      case (_) null;
    };
    switch (targetSwarm) {
      case null { [] };
      case (?sid) {
        state.workers
          .filter(func(w) { w.swarmId == sid })
          .map<MicroWorker, WorkerSnapshot>(snapshotWorker)
          .toArray()
      };
    }
  };

  public func getAllWorkers(state : DispatchState) : [WorkerSnapshot] {
    state.workers.map<MicroWorker, WorkerSnapshot>(snapshotWorker).toArray()
  };

  public func getTaskHistory(state : DispatchState, workerId : Text) : [TaskSnapshot] {
    switch (state.workers.find(func(w) { w.id == workerId })) {
      case null { [] };
      case (?w) {
        w.taskHistory.map<TaskRecord, TaskSnapshot>(snapshotTask).toArray()
      };
    }
  };

}
