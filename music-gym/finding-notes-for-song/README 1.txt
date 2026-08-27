HOW TO ADD SONGS
================

1. Drop your audio files (MP3, WAV, M4A, etc.) directly into this "songs" folder.
   Example: songs/yellow_coldplay.mp3

2. Open index.html, log in as Teacher (andrew / 156251).

3. Go to "Manage Songs" and click "Add a New Song":
   - Audio Filename: must exactly match the file you placed here (e.g. yellow_coldplay.mp3)
   - Title / Artist: whatever you like, shown to students
   - Root Note (Answer): the song's root/tonic note — this is the answer key
   - Scale / Mode (Answer): Major, Natural Minor, Dorian, etc. — this is the answer key
   - Key Signature: optional label, or click "Auto" to fill it in for Major/Natural Minor
   - BPM: the song's tempo — required for measure-based looping
   - Beats per Measure: the top number of the time signature (4 for 4/4, 3 for 3/4, 6 for 6/8, etc.)
   - Start Offset: if the song has a pickup/intro before beat 1 of measure 1, enter that many
     seconds here so measure-based loops line up correctly. Leave as 0 if the first downbeat
     is at the very start of the file.

4. Click "Add Song". Students will immediately see it in their song list.

NOTES
-----
- This app must be served through a local web server (e.g. VS Code Live Server), not opened
  directly as a file:// URL, or the browser will block audio loading.
- File names are case-sensitive on some systems — copy them exactly as they appear on disk.
- You can edit or delete a song at any time from the "Manage Songs" tab; students' scores for
  that song are kept separately and won't be lost if you just edit the answer key.
