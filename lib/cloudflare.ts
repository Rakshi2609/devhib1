export async function createSubdomain(projectName: string) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: projectName,
        content: 'cname.vercel-dns.com',
        proxied: true,
        ttl: 1
      })
    }
  )
  const data = await res.json()
  return `https://${projectName}.rakshithganjimut.xyz`
}
