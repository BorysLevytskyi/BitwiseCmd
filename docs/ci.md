# Continuous Integration Setup

The pull request workflow checks out a private test suite from `BitwiseCmdTests`. To allow the workflow to clone that repository, add a repository secret named `BITWISECMD_TESTS_TOKEN` that contains a GitHub personal access token with at least `repo` scope.

1. Generate a classic personal access token from your GitHub account with `repo` scope.
2. In the BitwiseCmd repository settings, open **Secrets and variables → Actions**.
3. Create a new repository secret named `BITWISECMD_TESTS_TOKEN` and paste the token value.

Once the secret is configured, rerun the pull request workflow so it can authenticate and complete the checkout step.
