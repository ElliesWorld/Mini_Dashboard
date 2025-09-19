// Type definitions
interface Task {
  id: string;
  text: string;
  createdAt: string;
}

interface TaskManagerElements {
  taskInput: HTMLInputElement;
  addTaskBtn: HTMLButtonElement;
  taskList: HTMLElement;
  taskCount: HTMLElement;
}

// Task Manager Class
class TaskManager {
  private tasks: Task[] = [];
  private readonly STORAGE_KEY = 'library-notes';
  private elements: TaskManagerElements;

  constructor() {
    this.initializeElements();
    this.loadTasks();
    this.setupEventListeners();
    this.renderTasks();
  }

  // Initialize DOM elements with null checks
  private initializeElements(): void {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
    const taskList = document.getElementById('taskList') as HTMLElement;
    const taskCount = document.getElementById('taskCount') as HTMLElement;

    if (!taskInput || !addTaskBtn || !taskList || !taskCount) {
      throw new Error('Required task manager elements not found in DOM');
    }

    this.elements = {
      taskInput,
      addTaskBtn,
      taskList,
      taskCount
    };
  }

  // Load tasks from localStorage
  private loadTasks(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that parsed data is an array of tasks
        if (Array.isArray(parsed)) {
          this.tasks = parsed.filter(this.isValidTask);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.tasks = [];
    }
  }

  // Validate task structure
  private isValidTask(task: any): task is Task {
    return (
      task &&
      typeof task.id === 'string' &&
      typeof task.text === 'string' &&
      typeof task.createdAt === 'string'
    );
  }

  // Save tasks to localStorage
  private saveTasks(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
      this.updateTaskCount();
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }

  // Generate unique ID for tasks
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Format date for display
  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Add new task
  public addTask(text: string): void {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    if (trimmedText.length > 150) {
      alert('Note is too long. Please keep it under 150 characters.');
      return;
    }

    const newTask: Task = {
      id: this.generateId(),
      text: trimmedText,
      createdAt: this.formatDate(new Date())
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
    this.renderTasks();
    this.clearInput();
  }

  // Delete task
  public deleteTask(id: string): void {
    if (!id) return;
    
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.renderTasks();
  }

  // Edit task
  public editTask(id: string, newText: string): void {
    if (!id || !newText.trim()) return;

    const trimmedText = newText.trim();
    if (trimmedText.length > 150) {
      alert('Note is too long. Please keep it under 150 characters.');
      return;
    }

    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = trimmedText;
      this.saveTasks();
      this.renderTasks();
    }
  }

  // Start editing mode for a task
  public startEdit(id: string): void {
    if (!id) return;

    const taskItem = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
    if (!taskItem) return;

    taskItem.classList.add('editing');
    const editInput = taskItem.querySelector('.edit-input') as HTMLInputElement;
    if (editInput) {
      editInput.focus();
      editInput.select();
    }
    
    const actions = taskItem.querySelector('.task-actions') as HTMLElement;
    if (actions) {
      actions.innerHTML = `
        <button class="save-btn" onclick="taskManager.saveEdit('${id}')">✓</button>
        <button class="cancel-btn" onclick="taskManager.cancelEdit('${id}')">×</button>
      `;
    }
  }

  // Save edit
  public saveEdit(id: string): void {
    if (!id) return;

    const taskItem = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
    if (!taskItem) return;

    const editInput = taskItem.querySelector('.edit-input') as HTMLInputElement;
    if (editInput) {
      this.editTask(id, editInput.value);
    }
  }

  // Cancel edit
  public cancelEdit(id: string): void {
    this.renderTasks();
  }

  // Clear input field
  private clearInput(): void {
    this.elements.taskInput.value = '';
    this.elements.taskInput.focus();
  }

  // Update task count display
  private updateTaskCount(): void {
    const count = this.tasks.length;
    this.elements.taskCount.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
  }

  // Escape HTML to prevent XSS
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Render all tasks
  private renderTasks(): void {
    if (this.tasks.length === 0) {
      this.elements.taskList.innerHTML = '<div class="empty-tasks">No notes yet. Add one above!</div>';
      this.updateTaskCount();
      return;
    }

    this.elements.taskList.innerHTML = this.tasks.map(task => `
      <div class="task-item" data-id="${task.id}">
        <div class="task-content">
          <div class="task-text">${this.escapeHtml(task.text)}</div>
          <input type="text" class="edit-input" value="${this.escapeHtml(task.text)}" maxlength="150">
          <div class="task-date">${this.escapeHtml(task.createdAt)}</div>
        </div>
        <div class="task-actions">
          <button class="edit-btn" onclick="taskManager.startEdit('${task.id}')" title="Edit note">✏️</button>
          <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Delete note">🗑️</button>
        </div>
      </div>
    `).join('');

    this.updateTaskCount();
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Add task button
    this.elements.addTaskBtn.addEventListener('click', () => {
      this.addTask(this.elements.taskInput.value);
    });

    // Enter key in input
    this.elements.taskInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addTask(this.elements.taskInput.value);
      }
    });

    // Handle edit input enter key
    this.elements.taskList.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.classList.contains('edit-input')) {
        e.preventDefault();
        const taskItem = e.target.closest('[data-id]') as HTMLElement;
        if (taskItem) {
          const taskId = taskItem.getAttribute('data-id');
          if (taskId) {
            this.saveEdit(taskId);
          }
        }
      }
    });

    // Handle escape key to cancel editing
    this.elements.taskList.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && e.target instanceof HTMLInputElement && e.target.classList.contains('edit-input')) {
        e.preventDefault();
        this.renderTasks();
      }
    });
  }

  // Get task count (public method for external use)
  public getTaskCount(): number {
    return this.tasks.length;
  }

  // Get all tasks (public method for external use)
  public getAllTasks(): readonly Task[] {
    return [...this.tasks];
  }

  // Clear all tasks (public method)
  public clearAllTasks(): void {
    if (this.tasks.length === 0) return;
    
    if (confirm(`Are you sure you want to delete all ${this.tasks.length} notes?`)) {
      this.tasks = [];
      this.saveTasks();
      this.renderTasks();
    }
  }
}

// Initialize task manager and make it globally available
let taskManager: TaskManager;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    taskManager = new TaskManager();
    
    // Make it globally available for onclick handlers
    (window as any).taskManager = taskManager;
    
    console.log('Task Manager initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Task Manager:', error);
  }
});