import { Component, Injector, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { state } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'crear proyect',
      completed: true
    },
    {
      id: Date.now(),
      title: 'crear componentes',
      completed: false
    }
  ]);

  filter = signal('all');
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter(task => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    return tasks;
  })

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  injector = inject(Injector);

  constructor() {
    /* effect(() => {
      const tasks = this.tasks();
      console.log('run effect');

    }) */
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector })
  }

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
    this.tasks.update((task) => [...task, newTask]); //crea un nuevo estado, agerga las tareas que ya tenia y al final la nueva tarea
  }

  updateTask(index: any) {
    this.tasks.update((task) => {
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
    this.tasks.update((task) => task.filter((task, position) => position !== index))
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false,
        }
      })
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task
      })
    });
  }

  chageFilter(filter: string) {
    this.filter.set(filter)
  }
}
