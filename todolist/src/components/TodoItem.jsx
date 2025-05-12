import React, { useState } from 'react';
import '../styles/TodoItem.css';

const TodoItem = ({ todo, toggleComplete, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text); // 重置为原始文本
  };

  const handleSave = () => {
    if (editText.trim() !== '') {
      updateTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />

      {isEditing ? (
        <div className="edit-container">
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>保存</button>
            <button className="cancel-btn" onClick={handleCancel}>取消</button>
          </div>
        </div>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="action-buttons">
            <button className="edit-btn" onClick={handleEdit}>编辑</button>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>删除</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem; 