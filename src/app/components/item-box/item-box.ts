import { Component, Input } from '@angular/core';
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

}
