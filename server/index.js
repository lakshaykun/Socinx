import express from 'express';
import { config } from './config/config.js';
import upsertRouter from './routes/upsertRouter.js';
import recommendationsRouter from './routes/recommendationsRouter.js';
import searchRouter from './routes/searchRouter.js';
import relatedRouter from './routes/relatedRouter.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Socinx API" });
});

app.use("/upsert", upsertRouter);
app.use("/recommendations", recommendationsRouter);
app.use("/search", searchRouter);
app.use("/related", relatedRouter);

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})