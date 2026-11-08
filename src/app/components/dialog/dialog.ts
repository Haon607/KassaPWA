import { ChangeDetectorRef, Component, ElementRef, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogAttributes, DialogButton, DialogResult, DialogService } from './dialog.service';

@Component({
    selector: 'app-dialog-component',
    templateUrl: './dialog.html',
    standalone: true,
    styleUrl: './dialog.css',
})
export class Dialog implements OnDestroy {
    @ViewChild('dialogElement')
    private dialogElement?: ElementRef<HTMLDialogElement>;

    protected attributes: WritableSignal<DialogAttributes> = signal({
        level: 'info',
        message: '?',
    });

    private readonly subscription: Subscription;

    constructor(
        private readonly dialogService: DialogService,
        private readonly changeDetector: ChangeDetectorRef,
    ) {
        this.subscription = dialogService.dialog.subscribe((attributes) => this.displayPopUp(attributes));
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.dialogService.resolve(undefined);
    }

    protected icon(): string {
        switch (this.attributes().level) {
            case 'error':
                return '×';
            case 'warning':
                return '!';
            case 'info':
                return 'i';
            case 'success':
                return '✓';
        }
    }

    protected title(): string {
        if (this.attributes().title) {
            return this.attributes().title!;
        }

        switch (this.attributes().level) {
            case 'error':
                return 'Fehler';
            case 'warning':
                return 'Achtung';
            case 'success':
                return 'Erledigt';
            case 'info':
                return 'Hinweis';
        }
    }

    protected buttons(): DialogButton[] {
        const buttons = this.attributes().buttons;
        return buttons?.length
            ? buttons
            : [{ label: 'Schließen', appearance: 'primary' }];
    }

    protected respond(result: DialogResult): void {
        this.dialogElement?.nativeElement.close();
        this.dialogService.resolve(result);
    }

    protected dismiss(event?: Event): void {
        event?.preventDefault();

        if (this.attributes().dismissible === false) {
            return;
        }

        this.respond(undefined);
    }

    protected dismissFromBackdrop(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.dismiss();
        }
    }

    private displayPopUp(attributes: DialogAttributes): void {
        this.attributes.set(attributes);
        this.changeDetector.detectChanges();

        const modal = this.dialogElement?.nativeElement;
        if (modal && !modal.open) {
            modal.showModal();
        }
    }
}
