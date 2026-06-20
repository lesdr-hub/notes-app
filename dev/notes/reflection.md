**This reflection captures the state and insights of the project immediately prior to final submission.**

This is the absolute MVP implementation of a productivity and consistency dashboard I'd like to work out in time - Google Keep style notes would be the primary focus, though not the selling point. 

**Current features include:**
- Basic CRUD note taking
- Basic hybrid SSR/CSR
- Local authentication
- Persistent sessions
- Google Keep style workflow (incomplete)

**Primary plans for this project in the future:**

**SECURITY**
- Google Oauth + email verification 
- Password recovery

**STABILITY**
- Fixing the current CSR process of rerendering the entire notes list after editing/deleting a note
- Rate limiting 
- Limit number of notes to prevent getting all user notes all at once (Lazy loading/infinite scrolling)
- General optimizations that I may not know yet 

**FEATURES**
- !! TOP PRIORITY !!: Archiving system (big part of Keep workflow)
- Embedded to-do list and task system
- Analytics

**QOL**
- UI changes, generally just making the dashboard feel more refined 
- Basic landing page 

HOWEVER - I may just implement these features after transferring the code base into Next.js + React, for TypeScript type validation, Tailwind CSS, and React UI. Not a big fan of EJS syntax - looks way too complicated. 

It gets easier the more you work with it though - I like to think of it as a sandwich, with everything between it being what's being altered.

I went through deliberate effort to ensure that the project's routes, controllers, and models are properly organized and scalable. Though they may lack optimization - for example, rate limiting hasn't properly been implemented, nor has limiting the number of notes - so theoretically if a user has a large number of notes, the database and dashboard would need to spend a decent amount of time getting them and rendering them all. 

The latter of those two is the primary issue I'd like to fix once I have the chance - not a major issue with zero users, in a real world scenario it's a decently sized problem. Client side JS refetches and rerenders the note list every time a single note is altered, deleted, or added - meaning that with a lot of notes, the tiniest actions add a ton of problems. Maybe just append the updated/created/deleted note at the beginning of the note-container html? Better to just replace the single note rather than everything constantly. I googled a couple solutions - pagination or lazy loading/infinite scrolling are the main ones that come up. I'll probably implement the latter to better replicate Keep workflow. 

**SOME THINGS:**
The most difficult part of the project was connecting the frontend and backend in a way that preserved the Google Keep workflow. Rendering notes server-side was straightforward, sure, but synchronizing note edits and real time UI updates without full page reloads required some more thought than I'd expected.

EJS was a bit of a learning curve. Like I mentioned earlier, it gets easier the longer you use it, and I do understand the use cases. Main issues for me was syntax - was a pain to read. However, it definitely allowed me to visualize and hold the data flow in my head much more - for example, the dashboard needs the user object, which is directly implemented in the user tab. Same as settings - which alters the user object so that the theme preferences persist. It also needs unpinned and pinned notes specifically - however, doing it server-side kept the initial client rendering logic cleaner for an MVP. Anyway, keeping the data flow in my head during development was a really stimulating process. 

The express server, routes, and data flow through the backend itself was super simple, though - it's only basic CRUD, though I'd like to try and make it more complicated later on with analytics, as I mentioned above. I like to think of the server-side as a factory, with middleware as stations and routes as different conveyors to different faciliites of the factory - which was a very intuitive thing to grasp.

For future projects of this kind, though - I think I'll just minimize the data being sent back to the client, such as with notes being split between pinned and unpinned. Easier said than done! 

I think one of the most important things this project taught me about myself though was that I really prefer backend development over frontend development. Just feels more intuitive to me, personally. 

**NOTES ON THE RUBRIC**
The rubric details:
> Level 4 RESTful API endpoints for managing notes (GET, POST, PUT, DELETE) are efficiently implemented. Error handling covers various scenarios and provides clear messages.

PUT is said to be the primary HTTP method for updating notes - however, since my submission is deliberately meant to imitate the UI and workflow of Google Keep on a rudimentary level, PATCH is more semantically correct in this case. 

> Project is submitted with a **complete GitHub repository**, including a detailed README file. Additional notes provide insightful reflections on the development process and lessons learned.

You'll notice a massive gap after commit `69531f75c7a3bce1205ce194937990939231ad01`. I'd been focused on solving backend/frontend integration issues, which resulted in less frequent commits than I'd expected. Maintaining a more consistent commit history will be something I'll work on in the future.

You'll also notice that I removed test routes here - I was originally going to implement test routes, however I ran out of time. Still planning on adding them later, but for now will leave it as such.

**CLOSING**
This was a pretty fun project all in all - definitely tested what I knew a lot more than previous projects I've done. I probably could have made it way easier on myself by not replicating Google Keep and just reloading the page and keeping it entirely server side rendered - but I'm not complaining. Tackling things a bit above my current level is great for my learning.

I'll probably set up a home server myself and have family use it regularly. I'll probably also use it myself for simple things - if any of us run into any issues, I'll fix them then. 

*Upon submission, main branch will remain untouched and any additional features will be added in separate feature branches before being merged.
** No changes will be merged until after grading. 