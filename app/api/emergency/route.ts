export async function POST() {
  console.log("🚨 Emergency triggered")
  return Response.json({ success: true })
}