import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    return new HttpHeaders({
      'X-USERNAME': username,
      'X-PASSWORD': password
    });
  }

  getTasksWithCustomCredentials(user: string, pass: string): Observable<Task[]> {
    const customHeaders = new HttpHeaders({
      'X-USERNAME': user,
      'X-PASSWORD': pass
    });
    return this.http.get<Task[]>(this.apiUrl, { headers: customHeaders });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`, { headers: this.getHeaders() });
  }

  getTasksByTitle(title: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/title/${title}`, { headers: this.getHeaders() });
  }
}