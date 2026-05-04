export const componentInfo = {
  cpu: {
    title: "Central Processing Unit (CPU)",
    description: "The 'brain' of the computer. It executes instructions using the Arithmetic Logic Unit (ALU) for calculations, the Control Unit (CU) for managing data flow, and high-speed Registers for temporary storage.",
    specs: [
      "Architecture: x86-64 / ARMv9",
      "Clock Speed: 4.2 GHz Boost",
      "Cores: 8P + 8E Config",
      "TDP: 125W Max"
    ]
  },
  ram: {
    title: "Random Access Memory (RAM)",
    description: "Volatile high-speed storage that holds active instructions and data. It allows the CPU to access information near-instantaneously, though it clears when power is lost.",
    specs: [
      "Type: DDR5 Dual Channel",
      "Capacity: 32GB (16GB x 2)",
      "Frequency: 6000 MT/s",
      "Latency: CL30"
    ]
  },
  gpu: {
    title: "Graphics Processing Unit (GPU)",
    description: "Highly specialized for parallel processing. It handles thousands of simultaneous mathematical operations, making it essential for rendering complex 3D graphics and video.",
    specs: [
      "Cores: 16384 CUDA Cores",
      "VRAM: 24GB GDDR6X",
      "Memory Bus: 384-bit",
      "Ray Tracing: 3rd Gen RT"
    ]
  },
  ssd: {
    title: "NVMe SSD",
    description: "Persistent storage using NAND flash memory. It provides massive speed improvements over traditional drives by transferring data over high-bandwidth PCIe lanes.",
    specs: [
      "Interface: PCIe Gen 5.0 x4",
      "Read Speed: 12,000 MB/s",
      "Write Speed: 10,000 MB/s",
      "Capacity: 2TB NAND"
    ]
  }
};
