
Medals, playlist progress
- Award medals if reached summary and scored more than 0 points.
- Graphical feedback when question already answered.
- Medal graphical feedback.

REFACTOR SERVICES NAMES TO AVOID ENCOUNTERING STAFF LIKE user AND userData (see play.js)

IDEAS:
- Give extra points when a new medal is achieved for a playlist.


# To do while Toni out

- (*not necessary?) Testing node (Mocha + Chai + Sinon / Jasmine)
    - try out frameworks
- Testing node's Web API (postman / frisby.js + Jasmine / *Mocha + *Chai + *Supertest + [Sinon])
- Testing angular (Karma + Mocha + Chai + Sinon / Jasmine)
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

- Playlist completion (visual cue that marks a playlist as watched or completed) (mostly done, CSS not finished)


# Want to think about after more feedback comes in

- Show # of videos in playlist card.
- Remove tags from playlists card.
- Highlight (or something) 'Next' button after answering.
- Rethink levels and tags behaviour.
- Visual difficulty levels
- Different levels of finishing a playlist (stars)


# Functionality to maybe test in the future:

- Playlists
    - Playlist quality mark (playlists marked as good)
    * Search by tag
    * Playlist tags
    * Playlist storage (DB)
    * Playlist reproduction

- Q&A
    * Questions completed (visual cue that marks a playlist as answered)
    * Questions while playing video
    * Questions after watching video (depends on user.abtesting.questionsatend == true)

- 9Gag (always something new + finished checking everything new)
    - "You got new stuff" reminder email
    * "Unlocking" of new playlists that appear as new to the user every day of use (depends on user.abtesting.ninegag == true)
    * Per-user hiding of some playlists at first use
    * Old unvisited playlists appear at the bottom and are harder to reach

- Video-based playing
    - Endless mode.
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