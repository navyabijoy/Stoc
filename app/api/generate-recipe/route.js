// export async function query(data) {
// 	const response = await fetch(
// 		"https://api-inference.huggingface.co/models/openai-community/gpt2",
// 		{
// 			headers: {
// 				Authorization: "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.json();
// 	return result;
// }

// query({"inputs": "Can you please let us know more details about your "}).then((response) => {
// 	console.log(JSON.stringify(response));
// });


// import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { ingredients } = await req.json();
    const prompt = `Create a recipe using some or all of these ingredients: ${ingredients.join(", ")}. Include a title, ingredients list, and step-by-step instructions.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai-community/gpt2",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, max_length: 300 }),
      }
    );

    const result = await response.json();
    const recipe = result[0].generated_text;

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while generating the recipe." }, { status: 500 });
  }
}