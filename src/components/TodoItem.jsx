import React, { useState, useRef, useEffect } from 'react';
import '../styles/TodoItem.css';

const TodoItem = ({ todo, toggleComplete, deleteTodo, startEditing, isCurrentlyEditing }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  // 处理点击外部关闭操作菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    startEditing(todo.id, todo.text);
    setShowActions(false);
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isCurrentlyEditing ? 'editing' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />

      <span className="todo-text">{todo.text}</span>
      <div className="actions-container" ref={actionsRef}>
        <button className="more-btn" onClick={toggleActions}>...</button>
        {showActions && (
          <div className="action-buttons">
            <button className="edit-btn" onClick={handleEdit}>编辑</button>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>删除</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem; 