import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const App = () => {
    const [userId, setUserId] = useState('');
    const [repos, setRepos] = useState([]);
    const [chartData, setChartData] = useState(null);

    const fetchRepos = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/repos/${userId}`);
            setRepos(response.data);

            // Aggregate language data for the pie chart
            const languageCount = {};
            response.data.forEach((repo) => {
                for (const [language, lines] of Object.entries(repo.languages)) {
                    languageCount[language] = (languageCount[language] || 0) + lines;
                }
            });

            // Set the chart data
            setChartData({
                labels: Object.keys(languageCount),
                datasets: [
                    {
                        label: 'Languages',
                        data: Object.values(languageCount),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    };

    return (
        <div>
            <h1>GitHub Repo Fetcher</h1>
            <input
                type="text"
                placeholder="Enter GitHub User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={fetchRepos}>Fetch Repositories</button>

            <table>
                <thead>
                    <tr>
                        <th>Repository</th>
                        <th>Languages</th>
                    </tr>
                </thead>
                <tbody>
                    {repos.map((repo, index) => (
                        <tr key={index}>
                            <td>{repo.name}</td>
                            <td>{Object.keys(repo.languages).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {chartData && (
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <Pie data={chartData} />
                </div>
            )}
        </div>
    );
};

export default App;
