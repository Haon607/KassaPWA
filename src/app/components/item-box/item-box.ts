import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from "../../models/item";

@Component({
  selector: 'app-item-box',
  imports: [],
  templateUrl: './item-box.html',
  standalone: true,
  styleUrl: './item-box.css'
})
export class ItemBox {
  @Input() item!: Item;
  @Output() clickAction = new EventEmitter<void>();
  @Output() holdAction = new EventEmitter<void>();

  private pressTimer: any;
  private isHolding = false;
  private readonly holdThreshold = 500;

  onPress(event: PointerEvent) {
    this.isHolding = false;
    this.pressTimer = setTimeout(() => {
      this.isHolding = true;
      this.holdAction.emit();
    }, this.holdThreshold);
  }

  onRelease(event: PointerEvent) {
    clearTimeout(this.pressTimer);
    if (!this.isHolding) {
      this.clickAction.emit();
    }
  }

  onCancel() {
    clearTimeout(this.pressTimer);
  }
}
