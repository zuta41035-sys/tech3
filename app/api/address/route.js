import clientPromise from "@/config/mongodb";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("Tech3_Stores"); 
    const collection = db.collection("addresses");

    const data = await request.json();

    const result = await collection.insertOne(data);

    return new Response(JSON.stringify({ message: "Address saved", id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving address:", error);
    return new Response(JSON.stringify({ error: "Failed to save address" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
