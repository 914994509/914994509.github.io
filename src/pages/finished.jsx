import React from 'react';
import TodoList from '../components/TodoList';

function Finished() {
  return (
    <div>
      <TodoList filter="finished" />
    </div>
  );
}

export default Finished;
