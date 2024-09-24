// API configuration
const API_KEY = "AIzaSyBc2sLWJ8HL-Hs5Y6-5fZ8QVetKOvn_4NQ"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;



const typing_form = document.querySelector('.typing_form');

const chat_list = document.querySelector('.chat_list');


const showTypingEffect = (text, textElement) => {

    const words = text.split(' ');
    let currentWordIndex = 0;
    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex == 0 ? '' : ' ') + words[currentWordIndex++];
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
        }
        window.scrollTo(0, chat_list.scrollHeight);
    }, 75);
}



const generateAPIResponse = async (div) => {
    const textElement = div.querySelector('.text');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { "content-Type": 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: userMessage }]
                }]
            })
        })

        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        showTypingEffect(apiResponse, textElement);

    } catch (error) {
        console.error(error);
    }

    finally {
        div.classList.remove('loading');
    }

}


const copyMessage = (copy_btn) => {
    const messageText = copy_btn.parentElement.querySelector('.text').innerText;
    navigator.clipboard.writeText(messageText);
    copy_btn.innerText = 'done';

    setTimeout(() => copy_btn.innerText = 'content_copy', 1000);
}


const showLoading = () => {
    const html = `<div class="message_content">
                        <img src="images/gemini.svg" alt="">
                        <p class="text"></p>
                        <div class="loading_indicator">
                            <div class="loading_Bar"></div>
                            <div class="loading_Bar"></div>
                            <div class="loading_Bar"></div>
                        </div>
                    </div>
                    <span onClick='copyMessage(this)' class="material-symbols-outlined">
                        content_copy
                    </span>`



    const div = document.createElement('div');

    div.classList.add('message', 'incoming', 'loading');

    div.innerHTML = html;

    chat_list.appendChild(div);

    window.scrollTo(0, chat_list.scrollHeight);

    generateAPIResponse(div);
}





const handleOutGoingChat = () => {
    userMessage = document.querySelector('.typing_input').value;

    if (!userMessage) return

    const html = `  
    <div class="message_content">
         <img src="images/use1.jfif" alt="">
         <p class="text"></p>          
    </div>`

    const div = document.createElement('div');

    div.classList.add('message', 'outgoing');

    div.innerHTML = html;

    div.querySelector('.text').innerHTML = userMessage;

    chat_list.appendChild(div);

    typing_form.reset();

    window.scrollTo(0, chat_list.scrollHeight);

    setTimeout(showLoading, 500);

}




typing_form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleOutGoingChat();
})