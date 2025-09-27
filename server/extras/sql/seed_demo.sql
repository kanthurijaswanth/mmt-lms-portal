-- DEMO Experiments with knowledge_md and your filenames

-- 1) Sine Wave
INSERT INTO experiments
(title, slug, description, instructions_md, knowledge_md, grc_filename, max_marks)
VALUES
(
  'Sine Wave Generation (QT GUI)',
  'sine-wave',
  'Generate and observe a 1 kHz sine wave. Adjust amplitude/frequency and view in QT GUI.',
  '### Objective
Create a basic sine wave in GNU Radio, visualize it and experiment with parameters.

#### Steps
1) Open the flowgraph.
2) Set Frequency = 1 kHz, Amplitude = 0.7.
3) Observe waveform in QT Time Sink.
4) Capture a screenshot and note observations.',
  '#### What you''ll learn
- Signal source basics (sine)
- Sampling rate and frequency relationship
- Time vs frequency domain views',
  'sineWaveGRC.grc',   -- your actual file name
  10
)
ON CONFLICT (slug) DO NOTHING;

-- 2) AM Mod/Demod
INSERT INTO experiments
(title, slug, description, instructions_md, knowledge_md, grc_filename, max_marks)
VALUES
(
  'AM Mod/Demod (QT GUI)',
  'am-mod-demod',
  'Amplitude modulation and demodulation chain with QT GUIs.',
  '### Objective
Build an AM mod/demod chain and validate recovered audio.

#### Steps
1) Tone source -> Multiply -> Add DC offset -> transmit path.
2) Demodulate using envelope/quadrature demod.
3) Observe time/frequency plots and audio sink.
4) Submit screenshots + short notes.',
  '#### What you''ll learn
- AM concept and modulation index
- Envelope detection vs quadrature demod
- Practical gain/offset tuning',
  'AM_Modulation.grc',  -- your actual file name
  15
)
ON CONFLICT (slug) DO NOTHING;

-- 3) (Optional) NBFM Receiver placeholder (only if you add the .grc later)
-- INSERT INTO experiments (title, slug, description, instructions_md, knowledge_md, grc_filename, max_marks)
-- VALUES (..., 'nbfm-receiver', ..., 'nbfm_receiver.grc', 20)
-- ON CONFLICT (slug) DO NOTHING;

-- Assign to student id 3 (Rahul) if not already assigned
INSERT INTO student_experiments (student_id, experiment_id, status)
SELECT 3, e.id, 'pending'
FROM experiments e
WHERE e.slug IN ('sine-wave','am-mod-demod')
  AND NOT EXISTS (
    SELECT 1 FROM student_experiments se WHERE se.student_id=3 AND se.experiment_id=e.id
  );
