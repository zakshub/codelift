# Security Model

Code submitted to CodeLift is untrusted.

## Non-negotiable rule

Never execute uploaded project code or run `npm install` directly on the main application server.

## Worker isolation

Conversion and build jobs must run in isolated workers with:

- CPU limits
- memory limits
- execution timeouts
- temporary filesystems
- restricted network access
- automatic workspace cleanup
- rate limiting
- upload size limits
- dependency/package safeguards

## Future execution flow

Frontend → API → Queue → Isolated Worker → Temporary Workspace → Analyze → Generate → Install/Build → Validate → ZIP → Storage → Download → Cleanup

## Threats to account for

- malicious source code
- malicious npm lifecycle scripts
- dependency confusion
- resource exhaustion
- oversized archives
- path traversal
- secrets in uploaded files
- archive bombs
- repeated abusive jobs
- network exfiltration

Security requirements must be implemented before allowing arbitrary uploaded projects to execute in production.
