import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import '../styles/TodoList.css';
import { NavLink } from 'react-router-dom';

const TodoList = ({ filter }) => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputText, setInputText] = useState('');

  // 保存todos到localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 添加新的待办事项
  const addTodo = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: inputText,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInputText('');
  };

  // 清空所有待办事项
  const clearAllTodos = () => {
    if (window.confirm('确定要清空所有待办事项吗？')) {
      setTodos([]);
    }
  };

  // 切换待办事项的完成状态
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 删除待办事项
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 更新待办事项文本
  const updateTodo = (id, newText) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // 根据过滤条件筛选待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'doing') return !todo.completed;
    if (filter === 'finished') return todo.completed;
    return true;
  });

  return (
    <div className="todo-list">
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="添加新待办事项..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">添加</button>
      </form>

      <div className="todos-container">
        <div className="filter-header">
          <nav className="nav-links">
            <NavLink to="/" end>所有</NavLink>
            <NavLink to="/doing">进行中</NavLink>
            <NavLink to="/finished">已完成</NavLink>
          </nav>
          <button
            onClick={clearAllTodos}
            className="clear-btn"
            disabled={todos.length === 0}
          >
            清空
          </button>
        </div>

        {filteredTodos.length === 0 ? (
          <p className="empty-message">📃暂无待办事项</p>
        ) : (
          <>
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList; 