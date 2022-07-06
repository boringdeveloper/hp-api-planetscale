import express from 'express';
import dotenv from "dotenv";
import mysql from 'mysql2/promise';

dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const app = express();

app.get('/', (req, res) => {
    res.json({ msg: 'Hello World' });
})

app.get('/characters', async (req, res) => {
    let status = 200;
    let response = {};

    try {
        const query = `SELECT * FROM hp_character`;
        const [ rows ] = await conn.query(query);
        response.data = rows;
    } catch (error) {
        console.error(error);
        status = 500;
        response.message = "Something went wrong.";
    } finally {
        res.status(status).json(response);
    }
});

app.get('/characters/:id', async (req, res) => {
    let status = 200;
    let response = {};

    const { id } = req.params;

    if (isNaN(Number(id))) {
		status = 400;
		response.message = 'Invalid request. Please make sure the id you are searching for is a number';
		return res.status(status).json(response);
	}
    
    try {
        const query = `SELECT * FROM hp_character WHERE hp_character.id=?`;
        const [rows] = await conn.query(query, [id]);

        response.data = rows[0];

        if (!rows[0]) {
            status = 404;
            response.message = `Couldn't find a character with an id of ${id}`;
        }
    } catch (error) {
        console.error(error);
        status = 500;
        response.message = "Something went wrong.";
    } finally {
        res.status(status).json(response);
    }
});

app.get('/wands', async (req, res) => {
    let status = 200;
    let response = {};

    try {
        const query = `SELECT * FROM wand`;
        const [ rows ] = await conn.query(query);
        response.data = rows;
    } catch (error) {
        console.error(error);
        status = 500;
        response.message = "Something went wrong.";
    } finally {
        res.status(status).json(response);
    }
});

app.get('/wands/:id', async (req, res) => {
    let status = 200;
    let response = {};
    
    const { id } = req.params;
    
    if (isNaN(Number(id))) {
		status = 400;
		response.message = 'Invalid request. Please make sure the id you are searching for is a number';
		return res.status(status).json(response);
	}

    try {
        const query = `SELECT * FROM wand WHERE wand.id=?`;
        const [rows] = await conn.query(query, [id]);

        response.data = rows[0];

        if (!rows[0]) {
            status = 404;
            response.message = `Couldn't find a wand with an id of ${id}`;
        }
    } catch (error) {
        console.error(error);
        status = 500;
        response.message = "Something went wrong.";
    } finally {
        res.status(status).json(response);
    }
});

app.listen(3001, () => {
    console.log('listening to port 3001');
});