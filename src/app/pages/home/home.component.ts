import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  task = signal<Task[]>([
    {
      id: Date.now(),
      title: 'crear proyect',
      completed: false
    },
    {
      id: Date.now(),
      title: 'crear componentes',
      completed: false
    }
  ])

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim()
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }
    this.task.update((task) => [...task, newTask]); //crea un nuevo estado, agerga las tareas que ya tenia y al final la nueva tarea
  }

  updateTask(index: any) {
    this.task.update((task) => {
      return task.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  deleteTask(index: number) {
    this.task.update((task) => task.filter((task, position) => position !== index))
  }
}
