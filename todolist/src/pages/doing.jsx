import React from 'react';
import TodoList from '../components/TodoList';

function Doing() {
  return (
    <div>
      <TodoList filter="doing" />
    </div>
  );
}

export default Doing;
