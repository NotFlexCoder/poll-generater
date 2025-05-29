# 🗳️ Poll Generater API

A minimal Node.js (Next.js) API endpoint to create polls, cast votes, and fetch poll results. Ideal for integration in quick prototyping, small apps, or as a learning tool for REST API basics!

## 🚀 Features

- ⚡ Lightweight and fast with zero dependencies.
- 📝 Create polls with custom questions and multiple options.
- 🗳️ Vote on poll options by index.
- 📊 Fetch live poll results anytime.
- 🔐 Built as a Next.js API route, ready for serverless deployment.

## 🛠️ Requirements

- Node.js v14 or higher.
- Next.js project setup with API routes enabled (e.g., Vercel, Netlify).

## 📡 Usage

1. **Setup:**

   - Create a file under `pages/api/poll.js` in your Next.js project.
   - Paste the provided code:

     ```js
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
     ```

2. **Run Your Server**:

   ```bash
   npm run dev
   ```

3. **API Endpoints** (all via GET requests with query params):

   - **Create a Poll**  
     `?action=create&question=Your+Question&options=Option1,Option2,Option3`  
     Returns a new `pollId`.

   - **Vote on a Poll**  
     `?action=vote&pollId=1&optionIndex=0`  
     Vote for the option at `optionIndex` in the poll with `pollId`.

   - **Get Poll Results**  
     `?action=result&pollId=1`  
     Returns the poll question, options, and vote counts.

## 📄 Example Usage

- Create poll:  
  ```
  GET /api/poll?action=create&question=Favorite+color?&options=Red,Green,Blue
  ```
  Response:
  ```json
  { "pollId": "1" }
  ```

- Vote for first option:  
  ```
  GET /api/poll?action=vote&pollId=1&optionIndex=0
  ```
  Response:
  ```json
  { "message": "Vote recorded" }
  ```

- Get results:  
  ```
  GET /api/poll?action=result&pollId=1
  ```
  Response:
  ```json
  {
    "question": "Favorite color?",
    "options": [
      { "text": "Red", "votes": 1 },
      { "text": "Green", "votes": 0 },
      { "text": "Blue", "votes": 0 }
    ]
  }
  ```

## ⚠️ Limitations & Notes

- All data is stored in-memory and lost on server restart.
- Only GET requests are supported for simplicity.
- Options must be sent as a comma-separated string.
- Option index is zero-based.
- Minimal validation is implemented; improve as needed.

## 📝 License

This project is licensed under the License – see the [LICENSE](https://github.com/NotFlexCoder/NotFlexCoder/blob/main/LICENSE) file for details.
