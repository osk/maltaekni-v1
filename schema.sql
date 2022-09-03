DROP TABLE classifications;
CREATE TABLE classifications (
  sentences_id INTEGER,
  output INTEGER CHECK (output > 0 AND output < 5) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_classifications_sentences_id FOREIGN KEY (sentences_id) REFERENCES superintendent (id)
);
