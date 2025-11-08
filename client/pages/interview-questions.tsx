import React from 'react';
import Accordion from '../components/Accordion';
import TodoList from '../components/TodoList';
import Counter from '../components/Counter';

const InterviewQuestions = () => {
  const accordionItems = [
    {
      id: '1',
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and manage application state efficiently.',
    },
    {
      id: '2',
      title: 'What are React Hooks?',
      content: 'React Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, useReducer, and useCallback.',
    },
    {
      id: '3',
      title: 'What is TypeScript?',
      content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces, which help catch errors during development and improve code maintainability.',
    },
    {
      id: '4',
      title: 'What is the Virtual DOM?',
      content: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by comparing the virtual DOM with the real DOM and only updating the parts that have changed.',
    },
  ];

  const initialTodos = [
    { id: '1', text: 'Learn React', completed: true },
    { id: '2', text: 'Learn TypeScript', completed: true },
    { id: '3', text: 'Build awesome projects', completed: false },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">React TypeScript Interview Questions</h1>
      <p className="lead mb-5">
        This page showcases common React interview question components built with TypeScript.
      </p>

      {/* Accordion Section */}
      <section className="mb-5">
        <h2 className="mb-3">Accordion Component</h2>
        <p className="text-muted mb-3">
          An accordion allows users to toggle the visibility of content sections. Click on any item to expand/collapse it.
        </p>
        <Accordion items={accordionItems} allowMultiple={false} />
      </section>

      {/* Multiple Accordion Section */}
      <section className="mb-5">
        <h2 className="mb-3">Multi-Accordion Component</h2>
        <p className="text-muted mb-3">
          This variant allows multiple sections to be open at the same time.
        </p>
        <Accordion items={accordionItems} allowMultiple={true} />
      </section>

      {/* Todo List Section */}
      <section className="mb-5">
        <h2 className="mb-3">Todo List Component</h2>
        <p className="text-muted mb-3">
          A classic todo list with add, toggle, and delete functionality. Try adding new tasks!
        </p>
        <TodoList initialTodos={initialTodos} />
      </section>

      {/* Counter Section */}
      <section className="mb-5">
        <h2 className="mb-3">Counter Component</h2>
        <p className="text-muted mb-3">
          A simple counter with increment, decrement, and reset functionality.
        </p>
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Basic Counter</h5>
            <Counter />
          </div>
          <div className="col-md-4 mb-3">
            <h5>Counter with Custom Step</h5>
            <Counter initialValue={10} step={5} />
          </div>
          <div className="col-md-4 mb-3">
            <h5>Counter with Range Limits</h5>
            <Counter initialValue={5} min={0} max={10} />
          </div>
        </div>
      </section>

      {/* Component Features */}
      <section className="mb-5">
        <h2 className="mb-3">Features Demonstrated</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Accordion Component</h5>
                <ul className="list-unstyled">
                  <li>✓ TypeScript interfaces for type safety</li>
                  <li>✓ useState hook for state management</li>
                  <li>✓ Conditional rendering</li>
                  <li>✓ Event handling</li>
                  <li>✓ Props with default values</li>
                  <li>✓ Single/Multiple expand modes</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Todo List Component</h5>
                <ul className="list-unstyled">
                  <li>✓ CRUD operations (Create, Read, Update, Delete)</li>
                  <li>✓ Form input handling</li>
                  <li>✓ Keyboard events (Enter to submit)</li>
                  <li>✓ Array manipulation methods</li>
                  <li>✓ Computed values (statistics)</li>
                  <li>✓ Conditional styling</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Counter Component</h5>
                <ul className="list-unstyled">
                  <li>✓ State updates with callbacks</li>
                  <li>✓ Optional props with defaults</li>
                  <li>✓ Boundary validation</li>
                  <li>✓ Disabled button states</li>
                  <li>✓ Flexible configuration</li>
                  <li>✓ Multiple instances</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InterviewQuestions;
