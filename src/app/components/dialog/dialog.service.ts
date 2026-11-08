import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    /**
     * Kept public so existing callers that use `dialog.next(...)` continue to work.
     * Prefer `open` or `confirm` when the caller needs the selected result.
     */
    public readonly dialog = new Subject<DialogAttributes>();

    private activeResolver?: (result: DialogResult) => void;

    public open(attributes: DialogAttributes): Promise<DialogResult> {
        this.resolve(undefined);

        return new Promise((resolve) => {
            this.activeResolver = resolve;
            this.dialog.next(attributes);
        });
    }

    public async confirm(message: string, options: ConfirmDialogOptions = {}): Promise<boolean> {
        const result = await this.open({
            level: options.level ?? 'warning',
            title: options.title ?? 'Bestätigung',
            message,
            dismissible: true,
            buttons: [
                {
                    label: options.cancelLabel ?? 'Abbrechen',
                    value: false,
                    autofocus: true,
                },
                {
                    label: options.confirmLabel ?? 'Bestätigen',
                    value: true,
                    appearance: 'primary',
                },
            ],
        });

        return result === true;
    }

    public resolve(result: DialogResult): void {
        const resolver = this.activeResolver;
        this.activeResolver = undefined;
        resolver?.(result);
    }
}

export interface DialogAttributes {
    level: 'error' | 'warning' | 'success' | 'info';
    title?: string;
    message: string;
    buttons?: DialogButton[];
    dismissible?: boolean;
}

export interface DialogButton {
    label: string;
    value?: DialogResult;
    appearance?: 'default' | 'primary';
    autofocus?: boolean;
}

export interface ConfirmDialogOptions {
    title?: string;
    level?: DialogAttributes['level'];
    confirmLabel?: string;
    cancelLabel?: string;
}

export type DialogResult = string | number | boolean | undefined;
