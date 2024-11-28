import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { ILevel } from "app/models/interfaces/level";

@Component({
  selector: "app-add-level",
  templateUrl: "./add-level.component.html",
  styleUrls: ["./add-level.component.css"],
})
export class AddLevelComponent implements OnInit {
  @Input() educationalUnit: IEducationalUnit | null = null;
  @Input() levels: ILevel[] = [];
  // @Output() levelsEmitter: EventEmitter<ILevel[]> = new EventEmitter();
  @Output() levelsEmitter: EventEmitter<string[]> = new EventEmitter();
  @Output() closeEmitter: EventEmitter<boolean> = new EventEmitter();

  public selected: boolean = false;
  public selectedLevels: string[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.educationalUnit.levels) {
      this.educationalUnit.levels = [];
    } else {
      this.selectedLevels = this.educationalUnit.levels;
    }
  }

  public validateLevel(level: ILevel): boolean {
    // return this.educationalUnit.levels
    //   ? this.educationalUnit.levels.includes(level.uid)
    //   : false;
    return this.selectedLevels.includes(level.uid);
  }

  public addLevel(level: ILevel, state: boolean, i: number): void {
    console.log({ level, state, i });
    if (!state && this.validateLevel(level)) {
      this.selectedLevels.splice(i, 1);
      this.selected = true;
    }

    if (state && !this.validateLevel(level)) {
      this.selectedLevels.push(level.uid);
      this.selected = true;
    }
  }

  public send(): void {
    return this.levelsEmitter.emit(this.selectedLevels ?? []);
  }

  public close(): void {
    return this.closeEmitter.emit(true);
  }
}
