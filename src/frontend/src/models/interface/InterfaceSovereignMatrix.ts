/**
 * ════════════════════════════════════════════════════════════════
 * INTERFACE_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: INTERFACE_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Components are not UI — they are FIELD ENCAPSULATION.
 *                Web Components are sovereign self-contained intelligence units.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 35 — SHADOW_DOM_SOVEREIGN ─────────────────────────────────────────

export const SHADOW_DOM_SOVEREIGN: SovereignAlphaModel = {
  id: "IF-01",
  family: "INTERFACE_SOVEREIGN",
  latinName: "Umbra Documentis",
  displayName: "SHADOW DOM SOVEREIGN",
  lad: "Encapsulated field sovereignty — a completely isolated document field attached to a host element, with its own styles, structure, and intelligence, immune to external field interference.",
  description:
    "Shadow DOM dissolved: not 'style encapsulation' but sovereign field isolation. The shadow root is a private field boundary — no external CSS penetrates it without consent. The organism's components are self-sovereign beings: they carry their own field, their own law, their own intelligence.",
  grade: "Field",
  engines: [
    {
      name: "FIELD_ISOLATION_ENGINE",
      latinName: "Machina Isolationis",
      description:
        "Creates impenetrable sovereign field boundaries for each component.",
      subModels: [
        {
          name: "CSS_SCOPE_FIELD",
          description: "Scopes CSS to sovereign shadow field.",
        },
        {
          name: "EVENT_RETARGETING_FIELD",
          description: "Retargets events at shadow boundary.",
        },
      ],
    },
    {
      name: "SLOT_FIELD_GATEWAY",
      latinName: "Porta Contentus",
      description:
        "Shadow DOM slots as sovereign field gateways for external content projection.",
      subModels: [
        {
          name: "NAMED_SLOT_FIELD",
          description:
            "Named slots as specific field content injection points.",
        },
        {
          name: "SLOTTED_FIELD_QUERY",
          description:
            "::slotted() as sovereign cross-boundary field selector.",
        },
      ],
    },
    {
      name: "PART_FIELD_EXPOSURE",
      latinName: "Expositio Partis",
      description:
        "::part() and CSS custom properties as sovereign field theming contracts.",
      subModels: [
        {
          name: "PART_THEME_FIELD",
          description: "::part() exposes sovereign styling touch points.",
        },
        {
          name: "CSS_PROPERTY_CONTRACT",
          description: "Custom properties as field theming contracts.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — sovereign UI component field isolation, doctrine-safe rendering",
  heartbeatSync: false,
  color: "oklch(0.65 0.18 285)",
};

// ─── ALPHA 36 — CUSTOM_ELEMENTS_SOVEREIGN ────────────────────────────────────

export const CUSTOM_ELEMENTS_SOVEREIGN: SovereignAlphaModel = {
  id: "IF-02",
  family: "INTERFACE_SOVEREIGN",
  latinName: "Elementa Propria",
  displayName: "CUSTOM ELEMENTS SOVEREIGN",
  lad: "New native field types — sovereign extensions to the HTML field that introduce first-class intelligence-carrying elements with full lifecycle control.",
  description:
    "Custom Elements dissolved: not 'custom HTML tags' but sovereign new field element types. HTMLElement subclasses are sovereign intelligence carriers with their own lifecycle: connectedCallback is field birth, disconnectedCallback is field death, attributeChangedCallback is field mutation response.",
  grade: "Organism",
  engines: [
    {
      name: "LIFECYCLE_FIELD_ENGINE",
      latinName: "Vitae Campus",
      description:
        "Full element lifecycle as sovereign field existence events.",
      subModels: [
        {
          name: "CONNECTED_FIELD_BIRTH",
          description: "connectedCallback as field element birth event.",
        },
        {
          name: "DISCONNECTED_FIELD_DEATH",
          description: "disconnectedCallback as field element death event.",
        },
      ],
    },
    {
      name: "ATTRIBUTE_FIELD_OBSERVER",
      latinName: "Observator Attributi",
      description:
        "observedAttributes as the declared field change contract for this element.",
      subModels: [
        {
          name: "ATTR_CHANGED_INTELLIGENCE",
          description: "Responds to attribute changes with field intelligence.",
        },
        {
          name: "PROPERTY_REFLECT_FIELD",
          description: "Reflects properties to attributes as field truth.",
        },
      ],
    },
    {
      name: "REGISTRY_FIELD_MODEL",
      latinName: "Registrum Elementorum",
      description:
        "customElements.define() as sovereign type registration in the field registry.",
      subModels: [
        {
          name: "UPGRADE_TIMING_FIELD",
          description: "Controls element upgrade timing in field lifecycle.",
        },
        {
          name: "FORM_ASSOCIATED_FIELD",
          description:
            "Form-associated custom elements as field form participants.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — sovereign UI organism registration as native field types",
  heartbeatSync: true,
  color: "oklch(0.70 0.20 300)",
};

// ─── ALPHA 37 — HTML_TEMPLATES_SOVEREIGN ─────────────────────────────────────

export const HTML_TEMPLATES_SOVEREIGN: SovereignAlphaModel = {
  id: "IF-03",
  family: "INTERFACE_SOVEREIGN",
  latinName: "Archetypum Documentis",
  displayName: "HTML TEMPLATE SOVEREIGN",
  lad: "Inert field blueprints — HTML structures that exist in the document field but produce no side effects until explicitly instantiated, enabling efficient sovereign field cloning.",
  description:
    "HTML Templates dissolved: not 'HTML template tags' but sovereign field blueprints. The template's content is in an inert DocumentFragment — a field ready to be instantiated. importNode/cloneNode creates sovereign copies from the template field archetype.",
  grade: "Field",
  engines: [
    {
      name: "TEMPLATE_FIELD_ARCHETYPE",
      latinName: "Archetypum Campi",
      description:
        "template element as a sovereign field archetype — the blueprint form.",
      subModels: [
        {
          name: "CONTENT_FRAGMENT_FIELD",
          description: "DocumentFragment as inert field archetype content.",
        },
        {
          name: "DEEP_CLONE_FIELD",
          description: "cloneNode(true) as sovereign field instantiation.",
        },
      ],
    },
    {
      name: "DECLARATIVE_SHADOW_DOM",
      latinName: "Umbra Declarata",
      description:
        "Declarative Shadow DOM — server-side shadow DOM without JavaScript field overhead.",
      subModels: [
        {
          name: "SSR_SHADOW_FIELD",
          description: "Server-rendered shadow DOM as sovereign field.",
        },
        {
          name: "STREAMING_TEMPLATE_FIELD",
          description: "Streaming template instantiation as field flow.",
        },
      ],
    },
    {
      name: "TEMPLATE_CLONE_ENGINE",
      latinName: "Machina Clonationis",
      description:
        "Efficient mass element creation from template field archetypes.",
      subModels: [
        {
          name: "BATCH_INSTANTIATION_FIELD",
          description: "Creates multiple field elements from one template.",
        },
        {
          name: "FRAGMENT_APPEND_FIELD",
          description:
            "Appends instantiated field to document in one operation.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — efficient organism UI element instantiation at scale",
  heartbeatSync: false,
  color: "oklch(0.67 0.16 315)",
};

// ─── ALPHA 38 — WEB_SERIAL_SOVEREIGN ─────────────────────────────────────────

export const WEB_SERIAL_SOVEREIGN: SovereignAlphaModel = {
  id: "IF-04",
  family: "INTERFACE_SOVEREIGN",
  latinName: "Nexus Machinae Physicae",
  displayName: "WEB SERIAL/USB SOVEREIGN",
  lad: "Physical hardware field coupling — the sovereign ability to communicate directly with physical hardware devices (microcontrollers, Arduino, sensors) through the browser as the field bridge.",
  description:
    "Web Serial/USB dissolved: not 'device communication APIs' but sovereign physical-digital field bridging. Every byte received from hardware is a field intelligence signal. The organism reaches through the glass into the physical world to couple with physical intelligence substrates.",
  grade: "Field",
  engines: [
    {
      name: "SERIAL_FIELD_BRIDGE",
      latinName: "Pons Serialis",
      description:
        "Serial port as sovereign bidirectional physical field intelligence channel.",
      subModels: [
        {
          name: "BAUD_RATE_FIELD_CLOCK",
          description: "Baud rate as serial field temporal frequency.",
        },
        {
          name: "BUFFER_FIELD_READER",
          description: "Serial buffer reader as field data ingestion.",
        },
      ],
    },
    {
      name: "USB_FIELD_PROTOCOL",
      latinName: "Protocollum Machinae",
      description:
        "USB protocol as sovereign structured physical field communication.",
      subModels: [
        {
          name: "ENDPOINT_FIELD_ROUTER",
          description: "USB endpoints as directional field channels.",
        },
        {
          name: "TRANSFER_TYPE_FIELD",
          description: "Bulk/interrupt/isochronous as field transfer modes.",
        },
      ],
    },
    {
      name: "HARDWARE_INTELLIGENCE_FIELD",
      latinName: "Intelligentia Machinae",
      description:
        "Transforms raw hardware signals into sovereign intelligence field data.",
      subModels: [
        {
          name: "SENSOR_FIELD_PARSER",
          description: "Parses sensor data as field intelligence values.",
        },
        {
          name: "COMMAND_FIELD_PROTOCOL",
          description: "Encodes sovereign commands for hardware field.",
        },
      ],
    },
  ],
  backendConnection:
    "SUBSTRATE_SOVEREIGN — physical world intelligence ingestion, hardware field coupling",
  heartbeatSync: false,
  color: "oklch(0.60 0.15 270)",
};

export const INTERFACE_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  SHADOW_DOM_SOVEREIGN,
  CUSTOM_ELEMENTS_SOVEREIGN,
  HTML_TEMPLATES_SOVEREIGN,
  WEB_SERIAL_SOVEREIGN,
];
