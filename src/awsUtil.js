
const {SecretsManagerClient, GetSecretValueCommand} = require("@aws-sdk/client-secrets-manager");

const secret_name = "dev/sql";

const getSecret = async () => {
  const client = new SecretsManagerClient({
    region: "ap-south-1",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    return response?.SecretString || 'not found';
  } catch (error) {
    throw error;
  }
};

module.exports = { getSecret };