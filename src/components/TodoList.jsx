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
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // 保存todos到localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 添加平滑滚动效果
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      // 防抖处理
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      return () => clearTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 添加新的待办事项或更新现有待办事项
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    if (isEditing) {
      // 更新现有待办事项
      updateTodo(editingTodoId, inputText);
      setIsEditing(false);
      setEditingTodoId(null);
    } else {
      // 添加新的待办事项
      const newTodo = {
        id: Date.now(),
        text: inputText,
        completed: false
      };
      setTodos([...todos, newTodo]);
    }
    setInputText('');
  };

  // 开始编辑待办事项
  const startEditing = (id, text) => {
    setIsEditing(true);
    setEditingTodoId(id);
    setInputText(text);
    // 将焦点设置到输入框
    document.querySelector('.todo-input').focus();
  };

  // 取消编辑
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTodoId(null);
    setInputText('');
  };

  // 清空所有待办事项
  const clearAllTodos = () => {
      setTodos([]);
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

  // 处理ESC键取消编辑
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isEditing) {
      cancelEditing();
    }
  };

  // 根据过滤条件筛选待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'doing') return !todo.completed;
    if (filter === 'finished') return todo.completed;
    return true;
  });

  return (
    <div className={`todo-list ${isScrolling ? 'scrolling' : ''}`}>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isEditing ? "编辑待办事项..." : "添加新待办事项..."}
          className="todo-input"
        />
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

        <div className="todos-list-wrapper">
          {filteredTodos.length === 0 ? (
            <p className="empty-message">📃暂无待办事项</p>
          ) : (
            <div className="todos-list">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  startEditing={startEditing}
                  isCurrentlyEditing={isEditing && editingTodoId === todo.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList; 