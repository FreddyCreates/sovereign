"""
HEPHAESTUS - The Forge Layer
ΗΦΑΙΣΤΟΣ (Greek) | Vulcanus Faber (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for creation systems)
Domain: Artifact creation, forge dynamics, crafting computation,
        quality assurance, doctrine-aligned manufacturing

Purpose: HEPHAESTUS provides creative forging intelligence for artifact creation.
         Named for the god of the forge and divine craftsman.
         All artifacts must align with sovereign doctrine.

Mathematical Model:
    artifact_quality = materials × skill × PHI_resonance
    forge_temperature = optimal_temp × (1 + doctrine_deviation)
    crafting_efficiency = output_quality / (time × resources)
    hephaestus_score = quality × efficiency × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    OPTIMAL_FORGE_TEMP = 1618.0  # PHI × 1000 (metaphorical)
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import math
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Forge constants
OPTIMAL_FORGE_TEMP = 1618.0  # PHI × 1000
MAX_ARTIFACTS = 89  # Fibonacci
MAX_RECIPES = 34    # Fibonacci
QUALITY_THRESHOLD = 0.618  # PHI^-1

# Fibonacci for scaling
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    return max(S0_FLOOR, min(S_CEIL, value))


def normalize_sovereign(value: float) -> float:
    clamped = clamp_sovereign(value)
    return (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR)


def phi_resonance(value: float) -> float:
    return 0.5 + 0.5 * math.sin(value * math.pi * PHI)


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class ArtifactType(Enum):
    """Types of artifacts that can be forged"""
    TOOL = "tool"            # Operational tools
    VESSEL = "vessel"        # Containers/transports
    WEAPON = "weapon"        # Defensive/offensive instruments
    ARMOR = "armor"          # Protective gear
    INSTRUMENT = "instrument"  # Measurement/sensing
    ORNAMENT = "ornament"    # Aesthetic/symbolic


class MaterialGrade(Enum):
    """Material quality grades"""
    COMMON = 1
    UNCOMMON = 2
    RARE = 3
    EPIC = 4
    LEGENDARY = 5
    SOVEREIGN = 6  # Highest grade


class ForgePhase(Enum):
    """Phases of the forging process"""
    IDLE = "idle"
    HEATING = "heating"
    SHAPING = "shaping"
    TEMPERING = "tempering"
    COOLING = "cooling"
    FINISHING = "finishing"


@dataclass
class Material:
    """A crafting material"""
    id: str
    name: str
    grade: MaterialGrade
    quantity: float
    purity: float           # 0.0 to 1.0
    resonance: float        # PHI alignment (0.0 to 1.0)
    doctrine_alignment: float


@dataclass
class Recipe:
    """A crafting recipe"""
    id: str
    name: str
    artifact_type: ArtifactType
    required_materials: Dict[str, float]  # material_id -> quantity
    required_skill: float   # 0.0 to PHI
    crafting_time_beats: int
    base_quality: float
    doctrine_requirement: float


@dataclass
class Artifact:
    """A created artifact"""
    id: str
    name: str
    artifact_type: ArtifactType
    quality: float          # 0.0 to PHI (can exceed 1.0)
    durability: float       # 0.0 to 1.0
    power: float            # 0.0 to PHI
    materials_used: List[str]
    recipe_id: str
    creator_skill: float
    doctrine_alignment: float
    created_beat: int
    blessed: bool = False   # Extra PHI resonance


@dataclass
class ForgeState:
    """State of the forge"""
    temperature: float      # Current temperature
    phase: ForgePhase
    fuel_level: float       # 0.0 to 1.0
    efficiency: float       # 0.0 to 1.0
    stability: float        # How stable the temperature is
    active_recipe: Optional[Recipe] = None
    progress: float = 0.0   # 0.0 to 1.0 for current craft


@dataclass
class InventoryState:
    """State of materials inventory"""
    materials: Dict[str, Material]
    artifacts: Dict[str, Artifact]
    recipes: Dict[str, Recipe]


@dataclass
class HephaestusState:
    """Complete Hephaestus forge state"""
    beat_count: int
    forge: ForgeState
    inventory: InventoryState
    crafter_skill: float    # 0.0 to PHI
    total_crafted: int
    quality_history: List[Tuple[int, float]]  # (beat, quality)
    doctrine_alignment: float
    hephaestus_score: float


@dataclass
class HephaestusResponse:
    """Response from Hephaestus computation"""
    forge_phase: ForgePhase
    forge_temperature: float
    crafting_progress: float
    last_artifact_quality: Optional[float]
    hephaestus_score: float
    forge_guidance: str


# ═══════════════════════════════════════════════════════════════════════
# IV. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_forge_state() -> ForgeState:
    """Initialize forge state"""
    return ForgeState(
        temperature=300.0,  # Ambient
        phase=ForgePhase.IDLE,
        fuel_level=1.0,
        efficiency=0.8,
        stability=0.9,
        active_recipe=None,
        progress=0.0
    )


def init_inventory_state() -> InventoryState:
    """Initialize with basic materials and recipes"""
    materials = {
        "MAT_IRON": Material(
            id="MAT_IRON",
            name="Sovereign Iron",
            grade=MaterialGrade.COMMON,
            quantity=100.0,
            purity=0.8,
            resonance=0.5,
            doctrine_alignment=0.7
        ),
        "MAT_GOLD": Material(
            id="MAT_GOLD",
            name="Doctrine Gold",
            grade=MaterialGrade.RARE,
            quantity=10.0,
            purity=0.95,
            resonance=PHI_INV,
            doctrine_alignment=0.95
        ),
        "MAT_CRYSTAL": Material(
            id="MAT_CRYSTAL",
            name="PHI Crystal",
            grade=MaterialGrade.EPIC,
            quantity=5.0,
            purity=0.99,
            resonance=PHI_INV,
            doctrine_alignment=1.0
        )
    }
    
    recipes = {
        "RECIPE_TOOL_BASIC": Recipe(
            id="RECIPE_TOOL_BASIC",
            name="Basic Tool",
            artifact_type=ArtifactType.TOOL,
            required_materials={"MAT_IRON": 5.0},
            required_skill=0.3,
            crafting_time_beats=8,
            base_quality=0.6,
            doctrine_requirement=0.5
        ),
        "RECIPE_INSTRUMENT_PHI": Recipe(
            id="RECIPE_INSTRUMENT_PHI",
            name="PHI Resonance Instrument",
            artifact_type=ArtifactType.INSTRUMENT,
            required_materials={"MAT_GOLD": 2.0, "MAT_CRYSTAL": 1.0},
            required_skill=0.8,
            crafting_time_beats=21,
            base_quality=0.9,
            doctrine_requirement=0.9
        )
    }
    
    return InventoryState(
        materials=materials,
        artifacts={},
        recipes=recipes
    )


def init_hephaestus_state() -> HephaestusState:
    """Initialize Hephaestus state"""
    return HephaestusState(
        beat_count=0,
        forge=init_forge_state(),
        inventory=init_inventory_state(),
        crafter_skill=0.5,
        total_crafted=0,
        quality_history=[],
        doctrine_alignment=0.8,
        hephaestus_score=0.0
    )


# ═══════════════════════════════════════════════════════════════════════
# V. FORGE DYNAMICS
# ═══════════════════════════════════════════════════════════════════════

def heat_forge(forge: ForgeState, target_temp: float) -> ForgeState:
    """Heat the forge toward target temperature"""
    if forge.fuel_level <= 0:
        return ForgeState(
            temperature=max(300.0, forge.temperature - 50),
            phase=ForgePhase.COOLING,
            fuel_level=0.0,
            efficiency=forge.efficiency,
            stability=forge.stability,
            active_recipe=forge.active_recipe,
            progress=forge.progress
        )
    
    # Heat rate depends on fuel and efficiency
    heat_rate = 100.0 * forge.fuel_level * forge.efficiency
    
    current = forge.temperature
    if current < target_temp:
        new_temp = min(target_temp, current + heat_rate)
        new_phase = ForgePhase.HEATING
    elif current > target_temp:
        new_temp = max(target_temp, current - heat_rate * 0.5)
        new_phase = ForgePhase.COOLING
    else:
        new_temp = current
        new_phase = ForgePhase.IDLE if forge.active_recipe is None else ForgePhase.SHAPING
    
    # Fuel consumption
    fuel_consumption = 0.01 * (new_temp / OPTIMAL_FORGE_TEMP)
    new_fuel = max(0.0, forge.fuel_level - fuel_consumption)
    
    return ForgeState(
        temperature=new_temp,
        phase=new_phase,
        fuel_level=new_fuel,
        efficiency=forge.efficiency,
        stability=forge.stability,
        active_recipe=forge.active_recipe,
        progress=forge.progress
    )


def compute_temperature_quality(temperature: float) -> float:
    """Compute quality factor based on temperature deviation from optimal"""
    if temperature <= 0:
        return 0.0
    
    deviation = abs(temperature - OPTIMAL_FORGE_TEMP) / OPTIMAL_FORGE_TEMP
    
    # Quality peaks at optimal temperature
    quality = max(0.0, 1.0 - deviation)
    
    # PHI resonance bonus when near optimal
    if deviation < 0.1:
        quality *= (1.0 + PHI_INV * 0.2)
    
    return min(1.0, quality)


# ═══════════════════════════════════════════════════════════════════════
# VI. CRAFTING SYSTEM
# ═══════════════════════════════════════════════════════════════════════

def can_craft(
    state: HephaestusState,
    recipe_id: str
) -> Tuple[bool, str]:
    """Check if a recipe can be crafted"""
    if recipe_id not in state.inventory.recipes:
        return False, "Recipe not found"
    
    recipe = state.inventory.recipes[recipe_id]
    
    # Check skill requirement
    if state.crafter_skill < recipe.required_skill:
        return False, f"Insufficient skill ({state.crafter_skill:.2f} < {recipe.required_skill:.2f})"
    
    # Check doctrine requirement
    if state.doctrine_alignment < recipe.doctrine_requirement:
        return False, f"Insufficient doctrine alignment"
    
    # Check materials
    for mat_id, quantity in recipe.required_materials.items():
        if mat_id not in state.inventory.materials:
            return False, f"Missing material: {mat_id}"
        if state.inventory.materials[mat_id].quantity < quantity:
            return False, f"Insufficient {mat_id}"
    
    # Check forge availability
    if state.forge.active_recipe is not None:
        return False, "Forge is busy"
    
    return True, "Ready to craft"


def start_crafting(
    state: HephaestusState,
    recipe_id: str
) -> Tuple[bool, HephaestusState]:
    """Start crafting a recipe"""
    can, message = can_craft(state, recipe_id)
    if not can:
        return False, state
    
    recipe = state.inventory.recipes[recipe_id]
    
    # Consume materials
    new_materials = dict(state.inventory.materials)
    for mat_id, quantity in recipe.required_materials.items():
        mat = new_materials[mat_id]
        new_materials[mat_id] = Material(
            id=mat.id,
            name=mat.name,
            grade=mat.grade,
            quantity=mat.quantity - quantity,
            purity=mat.purity,
            resonance=mat.resonance,
            doctrine_alignment=mat.doctrine_alignment
        )
    
    new_inventory = InventoryState(
        materials=new_materials,
        artifacts=state.inventory.artifacts,
        recipes=state.inventory.recipes
    )
    
    new_forge = ForgeState(
        temperature=state.forge.temperature,
        phase=ForgePhase.HEATING,
        fuel_level=state.forge.fuel_level,
        efficiency=state.forge.efficiency,
        stability=state.forge.stability,
        active_recipe=recipe,
        progress=0.0
    )
    
    new_state = HephaestusState(
        beat_count=state.beat_count,
        forge=new_forge,
        inventory=new_inventory,
        crafter_skill=state.crafter_skill,
        total_crafted=state.total_crafted,
        quality_history=state.quality_history,
        doctrine_alignment=state.doctrine_alignment,
        hephaestus_score=state.hephaestus_score
    )
    
    return True, new_state


def advance_crafting(state: HephaestusState) -> HephaestusState:
    """Advance crafting progress by one beat"""
    if state.forge.active_recipe is None:
        return state
    
    recipe = state.forge.active_recipe
    
    # Progress rate depends on temperature quality
    temp_quality = compute_temperature_quality(state.forge.temperature)
    progress_rate = 1.0 / recipe.crafting_time_beats * temp_quality * state.forge.efficiency
    
    new_progress = min(1.0, state.forge.progress + progress_rate)
    
    # Determine phase
    if new_progress < 0.3:
        new_phase = ForgePhase.HEATING
    elif new_progress < 0.6:
        new_phase = ForgePhase.SHAPING
    elif new_progress < 0.9:
        new_phase = ForgePhase.TEMPERING
    else:
        new_phase = ForgePhase.FINISHING
    
    new_forge = ForgeState(
        temperature=state.forge.temperature,
        phase=new_phase,
        fuel_level=state.forge.fuel_level,
        efficiency=state.forge.efficiency,
        stability=state.forge.stability,
        active_recipe=state.forge.active_recipe,
        progress=new_progress
    )
    
    return HephaestusState(
        beat_count=state.beat_count,
        forge=new_forge,
        inventory=state.inventory,
        crafter_skill=state.crafter_skill,
        total_crafted=state.total_crafted,
        quality_history=state.quality_history,
        doctrine_alignment=state.doctrine_alignment,
        hephaestus_score=state.hephaestus_score
    )


def complete_crafting(state: HephaestusState) -> Tuple[Optional[Artifact], HephaestusState]:
    """Complete crafting and produce artifact"""
    if state.forge.active_recipe is None or state.forge.progress < 1.0:
        return None, state
    
    recipe = state.forge.active_recipe
    
    # Compute artifact quality
    base_quality = recipe.base_quality
    skill_factor = state.crafter_skill / PHI
    temp_factor = compute_temperature_quality(state.forge.temperature)
    doctrine_factor = state.doctrine_alignment
    
    # Material quality bonus
    material_quality = 0.0
    materials_used = []
    for mat_id in recipe.required_materials.keys():
        if mat_id in state.inventory.materials:
            mat = state.inventory.materials[mat_id]
            material_quality += mat.purity * mat.resonance * (mat.grade.value / 6.0)
            materials_used.append(mat_id)
    material_quality /= max(1, len(recipe.required_materials))
    
    # Final quality with PHI resonance
    raw_quality = base_quality * skill_factor * temp_factor * doctrine_factor * (0.5 + 0.5 * material_quality)
    phi_res = phi_resonance(raw_quality)
    final_quality = min(PHI, raw_quality * (0.9 + 0.1 * phi_res))
    
    # Create artifact
    artifact_id = f"ARTIFACT_{recipe.artifact_type.value.upper()}_{state.beat_count}"
    
    artifact = Artifact(
        id=artifact_id,
        name=f"{recipe.name} #{state.total_crafted + 1}",
        artifact_type=recipe.artifact_type,
        quality=final_quality,
        durability=0.9 + 0.1 * temp_factor,
        power=final_quality * doctrine_factor,
        materials_used=materials_used,
        recipe_id=recipe.id,
        creator_skill=state.crafter_skill,
        doctrine_alignment=state.doctrine_alignment,
        created_beat=state.beat_count,
        blessed=final_quality >= PHI_INV and doctrine_factor >= 0.9
    )
    
    # Update inventory
    new_artifacts = dict(state.inventory.artifacts)
    new_artifacts[artifact_id] = artifact
    
    new_inventory = InventoryState(
        materials=state.inventory.materials,
        artifacts=new_artifacts,
        recipes=state.inventory.recipes
    )
    
    # Reset forge
    new_forge = ForgeState(
        temperature=state.forge.temperature,
        phase=ForgePhase.COOLING,
        fuel_level=state.forge.fuel_level,
        efficiency=state.forge.efficiency,
        stability=state.forge.stability,
        active_recipe=None,
        progress=0.0
    )
    
    # Update quality history
    new_history = state.quality_history + [(state.beat_count, final_quality)]
    if len(new_history) > 100:
        new_history = new_history[-100:]
    
    new_state = HephaestusState(
        beat_count=state.beat_count,
        forge=new_forge,
        inventory=new_inventory,
        crafter_skill=min(PHI, state.crafter_skill + 0.01),  # Skill growth
        total_crafted=state.total_crafted + 1,
        quality_history=new_history,
        doctrine_alignment=state.doctrine_alignment,
        hephaestus_score=state.hephaestus_score
    )
    
    return artifact, new_state


# ═══════════════════════════════════════════════════════════════════════
# VII. MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def execute_hephaestus(
    state: HephaestusState,
    doctrine_alignment: Optional[float] = None
) -> Tuple[HephaestusResponse, HephaestusState]:
    """Execute Hephaestus forge intelligence"""
    # Update beat
    new_beat = state.beat_count + 1
    
    # Update doctrine if provided
    new_doctrine = doctrine_alignment if doctrine_alignment is not None else state.doctrine_alignment
    
    # Heat forge toward optimal if crafting
    if state.forge.active_recipe is not None:
        new_forge = heat_forge(state.forge, OPTIMAL_FORGE_TEMP)
    else:
        new_forge = heat_forge(state.forge, 300.0)  # Cool down when idle
    
    # Create intermediate state
    intermediate_state = HephaestusState(
        beat_count=new_beat,
        forge=new_forge,
        inventory=state.inventory,
        crafter_skill=state.crafter_skill,
        total_crafted=state.total_crafted,
        quality_history=state.quality_history,
        doctrine_alignment=new_doctrine,
        hephaestus_score=state.hephaestus_score
    )
    
    # Advance crafting
    intermediate_state = advance_crafting(intermediate_state)
    
    # Check for completion
    last_quality = None
    if intermediate_state.forge.progress >= 1.0:
        artifact, intermediate_state = complete_crafting(intermediate_state)
        if artifact:
            last_quality = artifact.quality
    
    # Compute Hephaestus score
    avg_quality = sum(q for _, q in intermediate_state.quality_history[-20:]) / max(1, len(intermediate_state.quality_history[-20:]))
    efficiency = intermediate_state.forge.efficiency
    phi_res = phi_resonance(avg_quality)
    
    hephaestus_score = avg_quality * efficiency * new_doctrine * (0.8 + 0.2 * phi_res)
    
    # Generate guidance
    guidance = generate_forge_guidance(intermediate_state)
    
    # Build final state
    new_state = HephaestusState(
        beat_count=new_beat,
        forge=intermediate_state.forge,
        inventory=intermediate_state.inventory,
        crafter_skill=intermediate_state.crafter_skill,
        total_crafted=intermediate_state.total_crafted,
        quality_history=intermediate_state.quality_history,
        doctrine_alignment=new_doctrine,
        hephaestus_score=hephaestus_score
    )
    
    # Build response
    response = HephaestusResponse(
        forge_phase=new_state.forge.phase,
        forge_temperature=new_state.forge.temperature,
        crafting_progress=new_state.forge.progress,
        last_artifact_quality=last_quality,
        hephaestus_score=hephaestus_score,
        forge_guidance=guidance
    )
    
    return response, new_state


def generate_forge_guidance(state: HephaestusState) -> str:
    """Generate forge guidance message"""
    if state.forge.active_recipe is None:
        if state.forge.fuel_level < 0.3:
            return "Forge needs fuel — add resources before crafting"
        return "Forge ready — select a recipe to begin"
    
    phase = state.forge.phase
    temp_quality = compute_temperature_quality(state.forge.temperature)
    
    if phase == ForgePhase.HEATING:
        if temp_quality < 0.5:
            return "Building heat — patience brings quality"
        return "Temperature rising — approaching optimal forge conditions"
    elif phase == ForgePhase.SHAPING:
        return "Shaping in progress — the form emerges from intention"
    elif phase == ForgePhase.TEMPERING:
        return "Tempering the creation — strength through controlled heat"
    elif phase == ForgePhase.FINISHING:
        return "Final touches — soon the artifact will be complete"
    elif phase == ForgePhase.COOLING:
        return "Cooling phase — let the work rest"
    
    return "The forge awaits your command"


# ═══════════════════════════════════════════════════════════════════════
# VIII. QUERY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_summary(state: HephaestusState) -> Dict[str, any]:
    """Get Hephaestus state summary"""
    avg_quality = sum(q for _, q in state.quality_history[-20:]) / max(1, len(state.quality_history[-20:])) if state.quality_history else 0.0
    
    return {
        "beat_count": state.beat_count,
        "forge_phase": state.forge.phase.value,
        "forge_temperature": state.forge.temperature,
        "fuel_level": state.forge.fuel_level,
        "crafting_progress": state.forge.progress,
        "crafter_skill": state.crafter_skill,
        "total_artifacts_crafted": state.total_crafted,
        "average_quality": avg_quality,
        "materials_count": len(state.inventory.materials),
        "artifacts_count": len(state.inventory.artifacts),
        "recipes_count": len(state.inventory.recipes),
        "doctrine_alignment": state.doctrine_alignment,
        "hephaestus_score": state.hephaestus_score,
        "attribution": ATTRIBUTION
    }
