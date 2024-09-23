export const BACKEND_URL = "http://127.0.0.1:5000"

export const extractUrl = (message: string) => {
    const regex = /\((https?:\/\/[^\s)]+)\)/;
    const match = message.match(regex);

    if (match && match[1]) {
        return match[1];
    }
    return null;
}

export const extractNonUrlText = (input: string) => {
    // Regular expression to match the Markdown image syntax `![Alt Text](URL)`
    const regex = /!\[.*?\]\(.*?\)/g;
  
    // Replace any matches with an empty string, leaving only the non-URL part
    const result = input.replace(regex, '').trim();
  
    return result;
}