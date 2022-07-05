import { useState } from 'react';

const Statistics = (props) => {
  const { good, neutral, bad, stats } = props;
  return (
    <>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {stats.all}</p>
      <p>average {stats.average}</p>
      <p>positive {stats.positive} %</p>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const stats = {};
  stats.all = good + neutral + bad;
  stats.average = (good - bad) / stats.all || 0;
  stats.positive = (good / stats.all) * 100 || '-';

  return (
    <>
      <h1>give feedback</h1>
      <button onClick={() => setGood((prev) => prev + 1)}>good</button>
      <button onClick={() => setNeutral((prev) => prev + 1)}>neutral</button>
      <button onClick={() => setBad((prev) => prev + 1)}>bad</button>

      {stats.all ? (
        <Statistics good={good} neutral={neutral} bad={bad} stats={stats} />
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

export default App;
