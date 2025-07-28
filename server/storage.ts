import { type File, type InsertFile, type Reasoner, type InsertReasoner, type Scenario, type InsertScenario } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // File operations
  getFiles(category?: string, section?: string, fileType?: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<boolean>;

  // Reasoner operations
  getReasoners(category?: string): Promise<Reasoner[]>;
  getReasoner(id: string): Promise<Reasoner | undefined>;
  createReasoner(reasoner: InsertReasoner): Promise<Reasoner>;

  // Scenario operations
  getScenarios(category?: string): Promise<Scenario[]>;
  getScenario(id: string): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;

  // Search operations
  searchFiles(query: string, category?: string, section?: string): Promise<File[]>;
  searchScenarios(query: string, category?: string): Promise<Scenario[]>;
}

export class MemStorage implements IStorage {
  private files: Map<string, File>;
  private reasoners: Map<string, Reasoner>;
  private scenarios: Map<string, Scenario>;

  constructor() {
    this.files = new Map();
    this.reasoners = new Map();
    this.scenarios = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some default reasoners
    const defaultReasoners: InsertReasoner[] = [
      {
        name: "Vampire Prover",
        description: "First-order logic theorem prover",
        url: "https://vprover.github.io/",
        category: "scene-graphs",
      },
      {
        name: "E Prover",
        description: "Equational theorem prover",
        url: "https://www.eprover.org/",
        category: "scene-graphs",
      },
      {
        name: "SPASS Prover",
        description: "Automated theorem prover",
        url: "https://www.mpi-inf.mpg.de/departments/automation-of-logic/software/spass-workbench/",
        category: "robot-world",
      },
      {
        name: "Prover9",
        description: "First-order resolution theorem prover",
        url: "https://www.cs.unm.edu/~mccune/mace4/",
        category: "robot-world",
      },
    ];

    defaultReasoners.forEach(reasoner => {
      this.createReasoner(reasoner);
    });

    // Initialize with some default scenarios for Robot Meets World
    const defaultScenarios: InsertScenario[] = [
      {
        title: "Kitchen Navigation Scenario",
        description: "A service robot must navigate through a busy kitchen to deliver food while avoiding moving staff and hot surfaces",
        content: "A service robot must navigate through a busy kitchen to deliver food while avoiding moving staff and hot surfaces. The robot needs to understand spatial relationships, predict human movement patterns, and maintain safe distances from hazardous areas.",
        category: "robot-world",
      },
      {
        title: "Human Collaboration",
        description: "A robot assistant works alongside humans in an assembly line, coordinating actions and responding to verbal commands",
        content: "A robot assistant works alongside humans in an assembly line, coordinating actions and responding to verbal commands. The system requires real-time communication, task understanding, and adaptive behavior based on human preferences and workflow changes.",
        category: "robot-world",
      },
      {
        title: "Emergency Response",
        description: "During an emergency evacuation, robots must adapt their behavior to guide people safely while maintaining communication",
        content: "During an emergency evacuation, robots must adapt their behavior to guide people safely while maintaining communication with emergency services. The robots need to handle stress, uncertainty, and dynamic environmental conditions while prioritizing human safety.",
        category: "robot-world",
      },
    ];

    defaultScenarios.forEach(scenario => {
      this.createScenario(scenario);
    });
  }

  // File operations
  async getFiles(category?: string, section?: string, fileType?: string): Promise<File[]> {
    let files = Array.from(this.files.values());
    
    if (category) {
      files = files.filter(file => file.category === category);
    }
    if (section) {
      files = files.filter(file => file.section === section);
    }
    if (fileType) {
      files = files.filter(file => file.fileType === fileType);
    }
    
    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      uploadedAt: new Date(),
      metadata: insertFile.metadata || null,
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Reasoner operations
  async getReasoners(category?: string): Promise<Reasoner[]> {
    let reasoners = Array.from(this.reasoners.values());
    
    if (category) {
      reasoners = reasoners.filter(reasoner => reasoner.category === category);
    }
    
    return reasoners;
  }

  async getReasoner(id: string): Promise<Reasoner | undefined> {
    return this.reasoners.get(id);
  }

  async createReasoner(insertReasoner: InsertReasoner): Promise<Reasoner> {
    const id = randomUUID();
    const reasoner: Reasoner = { ...insertReasoner, id };
    this.reasoners.set(id, reasoner);
    return reasoner;
  }

  // Scenario operations
  async getScenarios(category?: string): Promise<Scenario[]> {
    let scenarios = Array.from(this.scenarios.values());
    
    if (category) {
      scenarios = scenarios.filter(scenario => scenario.category === category);
    }
    
    return scenarios.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getScenario(id: string): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = randomUUID();
    const scenario: Scenario = {
      ...insertScenario,
      id,
      createdAt: new Date(),
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  // Search operations
  async searchFiles(query: string, category?: string, section?: string): Promise<File[]> {
    const files = await this.getFiles(category, section);
    const lowerQuery = query.toLowerCase();
    
    return files.filter(file => 
      file.originalName.toLowerCase().includes(lowerQuery) ||
      file.filename.toLowerCase().includes(lowerQuery) ||
      (file.metadata && JSON.stringify(file.metadata).toLowerCase().includes(lowerQuery))
    );
  }

  async searchScenarios(query: string, category?: string): Promise<Scenario[]> {
    const scenarios = await this.getScenarios(category);
    const lowerQuery = query.toLowerCase();
    
    return scenarios.filter(scenario =>
      scenario.title.toLowerCase().includes(lowerQuery) ||
      scenario.description.toLowerCase().includes(lowerQuery) ||
      scenario.content.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new MemStorage();
