const signInbtn = document.querySelector("#signIn-button");
const signUpbtn = document.querySelector("#signUp-button");
const container = document.querySelector(".containerS");

signUpbtn.addEventListener("click", () => {
    container.classList.add("signUp-mode");
});

signInbtn.addEventListener("click", () => {
    container.classList.remove("signUp-mode");
});