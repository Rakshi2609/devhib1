/**
 * Vercel Deploy — Creates a Vercel domain alias for the given subdomain.
 * Requires VERCEL_API_TOKEN in env.
 */
export async function deployToVercel(projectName: string, subdomain: string) {
  const domain = `${subdomain}.rakshithganjimut.xyz`

  // Add domain to Vercel project
  const res = await fetch(`https://api.vercel.com/v9/projects/${projectName}/domains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to add domain to Vercel')
  }

  return `https://${domain}`
}
