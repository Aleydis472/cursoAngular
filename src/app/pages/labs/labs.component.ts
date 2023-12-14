import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {


  name = signal('Ale');
  task = signal([
    'Instalar Angular CLI',
    'Crear proyecto',
    'Crear componente',
    'Crear servicio'
  ])


  colorCtrl = new FormControl();
  withCtrl = new FormControl(50, { nonNullable: true });
  nameCtrl = new FormControl('nicolas',
    {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3)]
    });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }


  changeHandle(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue); //modificar ese valor 
    console.log(event);
  }

  keydomHandler(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    console.log(input);

  }
}
