# Guide on how to release a new version

1. Have write access to the repository
2. Have admin access to the itch.io page
3. Run the `Build & Deploy` workflow
    - branch: `main`
    - version bump: `patch`, `minor` or `major` (or `none` to not bump the version number)
4. Web version is now live
5. Create a github release based on the tag automatically created in step 3
    - base description off of the changelog
6. Pull the branch on a Windows machine
7. Have itch.io butler installed
8. Run `npm run itch:upload`

Of course steps 6+ can be skipped if nothing has changed for the desktop version.

Maybe one day more of those steps will be automated ;)
