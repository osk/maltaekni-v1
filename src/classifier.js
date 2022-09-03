import express from 'express';
import { query } from './db.js';

export const router = express.Router();

async function getSentences() {
  const result = await query('SELECT id, input FROM superintendent ORDER BY random() LIMIT 1');

  if (!result || result.rows.length !== 1) {
    return null;
  }

  const [{ id, input }] = result.rows;

  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    console.error('unable to parse json', e);
    return null;
  }

  if (typeof data.content !== 'string') {
    console.error('data from json is not string');
    return null;
  }

  const split = data.content.split('\n\n');

  try {
    const sentence_one = split[0];
    const sentence_two = split[1];

    return {
      id,
      sentence_one,
      sentence_two,
    };
  } catch (e) {
    console.error('error parsing sentences', e, split, data);
    return null;
  }
}

async function index(req, res) {
  let error = false;
  let sentences = {};

  try {
    sentences = await getSentences();

    if (!sentences) {
      error = true;
      sentences = {};
    }
  } catch (e) {
    console.error('unable to get senrences', e);
  }

  res.render('index', {
    error,
    sentence_one: sentences.sentence_one,
    sentence_two: sentences.sentence_two,
    id: sentences.id,
  });
}

async function track(id, value) {
  // Constraints on db are our validation
  query('INSERT INTO classifications (sentences_id, output) VALUES ($1, $2);', [id, value]);
}

async function classify(req, res) {
  // fire && forget
  track(req.body.id, req.body.value);

  if (req.headers['x-fetch'] == '1') {
    // It came from client-side js fetch POST
    let sentences = await getSentences();
    let error = false;

    if (!sentences) {
      error = true;
      sentences = {};
    }

    res.json({
      error,
      sentence_one: sentences.sentence_one,
      sentence_two: sentences.sentence_two,
      id: sentences.id,
    });
  } else {
    // It came from a POST
    res.redirect('/');
  }
}

router.get('/', index);
router.post('/classify', classify);
