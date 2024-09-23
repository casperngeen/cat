import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import {
    disableButton,
    enableButton,
    selectDisabledStatus,
    submitUserInput,
} from "../../redux/slices/input.slicer";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import "./input.css";

const Input: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const arrowDisabled = selector(selectDisabledStatus);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        if (inputValue === "") {
            dispatch(disableButton());
        } else {
            dispatch(enableButton());
        }
    };

    const submitInput = async () => {
        const userInput = inputValue;
        setInputValue("");
        await dispatch(submitUserInput(userInput));
    };

    return (
        <div className="input">
            <input
                className="input-box"
                type="text"
                id="input-box"
                value={inputValue}
                onChange={handleChange}
                placeholder="Describe your ideal cat"
            />
            <button disabled={arrowDisabled} onClick={submitInput}>
                <FaArrowUp />
            </button>
        </div>
    );
};

export default Input;
