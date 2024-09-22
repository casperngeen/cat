import os
import requests
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def get_cat(breed=None):
    base = "https://api.thecatapi.com/v1/images/search"
    headers = {
        "x-api-key": os.getenv("CAT_API_KEY")
    }
    print(breed)
    if not breed:
        response = requests.get(base, headers=headers)
    else:
        if len(breed) > 4:
            breed = breed[:4]
        breed_url = base + f"?has_breeds=1&breed_ids={breed}"
        response = requests.get(breed_url, headers=headers)
    
    # what will happen if the breed doesnt exist
    if response.status_code == 200:
        data = response.json()
        url = data[0]['url']
        return url
    else:
        try:
            error_message = response.json()
            return f"Error Code: {response.status_code}\n, Detailed error: {error_message}"
        except ValueError:
            return f"Error Code: {response.status_code}"
        
def extract_assistant_message(messages):
    for message in messages.data:
        if message.role == 'assistant':
            for content_block in message.content:
                if content_block.type == 'text':
                    print(content_block.text.value)
                    return {message.id: content_block.text.value}

        
def assistant_message(client: OpenAI, assistant, thread, user_prompt: str):
    # Pass a message to the assistant (user input)
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role='user',
        content=user_prompt
    )

    # Initiate the assistant run and poll for completion
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id
    )
    
    tool_outputs = []
    # Loop through each tool in the required action section
    if run.required_action:
        for tool in run.required_action.submit_tool_outputs.tool_calls:
            function_name = tool.function.name
            args = json.loads(tool.function.arguments)

            if function_name == 'get_cat':
                breed = args.get('breed', None)
                output = get_cat(breed)
                tool_outputs.append({
                    'tool_call_id': tool.id,
                    'output': output
                })

    # Submit all tool outputs at once after collecting them
    if tool_outputs:
        try:
            run = client.beta.threads.runs.submit_tool_outputs_and_poll(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )
            print("Tool outputs submitted successfully.")
        except Exception as e:
            print("Failed to submit tool outputs:", e)
    else:
        print("No tool outputs to submit.")

    if run.status == 'completed':
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )
        assistant_response = extract_assistant_message(messages)
        assistant_response["status"] = "completed"
        return assistant_response
    elif run.last_error:
        return {"status": run.status, "message": run.last_error.message}
    else:
        return {"status": run.status}