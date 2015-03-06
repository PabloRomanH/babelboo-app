Release cycle:
- Release
- Set next meeting day in >= 10 days
- >= 7 days to let the users use it  + development
- 3 days of interviews               + development
- Decision meeting
- Repeat


Deploy:
write email
git stuff
    git fetch
    git merge origin/master
npm install
npm test
restart node
    forever restartall
manual testing
send email

# Next release:
- Have fun, learn English in landing page
- Friendly URLs
- Make popular playlists change over time


# Bugfixes:
- /login can be accessed even when logged in
- fix ShareController to use new playlists service interface
- Test the upload of a file with an image extension that gm can't convert (not in local nor in mayhem).

# For future releases:
- Facebook page meta tags
- /api/user only returns playlistprogress when requested
- fillUser only returns (and downloads) playlistprogress when requested.
- When selecting a level in playlists view show popular playlists of that level.
- Popular playlists don't stay always the same.
- Playlists infinite scrolling.
- Social
    - Login.
    - Register.
- Going to an URL (besides http://www.babelboo.com) without being logged asks for user and password, then redirects to the requested URL.
- A) Questions at the beginning, answers at the end.
    - Button 'Answer now' that pauses video and shows answers.
- B) Questions at the end.
    - Remove boring part at the end of videos.
- Change medal indices and values to ALWAYS GOLD = 0, SILVER = 1, BRONZE = 1
- Sign up for category updates.
- Video not playing automatically to allow you to read the questions.
- Star playlists (bookmarks).
- Bookmarklet to suggest YouTube videos.
- Remove tags from cards.
- Focus on easier videos or on harder videos
- Make playlists for specific people.
- Smarter related playlists.
- Visual difficulty levels.
- Keep level after finishing playlist.


# Silly things to do when bored
- Refactor CSS
    - Materialize more stuff
- Create tests


# Development/deployment

- (*not necessary?) Testing node (Mocha + Chai + Sinon / Jasmine)
    - try out frameworks
- Testing E2E
        - Protractor + Jasmine: All desktop browsers (needs to run in Windows for IE and MacOS for Safari)
        - saucelabs.com ($$): EVERYTHING (including mobile)
        - CasperJS + Mocha: Webkit + Gecko
    - try out frameworks
- Deploy
        - Strider (es la ostia)
        - Ansible, Puppet ($$)
    - try out frameworks
- Ide in mayhem
    - sourcelair
    - nitrous.io
    - vim
    - own installation of cloud9


# Someday:

- Playlists
    - Playlist quality mark (playlists marked as good)

- Q&A
    * Questions after watching video (depends on user.abtesting.questionsatend == true)

- 9Gag (always something new + finished checking everything new)
    - "You got new stuff" reminder email
    * Old unvisited playlists appear at the bottom and are harder to reach

- Video-based playing
    - Manual search + related videos at the end

- Wiki (user-generated playlists, questions, difficulty adjustment, etc.)
    - self contained playlist creation tool
        - show video length
        - preview videos (clicking on the thumbnail, both in search and selected videos)
    - Interface to edit questions
    - Upvote/downvote difficulty
    - Comment on questions
    * Interface to edit playlists
    * Interface to add tags to playlist
    * Interface to create playlists (bonus: easily)

- Stack Overflow (milestones unlock privileges + rank visible to other users)
    - Learning goals? Can be implemented as badges
    - Reputation/badges per user
    - When do other users see them?
    - Unlocked privileges
    - Number of points to increase rank
    - Create playlists, modify other's playlists, modify other's questions, comment on questions
    - What gives points
