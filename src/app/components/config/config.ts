import { Component } from '@angular/core';
import { Memory } from "../../services/memory.service";
import { Configuration } from "../../models/configuration";
import { FormsModule } from "@angular/forms";
import { compareObjects } from "../../../utils";

@Component({
  selector: 'app-config',
  imports: [
    FormsModule
  ],
  templateUrl: './config.html',
  standalone: true,
  styleUrl: './config.css'
})
export class Config {
  protected config: Configuration;
  protected originalConfig: Configuration;
  constructor(protected storage: Memory) {
    this.config = storage.getConfig();
    this.originalConfig = {...this.config};
  }

  save() {
    this.storage.setConfig(this.config);
    this.config = this.storage.getConfig();
    this.originalConfig = {...this.config};
  }

  cancel() {
    this.config = this.storage.getConfig();
  }

  protected readonly compareObjects = compareObjects;
}
