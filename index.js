let polls = {};
let pollIdCounter = 1;

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'POST') {
    const { action, question, options, pollId, optionIndex } = req.body || {};

    if (action === 'create') {
      if (!question || !options || !Array.isArray(options) || options.length < 2) {
        res.status(400).json({ error: 'Invalid question or options' });
        return;
      }
      const id = (pollIdCounter++).toString();
      polls[id] = {
        question,
        options: options.map((opt) => ({ text: opt, votes: 0 })),
      };
      res.status(201).json({ pollId: id });
      return;
    }

    if (action === 'vote') {
      if (!pollId || typeof optionIndex !== 'number') {
        res.status(400).json({ error: 'pollId and optionIndex required' });
        return;
      }
      const poll = polls[pollId];
      if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
        res.status(404).json({ error: 'Poll or option not found' });
        return;
      }
      poll.options[optionIndex].votes++;
      res.status(200).json({ message: 'Vote recorded' });
      return;
    }

    res.status(400).json({ error: 'Invalid action' });
  } else if (method === 'GET') {
    const { pollId } = req.query;
    if (!pollId || !polls[pollId]) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    res.status(200).json(polls[pollId]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
