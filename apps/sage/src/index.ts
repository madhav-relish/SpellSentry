import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import aiAnalysis from './routes/openAiAnalysis';


dotenv.config();

const app: Application = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("SpellSenty backend API is up and running!");
  });


app.use('/api', aiAnalysis);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
