from flask import Flask, request, jsonify
from openai import OpenAI
import assistant

# Initialize Flask app
app = Flask(__name__)

client = OpenAI()
assistant_id = "asst_4XsBFLsL5RiNNwDFkhBsYYbK"
cat_assistant = client.beta.assistants.retrieve(assistant_id=assistant_id)

@app.route('/cat', methods=['POST'])
def submit():
    user_prompt = request.json['user_prompt']  # Get JSON data from the request
    response = assistant.assistant_message(client=client, assistant=cat_assistant, thread=thread, user_prompt=user_prompt)
    if response['status'] == "completed":
        return jsonify(response), 201
    else:
        return jsonify(response), 400

if __name__ == '__main__':
    # Create a new thread for conversation
    thread = client.beta.threads.create()
    app.run(debug=True)