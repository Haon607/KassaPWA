import { Component } from '@angular/core';
import { MenuOption } from "../../models/navigation";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.css'
})
export class Header {
  menus: MenuOption[] = [{
    optionName: "Einstellungen",
    navigateTo: "config"
  }, {
    optionName: "Kassa",
    navigateTo: "items"
  }, {
    optionName: "Abrechnung",
    navigateTo: "calculation"
  }];

  constructor(protected router: Router) {
  }

}
