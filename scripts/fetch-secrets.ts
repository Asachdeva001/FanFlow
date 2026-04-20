const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');

const client = new SecretManagerServiceClient();
const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'virtuprompt';

async function fetchSecrets() {
  try {
    console.log('Fetching secrets from Google Secret Manager...');
    const name = `projects/${projectId}/secrets/fanflow-env/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });

    const payload = version.payload.data.toString('utf8');
    
    // Write down to true local env for build processes
    fs.writeFileSync('.env', payload);
    console.log('Successfully wrote secrets to .env');
  } catch (err) {
    console.error('Failed to fetch secrets:', err);
    process.exit(1);
  }
}

fetchSecrets();
