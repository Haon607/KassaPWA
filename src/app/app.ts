import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header],
    templateUrl: './app.html',
    standalone: true,
    styleUrl: './app.css'
})
export class App {
    // Prevent context menu everywhere
    @HostListener('document:contextmenu', ['$event'])
    onRightClick(event: Event) {
        event.preventDefault();
    }

    // Prevent long-press from triggering it on touch devices
    @HostListener('document:touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        if (event.touches.length > 1) return; // allow pinch zoom
        event.preventDefault();
    }
}
