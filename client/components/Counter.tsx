import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
  min?: number;
  max?: number;
}

const Counter: React.FC<CounterProps> = ({ 
  initialValue = 0, 
  step = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
}) => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = () => {
    setCount((prevCount) => {
      const newCount = prevCount + step;
      return newCount <= max ? newCount : prevCount;
    });
  };

  const decrement = () => {
    setCount((prevCount) => {
      const newCount = prevCount - step;
      return newCount >= min ? newCount : prevCount;
    });
  };

  const reset = () => {
    setCount(initialValue);
  };

  return (
    <div className="counter card p-4">
      <div className="d-flex flex-column align-items-center">
        <h3 className="display-4 mb-4">{count}</h3>
        <div className="btn-group mb-3" role="group">
          <button 
            className="btn btn-danger"
            onClick={decrement}
            disabled={count <= min}
          >
            − {step}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={reset}
          >
            Reset
          </button>
          <button 
            className="btn btn-success"
            onClick={increment}
            disabled={count >= max}
          >
            + {step}
          </button>
        </div>
        {(min !== Number.MIN_SAFE_INTEGER || max !== Number.MAX_SAFE_INTEGER) && (
          <small className="text-muted">
            Range: {min === Number.MIN_SAFE_INTEGER ? '-∞' : min} to {max === Number.MAX_SAFE_INTEGER ? '+∞' : max}
          </small>
        )}
      </div>
    </div>
  );
};

export default Counter;
