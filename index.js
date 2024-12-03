const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());  // Allow CORS for all requests

// Create the route to fetch repos for a user
app.get('/api/repos/:userId', async (req, res) => {
    const { userId } = req.params;  // Get the userId from the URL

    try {
        // Fetch repos from GitHub API
        const reposResponse = await axios.get(`https://api.github.com/users/${userId}/repos`);
        const repos = reposResponse.data;

        // Fetch languages for each repo
        const repoDetails = await Promise.all(
            repos.map(async (repo) => {
                const languagesResponse = await axios.get(repo.languages_url);
                return {
                    name: repo.name,
                    languages: languagesResponse.data,
                };
            })
        );

        // Send the repo details as JSON
        res.json(repoDetails);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
