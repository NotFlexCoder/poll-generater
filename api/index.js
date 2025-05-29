let polls = {};
let pollIdCounter = 1;

export default function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    res.status(405).json({ error: 'Only GET allowed' });
    return;
  }

  const { action, question, options, pollId, optionIndex } = query;

  if (action === 'create') {
    if (!question || !options) {
      res.status(400).json({ error: 'Missing question or options' });
      return;
    }
    // options should be a comma separated string in URL, parse it
    const optsArray = Array.isArray(options)
      ? options
      : options.split(',').map(o => o.trim()).filter(Boolean);

    if (optsArray.length < 2) {
      res.status(400).json({ error: 'At least two options required' });
      return;
    }

    const id = (pollIdCounter++).toString();
    polls[id] = {
      question,
      options: optsArray.map(opt => ({ text: opt, votes: 0 })),
    };
    res.status(201).json({ pollId: id });
    return;
  }

  if (action === 'vote') {
    if (!pollId || optionIndex === undefined) {
      res.status(400).json({ error: 'pollId and optionIndex required' });
      return;
    }
    const poll = polls[pollId];
    const idx = Number(optionIndex);
    if (!poll || isNaN(idx) || idx < 0 || idx >= poll.options.length) {
      res.status(404).json({ error: 'Poll or option not found' });
      return;
    }
    poll.options[idx].votes++;
    res.status(200).json({ message: 'Vote recorded' });
    return;
  }

  if (action === 'result') {
    if (!pollId || !polls[pollId]) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    res.status(200).json(polls[pollId]);
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}
