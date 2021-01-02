# Startup-Portal Backend

## Local Development
Copy the `.env_template` file to `.env` file.
```bash
cp .env_template .env
```

Change the variables in `.env` file with your local settings. Since it is in `.gitignore`, Changes made there will not get committed to the repository.

Rest of the things, you know obviously.

### Branches
Currently, We want to host back-end on Vercel, So, Raw NodeJs code will be at `old-version` branch. `main` branch should always be ready to be deployed.