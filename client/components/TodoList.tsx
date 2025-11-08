import React, { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos?: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos = [] }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputValue, setInputValue] = useState<string>('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-list">
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={addTodo}>
            Add
          </button>
        </div>
      </div>
      
      <ul className="list-group">
        {todos.length === 0 ? (
          <li className="list-group-item text-muted">No tasks yet. Add one above!</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center flex-grow-1">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#6c757d' : 'inherit',
                  }}
                >
                  {todo.text}
                </span>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      
      <div className="mt-3">
        <small className="text-muted">
          Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | 
          Remaining: {todos.filter(t => !t.completed).length}
        </small>
      </div>
    </div>
  );
};

export default TodoList;
