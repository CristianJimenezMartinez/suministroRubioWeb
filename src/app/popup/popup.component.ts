import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent {
  @Input() message: string = '';
  @Output() accepted: EventEmitter<void> = new EventEmitter();

  onAccept(): void {
    this.accepted.emit();
  }
}
