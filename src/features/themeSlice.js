import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            const theme = state.theme === "light" ? "dark" : "light";
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", theme);
                if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
            state.theme = theme;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        loadTheme: (state) => {
            if (typeof window !== "undefined") {
                const theme = localStorage.getItem("theme");
                if (theme) {
                    state.theme = theme;
                    if (theme === "dark") {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                }
            }
        },
    },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;
