import { useState } from 'react';

const Statistics = (props) => {
  const { good, neutral, bad, stats } = props;
  return (
    <>
      <h1>statistics</h1>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={stats.all} />
      <StatisticLine text="average" value={stats.average} />
      <StatisticLine text="positive" value={stats.positive + ' %'} />
    </>
  );
};

const StatisticLine = (props) => {
  const { text, value } = props;
  return (
    <p>
      {text} {value}
    </p>
  );
};

const Button = (props) => {
  const { text, handleClick } = props;
  return <button onClick={handleClick}>{text}</button>;
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
      <Button text="good" handleClick={() => setGood((prev) => prev + 1)} />
      <Button
        text="neutral"
        handleClick={() => setNeutral((prev) => prev + 1)}
      />
      <Button text="bad" handleClick={() => setBad((prev) => prev + 1)} />

      {stats.all ? (
        <Statistics good={good} neutral={neutral} bad={bad} stats={stats} />
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

export default App;
