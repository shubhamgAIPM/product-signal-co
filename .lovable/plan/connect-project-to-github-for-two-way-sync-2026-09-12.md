# Connect Project to GitHub for Two-Way Sync

## Goal
Publish the current Signal Copilot codebase to a GitHub repository and enable Lovable's built-in two-way Git sync.

## What this does
- Creates a new GitHub repo containing the full project code (including the latest published version).
- Enables automatic push from Lovable → GitHub on every change.
- Enables pull from GitHub → Lovable when code is pushed to the repo from elsewhere.

## Steps

1. Open the Lovable editor's **Plus (+)** menu in the chat input (bottom-left).
2. Choose **GitHub → Connect project**.
3. Authorize the **Lovable GitHub App** when prompted by GitHub.
4. Select the GitHub account or organization that should own the repo.
5. Click **Create Repository** in Lovable to generate the repo and push the current codebase.
6. Verify the repo appears on GitHub with the latest files.

## Notes
- No source-code changes are required in the project.
- Only one GitHub account can be linked to a Lovable account at a time.
- Existing Git sync cannot import an existing repo; this flow creates a new one from the current project state.
