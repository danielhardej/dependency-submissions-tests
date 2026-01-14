import { Octokit } from 'octokit'
// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const response = await octokit.request('POST /repos/{owner}/{repo}/dependency-graph/snapshots', {
  owner: 'danielhardej',
  repo: 'dependency-submissions-tests',
  version: 0,
  sha: '023f32073265163c2525f987609a6643e695f755',
  ref: 'refs/heads/not-main',
  job: {
    id: process.env.GITHUB_RUN_ID,
    correlator: `${process.env.GITHUB_WORKFLOW}-${process.env.GITHUB_JOB}`,
    html_url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  },
  detector: {
    name: 'component-detection-action',
    version: process.env.GITHUB_ACTION_REF || 'v0.1.0',
    url: 'https://github.com/advanced-security/component-detection-dependency-submission-action'
  },
  scanned: new Date().toISOString(),
  manifests: {
    'package-lock.json': {
      name: 'package-lock.json',
      file: {
        source_location: 'package-lock.json'
      },
      resolved: {
        '@actions/core': {
          package_url: 'pkg:/npm/%40actions/core@1.1.9',
          dependencies: [
            '@actions/http-client'
          ]
        },
        '@actions/http-client': {
          package_url: 'pkg:/npm/%40actions/http-client@1.0.7',
          dependencies: [
            'tunnel'
          ]
        },
        tunnel: {
          package_url: 'pkg:/npm/tunnel@0.0.6'
        }
      }
    }
  },
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

// Log the full response for debugging
console.log('::group::Dependency Submission API Response');
console.log('Status:', response.status);
console.log('Headers:', JSON.stringify(response.headers, null, 2));
console.log('Body:', JSON.stringify(response.data, null, 2));
console.log('::endgroup::');
