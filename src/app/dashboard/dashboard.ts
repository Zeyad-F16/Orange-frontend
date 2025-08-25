import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/Task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  isFormVisible = false;
  isEditing = false;
  currentTask: Task | null = null;
  taskData: Omit<Task, 'id'> = {
    title: '',
    description: '',
    status: 'TODO',
    dueDate: ''
  };

  filterStatus = 'ALL';
  Title = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  applyFilters(): void {
    let tempTasks = this.tasks;

    if (this.filterStatus !== 'ALL') {
      tempTasks = tempTasks.filter(task => task.status === this.filterStatus);
    }

    if (this.Title) {
      tempTasks = tempTasks.filter(task => 
        task.title.toLowerCase().includes(this.Title.toLowerCase())
      );
    }

    this.filteredTasks = tempTasks;
  }

  showCreateForm(): void {
    this.isEditing = false;
    this.isFormVisible = true;
    this.taskData = { title: '', description: '', status: 'TODO', dueDate: '' };
  }

  showEditForm(task: Task): void {
    this.isEditing = true;
    this.isFormVisible = true;
    this.currentTask = task;
    this.taskData = { ...task };
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.currentTask = null;
  }

  saveTask(): void {
    if (this.isEditing && this.currentTask) {
      this.taskService.updateTask(this.currentTask.id, this.taskData).subscribe(() => {
        this.loadTasks();
        this.hideForm();
      });
    } else {
      this.taskService.createTask(this.taskData).subscribe(() => {
        this.loadTasks();
        this.hideForm();
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.router.navigate(['/login']);
  }
}