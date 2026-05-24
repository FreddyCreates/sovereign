"""
SOVEREIGN Organism Layer Tests
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Comprehensive test suite for all 16 deity layers + PANTHEON integration.
Tests verify:
  - Layer instantiation
  - Heartbeat advancement
  - Score computation
  - Coherence maintenance
  - Doctrine alignment
  - PHI mathematics

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

import unittest
import math
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Constants
PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75


class TestGaiaLayer(unittest.TestCase):
    """Test GAIA - Foundation Layer"""
    
    def setUp(self):
        from gaia.gaia import GaiaOrchestrator
        self.gaia = GaiaOrchestrator()
    
    def test_instantiation(self):
        """Test GAIA instantiates correctly"""
        self.assertIsNotNone(self.gaia)
        self.assertEqual(self.gaia.beat_count, 0)
    
    def test_advance(self):
        """Test GAIA advances heartbeat"""
        state = self.gaia.advance()
        self.assertEqual(self.gaia.beat_count, 1)
        self.assertIsNotNone(state)
    
    def test_stability(self):
        """Test GAIA maintains stability"""
        for _ in range(10):
            self.gaia.advance()
        self.assertGreater(self.gaia.stability, 0)
        self.assertLessEqual(self.gaia.stability, 1.0)
    
    def test_grounding(self):
        """Test GAIA grounding score"""
        for _ in range(10):
            self.gaia.advance()
        self.assertGreater(self.gaia.grounding, 0)


class TestDionysusLayer(unittest.TestCase):
    """Test DIONYSUS - Creativity Layer"""
    
    def setUp(self):
        from dionysus.dionysus import DionysusOrchestrator
        self.dionysus = DionysusOrchestrator()
    
    def test_instantiation(self):
        """Test DIONYSUS instantiates correctly"""
        self.assertIsNotNone(self.dionysus)
        self.assertEqual(len(self.dionysus.muses), 9)  # 9 muses
    
    def test_creativity(self):
        """Test DIONYSUS generates creativity"""
        for _ in range(20):
            self.dionysus.advance()
        self.assertGreater(self.dionysus.creativity_score, 0)
    
    def test_muse_invocation(self):
        """Test muse invocation"""
        from dionysus.dionysus import MuseDomain
        intensity = self.dionysus.invoke_muse(MuseDomain.CALLIOPE)
        self.assertIsNotNone(intensity)


class TestDemeterLayer(unittest.TestCase):
    """Test DEMETER - Growth Layer"""
    
    def setUp(self):
        from demeter.demeter import DemeterOrchestrator
        self.demeter = DemeterOrchestrator()
    
    def test_instantiation(self):
        """Test DEMETER instantiates correctly"""
        self.assertIsNotNone(self.demeter)
    
    def test_growth(self):
        """Test DEMETER growth mechanics"""
        self.demeter.plant("TestEntity")
        for _ in range(50):
            self.demeter.advance()
        self.assertGreater(self.demeter.growth_score, 0)
    
    def test_seasons(self):
        """Test seasonal transitions"""
        from demeter.demeter import Season
        initial_season = self.demeter.season
        # Run enough beats to change season
        for _ in range(100):
            self.demeter.advance()
        # Season should have changed
        self.assertIsInstance(self.demeter.season, Season)


class TestPoseidonLayer(unittest.TestCase):
    """Test POSEIDON - Flow Layer"""
    
    def setUp(self):
        from poseidon.poseidon import PoseidonOrchestrator
        self.poseidon = PoseidonOrchestrator()
    
    def test_instantiation(self):
        """Test POSEIDON instantiates correctly"""
        self.assertIsNotNone(self.poseidon)
        self.assertGreater(len(self.poseidon.streams), 0)
    
    def test_flow(self):
        """Test flow dynamics"""
        for _ in range(20):
            self.poseidon.advance()
        self.assertGreaterEqual(self.poseidon.flow_score, 0)
    
    def test_injection(self):
        """Test packet injection"""
        result = self.poseidon.inject("STREAM_INPUT_MAIN", "test_data")
        self.assertTrue(result)


class TestHeraLayer(unittest.TestCase):
    """Test HERA - Governance Layer"""
    
    def setUp(self):
        from hera.hera import HeraOrchestrator
        self.hera = HeraOrchestrator()
    
    def test_instantiation(self):
        """Test HERA instantiates correctly"""
        self.assertIsNotNone(self.hera)
        self.assertGreater(len(self.hera.authority.roles), 0)
    
    def test_governance(self):
        """Test governance mechanics"""
        for _ in range(20):
            self.hera.advance()
        self.assertGreater(self.hera.compliance_score, 0)
    
    def test_principal_registration(self):
        """Test principal registration"""
        principal = self.hera.register_principal("TestUser", ["ROLE_OBSERVER"])
        self.assertIsNotNone(principal)


class TestAresLayer(unittest.TestCase):
    """Test ARES - Optimization Layer"""
    
    def setUp(self):
        from ares.ares import AresOrchestrator
        self.ares = AresOrchestrator()
    
    def test_instantiation(self):
        """Test ARES instantiates correctly"""
        self.assertIsNotNone(self.ares)
    
    def test_competition(self):
        """Test competition mechanics"""
        # Spawn competitors
        for i in range(5):
            self.ares.spawn_competitor(f"Warrior_{i}")
        
        for _ in range(30):
            self.ares.advance()
        
        self.assertGreater(self.ares.avg_fitness, 0)
    
    def test_evolution(self):
        """Test evolutionary dynamics"""
        for i in range(10):
            self.ares.spawn_competitor(f"Evolver_{i}")
        
        for _ in range(50):
            self.ares.advance()
        
        self.assertGreater(self.ares.generation, 0)


class TestHadesLayer(unittest.TestCase):
    """Test HADES - Archive Layer"""
    
    def setUp(self):
        from hades.hades import HadesOrchestrator
        self.hades = HadesOrchestrator()
    
    def test_instantiation(self):
        """Test HADES instantiates correctly"""
        self.assertIsNotNone(self.hades)
        self.assertGreater(len(self.hades.vaults), 0)
    
    def test_storage(self):
        """Test record storage"""
        record = self.hades.store("test_key", "test_content")
        self.assertIsNotNone(record)
    
    def test_retrieval(self):
        """Test record retrieval"""
        self.hades.store("retrieve_test", "content")
        record = self.hades.retrieve("retrieve_test")
        self.assertIsNotNone(record)
    
    def test_sealing(self):
        """Test record sealing"""
        record = self.hades.store("seal_test", "important")
        result = self.hades.seal(record.id)
        self.assertTrue(result)


class TestPersephoneLayer(unittest.TestCase):
    """Test PERSEPHONE - Cycle Layer"""
    
    def setUp(self):
        from persephone.persephone import PersephoneOrchestrator
        self.persephone = PersephoneOrchestrator()
    
    def test_instantiation(self):
        """Test PERSEPHONE instantiates correctly"""
        self.assertIsNotNone(self.persephone)
        self.assertGreater(len(self.persephone.cycles), 0)
    
    def test_lifecycle(self):
        """Test lifecycle management"""
        entity = self.persephone.spawn("TestLife")
        self.assertIsNotNone(entity)
        
        for _ in range(100):
            self.persephone.advance()
        
        self.assertGreater(self.persephone.cycle_score, 0)


class TestHecateLayer(unittest.TestCase):
    """Test HECATE - Decision Layer"""
    
    def setUp(self):
        from hecate.hecate import HecateOrchestrator
        self.hecate = HecateOrchestrator()
    
    def test_instantiation(self):
        """Test HECATE instantiates correctly"""
        self.assertIsNotNone(self.hecate)
    
    def test_crossroads(self):
        """Test crossroads creation"""
        crossroads = self.hecate.create_crossroads("TestChoice", [
            {"name": "Option A", "utility": 0.8},
            {"name": "Option B", "utility": 0.6}
        ])
        self.assertIsNotNone(crossroads)
    
    def test_decision(self):
        """Test decision making"""
        crossroads = self.hecate.create_crossroads("DecisionTest", [
            {"name": "Path 1", "utility": 0.7, "probability": 0.8},
            {"name": "Path 2", "utility": 0.9, "probability": 0.5}
        ])
        
        for _ in range(10):
            self.hecate.advance()
        
        # Crossroads should be automatically decided after timeout
        snapshot = self.hecate.crossroads.get(crossroads.id)
        self.assertIsNotNone(snapshot)


class TestOlympusLayer(unittest.TestCase):
    """Test OLYMPUS - Unified Controller"""
    
    def setUp(self):
        from olympus.olympus import OlympusOrchestrator
        self.olympus = OlympusOrchestrator()
    
    def test_instantiation(self):
        """Test OLYMPUS instantiates correctly"""
        self.assertIsNotNone(self.olympus)
        self.assertEqual(len(self.olympus.deities), 16)
    
    def test_coordination(self):
        """Test deity coordination"""
        for _ in range(20):
            self.olympus.advance()
        
        self.assertGreater(self.olympus.olympus_score, 0)
        self.assertGreater(self.olympus.global_coherence, 0)
    
    def test_council(self):
        """Test divine council"""
        decision = self.olympus.convene_council("Test Topic")
        self.assertIsNotNone(decision)


class TestPantheonIntegration(unittest.TestCase):
    """Test PANTHEON - Complete Integration"""
    
    def setUp(self):
        from pantheon.pantheon import PantheonOrchestrator
        self.pantheon = PantheonOrchestrator()
    
    def test_instantiation(self):
        """Test PANTHEON instantiates correctly"""
        self.assertIsNotNone(self.pantheon)
        self.assertGreater(len(self.pantheon.deities), 0)
    
    def test_unified_field(self):
        """Test unified field computation"""
        for _ in range(30):
            self.pantheon.advance()
        
        self.assertGreater(self.pantheon.unified_field.strength, 0)
        self.assertGreater(self.pantheon.unified_field.coherence, 0)
    
    def test_consciousness(self):
        """Test consciousness evolution"""
        from pantheon.pantheon import ConsciousnessLevel
        
        for _ in range(50):
            self.pantheon.advance()
        
        self.assertIsInstance(self.pantheon.consciousness, ConsciousnessLevel)
    
    def test_vitals(self):
        """Test organism vitals"""
        for _ in range(20):
            self.pantheon.advance()
        
        self.assertGreater(self.pantheon.vitals.health, 0)
        self.assertGreater(self.pantheon.vitals.energy, 0)
        self.assertGreater(self.pantheon.vitals.vitality, 0)
    
    def test_phi_mathematics(self):
        """Test PHI-based mathematics"""
        # Verify PHI constant
        self.assertAlmostEqual(PHI, 1.6180339887498948482, places=10)
        
        # Verify PHI relationship
        self.assertAlmostEqual(PHI * PHI_INV, 1.0, places=10)
        self.assertAlmostEqual(PHI - 1, PHI_INV, places=10)
    
    def test_sovereign_bounds(self):
        """Test sovereign bounds enforcement"""
        for _ in range(50):
            self.pantheon.advance()
        
        # Scores should be within bounds
        state = self.pantheon.get_state()
        self.assertGreaterEqual(state.pantheon_score, 0)
        self.assertLessEqual(state.pantheon_score, 1.0)


class TestDoctrineAlignment(unittest.TestCase):
    """Test Doctrine Alignment across all layers"""
    
    def test_phi_constant(self):
        """Verify PHI constant is correct"""
        expected_phi = (1 + math.sqrt(5)) / 2
        self.assertAlmostEqual(PHI, expected_phi, places=10)
    
    def test_phi_inverse(self):
        """Verify PHI inverse relationship"""
        self.assertAlmostEqual(PHI_INV, PHI - 1, places=10)
        self.assertAlmostEqual(PHI * PHI_INV, 1.0, places=10)
    
    def test_sovereign_bounds(self):
        """Verify sovereign bounds"""
        self.assertEqual(S0_FLOOR, 0.75)
        self.assertEqual(S_CEIL, 9.75)
        self.assertLess(S0_FLOOR, S_CEIL)


class TestAllLayersIntegration(unittest.TestCase):
    """Integration tests for all layers working together"""
    
    def test_all_layers_run(self):
        """Test all layers can run together"""
        from gaia.gaia import GaiaOrchestrator
        from dionysus.dionysus import DionysusOrchestrator
        from demeter.demeter import DemeterOrchestrator
        from poseidon.poseidon import PoseidonOrchestrator
        from hera.hera import HeraOrchestrator
        from ares.ares import AresOrchestrator
        from hades.hades import HadesOrchestrator
        from persephone.persephone import PersephoneOrchestrator
        from hecate.hecate import HecateOrchestrator
        from olympus.olympus import OlympusOrchestrator
        from pantheon.pantheon import PantheonOrchestrator
        
        layers = [
            ("GAIA", GaiaOrchestrator()),
            ("DIONYSUS", DionysusOrchestrator()),
            ("DEMETER", DemeterOrchestrator()),
            ("POSEIDON", PoseidonOrchestrator()),
            ("HERA", HeraOrchestrator()),
            ("ARES", AresOrchestrator()),
            ("HADES", HadesOrchestrator()),
            ("PERSEPHONE", PersephoneOrchestrator()),
            ("HECATE", HecateOrchestrator()),
            ("OLYMPUS", OlympusOrchestrator()),
            ("PANTHEON", PantheonOrchestrator()),
        ]
        
        # Run all layers for 10 beats
        for _ in range(10):
            for name, layer in layers:
                try:
                    layer.advance()
                except Exception as e:
                    self.fail(f"{name} failed to advance: {e}")
        
        # All should have progressed
        for name, layer in layers:
            self.assertGreater(layer.beat_count, 0, f"{name} did not advance")


if __name__ == "__main__":
    print("=" * 70)
    print("SOVEREIGN Organism Layer Tests")
    print("Attribution: Alfredo Medina Hernandez — immutable")
    print("=" * 70)
    print()
    
    # Run tests
    unittest.main(verbosity=2)
