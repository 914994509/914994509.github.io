import React from 'react';
import TodoList from '../components/TodoList';

function All() {
  return (
    <div>
      <TodoList filter="all" />
    </div>
  );
}

export default All;