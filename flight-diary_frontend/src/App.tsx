// flight-diary_frontend/src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DiaryEntry, Weather, Visibility } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState(''); // Added comment state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<DiaryEntry[]>('http://localhost:3000/api/diaries')
      .then(response => setDiaries(response.data))
      .catch(error => console.error('Error fetching diaries:', error));
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = { date, weather, visibility, comment }; // Include comment
    axios.post<DiaryEntry>('http://localhost:3000/api/diaries', newDiary as NewDiaryEntry)
      .then(response => {
        setDiaries(diaries.concat(response.data));
        setDate('');
        setWeather(Weather.Sunny);
        setVisibility(Visibility.Good);
        setComment(''); // Reset comment
        setError(null);
      })
      .catch(error => {
        const message = error.response?.data || error.message || 'Unknown error';
        setError(message);
      });
  };

  return (
    <div>
      <h1>Flight Diaries</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addDiary}>
        <div>
          Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          Weather:
          {Object.values(Weather).map(w => (
            <label key={w}>
              <input
                type="radio"
                value={w}
                checked={weather === w}
                onChange={e => setWeather(e.target.value as Weather)}
              /> {w}
            </label>
          ))}
        </div>
        <div>
          Visibility:
          {Object.values(Visibility).map(v => (
            <label key={v}>
              <input
                type="radio"
                value={v}
                checked={visibility === v}
                onChange={e => setVisibility(e.target.value as Visibility)}
              /> {v}
            </label>
          ))}
        </div>
        <div>
          Comment: <input value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>
      <ul>
        {diaries.map(diary => (
          <li key={diary.id}>
            {diary.date} - Weather: {diary.weather}, Visibility: {diary.visibility}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;