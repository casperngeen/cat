import { createAppSlice } from '../hook';
import { BACKEND_URL } from '../../utils';

interface IInitialState {
    isDisabled: boolean,
    errorMessage: string | null,
    chatHistory: IChatRecord[],
}

interface IResponse {
    status: string,
    message: string,
}

export enum Role {
    Assistant = 'ASSISTANT', 
    User = 'USER',
}

export interface IChatRecord {
    role: Role,
    message: string
}

const initialState: IInitialState = {
  isDisabled: true,
  errorMessage: null,
  chatHistory: [],
};

const inputSlice = createAppSlice({
  name: 'input', // name of the slice (also used in actions)
  initialState,
  reducers: (create) => ({
    disableButton: create.reducer((state) => {
        state.isDisabled = true
    }),
    enableButton: create.reducer((state) => {
        state.isDisabled = false
    }),
    submitUserInput: create.asyncThunk.withTypes<{
        rejectValue: { message: string };
      }>()(
        async (userInput: string, thunkAPI) => {
            const response: IResponse = await fetch(BACKEND_URL + "/cat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_prompt: userInput,
                }),
            })
                .then((response) => response.json())
            if (response.status !== "completed") {
                return thunkAPI.rejectWithValue({
                    message: response.status,
                });
            }
            return response.message;
        },
        {
          pending: (state, action) => {
            state.chatHistory.push({
                role: Role.User,
                message: action.meta.arg,
            })
            state.isDisabled = true;
          },
          rejected: (state, action) => {
            if (action.payload) {
                state.errorMessage = action.payload.message;
            }
          },
          fulfilled: (state, action) => {
            state.chatHistory.push({
                role: Role.Assistant,
                message: action.payload,
            })
          },
          settled: (state) => {
            state.isDisabled = false;
          },
        },
      ),
  }),
  selectors: {
    selectDisabledStatus: (state) => state.isDisabled,
    selectErrorMessage: (state) => state.errorMessage,
    selectChatHistory: (state) => state.chatHistory,
  }
});

export const { disableButton, enableButton, submitUserInput } = inputSlice.actions;

export const {
    selectChatHistory, selectDisabledStatus, selectErrorMessage
} = inputSlice.selectors;

export default inputSlice;