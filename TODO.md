Release cycle:
- Release
- Set next meeting day in >= 10 days
- >= 7 days to let the users use it  + development
- 3 days of interviews               + development
- Decision meeting
- Repeat

Deploy:
write email
git stuff.
    git fetch
    git merge origin/master
restart node
    forever restartall
run script to update tags
run script to update nicknames.
run script fill-medalhistory
copy new playlists.
edit and save playlists with start or end time (to update duration in playlist object).
remove users' playlist_points
manual testing
    delete sepha and toni's playlistpoints and medalhistory
send email

# Next release:
- in the new peppa pig playlist videos start from a weird position.
- generate nickname for new user created from the API
- Registration
    - Link in landing to register.
    - Form with nickname, email, password.
    - Send mail confirmation.
    - Password recovery.
    - Registration at the end of guest player.
    - Registration at the end of guest booTV.
    - Registration logs user in.
- Remove autologin URL.
- Password hashing.
- Login with nickname or email (username).
- User area.
    - View to change nickname, password or avatar.
- User avatar in navbar and ranking.

# Design work:
- Formulario de registro en la landing con nombre de usuario, email y password.
- Pagina de "area de usuario" con avatar y la opcion de cambiar avatar, nombre de usuario y password (con casilla que vuelve a pedir la password actual).
- Formulario de login en la landing (rediseñar con link para recuperar password).
-

# Bugfixes:
- Shadow of navbar appears under cards in summary.

# For future releases:
- Playlists infinite scrolling.
- Social
    - Login.
    - Register.
    - Share.
- Going to an URL (besides http://www.babelboo.com) without being logged asks for user and password, then redirects to the requested URL.
- Remove unnecessary describes in karma tests and rename controller highest-level describes.
- Check that videos still work in YouTube.
- A) Questions at the beginning, answers at the end.
    - Button 'Answer now' that pauses video and shows answers.
- B) Questions at the end.
    - Remove boring part at the end of videos.
- Ranking (competitive social component).
    - Avatars automatically generated.
- Feedback form save the route where the user is a.t.m. of submitting.
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
- Cut current playlists.
- Keep level after finishing playlist.
-

# Silly things to do when bored


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
