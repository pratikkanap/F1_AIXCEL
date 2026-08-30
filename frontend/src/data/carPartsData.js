const carPartsData = [
  // =========================================================
  // FRONT / AERODYNAMICS
  // =========================================================

  {
    id: "front-wing",
    label: "Front Wing",
    description:
      "Controls front aerodynamic performance and manages airflow around the front of the car and front tyres.",
    x: 7,
    y: 70,
  },

  {
    id: "front-suspension",
    label: "Front Suspension",
    description:
      "Controls front-wheel movement, steering response, ride height and mechanical grip.",
    x: 28,
    y: 57,
  },

  {
    id: "front-tyre",
    label: "Front Tyre",
    description:
      "Provides mechanical grip for steering, braking and cornering. Tyre temperature and degradation are critical to performance.",
    x: 16,
    y: 80,
  },

  {
    id: "front-brake",
    label: "Front Brake",
    description:
      "Carbon braking system that converts the car's kinetic energy into heat during braking.",
    x: 20,
    y: 74,
  },

  {
    id: "nose",
    label: "Nose",
    description:
      "Connects the front wing to the survival cell and helps manage airflow around the front of the car.",
    x: 25,
    y: 65,
  },


  // =========================================================
  // DRIVER / CHASSIS
  // =========================================================

  {
    id: "halo",
    label: "Halo",
    description:
      "Titanium driver-protection structure designed to protect the driver's head from large objects and impacts.",
    x: 42,
    y: 40,
  },

  {
    id: "cockpit",
    label: "Cockpit",
    description:
      "The driver's working area containing the seat, steering wheel, pedals and essential controls.",
    x: 44,
    y: 55,
  },

  {
    id: "steering",
    label: "Steering System",
    description:
      "Transfers the driver's steering input to the front wheels.",
    x: 38,
    y: 52,
  },

  {
    id: "monocoque",
    label: "Monocoque / Survival Cell",
    description:
      "The primary carbon-fibre safety structure surrounding the driver and forming the central chassis.",
    x: 43,
    y: 69,
  },

  {
    id: "roll-hoop",
    label: "Roll Hoop",
    description:
      "Structural safety component designed to protect the driver during a rollover.",
    x: 52,
    y: 42,
  },


  // =========================================================
  // 2026 AERODYNAMIC FLOOR
  // =========================================================

  {
    id: "floor",
    label: "Floor",
    description:
      "The floor manages airflow underneath the car and is a major contributor to aerodynamic performance.",
    x: 56,
    y: 77,
  },

  {
    id: "venturi-tunnel",
    label: "Venturi Tunnel",
    description:
      "Channels and accelerates airflow underneath the car to create low pressure and aerodynamic downforce.",
    x: 62,
    y: 72,
  },

  {
    id: "diffuser",
    label: "Diffuser",
    description:
      "Expands airflow exiting underneath the car and helps recover pressure while generating aerodynamic load.",
    x: 80,
    y: 83,
  },

  {
    id: "sidepod",
    label: "Sidepod",
    description:
      "Contains cooling hardware and manages airflow toward the floor and rear of the car.",
    x: 59,
    y: 64,
  },

  {
    id: "rear-wing",
    label: "Rear Wing",
    description:
      "Generates rear aerodynamic load and forms part of the car's active aerodynamic system.",
    x: 92,
    y: 49,
  },


  // =========================================================
  // 2026 POWER UNIT
  // =========================================================

  {
    id: "ice",
    label: "1.6L V6 ICE",
    description:
      "The 1.6-litre turbocharged V6 internal combustion engine. Under the 2026 rules, the ICE contribution is reduced to around 400 kW.",
    x: 68,
    y: 62,
  },

  {
    id: "turbocharger",
    label: "Turbocharger",
    description:
      "Uses exhaust-gas energy to compress intake air before it enters the V6 engine.",
    x: 73,
    y: 45,
  },

  {
    id: "mgu-k",
    label: "MGU-K",
    description:
      "The 2026 hybrid motor-generator. It recovers energy during braking and can provide up to 350 kW of electrical power for propulsion.",
    x: 72,
    y: 70,
  },

  {
    id: "energy-store",
    label: "Energy Store / Battery",
    description:
      "Stores electrical energy recovered by the hybrid system and supplies energy to the MGU-K when required.",
    x: 62,
    y: 73,
  },

  {
    id: "control-electronics",
    label: "Control Electronics",
    description:
      "Controls the power-unit electronics, energy management, sensors and operation of the hybrid system.",
    x: 65,
    y: 77,
  },

  {
    id: "exhaust",
    label: "Exhaust System",
    description:
      "Carries combustion gases away from the V6 engine and supplies exhaust energy to the turbocharger.",
    x: 77,
    y: 54,
  },

  {
    id: "airbox",
    label: "Airbox",
    description:
      "Supplies intake air to the turbocharged V6 engine and forms part of the upper engine-cover airflow system.",
    x: 54,
    y: 40,
  },

  {
    id: "radiators",
    label: "Cooling System / Radiators",
    description:
      "Removes heat from the engine, electrical systems, oil and other power-unit components.",
    x: 61,
    y: 57,
  },

  {
    id: "fuel-system",
    label: "Fuel System",
    description:
      "Stores and delivers the 2026 sustainable fuel required by the internal combustion engine.",
    x: 53,
    y: 70,
  },


  // =========================================================
  // TRANSMISSION / REAR
  // =========================================================

  {
    id: "gearbox",
    label: "Gearbox",
    description:
      "Transfers power from the ICE and MGU-K drivetrain to the rear axle.",
    x: 77,
    y: 69,
  },

  {
    id: "rear-tyre",
    label: "Rear Tyre",
    description:
      "Transfers power to the track and provides traction during acceleration and cornering.",
    x: 86,
    y: 81,
  },
];

export default carPartsData;